"use client";

import { Share2, Linkedin, Link as LinkIcon, Check, Twitter, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Props = {
    title: string;
    slug: string;
};

export default function ShareButtons({ title, slug }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    const baseUrl = "https://vaibhav-14ry.vercel.app";
    const url = `${baseUrl}/blog/${slug}`;

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold font-sans rounded-none border-2 border-black shadow-neobrutalism hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all dark:bg-venom-white dark:text-black dark:border-white dark:shadow-[4px_4px_0px_0px_#84cc16]"
                aria-label="Share Article"
                aria-expanded={isOpen}
            >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
            </button>

            {/* Modal Popup */}
            {isOpen && (
                <div className="absolute right-0 bottom-full mb-4 z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                    <div ref={modalRef} className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] p-4 rounded-xl relative">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-dashed border-black/10 dark:border-white/10">
                            <span className="font-hand font-bold text-lg dark:text-white">Share on...</span>
                            <button onClick={() => setIsOpen(false)} className="text-neutral-400 dark:text-gray-400 hover:text-black dark:hover:text-venom-slime transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <a href={twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-black/40 hover:bg-sky-50 dark:hover:bg-sky-900/20 border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-black text-white rounded-md group-hover:scale-110 transition-transform">
                                    <Twitter className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm dark:text-gray-300">X (Twitter)</span>
                            </a>

                            <a href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-black/40 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg transition-colors group"
                            >
                                <div className="p-2 bg-[#0077b5] text-white rounded-md group-hover:scale-110 transition-transform">
                                    <Linkedin className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-sm dark:text-gray-300">LinkedIn</span>
                            </a>

                            <button
                                onClick={handleCopy}
                                className="flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-black/40 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 border-2 border-transparent hover:border-black/10 dark:hover:border-white/10 rounded-lg transition-colors group w-full text-left"
                            >
                                <div className={`p-2 rounded-md transition-all duration-300 ${copied ? "bg-green-500 text-white" : "bg-neutral-200 dark:bg-zinc-700 text-neutral-600 dark:text-gray-300"}`}>
                                    {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                                </div>
                                <span className="font-bold text-sm dark:text-gray-300">
                                    {copied ? "Link Copied!" : "Copy Link"}
                                </span>
                            </button>
                        </div>

                        {/* Little Triangle Pointer */}
                        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-zinc-900 border-r-2 border-b-2 border-black dark:border-venom-slime transform rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
