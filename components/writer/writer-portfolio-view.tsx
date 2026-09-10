"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Send,
  Mail,
  Copy,
  Check,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Loader2,
} from "lucide-react";
import { Post } from "@/lib/mdx";
import { useThemeStore } from "@/store/useThemeStore";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

interface WriterPortfolioViewProps {
  posts: Post[];
}

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const CATEGORIES = [
  "All",
  "Research & Essays",
  "AI",
  "Internet Culture",
  "Technical Content",
  "Technology",
  "Business",
];

const TOPIC_DETAILS = [
  {
    title: "Technology",
    tag: "Technology",
    color: "bg-paper-blue/40 dark:bg-sky-950/40",
    badgeColor: "bg-paper-blue text-black",
    desc: "Explainers, trends, technical concepts, emerging technologies, and the systems behind them.",
    question: "What makes a technology genuinely useful versus momentarily hyped?",
  },
  {
    title: "Artificial Intelligence",
    tag: "AI",
    color: "bg-paper-pink/40 dark:bg-purple-950/40",
    badgeColor: "bg-paper-pink text-black",
    desc: "AI products, workflows, research papers, business implications, and the changing relationship between humans and machines.",
    question: "How does AI fundamentally reshape cognitive workflows?",
  },
  {
    title: "Business & Markets",
    tag: "Business",
    color: "bg-paper-yellow/40 dark:bg-amber-950/40",
    badgeColor: "bg-paper-yellow text-black",
    desc: "Startups, products, markets, business models, incentives, and the economics behind modern software.",
    question: "What happens when business incentives collide with human psychology?",
  },
  {
    title: "Internet Culture",
    tag: "Internet Culture",
    color: "bg-emerald-100 dark:bg-emerald-950/40",
    badgeColor: "bg-emerald-300 text-black",
    desc: "Platforms, algorithms, attention economics, online behavior, digital communities, and the strange psychology of the internet.",
    question: "Why does the modern internet reward moral outrage and friction?",
  },
  {
    title: "Research & Essays",
    tag: "Research & Essays",
    color: "bg-purple-100 dark:bg-indigo-950/40",
    badgeColor: "bg-purple-300 text-black",
    desc: "Deep dives into questions that don't have simple answers, synthesizing multi-disciplinary evidence.",
    question: "What is the story underneath the headline?",
  },
  {
    title: "Technical Content",
    tag: "Technical Content",
    color: "bg-orange-100 dark:bg-orange-950/40",
    badgeColor: "bg-orange-300 text-black",
    desc: "Clear explanations of complex technical architectures for readers who don't necessarily have a specialized background.",
    question: "How do you explain hard engineering without dumbing it down?",
  },
];

const PROCESS_STEPS = [
  {
    num: "01",
    name: "Question",
    summary: "Start with a question worth answering.",
    detail:
      "Rather than following daily trending keywords, every piece begins with a fundamental inquiry about systems, incentives, or human behavior.",
    bg: "bg-paper-yellow",
  },
  {
    num: "02",
    name: "Research",
    summary: "Go beyond the first page of Google.",
    detail:
      "Dive into peer-reviewed papers, primary source documents, regulatory filings, expert interviews, and technical codebases to establish ground truth.",
    bg: "bg-paper-blue",
  },
  {
    num: "03",
    name: "Synthesis",
    summary: "Connect evidence & separate signal from noise.",
    detail:
      "Map out conflicting viewpoints, stress-test assumptions, and distill massive information density into an airtight structural narrative.",
    bg: "bg-paper-pink",
  },
  {
    num: "04",
    name: "Writing",
    summary: "Turn research into writing people want to finish.",
    detail:
      "Craft engaging prose with sharp cadence, vivid metaphors, clear diagrams, and zero filler. Good writing makes the reader understand more.",
    bg: "bg-emerald-200",
  },
];

