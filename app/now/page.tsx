import type { Metadata } from "next";
import NowContent from "@/components/now-content";

export const metadata: Metadata = {
  title: "What I'm Doing Now | Vaibhav Chaudhary",
  description:
    "Live engineering status log inspired by Derek Sivers /now movement: GATE exam prep, SaaS development, and research paper breakdowns in Graph Neural Networks, Weather AI, and Smart Grids.",
  alternates: {
    canonical: "https://vaibhav-14ry.vercel.app/now",
  },
  openGraph: {
    title: "What I'm Doing Now | Vaibhav Chaudhary",
    description:
      "Active engineering status, GATE exam prep, SaaS development, and deep AI/ML research paper breakdowns.",
    url: "https://vaibhav-14ry.vercel.app/now",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "What I'm Doing Now | Vaibhav Chaudhary",
    description:
      "Active engineering status, GATE exam prep, SaaS development, and deep AI/ML research paper breakdowns.",
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
      name: "Now",
      item: "https://vaibhav-14ry.vercel.app/now",
    },
  ],
};

export default function NowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <NowContent />
    </>
  );
}
