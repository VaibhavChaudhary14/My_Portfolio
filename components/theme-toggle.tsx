"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useThemeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-16 h-8 rounded-full border-2 transition-colors duration-500 overflow-hidden ${theme === "venom"
                    ? "bg-venom-black border-venom-slime shadow-[0_0_10px_#84cc16]"
                    : "bg-white border-black shadow-neobrutalism-sm"
                }`}
        >
            <motion.div
                className="absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
                animate={{
                    x: theme === "venom" ? 32 : 0,
                    backgroundColor: theme === "venom" ? "#84cc16" : "#fbbf24",
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {theme === "sketch" ? (
                    <span className="text-[10px]">☀️</span>
                ) : (
                    <span className="text-[10px] text-black font-bold">V</span>
                )}
            </motion.div>

            {/* Symbiote Tendrils Background Animation */}
            {theme === "venom" && (
                <motion.div
                    className="absolute inset-0 bg-venom-slime opacity-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1.5 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </button>
    );
}
