/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Cast, TVShowDetails } from "@/interfaces/interface";
import Image from "next/image";
import Link from "next/link";
import { FaPlay, FaPlayCircle } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { BsCameraReelsFill } from "react-icons/bs";
import { IoThumbsDown, IoThumbsUp } from "react-icons/io5";
import { fetchTVCredits, fetchTVShowDetails } from "@/services/tv";
import Loader from "@/components/Loader";

export default function TVShowDetailsPage() {
    const { id } = useParams();
    const [show, setShow] = useState<TVShowDetails | null>(null);
    const [casts, setCasts] = useState<Cast[]>([]);
    const [liked, setLiked] = useState<null | "up" | "down">(null);

    useEffect(() => {
        if (!id) return;

        (async () => {
            const showData = await fetchTVShowDetails(id as string);
            setShow(showData);

            const creditData = await fetchTVCredits(id as string);
            setCasts(creditData.cast);
        })();
    }, [id]);

    if (!show) {
        return <Loader />;
    }

    return (
        <div
            className="relative min-h-screen w-full bg-cover bg-center"
            style={{
                backgroundImage: show.backdrop_path
                    ? `url(https://image.tmdb.org/t/p/original${show.backdrop_path})`
                    : show.poster_path
                    ? `url(https://image.tmdb.org/t/p/original${show.poster_path})`
                    : "none",
            }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-imdb-black via-imdb-black/90 to-transparent" />

            {/* Breadcrumb */}
            <div className="relative z-20 px-6 py-4 text-sm flex items-center gap-2 text-white">
                <Link href="/" className="hover:text-imdb-yellow transition-colors">
                    Home
                </Link>
                <span>/</span>
                <Link href="/shows" className="hover:text-imdb-yellow transition-colors">
                    Shows
                </Link>
                <span>/</span>
                <span>{show.name}</span>
            </div>

            {/* Middle Play Button */}
            <div className="h-[90vh] flex items-center justify-center relative z-20">
                <Link href={show.homepage || "/"} target="_blank">
                    <FaPlayCircle size={120} className="text-imdb-lightgray hover:text-imdb-yellow" />
                </Link>
            </div>

            {/* Details */}
            <div className="relative z-20 py-4 flex gap-6 flex-col pb-10 px-10 bg-imdb-black/80">
                <div className="flex gap-6 py-4 px-4">
                    {/* Poster + Like/Dislike */}
                    <div className="w-1/5 flex flex-col items-center gap-4">
                        <Image src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "/no-image-available.png"} alt={show.name} width={225} height={300} />
                        <div className="flex justify-between w-full">
                            <button onClick={() => setLiked("up")} className={`py-1 rounded-sm hover:cursor-pointer px-2 flex gap-2 ${liked === "up" ? "bg-green-600" : "bg-gray-500"}`}>
                                <IoThumbsUp /> Like
                            </button>
                            <button onClick={() => setLiked("down")} className={`py-1 rounded-sm px-2 hover:cursor-pointer flex gap-2 ${liked === "down" ? "bg-red-600" : "bg-gray-500"}`}>
                                <IoThumbsDown /> Dislike
                            </button>
                        </div>
                        <div className="w-full bg-red-600 h-2 rounded">
                            <div className="bg-green-600 h-2 rounded" style={{ width: `${(show.vote_average / 10) * 100}%` }} />
                        </div>
                    </div>

                    {/* Show Details */}
                    <div className="flex flex-col gap-4 text-sm text-white">
                        <div className="flex justify-between">
                            <button className="flex bg-imdb-yellow text-imdb-black py-2 px-4 rounded-full gap-2">
                                <FaPlay /> Watch Now
                            </button>
                            <button className="flex bg-imdb-lightgray text-imdb-black py-2 px-4 rounded-full gap-2">
                                <IoMdAdd /> Add to Favourites
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold">{show.name}</h1>

                        <div className="flex items-center gap-6">
                            <p className="bg-imdb-white text-imdb-black py-1 px-2 flex gap-2 items-center rounded text-sm">
                                <BsCameraReelsFill /> Trailer
                            </p>
                            <p className="font-bold border py-1 px-2 rounded">HD</p>
                            <p className="text-imdb-yellow font-bold">IMDB: {show.vote_average.toFixed(1)}</p>
                        </div>

                        <p className="text-gray-300">{show.overview}</p>

                        <div>
                            <p>Seasons: {show.number_of_seasons}</p>
                            <p>Episodes: {show.number_of_episodes}</p>
                            <p>First Air Date: {show.first_air_date}</p>
                            <p>Genres: {show.genres?.map((g) => g.name).join(", ")}</p>
                            <p>Production Companies: {show.production_companies?.map((c: { name: any }) => c.name).join(", ")}</p>
                        </div>

                        {/* Top Casts */}
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Top Casts</h2>
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                                {casts.slice(0, 8).map((cast) => (
                                    <div key={cast.id} className="flex flex-col items-center w-28">
                                        <Image
                                            src={cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : "/no-image-available.png"}
                                            alt={cast.name}
                                            width={100}
                                            height={150}
                                            className="rounded-sm"
                                        />
                                        <p className="text-sm font-medium mt-1 text-center">{cast.name}</p>
                                        <p className="text-xs text-gray-400 text-center">{cast.character}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
