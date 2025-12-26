"use client";

import { motion } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";

const experiences = [
  {
    title: "Vocational Trainee",
    company: "UPPTCL (Agra)",
    period: "Jul 2025",
    description: "Analyzed 400kV high-voltage infrastructure. Dealt with transformers and circuit breakers safely.",
    color: "bg-paper-pink",
    venomColor: "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
  },
  {
    title: "Frontend Developer",
    company: "ScienceOverse",
    period: "Mar 2024 – Jun 2024",
    description: "Built interfaces for 100+ users. Integrated React auth flows and optimized API calls.",
    color: "bg-paper-blue",
    venomColor: "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
  }
];

export default function ExperienceTimeline() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="experience" className={`py-24 px-4 sm:px-6 lg:px-8 ${theme === 'venom' ? 'bg-venom-black' : ''}`}>
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-black mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className={`border-b-8 px-4 ${theme === 'venom' ? 'border-venom-slime text-venom-slime' : 'border-paper-yellow text-black'}`}>
            {theme === 'venom' ? "Our Origins 🧬" : "My Journey 🚀"}
          </span>
        </motion.h2>

        <div className={`relative border-l-4 ml-4 md:ml-12 space-y-12 ${theme === 'venom' ? 'border-venom-slime' : 'border-black'}`}>
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              className="relative pl-8 md:pl-12"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-3 top-0 w-6 h-6 border-4 rounded-full ${theme === 'venom' ? 'bg-black border-venom-slime' : 'bg-white border-black'}`} />

              <div className={`p-6 border-4 shadow-neobrutalism rounded-lg transform transition-transform hover:-translate-y-1 ${theme === 'venom' ? `bg-zinc-900 border-venom-slime shadow-[8px_8px_0px_0px_#84cc16] text-white` : `${exp.color} border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black`}`}>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded mb-2 ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}>
                  {exp.period}
                </span>
                <h3 className="text-2xl font-black mb-1">{exp.title}</h3>
                <h4 className="text-lg font-bold mb-4 opacity-75">@ {exp.company}</h4>
                <p className="font-hand text-lg">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
