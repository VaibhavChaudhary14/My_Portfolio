"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface SubstackCTAProps {
  title?: string;
  description?: string;
  url?: string;
  buttonText?: string;
}

export function SubstackCTA({
  title = "Enjoyed this essay?",
  description = "Read more essays on culture, direction, technology, and internet culture on my Substack.",
  url = "https://substack.com/@vaibhav14ry",
  buttonText = "Subscribe on Substack ↗",
}: SubstackCTAProps) {
  const { theme } = useThemeStore();

  return (
    <div
      className={`not-prose my-12 p-6 sm:p-8 border-4 rounded-2xl shadow-neobrutalism flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
        theme === "venom"
          ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white"
          : "bg-amber-100 border-black text-black"
      }`}
    >
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="font-black text-xl sm:text-2xl tracking-tight">
          {title}
        </div>
        <div
          className={`text-sm font-medium leading-relaxed max-w-lg ${
            theme === "venom" ? "text-zinc-300" : "text-zinc-800"
          }`}
        >
          {description}
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`px-6 py-3.5 border-2 font-mono font-black text-sm uppercase tracking-wider rounded-xl shadow-neobrutalism hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
          theme === "venom"
            ? "bg-venom-slime text-black border-venom-slime shadow-[2px_2px_0px_0px_white]"
            : "bg-orange-500 text-white border-black hover:bg-orange-600"
        }`}
      >
        <span>{buttonText}</span>
      </a>
    </div>
  );
}
