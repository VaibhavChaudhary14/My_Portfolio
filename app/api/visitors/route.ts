import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = 'edge';

const redis = Redis.fromEnv();

export async function GET() {
    try {
        const count = await redis.incr("visitor_count");
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to increment visitor count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
