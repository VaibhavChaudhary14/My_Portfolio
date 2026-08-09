import type { Metadata } from "next";
import { Patrick_Hand, Comic_Neue, Outfit, Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./global.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientThemeWrapper from "@/components/client-theme-wrapper";
import { BackButton } from "@/components/back-button";
import { ChatWidget } from "@/components/chat-widget";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const newsreader = Newsreader({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
  description: "AI / Machine Learning Engineer specializing in Computer Vision, cyber-physical AI systems, and applied machine learning. Building end-to-end ML pipelines to solve real-world infrastructure and security problems.",
  keywords: ["AI Engineer", "ML Engineer", "Computer Vision", "Cyber-Physical AI", "Smart Grids", "PyTorch", "TensorFlow", "CNNs", "Vision Transformers"],
  authors: [{ name: "Vaibhav Chaudhary" }],
  metadataBase: new URL('https://vaibhav-14ry.vercel.app/'),
  openGraph: {
    title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
    description: "Specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Chaudhary | AI / Machine Learning Engineer",
    description: "Specializing in Computer Vision, cyber-physical AI systems, and applied machine learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${patrickHand.variable} ${comicNeue.variable} ${outfit.variable} ${newsreader.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans bg-[#fbfbfb] text-zinc-900 dark:bg-venom-black dark:text-venom-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientThemeWrapper>
            <ChatWidget />
            <BackButton />
            <SpeedInsights />
            <Analytics />
            {children}
          </ClientThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
