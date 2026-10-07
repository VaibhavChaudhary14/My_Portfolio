"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(14); // Mock initial count

    const handleLike = () => {
        if (!liked) {
            setLiked(true);
            setCount(prev => prev + 1);
        } else {
            setLiked(false);
            setCount(prev => prev - 1);
        }
    };

    return (
        <button
            onClick={handleLike}
            className="group relative flex items-center gap-2"
        >
            <div className={`p-3 rounded-full border-2 border-black transition-all ${liked ? 'bg-red-500 border-red-500' : 'bg-white hover:bg-neutral-100'}`}>
                <Heart
                    className={`w-6 h-6 transition-colors ${liked ? 'text-white fill-white' : 'text-black'}`}
                />
            </div>

            <AnimatePresence>
                {liked && (
                    <motion.div
                        initial={{ scale: 0, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2"
                    >
                        <span className="text-xl">❤️</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <span className="font-mono font-bold text-lg">{count}</span>
        </button>
    );
}
