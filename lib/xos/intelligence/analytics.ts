import { SupabaseStore } from "../data-engine/supabase-store";
import { AnalyticsSnapshot } from "../types";

export class AnalyticsEngine {
    private store: SupabaseStore;

    constructor() {
        this.store = SupabaseStore.getInstance();
    }

    async getSnapshot(): Promise<AnalyticsSnapshot> {
        return this.generateSnapshot();
    }

    async generateSnapshot(): Promise<AnalyticsSnapshot> {
        const events = await this.store.getEngagementFeed();
        const queue = await this.store.getQueue();

        // Calculate rudimentary stats
        const totalEngagements = events.length;
        const leadCount = events.filter(e => e.intent === 'lead').length;
        const questionCount = events.filter(e => e.intent === 'question').length;

        const topIntent = leadCount > questionCount ? 'lead' : 'question';

        const snapshot: AnalyticsSnapshot = {
            date: new Date().toISOString(),
            impressions: totalEngagements * 145, // Pseudo-multiplier
            engagements: totalEngagements,
            new_followers: Math.floor(totalEngagements / 5),
            top_intent: topIntent
        };

        // Only log if explicit generation? Or maybe just silence this to avoid log spam on refresh
        // await this.store.addLog({
        //     component: 'INTEL',
        //     level: 'INFO',
        //     message: `Generated Daily Snapshot. Impressions: ${snapshot.impressions}`
        // });

        return snapshot;
    }
}
