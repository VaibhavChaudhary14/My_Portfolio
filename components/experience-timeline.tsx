"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import React, { useEffect, useState } from "react";
import { X, ArrowUpRight } from "lucide-react";

type Experience = {
  title: string;
  company: string;
  period: string;
  description: React.ReactNode;
  bullets?: React.ReactNode[];
  techStack?: string[];
  color: string;
  venomColor: string;
};

const experiences: Experience[] = [
  {
    title: "AI Engineer Intern",
    company: "Crawlii",
    period: "Feb 2026 – Present",
    description: "Crawlii is an AI-driven SaaS and Voice Bot platform enabling businesses to deploy intelligent conversational agents over voice calls, SMS, and messaging channels.",
    bullets: [
      <>Architected AI voice bot systems integrating STT, LLM reasoning, and TTS pipelines, achieving <strong>&lt;800ms end-to-end latency</strong> on a real-time <strong>LiveKit</strong> platform.</>,
      <>Engineered a <strong>provider-agnostic telephony service</strong> (Elixir) for Twilio, Exotel, and Plivo, seamlessly dispatching outbound campaigns of <strong>50,000+ contacts</strong> with plug-and-play fallback.</>,
      <>Built a real-time <strong>WebSocket audio bridge</strong> with μ-law/PCM16 transcoding and VAD-based barge-in, reliably managing <strong>1,000+ concurrent voice sessions</strong> across server pools.</>,
      <>Implemented <strong>LLM inference workers</strong> with multi-provider fallback (Gemini, Groq, Claude), guaranteeing <strong>99.9% AI response uptime</strong> via custom circuit breakers and streaming TTS.</>,
      <>Designed a robust <strong>RabbitMQ-based queue architecture</strong> handling <strong>10,000+ messages/minute</strong> for async AI processing, integrated with <strong>Redis</strong> concurrency controls for large-scale operations.</>
    ],
    techStack: ["Python", "Elixir", "FastAPI", "LiveKit", "Twilio", "Exotel", "Plivo", "MCube", "RabbitMQ", "Redis", "PostgreSQL", "Docker", "Kubernetes", "WebRTC", "SIP"],
    color: "bg-green-400",
    venomColor: "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
  },
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
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedExp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedExp]);

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

                {(exp.bullets || exp.techStack) && (
                  <button
                    onClick={() => setSelectedExp(exp)}
                    className={`mt-6 flex items-center gap-2 px-4 py-2 font-bold border-2 rounded transition-all hover:-translate-y-0.5 hover:shadow-neobrutalism-sm ${theme === 'venom' ? 'border-venom-slime text-venom-slime hover:bg-venom-slime hover:text-black' : 'border-black bg-white text-black hover:bg-black hover:text-white'}`}
                  >
                    View Details <ArrowUpRight size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExp(null)}
              className="absolute inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-3xl max-h-[85vh] overflow-y-auto border-4 rounded-xl p-6 md:p-10 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime text-white shadow-[8px_8px_0px_0px_#84cc16]' : 'bg-white border-black text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              <button
                onClick={() => setSelectedExp(null)}
                className={`absolute top-4 right-4 p-2 rounded transition-colors border-2 z-10 ${theme === 'venom' ? 'bg-red-900/50 border-red-500 text-red-500 hover:bg-red-900' : 'bg-red-400 border-black text-black hover:bg-red-500'}`}
              >
                <X size={20} />
              </button>

              <span className={`inline-block px-3 py-1 text-xs font-bold rounded mb-4 ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}>
                {selectedExp.period}
              </span>
              <h3 className="text-3xl md:text-4xl font-black mb-1 pr-12">{selectedExp.title}</h3>
              <h4 className="text-xl md:text-2xl font-bold mb-6 opacity-75">@ {selectedExp.company}</h4>

              <p className="font-hand text-xl mb-8 leading-relaxed">{selectedExp.description}</p>

              {selectedExp.bullets && (
                <div className="mb-8">
                  <h5 className={`text-sm font-black mb-4 uppercase tracking-wider ${theme === 'venom' ? 'text-venom-slime' : 'text-gray-500'}`}>Key Contributions</h5>
                  <ul className="space-y-4">
                    {selectedExp.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-4 text-base md:text-lg">
                        <span className={`mt-2 w-2 h-2 rounded-full flex-shrink-0 ${theme === 'venom' ? 'bg-venom-slime' : 'bg-black'}`} />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedExp.techStack && (
                <div>
                  <h5 className={`text-sm font-black mb-4 uppercase tracking-wider ${theme === 'venom' ? 'text-venom-slime' : 'text-gray-500'}`}>Tech Arsenal</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedExp.techStack.map((tech, i) => (
                      <span key={i} className={`px-3 py-1.5 text-sm font-bold border-2 rounded ${theme === 'venom' ? 'border-venom-slime text-venom-slime' : 'bg-yellow-300 border-black text-black shadow-neobrutalism-sm'}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
