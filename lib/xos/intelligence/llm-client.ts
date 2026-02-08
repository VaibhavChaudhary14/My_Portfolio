import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { SupabaseStore } from "../data-engine/supabase-store";

export class LLMClient {
    private genAI: GoogleGenerativeAI | null = null;
    private openai: OpenAI | null = null;
    private groq: OpenAI | null = null; // Using OpenAI SDK for Groq
    private store: SupabaseStore;

    constructor() {
        this.store = SupabaseStore.getInstance();

        // Initialize Gemini (Primary)
        const geminiKey = process.env.GEMINI_API_KEY?.trim();
        if (geminiKey) {
            console.error(`[LLMClient] 🟢 Gemini Ready: ${geminiKey.substring(0, 8)}...`);
            this.genAI = new GoogleGenerativeAI(geminiKey);
        }

        // Initialize OpenAI (Fallback 1)
        const openaiKey = process.env.OPENAI_API_KEY?.trim();
        if (openaiKey) {
            console.error(`[LLMClient] 🔵 OpenAI Ready: ${openaiKey.substring(0, 8)}...`);
            this.openai = new OpenAI({ apiKey: openaiKey });
        }

        // Initialize Groq (Fallback 2) - Uses OpenAI SDK with custom baseURL
        const groqKey = process.env.GROQ_API_KEY?.trim();
        if (groqKey) {
            console.error(`[LLMClient] 🟠 Groq Ready: ${groqKey.substring(0, 8)}...`);
            this.groq = new OpenAI({
                apiKey: groqKey,
                baseURL: "https://api.groq.com/openai/v1"
            });
        }

        const totalProviders = [geminiKey, openaiKey, groqKey].filter(Boolean).length;
        console.error(`[LLMClient] ✅ Initialized with ${totalProviders} AI provider(s) + Simulation`);
    }

    /**
     * Generates text based on a prompt.
     * Tries providers in order: Gemini → OpenAI → Groq → Simulation
     */
    async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
        // Try Gemini first
        if (this.genAI) {
            const result = await this.tryGemini(systemPrompt, userPrompt);
            if (result) return result;
        }

        // Try OpenAI as fallback
        if (this.openai) {
            const result = await this.tryOpenAI(systemPrompt, userPrompt);
            if (result) return result;
        }

        // Try Groq as second fallback
        if (this.groq) {
            const result = await this.tryGroq(systemPrompt, userPrompt);
            if (result) return result;
        }

        // Final fallback to simulation
        await this.store.addLog({
            component: 'INTEL',
            level: 'WARN',
            message: '⚠️ All AI providers failed. Using Simulation.'
        });
        return this.simulateResponse(systemPrompt, userPrompt);
    }

    private async tryGemini(systemPrompt: string, userPrompt: string): Promise<string | null> {
        try {
            const model = this.genAI!.getGenerativeModel({ model: "gemini-1.5-flash-002" });
            const fullPrompt = `${systemPrompt}\n\nUSER INPUT: ${userPrompt}`;
            const result = await model.generateContent(fullPrompt);
            const text = result.response.text();

            await this.store.addLog({
                component: 'INTEL',
                level: 'SUCCESS',
                message: '🟢 Gemini responded'
            });

            return text;
        } catch (error: any) {
            console.error("Gemini failed:", error.message);
            await this.store.addLog({
                component: 'INTEL',
                level: 'WARN',
                message: `Gemini failed. Trying fallback...`
            });
            return null;
        }
    }

    private async tryOpenAI(systemPrompt: string, userPrompt: string): Promise<string | null> {
        try {
            const completion = await this.openai!.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const text = completion.choices[0]?.message?.content || "";

            await this.store.addLog({
                component: 'INTEL',
                level: 'SUCCESS',
                message: '🔵 OpenAI responded'
            });

            return text;
        } catch (error: any) {
            console.error("OpenAI failed:", error.message);
            await this.store.addLog({
                component: 'INTEL',
                level: 'WARN',
                message: `OpenAI failed. Trying fallback...`
            });
            return null;
        }
    }

    private async tryGroq(systemPrompt: string, userPrompt: string): Promise<string | null> {
        try {
            const completion = await this.groq!.chat.completions.create({
                model: "llama-3.3-70b-versatile", // Fast and powerful
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            const text = completion.choices[0]?.message?.content || "";

            await this.store.addLog({
                component: 'INTEL',
                level: 'SUCCESS',
                message: '🟠 Groq (Llama 3.3) responded'
            });

            return text;
        } catch (error: any) {
            console.error("Groq failed:", error.message);
            await this.store.addLog({
                component: 'INTEL',
                level: 'WARN',
                message: `Groq failed. Trying fallback...`
            });
            return null;
        }
    }

    private simulateResponse(system: string, user: string): string {
        // Basic heuristic to return something relevant in "Offline/Demo" mode
        if (system.includes("tweet generator")) {
            return `🚀 [SIMULATED] Processed: "${user.substring(0, 20)}..."\n\nAI Agents are the future of automation. #BuildingPublic`;
        }
        if (system.includes("sentiment")) {
            if (user.includes("bad") || user.includes("error")) return "complaint";
            if (user.includes("help")) return "question";
            if (user.includes("dm")) return "lead";
            return "praise";
        }
        // Agent Reasoning Simulation
        if (system.includes("Agent XOS") || system.includes("Vaibhav")) {
            // Deterministic simulation based on content
            const isRelevant = user.includes("AI") || user.includes("grid") || user.includes("energy");

            if (isRelevant) {
                // Dynamic Simulation based on input
                const topics = ["physics", "grid", "AI", "power"];
                const actions = ["analyzing", "optimizing", "predicting", "restoring"];
                const titleSnippet = user.substring(0, 15);

                return JSON.stringify({
                    intent: {
                        action: "post",
                        confidence: 0.85 + Math.random() * 0.1,
                        rationale: `Simulated high relevance for: ${titleSnippet}...`,
                        riskLevel: "low"
                    },
                    draft: {
                        format: "post",
                        text: `Analyzing: "${user.substring(0, 40)}..." \n\nThis intersects with ${topics[Math.floor(Math.random() * topics.length)]} first principles.\n\nStartups in this space need to focus on ${actions[Math.floor(Math.random() * actions.length)]} resilience, not just hype.`,
                        hashtags: ["#EnergyAI", "#SmartGrid", "#DeepTech"]
                    },
                    confidenceBreakdown: {
                        relevance: 0.9,
                        insight: 0.8,
                        originality: 0.7,
                        toneFit: 0.9,
                        riskPenalty: 0.0
                    }
                });
            } else {
                return JSON.stringify({
                    intent: {
                        action: "ignore",
                        confidence: 0.45,
                        rationale: "Topic irrelevant to EE/AI niche (Simulation).",
                        riskLevel: "low"
                    },
                    confidenceBreakdown: {
                        relevance: 0.2,
                        insight: 0.1,
                        originality: 0.0,
                        toneFit: 0.3,
                        riskPenalty: 0.0
                    }
                });
            }
        }

        return JSON.stringify({ error: "Unknown simulation prompt" });
    }
}
