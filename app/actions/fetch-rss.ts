"use server";

export async function fetchRSSFeed(url: string) {
    try {
        console.log(`[RSS] Fetching ${url}...`);
        const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });

        if (!response.ok) {
            throw new Error(`Failed to fetch RSS: ${response.statusText}`);
        }

        const xmlText = await response.text();

        // Native Regex Parser (Dependency-Free)
        // Matches <item>...</item> blocks and extracts title/link
        const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
        const linkRegex = /<link>(.*?)<\/link>/;

        const matches = xmlText.match(itemRegex);

        if (matches) {
            for (const itemBlock of matches.slice(0, 5)) {
                try {
                    const titleMatch = itemBlock.match(titleRegex);
                    const linkMatch = itemBlock.match(linkRegex);

                    if (titleMatch && linkMatch) {
                        items.push({
                            title: titleMatch[1].trim(),
                            link: linkMatch[1].trim(),
                            contentSnippet: "RSS Content", // Simplified
                            pubDate: new Date().toISOString()
                        });
                    }
                } catch (err) {
                    console.warn("Skipping malformed RSS item");
                }
            }
        }

        return items;

    } catch (error: any) {
        console.error("RSS Fetch Error:", error);
        // Return empty array instead of throwing to prevent UI crash
        return [];
    }
}
