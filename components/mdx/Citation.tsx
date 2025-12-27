import { BookOpen, Calendar, Download, FileText, Users } from "lucide-react";

type CitationProps = {
    title: string;
    authors: string;
    journal: string;
    year: string | number;
    volume?: string | number;
    pages?: string;
    doi?: string;
    url?: string;
};

export function Citation({ title, authors, journal, year, volume, pages, doi, url }: CitationProps) {
    return (
        <div className="my-10 bg-white dark:bg-zinc-900 border-2 border-black dark:border-venom-slime shadow-neobrutalism dark:shadow-[4px_4px_0px_0px_#84cc16] p-6 sm:p-8 rounded-xl relative overflow-hidden group hover:-translate-y-1 hover:shadow-neobrutalism-lg dark:hover:shadow-[6px_6px_0px_0px_#84cc16] transition-all duration-300">
            {/* Background Icon */}
            <FileText className="absolute -right-8 -bottom-8 w-40 h-40 text-black/5 dark:text-white/5 rotate-12" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black dark:bg-venom-slime text-white dark:text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-transparent dark:border-black/20">
                <BookOpen className="w-3 h-3" />
                Academic Reference
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-black font-sans leading-tight mb-4 text-zinc-900 dark:text-white relative z-10">
                {title}
            </h3>

            {/* Authors */}
            <div className="flex items-start gap-3 mb-4 text-neutral-600 dark:text-gray-300 relative z-10">
                <Users className="w-5 h-5 mt-1 shrink-0 text-primary dark:text-venom-slime" />
                <p className="italic font-serif leading-relaxed">
                    {authors}
                </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm font-mono text-neutral-500 dark:text-gray-400 border-t border-b border-black/10 dark:border-white/10 py-4 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-white">Journal:</span>
                    {journal}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-bold text-zinc-900 dark:text-white">Year:</span>
                    {year}
                </div>
                {volume && (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">Vol:</span>
                        {volume}
                    </div>
                )}
                {pages && (
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-white">Pages:</span>
                        {pages}
                    </div>
                )}
            </div>

            {/* Actions */}
            {(url || doi) && (
                <div className="flex flex-wrap gap-4 relative z-10">
                    {url && (
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-venom-slime text-white dark:text-black font-bold font-hand rounded-lg hover:opacity-90 transition-opacity shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </a>
                    )}
                    {doi && (
                        <a
                            href={`https://doi.org/${doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 border-2 border-black dark:border-venom-slime text-black dark:text-venom-slime font-bold font-hand rounded-lg hover:bg-black/5 dark:hover:bg-venom-slime/10 transition-colors"
                        >
                            <span className="font-sans">DOI:</span> {doi}
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
