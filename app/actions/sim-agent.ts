'use server';

type SimMode = 'reply' | 'discover' | 'original';

interface SimPayload {
    mode: SimMode;
    post_text?: string;
    original_topic?: string;
    search_query?: string;
    author_handle?: string;
    tweet_id?: string;
    auto_post?: boolean;
}

export async function runSimWorkflow(payload: SimPayload) {
    const SIM_API_KEY = process.env.SIM_API_KEY;

    if (!SIM_API_KEY) {
        return { error: "API Key not configured in .env.local" };
    }

    // Default values for robustness
    const defaults = {
        is_high_signal_author: true,
        daily_reply_budget: 10,
        replies_used_today: 0,
        recent_replies: [],
        recent_authors_engaged: [],
        recent_topics: [],
        auto_post: false
    };

    try {
        const response = await fetch("https://www.sim.ai/api/workflows/9c22819b-3ee1-4d33-8370-0153abe6ff15/execute", {
            method: "POST",
            headers: {
                "X-API-Key": SIM_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...defaults,
                ...payload
            })
        });

        if (!response.ok) {
            const text = await response.text();
            return { error: `API Error: ${response.status} ${text}` };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Sim.ai API Error:", error);
        return { error: "Failed to connect to Sim.ai API" };
    }
}
