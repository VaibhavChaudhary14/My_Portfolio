"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, X, FolderOpen } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  color: string;
  venomColor?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "SaafSaksham",
    description: "AI-Powered Civic Cleanliness Verification Platform. Uses Vision Transformers to detect garbage and verify cleanliness.",
    tech: ["PyTorch", "Next.js", "OpenCV", "Vision Transformers", "Google Maps API", "Tailwind CSS"],
    github: "https://github.com/VaibhavChaudhary14/SaafSaksham",
    color: "bg-green-200",
    venomColor: "border-green-500 shadow-[4px_4px_0px_0px_#22c55e]"
  },
  {
    id: "2",
    title: "Smart Grid Security",
    description: "Cyberattack detection in power grids using Spatio-Temporal Graph Neural Networks (ST-GNNs).",
    tech: ["ST-GNN", "MATLAB", "Reinforcement Learning", "Python", "Graph Theory", "Cybersecurity"],
    github: "https://github.com/VaibhavChaudhary14",
    color: "bg-blue-200",
    venomColor: "border-blue-500 shadow-[4px_4px_0px_0px_#3b82f6]"
  },
  {
    id: "5",
    title: "X Automator Agent",
    description: "An AI agent that automates social engagement using Sim.ai visually designed workflows. Features persona-based replies and RAG.",
    tech: ["Sim.ai", "LLMs", "RAG", "Automation", "Python"],
    live: "/x-agent",
    color: "bg-red-200",
    venomColor: "border-red-500 shadow-[4px_4px_0px_0px_#ef4444]"
  },

  {
    id: "3",
    title: "Science Labs",
    description: "A specialized playground for interactive physics simulations and AI-driven scientific experiments.",
    tech: ["Three.js", "React Three Fiber", "Gemini AI", "Next.js", "Vector Math"],
    live: "/lab",
    color: "bg-amber-100",
    venomColor: "border-amber-500 shadow-[4px_4px_0px_0px_#f59e0b]"
  },
  {
    id: "4",
    title: "Portfolio",
    description: "My personal website built with Next.js and Tailwind CSS. You are looking at it right now!",
    tech: ["Next.js", "Tailwind", "Framer Motion", "TypeScript", "Gemini API", "Resend"],
    github: "https://github.com/VaibhavChaudhary14/My_Portfolio",
    color: "bg-purple-200",
    venomColor: "border-purple-500 shadow-[4px_4px_0px_0px_#a855f7]"
  }
];

export default function MissionFiles() {
  const { theme } = useThemeStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="projects" className={`py-24 px-4 sm:px-6 lg:px-8 ${theme === 'venom' ? 'bg-black' : ''}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4 inline-block relative">
            <span className={`relative z-10 ${theme === 'venom' ? 'text-venom-slime' : 'text-black'}`}>
              {theme === 'venom' ? "OUR Conquests 📂" : "Mission Files 📂"}
            </span>
            <div className={`absolute inset-0 translate-y-2 -translate-x-2 -z-0 skew-x-12 ${theme === 'venom' ? 'bg-gray-800' : 'bg-paper-pink'}`}></div>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              layoutId={project.id}
              onClick={() => setSelectedId(project.id)}
              className={`group relative p-6 rounded-xl border-4 cursor-pointer overflow-hidden transition-colors 
                ${theme === 'venom'
                  ? `bg-zinc-900 text-gray-200 ${project.venomColor}`
                  : `${project.color} border-black shadow-neobrutalism hover:bg-white text-black`}`}
              whileHover={{ y: -4, shadow: theme === 'venom' ? "0px 0px 20px rgba(132, 204, 22, 0.4)" : "6px 6px 0px 0px #18181b" }}
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <FolderOpen size={32} />
              </div>

              <h3 className="text-2xl font-bold mb-2 font-sans truncate pr-8">{project.title}</h3>
              <p className={`font-hand line-clamp-3 mb-4 ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-800'}`}>{project.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tech.map(t => (
                  <span key={t} className={`px-2 py-1 text-xs font-bold rounded border ${theme === 'venom' ? 'bg-black text-venom-slime border-venom-slime' : 'bg-black text-white border-black'}`}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedId && (
            <motion.div
              layoutId={selectedId}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
            >
              <motion.div
                className={`p-8 rounded-xl border-4 max-w-2xl w-full relative ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[0_0_30px_rgba(132,204,22,0.3)]' : 'bg-white border-black shadow-neobrutalism'}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedId(null)}
                  className={`absolute top-4 right-4 p-2 rounded transition-colors border-2 ${theme === 'venom' ? 'bg-red-900/50 border-red-500 text-red-500 hover:bg-red-900' : 'bg-red-400 border-black hover:bg-red-500'}`}
                >
                  <X size={20} />
                </button>

                {(() => {
                  const project = projects.find(p => p.id === selectedId)!;
                  return (
                    <>
                      <h2 className={`text-4xl font-black mb-4 ${theme === 'venom' ? 'text-venom-white' : 'text-black'}`}>{project.title}</h2>
                      <p className={`text-xl font-hand mb-6 ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-700'}`}>{project.description}</p>

                      <div className="mb-8">
                        <h4 className={`font-bold mb-2 text-lg ${theme === 'venom' ? 'text-venom-slime' : 'text-black'}`}>Tech Stack:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map(t => (
                            <span key={t} className={`px-3 py-1 border-2 rounded font-bold ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-yellow-300 border-black shadow-neobrutalism-sm'}`}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        {project.github && (
                          <a href={project.github} target="_blank" className={`flex items-center gap-2 px-6 py-3 font-bold rounded transition-colors ${theme === 'venom' ? 'bg-venom-slime text-black hover:bg-green-400' : 'bg-black text-white hover:bg-zinc-800'}`}>
                            <Github size={20} />
                            Code
                          </a>
                        )}
                        {project.live && (
                          <a href={project.live} target={project.live.startsWith("http") ? "_blank" : "_self"} className={`flex items-center gap-2 px-6 py-3 font-bold border-2 rounded transition-colors ${theme === 'venom' ? 'bg-transparent text-venom-slime border-venom-slime hover:bg-venom-slime/10' : 'bg-white text-black border-black hover:bg-gray-50'}`}>
                            <ExternalLink size={20} />
                            Live Demo
                          </a>
                        )}
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
