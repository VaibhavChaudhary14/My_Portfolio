"use client";

import {
    useEffect,
    useState,
    useRef
} from "react";
import { useThemeStore } from "@/store/useThemeStore";
import { Users } from "lucide-react";

export default function VisitorCounter() {
    const { theme } = useThemeStore();
    const [count, setCount] = useState<number | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchCount = async () => {
            try {
                const res = await fetch("/api/visitors");
                if (res.ok) {
                    const data = await res.json();
                    setCount(data.count);
                }
            } catch (error) {
                console.error("Failed to fetch visitor count", error);
            }
        };

        fetchCount();
    }, []);

    if (count === null) return null;

    return (
        <div className={`flex items-center gap-2 text-sm font-bold ml-4 px-3 py-1 rounded-full transition-colors border ${theme === 'venom'
            ? 'bg-venom-black border-venom-slime text-venom-slime'
            : 'bg-white border-purple-200 text-purple-600'
            }`}>
            <Users size={14} />
            <span className="hidden sm:inline">Visitors</span>
            <span>{count.toLocaleString()}</span>
        </div>
    );
}
