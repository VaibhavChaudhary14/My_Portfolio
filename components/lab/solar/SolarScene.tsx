"use client";

import { useFrame } from "@react-three/fiber";
import { useSolarStore } from "@/store/useSolarStore";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Html, Cylinder, Sphere, Line, useTexture } from "@react-three/drei";

export default function SolarScene() {
    const { latitude, declination, hourAngle } = useSolarStore();

    // --- Fullscreen State ---


    const sunLightRef = useRef<THREE.DirectionalLight>(null);

    // Constants
    const EARTH_RADIUS = 20;
    const HORIZON_RADIUS = 8;
    const HUMAN_HEIGHT = 1.2; // Relative scale

    // Convert inputs to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;
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
    const { labMode, panelTilt, panelAzimuth } = useSolarStore();

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
            <group>
                {/* Planet Surface */}
                <mesh receiveShadow castShadow rotation={[0, 0, 0]}>
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
                        <Line points={latArcPoints} color="#f43f5e" lineWidth={3} transparent opacity={0.8} />
                        <Html position={latArcPoints[Math.floor(latArcPoints.length / 2)]} center>
                            <div className="text-rose-500 font-bold text-xs bg-black/50 px-1 rounded backdrop-blur">φ</div>
                        </Html>

                        {/* 2. Hour Angle (ω) - Cyan */}
                        <Line points={haArcPoints} color="#06b6d4" lineWidth={3} transparent opacity={0.7} />
                        <Html position={haArcPoints[Math.floor(haArcPoints.length / 2)]} center>
                            <div className="text-cyan-400 font-bold text-xs bg-black/50 px-1 rounded backdrop-blur">ω</div>
                        </Html>

                        {/* 3. Declination (δ) - Amber */}
                        <Line points={decArcPoints} color="#f59e0b" lineWidth={3} transparent opacity={0.8} />
                        <Html position={decArcPoints[Math.floor(decArcPoints.length / 2)]} center>
                            <div className="text-amber-500 font-bold text-xs bg-black/50 px-1 rounded backdrop-blur">δ</div>
                        </Html>
                    </group>
                )}


                {/* Observer Context (Aligned to Local Frame) */}
                <group position={observerPos} quaternion={observerQuaternion}>

                    {/* Common Horizon Base */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                        <circleGeometry args={[HORIZON_RADIUS, 32]} />
                        <meshStandardMaterial
                            color={labMode === 'panel' ? "#3f3f46" : "#10b981"} // Grey roof in panel mode
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
                                                <Html position={[5.2, 0, 0]} transform sprite>
                                                    <div className="bg-yellow-500/80 text-black font-bold text-xs px-1 rounded shadow-lg backdrop-blur">
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
                                        color="#2563eb"
                                        roughness={0.2}
                                        metalness={0.8}
                                        emissive="#1e40af"
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
                                <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 4, 0x00ff00, 1, 0.5]} />
                                <Html position={[0, 0, 4.2]} transform sprite>
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
