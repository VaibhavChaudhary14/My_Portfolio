
import { LLMClient } from "./llm-client";
import { AGENT_PERSONA } from "./persona";
import { SupabaseStore } from "../data-engine/supabase-store";

export interface AgentSignal {
    source: "rss" | "manual" | "note" | "trend";
    content: string;
    metadata?: {
        title?: string;
        link?: string;
        topic?: string;
    };
}

export interface AgentDecision {
    intent: {
        action: "ignore" | "post" | "thread";
        confidence: number;
        rationale: string;
        riskLevel: "low" | "medium" | "high";
    };
    draft?: {
        text: string;
        format: "post" | "thread";
        hashtags?: string[];
    };
    confidenceBreakdown?: {
        relevance: number;
        insight: number;
        originality: number;
        toneFit: number;
        riskPenalty: number;
    };
}

export class ReasoningEngine {
    private llm: LLMClient;
    private store: SupabaseStore;

    constructor() {
        this.llm = new LLMClient();
        this.store = SupabaseStore.getInstance();
    }

    async evaluateSignal(signal: AgentSignal): Promise<AgentDecision> {
        await this.store.addLog({
            component: 'INTEL',
            level: 'INFO',
            message: `[Brain 2] Evaluating signal for Agent XOS...`
        });

        const userPrompt = `
        INCOMING SIGNAL:
        Source: ${signal.source}
        Metadata: ${JSON.stringify(signal.metadata || {})}
        Content: "${signal.content}"
        `;

        try {
            const responseText = await this.llm.generateText(AGENT_PERSONA, userPrompt);

            // Heuristic cleanup for JSON
            const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const decision: AgentDecision = JSON.parse(cleanJson);

            const confidencePct = (decision.intent.confidence * 100).toFixed(0);
            const action = decision.intent.action.toUpperCase();

            await this.store.addLog({
                component: 'INTEL',
                level: 'SUCCESS',
                message: `[Decision] ${action} (${confidencePct}%) - Risk: ${decision.intent.riskLevel.toUpperCase()}`
            });

            return decision;

        } catch (error: any) {
            console.error("Reasoning Error:", error);
            await this.store.addLog({
                component: 'INTEL',
                level: 'ERROR',
                message: `[Brain 2] Reasoning Failed: ${error.message}`
            });

            return {
                intent: { action: "ignore", confidence: 0, rationale: "Error in reasoning.", riskLevel: "high" }
            };
        }
    }
}
