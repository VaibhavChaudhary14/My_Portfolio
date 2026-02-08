import { MockStore } from "../data-engine/mock-store";
import { EngagementEvent } from "../types";
import { LLMClient } from "../intelligence/llm-client";

export class AutoPilot {
    private store: MockStore;
    private llm: LLMClient;

    constructor() {
        this.store = MockStore.getInstance();
        this.llm = new LLMClient();
    }

    /**
     * Main Decision Loop: Checks unprocessed events and decides action
     */
    async runDecisionLoop() {
        // Get fresh data
        const events = await this.store.getEngagementFeed();
        const unprocessed = events.filter(e => !e.processed);

        if (unprocessed.length === 0) return;

        await this.store.addLog({
            component: 'ACTION',
            level: 'INFO',
            message: `Analyzing ${unprocessed.length} pending signals...`
        });

        for (const event of unprocessed) {
            await this.decideAction(event);
        }
    }

    private async decideAction(event: EngagementEvent) {
        // 1. Safety Checks (Allowlist/Blocklist/Sentiment)
        if (event.intent === 'complaint') {
            await this.store.addLog({
                component: 'ACTION',
                level: 'WARN',
                message: `[ESCALATE] Human review required for ${event.user_handle} (Negative Sentiment)`
            });
            // logic to flag for human review would go here
            return;
        }

        // 2. Reply logic using In-House LLM
        let replyText = "";

        const systemPrompt = "You are a friendly and helpful AI assistant on X (Twitter). Draft a short, engaging reply to the following user tweet. Don't be too generic.";

        if (event.intent === 'question') {
            replyText = await this.llm.generateText(systemPrompt + " Answer the question helpfully.", event.text);
        } else if (event.intent === 'lead') {
            replyText = await this.llm.generateText(systemPrompt + " Ask to move to DMs for collaboration.", event.text);
        } else {
            // Neutral/Praise -> Like only
            await this.store.addLog({
                component: 'ACTION',
                level: 'SUCCESS',
                message: `[LIKE] Consumed signal from ${event.user_handle}`
            });
            return;
        }

        // 3. Execute Reply
        await this.store.addLog({
            component: 'ACTION',
            level: 'SUCCESS',
            message: `[AUTO-REPLY] Drafting response to ${event.user_handle}: "${replyText}"`
        });

        // Mark as processed (in a real app, we'd update the DB)
        event.processed = true;
    }
}
