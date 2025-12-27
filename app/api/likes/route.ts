import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "likes.json");

function getLikesData() {
    if (!fs.existsSync(DB_PATH)) return { likes: {} };
    const file = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(file);
}

function saveLikesData(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

    const db = getLikesData();
    const count = db.likes[slug] || 0;

    return NextResponse.json({ count });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { slug } = body;

    if (!slug) return NextResponse.json({ error: "Slug required" }, { status: 400 });

    const db = getLikesData();
    db.likes[slug] = (db.likes[slug] || 0) + 1;
    saveLikesData(db);

    return NextResponse.json({ count: db.likes[slug] });
}
