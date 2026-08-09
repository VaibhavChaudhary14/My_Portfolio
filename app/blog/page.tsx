import { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import WriterPortfolioView from "@/components/writer/writer-portfolio-view";

export const metadata: Metadata = {
  title: "Vaibhav — Content Writer & Researcher",
  description:
    "Research-driven content about technology, AI, business, internet culture, and the ideas shaping the digital world. Words that make complex things clear.",
  keywords: [
    "Content Writer",
    "Technical Writer",
    "Technology Essayist",
    "AI Researcher",
    "Thought Leadership",
    "Research-Driven Writing",
    "Long-Form Content",
    "Content Strategy",
  ],
  openGraph: {
    title: "Vaibhav — Content Writer & Researcher",
    description:
      "Research-driven content about technology, AI, business, internet culture, and the ideas shaping the digital world.",
    type: "website",
    url: "https://vaibhav-14ry.vercel.app/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav — Content Writer & Researcher",
    description:
      "Research-driven content about technology, AI, business, internet culture, and the ideas shaping the digital world.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return <WriterPortfolioView posts={posts} />;
}
