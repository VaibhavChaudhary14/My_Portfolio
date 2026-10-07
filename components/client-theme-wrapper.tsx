"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import FlightLoader from "@/components/loader/flight-loader";

export default function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();
  const { setTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (theme === 'venom') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    // Check if flight loader has played in current session
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('flight_loader_seen');
      if (hasVisited === 'true') {
        setLoading(false);
      }
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('flight_loader_seen', 'true');
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <FlightLoader onComplete={handleComplete} />}
      {children}
    </>
  );
}
