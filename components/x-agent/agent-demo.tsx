import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runSimWorkflow } from "@/app/actions/sim-agent";
import { Loader2, Send, Terminal, AlertCircle, Sparkles, Search, MessageCircle, Hash, Activity, Cpu, Zap, History, ExternalLink, ShieldCheck, Database, BrainCircuit, BarChart3, Lock, Delete } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";
import AutopilotStatus from "./autopilot-status";

type Mode = 'reply' | 'discover' | 'original';

interface HistoryItem {
    id: string;
    text: string;
    type: 'draft' | 'posted';
    timestamp: Date;
    meta?: string;
}

// Helper for copy to clipboard
const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
};

const SecurityLock = ({ onUnlock, theme }: { onUnlock: () => void, theme: string }) => {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handlePress = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            if (newPin.length === 4) {
                if (newPin === "1414") {
                    setTimeout(onUnlock, 300);
                } else {
                    setError(true);
                    setTimeout(() => {
                        setPin("");
                        setError(false);
                    }, 500);
                }
            }
        }
    };

    const handleDelete = () => setPin(prev => prev.slice(0, -1));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                handlePress(e.key);
            } else if (e.key === 'Backspace') {
                handleDelete();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pin]);

    return (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${theme === 'venom' ? 'bg-black text-venom-slime' : 'bg-red-50 text-red-600'}`}>
            <div className={`absolute inset-0 opacity-10 pointer-events-none ${theme === 'venom' ? 'graph-grid invert' : 'graph-grid'}`} />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-10 flex flex-col items-center gap-6 p-6"
            >
                <div className="flex flex-col items-center gap-4 mb-4">
                    <div className={`p-4 rounded-full border-4 ${theme === 'venom' ? 'border-venom-slime bg-zinc-900' : 'border-red-600 bg-white'}`}>
                        <Lock size={32} className={error ? "animate-shake text-red-500" : ""} />
                    </div>
                    <h1 className="text-xl font-black uppercase tracking-[0.5em] text-center">Security Clearance</h1>
                </div>

                {/* PIN Display */}
                <div className="flex gap-4 mb-6">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-4 h-4 rounded-full border-2 ${pin.length > i
                            ? (theme === 'venom' ? 'bg-venom-slime border-venom-slime' : 'bg-red-600 border-red-600')
                            : (theme === 'venom' ? 'border-zinc-800' : 'border-red-200')
                            }`} />
                    ))}
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handlePress(num.toString())}
                            className={`h-16 rounded-xl text-xl font-black border-2 neo-shadow active:translate-y-1 active:shadow-none transition-all
                                ${theme === 'venom' ? 'border-venom-slime hover:bg-zinc-900' : 'border-red-600 hover:bg-red-50'}`}
                        >
                            {num}
                        </button>
                    ))}
                    <div />
                    <button
                        onClick={() => handlePress("0")}
                        className={`h-16 rounded-xl text-xl font-black border-2 neo-shadow active:translate-y-1 active:shadow-none transition-all
                            ${theme === 'venom' ? 'border-venom-slime hover:bg-zinc-900' : 'border-red-600 hover:bg-red-50'}`}
                    >
                        0
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`h-16 rounded-xl flex items-center justify-center border-2 neo-shadow active:translate-y-1 active:shadow-none transition-all
                            ${theme === 'venom' ? 'border-venom-slime text-red-500 hover:bg-zinc-900' : 'border-red-600 text-red-600 hover:bg-red-50'}`}
                    >
                        <Delete size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function XAgentDemo() {
    const { theme, toggleTheme } = useThemeStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mode, setMode] = useState<Mode>('reply');
    const [postText, setPostText] = useState("");
    const [originalTopic, setOriginalTopic] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [tweetId, setTweetId] = useState("");
    const [autoPost, setAutoPost] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [repliesHistory, setRepliesHistory] = useState<HistoryItem[]>([]);
    const [originalsHistory, setOriginalsHistory] = useState<HistoryItem[]>([]);

    const extractTweetId = (input: string) => {
        const match = input.match(/(?:twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/status\/(\d+)|(\d+)/);
        if (match) return match[1] || match[2];
        return input.trim();
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);
        try {
            let payload: any = { mode, auto_post: autoPost };
            if (mode === 'reply') {
                if (!postText.trim()) throw new Error("Please enter a tweet to reply to.");
                let finalTweetId = extractTweetId(tweetId);
                if (autoPost && !finalTweetId) throw new Error("Auto-Post requires a valid Tweet ID.");
                if (!finalTweetId) finalTweetId = "1234567890";
                payload = { ...payload, post_text: postText, author_handle: "@demo_user", tweet_id: finalTweetId };
            } else if (mode === 'original') {
                if (!originalTopic.trim()) throw new Error("Please enter a topic.");
                payload = { ...payload, original_topic: originalTopic };
            } else if (mode === 'discover') {
                if (!searchQuery.trim()) throw new Error("Please enter a search query.");
                payload = { ...payload, search_query: searchQuery };
            }

            const result = await runSimWorkflow(payload);
            if (result.error) {
                setError(result.error);
            } else {
                setResponse(result);
                const resultText = result.output?.result?.final_reply || "No response generated.";
                const isPosted = result.output?.result?.posted === true;
                const newItem: HistoryItem = {
                    id: Date.now().toString(),
                    text: resultText,
                    type: isPosted ? 'posted' : 'draft',
                    timestamp: new Date(),
                    meta: mode === 'original' ? originalTopic : undefined
                };
                if (mode === 'reply') setRepliesHistory(prev => [newItem, ...prev]);
                else if (mode === 'original') setOriginalsHistory(prev => [newItem, ...prev]);
            }
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'reply', label: 'Reply Bot', icon: MessageCircle },
        { id: 'original', label: 'Tweet Gen', icon: Sparkles },
        { id: 'discover', label: 'Discover', icon: Search },
    ];

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = async (text: string, id: string) => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    const handleClearHistory = (type: 'replies' | 'originals') => {
        if (type === 'replies') setRepliesHistory([]);
        else setOriginalsHistory([]);
    };

    return (
        <>
            <AnimatePresence>
                {!isAuthenticated && (
                    <motion.div exit={{ y: "-100%" }} transition={{ duration: 0.5, ease: "circIn" }} className="fixed inset-0 z-50">
                        <SecurityLock onUnlock={() => setIsAuthenticated(true)} theme={theme} />
                    </motion.div>
                )}
            </AnimatePresence>
            <section className={`min-h-[85vh] font-sans ${theme === 'venom' ? 'bg-zinc-950 text-gray-100' : 'bg-[#fbfbfb] text-zinc-900'} p-4 md:p-6 transition-colors duration-500 relative overflow-hidden`}>
                {/* Graph Paper Background Overlay */}
                <div className={`absolute inset-0 pointer-events-none opacity-[0.4] ${theme === 'venom' ? 'graph-grid invert opacity-[0.05]' : 'graph-grid'}`} />

                {/* Top/Bottom Blue Gradients (Sync with landing page) */}
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-100/50 to-transparent pointer-events-none" />

                {/* Content Container */}
                <div className="max-w-7xl mx-auto relative z-10">
                    <header className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6 pb-4 border-b-2 border-dashed border-zinc-200">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl border-2 border-black neo-shadow ${theme === 'venom' ? 'bg-venom-slime border-venom-slime text-black' : 'bg-spidy-red border-black text-white'}`}>
                                <Cpu size={32} />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-black tracking-tight ${theme === 'venom' ? 'text-orange-500' : 'text-zinc-900'}`}>
                                    X‑Agent <span className={theme === 'venom' ? 'text-yellow-400 font-medium' : 'text-zinc-400 font-medium'}>v2.0</span>
                                </h1>
                                <p className={`font-bold flex items-center gap-2 ${theme === 'venom' ? 'text-red-500' : 'text-zinc-500'}`}>
                                    <Activity size={14} className={theme === 'venom' ? 'text-red-500 animate-pulse' : 'text-red-500 animate-pulse'} />
                                    LIVE DASHBOARD UNIT.EXE
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleTheme}
                                className={`p-3 rounded-xl border-2 border-black neo-shadow press-down font-bold text-sm uppercase tracking-wider flex items-center gap-2 ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-white text-black'}`}
                            >
                                {theme === 'venom' ? <Zap size={18} /> : <Activity size={18} />}
                                {theme === 'venom' ? 'VENOM MODE' : 'SPIDY MODE'}
                            </button>
                            <AutopilotStatus />
                        </div>
                    </header>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column: Live History Preview */}
                        <div className="lg:col-span-4 space-y-6">
                            <div>
                                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                                    <Zap className="text-yellow-500" size={24} /> RECENT ACTIVITY
                                </h2>
                                <div className="space-y-6">
                                    {/* Last Reply Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        className={`neo-brutalism-card p-6 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-venom' : 'bg-white border-2 border-spidy-red shadow-spidy'}`}
                                    >
                                        <div className={`flex justify-between items-center mb-4 pb-2 border-b ${theme === 'venom' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                                            <span className={`text-xs font-black uppercase tracking-widest ${theme === 'venom' ? 'text-blue-400' : 'text-zinc-700'}`}>Last Reply Interception</span>
                                            <MessageCircle size={16} className={theme === 'venom' ? 'text-blue-500' : 'text-zinc-500'} />
                                        </div>
                                        <AnimatePresence mode="wait">
                                            {repliesHistory.length > 0 ? (
                                                <motion.div key={repliesHistory[0].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <p className="text-lg font-bold leading-relaxed mb-4">{repliesHistory[0].text}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-zinc-500">{repliesHistory[0].timestamp.toLocaleTimeString()}</span>
                                                        <span className={`text-xs font-black px-2 py-0.5 rounded border-2 border-black ${repliesHistory[0].type === 'posted' ? 'bg-green-400 shadow-neobrutalism-sm' : 'bg-orange-400 shadow-neobrutalism-sm'}`}>
                                                            {repliesHistory[0].type.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className={`py-10 text-center font-black italic text-sm ${theme === 'venom' ? 'text-zinc-500' : 'text-zinc-400'}`}>NO SIGNAL DETECTED...</div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Last Original Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        className={`neo-brutalism-card p-6 ${theme === 'venom' ? 'bg-zinc-900 border-venom-purple shadow-[4px_4px_0px_0px_#a855f7]' : 'bg-white border-2 border-spidy-red shadow-spidy'}`}
                                    >
                                        <div className={`flex justify-between items-center mb-4 pb-2 border-b ${theme === 'venom' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                                            <span className={`text-xs font-black uppercase tracking-widest ${theme === 'venom' ? 'text-purple-400' : 'text-zinc-700'}`}>Last Content Synthesis</span>
                                            <Sparkles size={16} className={theme === 'venom' ? 'text-purple-500' : 'text-zinc-500'} />
                                        </div>
                                        <AnimatePresence mode="wait">
                                            {originalsHistory.length > 0 ? (
                                                <motion.div key={originalsHistory[0].id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <p className="text-lg font-bold leading-relaxed mb-4">{originalsHistory[0].text}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-zinc-500">{originalsHistory[0].timestamp.toLocaleTimeString()}</span>
                                                        <span className="text-xs font-black px-2 py-0.5 rounded border-2 border-black bg-purple-400 shadow-neobrutalism-sm italic">
                                                            {originalsHistory[0].meta || "ABSTRACT"}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className={`py-10 text-center font-black italic text-sm ${theme === 'venom' ? 'text-zinc-500' : 'text-zinc-400'}`}>AWAITING NEURAL SPARK...</div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                    {/* Intelligence Synthesis Card */}
                                    <motion.div
                                        whileHover={{ scale: 1.01 }}
                                        className={`neo-brutalism-card p-6 ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime shadow-venom' : 'bg-white border-2 border-spidy-red shadow-spidy'}`}
                                    >
                                        <div className={`flex justify-between items-center mb-4 pb-2 border-b ${theme === 'venom' ? 'border-zinc-800' : 'border-zinc-200'}`}>
                                            <span className={`text-xs font-black uppercase tracking-widest ${theme === 'venom' ? 'text-green-400' : 'text-zinc-700'}`}>Intel Synthesis Engine</span>
                                            <BrainCircuit size={16} className={theme === 'venom' ? 'text-green-500' : 'text-zinc-500'} />
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex gap-3">
                                                <BarChart3 size={18} className={theme === 'venom' ? 'text-pink-500' : 'text-spidy-red'} />
                                                <div>
                                                    <p className={`text-xs font-black uppercase tracking-tighter ${theme === 'venom' ? 'text-pink-400' : 'text-zinc-900'}`}>Signal Analysis</p>
                                                    <p className={`text-xs font-bold ${theme === 'venom' ? 'text-pink-300' : 'text-zinc-500'}`}>Categorizes intent: EDU / RANT / NEWS</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3">
                                                <ShieldCheck size={18} className={theme === 'venom' ? 'text-teal-500' : 'text-spidy-blue'} />
                                                <div>
                                                    <p className={`text-xs font-black uppercase tracking-tighter ${theme === 'venom' ? 'text-teal-400' : 'text-zinc-900'}`}>Safety Protocol</p>
                                                    <p className={`text-xs font-bold ${theme === 'venom' ? 'text-teal-200' : 'text-zinc-500'}`}>Real-time toxicity & bias filtering</p>
                                                </div>
                                            </li>
                                            <li className="flex gap-3">
                                                <Database size={18} className={theme === 'venom' ? 'text-indigo-500' : 'text-spidy-blue'} />
                                                <div>
                                                    <p className={`text-xs font-black uppercase tracking-tighter ${theme === 'venom' ? 'text-indigo-400' : 'text-zinc-900'}`}>RAG Memory</p>
                                                    <p className={`text-xs font-bold ${theme === 'venom' ? 'text-indigo-300' : 'text-zinc-500'}`}>Context retrieval from Project Vault</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Floating Icons Removed for Cleaner UI */}
                        </div>

                        {/* Right Column: Manual Controls */}
                        <div className="lg:col-span-8">
                            <div className={`neo-brutalism-card p-8 h-full ${theme === 'venom' ? 'bg-black border-venom-slime shadow-venom-lg' : 'bg-white border-spidy-red shadow-spidy-lg'}`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <Terminal className={theme === 'venom' ? 'text-rose-500' : 'text-red-500'} size={32} />
                                    <h2 className={`text-2xl font-black uppercase italic tracking-tight ${theme === 'venom' ? 'text-rose-500' : 'text-zinc-900'}`}>Command Control Center</h2>
                                </div>

                                {/* Custom Navigation Scrubber */}
                                <div className={`flex gap-3 mb-10 p-2 rounded-xl border-2 border-black ${theme === 'venom' ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => { setMode(tab.id as Mode); setError(null); setResponse(null); }}
                                            className={`flex-1 py-4 rounded-lg text-sm font-black uppercase tracking-widest transition-all border-2 flex items-center justify-center gap-2 press-down
                                            ${mode === tab.id
                                                    ? (theme === 'venom' ? 'bg-venom-slime border-black text-black shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-red-500 border-black text-white shadow-none translate-x-[2px] translate-y-[2px]')
                                                    : 'bg-white border-black text-zinc-500 hover:bg-zinc-50 neo-shadow'
                                                }`}
                                        >
                                            <tab.icon size={16} />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    <AnimatePresence mode="wait">
                                        {mode === 'reply' && (
                                            <motion.div key="reply" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                                <div>
                                                    <label className={`block text-sm font-black uppercase mb-3 opacity-80 italic tracking-widest ${theme === 'venom' ? 'text-cyan-400' : 'text-zinc-900'}`}>SIGNAL INJECTION (Target Tweet Content)</label>
                                                    <textarea
                                                        value={postText}
                                                        onChange={(e) => setPostText(e.target.value)}
                                                        placeholder="Inject raw tweet content here..."
                                                        className={`w-full p-6 rounded-xl border-2 border-black font-bold text-base h-40 resize-none outline-none transition-colors duration-200
                                                        ${theme === 'venom' ? 'bg-zinc-900 text-white placeholder-zinc-500 focus:bg-black focus:border-venom-slime' : 'bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:bg-white focus:border-spidy-red'}`}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                                    <div>
                                                        <label className={`block text-sm font-black uppercase mb-3 opacity-80 italic tracking-widest flex items-center gap-2 ${theme === 'venom' ? 'text-lime-400' : 'text-zinc-900'}`}>
                                                            <Hash size={16} /> TARGET_ID.EXE
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={tweetId}
                                                            onChange={(e) => setTweetId(e.target.value)}
                                                            placeholder="Numeric Signature"
                                                            className={`w-full p-4 rounded-xl border-2 border-black font-bold text-sm outline-none transition-colors
                                                            ${theme === 'venom' ? 'bg-zinc-900 text-white placeholder-zinc-500 focus:bg-black focus:border-venom-slime' : 'bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-spidy-red'}`}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-4 py-4 px-6 border-2 border-black rounded-xl ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime text-white' : 'bg-zinc-50 text-zinc-900'}`}>
                                                        <input
                                                            type="checkbox"
                                                            id="autoPost"
                                                            checked={autoPost}
                                                            onChange={(e) => setAutoPost(e.target.checked)}
                                                            className={`w-6 h-6 border-2 border-black rounded-md cursor-pointer ${theme === 'venom' ? 'accent-venom-slime' : 'accent-red-500'}`}
                                                        />
                                                        <label htmlFor="autoPost" className={`text-xs font-black uppercase tracking-tight cursor-pointer select-none ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-900'}`}>Autonomous Auto-Deployment</label>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {mode === 'original' && (
                                            <motion.div key="original" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                                                <div>
                                                    <label className={`block text-xs font-black uppercase mb-3 italic tracking-widest ${theme === 'venom' ? 'text-teal-400' : 'text-zinc-900'}`}>SYNTHESIS VECTOR (Topic)</label>
                                                    <input
                                                        type="text"
                                                        value={originalTopic}
                                                        onChange={(e) => setOriginalTopic(e.target.value)}
                                                        placeholder="e.g. quantum_blockchain_vibe"
                                                        className={`w-full p-6 rounded-xl border-2 border-black font-bold text-sm outline-none transition-colors
                                                        ${theme === 'venom' ? 'bg-zinc-900 text-white placeholder-zinc-500 focus:bg-black focus:border-venom-slime' : 'bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:bg-white focus:border-spidy-red'}`}
                                                    />
                                                </div>
                                                <div className={`flex items-center gap-4 py-4 px-6 border-2 border-black rounded-xl ${theme === 'venom' ? 'bg-zinc-900 border-venom-slime text-white' : 'bg-zinc-50 text-zinc-900'}`}>
                                                    <input
                                                        type="checkbox"
                                                        id="autoPostOriginal"
                                                        checked={autoPost}
                                                        onChange={(e) => setAutoPost(e.target.checked)}
                                                        className={`w-6 h-6 border-2 border-black rounded-md cursor-pointer ${theme === 'venom' ? 'accent-venom-slime' : 'accent-red-500'}`}
                                                    />
                                                    <label htmlFor="autoPostOriginal" className={`text-xs font-black uppercase tracking-tight cursor-pointer select-none ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-900'}`}>Autonomous Auto-Deployment</label>
                                                </div>
                                            </motion.div>
                                        )}

                                        {mode === 'discover' && (
                                            <motion.div key="discover" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                                <label className="block text-xs font-black uppercase mb-3 opacity-60 italic tracking-widest">DEEP_SCAN SIGNAL (Query)</label>
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="grep intel --target AI"
                                                    className={`w-full p-6 rounded-xl border-2 border-black font-bold text-sm outline-none transition-colors
                                                    ${theme === 'venom' ? 'bg-zinc-900 text-white placeholder-zinc-500 focus:bg-black focus:border-venom-slime' : 'bg-zinc-50 text-zinc-900 placeholder-zinc-500 focus:bg-white focus:border-spidy-red'}`}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleGenerate}
                                        disabled={loading}
                                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xl border-4 border-black transition-all flex items-center justify-center gap-4
                                        ${loading ? 'bg-zinc-200 cursor-not-allowed text-zinc-400' :
                                                (theme === 'venom' ? 'bg-venom-slime text-black neo-shadow hover:shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-red-500 text-white neo-shadow hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all')}
                                        `}
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={28} /> : (mode === 'discover' ? <Search size={28} /> : <Zap size={28} />)}
                                        {loading ? "INITIALIZING..." : (autoPost ? "DEPLOY SIGNAL" : "SYNTHESIZE CONTENT")}
                                    </motion.button>

                                    {/* Response Field */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-100 border-2 border-red-500 text-red-600 p-4 rounded-xl font-bold text-sm flex items-center gap-3">
                                                <AlertCircle size={20} />
                                                {error.toUpperCase()}
                                            </motion.div>
                                        )}

                                        {response && (
                                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-2xl border-2 border-black neo-shadow press-down ${theme === 'venom' ? 'bg-zinc-900' : 'bg-white'}`}>
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className={`text-xs font-black uppercase tracking-widest italic ${theme === 'venom' ? 'text-lime-400' : 'text-zinc-900'}`}>SYNTHESIZED OUTPUT DATA</h3>
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded border-2 border-black ${response.output?.result?.posted ? 'bg-green-400' : 'bg-orange-400'}`}>
                                                        {response.output?.result?.posted ? "DEPLOYED_LIVE" : "DRAFT_RETAINED"}
                                                    </span>
                                                </div>
                                                <div className={`p-6 rounded-xl border-2 border-zinc-200 font-bold text-xl leading-relaxed mb-6 ${theme === 'venom' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'} relative group`}>
                                                    {response.output?.result?.final_reply || "NULL SIGNAL"}
                                                    <button
                                                        onClick={() => handleCopy(response.output?.result?.final_reply || "", "current-response")}
                                                        className="absolute top-2 right-2 p-2 rounded bg-black/10 hover:bg-black/20 text-current opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {copiedId === "current-response" ? <ShieldCheck size={16} /> : <ExternalLink size={16} />}
                                                    </button>
                                                </div>
                                                <details className="mt-8">
                                                    <summary className={`cursor-pointer text-xs font-black uppercase tracking-widest flex items-center gap-2 ${theme === 'venom' ? 'text-fuchsia-400' : 'text-zinc-900'}`}>
                                                        <History size={14} /> View Raw Hex-Stream
                                                    </summary>
                                                    <pre className={`mt-4 p-4 rounded-xl text-[10px] font-bold overflow-x-auto border-2 ${theme === 'venom' ? 'bg-zinc-950 text-fuchsia-400 border-fuchsia-900/30' : 'bg-zinc-100 text-zinc-900 border-zinc-200'}`}>
                                                        {JSON.stringify(response, null, 2)}
                                                    </pre>
                                                </details>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 mb-8 space-y-6">
                        <div className="flex items-center gap-6">
                            <h2 className={`text-3xl font-black uppercase tracking-tighter ${theme === 'venom' ? 'text-fuchsia-500' : 'text-zinc-900'}`}>Signal Archives</h2>
                            <div className="flex-1 h-1 bg-zinc-200" />
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="text-4xl opacity-10">⚡</motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* REPLIES ARCHIVE */}
                            <div className="space-y-6">
                                <h3 className={`text-sm font-black uppercase ml-1 tracking-[0.2em] flex items-center justify-between ${theme === 'venom' ? 'opacity-60 text-white' : 'text-zinc-900 opacity-100'}`}>
                                    <span className="flex items-center gap-2"><MessageCircle size={18} /> Broadcast History</span>
                                    {repliesHistory.length > 0 && (
                                        <button onClick={() => handleClearHistory('replies')} className="hover:text-red-500 transition-colors" title="Clear History">
                                            <History size={16} />
                                        </button>
                                    )}
                                </h3>
                                <div className="space-y-4 max-h-[700px] h-auto overflow-y-auto pr-4 custom-scrollbar">
                                    <AnimatePresence initial={false}>
                                        {repliesHistory.map(item => (
                                            <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-xl border-2 border-black neo-shadow press-down flex flex-col gap-4 ${theme === 'venom' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-black opacity-60">{item.timestamp.toLocaleTimeString()}</span>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border-2 border-black ${item.type === 'posted' ? 'bg-green-400' : 'bg-orange-400'}`}>{item.type.toUpperCase()}</span>
                                                </div>
                                                <p className="font-bold text-lg leading-relaxed">{item.text}</p>
                                            </motion.div>
                                        ))}
                                        {repliesHistory.length === 0 && (
                                            <div className={`p-12 border-4 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-4 ${theme === 'venom' ? 'opacity-20' : 'opacity-100 text-zinc-400'}`}>
                                                <Activity size={48} />
                                                <p className={`text-sm font-black uppercase ${theme === 'venom' ? 'text-white' : 'text-zinc-900'}`}>Archive Empty</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* ORIGINALS ARCHIVE */}
                            <div className="space-y-6">
                                <h3 className={`text-sm font-black uppercase ml-1 tracking-[0.2em] flex items-center justify-between ${theme === 'venom' ? 'opacity-60 text-white' : 'text-zinc-900 opacity-100'}`}>
                                    <span className="flex items-center gap-2"><Sparkles size={18} /> Synthesis Manifest</span>
                                    {originalsHistory.length > 0 && (
                                        <button onClick={() => handleClearHistory('originals')} className="hover:text-red-500 transition-colors" title="Clear History">
                                            <History size={16} />
                                        </button>
                                    )}
                                </h3>
                                <div className="space-y-4 max-h-[700px] h-auto overflow-y-auto pr-4 custom-scrollbar">
                                    <AnimatePresence initial={false}>
                                        {originalsHistory.map(item => (
                                            <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`p-6 rounded-xl border-2 border-black neo-shadow flex flex-col gap-4 ${theme === 'venom' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-black opacity-60">{item.timestamp.toLocaleTimeString()}</span>
                                                    {item.meta && <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-400 border-2 border-black shadow-neobrutalism-sm truncate max-w-[50%]">{item.meta}</span>}
                                                </div>
                                                <p className="font-bold text-lg leading-relaxed">{item.text}</p>
                                            </motion.div>
                                        ))}
                                        {originalsHistory.length === 0 && (
                                            <div className={`p-12 border-4 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-4 ${theme === 'venom' ? 'opacity-20' : 'opacity-100 text-zinc-400'}`}>
                                                <Cpu size={48} />
                                                <p className={`text-sm font-black uppercase ${theme === 'venom' ? 'text-white' : 'text-zinc-900'}`}>Manifest Clear</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Branding Area */}
                    <footer className="mt-6 pt-10 border-t-2 border-zinc-100 flex justify-between items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Global_Control_Authority_v2.0.1</p>
                        <div className="flex gap-6">
                            <motion.div whileHover={{ scale: 1.2 }} className="cursor-help"><Activity size={16} /></motion.div>
                            <motion.div whileHover={{ scale: 1.2 }} className="cursor-help"><Cpu size={16} /></motion.div>
                        </div>
                    </footer>
                </div>
            </section>
        </>
    );
}
