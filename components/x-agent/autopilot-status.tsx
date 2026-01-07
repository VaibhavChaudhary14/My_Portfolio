"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { Zap, Clock, Target, Activity } from "lucide-react";

export default function AutopilotStatus() {
    const { theme } = useThemeStore();

    return (
        <div className={`neo-brutalism-card p-4 flex flex-col md:flex-row items-center justify-between gap-6 px-8
            ${theme === 'venom'
                ? 'bg-zinc-900 border-venom-slime shadow-venom text-gray-200'
                : 'bg-white border-black shadow-neobrutalism text-zinc-800'}`}>

            {/* Status Indicator */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className={`w-3 h-3 rounded-full animate-ping absolute ${theme === 'venom' ? 'bg-venom-slime' : 'bg-red-500'}`}></div>
                    <div className={`w-3 h-3 rounded-full relative ${theme === 'venom' ? 'bg-venom-slime' : 'bg-red-500'}`}></div>
                </div>
                <div>
                    <h3 className={`font-black text-xs uppercase tracking-widest italic ${theme === 'venom' ? 'text-cyan-400' : ''}`}>Sim.ai Autopilot</h3>
                    <p className={`text-[10px] font-bold font-mono ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-400'}`}>
                        SYSTEM ONLINE • V2.2.0 RC
                    </p>
                </div>
            </div>

            {/* Metrics/Config */}
            <div className="flex items-center gap-8 text-[10px] font-black md:border-l-2 md:pl-8 border-dashed border-zinc-200">
                <div className="flex items-center gap-3">
                    <Clock size={14} className={theme === 'venom' ? 'text-venom-purple' : 'text-zinc-400'} />
                    <div>
                        <p className={`uppercase tracking-tighter ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-500'}`}>NEXT_RUN</p>
                        <p className={`italic ${theme === 'venom' ? 'text-blue-400' : 'text-spidy-blue'}`}>:30 (Hourly)</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Target size={14} className={theme === 'venom' ? 'text-venom-purple' : 'text-zinc-400'} />
                    <div>
                        <p className={`uppercase tracking-tighter ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-500'}`}>TARGETS</p>
                        <p className={`italic ${theme === 'venom' ? 'text-purple-400' : 'text-spidy-blue'}`}>ML, Grid, AI</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Activity size={14} className={theme === 'venom' ? 'text-venom-purple' : 'text-zinc-400'} />
                    <div>
                        <p className={`uppercase tracking-tighter ${theme === 'venom' ? 'text-venom-slime' : 'text-zinc-500'}`}>MODE</p>
                        <p className="italic text-red-500">BATTLE_READY</p>
                    </div>
                </div>
            </div>

            {/* Badge */}
            <div className={`px-4 py-1.5 rounded border-2 border-black font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                ${theme === 'venom' ? 'bg-venom-slime text-black' : 'bg-green-400 text-black'}`}>
                LIVE_FEED
            </div>
        </div>
    );
}
