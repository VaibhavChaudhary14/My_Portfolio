import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = 'edge';

// Lazy initialization to prevent crash if env vars are missing
let redis: Redis | null = null;
try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        redis = Redis.fromEnv();
    }
} catch (e) {
    console.error("Redis initialization failed:", e);
}

export async function GET(req: Request) {
    try {
        if (!redis) {
            console.warn("Redis not configured. Returning mock visitor count.");
            return NextResponse.json({ count: 1234 }); // Mock count for dev
        }

        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const encoder = new TextEncoder();
        const data = encoder.encode(ip);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const ipHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        await redis.sadd("visitor_hashes", ipHash);
        const count = await redis.scard("visitor_hashes");

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to increment visitor count:", error);
        // Fallback to a safe response instead of 500
        return NextResponse.json({ count: 0, error: "Redis connection error" }, { status: 200 });
    }
}
