import type { Metadata } from "next";
import { Patrick_Hand, Comic_Neue } from "next/font/google"; // Replacing fonts for Sketchbook vibe
import "./global.css";
// import IdentityWrapper from "@/components/identity-wrapper"; // Removing IdentityWrapper

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
});

const comicNeue = Comic_Neue({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-comic",
});

export const metadata: Metadata = {
  title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
  description: "AI / Machine Learning Engineer specializing in Computer Vision, cyber-physical AI systems, and applied machine learning. Building end-to-end ML pipelines to solve real-world infrastructure and security problems.",
  keywords: ["AI Engineer", "ML Engineer", "Computer Vision", "Cyber-Physical AI", "Smart Grids", "PyTorch", "TensorFlow", "CNNs", "Vision Transformers"],
  authors: [{ name: "Vaibhav Chaudhary" }],
  metadataBase: new URL('https://vaibhav-chaudhary-portfolio.vercel.app'), // Replace with actual domain when deployed
  openGraph: {
    title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
    description: "Specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
    type: "website",
    // Add your OpenGraph image URL here
    // images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
    description: "Specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
    // Add your Twitter image URL here
    // images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${patrickHand.variable} ${comicNeue.variable} font-sans bg-[#fbfbfb] text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
