"use client";

import { useSolarStore } from "@/store/useSolarStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

export default function CoordinatesDisplay() {
    const { latitude, longitude } = useSolarStore();
    const { theme } = useThemeStore();
    const isVenom = theme === 'venom';

    // Simplified Location State
    const [locationName, setLocationName] = useState("Calculating Location...");

    // Debounced Fetch
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await res.json();
                const city = data.locality || data.principalSubdivision;
                const country = data.countryName;

                if (city && country) setLocationName(`${city}, ${country}`);
                else if (country) setLocationName(country);
                else setLocationName("International Waters");
            } catch (e) {
                setLocationName("Offline Mode");
            }
        };
        const timer = setTimeout(fetchLocation, 1000);
        return () => clearTimeout(timer);
    }, [latitude, longitude]);

    const textColor = isVenom ? "text-venom-slime" : "text-amber-600";
    const bgClass = isVenom ? "bg-black/60 border-venom-slime/30" : "bg-white/60 border-zinc-200";

    return (
        <div className={`absolute top-24 right-4 z-40 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-lg transition-colors flex items-center gap-4 ${bgClass}`}>
            <div className="flex flex-col text-right">
                <span className={`text-xs font-bold uppercase tracking-wider opacity-60 ${isVenom ? "text-white" : "text-black"}`}>
                    Current Location
                </span>
                <span className={`text-sm font-bold truncate max-w-[200px] ${textColor}`}>
                    {locationName}
                </span>
                <div className="flex gap-3 justify-end mt-1 text-[10px] font-mono opacity-80">
                    <span>{Math.abs(latitude).toFixed(4)}° {latitude >= 0 ? 'N' : 'S'}</span>
                    <span>{Math.abs(longitude).toFixed(4)}° {longitude >= 0 ? 'E' : 'W'}</span>
                </div>
            </div>

            <div className={`p-2 rounded-full ${isVenom ? "bg-venom-slime/20 text-venom-slime" : "bg-amber-100 text-amber-600"}`}>
                <MapPin size={20} />
            </div>
        </div>
    );
}
