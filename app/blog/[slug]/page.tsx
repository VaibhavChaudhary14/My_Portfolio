import { Metadata } from "next";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, Mail } from "lucide-react";
import ShareButtons from "@/components/share-buttons";
import { Callout } from "@/components/mdx/Callout";
import { SortableTable } from "@/components/mdx/SortableTable";
import { Citation } from "@/components/mdx/Citation";
import { LighthouseScore } from "@/components/mdx/LighthouseScore";
import { LighthouseEmbed } from "@/components/mdx/LighthouseEmbed";
import { ScrollProgress } from "@/components/scroll-progress";
import { LikeButton } from "@/components/like-button";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Mermaid } from "@/components/mdx/Mermaid";
import { HFEmbed } from "@/components/mdx/HFEmbed";
import { Divider } from "@/components/mdx/Divider";
import { RageLoop } from "@/components/mdx/RageLoop";
import { SectionBanner } from "@/components/mdx/SectionBanner";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getPostBySlug(slug);

  const title = meta.seoTitle || `${meta.title} — Vaibhav`;
  const description = meta.metaDescription || meta.excerpt || meta.subtitle || "Research-driven writing by Vaibhav.";

  return {
    title,
    description,
    authors: [{ name: meta.author || "Vaibhav" }],
    keywords: meta.topics || ["Content Writing", "Technology", "Research"],
    alternates: {
      canonical: `https://vaibhav-14ry.vercel.app/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: meta.date,
      authors: [meta.author || "Vaibhav"],
      url: `https://vaibhav-14ry.vercel.app/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const { meta, content: rawContent } = getPostBySlug(slug);
  const allPosts = getAllPosts();
  const nextPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const { content } = await compileMDX<{ title: string }>({
    source: rawContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
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
      RageLoop,
      SectionBanner,
    },
  });

  const words = rawContent.split(/\s+/g).length;
  const minutes = meta.readTime || `${Math.ceil(words / 200)} min read`;

  // JSON-LD structured data for the article with E-E-A-T citation support
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.metaDescription || meta.excerpt,
    datePublished: meta.date,
    dateModified: meta.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://vaibhav-14ry.vercel.app/blog/${slug}`,
    },
    author: {
      "@type": "Person",
      name: meta.author || "Vaibhav",
      url: "https://vaibhav-14ry.vercel.app/blog",
    },
    publisher: {
      "@type": "Person",
      name: "Vaibhav",
    },
    citation: [
      "https://doi.org/10.1509/jmr.10.0353",
      "https://doi.org/10.1177/1745691620917336",
      "https://doi.org/10.1126/sciadv.abe5641",
      "https://doi.org/10.1126/science.aap9559",
      "https://doi.org/10.1037/1089-2680.5.4.323"
    ]
  };

  return (
    <>
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#fbfbfb] dark:bg-venom-black text-zinc-900 dark:text-venom-white font-sans selection:bg-paper-yellow dark:selection:bg-venom-slime dark:selection:text-black transition-colors duration-300 relative">
        
        {/* Background Grid */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.04] dark:opacity-[0.1]"
          style={{ backgroundImage: 'url("/grid-pattern.svg")', backgroundSize: "40px 40px" }}
        />

        {/* Top Masthead Navigation */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-black/90 border-b-4 border-black dark:border-venom-slime">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black dark:border-venom-slime bg-paper-yellow dark:bg-zinc-900 text-black dark:text-white shadow-neobrutalism-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>← Back to Selected Writing</span>
            </Link>

            <div className="text-xs font-mono font-bold text-zinc-600 dark:text-gray-400 hidden sm:block">
              {meta.category || "Essay"}
            </div>

            <a
              href="/blog#contact"
              className="inline-flex items-center gap-1 text-xs font-mono font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black dark:border-venom-slime bg-black text-white dark:bg-venom-slime dark:text-black shadow-neobrutalism-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <span>Work With Me</span>
            </a>
          </div>
        </header>

        {/* Main Article Content */}
        <main className="py-12 sm:py-20 px-4 sm:px-8 relative z-10">
          <article className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 border-4 border-black dark:border-venom-slime p-6 sm:p-14 shadow-neobrutalism dark:shadow-[6px_6px_0px_0px_#84cc16] relative">
            
            {/* Header */}
            <header className="mb-12 pb-10 border-b-4 border-black dark:border-venom-slime space-y-6">
              
              {/* Research Metrics / Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                <span className="px-3 py-1 border-2 border-black dark:border-venom-slime bg-paper-yellow text-black shadow-neobrutalism-sm uppercase tracking-wider">
                  {meta.category || "Research & Essays"}
                </span>
                {meta.researchLevel && (
                  <span className="px-3 py-1 border-2 border-black dark:border-venom-slime bg-paper-blue text-black shadow-neobrutalism-sm">
                    {meta.researchLevel}
                  </span>
                )}
                {meta.sourcesCount && (
                  <span className="px-3 py-1 border-2 border-black dark:border-venom-slime bg-paper-pink text-black shadow-neobrutalism-sm">
                    {meta.sourcesCount} Sources Cited
                  </span>
                )}
                {meta.researchTime && (
                  <span className="px-3 py-1 border-2 border-black dark:border-venom-slime bg-emerald-200 text-black shadow-neobrutalism-sm">
                    {meta.researchTime} Research
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
                {meta.title}
              </h1>

              {/* Subtitle */}
              {meta.subtitle && (
                <p className="font-hand font-bold text-xl sm:text-2xl text-zinc-700 dark:text-gray-300 leading-relaxed">
                  {meta.subtitle}
                </p>
              )}

              {/* Publication Meta Line */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-bold text-zinc-600 dark:text-gray-400 pt-2 border-t-2 border-black/10 dark:border-white/10">
                <div>
                  Written by <span className="text-black dark:text-white font-black">{meta.author || "Vaibhav"}</span>
                </div>
                <div>•</div>
                <time dateTime={meta.date}>{meta.date}</time>
                <div>•</div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{minutes}</span>
                </div>
              </div>

            </header>

            {/* Article Body */}
            <div className="prose prose-zinc dark:prose-invert max-w-none
              prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-white
              prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-14 prose-h1:mb-8
              prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b-4 prose-h2:border-black dark:prose-h2:border-venom-slime
              prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-14 prose-h3:mb-6 prose-h3:text-black dark:prose-h3:text-white
              prose-p:text-zinc-800 dark:prose-p:text-gray-200 prose-p:text-base sm:prose-p:lg prose-p:leading-[2] prose-p:mb-8
              prose-strong:font-black prose-strong:text-zinc-900 dark:prose-strong:text-white
              prose-a:text-purple-700 dark:prose-a:text-venom-slime prose-a:font-bold prose-a:underline hover:prose-a:bg-paper-yellow dark:hover:prose-a:text-black transition-colors
              prose-blockquote:border-l-4 prose-blockquote:border-black dark:prose-blockquote:border-venom-slime prose-blockquote:bg-paper-yellow/30 dark:prose-blockquote:bg-zinc-800/60 prose-blockquote:p-6 prose-blockquote:my-10 prose-blockquote:font-hand prose-blockquote:text-xl prose-blockquote:font-bold prose-blockquote:rounded-r-lg
              prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-zinc-800 prose-code:text-purple-700 dark:prose-code:text-venom-slime prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-black/10 dark:prose-code:border-white/10
              prose-pre:bg-zinc-900 dark:prose-pre:bg-black prose-pre:border-2 prose-pre:border-black dark:prose-pre:border-venom-slime prose-pre:p-4 prose-pre:shadow-neobrutalism-sm
              prose-img:border-2 prose-img:border-black dark:prose-img:border-venom-slime prose-img:shadow-neobrutalism
              prose-table:w-full prose-table:text-left prose-table:border-collapse prose-table:my-10 prose-table:border-2 prose-table:border-black dark:prose-table:border-venom-slime
              prose-th:border-2 prose-th:border-black dark:prose-th:border-venom-slime prose-th:bg-paper-yellow dark:prose-th:bg-zinc-800 prose-th:p-3 prose-th:font-black prose-th:text-sm
              prose-td:border-2 prose-td:border-black dark:prose-td:border-venom-slime prose-td:p-3 prose-td:text-sm
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-6 prose-ul:my-8
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-6 prose-ol:my-8
              prose-li:text-zinc-800 dark:prose-li:text-gray-200 prose-li:leading-[1.9] prose-li:pl-2
            ">
              {content}
            </div>

            {/* Bottom Engagement Bar */}
            <div className="mt-16 pt-10 border-t-4 border-black dark:border-venom-slime space-y-10">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 border-4 border-black dark:border-venom-slime shadow-neobrutalism bg-paper-blue/20 dark:bg-zinc-800">
                <div className="flex items-center gap-3">
                  <LikeButton />
                  <span className="font-hand font-bold text-lg text-zinc-700 dark:text-gray-300">
                    Appreciated this research piece? Give it love!
                  </span>
                </div>
                <ShareButtons title={meta.title} slug={slug} />
              </div>

              {/* Author Bio Box */}
              <div className="p-8 border-4 border-black dark:border-venom-slime shadow-neobrutalism bg-paper-yellow dark:bg-zinc-900 text-black dark:text-white space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-black uppercase tracking-widest block text-purple-700 dark:text-venom-slime">
                    About The Author
                  </span>
                  <h3 className="text-3xl font-black">
                    Vaibhav
                  </h3>
                  <p className="text-sm font-mono font-bold text-zinc-700 dark:text-gray-400">
                    Content Writer · Researcher · Storyteller
                  </p>
                </div>

                <p className="text-base font-medium leading-relaxed">
                  I research deeply, think critically, and turn complicated ideas in technology, AI, business, and internet culture into writing people actually want to read.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:14vaibhav2002@gmail.com?subject=Writing%20Collaboration%20Inquiry"
                    className="inline-flex items-center gap-2 px-5 py-3 border-2 border-black dark:border-venom-slime bg-black text-white dark:bg-venom-slime dark:text-black font-mono font-black text-xs uppercase tracking-wider shadow-neobrutalism-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Commission An Article</span>
                  </a>
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold underline hover:text-purple-700 dark:hover:text-venom-slime"
                  >
                    <span>View More Writing →</span>
                  </Link>
                </div>
              </div>

              {/* Read Next Section */}
              {nextPosts.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h4 className="font-mono font-black text-lg uppercase tracking-wider">
                    Read Next
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {nextPosts.map((np) => (
                      <Link
                        key={np.slug}
                        href={`/blog/${np.slug}`}
                        className="p-6 border-4 border-black dark:border-venom-slime shadow-neobrutalism hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group bg-white dark:bg-zinc-800 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="px-2 py-0.5 border border-black dark:border-venom-slime text-[11px] font-mono font-bold bg-paper-yellow text-black uppercase">
                            {np.meta.category || "Essay"}
                          </span>
                          <h5 className="font-black text-xl leading-snug group-hover:underline">
                            {np.meta.title}
                          </h5>
                          <p className="text-xs font-medium text-zinc-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                            {np.meta.excerpt}
                          </p>
                        </div>
                        <div className="pt-4 flex items-center font-mono font-black text-xs uppercase tracking-wider">
                          <span>Read</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </article>
        </main>

        {/* Minimal Footer */}
        <footer className="py-12 px-6 border-t-4 border-black dark:border-venom-slime bg-white dark:bg-black text-center text-xs font-mono font-bold">
          <Link href="/blog" className="hover:underline">
            Vaibhav — Words That Make Complex Things Clear.
          </Link>
        </footer>

      </div>
    </>
  );
}
