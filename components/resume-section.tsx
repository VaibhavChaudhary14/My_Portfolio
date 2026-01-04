"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import { FileText, Download, ShieldAlert, Binary, Github, Activity, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { GitHubCalendar } from 'react-github-calendar';
import { Tooltip } from 'react-tooltip';
import React from 'react';

// Animated Counter Component
function Counter({ from, to }: { from: any; to: any }) {
    const count = useMotionValue(from);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    useEffect(() => {
        const controls = animate(count, to, { duration: 2.5, ease: "easeOut" });
        return controls.stop;
    }, [count, to]);

    return <motion.span>{rounded}</motion.span>;
}

export default function ResumeSection() {
    const { theme } = useThemeStore();
    const [isHovered, setIsHovered] = useState(false);
    const [totalContributions, setTotalContributions] = useState(0);

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Calculate total contributions
    const handleTransformData = (data: any) => {
        const total = data.reduce((acc: any, day: any) => acc + day.count, 0);
        // Defer state update to avoid render error
        setTimeout(() => {
            setTotalContributions(total);
        }, 0);
        return data;
    };

    return (
        <section id="resume" className={`py-20 relative overflow-hidden transition-colors duration-500 ${theme === 'venom' ? 'bg-zinc-900' : 'bg-paper-pattern'}`}>

            {/* Background Elements */}
            {theme === 'venom' && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#00ff00_2px,#00ff00_4px)]" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 relative z-10">

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

                <div className="flex flex-col xl:flex-row gap-12 items-center justify-center">

                    {/* Resume Preview/Card - REDUCED SIZE */}
                    <motion.div
                        className={`relative w-full md:w-[450px] h-[600px] border-4 rounded-xl overflow-hidden shadow-2xl group ${theme === 'venom' ? 'border-venom-slime bg-black' : 'border-black bg-white'}`}
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
                                <span className="font-bold font-mono text-sm">
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
                                    <div className="text-venom-slime font-mono text-center animate-pulse p-4">
                                        <ShieldAlert size={48} className="mx-auto mb-4" />
                                        <h3 className="text-2xl font-black">ACCESS GRANTED</h3>
                                        <p>CLICK BUTTON TO EXTRACT</p>
                                    </div>
                                ) : (
                                    <div className="text-white text-center p-4">
                                        <Download size={48} className="mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold font-hand">Ready to Review?</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Action Area & GitHub Chart */}
                    <div className="flex flex-col gap-8 items-center xl:items-start text-center xl:text-left max-w-2xl">

                        {/* Download CTA */}
                        <div className="flex flex-col gap-6 items-center xl:items-start w-full">
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

                                <div className={`absolute inset-0 z-0 h-full w-full translate-y-full transition-transform duration-300 group-hover:translate-y-0 ${theme === 'venom' ? 'bg-venom-slime/20' : 'bg-paper-yellow'
                                    }`} />
                            </motion.a>
                        </div>

                        {/* GitHub Activity Graph (Image) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full mt-4"
                        >
                            <img
                                src="https://camo.githubusercontent.com/0ba93cbd7cc0e26cbe9d2fa6c881c61a9dc4d0943604e42a264f727a1506d9c3/68747470733a2f2f6769746875622d726561646d652d61637469766974792d67726170682e76657263656c2e6170702f67726170683f757365726e616d653d56616962686176436861756468617279313426637573746f6d5f7469746c653d566169626861762773253230436f6e747269627574696f6e25323047726170682662675f636f6c6f723d30443131313726636f6c6f723d374633464246266c696e653d37463346424626706f696e743d37463346424626617265615f636f6c6f723d464646464646267469746c655f636f6c6f723d46464646464626617265613d74727565"
                                alt="GitHub Activity Graph"
                                className={`w-full rounded-xl border-4 ${theme === 'venom'
                                    ? 'border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]'
                                    : 'border-black shadow-neobrutalism'
                                    }`}
                            />
                        </motion.div>

                        {/* GitHub Activity Graph Component */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`w-full p-6 rounded-xl border-4 mt-4 relative ${theme === 'venom'
                                ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] hover:shadow-[0px_0px_20px_#84cc16]'
                                : 'bg-white border-black shadow-neobrutalism hover:shadow-neobrutalism-sm'
                                } transition-all duration-300`}
                        >
                            {/* Animated Glitch Border for Venom */}
                            {theme === 'venom' && (
                                <div className="absolute inset-0 border-2 border-venom-slime opacity-50 animate-pulse rounded-xl pointer-events-none" />
                            )}

                            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                                <h3 className={`text-xl font-black flex items-center gap-2 ${theme === 'venom' ? 'text-venom-slime' : 'text-black'
                                    }`}>
                                    {theme === 'venom' ? <Binary size={24} /> : <Github size={24} />}
                                    {theme === 'venom' ? "SYMBIOTE ACTIVITY LOG" : "GitHub Contributions"}
                                </h3>

                                <div className="flex items-center gap-4">
                                    {/* Year Selector */}
                                    <div className="flex gap-1">
                                        {[currentYear, currentYear - 1, currentYear - 2].map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => setSelectedYear(year)}
                                                className={`px-2 py-1 text-xs font-bold rounded ${selectedYear === year
                                                        ? theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-black text-white'
                                                        : theme === 'venom' ? 'text-gray-500 hover:text-venom-slime' : 'text-gray-400 hover:text-black'
                                                    }`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Total Contribution Counter */}
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${theme === 'venom' ? 'bg-black border border-venom-slime text-venom-slime' : 'bg-gray-100 border border-black'
                                        }`}>
                                        {theme === 'venom' ? <Activity size={18} className="animate-pulse" /> : <Flame size={18} className="text-orange-500" />}
                                        <span>
                                            <Counter from={0} to={totalContributions} />
                                            <span className="ml-1 text-sm opacity-80">in {selectedYear}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex justify-center overflow-x-auto ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-800'}`}>
                                <GitHubCalendar
                                    username="VaibhavChaudhary14"
                                    year={selectedYear}
                                    colorScheme={theme === 'venom' ? 'dark' : 'light'}
                                    showWeekdayLabels={true}
                                    theme={theme === 'venom' ? {
                                        dark: ['#18181b', '#365314', '#4d7c0f', '#65a30d', '#84cc16'],
                                    } : undefined}
                                    fontSize={12}
                                    blockSize={12}
                                    blockMargin={4}
                                    transformData={handleTransformData}
                                    renderBlock={(block, activity) => (
                                        React.cloneElement(block, {
                                            'data-tooltip-id': 'github-tooltip',
                                            'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
                                        })
                                    )}
                                />
                                <Tooltip
                                    id="github-tooltip"
                                    style={{
                                        backgroundColor: theme === 'venom' ? '#000' : '#333',
                                        color: theme === 'venom' ? '#84cc16' : '#fff',
                                        border: theme === 'venom' ? '1px solid #84cc16' : 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </div>
                        </motion.div>

                    </div>

                </div>
            </div>
        </section>
    );
}
