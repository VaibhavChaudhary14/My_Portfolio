"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store/useThemeStore";
import ReactMarkdown from 'react-markdown';

type Message = {
    role: "user" | "assistant";
    content: string;
};

export function ChatWidget() {
    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    // Theme Constants
    const botName = isVenom ? "Ask Venom" : "Ask Spidy";
    const botAvatar = isVenom ? "/venom.svg" : "/spiderman.svg";
    const accentColor = isVenom ? "venom-slime" : "spidy-red"; // Defined in globals or generic

    // Updated greeting
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant", content: isVenom
                ? "We are Venom. What do you want to know about Vaibhav?"
                : "Hey there! I'm your friendly neighborhood assistant. Ask me anything about Vaibhav!"
        }
    ]);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        "What is your latest project?",
        "Tell me about SaafSaksham",
        "What are your skills?",
        "How can I contact you?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Update greeting when theme changes if generic greeting is still there (optional polish, skipping to avoid reset)

    const handleSuggestionClick = (suggestion: string) => {
        setInput(suggestion);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage, history: messages }),
            });

            let data;

            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error("Failed to parse response: " + response.statusText);
            }

            if (!response.ok) {
                if (data.reply) {
                    setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
                    return;
                }
                throw new Error(data.error || "Failed to fetch response");
            }

            setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: `System Error: ${error.message || "Something went wrong. Please try again."}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-80 max-w-[calc(100vw-3rem)] md:w-[350px] h-[500px] bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_#84cc16] z-50 rounded-xl flex flex-col runner-hidden font-sans"
                    >
                        {/* Header */}
                        <div className={`p-4 border-b-2 border-black dark:border-venom-slime flex items-center justify-between ${isVenom ? 'bg-zinc-800 text-white' : 'bg-red-50 text-black'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full border-2 border-black dark:border-venom-slime bg-white overflow-hidden relative shadow-sm`}>
                                    <Image
                                        src={botAvatar}
                                        alt="Avatar"
                                        fill
                                        className="object-cover p-1"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg leading-none">{botName}</h3>
                                    <span className="text-xs font-mono uppercase opacity-70 flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/50 scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-venom-slime scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 border-black dark:border-venom-slime flex items-center justify-center shrink-0 overflow-hidden relative ${msg.role === "user" ? "bg-white dark:bg-zinc-800" : "bg-white dark:bg-black"}`}>
                                        {msg.role === "user" ? (
                                            <User size={14} />
                                        ) : (
                                            <Image src={botAvatar} alt="Bot" fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className={`p-3 rounded-xl border-2 max-w-[85%] text-sm overflow-hidden ${msg.role === "user"
                                        ? "bg-white dark:bg-zinc-800 border-black dark:border-zinc-700 rounded-tr-none"
                                        : "bg-white dark:bg-zinc-900 border-black dark:border-venom-slime rounded-tl-none prose dark:prose-invert prose-sm max-w-none text-left"
                                        }`}>
                                        {msg.role === "user" ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Loading Indicator */}
                            {isLoading && (
                                <motion.div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-black dark:border-venom-slime bg-white dark:bg-black flex items-center justify-center shrink-0 overflow-hidden relative">
                                        <Image src={botAvatar} alt="Bot" fill className="object-cover" />
                                    </div>
                                    <div className="p-3 bg-gray-100 dark:bg-zinc-800/50 rounded-xl rounded-tl-none border-2 border-transparent flex gap-1 items-center h-[46px]">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Suggestions */}
                            {messages.length < 3 && !isLoading && (
                                <div className="grid grid-cols-1 gap-2 mt-4">
                                    <p className="text-xs font-bold opacity-50 mb-1 ml-1">{isVenom ? "ASK SYMBIOTE:" : "ASK SPIDY:"}</p>
                                    {suggestions.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleSuggestionClick(s)}
                                            className="text-left text-xs p-2 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t-2 border-black dark:border-venom-slime bg-white dark:bg-zinc-900">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={isVenom ? "Ask Venom..." : "Ask Spidy..."}
                                    className="w-full pl-4 pr-12 py-3 rounded-lg border-2 border-gray-200 dark:border-zinc-700 focus:border-black dark:focus:border-venom-slime focus:outline-none bg-transparent transition-colors font-sans text-sm"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all ${isVenom ? "bg-venom-slime text-black" : "bg-red-600 text-white"}`}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                            <div className="text-[10px] text-center mt-2 text-gray-400 dark:text-gray-600 font-mono">
                                Powered by Hybrid AI • {isVenom ? "Venom Mode" : "Spidy Sense"}
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button & Label */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-[75px] right-6 z-40 pointer-events-none"
                    >
                        <span className={`px-3 py-1 rounded-md text-sm font-bold shadow-neobrutalism-sm mb-2 block whitespace-nowrap border-2 border-transparent dark:border-black ${isVenom ? "bg-venom-slime text-black" : "bg-red-600 text-white"}`}>
                            {botName}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`fixed bottom-6 right-6 p-4 rounded-full border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 transition-colors overflow-hidden ${isVenom
                    ? 'bg-venom-slime border-venom-slime text-black shadow-[4px_4px_0px_0px_white]'
                    : 'bg-red-600 border-black text-white'
                    }`}
            >
                {isOpen ? <X size={24} /> : (
                    <div className="relative w-6 h-6">
                        <Image src={botAvatar} alt="Chat" fill className="object-contain" />
                    </div>
                )}
            </motion.button>
        </>
    );
}
