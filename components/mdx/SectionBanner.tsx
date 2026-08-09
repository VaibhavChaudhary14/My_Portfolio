"use client";

import React from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface SectionBannerProps {
  act?: string;
  number?: string;
  title: string;
  subtitle?: string;
  color?: "yellow" | "blue" | "pink" | "emerald" | "purple" | "orange";
}

export function SectionBanner({
  act,
  number,
  title,
  subtitle,
  color = "yellow",
}: SectionBannerProps) {
  const { theme } = useThemeStore();

  const colorMap = {
    yellow: "bg-paper-yellow text-black border-black",
    blue: "bg-paper-blue text-black border-black",
    pink: "bg-paper-pink text-black border-black",
    emerald: "bg-emerald-200 text-black border-black",
    purple: "bg-purple-200 text-black border-black",
    orange: "bg-orange-200 text-black border-black",
  };

  const selectedBg = colorMap[color] || colorMap.yellow;

  return (
    <div
      className={`not-prose my-8 p-4 sm:p-6 border-3 border-black dark:border-venom-slime rounded-xl shadow-neobrutalism transition-all ${
        theme === "venom"
          ? "bg-zinc-900 shadow-[4px_4px_0px_0px_#84cc16] text-white"
          : `${selectedBg}`
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2 font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider">
        {act && (
          <span
            className={`px-2.5 py-0.5 border shadow-neobrutalism-sm ${
              theme === "venom"
                ? "bg-black text-venom-slime border-venom-slime"
                : "bg-black text-white border-black"
            }`}
          >
            {act}
          </span>
        )}
        {number && (
          <span
            className={`px-2 py-0.5 border ${
              theme === "venom"
                ? "bg-zinc-800 text-white border-venom-slime"
                : "bg-white text-black border-black"
            }`}
          >
            SECTION {number}
          </span>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug m-0 text-black dark:text-white">
        {title}
      </h2>

      {subtitle && (
        <p className="font-hand font-bold text-sm sm:text-base mt-1.5 m-0 text-zinc-800 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}
