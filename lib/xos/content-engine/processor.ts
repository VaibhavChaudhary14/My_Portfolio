import { SupabaseStore } from "../data-engine/supabase-store";
import { QueueItem } from "../types";
import { LLMClient } from "../intelligence/llm-client";
import { ReasoningEngine } from "../intelligence/reasoning";

export class ContentProcessor {
    private store: SupabaseStore;
    private llm: LLMClient;

    constructor() {
        this.store = SupabaseStore.getInstance();
        this.llm = new LLMClient();
    }

    /**
     * Ingests content from a source (e.g. RSS Feed)
     * Now supports real RSS fetching via Server Action.
     */
    async ingestFromSource(source: 'blog' | 'youtube' | 'rss', rawData: any) {
        await this.store.addLog({
            component: 'CONTENT',
            level: 'INFO',
            message: `Ingesting from ${source}...`
        });

        let itemsToProcess = [];

        if (source === 'rss' && rawData.url) {
            // Import dynamically to avoid server-only module issues if this file is bundled largely on client
            const { fetchRSSFeed } = await import("@/app/actions/fetch-rss");
            const feedItems = await fetchRSSFeed(rawData.url);
            itemsToProcess = feedItems;
        } else {
            // Fallback / Simulation for other types or missing URL
            itemsToProcess = [rawData];
        }

        // Initialize Reasoning Engine (Brain 2)
        const reasoningEngine = new ReasoningEngine();

        for (const item of itemsToProcess) {

            // 2. Autonomous Reasoning Loop
            const decision = await reasoningEngine.evaluateSignal({
                source: source as any, // Cast to match stricter type 'rss' | 'manual'
                content: item.contentSnippet || item.title || JSON.stringify(item),
                metadata: {
                    title: item.title,
                    link: item.link
                }
            });

            // 3. Act on Decision
            if (decision.intent.action === 'ignore') {
                await this.store.addLog({
                    module: 'INTEL',
                    level: 'INFO',
                    message: `[Ignored] Conf: ${(decision.intent.confidence * 100).toFixed(0)}%. Reason: ${decision.intent.rationale.substring(0, 40)}...`
                });
                continue;
            }

            // New Thresholds: < 0.60 Ignore, 0.60-0.75 Draft, > 0.75 Auto-Post (Simulated)
            if (decision.intent.confidence < 0.60) {
                await this.store.addLog({
                    module: 'INTEL',
                    level: 'WARN',
                    message: `[Low Confidence] ${(decision.intent.confidence * 100).toFixed(0)}% is below 60% threshold.`
                });
                continue;
            }

            // 4. Add to Queue if Accepted
            if (decision.draft) {
                // Omit 'id' and 'created_at' as Supabase handles them
                const queueItem: Omit<QueueItem, "id" | "created_at"> = {
                    source,
                    title: item.title || "Untitled",
                    generated_tweet: decision.draft.text,
                    status: 'queued',
                    // scheduled_for: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
                    // New Agent Metadata
                    confidence: decision.intent.confidence,
                    risk_level: decision.intent.riskLevel as 'low' | 'medium' | 'high',
                    rationale: decision.intent.rationale
                };

                await this.store.addToQueue(queueItem);

                await this.store.addLog({
                    component: 'CONTENT',
                    level: 'SUCCESS',
                    message: `[Queued] ${decision.draft.format.toUpperCase()} (Conf: ${(decision.intent.confidence * 100).toFixed(0)}%)`
                });
            }
        }

        return itemsToProcess;
    }
}
