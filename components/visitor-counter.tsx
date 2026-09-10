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
        <div className={`flex items-center gap-2 text-base md:text-lg font-black ml-4 px-4 py-1.5 rounded-full transition-colors border-2 ${theme === 'venom'
            ? 'bg-venom-black border-venom-slime text-venom-slime shadow-[2px_2px_0px_0px_#84cc16]'
            : 'bg-white border-black text-purple-700 shadow-neobrutalism-sm'
            }`}>
            <Users size={18} />
            <span className="hidden sm:inline">Visitors</span>
            <span>{count.toLocaleString()}</span>
        </div>
    );
}
