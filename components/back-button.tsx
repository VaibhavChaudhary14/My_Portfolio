"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function BackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // Hide on homepage
    if (pathname === "/") return null;

    return (
        <AnimatePresence>
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={() => router.back()}
                className="fixed bottom-8 left-8 z-50 p-4 bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime rounded-full shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group"
                aria-label="Go Back"
            >
                <ArrowLeft className="w-6 h-6 text-black dark:text-venom-slime group-hover:scale-110 transition-transform" />
            </motion.button>
        </AnimatePresence>
    );
}
