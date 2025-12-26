"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import { FileText, Download, ShieldAlert, Binary } from "lucide-react";
import { useState } from "react";

export default function ResumeSection() {
    const { theme } = useThemeStore();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section id="resume" className={`py-20 relative overflow-hidden transition-colors duration-500 ${theme === 'venom' ? 'bg-zinc-900' : 'bg-paper-pattern'}`}>

            {/* Background Elements */}
            {theme === 'venom' && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff00_2px,#00ff00_4px)]" />
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-block relative">
                        <h2 className={`text-5xl md:text-7xl font-black mb-4 tracking-tighter ${theme === 'venom' ? 'text-white' : 'text-black'}`}>
                            {theme === 'venom' ? "HOST DATA" : "CREDENTIALS"}
                        </h2>

                        {/* Decorative Underline/Glitch */}
                        <motion.div
                            className={`h-4 w-full absolute -bottom-2 -right-2 -z-10 ${theme === 'venom' ? 'bg-venom-slime' : 'bg-paper-yellow'}`}
                            animate={theme === 'venom' ? {
                                clipPath: ["inset(0 0 0 0)", "inset(20% 0 50% 0)", "inset(0 0 0 0)"],
                                x: [-2, 2, -1, 0]
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                        />
                    </div>

                    <p className={`text-xl font-hand font-bold mt-4 ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-600'}`}>
                        {theme === 'venom' ? "⚠ WARNING: CLASSIFIED SYMBIOTE INTEL ⚠" : "My Professional Dossier"}
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-12 items-center justify-center">

                    {/* Resume Preview/Card */}
                    <motion.div
                        className={`relative w-full md:w-[600px] h-[800px] border-4 rounded-xl overflow-hidden shadow-2xl group ${theme === 'venom' ? 'border-venom-slime bg-black' : 'border-black bg-white'}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Header of the "Dossier"/"Terminal" */}
                        <div className={`p-4 border-b-4 flex justify-between items-center ${theme === 'venom' ? 'bg-venom-black border-venom-slime text-venom-slime' : 'bg-paper-blue border-black text-black'}`}>
                            <div className="flex gap-2 items-center">
                                {theme === 'venom' ? <Binary size={20} /> : <FileText size={20} />}
                                <span className="font-bold font-mono">
                                    {theme === 'venom' ? "RESUME_FINAL_V9.enc" : "resume.pdf"}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <div className={`w-3 h-3 rounded-full border-2 border-black ${theme === 'venom' ? 'bg-red-500' : 'bg-red-400'}`} />
                                <div className={`w-3 h-3 rounded-full border-2 border-black ${theme === 'venom' ? 'bg-yellow-500' : 'bg-yellow-400'}`} />
                                <div className={`w-3 h-3 rounded-full border-2 border-black ${theme === 'venom' ? 'bg-green-500' : 'bg-green-400'}`} />
                            </div>
                        </div>

                        {/* PDF Embed / Preview Area */}
                        <div className="w-full h-full relative bg-gray-100">
                            {/* Overlay for Venom Mode */}
                            {theme === 'venom' && (
                                <div className="absolute inset-0 z-10 bg-venom-slime/10 pointer-events-none mix-blend-overlay" />
                            )}

                            <iframe
                                src="/resume.pdf#toolbar=0"
                                className="w-full h-[calc(100%-60px)]"
                                title="Resume Preview"
                            />

                            {/* Interaction Overlay (Click to Download) */}
                            <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100 pointer-events-none' : 'opacity-0'}`}>
                                {theme === 'venom' ? (
                                    <div className="text-venom-slime font-mono text-center animate-pulse">
                                        <ShieldAlert size={64} className="mx-auto mb-4" />
                                        <h3 className="text-3xl font-black">ACCESS GRANTED</h3>
                                        <p>CLICK BUTTON TO EXTRACT</p>
                                    </div>
                                ) : (
                                    <div className="text-white text-center">
                                        <Download size={64} className="mx-auto mb-4" />
                                        <h3 className="text-3xl font-bold font-hand">Ready to Review?</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Area */}
                    <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left max-w-sm">
                        <h3 className={`text-3xl font-black ${theme === 'venom' ? 'text-white' : 'text-black'}`}>
                            {theme === 'venom' ? "INITIATE DOWNLOAD" : "Get the Full Story"}
                        </h3>
                        <p className={`text-lg leading-relaxed ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-600'}`}>
                            {theme === 'venom'
                                ? "Our capabilities are documented in this encrypted file. Extracting this data may compromise your hiring standards... for the better."
                                : "Download my resume to see the detailed breakdown of my experience, skills, and academic background."}
                        </p>

                        <motion.a
                            href="/resume.pdf"
                            download="Vaibhav_Chaudhary_Resume.pdf"
                            className={`group relative px-8 py-4 font-bold text-xl border-2 overflow-hidden transition-all duration-300 ${theme === 'venom'
                                    ? 'bg-black text-venom-slime border-venom-slime shadow-[5px_5px_0px_0px_#84cc16] hover:shadow-[2px_2px_0px_0px_#84cc16] hover:translate-x-1 hover:translate-y-1'
                                    : 'bg-white text-black border-black shadow-neobrutalism hover:shadow-neobrutalism-sm hover:translate-x-1 hover:translate-y-1'
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {theme === 'venom' ? "💉 EXTRACT DATA" : "📄 DOWNLOAD RESUME"}
                                {theme === 'venom' ? <Binary className="animate-pulse" /> : <Download />}
                            </span>

                            {/* Hover Fill Effect */}
                            <div className={`absolute inset-0 z-0 h-full w-full translate-y-full transition-transform duration-300 group-hover:translate-y-0 ${theme === 'venom' ? 'bg-venom-slime/20' : 'bg-paper-yellow'
                                }`} />
                        </motion.a>
                    </div>

                </div>
            </div>
        </section>
    );
}
