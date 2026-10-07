import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import WriterPortfolioView from "@/components/writer/writer-portfolio-view";

export const metadata: Metadata = {
  title: "Selected Writing & Research | Vaibhav",
  description:
    "Research-driven content about technology, AI, business, internet culture, and systems. In-depth essays and investigations that make complex subjects clear.",
  keywords: [
    "Content Writer",
    "Technical Writer",
    "Technology Essayist",
    "AI Researcher",
    "Thought Leadership",
    "Research-Driven Writing",
    "Long-Form Content",
    "Systems Analysis",
  ],
  alternates: {
    canonical: "https://vaibhav-14ry.vercel.app/blog",
  },
  openGraph: {
    title: "Selected Writing & Research | Vaibhav",
    description:
      "Research-driven content about technology, AI, business, internet culture, and the ideas shaping the digital world.",
    type: "website",
    url: "https://vaibhav-14ry.vercel.app/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Writing & Research | Vaibhav",
    description:
      "Research-driven content about technology, AI, business, internet culture, and the ideas shaping the digital world.",
  },
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://vaibhav-14ry.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Writing & Research",
      item: "https://vaibhav-14ry.vercel.app/blog",
    },
  ],
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <WriterPortfolioView posts={posts} />
    </>
  );
}
