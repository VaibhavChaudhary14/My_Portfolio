"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function XAgentDemo() {
    const router = useRouter();

    useEffect(() => {
        // Automatically redirect to the new XOS Mission Control
        const timer = setTimeout(() => {
            router.push('/xos');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-green-500 font-mono">
            <Loader2 className="animate-spin mb-4" size={48} />
            <h1 className="text-2xl font-bold uppercase tracking-widest">System Upgraded</h1>
            <p className="mt-2 opacity-70">Redirecting to XOS Mission Control v3.0...</p>
        </div>
    );
}
