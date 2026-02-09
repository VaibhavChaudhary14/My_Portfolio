import { TwitterApi } from 'twitter-api-v2';
import { LLMClient } from './llm-client';
import { SupabaseStore } from '../data-engine/supabase-store';

export interface DiscoveredPost {
    id: string;
    post_id: string;
    author_handle: string;
    author_name: string;
    content: string;
    url: string;
    relevance_score: number;
    engagement_count: number;
    discovered_at: Date;
    status: 'pending' | 'replied' | 'ignored' | 'queued';
    generated_reply?: string;
    reply_confidence?: number;
}

export class XDiscoveryEngine {
    private client: TwitterApi;
    private llm: LLMClient;
    private store: SupabaseStore;

    // Your niche keywords
    private readonly NICHE_KEYWORDS = [
        'smart grid',
        'power systems',
        'electrical engineering',
        'AI grid',
        'energy AI',
        'grid optimization',
        'renewable energy AI',
        'power grid ML'
    ];

    constructor() {
        const bearer = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;

        if (!bearer) {
            console.error('[XDiscovery] ⚠️ No X Bearer Token found. Discovery disabled.');
            this.client = null as any;
        } else {
            this.client = new TwitterApi(bearer);
        }

        this.llm = new LLMClient();
        this.store = SupabaseStore.getInstance();
    }

    /**
     * Discovers relevant posts from X based on niche keywords
     */
    async discoverPosts(limit: number = 20): Promise<DiscoveredPost[]> {
        if (!this.client) {
            await this.store.addLog({
                component: 'DISCOVERY',
                level: 'ERROR',
                message: 'X API not configured. Add X_BEARER_TOKEN to .env.local'
            });
            return [];
        }

        await this.store.addLog({
            component: 'DISCOVERY',
            level: 'INFO',
            message: `🔍 Starting discovery for niche posts...`
        });

        const discoveredPosts: DiscoveredPost[] = [];

        try {
            // Build search query (combine keywords with OR)
            const query = this.NICHE_KEYWORDS.map(k => `"${k}"`).join(' OR ');

            // Search recent tweets (last 7 days)
            const searchResults = await this.client.v2.search(query, {
                max_results: limit,
                'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
                'user.fields': ['username', 'name'],
                expansions: ['author_id'],
                sort_order: 'relevancy' // Most relevant first
            });

            if (!searchResults.data?.data) {
                await this.store.addLog({
                    component: 'DISCOVERY',
                    level: 'WARN',
                    message: 'No posts found matching search criteria'
                });
                return [];
            }

            // Process each found tweet
            for (const tweet of searchResults.data.data) {
                const author = searchResults.includes?.users?.find(u => u.id === tweet.author_id);

                if (!author) continue;

                const post = {
                    post_id: tweet.id,
                    author_handle: author.username,
                    author_name: author.name,
                    content: tweet.text,
                    url: `https://twitter.com/${author.username}/status/${tweet.id}`,
                    engagement_count: (tweet.public_metrics?.like_count || 0) +
                        (tweet.public_metrics?.retweet_count || 0) +
                        (tweet.public_metrics?.reply_count || 0),
                    discovered_at: new Date()
                };

                // Score relevance using LLM
                const relevanceScore = await this.scoreRelevance(post.content);

                // Only keep highly relevant posts (score > 0.6)
                if (relevanceScore > 0.6) {
                    const discovered: DiscoveredPost = {
                        id: '', // Will be set by DB
                        ...post,
                        relevance_score: relevanceScore,
                        status: 'pending'
                    };

                    discoveredPosts.push(discovered);

                    // Save to database
                    await this.saveDiscoveredPost(discovered);
                }
            }

            await this.store.addLog({
                component: 'DISCOVERY',
                level: 'SUCCESS',
                message: `✅ Discovered ${discoveredPosts.length} relevant posts`
            });

        } catch (error: any) {
            await this.store.addLog({
                component: 'DISCOVERY',
                level: 'ERROR',
                message: `Discovery failed: ${error.message}`
            });
        }

        return discoveredPosts;
    }

