import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Solar Physics Lab | Interactive 3D Simulation",
    description: "Explore solar mechanics, manipulate orbital parameters, and optimize solar panel efficiency in this interactive 3D physics laboratory.",
    openGraph: {
        title: "Solar Physics Lab | Interactive 3D Simulation",
        description: "Real-time solar angle visualization and panel optimization experiment.",
        type: "website",
    },
};

export default function SolarLabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
