import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Beaker, FlaskConical, Sparkles } from "lucide-react";
import { div } from "framer-motion/client";

export default function LabPage() {
    return (
        <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white pb-20 pt-24 px-6 relative overflow-hidden font-sans">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-sky-500/10 dark:bg-venom-slime/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col gap-4 mb-16">
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-2 dark:text-venom-white">
                        <span className="text-green-500 dark:text-green-400">Experimental</span> <br />
                        <span className="text-purple-600 dark:text-venom-slime flex items-center gap-4">
                            Labs <Beaker className="w-12 h-12 md:w-20 md:h-20 stroke-2" />
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-medium border-l-4 border-purple-500 dark:border-venom-slime pl-6 py-2">
                        A collection of interactive physics simulations, AI experiments, and web engineering playgrounds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Solar Physics Lab Card */}
                    <a
                        href="/lab/solar-physics"
                        target="_blank"
                        className="group relative h-[400px] block"
                    >
                        <article className="h-full bg-zinc-50 dark:bg-zinc-900/50 border-2 border-black dark:border-venom-slime/30 rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_#84cc16] hover:border-purple-600 dark:hover:border-venom-slime">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-xl">
                                    <span className="text-4xl">☀️</span>
                                </div>
                                <div className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Physics Engine
                                </div>
                            </div>

                            <h2 className="text-3xl font-black mb-3 group-hover:text-purple-600 dark:group-hover:text-venom-slime transition-colors">
                                Solar Physics Lab
                            </h2>
                            <p className="text-zinc-600 dark:text-zinc-400 flex-grow text-sm leading-relaxed">
                                A real-time 3D simulation of Earth-Sun geometry. Explore seasons, solar altitude, and atmospheric paths with an interactive globe and AI analyst.
                            </p>

                            <div className="mt-6 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                <div className="flex gap-2 text-xs font-mono text-zinc-500">
                                    <span>Three.js</span>
                                    <span>•</span>
                                    <span>Gemini AI</span>
                                </div>
                                <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform dark:text-venom-slime" />
                            </div>
                        </article>
                    </a>

                    {/* Placeholder for future labs */}
                    <article className="h-[400px] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-600 gap-4 group">
                        <FlaskConical className="w-16 h-16 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                        <div>
                            <h3 className="text-xl font-bold mb-1">Coming Soon</h3>
                            <p className="text-sm">More experiments in the works.</p>
                        </div>
                    </article>
                </div>
            </div>
        </main>
    );
}
