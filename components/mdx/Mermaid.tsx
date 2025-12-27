"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useThemeStore } from "@/store/useThemeStore";

type Props = {
    chart: string;
};

export function Mermaid({ chart }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const { theme } = useThemeStore();

    useEffect(() => {
        if (typeof window !== "undefined") {
            mermaid.initialize({
                startOnLoad: true,
                theme: theme === "venom" ? "dark" : "neutral",
                securityLevel: "loose",
                fontFamily: "var(--font-sans)",
            });

            if (ref.current) {
                mermaid.contentLoaded();
                // Sometimes mermaid needs a re-render trigger for dynamic content
                ref.current.removeAttribute("data-processed");
                mermaid.run({
                    nodes: [ref.current],
                });
            }
        }
    }, [chart, theme]);

    return (
        <div className="mermaid my-8 flex justify-center bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 overflow-x-auto">
            <div ref={ref}>
                {chart}
            </div>
        </div>
    );
}
