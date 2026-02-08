import { QueueItem, EngagementEvent, SystemLog, AnalyticsSnapshot } from "../types";

export class MockStore {

    // Singleton instance
    private static instance: MockStore;

    public static getInstance(): MockStore {
        if (!MockStore.instance) {
            MockStore.instance = new MockStore();
        }
        return MockStore.instance;
    }

    // In-memory "Database"
    private queue: QueueItem[] = [
        {
            id: '1',
            source: 'blog',
            title: 'The Future of Smart Grids',
            generated_tweet: '⚡️ Smart Grids are the nervous system of our energy future.\n\nHere is how AI is optimizing load balancing in real-time. 🧵👇',
            status: 'queued',
            scheduled_for: new Date(Date.now() + 3600000).toISOString(),
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            source: 'manual',
            title: 'Weekly Update',
            generated_tweet: 'Building XOS v3 in public. The architecture is modular and sick. #BuildInPublic',
            status: 'draft',
            created_at: new Date().toISOString()
        }
    ];

    private engagements: EngagementEvent[] = [
        {
            id: 'e1',
            user_handle: '@elonmusk',
            user_score: 99,
            type: 'reply',
            text: 'Interesting architecture.',
            intent: 'neutral',
            timestamp: new Date().toISOString(),
            processed: false
        },
        {
            id: 'e2',
            user_handle: '@tech_recruit',
            user_score: 45,
            type: 'mention',
            text: 'Are you open to AI roles? DM me.',
            intent: 'lead',
            timestamp: new Date(Date.now() - 100000).toISOString(),
            processed: false
        }
    ];

    private logs: SystemLog[] = [];

    // Methods
    async getQueue(): Promise<QueueItem[]> {
        return this.queue;
    }

    async getEngagementFeed(): Promise<EngagementEvent[]> {
        return this.engagements;
    }

    async addLog(log: Omit<SystemLog, "id" | "timestamp">) {
        const newLog = {
            ...log,
            id: Math.random().toString(36),
            timestamp: new Date().toISOString()
        };
        this.logs.unshift(newLog);
        return newLog;
    }
    async addToQueue(item: QueueItem) {
        this.queue.unshift(item);
    }

    async addEngagement(item: EngagementEvent) {
        this.engagements.unshift(item);
    }

    async updateQueueStatus(id: string, status: 'queued' | 'published' | 'archived') {
        const item = this.queue.find(q => q.id === id);
        if (item) {
            item.status = status;
        }
    }
}
