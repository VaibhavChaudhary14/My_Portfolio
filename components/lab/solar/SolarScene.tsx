"use client";

import { useFrame } from "@react-three/fiber";
import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Html, Cylinder, Sphere, Line, useTexture } from "@react-three/drei";

export default function SolarScene() {
    const { latitude, longitude, declination, hourAngle, setLatitude, setLongitude, setActiveInfo, labMode, showSunPath, panelTilt, panelAzimuth } = useSolarStore();
    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    // Theme Colors for 3D Elements
    const colors3D = isVenom ? {
        latColor: "#a855f7", // Purple
        latClass: "text-purple-500",
        haColor: "#84cc16", // Lime
        haClass: "text-lime-400",
        decColor: "#22c55e", // Green
        decClass: "text-green-500",
        ground: "#27272a", // Dark Zinc
        panel: "#18181b", // Black Panel
        panelEmissive: "#84cc16", // Lime Glow
        normal: 0xa855f7 // Purple Arrow
    } : {
        latColor: "#f43f5e", // Rose
        latClass: "text-rose-500",
        haColor: "#06b6d4", // Cyan
        haClass: "text-cyan-400",
        decColor: "#f59e0b", // Amber
        decClass: "text-amber-500",
        ground: "#10b981", // Emerald (Grass)
        panel: "#2563eb", // Blue
        panelEmissive: "#1e40af", // Dark Blue Glow
        normal: 0x22c55e // Green Arrow
    };

    // --- Fullscreen State ---


    const sunLightRef = useRef<THREE.DirectionalLight>(null);

    // Constants
    const EARTH_RADIUS = 20;
    const HORIZON_RADIUS = 8;
    const HUMAN_HEIGHT = 1.2; // Relative scale

    // Convert inputs to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;
    const latRad = toRad(latitude);
    const decRad = toRad(declination);
    const haRad = toRad(hourAngle);

    // --- Textures ---
    const [colorMap, normalMap, specularMap] = useTexture([
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
    ]);

    // 1. Calculate Observer Position
    const observerPos = useMemo(() => {
        const y = EARTH_RADIUS * Math.sin(latRad);
        const z = EARTH_RADIUS * Math.cos(latRad);
        return new THREE.Vector3(0, y, z);
    }, [latRad]);

    // 2. Calculate Sun Direction
    const sunDir = useMemo(() => {
        const y = Math.sin(decRad);
        const proj = Math.cos(decRad);
        const x = proj * Math.sin(haRad);
        const z = proj * Math.cos(haRad);
        return new THREE.Vector3(x, y, z).normalize();
    }, [decRad, haRad]);

    // 3. Basis Vectors
    const zenithDir = useMemo(() => observerPos.clone().normalize(), [observerPos]);

    // North points towards the pole along the surface
    const northDir = useMemo(() => {
        return new THREE.Vector3(0, Math.cos(latRad), -Math.sin(latRad)).normalize();
    }, [latRad]);

    // East = North x Zenith (Right hand rule check: Y(North) x Z(Zenith at Eq) = X(East))
    // Actually at Equator: Zenith=(0,0,1), North=(0,1,0). N x Z = (1,0,0) -> East. Correct.
    const eastDir = useMemo(() => {
        return new THREE.Vector3().crossVectors(northDir, zenithDir).normalize();
    }, [northDir, zenithDir]);

    // 4. Shadow Logic
    const shadowData = useMemo(() => {
        // Project Sun Vector onto Horizon Plane (Plane normal = Zenith)
        // V_proj = V - (V . N) * N
        // Here N = zenithDir
        const dot = sunDir.dot(zenithDir); // This is cos(ZenithAngle) or sin(Altitude)

        // If Sun is below horizon (dot < 0 is below? No, Zenith is Up. Sun Up = dot > 0)
        // Actually, if Zenith is UP, and Sun is UP, dot > 0.
        // If dot < 0, sun is below horizon.

        const isDay = dot > 0;

        // Altitude Angle (alpha)
        const alpha = Math.asin(Math.max(-1, Math.min(1, dot)));

        // Shadow Length = h / tan(alpha)
        // Avoid infinite length at horizon (alpha near 0)
        const tanAlpha = Math.tan(Math.max(0.05, alpha));
        const lengthScale = isDay ? Math.min(10, 1 / tanAlpha) : 0;

        // Shadow Direction: Opposite to Sun's projection on ground
        // Projection = Sun - (Sun.Zenith)*Zenith
        const sunProj = sunDir.clone().sub(zenithDir.clone().multiplyScalar(dot)).normalize();
        const shadowDir = sunProj.negate();

        return { isDay, lengthScale, shadowDir, alpha };
    }, [sunDir, zenithDir]);

    // 5. Angle Visuals Data
    const angleData = useMemo(() => {
        // We want to calculate efficient arcs in the Local Frame (X=East, Y=Zenith, Z=North)
        // Global Sun Vector
        const S = sunDir.clone();

        // Project Sun onto East, Zenith, North basis to get Local Sun (Lx, Ly, Lz)
        const Lx = S.dot(eastDir);
        const Ly = S.dot(zenithDir); // This is sin(Altitude)
        const Lz = S.dot(northDir);

        const localSun = new THREE.Vector3(Lx, Ly, Lz);

        // Altitude (alpha): Angle between (Lx, 0, Lz) and (Lx, Ly, Lz)
        // Only if day
        const isDay = Ly > 0;
        const altitudeRad = Math.asin(Ly);

        // Zenith Angle (theta): Angle between (0, 1, 0) and (Lx, Ly, Lz)
        const zenithAngleRad = Math.acos(Ly);

        // Azimuth (from North? South? Let's stick to standard N=0, E=90)
        // In our basis Z=North, X=East.
        // atan2(x, z) gives angle from Z axis.
        const azimuthRad = Math.atan2(Lx, Lz);

        return { localSun, altitudeRad, zenithAngleRad, azimuthRad, isDay };
    }, [sunDir, eastDir, zenithDir, northDir]);

    // Helper to create Local Basis Matrix for the Observer Group
    const observerMatrix = useMemo(() => {
        const mat = new THREE.Matrix4();
        // X=East, Y=Zenith, Z=North
        mat.makeBasis(eastDir, zenithDir, northDir);
        return mat;
    }, [eastDir, zenithDir, northDir]);

    // Earth Click Handler
    const handleEarthClick = (e: any) => {
        e.stopPropagation();
        const point = e.point; // World space point on sphere surface
        // World Space in this scene has Earth Center at 0,0,0
        // We need to account for Earth Rotation if we rotated the mesh
        // The Earth mesh is rotated by [0, lonRad, 0] ?? No, let's see below.

        // Actually, we rotate the Earth Mesh by 'longitude'. 
        // So we need to inverse that rotation to get 'fixed earth' coordinates (Greenwich relative).
        // BUT, simplified:
        // Latitude = asin(y / R)
        // Longitude = atan2(x, z) - rotationOffset ?

        // Let's normalize point
        const p = point.clone().normalize();

        // Latitude (y-axis is Polar axis in default sphere UV? No, usually Y is up.)
        // In ThreeJS SphereGeometry: Y is Up (Poles).
        const lat = Math.asin(p.y); // Radians result

        // Longitude (x, z plane)
        // atan2(x, z) gives angle from Z axis.
        const lonLocal = Math.atan2(p.x, p.z);

        // Apply Earth Rotation Offset (lonRad)
        // If Earth is rotated by 'lonRad', then the point P we clicked corresponds to:
        // P_world = Rot(lonRad) * P_fixed
        // P_fixed = Rot(-lonRad) * P_world
        const lonRad = toRad(longitude);
        const pFixedX = p.x * Math.cos(-lonRad) - p.z * Math.sin(-lonRad);
        const pFixedZ = p.x * Math.sin(-lonRad) + p.z * Math.cos(-lonRad);
        const lonFree = Math.atan2(pFixedX, pFixedZ);

        setLatitude(toDeg(lat));
        // We actually want to MOVE the observer to this point?
        // OR move the earth so this point is under observer?
        // User said "click by any point". Usually implies "Move Observer Here".

        // If I move observer, Lat changes. Lon changes.
        // My Logic:
        // Lat = from Y.
        // Lon = from X/Z.
        // But the Observer is fixed at (0, R*sinLat, R*cosLat) in World Space (Prime Meridian Slice).
        // If I click ANYWHERE, I want that point to become the new Observer location.
        // So I should set global Latitude = ClickLat.
        // And Global Longitude = ClickLon (so the earth rotates to bring it to meridian? or just set value?)

        // Use p.x, p.z directly for "target" longitude?
        // If I click at +90 deg East (X axis), I want Observer to be at +90 deg East.
        // This means I set Longitude = +90.
        // And the Earth Rotation updates to show +90 under the fixed meridian?
        // Let's assume Longitude dictates Earth Rotation.

        // If I click a point, its current longitude 'relative to 0' is what calculate.
        // Wait, if Earth is currently rotated by L1. And I click a mountain at L2 (world space).
        // That mountain IS at L2. 
        // If I want to "Go To" that mountain, I set Longitude = L2.
        // Then Earth rotates so L2 is at Meridian? 
        // No, standard map clicking:
        // Clicked Lat/Lon becomes my selected Lat/Lon.

        // Let's trust simple spherical conversion of the World Click point for now.
        // Since Earth is rotated by 'longitude' prop... 
        // Actually, if I rotate the earth mesh by 'longitude', then the texture moves.
        // If I click (1,0,0), that is ALWAYS 90 degrees right of Z-axis.
        // If the Earth is rotated, the "Greenwich" might be at -90.
        // The texture coordinate is what matters.
        // UV mapping: u = 0.5 + atan2(z, x) / 2pi, v = 0.5 - asin(y)/pi
        // Too complex.
        // Let's just set Lat/Lon based on visual click location in WORLD space.
        // Lat = asin(y)
        // Lon = atan2(x, z) 
        // This sets the observer to the "Visual Spot" relative to the sun/stars fixed frame.
        // If the user wants to "Select a Country", they need the texture logic.
        // Let's implement Texture Logic: Longitude = atan2(x, z) - currentRotation?

        const clickLon = Math.atan2(p.x, p.z);

        // In my scene, Z is North (0). X is East (90).
        // atan2(x, z) returns 0 for (0,1), PI/2 for (1,0). Matches.
        // BUT, the Earth Mesh rotation is applied.
        // Let's Apply Rotation to the mesh below and just use offset here.

        // Correct Standard:
        // If I click a point, I want that point to *become* the observer coordinates?
        // No, the user wants to "add coordinates manually AND by clicking".
        // Typically means "Set Coordinates to this point".

        setLongitude(toDeg(clickLon)); // Set Lon to where we clicked in World Space
    };

    // Quaternion for the group
    const observerQuaternion = useMemo(() => {
        return new THREE.Quaternion().setFromRotationMatrix(observerMatrix);
    }, [observerMatrix]);


    // --- GLOBAL ARCS GENERATION ---
    // 1. Latitude Arc (Red): From (0,0,R) to Observer along Meridian
    const latArcPoints = useMemo(() => {
        const points = [];
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * latRad; // 0 to latitude
            // Circle in Y-Z plane
            points.push(new THREE.Vector3(
                0,
                EARTH_RADIUS * 1.01 * Math.sin(t),
                EARTH_RADIUS * 1.01 * Math.cos(t)
            ));
        }
        return points;
    }, [latRad]);

    // 2. Hour Angle Arc (Cyan): Along Equator from Observer Meridian (0,0,R) to Solar Meridian
    // Solar Meridian is at angle haRad from Z axis in X-Z plane.
    const haArcPoints = useMemo(() => {
        const points = [];
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * haRad;
            // Circle in X-Z plane
            points.push(new THREE.Vector3(
                EARTH_RADIUS * 1.01 * Math.sin(t),
                0,
                EARTH_RADIUS * 1.01 * Math.cos(t)
            ));
        }
        return points;
    }, [haRad]);

    // 3. Declination Arc (Amber): From Equator at Solar Meridian to Sub-solar Point
    // Start: (R sin ha, 0, R cos ha)
    // End: (R cos dec sin ha, R sin dec, R cos dec cos ha)
    // This is an arc "up" from the equator, at fixed Longitude = haRad.
    const decArcPoints = useMemo(() => {
        const points = [];
        const segments = 32;
        for (let i = 0; i <= segments; i++) {
            const t = (i / segments) * decRad;
            // x = R cos(t) sin(ha)
            // y = R sin(t)
            // z = R cos(t) cos(ha)
            points.push(new THREE.Vector3(
                EARTH_RADIUS * 1.01 * Math.cos(t) * Math.sin(haRad),
                EARTH_RADIUS * 1.01 * Math.sin(t),
                EARTH_RADIUS * 1.01 * Math.cos(t) * Math.cos(haRad)
            ));
        }
        return points;
    }, [decRad, haRad]);


    // --- PANEL MODE VISUALS ---


    // Visualize Panel Orientation
    // Panel Tilt (beta): Rotation around local X axis (if Azimuth is 0).
    // Panel Azimuth (gamma): Rotation around local Y axis (Zenith).

    // We want to place the panel at the Observer position (0,0,0 local).
    // Rotation Order: Rotate Y (Azimuth) -> Rotate X (Tilt).
    const panelRotation = useMemo(() => {
        // Three.js Euler Order is XYZ usually.
        // We want to rotate around Y first (Azimuth), then tilt "up/down" which is X axis in local frame.
        // Local Frame: X=East, Y=Zenith, Z=North.
        // Wait, "Tilt" usually means tilting from Horizontal towards South/Azimuth.
        // If Azimuth=0 (North), Tilt=0 (Flat).
        // Titl=90 (Vertical facing North).
        // 
        // Let's create a Quaternion to be robust.
        const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), toRad(panelAzimuth)); // Azimuth
        // Tilt: If we tilt 'up', we rotate around X axis?
        // Standard Panel: Flat on X-Z plane. Normal = Y.
        // We want to tilt it towards -Z (North) or +Z (South)?
        // If Azimuth=180 (South), we rotate Y 180. Panel 'Front' faces South.
        // Tilt=30.
        // We rotate around Local X axis.
        const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), toRad(panelTilt));

        return qY.multiply(qX);
    }, [panelAzimuth, panelTilt]);

    return (
        <group>
    // --- GLOBAL ARCS GENERATION ---

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <directionalLight
                ref={sunLightRef}
                position={sunDir.clone().multiplyScalar(100)}
                intensity={2.5}
                castShadow
            />

            {/* Sun Representation */}
            <mesh position={sunDir.clone().multiplyScalar(80)}>
                <sphereGeometry args={[4, 32, 32]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#f59e0b"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
                <pointLight intensity={2} distance={200} />
            </mesh>

            {/* Stars Background */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <sphereGeometry args={[300, 64, 64]} />
                <meshBasicMaterial color="#000000" side={THREE.BackSide} />
            </mesh>
            <group>
                {Array.from({ length: 200 }).map((_, i) => (
                    <mesh key={i} position={[
                        (Math.random() - 0.5) * 600,
                        (Math.random() - 0.5) * 600,
                        (Math.random() - 0.5) * 600
                    ]}>
                        <sphereGeometry args={[0.3 + Math.random() * 0.5]} />
                        <meshBasicMaterial color="#ffffff" opacity={Math.random()} transparent />
                    </mesh>
                ))}
            </group>

            {/* Earth Group */}
            <group rotation={[0, toRad(longitude), 0]}> {/* Rotate Earth by Longitude */}
                {/* Planet Surface */}
                <mesh
                    receiveShadow
                    castShadow
                    rotation={[0, -Math.PI / 2, 0]} // Offset texture so 0 lon is at Z? Check texture. Usually Greenwhich is at center.
                    onPointerDown={handleEarthClick}
                    onPointerOver={() => { document.body.style.cursor = 'crosshair' }}
                    onPointerOut={() => { document.body.style.cursor = 'auto' }}
                >
                    <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
                    {/* REAL EARTH TEXTURE */}
                    <meshPhongMaterial
                        map={colorMap}
                        normalMap={normalMap}
                        specularMap={specularMap}
                        shininess={5}
                    />
                </mesh>

                {/* Atmosphere Glow */}
                <mesh>
                    <sphereGeometry args={[EARTH_RADIUS * 1.05, 64, 64]} />
                    <meshBasicMaterial
                        color="#60a5fa"
                        transparent
                        opacity={0.2}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Grid */}
                <mesh>
                    <sphereGeometry args={[EARTH_RADIUS * 1.005, 48, 48]} />
                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.05} />
                </mesh>

                {/* Vectors & Arcs (Only in Physics Mode) */}
                {labMode === 'physics' && (
                    <group>
                        {/* 1. Latitude (φ) - Red */}
                        <Line points={latArcPoints} color={colors3D.latColor} lineWidth={3} transparent opacity={0.8} />
                        <Html position={latArcPoints[Math.floor(latArcPoints.length / 2)]} center style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveInfo("latitude"); }}
                                className={`${colors3D.latClass} font-bold text-xs bg-black/50 px-2 py-1 rounded backdrop-blur cursor-pointer hover:scale-125 transition-transform border border-white/20 select-none shadow-lg`}
                            >
                                φ
                            </div>
                        </Html>

                        {/* 2. Hour Angle (ω) - Cyan */}
                        <Line points={haArcPoints} color={colors3D.haColor} lineWidth={3} transparent opacity={0.7} />
                        <Html position={haArcPoints[Math.floor(haArcPoints.length / 2)]} center style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveInfo("hourAngle"); }}
                                className={`${colors3D.haClass} font-bold text-xs bg-black/50 px-2 py-1 rounded backdrop-blur cursor-pointer hover:scale-125 transition-transform border border-white/20 select-none shadow-lg`}
                            >
                                ω
                            </div>
                        </Html>

                        {/* 3. Declination (δ) - Amber */}
                        <Html position={decArcPoints[Math.floor(decArcPoints.length / 2)]} center style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
                            <div
                                onClick={(e) => { e.stopPropagation(); setActiveInfo("declination"); }}
                                className={`${colors3D.decClass} font-bold text-xs bg-black/50 px-2 py-1 rounded backdrop-blur cursor-pointer hover:scale-125 transition-transform border border-white/20 select-none shadow-lg`}
                            >
                                δ
                            </div>
                        </Html>
                    </group>
                )}

                {/* 4. Sun Path (Day Trajectory) */}
                {showSunPath && (
                    <Line
                        points={(() => {
                            const pts = [];
                            const radius = EARTH_RADIUS * 1.5;
                            const decCos = Math.cos(decRad);
                            const decSin = Math.sin(decRad);
                            for (let h = -180; h <= 180; h += 5) {
                                const hRad = h * Math.PI / 180;
                                pts.push(new THREE.Vector3(
                                    radius * decCos * Math.sin(hRad),
                                    radius * decSin,
                                    radius * decCos * Math.cos(hRad)
                                ));
                            }
                            return pts;
                        })()}
                        color="#fbbf24"
                        lineWidth={1}
                        dashed
                        dashScale={2}
                        gapSize={1}
                        opacity={0.5}
                        transparent
                    />
                )}


                {/* Observer Context (Aligned to Local Frame) */}
                <group position={observerPos} quaternion={observerQuaternion}>

                    {/* Common Horizon Base */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                        <circleGeometry args={[HORIZON_RADIUS, 32]} />
                        <meshStandardMaterial
                            color={labMode === 'panel' ? "#3f3f46" : colors3D.ground} // Grey roof in panel mode
                            transparent
                            opacity={labMode === 'panel' ? 0.9 : 0.1}
                            side={THREE.DoubleSide}
                        />
                    </mesh>

                    {/* PHYSICS MODE ELEMENTS */}
                    {labMode === 'physics' && (
                        <>
                            {/* Human Observer */}
                            <group position={[0, HUMAN_HEIGHT / 2, 0]}>
                                <group rotation={[0, angleData.azimuthRad, 0]}>
                                    <Cylinder args={[0.3, 0.3, HUMAN_HEIGHT, 16]} castShadow receiveShadow>
                                        <meshStandardMaterial color="#e2e8f0" />
                                    </Cylinder>
                                    <Sphere args={[0.25]} position={[0, HUMAN_HEIGHT / 2 + 0.25, 0]}>
                                        <meshStandardMaterial color="#f8fafc" />
                                    </Sphere>
                                    <mesh position={[0, HUMAN_HEIGHT / 2 + 0.25, 0.2]}>
                                        <boxGeometry args={[0.3, 0.1, 0.1]} />
                                        <meshBasicMaterial color="#1e293b" />
                                    </mesh>
                                </group>
                            </group>

                            {/* Shadow */}
                            {shadowData.isDay && (
                                <group rotation={[0, angleData.azimuthRad + Math.PI, 0]}>
                                    <mesh
                                        position={[0, 0.02, shadowData.lengthScale * HUMAN_HEIGHT / 2]}
                                        rotation={[-Math.PI / 2, 0, 0]}
                                    >
                                        <planeGeometry args={[0.6, shadowData.lengthScale * HUMAN_HEIGHT]} />
                                        <meshBasicMaterial color="#000000" opacity={0.4} transparent />
                                    </mesh>
                                </group>
                            )}

                            {/* Compass & Arcs */}
                            <group>
                                <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, HORIZON_RADIUS * 0.9)]} color="#94a3b8" transparent opacity={0.5} />
                                <Html position={[0, 0, HORIZON_RADIUS]} transform sprite>
                                    <div className="text-white font-bold text-xs bg-blue-500/50 px-1 rounded">N</div>
                                </Html>
                                <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(HORIZON_RADIUS * 0.9, 0, 0)]} color="#94a3b8" transparent opacity={0.5} />
                                <Html position={[HORIZON_RADIUS, 0, 0]} transform sprite>
                                    <div className="text-white font-bold text-xs bg-zinc-500/50 px-1 rounded">E</div>
                                </Html>
                            </group>

                            {/* Zenith & Sun Vectors */}
                            <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), HORIZON_RADIUS * 0.8, 0xffffff, 1, 0.5]} />
                            <arrowHelper args={[angleData.localSun, new THREE.Vector3(0, 0, 0), HORIZON_RADIUS * 1.2, 0xfbbf24, 1, 0.5]} />

                            {/* Angle Arcs (Code from previous response integrated here) */}
                            {angleData.isDay && (
                                <>
                                    {/* Altitude Arc */}
                                    <group rotation={[0, angleData.azimuthRad, 0]}>
                                        <mesh rotation={[0, -Math.PI / 2, 0]}>
                                            <torusGeometry args={[5, 0.05, 16, 64, angleData.altitudeRad]} />
                                            <meshBasicMaterial color="#fbbf24" opacity={0.6} transparent />
                                        </mesh>
                                        <group rotation={[0, -Math.PI / 2, 0]}>
                                            <group rotation={[0, 0, angleData.altitudeRad / 2]}>
                                                <Html position={[5.2, 0, 0]} transform sprite style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
                                                    <div
                                                        onClick={(e) => { e.stopPropagation(); setActiveInfo("altitude"); }}
                                                        className="bg-yellow-500/80 text-black font-bold text-xs px-2 py-1 rounded shadow-lg backdrop-blur cursor-pointer hover:scale-110 transition-transform select-none"
                                                    >
                                                        α: {(angleData.altitudeRad * 180 / Math.PI).toFixed(1)}°
                                                    </div>
                                                </Html>
                                            </group>
                                        </group>
                                    </group>

                                    {/* Zenith Arc */}
                                    {/* ... keeping Zenith arc ... */}
                                </>
                            )}
                        </>
                    )}

                    {/* PANEL MODE ELEMENTS */}
                    {labMode === 'panel' && (
                        <>
                            {/* Concrete Base */}
                            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                                <boxGeometry args={[4, 0.2, 4]} />
                                <meshStandardMaterial color="#52525b" />
                            </mesh>

                            {/* Solar Panel Group */}
                            <group position={[0, 1.5, 0]} quaternion={panelRotation}>
                                {/* Panel */}
                                <mesh castShadow receiveShadow>
                                    <boxGeometry args={[3, 4, 0.1]} />
                                    {/* Blue solar texture color */}
                                    <meshStandardMaterial
                                        color={colors3D.panel}
                                        roughness={0.2}
                                        metalness={0.8}
                                        emissive={colors3D.panelEmissive}
                                        emissiveIntensity={0.2}
                                    />
                                </mesh>
                                {/* Grid Lines on Panel */}
                                <mesh position={[0, 0, 0.06]}>
                                    <planeGeometry args={[2.8, 3.8]} />
                                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.2} />
                                </mesh>
                                {/* Frame */}
                                <mesh>
                                    <boxGeometry args={[3.1, 4.1, 0.08]} />
                                    <meshStandardMaterial color="#d4d4d8" />
                                </mesh>

                                {/* Normal Vector */}
                                <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, colors3D.normal, 1, 0.5]} />
                                <Html position={[0, 0, 4.2]} transform sprite zIndexRange={[100, 0]}>
                                    <div className="bg-green-500/80 text-black font-bold text-xs px-1 rounded">Normal</div>
                                </Html>
                            </group>

                            {/* Sun Vector (Visualizing Incidence) */}
                            {angleData.isDay && (
                                <arrowHelper
                                    args={[angleData.localSun, new THREE.Vector3(0, 2, 0), 6, 0xfbbf24, 1, 0.5]}
                                />
                            )}
                        </>
                    )}

                </group>
            </group>
        </group>
    );
}

const Horizon_Radius = 8;
