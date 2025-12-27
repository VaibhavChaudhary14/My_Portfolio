import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <main className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 relative overflow-hidden font-sans dark:bg-venom-black dark:text-venom-white">
            {/* Background Patterns */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.1]"
                style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: '40px 40px' }}
            />

            <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-7xl font-hand mb-4 transform -rotate-2 dark:text-white">
                    Knowledge <span className="text-primary dark:text-venom-slime">Stash</span>
                </h1>
                <p className="text-xl text-neutral-600 dark:text-gray-400 mb-16 max-w-2xl font-hand border-b-2 border-black/5 dark:border-white/10 pb-8 inline-block">
                    Thoughts, tutorials, and rants about the state of frontend.
                </p>

                <div className="grid gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                            <article className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime p-6 sm:p-8 shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] sm:group-hover:translate-x-1 sm:group-hover:translate-y-1 sm:group-hover:shadow-neobrutalism-sm dark:group-hover:shadow-none transition-all duration-300 relative overflow-hidden">
                                {/* Decorative Corner */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-paper-yellow dark:bg-venom-slime -rotate-45 translate-x-8 -translate-y-8 border-l-2 border-b-2 border-black opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                    <h2 className="text-3xl font-hand group-hover:text-primary dark:group-hover:text-venom-slime transition-colors">
                                        {post.meta.title}
                                    </h2>
                                    <span className="text-sm font-bold bg-black text-white dark:bg-venom-slime dark:text-black px-3 py-1 -rotate-1 mt-2 sm:mt-0">
                                        {post.meta.date}
                                    </span>
                                </div>
                                <p className="text-lg text-neutral-700 dark:text-gray-300 mb-6 font-sans leading-relaxed">
                                    {post.meta.excerpt}
                                </p>

                                <div className="flex items-center text-primary dark:text-venom-slime font-bold font-hand text-lg">
                                    Read Article
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
