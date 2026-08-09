"use client";

import React, { useState } from "react";
import { useThemeStore } from "@/store/useThemeStore";

interface NodeData {
  badge: "strong" | "mixed" | "weak";
  title: string;
  body: string;
  cite: string;
  badgeLabel: string;
}

const DATA: NodeData[] = [
  {
    badge: "mixed",
    badgeLabel: "Mixed / Partial",
    title: "01: Trigger (Controversial or Moral Content Appears)",
    body: "Someone posts content that violates a shared value, or reports on someone who did. This step is necessary but not sufficient: plenty of provocative posts go nowhere. What happens next depends on how physiologically activating the reaction is, not on how negative it is.",
    cite: "Framing device based on Berger & Milkman (2012)."
  },
  {
    badge: "strong",
    badgeLabel: "Strong Evidence",
    title: "02: Arousal (The Reaction Is High-Activation, Not Just Negative)",
    body: "Berger & Milkman found that valence (good vs. bad) barely predicted sharing. Physiological arousal did. Awe (positive) and anger or anxiety (negative) all boosted virality; sadness, also negative but low-arousal, suppressed it.",
    cite: "Berger & Milkman (2012), Journal of Marketing Research, 49(2), 192–205."
  },
  {
    badge: "strong",
    badgeLabel: "Strong Evidence",
    title: "03: Sharing & Engagement (Outrage Gets Reinforced by Feedback)",
    body: "Brady et al. found that when a person's outrage post got positive social feedback, they were more likely to post outrage again: a reinforcement-learning pattern, not evidence of a hidden anger-detecting algorithm.",
    cite: "Brady, McLoughlin, Doan & Crockett (2021), Science Advances, 7(33). Based on 12.7M tweets, 7,331 users."
  },
  {
    badge: "mixed",
    badgeLabel: "Mixed / Partial",
    title: "04: Algorithmic Ranking (Engagement Gets Rewarded, Not Anger Specifically)",
    body: "Facebook's 2017 change weighted every reaction emoji (love, haha, wow, sad, angry) five times higher than a Like. It wasn't anger-targeted. But by 2019 Facebook's own researchers found angry-heavy posts skewed toward misinformation and low-quality content.",
    cite: "Merrill & Oremus, The Washington Post (Oct 26, 2021), reporting on internal Meta documents."
  },
  {
    badge: "weak",
    badgeLabel: "Weak / Contested",
    title: "05: Wider Exposure (Does the Algorithm Push People Toward Extremes?)",
    body: "This is the most contested link in the chain. Ledwich & Zaitsev (2020) found YouTube's algorithm steered traffic away from extremist content, but critics showed their logged-out method couldn't capture personalized rabbit holes. Later work found mixed, asymmetric results.",
    cite: "Ledwich & Zaitsev (2020), First Monday, 25(3); contested by multiple follow-up studies."
  }
];

