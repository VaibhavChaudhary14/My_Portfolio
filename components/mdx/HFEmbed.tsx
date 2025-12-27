"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
    src: string;
    title?: string;
};

export function HFEmbed({ src, title = "Hugging Face Space" }: Props) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="my-10 border-2 border-black dark:border-venom-slime rounded-xl overflow-hidden shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] bg-white dark:bg-zinc-900">
            <div className="p-4 border-b-2 border-black/10 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🤗</span>
                    <span className="font-bold font-mono text-sm uppercase tracking-wider text-zinc-700 dark:text-gray-300">
                        {title}
                    </span>
                </div>
                <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold flex items-center gap-1 hover:underline text-primary dark:text-venom-slime"
                >
                    Open in New Tab <ExternalLink size={12} />
                </a>
            </div>

            <div className="relative w-full h-[600px] bg-gray-100 dark:bg-black/50">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-zinc-500">
                        <Loader2 className="w-8 h-8 animate-spin text-primary dark:text-venom-slime" />
                        <span className="font-mono text-xs animate-pulse">Loading Space...</span>
                    </div>
                )}
                <iframe
                    src={src}
                    className="w-full h-full border-none z-10 relative"
                    title={title}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    onLoad={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
}
