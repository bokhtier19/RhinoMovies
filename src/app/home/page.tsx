"use client";

import React, { useEffect, useState } from "react";
import { Movie, TVShow } from "@/interfaces/interface";
import { LatestMovies, UpcomingMovies } from "@/services/movies";
import { TrendingMoviesAndShows } from "@/services/api";
import { LatestTVShows } from "@/services/tv";
import MovieCard from "@/components/Moviecard";

const HomePage = () => {
    const [trending, setTrending] = useState<(Movie | TVShow)[]>([]);
    const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
    const [latestShows, setLatestShows] = useState<TVShow[]>([]);
    const [loading, setLoading] = useState(true);
    const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);

    useEffect(() => {
        Promise.all([TrendingMoviesAndShows(), LatestMovies(), LatestTVShows(), UpcomingMovies()])
            .then(([trendingData, latestMoviesData, latestShowsData, upcomingMoviesData]) => {
                setTrending(trendingData.results);
                setLatestMovies(latestMoviesData.results);
                setLatestShows(latestShowsData.results);
                setUpcomingMovies(upcomingMoviesData.results);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-white text-center py-10">Loading...</div>;
    }

    return (
        <div className="px-2 md:px-8 lg:px-16 py-8 bg-imdb-black min-h-screen flex flex-col gap-8">
            {/* Trending */}
            <section>
                <p className="text-md text-imdb-white uppercase mb-4">Trending Movies & TV Shows</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {trending.map((item) => (
                        <MovieCard key={`movie-${item.id}`} {...item} />
                    ))}
                </div>
            </section>

            {/* Latest Movies */}
            <section>
                <p className="text-md text-imdb-white uppercase mb-4">Latest Movies</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {latestMovies.map((movie) => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                </div>
            </section>

            {/* Latest TV Shows */}
            <section>
                <p className="text-md text-imdb-white uppercase mb-4">Latest TV Shows</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {latestShows.map((show) => (
                        <MovieCard key={show.id} {...show} />
                    ))}
                </div>
            </section>

            {/*  Upcoming Movies */}
            <section>
                <p className="text-md text-imdb-white uppercase mb-4">Upcoming Movies</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {upcomingMovies.map((show) => (
                        <MovieCard key={show.id} {...show} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
