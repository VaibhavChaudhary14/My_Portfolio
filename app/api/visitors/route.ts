import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = 'edge';

const redis = Redis.fromEnv();

export async function GET(req: Request) {
    try {
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
