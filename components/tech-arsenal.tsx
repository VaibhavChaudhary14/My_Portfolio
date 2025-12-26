"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";
import {
  Code,
  Database,
  Brain,
  Zap,
  Cpu,
  Layers,
  Network,
  Globe,
  Server,
  Terminal,
} from "lucide-react";

const skills = [
  // AI & ML
  { name: "PyTorch", icon: Brain, color: "bg-orange-300" },
  { name: "TensorFlow", icon: Brain, color: "bg-orange-400" },
  { name: "scikit-learn", icon: Cpu, color: "bg-blue-300" },
  { name: "OpenCV", icon: Layers, color: "bg-green-300" },
  { name: "Transformers", icon: Network, color: "bg-purple-300" },

  // Power Systems
  { name: "Smart Grids", icon: Zap, color: "bg-yellow-300" },
  { name: "MATLAB", icon: Code, color: "bg-red-300" },
  { name: "Simulink", icon: Layers, color: "bg-red-400" },

  // Web & Systems
  { name: "Next.js", icon: Globe, color: "bg-gray-300" },
  { name: "React", icon: Code, color: "bg-cyan-300" },
  { name: "Docker", icon: Server, color: "bg-blue-400" },
  { name: "MongoDB", icon: Database, color: "bg-green-400" },
  { name: "PostgreSQL", icon: Database, color: "bg-blue-500" },
  { name: "Linux", icon: Terminal, color: "bg-yellow-500" },
];

export default function TechArsenal() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="skills" className={`py-24 px-4 sm:px-6 lg:px-8 relative ${theme === 'venom' ? 'bg-venom-black' : 'bg-paper-yellow/20'}`}>
      {/* Decorative border line */}
      <div className={`absolute top-0 left-0 w-full h-2 skew-y-1 ${theme === 'venom' ? 'bg-venom-slime opacity-50' : 'bg-black opacity-10'}`}></div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className={`text-4xl md:text-5xl font-black mb-4 inline-block px-6 py-2 shadow-neobrutalism -rotate-2 ${theme === 'venom' ? 'bg-venom-black border-2 border-venom-slime text-venom-slime shadow-[4px_4px_0px_0px_white]' : 'bg-white border-2 border-black text-black'}`}>
            {theme === 'venom' ? "OUR Arsenal 🕷️" : "My Tech Arsenal 🛠️"}
          </h2>
          <p className={`text-xl font-hand mt-4 max-w-2xl mx-auto ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-600'}`}>
            {theme === 'venom'
              ? "The tools WE use to dominate the grid. From neural tendrils to power surges."
              : "The tools and gadgets I use to build the future. From neural networks to power grids."}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.5, rotate: (index % 2 === 0 ? 5 : -5) }}
              whileInView={{ opacity: 1, scale: 1, rotate: (index % 3 === 0 ? 2 : -2) }}
              whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg border-2 shadow-neobrutalism cursor-pointer 
                ${theme === 'venom'
                  ? 'bg-black border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white'
                  : `${skill.color} border-black text-black`}`}
            >
              <skill.icon size={24} className={theme === 'venom' ? 'text-venom-slime' : 'text-black'} />
              <span className="font-bold text-lg font-sans">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
