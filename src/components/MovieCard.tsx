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
            <div className="w-44 flex-shrink-0 rounded-sm overflow-hidden hover:scale-105 transition-all">
                <div className="relative w-full h-64">
                    <Image src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-image-available.png"} alt={displayTitle} fill sizes="40" className="object-cover" />
                </div>

                <div className="p-2">
                    <h2 className="text-sm font-semibold truncate">{displayTitle}</h2>

                    <div className="flex items-center justify-between">
                        <span className="text-xs">{displayDate !== "N/A" ? displayDate.split("-")[0] : "N/A"}</span>

                        <span className="border px-1 py-1 rounded-sm text-[.6rem]">{displayType}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