const SERVICES = [
  {
    title: "Long-Form Articles",
    desc: "Deep, research-driven articles designed to educate, hold attention, and establish lasting authority in your space.",
    deliverables: "3,000–6,000 words • Multi-source citations • Custom diagrams",
    tag: "In-Depth",
  },
  {
    title: "Technical Explainers",
    desc: "Complex architectures, algorithms, and developer tools explained in crisp language that engineers respect and executives understand.",
    deliverables: "System breakdowns • Code & workflow walkthroughs • Educational clarity",
    tag: "Clarity",
  },
  {
    title: "Research-Driven Essays",
    desc: "Evidence-backed investigations into emerging technologies, market dynamics, and cultural shifts.",
    deliverables: "Literature reviews • Data synthesis • Original investigative framing",
    tag: "Investigation",
  },
  {
    title: "Thought Leadership",
    desc: "Nuanced, high-conviction perspectives backed by data, historical precedent, and market reality—not hollow buzzwords.",
    deliverables: "Founder essays • Executive points of view • Strategic market theses",
    tag: "Strategy",
  },
  {
    title: "Product & Technology Content",
    desc: "Content that explains what your product actually does, why the architecture matters, and where it fits in the market.",
    deliverables: "Product launch deep-dives • Architectural teardowns • Feature essays",
    tag: "Product",
  },
  {
    title: "Research & Content Strategy",
    desc: "Helping technical founders and editorial teams discover compelling research angles, story arcs, and high-signal editorial roadmaps.",
    deliverables: "Editorial roadmaps • Angle discovery • Research briefs",
    tag: "Advisory",
  },
];

const PHILOSOPHY_POINTS = [
  {
    q: "What's actually true?",
    a: "Stripping away PR spin and echo chambers to examine verified primary sources.",
    tag: "Truth",
    color: "bg-paper-yellow",
  },
  {
    q: "What does the evidence say?",
    a: "Prioritizing empirical data and peer-reviewed literature over speculative opinion.",
    tag: "Evidence",
    color: "bg-paper-blue",
  },
  {
    q: "What are people getting wrong?",
    a: "Identifying consensus blindspots and unexamined assumptions.",
    tag: "Perspective",
    color: "bg-paper-pink",
  },
  {
    q: "What's the story underneath?",
    a: "Tracing the hidden financial, biological, and systemic incentives driving the outcome.",
    tag: "Systems",
    color: "bg-emerald-200",
  },
  {
    q: "Why should anyone care?",
    a: "Connecting abstract mechanics directly to human impact and future implications.",
    tag: "Impact",
    color: "bg-orange-200",
  },
];