export function RageLoop() {
  const [activeIdx, setActiveIdx] = useState<number>(1); // Default to Arousal (strongest)
  const { theme } = useThemeStore();
  const current = DATA[activeIdx];

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case "strong":
        return "bg-[#ef4444] text-white border-black dark:border-white shadow-neobrutalism-sm";
      case "mixed":
        return "bg-[#f59e0b] text-black border-black dark:border-white shadow-neobrutalism-sm";
      case "weak":
        return "bg-[#10b981] text-black border-black dark:border-white shadow-neobrutalism-sm";
      default:
        return "bg-gray-200 text-black border-black";
    }
  };

  return (
    <div className={`my-10 p-5 sm:p-7 border-3 shadow-neobrutalism rounded-xl transition-all ${
      theme === "venom"
        ? "bg-zinc-950 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white"
        : "bg-[#fffdfa] border-black text-black"
    }`}>
      
      {/* Header */}
      <div className="mb-5 border-b-2 border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 border border-black dark:border-venom-slime font-mono font-bold text-xs uppercase bg-paper-yellow text-black shadow-neobrutalism-sm">
            Interactive Diagnostic Model
          </span>
          <span className="text-xs font-mono font-bold text-zinc-500 dark:text-gray-400">
            Click nodes to explore
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
          The Rage Loop: How Outrage Traverses the System
        </h3>
        <p className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-gray-300 mt-1">
          Six stages, one continuous loop. The pulse expands where evidence is strongest (Arousal) and shrinks where evidence is contested (Exposure).
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono font-bold mb-5">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] border border-black dark:border-white inline-block" />
          <span>Strong Evidence</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b] border border-black dark:border-white inline-block" />
          <span>Mixed / Partial</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#10b981] border border-black dark:border-white inline-block" />
          <span>Weak / Contested</span>
        </span>
      </div>

      {/* SVG Interactive Canvas */}
      <div className={`relative border-2 border-black dark:border-venom-slime rounded-lg p-3 sm:p-5 overflow-hidden ${
        theme === "venom" ? "bg-black" : "bg-paper-blue/15"
      }`}>
        <svg
          viewBox="0 0 1040 320"
          className="w-full h-auto overflow-visible select-none"
        >
          <style>{`
            .ragetrack {
              fill: none;
              stroke: ${theme === "venom" ? "rgba(132, 204, 22, 0.3)" : "rgba(0, 0, 0, 0.25)"};
              stroke-width: 3;
              stroke-dasharray: 6 4;
            }
            .rageloop-pulse {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              position: absolute;
              top: 0;
              left: 0;
              background: #ef4444;
              border: 2px solid #000;
              box-shadow: 0 0 14px 4px rgba(239, 68, 68, 0.7);
              offset-path: path("M60,150 C220,50 380,50 520,150 C660,250 820,250 980,150 C1090,80 1090,220 980,150");
              offset-rotate: 0deg;
              animation: travelPulse 8s linear infinite;
            }
            @keyframes travelPulse {
              0% { offset-distance: 0%; transform: scale(1); }
              10% { transform: scale(1.6); }
              25% { transform: scale(2.6); }
              45% { transform: scale(1.8); }
              65% { transform: scale(1.7); }
              85% { transform: scale(0.85); }
              100% { offset-distance: 100%; transform: scale(1); }
            }
            @media (prefers-reduced-motion: reduce) {
              .rageloop-pulse { animation: none; offset-distance: 25%; }
            }
          `}</style>

          {/* Background Loop Path */}
          <path
            className="ragetrack"
            d="M60,150 C220,50 380,50 520,150 C660,250 820,250 980,150 C1090,80 1090,220 980,150"
          />

          {/* Node 01: Trigger */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveIdx(0)}
          >
            <circle
              cx="60"
              cy="150"
              r="28"
              fill={activeIdx === 0 ? "#fef08a" : theme === "venom" ? "#18181b" : "#fff"}
              stroke={activeIdx === 0 ? "#000" : theme === "venom" ? "#84cc16" : "#000"}
              strokeWidth={activeIdx === 0 ? "4" : "2"}
            />
            <circle cx="60" cy="122" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
            <text x="60" y="156" textAnchor="middle" className="font-mono font-black text-xs" fill={theme === "venom" && activeIdx !== 0 ? "#fff" : "#000"}>
              01
            </text>
            <text x="60" y="195" textAnchor="middle" className="font-mono font-bold text-xs" fill={theme === "venom" ? "#fff" : "#000"}>
              Trigger
            </text>
          </g>

          {/* Node 02: Arousal */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveIdx(1)}
          >
            <circle
              cx="290"
              cy="75"
              r="32"
              fill={activeIdx === 1 ? "#fef08a" : theme === "venom" ? "#18181b" : "#fff"}
              stroke={activeIdx === 1 ? "#000" : theme === "venom" ? "#84cc16" : "#000"}
              strokeWidth={activeIdx === 1 ? "4" : "2"}
            />
            <circle cx="290" cy="42" r="6" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
            <text x="290" y="81" textAnchor="middle" className="font-mono font-black text-sm" fill={theme === "venom" && activeIdx !== 1 ? "#fff" : "#000"}>
              02
            </text>
            <text x="290" y="125" textAnchor="middle" className="font-mono font-black text-xs" fill="#ef4444">
              Arousal (Spike)
            </text>
          </g>

          {/* Node 03: Sharing */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveIdx(2)}
          >
            <circle
              cx="520"
              cy="150"
              r="28"
              fill={activeIdx === 2 ? "#fef08a" : theme === "venom" ? "#18181b" : "#fff"}
              stroke={activeIdx === 2 ? "#000" : theme === "venom" ? "#84cc16" : "#000"}
              strokeWidth={activeIdx === 2 ? "4" : "2"}
            />
            <circle cx="520" cy="122" r="5" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
            <text x="520" y="156" textAnchor="middle" className="font-mono font-black text-xs" fill={theme === "venom" && activeIdx !== 2 ? "#fff" : "#000"}>
              03
            </text>
            <text x="520" y="195" textAnchor="middle" className="font-mono font-bold text-xs" fill={theme === "venom" ? "#fff" : "#000"}>
              Sharing
            </text>
          </g>

          {/* Node 04: Ranking */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveIdx(3)}
          >
            <circle
              cx="750"
              cy="225"
              r="28"
              fill={activeIdx === 3 ? "#fef08a" : theme === "venom" ? "#18181b" : "#fff"}
              stroke={activeIdx === 3 ? "#000" : theme === "venom" ? "#84cc16" : "#000"}
              strokeWidth={activeIdx === 3 ? "4" : "2"}
            />
            <circle cx="750" cy="197" r="5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
            <text x="750" y="231" textAnchor="middle" className="font-mono font-black text-xs" fill={theme === "venom" && activeIdx !== 3 ? "#fff" : "#000"}>
              04
            </text>
            <text x="750" y="270" textAnchor="middle" className="font-mono font-bold text-xs" fill={theme === "venom" ? "#fff" : "#000"}>
              Ranking
            </text>
          </g>

          {/* Node 05: Exposure */}
          <g
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setActiveIdx(4)}
          >
            <circle
              cx="980"
              cy="150"
              r="28"
              fill={activeIdx === 4 ? "#fef08a" : theme === "venom" ? "#18181b" : "#fff"}
              stroke={activeIdx === 4 ? "#000" : theme === "venom" ? "#84cc16" : "#000"}
              strokeWidth={activeIdx === 4 ? "4" : "2"}
            />
            <circle cx="980" cy="122" r="5" fill="#10b981" stroke="#000" strokeWidth="1.5" />
            <text x="980" y="156" textAnchor="middle" className="font-mono font-black text-xs" fill={theme === "venom" && activeIdx !== 4 ? "#fff" : "#000"}>
              05
            </text>
            <text x="980" y="195" textAnchor="middle" className="font-mono font-bold text-xs" fill={theme === "venom" ? "#fff" : "#000"}>
              Exposure
            </text>
          </g>

        </svg>

        {/* CSS Path Traveler Pulse */}
        <div className="rageloop-pulse" />
      </div>

      {/* Active Detail Panel */}
      <div className="mt-5 pt-5 border-t-2 border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-start gap-4">
        <span className={`px-3 py-1 border-2 font-mono font-black text-xs uppercase tracking-wider ${getBadgeStyle(current.badge)}`}>
          {current.badgeLabel}
        </span>
        <div className="space-y-2 flex-1">
          <h4 className="text-base sm:text-lg font-black tracking-tight">
            {current.title}
          </h4>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-zinc-800 dark:text-gray-200">
            {current.body}
          </p>
          <div className="p-2 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-mono text-[11px] text-zinc-600 dark:text-gray-400">
            <span className="font-bold uppercase tracking-wider text-black dark:text-white mr-2">Citation:</span>
            {current.cite}
          </div>
        </div>
      </div>

      {/* Crawlable Full Loop Summary */}
      <details className="mt-5 pt-3 border-t border-dashed border-black/20 dark:border-white/20 text-xs font-mono">
        <summary className="cursor-pointer font-bold text-zinc-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
          View Complete 5-Stage Transmission Breakdown (Text Summary)
        </summary>
        <div className="mt-3 grid gap-2.5">
          {DATA.map((node, i) => (
            <div key={i} className="p-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-black dark:text-white">{node.title}</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${getBadgeStyle(node.badge)}`}>
                  {node.badgeLabel}
                </span>
              </div>
              <div className="font-sans text-xs text-zinc-700 dark:text-gray-300 mb-1">{node.body}</div>
              <div className="text-[10px] text-zinc-500 dark:text-gray-400">{node.cite}</div>
            </div>
          ))}
        </div>
      </details>

    </div>
  );
}
