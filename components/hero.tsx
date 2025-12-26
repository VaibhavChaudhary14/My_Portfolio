"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";

export default function Hero() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background Doodles */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          {/* Text Content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 font-sans tracking-tight" style={{ textShadow: "4px 4px 0px #a855f7" }}>
              HIE, I AM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 stroke-black" style={{ WebkitTextStroke: "2px black" }}>
                VAIBHAV
              </span>
            </h1>

            <motion.div
              className="inline-block bg-zinc-300 dark:bg-zinc-800 border-2 border-black p-4 rotate-2 shadow-neobrutalism mb-8"
              whileHover={{ rotate: 0, scale: 1.05 }}
            >
              <p className="text-xl md:text-2xl font-hand font-bold">
                Electrical Engineer & AI ML Enthusiast ⚡🤖
              </p>
            </motion.div>

            <p className={`text-xl font-sans max-w-lg mx-auto md:mx-0 leading-relaxed mb-8 ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-600'}`}>
              {theme === 'venom'
                ? "WE consume data to fuel intelligent systems. From Dark Grids to Computer Vision, nothing escapes our sight."
                : (
                  <>
                    I build intelligent systems that solve real-world problems.
                    From <span className="font-bold underline decoration-wavy decoration-purple-500">Smart Grids</span> to
                    <span className="font-bold underline decoration-wavy decoration-pink-500"> Computer Vision</span>,
                    I bridge the gap between hardware and AI.
                  </>
                )
              }
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.a
                href="#projects"
                className={`px-8 py-3 font-bold border-2 shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-lg ${theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime shadow-[4px_4px_0px_0px_white]' : 'bg-black text-white border-black'}`}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'venom' ? "View Mission" : "View My Work"}
              </motion.a>
              <motion.a
                href="#contact"
                className={`px-8 py-3 font-bold border-2 shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all rounded-lg ${theme === 'venom' ? 'bg-transparent text-venom-slime border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white text-black border-black'}`}
                whileTap={{ scale: 0.95 }}
              >
                {theme === 'venom' ? "Join Us" : "Say Hello"}
              </motion.a>
            </div>
          </motion.div>

          {/* Avatar Image */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto">
              {/* Liquid Blob Background */}
              <div className={`absolute inset-0 animate-blob translate-x-4 translate-y-4 ${theme === 'venom' ? 'bg-venom-slime' : 'bg-purple-400'}`} />

              {/* Main Image Blob */}
              <div className={`absolute inset-0 animate-blob overflow-hidden border-4 z-10 ${theme === 'venom' ? 'border-venom-slime bg-black' : 'border-black bg-white'}`}>
                <Image
                  src={theme === 'venom' ? "/profile-venom.png" : "/profile-light.png"}
                  alt="Vaibhav Chaudhary"
                  fill
                  className="object-cover scale-110" // Slight scale to cover blob movement
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Decorative Stickers */}
              <motion.div
                className={`absolute -top-4 -right-4 p-2 border-2 rounded shadow-neobrutalism-sm rotate-12 ${theme === 'venom' ? 'bg-black border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]' : 'bg-paper-pink border-black'}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <span className="text-2xl">{theme === 'venom' ? "🦠" : "🧠"}</span>
              </motion.div>

              <motion.div
                className={`absolute -bottom-4 -left-4 p-2 border-2 rounded shadow-neobrutalism-sm -rotate-12 ${theme === 'venom' ? 'bg-black border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]' : 'bg-paper-blue border-black'}`}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
              >
                <span className="text-2xl">{theme === 'venom' ? "🧪" : "⚡"}</span>
              </motion.div>
            </div>
          </motion.div>

        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown size={32} className={theme === 'venom' ? "text-venom-slime" : "text-black"} />
        </motion.div>
      </div>
    </section>
  );
}
