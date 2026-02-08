import { SupabaseStore } from "../data-engine/supabase-store";
import { EngagementEvent } from "../types";

export interface LeadProfile {
    handle: string;
    score: number;
    notes: string;
    status: 'new' | 'contacted' | 'converted';
    last_interaction: string;
}

export class CRMEngine {
    private store: SupabaseStore;
    private leads: Map<string, LeadProfile>;

    constructor() {
        this.store = SupabaseStore.getInstance();
        this.leads = new Map();
    }

    // In a real app, this would sync to a Postgres 'leads' table
    async syncLeadsFromStore() {
        const events = await this.store.getEngagementFeed();

        // Filter for unprocessed leads or high-score users
        const potentialLeads = events.filter(e => e.intent === 'lead' || e.user_score > 85);

        let newLeadsCount = 0;

        for (const event of potentialLeads) {
            if (!this.leads.has(event.user_handle)) {
                this.leads.set(event.user_handle, {
                    handle: event.user_handle,
                    score: event.user_score,
                    notes: `Auto-Detected via ${event.type}. Context: ${event.text.substring(0, 50)}...`,
                    status: 'new',
                    last_interaction: event.timestamp
                });
                newLeadsCount++;
            }
        }

        if (newLeadsCount > 0) {
            await this.store.addLog({
                component: 'CRM',
                level: 'SUCCESS',
                message: `Synced ${newLeadsCount} new leads from engagement feed.`
            });
        }

        return Array.from(this.leads.values());
    }

    async getLeads(): Promise<LeadProfile[]> {
        return Array.from(this.leads.values());
    }
}
