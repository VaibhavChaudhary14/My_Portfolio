import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = 'edge';

export async function GET() {
    try {
        const count = await kv.incr("visitor_count");
        return NextResponse.json({ count });
    } catch (error) {
        console.error("Failed to increment visitor count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
