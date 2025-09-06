import { CardProps } from "@/interfaces/interface";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const MovieCard: React.FC<CardProps> = ({
    id,
    title,
    name,
    poster_path,
    release_date,
    first_air_date,
    type,
    media_type,
}) => {
    const displayTitle = title || name || "Untitled";
    const displayDate = release_date || first_air_date || "N/A";

    // Decide type: priority -> media_type -> prop type -> fallback
    const displayType =
        media_type === "movie" ? "MOVIE" : media_type === "tv" ? "TV" : type || (title ? "MOVIE" : "TV");

    // Build correct href
    const href = displayType === "MOVIE" ? `/movies/${id}` : `/shows/${id}`;

    return (
        <Link href={href}>
            <div className="w-44 flex-shrink-0 bg-imdb-black rounded-sm overflow-hidden hover:scale-105 transition-all">
                <div className="relative w-full h-64">
                    <Image
                        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-image-available.png"}
                        alt={displayTitle}
                        fill // ✅ new Next.js way instead of layout="fill"
                        sizes="40"
                        className="object-cover"
                    />
                </div>
                <div className="p-2">
                    <h2 className="text-sm font-bold text-white truncate">{displayTitle}</h2>
                    <div className="flex items-center justify-between">
                        <span className="text-xs">{displayDate?.split("-")[0] || "N/A"}</span>
                        <span className="border px-1 py-1 rounded-sm text-[.6rem]">{displayType}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
