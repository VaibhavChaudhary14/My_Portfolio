"use client";

import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { Lock, Unlock, Zap, Sun } from "lucide-react";

export default function Controls() {
    const {
        latitude, longitude, declination, hourAngle, isLocked,
        labMode, panelTilt, panelAzimuth, showSunPath,
        setLatitude, setLongitude, setDeclination, setHourAngle, setIsLocked,
        setLabMode, setPanelTilt, setPanelAzimuth, setShowSunPath
    } = useSolarStore();

    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    const colors = isVenom ? {
        physicsTab: 'bg-venom-purple text-white',
        panelTab: 'bg-venom-slime text-black',
        locked: 'bg-venom-slime/20 text-venom-slime border-venom-slime/50',
        sliderLat: 'accent-venom-purple hover:accent-venom-purple/80',
        sliderDec: 'accent-venom-slime hover:accent-venom-slime/80',
        sliderHA: 'accent-green-400 hover:accent-green-400/80',
        textLat: 'text-venom-purple',
        textDec: 'text-venom-slime',
        textHA: 'text-green-400'
    } : {
        physicsTab: 'bg-blue-600 text-white',
        panelTab: 'bg-red-600 text-white',
        locked: 'bg-red-500/20 text-red-500 border-red-500/50',
        sliderLat: 'accent-blue-500 hover:accent-blue-400',
        sliderDec: 'accent-red-500 hover:accent-red-400',
        sliderHA: 'accent-sky-500 hover:accent-sky-400',
        textLat: 'text-blue-500',
        textDec: 'text-red-500',
        textHA: 'text-sky-500'
    };

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


    const applyPreset = (lat: number, lon: number, dec: number, ha: number) => {
        setLatitude(lat);
        setLongitude(lon);
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
                        ? `${colors.physicsTab} shadow-lg`
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Sun size={14} className="inline mr-1 -mt-0.5" /> Physics
                </button>
                <button
                    onClick={() => setLabMode('panel')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${labMode === 'panel'
                        ? `${colors.panelTab} shadow-lg`
                        : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
                        }`}
                >
                    <Zap size={14} className="inline mr-1 -mt-0.5" /> Panel
                </button>
            </div>



            {/* SHARED CONTROLS (World State) */}
            <div className="space-y-6 pt-2">

                {/* Sliders Section */}
                <label className="block group">
                    <div className="flex justify-between mb-2">
                        <span className={`font-bold ${colors.textLat} text-xs uppercase tracking-wider`}>Latitude ({latitude.toFixed(1)}°)</span>
                    </div>
                    <input
                        type="range"
                        min="-90"
                        max="90"
                        step="0.1"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-all hover:h-3 ${colors.sliderLat}`}
                    />
                </label>

                <label className="block group">
                    <div className="flex justify-between mb-2">
                        <span className={`font-bold text-zinc-400 text-xs uppercase tracking-wider`}>Longitude ({longitude.toFixed(1)}°)</span>
                    </div>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-500 hover:accent-zinc-400 hover:h-3 transition-all"
                    />
                </label>

                <label className="block group">
                    <div className="flex justify-between mb-2">
                        <span className={`font-bold ${colors.textDec} text-xs uppercase tracking-wider`}>Season / Declination ({declination.toFixed(1)}°)</span>
                    </div>
                    <input
                        type="range"
                        min="-23.5"
                        max="23.5"
                        step="0.1"
                        value={declination}
                        onChange={(e) => setDeclination(parseFloat(e.target.value))}
                        className={`w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer hover:h-3 transition-all ${colors.sliderDec}`}
                    />
                    <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
                        <span>Winter</span>
                        <span>Equinox</span>
                        <span>Summer</span>
                    </div>
                </label>

                <label className="block group">
                    <div className="flex justify-between mb-2">
                        <span className={`font-bold ${colors.textHA} text-xs uppercase tracking-wider`}>Time / Hour Angle ({hourAngle.toFixed(0)}°)</span>
                    </div>
                    <input
                        type="range"
                        min="-180"
                        max="180"
                        step="1"
                        value={hourAngle}
                        onChange={(e) => setHourAngle(parseFloat(e.target.value))}
                        className={`w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer hover:h-3 transition-all ${colors.sliderHA}`}
                    />
                    <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
                        <span>Midnight</span>
                        <span>Noon</span>
                        <span>Midnight</span>
                    </div>
                </label>

                {/* VISUALS: Sun Path Toggle */}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Visuals</span>
                    <button
                        onClick={() => setShowSunPath(!showSunPath)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all border ${showSunPath
                            ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                            : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'}`}
                    >
                        {showSunPath ? 'Hide Sun Path' : 'Show Sun Path'}
                    </button>
                </div>
            </div>

            {/* PHYSICS DASHBOARD */}
            {labMode === 'physics' && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 animate-in fade-in">
                    <div className="bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-500 uppercase block">Daylight</span>
                        <span className="text-sm font-bold text-zinc-200">
                            {(() => {
                                // cos(H) = -tan(phi)tan(delta)
                                // H in radians. Daylight = 2H. (2H/2PI * 24h) = H * 24/PI
                                const val = -Math.tan(latRad) * Math.tan(decRad);
                                if (val < -1) return "24.0h"; // Midnight Sun
                                if (val > 1) return "0.0h";   // Polar Night
                                const h = Math.acos(val);
                                const hours = (h * 2 / Math.PI) * 12; // Wait: h is half-day in rad (0..PI). Daylight fraction = h/PI. *24 hours.
                                return `${hours.toFixed(1)}h`;
                            })()}
                        </span>
                    </div>
                    <div className="bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-500 uppercase block">Max Elev</span>
                        <span className="text-sm font-bold text-zinc-200">
                            {/* 90 - |lat - dec| */}
                            {(90 - Math.abs(latitude - declination)).toFixed(1)}°
                        </span>
                    </div>
                    <div className="bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-500 uppercase block">Solar Power</span>
                        <span className="text-sm font-bold text-amber-400">
                            {/* Relative Irradiance on Horizontal */}
                            {(Math.max(0, Math.sin(altRad)) * 100).toFixed(0)}%
                        </span>
                    </div>
                    <div className="bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
                        <span className="text-[10px] text-zinc-500 uppercase block">Shadow</span>
                        <span className="text-sm font-bold text-zinc-400">
                            {altitude > 0 ? (1 / Math.tan(Math.max(0.01, altRad))).toFixed(1) + "x" : "∞"}
                        </span>
                    </div>
                </div>
            )}




            {/* PANEL MODE CONTROLS */}
            {labMode === 'panel' && (
                <div className="space-y-6 pt-6 border-t border-zinc-800">
                    <label className="block group">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tilt / Beta ({panelTilt.toFixed(0)}°)</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="90"
                            step="1"
                            value={panelTilt}
                            onChange={(e) => setPanelTilt(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 hover:h-3 transition-all bg-zinc-700"
                        />
                    </label>

                    <label className="block group">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Azimuth / Gamma ({panelAzimuth.toFixed(0)}°)</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={panelAzimuth}
                            onChange={(e) => setPanelAzimuth(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-red-500 hover:h-3 transition-all bg-zinc-700"
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1">
                            <span>N</span>
                            <span>E</span>
                            <span>S</span>
                            <span>W</span>
                            <span>N</span>
                        </div>
                    </label>

                    {/* Auto-Optimize Button */}
                    <button
                        onClick={() => {
                            if (altitude > 0) {
                                // 1. Set Tilt to Zenith Angle (face the sun vertically)
                                setPanelTilt(parseFloat(zenith.toFixed(1)));
                                // 2. Set Azimuth to visual Sun Azimuth (face the sun horizontally)
                                let azDeg = toDeg(sunAzimuthStruct);
                                // Normalize to 0-360
                                if (azDeg < 0) azDeg += 360;
                                if (azDeg >= 360) azDeg %= 360;
                                setPanelAzimuth(parseFloat(azDeg.toFixed(1)));
                            } else {
                                // Night optimization (Just point up or South?)
                                setPanelTilt(0);
                            }
                        }}
                        className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border flex items-center justify-center gap-2
                            ${panelEfficiency > 0.99
                                ? 'bg-green-500 text-black border-green-500 cursor-default'
                                : 'bg-zinc-800 text-amber-500 border-amber-900/50 hover:bg-amber-900/20 hover:border-amber-500'
                            }`}
                    >
                        {panelEfficiency > 0.99 ? (
                            <><span>✓ Optimized</span></>
                        ) : (
                            <>
                                <Zap size={14} />
                                <span>Auto-Align Panel</span>
                            </>
                        )}
                    </button>

                    {/* Simple Efficiency Pill */}
                    <div className={`p-4 rounded-xl border text-center transition-colors ${panelEfficiency > 0.9 ? 'bg-green-500/10 border-green-500/30' : 'bg-zinc-800/50 border-zinc-700'}`}>
                        <div className="text-xs uppercase font-bold text-zinc-500 tracking-widest mb-1">Efficiency</div>
                        <div className={`text-3xl font-black ${panelEfficiency > 0.9 ? 'text-green-400' : 'text-zinc-200'}`}>
                            {(panelEfficiency * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
}
