import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import Image from "next/image";
import ShareButtons from "@/components/share-buttons";
import { Callout } from "@/components/mdx/Callout";
import { SortableTable } from "@/components/mdx/SortableTable";
import { Citation } from "@/components/mdx/Citation";
import { LighthouseScore } from "@/components/mdx/LighthouseScore";
import { LighthouseEmbed } from "@/components/mdx/LighthouseEmbed";
import { ScrollProgress } from "@/components/scroll-progress";
import { LikeButton } from "@/components/like-button";
import { NewsletterForm } from "@/components/newsletter-form";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Mermaid } from "@/components/mdx/Mermaid";
import { HFEmbed } from "@/components/mdx/HFEmbed";

import { Divider } from "@/components/mdx/Divider";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const { meta, content: rawContent } = getPostBySlug(slug);

    const { content } = await compileMDX<{ title: string }>({
        source: rawContent,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
            }
        },
        components: {
            Callout,
            Divider,
            SortableTable,
            LighthouseScore,
            Citation,
            LighthouseEmbed,
            Mermaid,
            HFEmbed,
        }
    });

    // Simple reading time calculation
    const words = rawContent.split(/\s+/g).length;
    const minutes = Math.ceil(words / 200);

    return (
        <>
            <ScrollProgress />
            <article className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 font-sans selection:bg-paper-yellow dark:bg-venom-black dark:text-venom-white dark:selection:bg-venom-slime dark:selection:text-black">
                <Link href="/blog" className="inline-flex items-center font-hand text-xl hover:text-primary dark:hover:text-venom-slime transition-colors mb-12 group">
                    <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Stash
                </Link>

                <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime p-8 sm:p-16 shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] relative">
                    {/* Header */}
                    <header className="mb-14 text-center border-b-2 border-dashed border-black/10 dark:border-white/10 pb-12">
                        <span className="inline-block bg-primary/10 dark:bg-venom-slime/10 text-primary dark:text-venom-slime px-3 py-1 rounded-full text-sm font-bold font-mono mb-6 tracking-wide uppercase">
                            Article
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight text-zinc-900 dark:text-white">
                            {meta.title}
                        </h1>
                        <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-bold font-mono text-neutral-500 dark:text-gray-400 uppercase tracking-wider">
                            <time dateTime={meta.date}>{meta.date}</time>
                            <span className="hidden sm:inline">•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {minutes} min read
                            </span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white
                    prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                    prose-p:text-zinc-700 dark:prose-p:text-gray-300 prose-p:leading-8 prose-p:mb-6
                    prose-strong:font-black prose-strong:text-zinc-900 dark:prose-strong:text-white
                    prose-a:text-primary dark:prose-a:text-venom-slime prose-a:no-underline prose-a:border-b-2 prose-a:border-primary/30 dark:prose-a:border-venom-slime/30 hover:prose-a:border-primary dark:hover:prose-a:border-venom-slime hover:prose-a:bg-primary/5 dark:hover:prose-a:bg-venom-slime/5 prose-a:transition-all
                    prose-blockquote:border-l-4 prose-blockquote:border-primary dark:prose-blockquote:border-venom-slime prose-blockquote:bg-secondary/50 dark:prose-blockquote:bg-zinc-800 prose-blockquote:p-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
                    prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:text-primary dark:prose-code:text-venom-slime prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-zinc-900 prose-pre:text-zinc-50 prose-pre:rounded-xl prose-pre:shadow-lg
                    prose-img:rounded-xl prose-img:border-2 prose-img:border-black/5 dark:prose-img:border-white/10 prose-img:shadow-lg prose-img:my-10
                    prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
                    prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
                    prose-li:text-zinc-700 dark:prose-li:text-gray-300
                    prose-table:border-collapse prose-table:w-full prose-table:my-8 prose-table:shadow-sm
                    prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-th:p-4 prose-th:text-left prose-th:font-black prose-th:border prose-th:border-zinc-200 dark:prose-th:border-zinc-700
                    prose-td:p-4 prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-700
                ">
                        {content}
                    </div>

                    {/* Engagement & Sharing */}
                    <div className="mt-20 pt-10 border-t-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center gap-12">
                        <div className="flex flex-col items-center gap-4">
                            <LikeButton />
                            <span className="font-hand text-neutral-500 dark:text-gray-400">Liked this? Give it some love!</span>
                        </div>

                        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y-2 border-dashed border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-4 font-hand text-neutral-500 dark:text-gray-400 text-lg">
                                <span>Thanks for reading!</span>
                                <span className="text-3xl text-primary dark:text-venom-slime transform rotate-6 inline-block">~ V</span>
                            </div>
                            <ShareButtons title={meta.title} slug={slug} />
                        </div>

                        {/* Newsletter */}
                        <div className="w-full max-w-2xl">
                            <NewsletterForm />
                        </div>
                    </div>
                </div>
            </article>
        </>
    );
}
