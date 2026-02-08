import { NextResponse } from 'next/server';
import { XDiscoveryEngine } from '@/lib/xos/intelligence/x-discovery';
import { SupabaseStore } from '@/lib/xos/data-engine/supabase-store';

/**
 * Automated X Discovery Cron Job
 * Runs every 2.5 hours (9000 seconds) until 1 AM IST
 * 
 * Schedule: 7:00 AM, 9:30 AM, 12:00 PM, 2:30 PM, 5:00 PM, 7:30 PM, 10:00 PM, 12:30 AM
 * 
 * Optimized for X API Free Tier:
 * -1,500 reads/month = ~50 reads/day
 * - 8 runs/day × 10 posts = 80 reads/day (within limit with buffer)
 * - 50 posts/month = ~1.6 posts/day (need to be selective!)
 */
export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const store = SupabaseStore.getInstance();

    try {
        // Check current time (IST = UTC+5:30)
        const now = new Date();
        const istHour = now.getUTCHours() + 5;
        const istMinutes = now.getUTCMinutes() + 30;
        const adjustedHour = istHour + Math.floor(istMinutes / 60);
        const finalHour = adjustedHour % 24;

        // Don't run between 1 AM and 7 AM IST
        if (finalHour >= 1 && finalHour < 7) {
            await store.addLog({
                component: 'CRON',
                level: 'INFO',
                message: '⏸️ Discovery skipped (1 AM - 7 AM quiet hours)'
            });

            return NextResponse.json({
                success: true,
                message: 'Skipped during quiet hours',
                time: `${finalHour}:${now.getMinutes()}`
            });
        }

        await store.addLog({
            component: 'CRON',
            level: 'INFO',
            message: '🔍 Starting automated X discovery...'
        });

        const engine = new XDiscoveryEngine();

        // Conservative discovery: only 10 posts to stay within free tier limits
        const discoveredPosts = await engine.discoverPosts(10);

        // Auto-generate replies for high-relevance posts (>0.75)
        let repliesGenerated = 0;
        for (const post of discoveredPosts) {
            if (post.relevance_score > 0.75) {
                const { reply, confidence } = await engine.generateReply(post);

                // Only queue high-confidence replies (>0.7)
                if (confidence > 0.7) {
                    await engine.saveGeneratedReply(post.id, reply, confidence);
                    repliesGenerated++;
                }
            }
        }

        await store.addLog({
            component: 'CRON',
            level: 'SUCCESS',
            message: `✅ Discovery complete: ${discoveredPosts.length} posts found, ${repliesGenerated} replies queued for approval`
        });

        return NextResponse.json({
            success: true,
            discovered: discoveredPosts.length,
            queued: repliesGenerated,
            time: new Date().toISOString()
        });

    } catch (error: any) {
        await store.addLog({
            component: 'CRON',
            level: 'ERROR',
            message: `❌ Discovery failed: ${error.message}`
        });

        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
