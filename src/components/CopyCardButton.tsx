"use client";
import { useState } from "react";
import { MdContentCopy, MdCheck } from "react-icons/md";

interface Props {
    id: number;
    mediaType: "movie" | "tv";
    title: string;
    year?: string;
    rating?: number;
    runtime?: number | null;
    seasons?: number | null;
    genres?: string[];
    overview?: string;
}

export function CopyCardButton({ id, mediaType, title, year, rating, runtime, seasons, genres, overview }: Props) {
    const [copied, setCopied] = useState(false);

    const buildCard = () => {
        const lines: string[] = [`🎬 ${title}${year ? ` (${year})` : ""}`];

        const meta: string[] = [];
        if (rating && rating > 0) meta.push(`⭐ ${rating.toFixed(1)}/10`);
        if (runtime) meta.push(`${runtime} min`);
        else if (seasons) meta.push(`${seasons} season${seasons > 1 ? "s" : ""}`);
        if (genres && genres.length > 0) meta.push(genres.slice(0, 3).join(", "));
        if (meta.length > 0) lines.push(meta.join(" · "));

        if (overview) {
            const snippet = overview.length > 140 ? overview.slice(0, 137) + "..." : overview;
            lines.push(`"${snippet}"`);
        }

        const origin = typeof window !== "undefined" ? window.location.origin : "https://rhinomovies.vercel.app";
        lines.push("");
        lines.push(`Find on RhinoMovies 👉 ${origin}/${mediaType === "movie" ? "movies" : "shows"}/${id}`);

        return lines.join("\n");
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(buildCard());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard access denied */
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{
                borderColor: copied ? "#22c55e" : "var(--detail-btn-border)",
                color: copied ? "#22c55e" : "var(--detail-btn-color)",
            }}
            title="Copy to clipboard and share"
        >
            {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
            {copied ? "Copied!" : "Share"}
        </button>
    );
}
