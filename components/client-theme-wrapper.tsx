"use client";

import { useThemeStore } from "@/store/useThemeStore";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ClientThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeStore();
    const { setTheme } = useTheme();

    useEffect(() => {
        if (theme === 'venom') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [theme, setTheme]);

    return <>{children}</>;
}
