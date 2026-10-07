import type { Metadata } from "next";
import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import TechArsenal from "@/components/tech-arsenal";
import ExperienceTimeline from "@/components/experience-timeline";
import MissionFiles from "@/components/mission-files";
import ResumeSection from "@/components/resume-section";
import Contact from "@/components/contact";

export const metadata: Metadata = {
  title: "Vaibhav Chaudhary | AI & Machine Learning Engineer",
  description:
    "AI / Machine Learning Engineer specializing in Computer Vision, cyber-physical AI systems, spatio-temporal GNNs, smart grid cybersecurity, and applied ML pipelines.",
  keywords: [
    "Vaibhav Chaudhary",
    "AI Engineer",
    "ML Engineer",
    "Computer Vision",
    "Cyber-Physical AI",
    "Smart Grid Security",
    "Spatio-Temporal GNN",
    "Voice AI",
    "PyTorch",
    "TensorFlow",
  ],
  authors: [{ name: "Vaibhav Chaudhary" }],
  alternates: {
    canonical: "https://vaibhav-14ry.vercel.app",
  },
  openGraph: {
    title: "Vaibhav Chaudhary | AI & Machine Learning Engineer",
    description:
      "AI / Machine Learning Engineer specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
    url: "https://vaibhav-14ry.vercel.app",
    type: "website",
    siteName: "Vaibhav Chaudhary Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Chaudhary | AI & Machine Learning Engineer",
    description:
      "Specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
    creator: "@Vaibhav_14ry",
  },
};

const jsonLdWebsite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Vaibhav Chaudhary Portfolio",
  url: "https://vaibhav-14ry.vercel.app",
  author: {
    "@type": "Person",
    name: "Vaibhav Chaudhary",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
      />
      <main className="relative min-h-screen font-sans selection:bg-purple-200 bg-[#fbfbfb] text-zinc-900 dark:bg-venom-black dark:text-venom-white transition-colors duration-300">
        <Navigation />

        <div className="w-full flex flex-col gap-0">
          <Hero />
          <TechArsenal />
          <ExperienceTimeline />
          <MissionFiles />
          <ResumeSection />
          <Contact />
        </div>

        {/* Footer */}
        <footer className="py-8 text-center border-t-2 transition-colors bg-white border-black dark:bg-venom-black dark:border-venom-slime">
          <p className="font-hand font-bold text-lg text-black dark:text-venom-slime">
            Designed with 💜 & ☕ by Vaibhav. © 2025
          </p>
        </footer>
      </main>
    </>
  );
}
