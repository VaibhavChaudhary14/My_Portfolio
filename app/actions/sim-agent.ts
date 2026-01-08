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
            let errorMessage = `API Error: ${response.status}`;

            try {
                // Try to parse the error as JSON first
                const errorJson = JSON.parse(text);
                // Sim.ai often returns the detailed error in an "ERROR" field or just the raw text
                const rawError = errorJson.ERROR || JSON.stringify(errorJson);

                if (rawError.includes("FAILED TO REFRESH ACCESS TOKEN")) {
                    errorMessage = "Authentication Failed: X (Twitter) connection expired. Please reconnect in Sim.ai dashboard.";
                } else if (rawError.includes("TOO MANY REQUESTS")) {
                    errorMessage = "Rate Limited: X API limits reached. Please wait 15-30 minutes and try again.";
                } else {
                    errorMessage = `Sim.ai Error: ${rawError}`;
                }
            } catch (e) {
                // If it's not JSON, use the raw text (truncated if too long)
                errorMessage = `API Error: ${response.status} - ${text.substring(0, 200)}`;
            }

            return { error: errorMessage };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Sim.ai API Error:", error);
        return { error: "Failed to connect to Sim.ai API" };
    }
}
