"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { useThemeStore } from "@/store/useThemeStore";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const links = [
    { href: "#home", label: "Home" },
    { href: "#skills", label: theme === "venom" ? "Arsenal" : "Skills" },
    { href: "#experience", label: theme === "venom" ? "Origin" : "Journey" },
    { href: "#projects", label: theme === "venom" ? "Missions" : "Work" },
    { href: "#contact", label: theme === "venom" ? "Summon" : "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b-2 px-4 py-3 transition-colors duration-500 ${theme === 'venom' ? 'bg-venom-black border-venom-slime text-white' : 'bg-white border-black text-zinc-900'}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#home" className={`text-2xl font-black tracking-tighter transition-colors ${theme === 'venom' ? 'hover:text-venom-slime' : 'hover:text-purple-600'}`}>
          {theme === 'venom' ? "WE.ARE.VENOM" : "VAIBHAV.DEV"}
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`font-bold text-lg hover:underline underline-offset-4 ${theme === 'venom' ? 'decoration-venom-slime hover:text-venom-slime' : 'decoration-wavy decoration-purple-500'}`}
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
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
            className={`absolute top-full left-0 right-0 border-b-2 p-4 flex flex-col gap-4 shadow-xl md:hidden ${theme === 'venom' ? 'bg-venom-black border-venom-slime' : 'bg-white border-black'}`}
          >
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`font-bold text-xl py-2 border-b ${theme === 'venom' ? 'border-gray-800 text-white hover:text-venom-slime' : 'border-gray-100 text-black'}`}
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
