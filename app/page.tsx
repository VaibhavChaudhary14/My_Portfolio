"use client";

import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import TechArsenal from "@/components/tech-arsenal";
import ExperienceTimeline from "@/components/experience-timeline";
import MissionFiles from "@/components/mission-files";
import Contact from "@/components/contact";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";

export default function Home() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <main className={`relative min-h-screen font-sans selection:bg-purple-200 ${theme === 'venom' ? 'venom' : 'bg-[#fbfbfb] text-zinc-900'}`}>
      <Navigation />

      <div className="w-full flex flex-col gap-0">
        <Hero />
        <TechArsenal />
        <ExperienceTimeline />
        <MissionFiles />
        <Contact />
      </div>

      {/* Footer */}
      <footer className={`py-8 text-center border-t-2 transition-colors ${theme === 'venom' ? 'bg-venom-black border-venom-slime' : 'bg-white border-black'}`}>
        <p className={`font-hand font-bold text-lg ${theme === 'venom' ? 'text-venom-slime' : 'text-black'}`}>
          {theme === 'venom' ? "WE are ONE. 🕷️" : "Designed with 💜 & ☕ by Vaibhav. © 2025"}
        </p>
      </footer>
    </main>
  );
}
