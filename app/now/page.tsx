"use client";

import Navigation from "@/components/navigation";
import { useThemeStore } from "@/store/useThemeStore";
import { motion } from "framer-motion";
import { Clock, GraduationCap, Rocket, Share2, BookOpen, ArrowLeft, CheckCircle2, ChevronRight, Zap, Award, BarChart3, AlertTriangle, Layers } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NowPage() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lastUpdated = "September 2026";

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'venom' ? 'bg-zinc-950 text-white' : 'bg-paper-pattern text-zinc-900'}`}>
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-24">
        {/* Back button */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 font-bold px-4 py-2 rounded-lg border-2 mb-8 transition-all hover:-translate-x-1 ${
            theme === 'venom'
              ? 'border-venom-slime text-venom-slime bg-black hover:bg-venom-slime/10'
              : 'border-black bg-white text-black shadow-neobrutalism-sm hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-mono font-bold rounded border-2 uppercase ${
              theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-yellow-300 text-black border-black shadow-neobrutalism-sm'
            }`}>
              Live Status Log
            </span>
            <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
              <Clock size={12} /> Updated {lastUpdated}
            </span>
          </div>

          <h1 className={`text-4xl md:text-6xl font-black tracking-tight mb-4 ${theme === 'venom' ? 'text-venom-slime' : 'text-black'}`}>
            {theme === 'venom' ? "HOST MUTATION & ACTIVE TELEMETRY" : "What I'm Doing Now"}
          </h1>
          <p className={`text-lg font-hand max-w-3xl ${theme === 'venom' ? 'text-gray-400' : 'text-zinc-600'}`}>
            {theme === 'venom'
              ? "Current host objectives: GATE exam preparation, SaaS deployment, social brand expansion, and deep physical AI research."
              : "Inspired by Derek Sivers' /now movement. A real-time breakdown of my active engineering goals, exam prep, SaaS product, and deep AI/ML research papers."}
          </p>
        </motion.div>

        {/* Main 3 Focus Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* 1. GATE Exam Prep */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-xl border-4 flex flex-col ${
              theme === 'venom'
                ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]'
                : 'bg-amber-50 border-black shadow-neobrutalism'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg border-2 ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-amber-300 border-black'}`}>
                <GraduationCap size={22} />
              </div>
              <h2 className="text-xl font-black">GATE Exam Prep</h2>
            </div>
            <p className={`text-sm mb-4 font-medium ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-700'}`}>
              Preparing for <strong>GATE 2027</strong> across dual streams:
            </p>
            <ul className={`space-y-2 text-xs font-mono font-bold mt-auto ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-800'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> CSE (Computer Science & Engg)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> DA (Data Science & AI)
              </li>
            </ul>
          </motion.div>

          {/* 2. SaaS Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-xl border-4 flex flex-col ${
              theme === 'venom'
                ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]'
                : 'bg-purple-50 border-black shadow-neobrutalism'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg border-2 ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-purple-300 border-black'}`}>
                <Rocket size={22} />
              </div>
              <h2 className="text-xl font-black">SaaS Product</h2>
            </div>
            <p className={`text-sm mb-4 font-medium ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-700'}`}>
              Designing and building an upcoming SaaS product targeting developer workflows & automation.
            </p>
            <div className={`mt-auto text-xs font-mono font-bold px-3 py-1.5 rounded border-2 w-fit ${
              theme === 'venom' ? 'bg-black border-venom-slime/50 text-venom-slime' : 'bg-white border-black'
            }`}>
              🚀 In Stealth Development
            </div>
          </motion.div>

          {/* 3. Social Media & Personal Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 rounded-xl border-4 flex flex-col ${
              theme === 'venom'
                ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]'
                : 'bg-blue-50 border-black shadow-neobrutalism'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg border-2 ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-blue-300 border-black'}`}>
                <Share2 size={22} />
              </div>
              <h2 className="text-xl font-black">Personal Brand</h2>
            </div>
            <p className={`text-sm mb-4 font-medium ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-700'}`}>
              Consistently sharing engineering insights, AI research, and build-in-public updates across:
            </p>
            <div className="flex flex-wrap gap-2 mt-auto text-xs font-bold font-mono">
              <span className={`px-2.5 py-1 rounded border ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-white border-black'}`}>LinkedIn</span>
              <span className={`px-2.5 py-1 rounded border ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-white border-black'}`}>X / Twitter</span>
              <span className={`px-2.5 py-1 rounded border ${theme === 'venom' ? 'bg-black border-venom-slime text-venom-slime' : 'bg-white border-black'}`}>Instagram</span>
            </div>
          </motion.div>
        </div>

        {/* SECTION: Deep Research & Papers Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className={theme === 'venom' ? 'text-venom-slime' : 'text-purple-600'} size={28} />
            <h2 className="text-3xl font-black tracking-tight">Active Reading & Research Papers</h2>
          </div>
          <p className={`text-base leading-relaxed mb-8 ${theme === 'venom' ? 'text-gray-300' : 'text-zinc-700'}`}>
            Deep technical breakdown of 5 essential papers in <strong>Graph Neural Networks, Optimization Solvers, Weather AI, and Energy Systems</strong>:
          </p>

          <div className="space-y-8">

            {/* PAPER 1 */}
            <div className={`p-6 rounded-xl border-4 transition-all ${
              theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black shadow-neobrutalism'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded border ${
                  theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-purple-200 text-purple-900 border-black'
                }`}>Paper #1</span>
                <span className="text-xs font-mono text-gray-500">Dhruv Suri, Mohak Mangal</span>
              </div>
              <h3 className="text-2xl font-black mb-2">PowerGNN — Topology-Aware GNN for Electricity Grids</h3>
              
              <div className="space-y-3 text-sm leading-relaxed mt-4">
                <p><strong>The Problem:</strong> Traditional ML flattens grid nodes into flat vectors, ignoring physical connections (buses & transmission lines), causing severe errors as variable renewables increase.</p>
                <p><strong>The Core Idea:</strong> Model physical topology explicitly: <em>Nodes = buses, Edges = lines</em>. Combines <strong>GraphSAGE (spatial)</strong> + <strong>GRU (temporal)</strong> across 48 past time steps to predict voltage, angle, active power ($P$), and reactive power ($Q$).</p>
                
                <div className={`p-4 rounded-lg border-2 font-mono text-xs overflow-x-auto my-3 ${
                  theme === 'venom' ? 'bg-black border-venom-slime/30 text-green-400' : 'bg-gray-50 border-black'
                }`}>
                  <p className="font-bold mb-2 text-zinc-900 dark:text-venom-slime">NREL-118 System Benchmark Results:</p>
                  <p>• PowerGNN Voltage Mag. RMSE: 0.157 (vs Standard NN 0.802 — 73.5% error reduction)</p>
                  <p>• Under High Load: PowerGNN RMSE increases only 7.3% (vs 16.7%–23.1% for baselines)</p>
                </div>
                <p className="italic text-xs opacity-90"><strong>One-line Takeaway:</strong> Knowing *who is connected to whom* substantially improves physical power-grid state forecasting.</p>
              </div>
            </div>

            {/* PAPER 2 */}
            <div className={`p-6 rounded-xl border-4 transition-all ${
              theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black shadow-neobrutalism'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded border ${
                  theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-blue-200 text-blue-900 border-black'
                }`}>Paper #2</span>
                <span className="text-xs font-mono text-gray-500">Aman Gupta, Aditi Sheshadri, Dhruv Suri</span>
              </div>
              <h3 className="text-2xl font-black mb-2">MAUSAM — Testing AI Weather Models Against Real Ground Observations</h3>
              
              <div className="space-y-3 text-sm leading-relaxed mt-4">
                <p><strong>The Problem:</strong> Global AI weather models (GraphCast, AIFS, Pangu, GenCast) are evaluated against ERA5 reanalysis data—which they were trained on—creating an evaluation feedback loop.</p>
                <p><strong>The Benchmark:</strong> Evaluated 7 AI weather models against <strong>458 ground stations</strong>, rain gauges, and satellites over the South Asian Monsoon.</p>
                <p><strong>Major Finding:</strong> When evaluated against <em>actual ground observations</em>, model errors are <strong>15–45% larger</strong> than when evaluated against reanalysis data. <strong>AIFS</strong> proved strongest overall deterministic model, while GraphCast underestimated extreme rainfall.</p>
                <p className="italic text-xs opacity-90"><strong>One-line Takeaway:</strong> AI weather forecasting is powerful, but we shouldn't trust benchmark numbers until tested against real ground observations.</p>
              </div>
            </div>

            {/* PAPER 3 */}
            <div className={`p-6 rounded-xl border-4 transition-all ${
              theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black shadow-neobrutalism'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded border ${
                  theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-amber-200 text-amber-900 border-black'
                }`}>Paper #3</span>
                <span className="text-xs font-mono text-gray-500">Dhruv Suri, Helgi Hilmarsson, Shourya Bose</span>
              </div>
              <h3 className="text-2xl font-black mb-2">WARP — Primal-Dual Warm-Starting of Interior-Point Solvers</h3>
              
              <div className="space-y-3 text-sm leading-relaxed mt-4">
                <p><strong>The Discovery:</strong> Previous papers claimed ML warm-starts reduced IPOPT iterations by 30-46%, but they compared against an artificial flat start (Vm=1, Va=0) instead of IPOPT's true default midpoint x0 = (l+u)/2. When compared to default midpoint, primal-only ML warm starts actually made convergence worse!</p>
                <p><strong>The Solution:</strong> Predict the complete <strong>primal-dual-barrier state</strong> (x_hat, lambda_hat, z_hat, mu_hat) including constraint multipliers and barrier parameters.</p>
                
                <div className={`p-4 rounded-lg border-2 font-mono text-xs overflow-x-auto my-3 ${
                  theme === 'venom' ? 'bg-black border-venom-slime/30 text-green-400' : 'bg-gray-50 border-black'
                }`}>
                  <p className="font-bold mb-2 text-zinc-900 dark:text-venom-slime">IPOPT Iterations Benchmark (case118):</p>
                  <p>• Cold Start: 22.6 iterations</p>
                  <p>• WARP Primal-Only: 21.1 iterations (+7%)</p>
                  <p>• WARP Primal-Dual: 5.4 iterations (76% reduction!)</p>
                </div>
                <p className="italic text-xs opacity-90"><strong>One-line Takeaway:</strong> Predicting the solution isn't enough—you must predict the solver's entire primal-dual state.</p>
              </div>
            </div>

            {/* PAPER 4 */}
            <div className={`p-6 rounded-xl border-4 transition-all ${
              theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black shadow-neobrutalism'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded border ${
                  theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-emerald-200 text-emerald-900 border-black'
                }`}>Paper #4</span>
                <span className="text-xs font-mono text-gray-500">Shourya Bose, Helgi Hilmarsson, Dhruv Suri</span>
              </div>
              <h3 className="text-2xl font-black mb-2">Newton's Lantern — Reinforcement Learning for Newton Warm-Starts</h3>
              
              <div className="space-y-3 text-sm leading-relaxed mt-4">
                <p><strong>Core Discovery:</strong> Prediction distance error e0 = x0 - x* = ρv is NOT a good measure of Newton-Raphson convergence. The error <em>direction</em> v dictates convergence far more than distance magnitude ρ, especially near voltage collapse where Jacobian σ_min(J) → 0.</p>
                <p><strong>The RL Pipeline:</strong> Replaces supervised distance loss with <strong>GRPO Reinforcement Learning</strong> where Reward = negative solver iteration count.</p>
                <p><strong>Result:</strong> Produces starting points that are mathematically <em>further</em> from true solution but converge significantly faster. Only method to converge 100% on all 2000-bus test grids.</p>
                <p className="italic text-xs opacity-90"><strong>One-line Takeaway:</strong> Replaces "predict mathematically correct answer" with "learn the starting point that makes the numerical solver behave best."</p>
              </div>
            </div>

            {/* PAPER 5 */}
            <div className={`p-6 rounded-xl border-4 transition-all ${
              theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]' : 'bg-white border-black shadow-neobrutalism'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded border ${
                  theme === 'venom' ? 'bg-venom-slime text-black border-venom-slime' : 'bg-pink-200 text-pink-900 border-black'
                }`}>Paper #5</span>
                <span className="text-xs font-mono text-gray-500">Karan Jakhar, Aman Gupta, Helgi Hilmarsson, Dhruv Suri</span>
              </div>
              <h3 className="text-2xl font-black mb-2">INDUS — Nowcasting Weather for Renewable Energy in India</h3>
              
              <div className="space-y-3 text-sm leading-relaxed mt-4">
                <p><strong>The Problem:</strong> Solar and wind generators require hourly updates to avoid severe financial deviation penalties (up to 48% revenue loss under Grid-India rules), while global NWP models update only 2-4 times daily.</p>
                <p><strong>The System:</strong> Fuses <strong>geostationary satellite imagery</strong> + <strong>ground stations</strong> + <strong>operational NWP</strong> into an hourly re-initialized model predicting GHI, 2m temp, 10m wind, and 100m wind up to 48 hours ahead.</p>
                <p><strong>Impact:</strong> Outperforms ECMWF IFS-HRES and NOAA GFS across full 48-hr horizon over Indian solar parks & wind clusters.</p>
                <p className="italic text-xs opacity-90"><strong>One-line Takeaway:</strong> Turns AI weather forecasting into an hourly operational tool specifically designed around India's renewable energy problem.</p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Synthesized Research Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`p-8 rounded-xl border-4 ${
            theme === 'venom'
              ? 'bg-black border-venom-slime shadow-[0_0_25px_rgba(132,204,22,0.3)]'
              : 'bg-zinc-900 text-white border-black shadow-neobrutalism'
          }`}
        >
          <h3 className={`text-2xl font-black mb-4 flex items-center gap-2 ${theme === 'venom' ? 'text-venom-slime' : 'text-yellow-300'}`}>
            <Zap size={24} /> Research Synthesis & Key Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <span className="font-bold text-base block font-mono text-venom-slime">1. Structure Matters</span>
              <p className="opacity-80">A physical system (power grid, weather, circuits) shouldn't be flattened into an ordinary vector—embed topology as an inductive bias.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-base block font-mono text-venom-slime">2. Benchmarking Matters</span>
              <p className="opacity-80">Models look deceptively good if evaluated against self-referential reanalysis data rather than real ground observations.</p>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-base block font-mono text-venom-slime">3. Downstream Objectives</span>
              <p className="opacity-80">Mathematically closest prediction ≠ highest numerical solver performance. Optimize directly for solver convergence.</p>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className={`py-8 text-center border-t-2 transition-colors ${theme === 'venom' ? 'bg-venom-black border-venom-slime' : 'bg-white border-black'}`}>
        <p className={`font-hand font-bold text-lg ${theme === 'venom' ? 'text-venom-slime' : 'text-black'}`}>
          {theme === 'venom' ? "WE are ONE. 🕷️" : "Designed with 💜 & ☕ by Vaibhav. © 2025"}
        </p>
      </footer>
    </div>
  );
}
