"use client";

import { useEffect, useState } from "react";

type Props = {
    label: string;
    score: number;
    color?: string; // Expecting Tailwind text color classes e.g., "text-green-600"
};

export function LighthouseScore({
    label,
    score,
    color = "text-green-600",
}: Props) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 800; // ms
        const step = score / (duration / 16); // 60fps approx

        const interval = setInterval(() => {
            start += step;
            if (start >= score) {
                setValue(score);
                clearInterval(interval);
            } else {
                setValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(interval);
    }, [score]);

    // Determine ring color based on score if color not overridden/specific
    // But user passes color. Let's use it.
    // We can also add a ring circle for "Animated progress rings" request.

    const circumference = 2 * Math.PI * 40; // r=40
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-neutral-200 dark:text-zinc-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${color} transition-all duration-300 ease-out`}
                    />
                </svg>
                <span className={`text-3xl font-black ${color} relative z-10 font-mono`}>{value}</span>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-zinc-400">{label}</span>
        </div>
    );
}
