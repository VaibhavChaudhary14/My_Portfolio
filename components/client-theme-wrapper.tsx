"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const FlightLoader = dynamic(() => import("@/components/loader/flight-loader"), {
  ssr: false,
});

export default function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { setTheme } = useTheme();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (theme === 'venom') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headlesschromium|lr/i.test(navigator.userAgent);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hasVisited = sessionStorage.getItem('flight_loader_seen');

      if (hasVisited !== 'true' && !isBot && !prefersReducedMotion) {
        setShowLoader(true);
      }
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('flight_loader_seen', 'true');
    }
    setShowLoader(false);
  };

  return (
    <>
      {showLoader && <FlightLoader onComplete={handleComplete} />}
      {children}
    </>
  );
}
