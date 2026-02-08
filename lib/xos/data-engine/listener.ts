import { SupabaseStore } from "./supabase-store";
import { EngagementEvent, IntentType } from "../types";

export class EngagementListener {
    private store: SupabaseStore;

    constructor() {
        this.store = SupabaseStore.getInstance();
    }

    /**
     * Simulates polling the X API for new mentions/replies
     */
    async pollForMentions() {
        await this.store.addLog({
            component: 'DATA',
            level: 'INFO',
            message: 'Polling X API for new mentions...'
        });

        // Simulate API Polling Latency
        await new Promise(r => setTimeout(r, 1000));

        // Simulate finding a random new mention
        const foundNew = Math.random() > 0.5;

        if (foundNew) {
            const event = this.generateMockEvent();
            await this.processEvent(event);
            return event;
        } else {
            await this.store.addLog({
                component: 'DATA',
                level: 'INFO',
                message: 'No new mentions found.'
            });
            return null;
        }
    }

    private async processEvent(event: EngagementEvent) {
        // 1. Log Raw Ingest
        await this.store.addLog({
            component: 'DATA',
            level: 'SUCCESS',
            message: `Captured new engagement from ${event.user_handle}`
        });

        // 2. Classify & Score (Simulation)
        // Real logic would use LLM to detect intent + DB to check user history
        event.intent = this.classifyIntent(event.text);
        event.user_score = Math.floor(Math.random() * 100);

        // 3. Store
        // Omit id because Supabase generates it
        const { id, ...dbItem } = event;

        await this.store.addEngagement(dbItem as any);

        await this.store.addLog({
            component: 'DATA',
            level: 'SUCCESS',
            message: `Processed Event: [${event.intent.toUpperCase()}] Score: ${event.user_score}`
        });
    }

    private generateMockEvent(): EngagementEvent {
        const templates = [
            { text: "Can you explain how the queue system works?", intent: 'question' },
            { text: "This is amazing! #BuildInPublic", intent: 'praise' },
            { text: "I tried this but got an error in the logs.", intent: 'complaint' },
            { text: "DM me for a collab.", intent: 'lead' }
        ];

        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        const id = Math.random().toString(36).substring(7);

        return {
            id: `evt_${id}`,
            user_handle: `@user_${id}`,
            user_score: 0, // Calculated later
            type: 'mention',
            text: randomTemplate.text,
            intent: 'neutral', // Will be classified
            timestamp: new Date().toISOString(),
            processed: false
        };
    }

    private classifyIntent(text: string): IntentType {
        if (text.includes("?")) return 'question';
        if (text.includes("amazing") || text.includes("cool")) return 'praise';
        if (text.includes("error") || text.includes("fail")) return 'complaint';
        if (text.includes("DM") || text.includes("collab")) return 'lead';
        return 'neutral';
    }
}
