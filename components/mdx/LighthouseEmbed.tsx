"use client";

import { ExternalLink } from "lucide-react";

type Props = {
    url: string;
};

export function LighthouseEmbed({ url }: Props) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block my-10 no-underline"
        >
            <div className="overflow-hidden rounded-xl border-2 border-black dark:border-venom-slime shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] bg-white dark:bg-zinc-900 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-neobrutalism-sm dark:group-hover:shadow-none transition-all duration-300">
                <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-venom-slime/10 flex items-center justify-center text-blue-600 dark:text-venom-slime">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 font-hand">
                            View Live Lighthouse Report
                        </h3>
                        <p className="text-neutral-500 dark:text-gray-400 font-sans max-w-md mx-auto">
                            See the real-time performance, accessibility, and SEO scores directly on Google PageSpeed Insights.
                        </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2 font-bold text-primary dark:text-venom-slime group-hover:underline decoration-wavy underline-offset-4">
                        Open Report <ExternalLink className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </a>
    );
}