    /**
     * Score how relevant a post is to your niche (0-1)
     */
    private async scoreRelevance(content: string): Promise<number> {
        const systemPrompt = `You are a relevance scorer for an electrical engineering expert specializing in smart grids and AI in power systems.
        
Score how relevant this post is to topics:
- Smart grids & power systems
- AI/ML in energy
- Renewable energy tech
- Grid optimization
- Electrical engineering

Return ONLY a number between 0.0 (not relevant) and 1.0 (highly relevant).`;

        const userPrompt = `Post: "${content}"

Relevance score (0.0-1.0):`;

        try {
            const response = await this.llm.generateText(systemPrompt, userPrompt);
            const score = parseFloat(response.trim());
            return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
        } catch (error) {
            console.error('Relevance scoring failed:', error);
            return 0.5; // Default medium relevance
        }
    }

    /**
     * Generate a contextual reply for a discovered post
     */
    async generateReply(post: DiscoveredPost): Promise<{ reply: string; confidence: number }> {
        const systemPrompt = `You are Vaibhav, an electrical engineering student specializing in smart grids and AI in power systems.

Generate a thoughtful, authentic reply that:
1. Adds technical insight or expertise
2. Shows genuine interest and knowledge
3. Is conversational but professional
4. Is under 280 characters
5. Avoids generic "great post!" responses
6. Connects to your EE/AI expertise when relevant

Your background:
- Electrical Engineering student
- Focus on smart grids, power systems, AI in energy
- Building autonomous systems
- Interested in first-principles thinking

Style: Thoughtful, technical, curious, authentic.`;

        const userPrompt = `@${post.author_handle} posted:
"${post.content}"

Generate a reply:`;

        try {
            const reply = await this.llm.generateText(systemPrompt, userPrompt);

            // Calculate confidence based on reply quality indicators
            const confidence = this.assessReplyQuality(reply, post.content);

            return {
                reply: reply.trim().substring(0, 280), // Ensure under limit
                confidence
            };
        } catch (error) {
            await this.store.addLog({
                component: 'DISCOVERY',
                level: 'ERROR',
                message: `Reply generation failed: ${error}`
            });

            return {
                reply: '',
                confidence: 0
            };
        }
    }

    /**
     * Assess quality of generated reply (0-1)
     */
    private assessReplyQuality(reply: string, originalPost: string): number {
        let score = 0.7; // Base score

        // Positive indicators
        if (reply.length > 50) score += 0.1; // Substantial response
        if (reply.includes('?')) score += 0.05; // Asks questions
        if (/\b(grid|power|energy|AI|system)\b/i.test(reply)) score += 0.1; // Uses niche terms
        if (reply.length < 280) score += 0.05; // Fits in tweet

        // Negative indicators
        if (/^(great|amazing|awesome) (post|tweet)/i.test(reply)) score -= 0.3; // Generic
        if (reply.toLowerCase() === originalPost.toLowerCase()) score -= 0.5; // Just echoes
        if (reply.split(' ').length < 5) score -= 0.2; // Too short

        return Math.max(0, Math.min(1, score));
    }

    /**
     * Save discovered post to database
     */
    private async saveDiscoveredPost(post: DiscoveredPost): Promise<void> {
        const supabase = this.store.supabase; // Access private supabase client

        await supabase.from('discovered_posts').insert({
            post_id: post.post_id,
            author_handle: post.author_handle,
            author_name: post.author_name,
            content: post.content,
            url: post.url,
            relevance_score: post.relevance_score,
            engagement_count: post.engagement_count,
            status: 'pending'
        });
    }

    /**
     * Get discovered posts from database
     */
    async getDiscoveredPosts(status?: string): Promise<DiscoveredPost[]> {
        const supabase = this.store.supabase;

        let query = supabase
            .from('discovered_posts')
            .select('*')
            .order('relevance_score', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching discovered posts:', error);
            return [];
        }

        return data || [];
    }

    /**
     * Update discovered post with generated reply
     */
    async saveGeneratedReply(postId: string, reply: string, confidence: number): Promise<void> {
        const supabase = this.store.supabase;

        await supabase
            .from('discovered_posts')
            .update({
                generated_reply: reply,
                reply_confidence: confidence,
                status: 'queued'
            })
            .eq('id', postId);
    }
}
