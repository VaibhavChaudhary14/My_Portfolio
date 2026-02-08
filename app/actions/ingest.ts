"use server";

import { ContentProcessor } from "@/lib/xos/content-engine/processor";

export async function ingestSignal(source: 'rss') {
    console.log("[Server Action] Starting Ingest for:", source);

    // Hardcoded URL for now as per Mission Control logic
    const rawData = {
        title: "User RSS Feed",
        url: "https://rss.app/feeds/4hen05uoYCedQtFB.xml"
    };

    const processor = new ContentProcessor();
    await processor.ingestFromSource(source, rawData);

    return { success: true };
}
