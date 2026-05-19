import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MovieCardProps {
    id: number;

    // Movie
    title?: string;
    release_date?: string;

    // TV
    name?: string;
    first_air_date?: string;

    poster_path: string | null;
    media_type?: "movie" | "tv";
}

const MovieCard: React.FC<MovieCardProps> = ({id, title, name, poster_path, release_date, first_air_date, media_type}) => {
    const displayTitle = title ?? name ?? "Untitled";
    const displayDate = release_date ?? first_air_date ?? "N/A";

    const displayType = media_type === "movie" ? "MOVIE" : media_type === "tv" ? "TV" : title ? "MOVIE" : "TV";

    const href = displayType === "MOVIE" ? `/movies/${id}` : `/shows/${id}`;

    return (
        <Link href={href}>
            <div className="w-full rounded-sm overflow-hidden hover:scale-105 transition-all" style={{ backgroundColor: "var(--card)" }}>
                <div className="relative w-full h-64">
                    {poster_path ? (
                        <Image src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={displayTitle} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 176px" className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
                            <span className="text-xs font-medium text-center px-2 leading-tight" style={{ color: "var(--muted)" }}>Poster Not Available</span>
                        </div>
                    )}
                </div>

                <div className="p-2">
                    <h2 className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{displayTitle}</h2>

                    <div className="flex items-center justify-between">
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{displayDate !== "N/A" ? displayDate.split("-")[0] : "N/A"}</span>

                        <span className="px-1 py-1 rounded-sm text-[.6rem]" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>{displayType}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
