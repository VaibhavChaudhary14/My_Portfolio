import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "visitors.json");

function getVisitorData() {
    if (!fs.existsSync(DB_PATH)) return { count: 0 };
    const file = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(file);
}

function saveVisitorData(data: { count: number }) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4));
}

export async function GET() {
    const db = getVisitorData();
    db.count += 1;
    saveVisitorData(db);

    return NextResponse.json({ count: db.count });
}
