export type ContentStatus = 'draft' | 'queued' | 'published' | 'failed';
export type EngagementType = 'mention' | 'reply' | 'quote' | 'like';
export type IntentType = 'question' | 'praise' | 'complaint' | 'neutral' | 'lead';

export interface QueueItem {
    id: string;
    source: 'blog' | 'youtube' | 'manual' | 'rss';
    title: string;
    generated_tweet: string;
    status: ContentStatus;
    scheduled_for?: string; // ISO Date
    created_at: string;
    // Agent Intelligence Metadata
    confidence?: number;
    risk_level?: 'low' | 'medium' | 'high';
    rationale?: string;
}

export interface EngagementEvent {
    id: string;
    user_handle: string;
    user_score: number; // 0-100 influence score
    type: EngagementType;
    text: string;
    intent: IntentType;
    timestamp: string;
    processed: boolean;
}

export interface SystemLog {
    id: string;
    component: 'CONTENT' | 'DATA' | 'ACTION' | 'INTEL' | 'CRM' | 'KERNEL';
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
    message: string;
    timestamp: string;
}

export interface AnalyticsSnapshot {
    date: string;
    impressions: number;
    engagements: number;
    new_followers: number;
    top_intent: IntentType;
}
