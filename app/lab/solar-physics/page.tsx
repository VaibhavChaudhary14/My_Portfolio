"use client";

import { ArrowLeft, Maximize2, Minimize2, PanelLeft, PanelRight } from "lucide-react";
import Link from "next/link";
import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import SolarScene from "@/components/lab/solar/SolarScene";
import Controls from "@/components/lab/solar/Controls";
import GeminiAnalyst from "@/components/lab/solar/GeminiAnalyst";
import InfoOverlay from "@/components/lab/solar/InfoOverlay";


export default function SolarPhysicsLab() {
    const { isLocked } = useSolarStore();
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    // Hydration Fix: Ensure theme is applied only after client mount
    useEffect(() => {
        setMounted(true);
    }, []);

    const isVenom = mounted && theme === 'venom';

    // Theme Presets
    const themeColors = isVenom ? {
        heading: "text-venom-slime",
        border: "border-venom-slime/30",
        panelBg: "bg-zinc-900/95 shadow-[0_0_30px_rgba(132,204,22,0.1)]",
        iconHover: "hover:bg-venom-slime/20 hover:text-venom-slime",
        quitHover: "hover:bg-venom-slime/20 hover:text-venom-slime border-transparent hover:border-venom-slime",
        accent: "text-venom-slime"
    } : {
        heading: "text-red-500",
        border: "border-blue-500/20",
        panelBg: "bg-slate-900/95 shadow-[0_0_30px_rgba(239,68,68,0.1)]",
        iconHover: "hover:bg-red-500/20 hover:text-red-500",
        quitHover: "hover:bg-red-500/20 hover:text-red-500 border-transparent hover:border-red-500",
        accent: "text-blue-500"
    };

    const [isRightPanel, setIsRightPanel] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <main ref={containerRef} className={`h-screen w-full bg-black text-white overflow-hidden flex flex-col md:flex-row relative transition-colors duration-500 selection:bg-amber-500/30 ${isVenom ? "selection:bg-venom-slime/30" : ""}`}>
            <InfoOverlay />


            {/* LEFT PANEL (If !isRightPanel) */}
            {!isRightPanel && (
                <div className={`w-full md:w-[400px] flex-shrink-0 backdrop-blur-md border-r flex flex-col h-[40vh] md:h-full overflow-y-auto z-10 transition-colors duration-300 ${themeColors.panelBg} ${themeColors.border}`}>
                    <div className="p-6 space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className={`text-2xl font-bold font-hand mb-2 ${themeColors.heading}`}>Solar Physics Lab</h1>
                            <button
                                onClick={() => setIsRightPanel(true)}
                                className={`p-2 rounded-full transition-all ${themeColors.iconHover}`}
                                title="Move Panel Right"
                            >
                                <PanelRight size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-zinc-400 -mt-6">
                            Adjust orbital parameters & verify AI analysis.
                        </p>
                        <Controls />
                        <GeminiAnalyst />
                    </div>
                </div>
            )}

            {/* 3D Viewport - Takes full space on mobile, major space on desktop */}
            <div className="relative flex-grow h-[60vh] md:h-full w-full bg-[#000005]">
                {/* Back Button Overlay */}
                <Link
                    href="/lab"
                    className={`absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-full border transition-all ${themeColors.quitHover}`}
                >
                    <ArrowLeft size={16} />
                    <span className="text-sm font-bold">Exit</span>
                </Link>

                {/* Toolbar Overlay (Fullscreen + Layout Swap + Theme Toggle) */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 transition-all ${themeColors.iconHover}`}
                        title={`Switch to ${isVenom ? 'Spider' : 'Venom'} Theme`}
                    >
                        {isVenom ? (
                            // Venom Icon (Ghost-like approximation)
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ghost"><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" /></svg>
                        ) : (
                            // Spider Icon (Bug-like approximation)
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bug"><path d="m8 2 1.88 1.88" /><path d="M14.12 3.88 16 2" /><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" /><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" /><path d="M12 20v-9" /><path d="M6.53 9C4.6 8.8 3 7.1 3 5" /><path d="M6 13H2" /><path d="M3 21c0-2.1 1.7-3.9 3.8-4" /><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" /><path d="M22 13h-4" /><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" /></svg>
                        )}
                    </button>

                    {/* Only show 'Move Left' button if panel is currently Right */}
                    {isRightPanel && (
                        <button
                            onClick={() => setIsRightPanel(false)}
                            className={`p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 transition-all ${themeColors.iconHover}`}
                            title="Move Panel Left"
                        >
                            <PanelLeft size={20} />
                        </button>
                    )}

                    <button
                        onClick={toggleFullscreen}
                        className={`p-2 bg-black/50 backdrop-blur rounded-full border border-white/10 transition-all ${themeColors.iconHover}`}
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>

                <Canvas shadows camera={{ position: [0, 20, 40], fov: 45 }}>
                    <color attach="background" args={["#000005"]} />
                    <fog attach="fog" args={["#000005", 30, 100]} />

                    <Suspense fallback={null}>
                        <SolarScene />
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    </Suspense>

                    <OrbitControls
                        enabled={!isLocked}
                        enablePan={true}
                        enableZoom={true}
                        minDistance={5}
                        maxDistance={500}
                    />
                    <ambientLight intensity={0.2} />
                </Canvas>
            </div>

            {/* RIGHT PANEL (If isRightPanel) */}
            {isRightPanel && (
                <div className={`w-full md:w-[400px] flex-shrink-0 backdrop-blur-md border-l flex flex-col h-[40vh] md:h-full overflow-y-auto z-10 transition-colors duration-300 ${themeColors.panelBg} ${themeColors.border}`}>
                    <div className="p-6 space-y-8">
                        <div>
                            <h1 className={`text-2xl font-bold font-hand mb-2 ${themeColors.heading}`}>Solar Physics Lab</h1>
                            <p className="text-sm text-zinc-400">
                                Adjust the orbital parameters to observe changes in solar radiation geometry.
                            </p>
                        </div>
                        <Controls />
                        <GeminiAnalyst />
                    </div>
                </div>
            )}
        </main>
    );
}
