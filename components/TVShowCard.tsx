import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TVShow } from "@/interfaces/interface";

interface TVShowCardProps extends TVShow {
    number_of_seasons?: number;
    number_of_episodes?: number;
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
            <div className="w-44 flex-shrink-0 bg-imdb-black rounded-sm overflow-hidden hover:scale-105 transition-transform">
                <div className="relative w-full h-64">
                    <Image
                        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-image-available.png"}
                        alt={name}
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>
                <div className="p-2">
                    <h2 className="text-sm font-bold text-white truncate">{name}</h2>
                    <div className="flex justify-between items-end text-xs text-gray-300 mt-1">
                        <span>{first_air_date?.split("-")[0] || "N/A"}</span>
                        <span className="border px-1 py-1 rounded-sm text-[.6rem]">
                            SS: {number_of_seasons || 0} | EPS: {number_of_episodes || 0}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TVShowCard;
