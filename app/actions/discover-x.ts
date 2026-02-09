'use server';

import { XDiscoveryEngine } from '@/lib/xos/intelligence/x-discovery';
import { SupabaseStore } from '@/lib/xos/data-engine/supabase-store';

/**
 * Discover relevant posts on X matching your niche
 */
export async function discoverXPosts(limit: number = 20) {
    try {
        const engine = new XDiscoveryEngine();
        const posts = await engine.discoverPosts(limit);

        return {
            success: true,
            data: posts,
            message: `Discovered ${posts.length} relevant posts`
        };
    } catch (error: any) {
        console.error('Discovery error:', error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Generate a reply for a discovered post
 */
export async function generateReplyForPost(postId: string) {
    try {
        const engine = new XDiscoveryEngine();
        const store = SupabaseStore.getInstance();

        // Get the post
        const posts = await engine.getDiscoveredPosts();
        const post = posts.find(p => p.id === postId);

        if (!post) {
            return {
                success: false,
                error: 'Post not found'
            };
        }

        // Generate reply
        const { reply, confidence } = await engine.generateReply(post);

        // Save to database
        await engine.saveGeneratedReply(postId, reply, confidence);

        await store.addLog({
            component: 'DISCOVERY',
            level: 'SUCCESS',
            message: `✅ Generated reply for @${post.author_handle}`
        });

        return {
            success: true,
            data: { reply, confidence }
        };
    } catch (error: any) {
        console.error('Reply generation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Get all discovered posts from database
 */
export async function getDiscoveredPosts(status?: string) {
    try {
        const engine = new XDiscoveryEngine();
        const posts = await engine.getDiscoveredPosts(status);

        return {
            success: true,
            data: posts
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
}

/**
 * Post a reply to a discovered post on X
 */
export async function postReplyToX(postId: string, replyText: string, originalTweetId: string) {
    try {
        const { postToX } = await import('./post-to-x');
        const store = SupabaseStore.getInstance();

        // Post the reply
        const result = await postToX(replyText, originalTweetId);

        if (result.success) {
            // Update discovered_posts status
            const supabase = store.supabase;
            await supabase
                .from('discovered_posts')
                .update({
                    status: 'replied',
                    replied_at: new Date().toISOString(),
                    reply_tweet_id: result.data.id
                })
                .eq('id', postId);

            // Log to posted_tweets
            await supabase.from('posted_tweets').insert({
                tweet_id: result.data.id,
                content: replyText,
                type: 'reply',
                parent_post_id: postId
            });

            await store.addLog({
                component: 'DISCOVERY',
                level: 'SUCCESS',
                message: `✅ Posted reply to tweet`
            });
        }

        return result;
    } catch (error: any) {
        console.error('Post reply error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Dismiss a discovered post (mark as ignored)
 */
export async function dismissDiscoveredPost(postId: string) {
    try {
        const store = SupabaseStore.getInstance();
        const supabase = store.supabase;

        await supabase
            .from('discovered_posts')
            .update({ status: 'ignored' })
            .eq('id', postId);

        return { success: true };
    } catch (error: any) {
        return {
            success: false,
            error: error.message
        };
    }
}
