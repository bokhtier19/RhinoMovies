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
                    <Image src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "https://via.placeholder.com/500x750?text=No+Image"} alt={displayTitle} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 176px" className="object-cover" />
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
