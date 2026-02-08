"use server";

import { TwitterApi } from 'twitter-api-v2';

interface PostResult {
    success: boolean;
    data?: any;
    error?: string;
    mode: 'REAL' | 'SIMULATION';
}

export async function postToX(content: string): Promise<PostResult> {
    const {
        TWITTER_API_KEY,
        TWITTER_API_SECRET,
        TWITTER_ACCESS_TOKEN,
        TWITTER_ACCESS_SECRET
    } = process.env;

    // Check if credentials exist for REAL mode
    if (TWITTER_API_KEY && TWITTER_API_SECRET && TWITTER_ACCESS_TOKEN && TWITTER_ACCESS_SECRET) {
        try {
            console.log("Found Twitter Credentials. Attempting REAL post...");
            const client = new TwitterApi({
                appKey: TWITTER_API_KEY,
                appSecret: TWITTER_API_SECRET,
                accessToken: TWITTER_ACCESS_TOKEN,
                accessSecret: TWITTER_ACCESS_SECRET,
            });

            const rwClient = client.readWrite;
            const response = await rwClient.v2.tweet(content);

            return { success: true, data: response, mode: 'REAL' };

        } catch (error: any) {
            console.error("Twitter API Error:", error);
            return { success: false, error: error.message, mode: 'REAL' };
        }
    } else {
        // Fallback to SIMULATION mode so buttons work visibly
        console.warn("No Twitter Credentials found. Using SIMULATION mode.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Sim delay

        return {
            success: true,
            data: { id: "sim-" + Math.random().toString(36).substring(7), text: content },
            mode: 'SIMULATION'
        };
    }
}
