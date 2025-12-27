"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";

type Column = {
    key: string;
    label: string;
};

type Props = {
    columns: string; // JSON string
    data: string; // JSON string
};

export function SortableTable({ columns: columnsJson, data: dataJson }: Props) {
    let columns: Column[] = [];
    let data: Record<string, string | number>[] = [];

    try {
        columns = JSON.parse(columnsJson);
        data = JSON.parse(dataJson);
    } catch (e) {
        console.error("Failed to parse SortableTable data", e);
        return <div className="p-4 border-2 border-red-500 bg-red-50 text-red-600 rounded-lg">Error loading table data</div>
    }
    const [sortKey, setSortKey] = useState(columns[0].key);
    const [ascending, setAscending] = useState(false);

    const sorted = [...data].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (typeof valA === "number" && typeof valB === "number") {
            return ascending ? valA - valB : valB - valA;
        }
        return ascending
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    const handleSort = (key: string) => {
        if (key === sortKey) setAscending(!ascending);
        else {
            setSortKey(key);
            setAscending(true);
        }
    };

    return (
        <div className="overflow-x-auto my-10 rounded-xl border border-black/10 shadow-neobrutalism-sm bg-white">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-zinc-100 border-b border-black/5">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => handleSort(col.key)}
                                className="cursor-pointer px-6 py-4 font-black uppercase tracking-wider text-xs text-zinc-500 hover:text-black hover:bg-black/5 transition-colors select-none group"
                            >
                                <div className="flex items-center gap-2">
                                    {col.label}
                                    <ArrowUpDown className={`w-3 h-3 transition-opacity ${sortKey === col.key ? "opacity-100" : "opacity-30 group-hover:opacity-70"}`} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                    {sorted.map((row, i) => (
                        <tr key={i} className="hover:bg-yellow-50/50 transition-colors">
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 font-medium text-zinc-700">
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
