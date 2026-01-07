"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { BackButton } from "@/components/back-button";
import XAgentDemo from "@/components/x-agent/agent-demo";

export default function XAgentLab() {
    const { theme } = useThemeStore();

    return (
        <main className={`min-h-screen ${theme === 'venom' ? 'bg-black text-gray-200' : 'bg-[#fbfbfb] text-zinc-900'}`}>
            <div className="absolute top-8 left-8 z-50">
                <BackButton />
            </div>

            <XAgentDemo />
        </main>
    );
}
