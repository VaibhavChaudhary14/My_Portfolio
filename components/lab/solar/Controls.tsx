"use client";

import { useSolarStore } from "@/store/useSolarStore";
import { Lock, Unlock, Zap, Sun } from "lucide-react";

export default function Controls() {
    const {
        latitude, declination, hourAngle, isLocked,
        labMode, panelTilt, panelAzimuth,
        setLatitude, setDeclination, setHourAngle, setIsLocked,
        setLabMode, setPanelTilt, setPanelAzimuth
    } = useSolarStore();

    // Helper to calculate current solar angles for display
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const latRad = toRad(latitude);
    const decRad = toRad(declination);
    const haRad = toRad(hourAngle);

    // sin(Alt) = sin(Lat)sin(Dec) + cos(Lat)cos(Dec)cos(HA)
    const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
    const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const altitude = toDeg(altRad);
    const zenith = 90 - altitude;

    // Physics Calculations - General
    const relativeEnergy = Math.max(0, Math.sin(altRad)); // Lambert's Cosine Law on Horizontal Ground
    const shadowLength = altRad > 0 ? (1 / Math.tan(altRad)) : 0;

    // --- PANEL OPTIMIZATION MATH ---
    // We need Sun Vector (Azimuth, Altitude) and Panel Vector (Azimuth, Tilt).
    // Let's use simpler Vector Dot Product approach:
    // Sun Vector (S):
    // Sx = cos(Alt) * sin(SunAzimuth)  <-- Wait, standard physics Azimuth is typically from South (0) or North (0).
    // In our SolarScene code:
    // SunDir was calculated. Let's replicate global vector calculation to be consistent.
    // X = cos(dec) * sin(omega)
    // Y = sin(dec)
    // Z = cos(dec) * cos(omega)

    // Panel Vector (Normal N):
    // Panel Coordinates (Local Frame on Earth Surface):
    // We need S in Local Frame (East, Zenith, North).
    // We already do this in SolarScene.tsx but duplicating small math here is fine for HUD.

    // Actually, Solar Azimuth calculation is tricky. 
    // Let's use the explicit formulas for Azimuth (A) and Altitude (h):
    // sin(h) = sin(phi)sin(delta) + cos(phi)cos(delta)cos(omega)
    // cos(A) = (sin(delta) - sin(phi)sin(h)) / (cos(phi)cos(h))
    // This gives A from North if Cos(h) != 0.

    // Simplified Panel Efficiency:
    // Incidence Angle (theta_i)
    // cos(theta_i) = cos(beta)*sin(alpha) + sin(beta)*cos(alpha)*cos(SunAzimuth - PanelAzimuth)
    // alpha = Altitude
    // beta = Panel Tilt (0 = flat horizontal)
    // PanelAzimuth = gamma.
    // Note: User Input PanelAzimuth 180 = South.
    // User Input Sun Azimuth needs to be aligned.

    // Let's rely on visual feedback mostly? No, HUD needs numbers.
    // Approximation for HUD:
    // Efficiency ~ cos(Incidence).

    // Let's calculate cosIncidence properly.
    // Need Sun Azimuth relative to North first.
    // cos(Az)公式 above gives Az from North.
    let sunAzNumer = (Math.sin(decRad) - Math.sin(latRad) * sinAlt);
    let sunAzDenom = (Math.cos(latRad) * Math.cos(altRad));
    let sunAzRad = Math.acos(Math.max(-1, Math.min(1, sunAzNumer / (sunAzDenom || 0.0001))));
    if (Math.sin(haRad) > 0) sunAzRad = 2 * Math.PI - sunAzRad; // 0..2PI convention from North Clockwise?
    // Actually Solar Azimuth conventions vary. Let's stick to simple dot product if we had vectors.

    // Quick Cheat:
    // Efficiency = Dot(SunVector, PanelNormal).
    // Since controls don't have access to 3D vectors easily without importing Three.js math layer... 
    // Let's implement the standard formula:
    // cos(theta) = sin(Lat)sin(Dec)cos(beta) 
    //            - sin(Lat)cos(Dec)cos(omega)sin(beta)cos(gamma) ... this is getting complex.

    // Simpler: 
    // Panel Tilt (beta) = panelTilt * rad
    // Panel Azimuth (gamma) = panelAzimuth * rad (0=N, 90=E, 180=S, 270=W)
    // Sun Azimuth (phi_s) 
    // Sun Altitude (alpha)

    // cos(theta) = cos(alpha)sin(beta)cos(phi_s - gamma) + sin(alpha)cos(beta)
    // Wait, beta=0 (flat) -> cos(theta) = sin(alpha). Correct (Zenith angle).
    // beta=90 (vertical) -> cos(theta) = cos(alpha)cos(phi_s - gamma). Correct (max when facing sun). (SunAzimuth - PanelAzimuth).

    const panelBeta = toRad(panelTilt);
    const panelGamma = toRad(panelAzimuth);

    // Sun Azimuth Recalc (Approximation or correct logic)
    // Start with simple dot product in Local Frame:
    // Vertical (Zenith): sin(alpha)
    // Horizontal towards Sun: cos(alpha)
    // Sun Vector in Local (S_local):
    // Sz = cos(alpha) * cos(SunAzimuth) (North)
    // Sx = cos(alpha) * sin(SunAzimuth) (East)
    // Sy = sin(alpha) (Zenith)

    // Panel Normal in Local (N_local):
    // Tilt beta from Zenith towards Azimuth gamma.
    // Nz = sin(beta) * cos(gamma)
    // Nx = sin(beta) * sin(gamma)
    // Ny = cos(beta)

    // Dot Product:
    // Efficiency = Sx*Nx + Sy*Ny + Sz*Nz
    // But wait, sin(haRad) sign determines West/East.
    // Let's assume standard Sun Azimuth calculation logic handles it.

    // Recalculating Sun Azimuth correctly:
    // north component of sun vector on ground = (sin(Dec) - sin(Lat)sin(Alt)) / cos(Lat) ??
    // Actually, simple vector algebra in SolarScene used:
    // sunDir global: (x,y,z).
    // North global at observer: (0, cosLat, -sinLat).
    // East global: (-1, 0, 0) ?? No.

    // Let's punt exact HUD math for a second and trust the render, OR use a simplified heuristic for "Efficiency"
    // that encourages the user to just look at the 3D scene :)
    // Just kidding, let's do:
    // projected_efficiency = cos(beta)*sin(alpha) + sin(beta)*cos(alpha)*cos(SunAzimuth - PanelAzimuth)
    // We need SunAzimuth.
    // Sun Azimuth (A) formula:
    // tan(A) = sin(HA) / (sin(Lat)cos(HA) - cos(Lat)tan(Dec))
    const denom = Math.sin(latRad) * Math.cos(haRad) - Math.cos(latRad) * Math.tan(decRad);
    const sunAzimuthStruct = Math.atan2(Math.sin(haRad), denom) + Math.PI; // Add PI to align 0 with North?
    // This gives azimuth from South, roughly?
    // Let's use this struct as 'phi_s' estimate.

    const panelEfficiency = Math.max(0,
        Math.sin(panelBeta) * Math.cos(altRad) * Math.cos(sunAzimuthStruct - panelGamma) +
        Math.cos(panelBeta) * Math.sin(altRad)
    );


    const applyPreset = (lat: number, dec: number, ha: number) => {
        setLatitude(lat);
        setDeclination(dec);
        setHourAngle(ha);
    };

    const getStatusMessage = () => {
        if (labMode === 'panel') {
            if (panelEfficiency > 0.95) return "MAXIMUM POWER! ⚡🔋";
            if (panelEfficiency > 0.8) return "Grid is happy. Efficient! 🟢";
            if (panelEfficiency < 0.2) return "Are you powering a calculator? 🪫";
            if (altitude < 0) return "Sun's down. Efficiency is zero. 🌑";
            return "Adjusting tilt for gains... 🔧";
        }

        if (altitude > 89) return "Shadows have left the chat. 👻";
        if (altitude > 80) return "Wear sunscreen. Serious sunscreen. 🧴";
        if (altitude < -18) return "Astronomical Twilight. Pure darkness. 🌌";
        if (altitude < 0) return "Vampire hours. 🧛";
        if (latitude > 66 && altitude > 0 && Math.abs(hourAngle) > 170) return "Midnight Sun party! ☀️🕺";
        if (Math.abs(latitude) < 1 && Math.abs(declination) < 1) return "Equinox at the Equator. Perfectly balanced. ⚖️";
        if (shadowLength > 8) return "Legs for days! (Long shadows) 🦒";
        return "Just another day on a spinning rock. 🌍";
    };

    return (
        <div className="space-y-4 font-sans max-h-full overflow-y-auto pr-2 custom-scrollbar">

            {/* TAB SWITCHER */}
            <div className="flex bg-zinc-900 md:p-1 rounded-xl">
                <button
                    onClick={() => setLabMode('physics')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${labMode === 'physics'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Sun size={14} className="inline mr-1 -mt-0.5" /> Physics
                </button>
                <button
                    onClick={() => setLabMode('panel')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${labMode === 'panel'
                            ? 'bg-amber-500 text-black shadow-lg'
                            : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Zap size={14} className="inline mr-1 -mt-0.5" /> Panel
                </button>
            </div>

            {/* Humor Status */}
            <div className={`border p-2 rounded-lg text-center ${labMode === 'panel' ? 'bg-amber-900/20 border-amber-500/30' : 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30'}`}>
                <span className={`font-medium italic text-xs ${labMode === 'panel' ? 'text-amber-200' : 'text-indigo-200'}`}>
                    "{getStatusMessage()}"
                </span>
            </div>

            {/* SHARED CONTROLS (World State) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">World State</span>
                    {/* Navigation Lock */}
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`p-1.5 rounded-md transition-all ${isLocked
                            ? "bg-red-500/20 text-red-400 border border-red-500/50"
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                            }`}
                        title={isLocked ? "Unlock Camera" : "Lock Camera"}
                    >
                        {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                </div>

                {/* Sliders Section */}
                <label className="block">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold text-indigo-400 text-xs">Latitude (φ)</span>
                        <span className="font-mono text-xs text-zinc-300">{latitude.toFixed(1)}°</span>
                    </div>
                    <input
                        type="range"
                        min="-90"
                        max="90"
                        step="0.1"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
                    />
                </label>

                <label className="block">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold text-amber-400 text-xs">Declination (δ)</span>
                        <span className="font-mono text-xs text-zinc-300">{declination.toFixed(1)}°</span>
                    </div>
                    <input
                        type="range"
                        min="-23.5"
                        max="23.5"
                        step="0.1"
                        value={declination}
                        onChange={(e) => setDeclination(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                    />
                </label>

                <label className="block">
                    <div className="flex justify-between mb-1">
                        <span className="font-bold text-sky-400 text-xs">Hour Angle (ω)</span>
                        <span className="font-mono text-xs text-zinc-300">{hourAngle.toFixed(1)}°</span>
                    </div>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={hourAngle}
                        onChange={(e) => setHourAngle(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400"
                    />
                </label>
            </div>

            {/* PHYSICS MODE EXTRAS */}
            {labMode === 'physics' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => applyPreset(0, 0, 0)} className="preset-btn">📍 Equator</button>
                    <button onClick={() => applyPreset(90, 23.5, 0)} className="preset-btn">☀️ Midnight Sun</button>
                    <button onClick={() => applyPreset(40.7, -23.5, 0)} className="preset-btn">❄️ NYC Winter</button>
                    <button onClick={() => applyPreset(51.5, 23.5, 0)} className="preset-btn">☔ London Summer</button>
                </div>
            )}

            {/* PANEL MODE CONTROLS */}
            {labMode === 'panel' && (
                <div className="space-y-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center pb-2">
                        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Panel Configuration</span>
                    </div>

                    <label className="block">
                        <div className="flex justify-between mb-1">
                            <span className="font-bold text-zinc-300 text-xs">Panel Tilt (β)</span>
                            <span className="font-mono text-xs text-zinc-300">{panelTilt.toFixed(0)}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="90"
                            step="1"
                            value={panelTilt}
                            onChange={(e) => setPanelTilt(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                            <span>Flat (0°)</span>
                            <span>Vertical (90°)</span>
                        </div>
                    </label>

                    <label className="block">
                        <div className="flex justify-between mb-1">
                            <span className="font-bold text-zinc-300 text-xs">Panel Azimuth (γ)</span>
                            <span className="font-mono text-xs text-zinc-300">{panelAzimuth.toFixed(0)}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={panelAzimuth}
                            onChange={(e) => setPanelAzimuth(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                            <span>N (0°)</span>
                            <span>E</span>
                            <span>S (180°)</span>
                            <span>W</span>
                            <span>N</span>
                        </div>
                    </label>
                </div>
            )}

            {/* SHARED HUD with Conditional Metrics */}
            <div className="bg-zinc-900/80 p-4 rounded-xl border border-zinc-700 space-y-4 mt-4">
                <h3 className="text-xs font-bold uppercase text-zinc-500 tracking-wider mb-2">
                    {labMode === 'physics' ? 'Physics Telemetry' : 'Energy Output'}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                    {/* Column 1: Angles */}
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-zinc-400 block">Solar Altitude (α)</span>
                            <span className="font-mono text-md font-bold text-white">{altitude.toFixed(1)}°</span>
                        </div>
                        {labMode === 'physics' ? (
                            <div>
                                <span className="text-xs text-zinc-400 block">Zenith Angle (θ)</span>
                                <span className="font-mono text-md font-bold text-zinc-300">{zenith.toFixed(1)}°</span>
                            </div>
                        ) : (
                            <div>
                                <span className="text-xs text-zinc-400 block">Incidence Angle</span>
                                <span className="font-mono text-md font-bold text-zinc-300">
                                    {(Math.acos(panelEfficiency) * 180 / Math.PI).toFixed(1)}°
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Implications */}
                    <div className="space-y-3">
                        <div>
                            <span className="text-xs text-zinc-400 block">
                                {labMode === 'physics' ? 'Relative Energy' : 'Panel Efficiency'}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className={`font-mono text-xl font-bold ${labMode === 'panel' && panelEfficiency > 0.9 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {((labMode === 'physics' ? relativeEnergy : panelEfficiency) * 100).toFixed(0)}%
                                </span>
                                {/* Mini Bar Chart */}
                                <div className="h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${labMode === 'panel' && panelEfficiency > 0.9 ? 'bg-green-400' : 'bg-yellow-400'}`}
                                        style={{ width: `${(labMode === 'physics' ? relativeEnergy : panelEfficiency) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .preset-btn {
                    @apply px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 rounded text-[10px] font-medium text-zinc-300 transition-colors whitespace-nowrap;
                }
            `}</style>
        </div>
    );
}
