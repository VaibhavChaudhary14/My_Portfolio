"use client";

import { Send, Loader2 } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                setStatus("success");
                setEmail("");
            } else {
                setStatus("error");
            }
        } catch (e) {
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="bg-green-50 border-2 border-green-500 p-8 text-center rounded-xl shadow-neobrutalism dark:bg-zinc-900 dark:border-green-400">
                <h3 className="text-2xl font-black text-green-700 dark:text-green-400 mb-2">You're in! 🎉</h3>
                <p className="text-green-800 dark:text-green-300 font-medium">Thanks for joining the stash. Expect cool stuff soon.</p>
                <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 text-sm font-bold underline hover:text-green-950 dark:text-green-400"
                >
                    Subscribe another email
                </button>
            </div>
        );
    }

    return (
        <div className="bg-paper-yellow border-2 border-black p-8 rounded-xl shadow-neobrutalism relative overflow-hidden dark:bg-zinc-900 dark:border-venom-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none dark:opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            ></div>

            <div className="relative z-10">
                <h3 className="text-3xl font-black mb-2 dark:text-white">Join the Stash 📦</h3>
                <p className="font-medium text-neutral-700 mb-6 dark:text-zinc-400">
                    Get the latest articles on Frontend, AI, and Design directly in your inbox. No spam, just vibes.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 border-2 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow font-mono text-sm dark:bg-black dark:border-venom-white dark:text-white dark:focus:shadow-[4px_4px_0px_0px_#fff]"
                        disabled={status === "loading"}
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="px-6 py-3 bg-black text-white font-bold border-2 border-black hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-neobrutalism transition-all active:translate-y-0 active:shadow-none dark:bg-venom-white dark:text-black dark:hover:bg-white"
                    >
                        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                Subscribe <Send className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
                {status === "error" && <p className="text-red-500 font-bold text-sm mt-3">Something went wrong.</p>}
            </div>
        </div>
    );
}
