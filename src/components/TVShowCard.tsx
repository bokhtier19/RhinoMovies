import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TVShow } from "@/src/types/tv";

interface TVShowCardProps extends TVShow {
    number_of_seasons?: number;
    number_of_episodes?: number;
    first_air_date?: string;
}

const TVShowCard: React.FC<TVShowCardProps> = ({
    id,
    name,
    poster_path,
    first_air_date,
    number_of_seasons,
    number_of_episodes,
}) => {
    return (
        <Link href={`/shows/${id}`}>
            <div className="bg-imdb-black w-44 flex-shrink-0 overflow-hidden rounded-sm transition-transform hover:scale-105">
                <div className="relative h-64 w-full">
                    <Image
                        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-image-available.png"}
                        alt={name}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="p-2">
                    <h2 className="truncate text-sm font-bold text-white">{name}</h2>
                    <div className="mt-1 flex items-end justify-between text-xs text-gray-300">
                        <span>{first_air_date?.split("-")[0] || "N/A"}</span>
                        <span className="rounded-sm border px-1 py-1 text-[.6rem]">
                            SS: {number_of_seasons || 0} | EPS: {number_of_episodes || 0}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TVShowCard;
