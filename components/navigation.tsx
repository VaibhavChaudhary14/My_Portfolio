"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { useThemeStore } from "@/store/useThemeStore";
import VisitorCounter from "@/components/visitor-counter";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const links = [
    {
      href: "#home",
      label: "Home",
      highlight: "bg-amber-300 text-black border-black hover:bg-amber-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-amber-500/20 text-amber-300 border-amber-400/60 hover:bg-amber-500/40",
    },
    {
      href: "#skills",
      label: theme === "venom" ? "Arsenal" : "Skills",
      highlight: "bg-cyan-300 text-black border-black hover:bg-cyan-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-cyan-500/20 text-cyan-300 border-cyan-400/60 hover:bg-cyan-500/40",
    },
    {
      href: "#experience",
      label: theme === "venom" ? "Origin" : "Journey",
      highlight: "bg-pink-300 text-black border-black hover:bg-pink-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-pink-500/20 text-pink-300 border-pink-400/60 hover:bg-pink-500/40",
    },
    {
      href: "#projects",
      label: theme === "venom" ? "Missions" : "Work",
      highlight: "bg-lime-300 text-black border-black hover:bg-lime-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-lime-500/20 text-venom-slime border-venom-slime/60 hover:bg-lime-500/40",
    },
    {
      href: "/now",
      label: theme === "venom" ? "Pod Status" : "Now",
      highlight: "bg-purple-300 text-black border-black hover:bg-purple-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-purple-500/20 text-purple-300 border-purple-400/60 hover:bg-purple-500/40",
    },
    {
      href: "/blog",
      label: "Writing",
      highlight: "bg-orange-300 text-black border-black hover:bg-orange-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-orange-500/20 text-orange-300 border-orange-400/60 hover:bg-orange-500/40",
    },
    {
      href: "#contact",
      label: theme === "venom" ? "Summon" : "Contact",
      highlight: "bg-rose-300 text-black border-black hover:bg-rose-400 shadow-[2px_2px_0px_0px_#000]",
      venomHighlight: "bg-rose-500/20 text-rose-300 border-rose-400/60 hover:bg-rose-500/40",
    },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b-2 px-4 md:px-6 py-3 transition-colors duration-500 ${theme === 'venom' ? 'bg-venom-black border-venom-slime text-white' : 'bg-white border-black text-zinc-900'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className={`text-3xl md:text-4xl font-black tracking-tighter transition-colors ${theme === 'venom' ? 'hover:text-venom-slime' : 'hover:text-purple-600'}`}>
            {theme === 'venom' ? "WE.ARE.VENOM" : "VAIBHAV.DEV"}
          </a>
          <VisitorCounter />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3.5">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 text-sm md:text-base font-black rounded-lg border-2 transition-all hover:-translate-y-0.5 ${
                theme === 'venom' ? link.venomHighlight : link.highlight
              }`}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-full left-0 right-0 border-b-2 p-4 flex flex-col gap-3 shadow-xl md:hidden ${theme === 'venom' ? 'bg-venom-black border-venom-slime' : 'bg-white border-black'}`}
          >
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-black text-lg py-2 px-3 rounded-lg border-2 transition-all ${
                  theme === 'venom' ? link.venomHighlight : link.highlight
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
