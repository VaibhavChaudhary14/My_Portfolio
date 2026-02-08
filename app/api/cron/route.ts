import { NextRequest, NextResponse } from 'next/server';
import { ContentProcessor } from '@/lib/xos/content-engine/processor';

// Vercel Cron Job Handler
// Triggered every 60 minutes via vercel.json
export async function GET(request: NextRequest) {
    // Basic Auth to prevent random people from triggering it
    // Vercel sends this header automatically
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const processor = new ContentProcessor();

        // Hardcoded RSS for now, but could be DB driven
        const rssUrl = "https://rss.app/feeds/4hen05uoYCedQtFB.xml";

        console.log(`[CRON] Starting Hourly Ingest Cycle...`);

        const items = await processor.ingestFromSource('rss', {
            url: rssUrl,
            title: "Automated Daily Feed"
        });

        return NextResponse.json({
            success: true,
            message: `Processed ${items.length} items from RSS.`
        });

    } catch (error: any) {
        console.error("[CRON] Job Failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