export default function WriterPortfolioView({ posts }: WriterPortfolioViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const { theme } = useThemeStore();

  const email = "14vaibhav2002@gmail.com";
  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  const flagshipPost =
    posts.find((p) => p.slug === "the-business-of-making-you-angry") || posts[0];

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === "All") return true;
    const cat = post.meta.category || "";
    const topics = post.meta.topics || [];
    return cat === selectedCategory || topics.includes(selectedCategory);
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className={`min-h-screen font-sans ${theme === "venom" ? "venom bg-venom-black text-venom-white" : "bg-[#fbfbfb] text-zinc-900"} relative selection:bg-paper-yellow dark:selection:bg-venom-slime dark:selection:text-black`}>
      
      {/* Background Grid Texture */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.1]"
        style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: "40px 40px" }}
      />

      {/* ─── MASTHEAD / NEOBRUTALIST NAV ─── */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b-4 transition-colors ${theme === "venom" ? "bg-black/90 border-venom-slime text-white" : "bg-white/95 border-black text-black"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/blog" className="group flex items-center gap-3">
            <div className={`w-10 h-10 border-2 font-black text-lg flex items-center justify-center shadow-neobrutalism-sm -rotate-2 group-hover:rotate-0 transition-transform ${theme === "venom" ? "bg-venom-slime text-black border-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-yellow text-black border-black"}`}>
              V
            </div>
            <div>
              <span className="font-black text-xl tracking-tight block leading-none">
                VAIBHAV
              </span>
              <span className={`text-[11px] font-bold tracking-widest uppercase font-mono block mt-1 ${theme === "venom" ? "text-venom-slime" : "text-purple-700"}`}>
                Writer · Researcher
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <a href="#selected-writing" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              Writing
            </a>
            <a href="#about" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              About
            </a>
            <a href="#topics" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              Topics
            </a>
            <a href="#process" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              Process
            </a>
            <a href="#services" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              Services
            </a>
            <a href="#contact" className={`hover:underline decoration-2 ${theme === "venom" ? "hover:text-venom-slime decoration-venom-slime" : "hover:text-purple-600 decoration-black"}`}>
              Contact
            </a>
            <a href="#contact" className={`font-bold text-sm underline underline-offset-4 decoration-2 transition-colors ${theme === "venom" ? "text-venom-slime hover:text-white decoration-venom-slime" : "text-purple-600 hover:text-black decoration-purple-600"}`}>
              Hire Me
            </a>
          </nav>
        </div>
      </header>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 border-b-4 border-black dark:border-venom-slime">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Neobrutalist Sticker Badge */}
          <div className="inline-block mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 border-2 font-mono font-bold text-xs uppercase tracking-wider shadow-neobrutalism -rotate-1 ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-venom-slime shadow-[3px_3px_0px_0px_#84cc16]" : "bg-paper-yellow border-black text-black shadow-neobrutalism-sm"}`}>
              <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-venom-slime animate-pulse" />
              CONTENT WRITER · RESEARCHER · STORYTELLER
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6">
            Words That Make <br className="hidden sm:inline" />
            <span className={`inline-block px-3 py-1 my-1 border-2 border-black rotate-1 shadow-neobrutalism ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[4px_4px_0px_0px_white]" : "bg-paper-pink text-black"}`}>
              Complex Things
            </span>{" "}
            Clear.
          </h1>

          {/* Subtitle */}
          <p className={`text-xl sm:text-2xl font-bold font-hand max-w-2xl mx-auto leading-relaxed mb-6 ${theme === "venom" ? "text-gray-300" : "text-zinc-800"}`}>
            Research-driven content for technology, business, and the ideas shaping the internet.
          </p>

          {/* Supporting Copy */}
          <div className={`p-4 border-2 max-w-2xl mx-auto mb-10 shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-gray-300 shadow-[2px_2px_0px_0px_#84cc16]" : "bg-white border-black text-zinc-700"}`}>
            <p className="text-base sm:text-lg font-medium leading-relaxed">
              I turn complex subjects into clear, engaging stories—combining serious research with writing that people actually want to finish.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#selected-writing"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-black text-base uppercase tracking-wider shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${theme === "venom" ? "bg-venom-slime text-black border-venom-slime shadow-[4px_4px_0px_0px_white]" : "bg-black text-white border-black"}`}
            >
              <span>Read My Work</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#contact"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-black text-base uppercase tracking-wider shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${theme === "venom" ? "bg-zinc-900 text-white border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]" : "bg-white text-black border-black"}`}
            >
              <span>Work With Me</span>
            </a>
          </div>

          {/* Credibility Metrics Bar */}
          <div className="mt-16 pt-8 border-t-2 border-black/10 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className={`p-4 border-2 shadow-neobrutalism-sm -rotate-1 ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-yellow border-black"}`}>
              <span className="block text-3xl font-black text-black dark:text-white">6+</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-800 dark:text-gray-300">Deep Essays</span>
            </div>
            <div className={`p-4 border-2 shadow-neobrutalism-sm rotate-1 ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-blue border-black"}`}>
              <span className="block text-3xl font-black text-black dark:text-white">80+</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-800 dark:text-gray-300">Cited Sources</span>
            </div>
            <div className={`p-4 border-2 shadow-neobrutalism-sm -rotate-1 ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-pink border-black"}`}>
              <span className="block text-3xl font-black text-black dark:text-white">0%</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-800 dark:text-gray-300">Generic Fluff</span>
            </div>
            <div className={`p-4 border-2 shadow-neobrutalism-sm rotate-1 ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[2px_2px_0px_0px_#84cc16]" : "bg-emerald-200 border-black"}`}>
              <span className="block text-3xl font-black text-black dark:text-white">100%</span>
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-800 dark:text-gray-300">Human Clarity</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. ABOUT SECTION ─── */}
      <section id="about" className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime bg-paper-blue/20 dark:bg-black/40">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-start">
            
            {/* Left Header */}
            <div className="md:col-span-5 space-y-4">
              <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm -rotate-2 ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-yellow border-black text-black"}`}>
                The Writer
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                I’m curious about how things work.
              </h2>
              <p className="text-sm font-bold font-mono leading-relaxed pt-2 text-zinc-600 dark:text-gray-400">
                My writing sits at the intersection of:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className={`px-3 py-1.5 border-2 font-mono font-bold text-xs shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-white shadow-[2px_2px_0px_0px_#84cc16]" : "bg-white border-black text-black"}`}>
                  Technology
                </span>
                <span className={`px-3 py-1.5 border-2 font-mono font-bold text-xs shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-white shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-yellow border-black text-black"}`}>
                  Business
                </span>
                <span className={`px-3 py-1.5 border-2 font-mono font-bold text-xs shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-white shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-pink border-black text-black"}`}>
                  Research
                </span>
                <span className={`px-3 py-1.5 border-2 font-mono font-bold text-xs shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-white shadow-[2px_2px_0px_0px_#84cc16]" : "bg-paper-blue border-black text-black"}`}>
                  Culture
                </span>
              </div>
            </div>

            {/* Right Narrative */}
            <div className={`md:col-span-7 p-6 sm:p-8 border-4 shadow-neobrutalism space-y-6 ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]" : "bg-white border-black"}`}>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                I like taking subjects that initially feel complicated, technical, or difficult to explain—and figuring out how to make them understandable without making them boring.
              </p>
              
              <div className="space-y-2.5 pl-4 border-l-4 border-black dark:border-venom-slime font-hand text-lg sm:text-xl font-bold text-zinc-800 dark:text-gray-200">
                <div>• Why do algorithms behave the way they do?</div>
                <div>• Why do certain products become habits?</div>
                <div>• Why does the internet reward outrage?</div>
                <div>• How does AI change the way we work?</div>
                <div>• What makes a technology genuinely useful?</div>
                <div>• And what happens when business incentives collide with human psychology?</div>
              </div>

              {/* Manifesto Card */}
              <div className={`p-4 border-2 shadow-neobrutalism-sm ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-yellow border-black text-black"}`}>
                <span className="text-xs font-mono uppercase tracking-wider font-bold block mb-1">
                  My Approach:
                </span>
                <p className="text-lg font-black">
                  Research first. Think carefully. Write clearly.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. FLAGSHIP RESEARCH ESSAY SPOTLIGHT ─── */}
      <section className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b-2 border-black/10 dark:border-white/10 gap-4">
            <div>
              <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm -rotate-1 mb-2 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-pink border-black text-black"}`}>
                Flagship Project
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Featured Investigation
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-500 dark:text-gray-400">
              Published Feb 2026 · Literature Review & Systems Analysis
            </span>
          </div>

          <div className={`border-4 p-8 sm:p-12 shadow-neobrutalism relative overflow-hidden transition-all ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[6px_6px_0px_0px_#84cc16]" : "bg-white border-black"}`}>
            
            <div className="grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8 space-y-5">
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                  <span className={`px-2.5 py-1 border-2 shadow-neobrutalism-sm ${theme === "venom" ? "bg-venom-slime text-black border-venom-slime" : "bg-paper-yellow border-black text-black"}`}>
                    Research Essay
                  </span>
                  <span className={`px-2.5 py-1 border-2 ${theme === "venom" ? "bg-black border-venom-slime text-white" : "bg-paper-blue border-black text-black"}`}>
                    24 Sources Cited
                  </span>
                  <span className={`px-2.5 py-1 border-2 ${theme === "venom" ? "bg-black border-venom-slime text-white" : "bg-paper-pink border-black text-black"}`}>
                    2 Weeks Research
                  </span>
                  <span className={`px-2.5 py-1 border-2 ${theme === "venom" ? "bg-black border-venom-slime text-white" : "bg-emerald-200 border-black text-black"}`}>
                    12 min read
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                    <Link href={`/blog/${flagshipPost.slug}`} className="hover:underline decoration-4">
                      {flagshipPost.meta.title}
                    </Link>
                  </h3>
                  <p className={`text-lg sm:text-xl font-hand font-bold mt-2 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>
                    {flagshipPost.meta.subtitle || "Does the internet actually profit from anger?"}
                  </p>
                </div>

                {/* Excerpt */}
                <p className="text-base leading-relaxed text-zinc-700 dark:text-gray-300 font-medium">
                  Anger is one of the internet&apos;s most profitable emotions—or at least that&apos;s what we&apos;re told. But what happens when we follow the claim all the way down?
                </p>
                <p className="text-base leading-relaxed text-zinc-700 dark:text-gray-300 font-medium">
                  From moral outrage and human psychology to recommendation algorithms, creator incentives, and the economics of attention, this investigation asks a deceptively simple question: <strong>Does the internet make money by making us angry?</strong>
                </p>

                {/* Primary CTA */}
                <div className="pt-2">
                  <Link
                    href={`/blog/${flagshipPost.slug}`}
                    className={`inline-flex items-center gap-2 px-6 py-3.5 border-2 font-black text-sm uppercase tracking-wider shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all ${theme === "venom" ? "bg-venom-slime text-black border-venom-slime shadow-[4px_4px_0px_0px_white]" : "bg-black text-white border-black"}`}
                  >
                    <span>Read Flagship Essay</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

              {/* Right Checklist Card */}
              <div className={`md:col-span-4 p-6 border-2 shadow-neobrutalism-sm space-y-4 ${theme === "venom" ? "bg-black border-venom-slime shadow-[3px_3px_0px_0px_#84cc16]" : "bg-paper-yellow/30 border-black"}`}>
                <span className="text-xs font-mono uppercase tracking-wider font-bold block">
                  Investigation Rigor:
                </span>
                <ul className="space-y-3 text-xs sm:text-sm font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme === "venom" ? "text-venom-slime" : "text-purple-600"}`} />
                    <span>Peer-reviewed papers (NYU & Yale psychology)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme === "venom" ? "text-venom-slime" : "text-purple-600"}`} />
                    <span>Algorithmic multi-objective ranking functions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme === "venom" ? "text-venom-slime" : "text-purple-600"}`} />
                    <span>Creator unit yields & engagement velocity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme === "venom" ? "text-venom-slime" : "text-purple-600"}`} />
                    <span>Brand safety economics & advertiser churn</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ─── 4. SELECTED WRITING SECTION ─── */}
      <section id="selected-writing" className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime">
        <div className="max-w-5xl mx-auto">
          
          <div className="space-y-4 mb-8">
            <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm rotate-1 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-blue border-black text-black"}`}>
              Selected Work
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Selected Writing
              </h2>
              <p className="text-sm font-mono font-bold text-zinc-600 dark:text-gray-400">
                Quality &gt; Quantity · Researched, structured, & published
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b-2 border-black/10 dark:border-white/10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 border-2 text-xs font-mono font-black uppercase tracking-wider transition-all shadow-neobrutalism-sm hover:translate-x-0.5 hover:translate-y-0.5 ${
                  selectedCategory === cat
                    ? theme === "venom"
                      ? "bg-venom-slime text-black border-venom-slime shadow-[2px_2px_0px_0px_white]"
                      : "bg-black text-white border-black"
                    : theme === "venom"
                      ? "bg-zinc-900 text-white border-venom-slime hover:bg-black"
                      : "bg-white text-black border-black hover:bg-paper-yellow"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Articles Grid / List */}
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article
                  className={`border-4 p-6 sm:p-8 shadow-neobrutalism group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-200 relative overflow-hidden ${
                    theme === "venom"
                      ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
                      : "bg-white border-black"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 border font-mono font-bold text-xs uppercase tracking-wider ${theme === "venom" ? "bg-venom-slime text-black border-venom-slime" : "bg-paper-yellow border-black text-black"}`}>
                        {post.meta.category || "Essay"}
                      </span>
                      {post.meta.researchLevel && (
                        <span className={`px-2 py-0.5 border font-mono text-[11px] font-bold ${theme === "venom" ? "bg-black border-venom-slime text-white" : "bg-gray-100 border-black text-black"}`}>
                          {post.meta.researchLevel}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono font-bold text-zinc-500 dark:text-gray-400">
                      <span>{post.meta.date}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.meta.readTime || "7 min"}
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-2xl sm:text-3xl font-black mb-3 group-hover:underline ${theme === "venom" ? "group-hover:text-venom-slime" : "group-hover:text-purple-700"}`}>
                    {post.meta.title}
                  </h3>

                  <p className="text-base text-zinc-700 dark:text-gray-300 font-medium mb-6 leading-relaxed">
                    {post.meta.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-black/10 dark:border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {post.meta.topics?.map((t: string) => (
                        <span key={t} className="text-xs font-mono font-bold text-zinc-500 dark:text-gray-400">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <div className={`flex items-center font-black font-mono text-sm uppercase tracking-wider ${theme === "venom" ? "text-venom-slime" : "text-black"}`}>
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 5. WHAT I WRITE ABOUT (TOPICS) ─── */}
      <section id="topics" className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime bg-paper-yellow/20 dark:bg-black/40">
        <div className="max-w-5xl mx-auto">
          
          <div className="max-w-2xl mb-12">
            <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm -rotate-1 mb-2 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-pink border-black text-black"}`}>
              Scope
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              What I Write About
            </h2>
            <p className="text-lg font-hand font-bold text-zinc-700 dark:text-gray-300">
              Editorial categories designed around deep investigation rather than generic service checklists.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPIC_DETAILS.map((topic) => (
              <div
                key={topic.title}
                className={`p-6 border-4 shadow-neobrutalism space-y-4 hover:-translate-y-1 hover:shadow-neobrutalism-lg transition-all flex flex-col justify-between ${
                  theme === "venom"
                    ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
                    : "bg-white border-black"
                }`}
              >
                <div className="space-y-2.5">
                  <span className={`inline-block px-2.5 py-1 border-2 text-xs font-mono font-bold uppercase tracking-wider ${topic.badgeColor} border-black shadow-neobrutalism-sm`}>
                    {topic.tag}
                  </span>
                  <h3 className="text-2xl font-black">
                    {topic.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-700 dark:text-gray-300 leading-relaxed">
                    {topic.desc}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-black/10 dark:border-white/10">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-gray-400 block mb-1">
                    Guiding Inquiry:
                  </span>
                  <p className="font-hand font-bold text-base text-zinc-900 dark:text-white">
                    &ldquo;{topic.question}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. WRITING PROCESS ─── */}
      <section id="process" className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime">
        <div className="max-w-5xl mx-auto">
          
          <div className="max-w-2xl mb-12">
            <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm rotate-2 mb-2 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-blue border-black text-black"}`}>
              Methodology
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              How I Turn Questions Into Stories
            </h2>
            <p className="text-lg font-hand font-bold text-zinc-700 dark:text-gray-300">
              Every article follows an uncompromising four-stage research and synthesis pipeline.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.num}
                className={`p-6 border-4 shadow-neobrutalism space-y-3 ${
                  theme === "venom"
                    ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
                    : "bg-white border-black"
                }`}
              >
                <div className={`w-12 h-12 border-2 border-black flex items-center justify-center font-black text-xl shadow-neobrutalism-sm -rotate-3 ${step.bg} text-black`}>
                  {step.num}
                </div>
                <h3 className="text-2xl font-black">
                  {step.name}
                </h3>
                <p className="font-bold text-sm">
                  {step.summary}
                </p>
                <p className="text-xs font-medium text-zinc-600 dark:text-gray-400 leading-relaxed pt-1">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Process Quote Card */}
          <div className={`mt-12 p-8 border-4 shadow-neobrutalism rotate-1 text-center max-w-3xl mx-auto ${theme === "venom" ? "bg-black border-venom-slime text-white shadow-[4px_4px_0px_0px_#84cc16]" : "bg-paper-yellow border-black text-black"}`}>
            <p className="font-hand font-bold text-2xl sm:text-3xl leading-snug">
              &ldquo;Good writing isn&apos;t just about knowing more. It&apos;s about making the reader understand more.&rdquo;
            </p>
          </div>

        </div>
      </section>

      {/* ─── 7. SERVICES (WHAT I CAN WRITE) ─── */}
      <section id="services" className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime bg-paper-pink/20 dark:bg-black/40">
        <div className="max-w-5xl mx-auto">
          
          <div className="max-w-2xl mb-12">
            <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm -rotate-2 mb-2 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-yellow border-black text-black"}`}>
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              What I Can Write For You
            </h2>
            <p className="text-lg font-hand font-bold text-zinc-700 dark:text-gray-300">
              No generic SEO fluff or inflated claims. High-substance editorial deliverables designed for founders and specialized publications.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((srv) => (
              <div
                key={srv.title}
                className={`p-6 border-4 shadow-neobrutalism space-y-4 flex flex-col justify-between ${
                  theme === "venom"
                    ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
                    : "bg-white border-black"
                }`}
              >
                <div className="space-y-2.5">
                  <span className={`inline-block px-2 py-0.5 border text-xs font-mono font-bold ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime" : "bg-paper-blue border-black text-black"}`}>
                    {srv.tag}
                  </span>
                  <h3 className="text-2xl font-black">
                    {srv.title}
                  </h3>
                  <p className="text-sm font-medium text-zinc-700 dark:text-gray-300 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
                <div className="pt-3 border-t-2 border-black/10 dark:border-white/10">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-gray-400 block mb-1">
                    Deliverables:
                  </span>
                  <p className={`text-xs font-mono font-bold ${theme === "venom" ? "text-venom-slime" : "text-purple-700"}`}>
                    {srv.deliverables}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 8. RESEARCH PHILOSOPHY ─── */}
      <section className="py-20 md:py-28 px-6 border-b-4 border-black dark:border-venom-slime">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm rotate-1 mb-3 ${theme === "venom" ? "bg-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-paper-yellow border-black text-black"}`}>
              Philosophy
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              I don’t want to write what everyone else is writing.
            </h2>
            <p className="text-lg font-hand font-bold text-zinc-600 dark:text-gray-400 mt-4">
              Anyone can summarize the first five search results. The interesting work starts after that.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {PHILOSOPHY_POINTS.map((pt, idx) => (
              <div
                key={pt.q}
                className={`p-6 border-4 shadow-neobrutalism space-y-2 ${
                  idx === 0 ? "sm:col-span-2 md:col-span-1" : ""
                } ${theme === "venom" ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]" : "bg-white border-black"}`}
              >
                <span className={`inline-block px-2 py-0.5 border text-xs font-mono font-bold uppercase ${pt.color} text-black border-black mb-1`}>
                  {pt.tag}
                </span>
                <h3 className={`text-xl font-black block ${theme === "venom" ? "text-venom-slime" : "text-black"}`}>
                  {pt.q}
                </h3>
                <p className="text-sm font-medium text-zinc-700 dark:text-gray-300 leading-relaxed">
                  {pt.a}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 9. WRITER'S NOTE ─── */}
      <section className="py-16 md:py-20 px-6 border-b-4 border-black dark:border-venom-slime bg-paper-yellow/40 dark:bg-black/60">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <span className={`inline-block px-3 py-1 border-2 font-mono font-bold text-xs uppercase tracking-widest shadow-neobrutalism-sm ${theme === "venom" ? "bg-zinc-900 border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_white]" : "bg-white border-black text-black"}`}>
            Writer&apos;s Note
          </span>
          <blockquote className="font-hand font-bold text-2xl sm:text-4xl text-black dark:text-white leading-relaxed">
            &ldquo;I&apos;m less interested in writing about whatever is trending and more interested in understanding why something became important in the first place. That&apos;s what keeps me writing.&rdquo;
          </blockquote>
          <div className="text-sm font-mono font-black uppercase tracking-widest text-zinc-600 dark:text-venom-slime">
            — Vaibhav
          </div>
        </div>
      </section>

      {/* ─── 10. CONTACT SECTION (MATCHING http://localhost:3000/#contact) ─── */}
      <section id="contact" className={`py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${theme === "venom" ? "bg-black" : "bg-paper-blue/20"}`}>
        {/* Decorative Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-5 dark:opacity-20">
          <div className={`w-full h-full border-2 ${theme === "venom" ? "border-venom-slime" : "border-black"}`} />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              className={`text-4xl md:text-5xl font-black mb-6 inline-block border-2 px-8 py-3 shadow-neobrutalism rotate-1 ${
                theme === "venom"
                  ? "bg-black border-venom-slime text-venom-slime shadow-[4px_4px_0px_0px_white]"
                  : "bg-white border-black text-black"
              }`}
              initial={{ rotate: -5, scale: 0.9 }}
              whileInView={{ rotate: 1, scale: 1 }}
            >
              {theme === "venom" ? "Summon Us 🕸️" : "Have Something Worth Explaining? 📝"}
            </motion.h2>

            <p className={`text-xl font-hand mb-6 max-w-lg mx-auto ${theme === "venom" ? "text-gray-400" : "text-zinc-700"}`}>
              {theme === "venom"
                ? "We are listening. Speak, or be consumed."
                : "Got a difficult subject, an interesting product, a complex idea, or a story that deserves more than a surface-level article? Let's talk."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 text-left">
            {/* Form Section */}
            <motion.div
              className={`p-8 border-4 shadow-neobrutalism rounded-lg ${
                theme === "venom"
                  ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16]"
                  : "bg-white border-black"
              }`}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
            >
              <h3 className={`text-2xl font-black mb-6 ${theme === "venom" ? "text-white" : "text-black"}`}>
                {status === "success" ? "Message Received! 🚀" : "Drop a Message"}
              </h3>

              {status === "success" ? (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 font-bold" role="alert">
                  <p>Thanks for reaching out!</p>
                  <p>I&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Name</label>
                    <input
                      {...register("name", { required: true })}
                      className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${
                        theme === "venom"
                          ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]"
                          : "bg-gray-50 border-black focus:shadow-neobrutalism"
                      }`}
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Email</label>
                    <input
                      {...register("email", { required: true })}
                      type="email"
                      className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${
                        theme === "venom"
                          ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]"
                          : "bg-gray-50 border-black focus:shadow-neobrutalism"
                      }`}
                      placeholder="you@domain.com"
                    />
                  </div>
                  <div>
                    <label className={`block font-bold mb-1 ${theme === "venom" ? "text-gray-300" : "text-zinc-700"}`}>Message</label>
                    <textarea
                      {...register("message", { required: true })}
                      rows={4}
                      className={`w-full px-4 py-3 border-2 font-mono focus:outline-none transition-all ${
                        theme === "venom"
                          ? "bg-black border-venom-slime text-white focus:shadow-[4px_4px_0px_0px_#84cc16]"
                          : "bg-gray-50 border-black focus:shadow-neobrutalism"
                      }`}
                      placeholder="Tell me about the topic, project, or story you want to explore..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className={`w-full py-4 font-black text-lg border-2 shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                      theme === "venom"
                        ? "bg-venom-slime border-venom-slime text-black"
                        : "bg-black border-black text-white"
                    }`}
                  >
                    {status === "submitting" ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                    {status === "submitting" ? "Sending..." : "Send Message"}
                  </button>
                  {status === "error" && <p className="text-red-500 font-bold text-sm mt-2">Something went wrong. Please try again.</p>}
                </form>
              )}
            </motion.div>

            {/* Socials & Direct Contact */}
            <div className="flex flex-col gap-6">
              <motion.div
                className={`p-6 border-4 shadow-neobrutalism rounded-lg ${
                  theme === "venom"
                    ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white"
                    : "bg-white border-black text-black"
                }`}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Direct Email
                </h3>
                <div className={`p-4 border-2 font-mono text-sm break-all relative group ${
                  theme === "venom"
                    ? "bg-black border-venom-slime text-gray-300"
                    : "bg-paper-yellow border-black text-black"
                }`}>
                  {email}
                  <button
                    onClick={handleCopy}
                    className={`absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-full hover:scale-110 transition-transform ${
                      theme === "venom" ? "bg-venom-slime text-black" : "bg-black text-white"
                    }`}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className={`p-6 border-4 shadow-neobrutalism rounded-lg flex-1 ${
                  theme === "venom"
                    ? "bg-zinc-900 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] text-white"
                    : "bg-white border-black text-black"
                }`}
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-bold text-lg mb-4">Socials & Channels</h3>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://github.com/VaibhavChaudhary14"
                    target="_blank"
                    className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
                      theme === "venom"
                        ? "bg-black border-venom-slime hover:bg-venom-slime/10 text-venom-slime"
                        : "bg-gray-100 border-black hover:bg-gray-200 text-black"
                    }`}
                  >
                    <Github size={20} />
                    <span className="font-bold text-xs">GitHub</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/vaibhavchaudhary14"
                    target="_blank"
                    className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
                      theme === "venom"
                        ? "bg-black border-venom-slime hover:bg-venom-slime/10 text-venom-slime"
                        : "bg-blue-100 border-black hover:bg-blue-200 text-blue-700"
                    }`}
                  >
                    <Linkedin size={20} />
                    <span className="font-bold text-xs">LinkedIn</span>
                  </a>
                  <a
                    href="https://x.com/Vaibhav_14ry"
                    target="_blank"
                    className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
                      theme === "venom"
                        ? "bg-black border-venom-slime hover:bg-venom-slime/10 text-venom-slime"
                        : "bg-sky-100 border-black hover:bg-sky-200 text-sky-500"
                    }`}
                  >
                    <Twitter size={20} />
                    <span className="font-bold text-xs">Twitter</span>
                  </a>
                  <a
                    href="https://medium.com/@vaibhav_14ry"
                    target="_blank"
                    className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
                      theme === "venom"
                        ? "bg-black border-venom-slime hover:bg-venom-slime/10 text-venom-slime"
                        : "bg-yellow-100 border-black hover:bg-yellow-200 text-black"
                    }`}
                  >
                    <BookOpen size={20} />
                    <span className="font-bold text-xs">Medium</span>
                  </a>
                  <a
                    href="https://www.instagram.com/bepvt.vaibhav/"
                    target="_blank"
                    className={`flex flex-col items-center gap-2 p-3 border-2 transition-colors ${
                      theme === "venom"
                        ? "bg-black border-venom-slime hover:bg-venom-slime/10 text-venom-slime"
                        : "bg-pink-100 border-black hover:bg-pink-200 text-pink-600"
                    }`}
                  >
                    <Instagram size={20} />
                    <span className="font-bold text-xs">Instagram</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 11. FOOTER ─── */}
      <footer className={`py-12 px-6 border-t-4 text-center transition-colors ${theme === "venom" ? "bg-venom-black border-venom-slime text-gray-400" : "bg-white border-black text-black"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="font-black text-xl block">
              VAIBHAV
            </span>
            <p className="text-xs font-mono font-bold text-zinc-500 dark:text-gray-400">
              Content Writer · Researcher · Storyteller
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono font-bold">
            <a href="#selected-writing" className="hover:underline">Writing</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#topics" className="hover:underline">Topics</a>
            <a href="#services" className="hover:underline">Services</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <a href="https://www.linkedin.com/in/vaibhavchaudhary14" target="_blank" className="hover:underline">LinkedIn</a>
          </div>
        </div>
        <p className="text-xs font-mono font-bold mt-8 text-zinc-500 dark:text-gray-400">
          © {new Date().getFullYear()} Vaibhav Chaudhary. Words That Make Complex Things Clear.
        </p>
      </footer>

    </div>
  );
}
