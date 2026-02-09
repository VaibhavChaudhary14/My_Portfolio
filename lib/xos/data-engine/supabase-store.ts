import { getSupabaseClient } from "../db";
import { QueueItem, EngagementEvent, SystemLog } from "../types";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseStore {
    private static instance: SupabaseStore;

    private _client: SupabaseClient;

    constructor() {
        this._client = getSupabaseClient();
    }

    public static getInstance(): SupabaseStore {
        if (!SupabaseStore.instance) {
            SupabaseStore.instance = new SupabaseStore();
        }
        return SupabaseStore.instance;
    }

    get supabase() {
        return this._client;
    }

    // --- READS ---

    async getQueue(): Promise<QueueItem[]> {
        const { data, error } = await this.supabase
            .from('xos_queue')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching queue:", error);
            return [];
        }
        return data as QueueItem[];
    }

    async getEngagementFeed(): Promise<EngagementEvent[]> {
        const { data, error } = await this.supabase
            .from('xos_engagements')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching engagements:", error);
            return [];
        }
        return data as EngagementEvent[];
    }

    async getLogs(): Promise<SystemLog[]> {
        const { data, error } = await this.supabase
            .from('xos_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching logs:", error);
            return [];
        }
        return data as SystemLog[];
    }

    // --- WRITES ---

    async addLog(log: Omit<SystemLog, "id" | "timestamp">) {
        const { error } = await this.supabase.from('xos_logs').insert({
            message: log.message,
            level: log.level,
            component: log.component
        });
        if (error) console.error("Log Error:", error);
    }

    async addToQueue(item: Omit<QueueItem, "id" | "created_at">) {
        const { error } = await this.supabase.from('xos_queue').insert(item);
        if (error) {
            console.error("Queue Insert Error Details:", JSON.stringify(error, null, 2));
            console.error("Failed Item:", item);
        }
    }

    async addEngagement(item: Omit<EngagementEvent, "id" | "created_at">) {
        const { error } = await this.supabase.from('xos_engagements').insert(item);
        if (error) console.error("Engagement Insert Error:", error);
    }

    async updateQueueStatus(id: string, status: 'queued' | 'published' | 'archived') {
        const { error } = await this.supabase
            .from('xos_queue')
            .update({ status })
            .eq('id', id);

        if (error) console.error("Update Status Error:", error);
    }
}
