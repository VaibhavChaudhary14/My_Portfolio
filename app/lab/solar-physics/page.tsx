"use client";

import { ArrowLeft, Maximize2, Minimize2, PanelLeft, PanelRight } from "lucide-react";
import Link from "next/link";
import { useSolarStore } from "@/store/useSolarStore";
import { useState, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import SolarScene from "@/components/lab/solar/SolarScene";
import Controls from "@/components/lab/solar/Controls";
import GeminiAnalyst from "@/components/lab/solar/GeminiAnalyst";

export default function SolarPhysicsLab() {
    const { isLocked } = useSolarStore();
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
        <main ref={containerRef} className="h-screen w-full bg-black text-white overflow-hidden flex flex-col md:flex-row relative">

            {/* LEFT PANEL (If !isRightPanel) */}
            {!isRightPanel && (
                <div className="w-full md:w-[400px] flex-shrink-0 bg-zinc-900/90 backdrop-blur-md border-r border-white/10 flex flex-col h-[40vh] md:h-full overflow-y-auto z-10">
                    <div className="p-6 space-y-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold font-hand text-amber-400 mb-2">Solar Physics Lab</h1>
                            <button
                                onClick={() => setIsRightPanel(true)}
                                className="p-2 hover:bg-white/10 rounded-full"
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
                    className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span className="text-sm font-bold">Exit</span>
                </Link>

                {/* Toolbar Overlay (Fullscreen + Layout Swap if main view) */}
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                    {/* Only show 'Move Left' button if panel is currently Right */}
                    {isRightPanel && (
                        <button
                            onClick={() => setIsRightPanel(false)}
                            className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-white/10 transition-colors"
                            title="Move Panel Left"
                        >
                            <PanelLeft size={20} />
                        </button>
                    )}

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-white/10 transition-colors"
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
                        enabled={!isLocked} // Lock Logic
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 1.5}
                        enablePan={false}
                        dampingFactor={0.05}
                    />
                    <ambientLight intensity={0.2} />
                </Canvas>
            </div>

            {/* RIGHT PANEL (If isRightPanel) */}
            {isRightPanel && (
                <div className="w-full md:w-[400px] flex-shrink-0 bg-zinc-900/90 backdrop-blur-md border-l border-white/10 flex flex-col h-[40vh] md:h-full overflow-y-auto z-10">
                    <div className="p-6 space-y-8">
                        <div>
                            <h1 className="text-2xl font-bold font-hand text-amber-400 mb-2">Solar Physics Lab</h1>
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
