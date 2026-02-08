"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import {
    Terminal, Database, Zap, BarChart3,
    Layers, Cpu, Rss, RefreshCw, Play, TrendingUp, Users, Contact,
    Radio, Shield, ArrowRight, Activity, Menu, X
} from "lucide-react";

import { SupabaseStore } from '@/lib/xos/data-engine/supabase-store';
import { QueueItem, EngagementEvent, AnalyticsSnapshot } from "@/lib/xos/types";
import { EngagementListener } from "@/lib/xos/data-engine/listener";
import { AutoPilot } from "@/lib/xos/action-engine/auto-pilot";
import { AnalyticsEngine } from "@/lib/xos/intelligence/analytics";
import { CRMEngine, LeadProfile } from "@/lib/xos/intelligence/crm-engine";
import { DiscoveredPost } from "@/lib/xos/intelligence/x-discovery";
import Navigation from "@/components/navigation"; // Optional: if we want main nav

export default function MissionControl() {
    const { theme, toggleTheme } = useThemeStore();
    const [activeTab, setActiveTab] = useState<'content' | 'data' | 'action' | 'intel' | 'crm' | 'logs' | 'engage'>('content');
    const [systemActive, setSystemActive] = useState(false);

    // Live Data
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [engagements, setEngagements] = useState<EngagementEvent[]>([]);
    const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
    const [leads, setLeads] = useState<LeadProfile[]>([]);
    const [systemLogs, setSystemLogs] = useState<any[]>([]);
    const [discoveredPosts, setDiscoveredPosts] = useState<DiscoveredPost[]>([]);

    const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
    const [processing, setProcessing] = useState(false);
    const [polling, setPolling] = useState(false);
    const [runningAuto, setRunningAuto] = useState(false);

    // Core Engine Singletons (Lazy Init to avoid hydration issues)
    // We do NOT use useState for these anymore to avoid stale class definitions
    const store = SupabaseStore.getInstance();

    // Initial Load & Refresh
    useEffect(() => {
        // Instantiate Engines inside effect to ensure fresh classes
        const analytics = new AnalyticsEngine();
        const crm = new CRMEngine();

        const load = async () => {
            const q = await store.getQueue();
            const e = await store.getEngagementFeed();
            setQueue(q);
            setEngagements(e);

            // Stats
            try {
                const s = await analytics.getSnapshot();
                setStats(s);
            } catch (err) { console.error("Analytics Error (Soft):", err); }

            // Logs
            if (activeTab === 'logs') {
                const l = await store.getLogs();
                setSystemLogs(l);
            }
        };
        load();

        // Refresh every 5s if auto-running
        const interval = setInterval(() => {
            if (systemActive || activeTab === 'logs') load();
        }, 5000);

        return () => clearInterval(interval);
    }, [systemActive, activeTab]);

    // Handlers
    const handleSimulateIngest = async (source: 'rss') => {
        setProcessing(true);
        try {
            // Dynamically import Server Action to ensure it's treated as an action invocation
            const { ingestSignal } = await import('@/app/actions/ingest');
            await ingestSignal(source);

            // Refresh Queue immediately
            const q = await store.getQueue();
            setQueue(q);
        } catch (e: any) { console.error(e) } finally { setProcessing(false); }
    };

    const handlePollMentions = async () => {
        setPolling(true);
        const listener = new EngagementListener();
        try {
            await listener.pollForMentions();
            const e = await store.getEngagementFeed();
            setEngagements(e);
        } catch (e: any) { console.error(e) } finally { setPolling(false); }
    };

    const handleRunAutoPilot = async () => {
        setRunningAuto(true);
        const autopilot = new AutoPilot();
        try {
            await autopilot.runDecisionLoop();
            // Refresh
            const q = await store.getQueue();
            const e = await store.getEngagementFeed();
            setQueue(q);
            setEngagements(e);
        } catch (e: any) { console.error(e) } finally { setRunningAuto(false); }
    };

    const handleGenerateReport = async () => {
        const analytics = new AnalyticsEngine();
        const snap = await analytics.generateSnapshot();
        setSnapshot(snap);
    }

    const handleSyncCRM = async () => {
        const crm = new CRMEngine();
        const newLeads = await crm.syncLeadsFromStore();
        setLeads(newLeads);
    }

    // Helper to toggle items
    const toggleItemProcessing = (id: string, isLoading: boolean) => {
        setProcessingItems(prev => {
            const newSet = new Set(prev);
            if (isLoading) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    // --- DESIGN TOKENS ---
    const isVenom = theme === 'venom';

    // Neo-Brutalism Classes
    // Light: White bg, Black border, Hard shadow
    // Venom: Black bg, Lime border, Hard lime shadow
    const containerClass = isVenom
        ? 'bg-venom-black text-venom-white graph-paper-grid'
        : 'bg-zinc-50 text-zinc-900 graph-paper-grid';

    const cardClass = isVenom
        ? 'bg-zinc-900 border-2 border-venom-slime shadow-[4px_4px_0px_0px_#84cc16] rounded-xl'
        : 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_#18181b] rounded-xl';

    const btnClass = isVenom
        ? 'border-2 border-venom-slime shadow-[2px_2px_0px_0px_#84cc16] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px]'
        : 'border-2 border-black shadow-[2px_2px_0px_0px_#18181b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[2px] active:translate-y-[2px]';

    const activeTabClass = isVenom
        ? 'bg-venom-slime text-black font-bold'
        : 'bg-black text-white font-bold';

    const inactiveTabClass = isVenom
        ? 'hover:bg-venom-slime/10 text-venom-slime'
        : 'hover:bg-black/5 text-zinc-500';

    // Tabs Config
    const tabs = [
        { id: 'content', label: 'Pipeline', icon: Layers },
        { id: 'engage', label: 'Engage', icon: TrendingUp },
        { id: 'data', label: 'Signals', icon: Radio },
        { id: 'action', label: 'Auto-Pilot', icon: Zap },
        { id: 'intel', label: 'Intel', icon: BarChart3 },
        { id: 'crm', label: 'CRM', icon: Users },
        { id: 'logs', label: 'Logs', icon: Terminal },
    ];

    return (
        <div className={`min-h-screen font-sans ${containerClass} transition-colors duration-500 pb-20`}>
            {/* 1. Header (Matches Portfolio Navigation style) */}
            <header className={`fixed top-0 left-0 right-0 z-40 border-b-2 px-4 py-3 transition-colors duration-500 ${isVenom ? 'bg-venom-black border-venom-slime text-white' : 'bg-white border-black text-zinc-900'}`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h1 className={`text-2xl font-black tracking-tighter ${isVenom ? 'text-venom-slime' : 'text-black'}`}>
                            XOS <span className="text-sm font-normal opacity-70">v3.0</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSystemActive(!systemActive)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${btnClass} ${systemActive ? (isVenom ? 'bg-venom-slime text-black' : 'bg-black text-white') : ''}`}
                        >
                            {systemActive ? <Cpu size={16} /> : <Terminal size={16} />}
                            {systemActive ? "AGENT ACTIVE" : "MANUAL MODE"}
                        </button>

                        <button onClick={toggleTheme} className={`p-2 rounded-lg ${btnClass}`}>
                            <Zap size={18} className={isVenom ? "text-venom-slime" : "text-black"} />
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Main Content Container */}
            <main className="pt-24 px-4 max-w-5xl mx-auto space-y-8">

                {/* Hero Section / Title */}
                <div className="text-center space-y-2 mb-10">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
                        Mission Control
                    </h2>
                    <p className="font-hand text-xl md:text-2xl opacity-70">
                        "The interface is the mind."
                    </p>
                </div>

                {/* 3. Horizontal Tab Bar (Pill) */}
                <div className="flex justify-center mb-8">
                    <div className={`p-1.5 rounded-xl border-2 overflow-x-auto flex items-center gap-1 ${isVenom ? 'border-venom-slime bg-zinc-900' : 'border-black bg-white'}`}>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap
                                    ${activeTab === tab.id ? activeTabClass : inactiveTabClass}
                                `}
                            >
                                <tab.icon size={16} />
                                {tab.label.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Dashboard Viewport */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[400px]"
                >

                    {/* --- PIPELINE (CONTENT) --- */}
                    {activeTab === 'content' && (
                        <div className="space-y-8">
                            {/* Control Panel */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleSimulateIngest('rss')} disabled={processing}
                                    className={`flex-1 p-6 ${cardClass} flex flex-col items-center justify-center gap-3 group text-center ${processing ? 'opacity-50' : 'hover:-translate-y-1'}`}
                                >
                                    <Rss size={32} />
                                    <span className="font-bold uppercase tracking-widest text-sm">
                                        {processing ? "INGESTING..." : "INGEST RSS FEED"}
                                    </span>
                                </button>
                            </div>

                            {/* Queue List */}
                            <div className={`p-6 ${cardClass}`}>
                                <div className="flex justify-between items-center mb-6 border-b-2 border-current/10 pb-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Approval Queue</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xl font-bold opacity-50">{queue.length}</span>
                                        {queue.length > 0 && (
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Clear all ${queue.length} items from the queue?`)) {
                                                        // Archive all queue items
                                                        queue.forEach(q => store.updateQueueStatus(q.id, 'archived'));
                                                        setQueue([]);
                                                    }
                                                }}
                                                className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all ${isVenom
                                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                                                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                    }`}
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {queue.length === 0 && (
                                        <div className="text-center py-10 opacity-40 font-hand text-xl">
                                            The void is empty...
                                        </div>
                                    )}
                                    {queue.map(q => (
                                        <div key={q.id} className={`p-4 rounded-lg border-2 ${isVenom ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
                                            <div className="flex flex-col md:flex-row gap-4 justify-between">
                                                <div className="space-y-2 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase bg-current/10 px-2 py-0.5 rounded">{q.source}</span>
                                                        <span className="font-bold text-sm">{q.title}</span>
                                                    </div>
                                                    <p className="font-serif italic opacity-80 pl-2 border-l-2 border-current/20">"{q.generated_tweet}"</p>
                                                    {q.rationale && <p className="text-xs font-mono opacity-50">🤖 {q.rationale}</p>}
                                                </div>

                                                <div className="flex flex-row md:flex-col gap-2 justify-center shrink-0">
                                                    <button
                                                        onClick={async () => {
                                                            toggleItemProcessing(q.id, true);
                                                            const { postToX } = await import('@/app/actions/post-to-x');
                                                            const res = await postToX(q.generated_tweet || q.title);
                                                            if (res.success) {
                                                                store.updateQueueStatus(q.id, 'published');
                                                                setQueue(prev => prev.filter(i => i.id !== q.id));
                                                            }
                                                            toggleItemProcessing(q.id, false);
                                                        }}
                                                        className={`px-4 py-2 text-xs font-black uppercase rounded ${btnClass} ${isVenom ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}
                                                        disabled={processingItems.has(q.id)}
                                                    >
                                                        {processingItems.has(q.id) ? "POSTING..." : "POST NOW"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            store.updateQueueStatus(q.id, 'archived');
                                                            setQueue(prev => prev.filter(i => i.id !== q.id));
                                                        }}
                                                        className="px-4 py-2 text-xs font-bold uppercase opacity-50 hover:opacity-100"
                                                    >
                                                        DISMISS
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ENGAGE (X DISCOVERY) --- */}
                    {activeTab === 'engage' && (
                        <div className="space-y-8">
                            {/* Discovery Control */}
                            <button
                                onClick={async () => {
                                    setProcessing(true);
                                    const { discoverXPosts, getDiscoveredPosts } = await import('@/app/actions/discover-x');
                                    await discoverXPosts(10); // Conservative: only 10 posts per scan
                                    const result = await getDiscoveredPosts('pending');
                                    if (result.success) {
                                        setDiscoveredPosts(result.data);
                                    }
                                    setProcessing(false);
                                }}
                                disabled={processing}
                                className={`w-full p-6 ${cardClass} flex flex-col items-center justify-center gap-3 group text-center ${processing ? 'opacity-50' : 'hover:-translate-y-1'}`}
                            >
                                <TrendingUp size={32} />
                                <span className="font-bold uppercase tracking-widest text-sm">
                                    {processing ? "SCANNING X..." : "DISCOVER NICHE POSTS"}
                                </span>
                                <p className="text-xs opacity-60">Find posts in Smart Grid, AI, Power Systems</p>
                            </button>

                            {/* Discovered Posts Queue */}
                            <div className={`p-6 ${cardClass}`}>
                                <div className="flex justify-between items-center mb-6 border-b-2 border-current/10 pb-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Discovered Posts</h3>
                                    <span className="font-mono text-xl font-bold opacity-50">{discoveredPosts.length}</span>
                                </div>
                                <div className="space-y-4">
                                    {discoveredPosts.length === 0 && (
                                        <div className="text-center py-10 opacity-40 font-hand text-xl">
                                            No posts discovered yet...
                                        </div>
                                    )}
                                    {discoveredPosts.map(post => (
                                        <div key={post.id} className={`p-4 rounded-lg border-2 ${isVenom ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-black/5'}`}>
                                            <div className="flex flex-col gap-4">
                                                {/* Post Header */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-bold">@{post.author_handle}</span>
                                                            <span className="text-xs opacity-50">{post.author_name}</span>
                                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${post.relevance_score > 0.8 ? 'bg-green-500/20 text-green-400' :
                                                                    post.relevance_score > 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
                                                                        'bg-gray-500/20 text-gray-400'
                                                                }`}>
                                                                {(post.relevance_score * 100).toFixed(0)}% MATCH
                                                            </span>
                                                        </div>
                                                        <p className="text-sm opacity-80 mb-2">"{post.content}"</p>
                                                        <div className="flex items-center gap-3 text-xs opacity-50">
                                                            <span>❤️ {post.engagement_count}</span>
                                                            <a href={post.url} target="_blank" rel="noopener" className="hover:opacity-100">
                                                                View Post →
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Generated Reply (if exists) */}
                                                {post.generated_reply && (
                                                    <div className={`p-3 rounded border-l-4 ${isVenom ? 'bg-venom-slime/10 border-venom-slime' : 'bg-blue-50 border-blue-500'}`}>
                                                        <p className="text-sm font-serif italic">"{post.generated_reply}"</p>
                                                        <p className="text-xs opacity-50 mt-1">
                                                            Confidence: {((post.reply_confidence || 0) * 100).toFixed(0)}%
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    {!post.generated_reply ? (
                                                        <button
                                                            onClick={async () => {
                                                                toggleItemProcessing(post.id, true);
                                                                const { generateReplyForPost, getDiscoveredPosts } = await import('@/app/actions/discover-x');
                                                                await generateReplyForPost(post.id);
                                                                const result = await getDiscoveredPosts('pending');
                                                                if (result.success) {
                                                                    setDiscoveredPosts(result.data);
                                                                }
                                                                toggleItemProcessing(post.id, false);
                                                            }}
                                                            className={`px-4 py-2 text-xs font-black uppercase rounded ${btnClass} ${isVenom ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}
                                                            disabled={processingItems.has(post.id)}
                                                        >
                                                            {processingItems.has(post.id) ? "GENERATING..." : "GENERATE REPLY"}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={async () => {
                                                                toggleItemProcessing(post.id, true);
                                                                const { postReplyToX, getDiscoveredPosts } = await import('@/app/actions/discover-x');
                                                                const res = await postReplyToX(post.id, post.generated_reply!, post.post_id);
                                                                if (res.success) {
                                                                    const result = await getDiscoveredPosts('pending');
                                                                    if (result.success) {
                                                                        setDiscoveredPosts(result.data);
                                                                    }
                                                                }
                                                                toggleItemProcessing(post.id, false);
                                                            }}
                                                            className={`px-4 py-2 text-xs font-black uppercase rounded ${btnClass} ${isVenom ? 'bg-venom-slime text-black' : 'bg-black text-white'}`}
                                                            disabled={processingItems.has(post.id)}
                                                        >
                                                            {processingItems.has(post.id) ? "POSTING..." : "POST REPLY"}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={async () => {
                                                            const { dismissDiscoveredPost, getDiscoveredPosts } = await import('@/app/actions/discover-x');
                                                            await dismissDiscoveredPost(post.id);
                                                            const result = await getDiscoveredPosts('pending');
                                                            if (result.success) {
                                                                setDiscoveredPosts(result.data);
                                                            }
                                                        }}
                                                        className="px-4 py-2 text-xs font-bold uppercase opacity-50 hover:opacity-100"
                                                    >
                                                        DISMISS
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- SIGNALS (DATA) --- */}
                    {activeTab === 'data' && (
                        <div className="space-y-6">
                            <button onClick={handlePollMentions} disabled={polling}
                                className={`w-full py-6 text-xl font-black uppercase tracking-widest ${cardClass} hover:opacity-90 flex items-center justify-center gap-4`}
                            >
                                <RefreshCw className={polling ? "animate-spin" : ""} />
                                {polling ? "SCANNING FREQUENCIES..." : "POLL LIVE SIGNALS"}
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {engagements.map(e => (
                                    <div key={e.id} className={`p-6 ${cardClass} relative overflow-hidden`}>
                                        <div className={`absolute top-0 right-0 p-2 font-black text-xs uppercase ${isVenom ? 'bg-venom-slime text-black' : 'bg-black text-white'} rounded-bl-xl`}>
                                            {e.intent}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">@{e.user_handle}</h4>
                                        <p className="opacity-80">"{e.text}"</p>
                                        <div className="mt-4 flex items-center gap-2">
                                            <span className="text-xs font-mono opacity-50">Score: {e.user_score}</span>
                                            {e.processed ? <span className="text-green-500 text-xs">● Processed</span> : <span className="text-red-500 text-xs text-blink">● Active</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- ACTION (AUTO-PILOT) --- */}
                    {activeTab === 'action' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-8">
                            <button
                                onClick={handleRunAutoPilot}
                                disabled={runningAuto}
                                className={`w-64 h-64 rounded-full border-4 flex flex-col items-center justify-center gap-4 transition-all
                                    ${runningAuto ? 'animate-pulse opacity-50' : 'hover:scale-105 active:scale-95'}
                                    ${isVenom ? 'border-venom-slime bg-venom-slime/10 shadow-[0_0_50px_rgba(132,204,22,0.3)]' : 'border-black bg-white shadow-neobrutalism-lg'}
                                `}
                            >
                                <Zap size={64} className={runningAuto ? "" : (isVenom ? "text-venom-slime" : "text-black")} />
                                <span className="font-black text-xl tracking-widest">{runningAuto ? "EXECUTING..." : "ENGAGE"}</span>
                            </button>
                            <p className="font-hand text-xl opacity-60">
                                Run the autonomous decision loop manually.
                            </p>
                        </div>
                    )}

                    {/* --- LOGS (TERMINAL) --- */}
                    {activeTab === 'logs' && (
                        <div className={`p-6 ${cardClass} font-mono text-xs md:text-sm overflow-hidden`}>
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-current/20">
                                <h3 className="font-bold uppercase flex items-center gap-2">
                                    <Terminal size={16} /> System Kernel
                                </h3>
                                <button onClick={() => store.getLogs().then(setSystemLogs)} className="opacity-50 hover:opacity-100">
                                    <RefreshCw size={14} />
                                </button>
                            </div>
                            <div className="h-[60vh] overflow-y-auto custom-scrollbar space-y-1">
                                {systemLogs.map((log) => (
                                    <div key={log.id} className="flex gap-4 p-1 hover:bg-current/5 rounded">
                                        <span className="opacity-30 shrink-0 w-20">{new Date(log.created_at).toLocaleTimeString()}</span>
                                        <span className={`font-bold w-16 shrink-0 ${log.level === 'error' ? 'text-red-500' : log.level === 'warn' ? 'text-yellow-500' : 'text-green-500'}`}>
                                            {log.level.toUpperCase()}
                                        </span>
                                        <span className="opacity-50 font-bold w-20 shrink-0">[{log.component || log.module}]</span>
                                        <span className="opacity-90">{log.message}</span>
                                    </div>
                                ))}
                                {systemLogs.length === 0 && <div className="opacity-30 italic">Kernel buffer empty.</div>}
                            </div>
                        </div>
                    )}

                </motion.div>

            </main>
        </div>
    );
}

// Temporary shim for stats if variable missing
function setStats(s: any) { }
