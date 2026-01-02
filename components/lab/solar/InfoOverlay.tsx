"use client";

import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InfoOverlay() {
    const { activeInfo, setActiveInfo } = useSolarStore();
    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    if (!activeInfo) return null;

    const infoContent: Record<string, { title: string, formula: string, desc: string }> = {
        "latitude": {
            title: "Latitude (φ)",
            formula: "φ = Angle from Equator",
            desc: "The angular distance of a place north or south of the earth's equator. It determines the height of the celestial pole."
        },
        "hourAngle": {
            title: "Hour Angle (ω)",
            formula: "ω = 15° × (Solar Time - 12)",
            desc: "The angular distance of the sun from the local meridian. It changes by 15° per hour as the Earth rotates."
        },
        "declination": {
            title: "Declination (δ)",
            formula: "δ ≈ 23.45° × sin(360/365 × (d - 81))",
            desc: "The angle between the rays of the sun and the plane of the earth's equator. It varies seasonally from +23.5° (Summer) to -23.5° (Winter)."
        },
        "altitude": {
            title: "Solar Altitude (α)",
            formula: "sin(α) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(ω)",
            desc: "The angle of the sun above the horizon. 90° means directly overhead (Zenith), 0° means sunrise/sunset."
        },
        "zenith": {
            title: "Zenith Angle (θz)",
            formula: "θz = 90° - α",
            desc: "The angle between the sun and the vertical (zenith). Used often in calculating air mass."
        },
        "longitude": {
            title: "Longitude (λ)",
            formula: "λ = Angle from Prime Meridian",
            desc: "The angular distance of a place east or west of the meridian at Greenwich, England."
        }
    };

    const content = infoContent[activeInfo];
    if (!content) return null;

    const overlayColors = isVenom ? {
        bg: "bg-zinc-900/95 border-venom-slime shadow-[0_0_50px_rgba(132,204,22,0.3)]",
        text: "text-zinc-200",
        title: "text-venom-slime",
        accent: "text-venom-purple",
        close: "hover:bg-venom-slime/20 text-venom-slime"
    } : {
        bg: "bg-white/95 border-blue-500 shadow-xl",
        text: "text-zinc-700",
        title: "text-blue-600",
        accent: "text-rose-500",
        close: "hover:bg-red-500/10 text-red-500"
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    onClick={() => setActiveInfo(null)}
                />

                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl z-10 relative overflow-hidden ${overlayColors.bg}`}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => setActiveInfo(null)}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors bg-black/5 hover:scale-110 active:scale-95 ${overlayColors.close}`}
                    >
                        <X size={24} />
                    </button>

                    <h2 className={`text-3xl font-bold font-hand mb-2 pr-10 ${overlayColors.title}`}>
                        {content.title}
                    </h2>

                    <div className={`p-4 rounded-xl bg-black/40 font-mono text-sm mb-5 border border-white/5 ${overlayColors.accent}`}>
                        <code>{content.formula}</code>
                    </div>

                    <p className={`text-lg font-sans leading-relaxed mb-6 ${overlayColors.text}`}>
                        {content.desc}
                    </p>

                    <button
                        onClick={() => setActiveInfo(null)}
                        className={`w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:opacity-90 active:scale-[0.98] ${isVenom ? "bg-venom-slime text-black" : "bg-black text-white"}`}
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
