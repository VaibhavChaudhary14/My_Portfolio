import { Info, CheckCircle, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { ReactNode } from "react";


type CalloutProps = {
    type?: "info" | "success" | "warning" | "danger" | "tip";
    color?: "blue" | "green" | "yellow" | "amber" | "red" | "purple" | "indigo";
    title?: string;
    children: ReactNode;
};

const styles = {
    info: {
        container: "border-blue-400 bg-blue-50 text-blue-900",
        icon: <Info className="w-5 h-5 text-blue-500 mt-0.5" />,
    },
    success: {
        container: "border-green-400 bg-green-50 text-green-900",
        icon: <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />,
    },
    warning: {
        container: "border-amber-400 bg-amber-50 text-amber-900",
        icon: <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />,
    },
    danger: {
        container: "border-red-400 bg-red-50 text-red-900",
        icon: <XCircle className="w-5 h-5 text-red-500 mt-0.5" />,
    },
    tip: {
        container: "border-purple-400 bg-purple-50 text-purple-900",
        icon: <Lightbulb className="w-5 h-5 text-purple-500 mt-0.5" />,
    },
    indigo: {
        container: "border-indigo-400 bg-indigo-50 text-indigo-900",
        icon: <Info className="w-5 h-5 text-indigo-500 mt-0.5" />,
    }
};

export function Callout({ type = "info", color, title, children }: CalloutProps) {
    // Map colors to types or use direct style if matched
    let styleKey: keyof typeof styles = type as keyof typeof styles;
    if (color) {
        if (color === "blue") styleKey = "info";
        else if (color === "green") styleKey = "success";
        else if (color === "yellow" || color === "amber") styleKey = "warning";
        else if (color === "red") styleKey = "danger";
        else if (color === "purple") styleKey = "tip";
        else if (color === "indigo") styleKey = "indigo"; // We added indigo support
    }

    // Fallback if styleKey doesn't exist (though typescript ensures it does mostly)
    const style = styles[styleKey as keyof typeof styles] || styles.info;
    const { container, icon } = style;

    return (
        <div className={`my-8 rounded-r-lg border-l-4 p-5 flex gap-4 ${container} shadow-sm`}>
            <div className="shrink-0">{icon}</div>
            <div>
                {title && <h4 className="mb-2 font-bold text-lg">{title}</h4>}
                <div className="text-base leading-relaxed opacity-90">{children}</div>
            </div>
        </div>
    );
}
