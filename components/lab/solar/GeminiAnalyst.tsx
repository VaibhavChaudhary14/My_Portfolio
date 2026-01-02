"use client";

import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function GeminiAnalyst() {
    const { latitude, declination, hourAngle } = useSolarStore();
    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Helper to calculate current solar angles for payload
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const latRad = toRad(latitude);
    const decRad = toRad(declination);
    const haRad = toRad(hourAngle);

    const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
    const altRad = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    const altitude = toDeg(altRad);
    const zenithAngle = 90 - altitude;
    const incidentAngle = zenithAngle; // For horizontal plane

    const [mode, setMode] = useState<"child" | "student" | "researcher">("student");

    const handleAnalyze = async () => {
        setLoading(true);
        setAnalysis(null);

        try {
            const res = await fetch("/api/lab/solar-analyst", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    latitude,
                    declination,
                    hourAngle,
                    altitude,
                    zenithAngle,
                    incidentAngle,
                    mode // Pass the selected mode
                }),
            });

            const data = await res.json();
            if (data.analysis) {
                setAnalysis(data.analysis);
            } else {
                setAnalysis("Could not generate analysis. Please try again.");
            }
        } catch (error) {
            setAnalysis("Error connecting to the lab backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                    <Sparkles className={`w-5 h-5 ${isVenom ? 'text-venom-slime' : 'text-amber-400'}`} />
                    AI Analyst
                </h3>

                {/* Persona Selector */}
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                    className={`bg-black/40 border border-zinc-600 text-xs rounded px-2 py-1 text-zinc-300 outline-none ${isVenom ? 'focus:border-venom-slime' : 'focus:border-amber-500'}`}
                >
                    <option value="child">Explain like I'm 12</option>
                    <option value="student">Physics Student</option>
                    <option value="researcher">Engineer / Researcher</option>
                </select>
            </div>

            <p className="text-xs text-zinc-400">
                Ask Gemini to interpret the current solar geometry physics.
            </p>

            <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 ${isVenom ? 'bg-venom-slime text-black' : 'bg-gradient-to-r from-red-600 to-blue-600 text-white'}`}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                    </>
                ) : (
                    "Generate Analysis"
                )}
            </button>

            {analysis && (
                <div className="mt-4 p-3 bg-black/20 rounded border border-white/5 text-sm text-zinc-200 leading-relaxed max-h-[300px] overflow-y-auto font-sans">
                    <ReactMarkdown
                        components={{
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            strong: ({ node, ...props }) => <span className="font-bold text-amber-200" {...props} />
                        }}
                    >
                        {analysis}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}
