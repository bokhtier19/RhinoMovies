"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Movie, TVShow } from "@/interfaces/interface";
import MovieCard from "@/components/Moviecard";
import Searchbar from "@/components/Searchbar";
import { useSearch } from "@/context/SearchContext";

const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
};

async function fetchTopRatedMovies(page: number, query?: string): Promise<Movie[]> {
    const url = query
        ? `${API_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
        : `${API_URL}/movie/top_rated?language=en-US&page=${page}`;

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Failed to fetch top-rated movies");
    const data = await res.json();
    return data.results;
}

async function fetchTopRatedTVShows(page: number, query?: string): Promise<TVShow[]> {
    const url = query
        ? `${API_URL}/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
        : `${API_URL}/tv/top_rated?language=en-US&page=${page}`;

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Failed to fetch top-rated TV shows");
    const data = await res.json();
    return data.results;
}

const TopRatedPage = () => {
    const { query } = useSearch();

    // Movies state
    const [movies, setMovies] = useState<Movie[]>([]);
    const [moviePage, setMoviePage] = useState(1);
    const [movieHasMore, setMovieHasMore] = useState(true);
    const [movieLoading, setMovieLoading] = useState(false);

    // TV Shows state
    const [shows, setShows] = useState<TVShow[]>([]);
    const [showPage, setShowPage] = useState(1);
    const [showHasMore, setShowHasMore] = useState(true);
    const [showLoading, setShowLoading] = useState(false);

    const movieObserver = useRef<IntersectionObserver | null>(null);
    const showObserver = useRef<IntersectionObserver | null>(null);

    const lastMovieRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (movieLoading) return;
            if (movieObserver.current) movieObserver.current.disconnect();
            movieObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && movieHasMore) {
                    setMoviePage((prev) => prev + 1);
                }
            });
            if (node) movieObserver.current.observe(node);
        },
        [movieLoading, movieHasMore]
    );

    const lastShowRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (showLoading) return;
            if (showObserver.current) showObserver.current.disconnect();
            showObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && showHasMore) {
                    setShowPage((prev) => prev + 1);
                }
            });
            if (node) showObserver.current.observe(node);
        },
        [showLoading, showHasMore]
    );

    // Reset results when search query changes
    useEffect(() => {
        setMovies([]);
        setMoviePage(1);
        setMovieHasMore(true);
        setShows([]);
        setShowPage(1);
        setShowHasMore(true);
    }, [query]);

    // Fetch movies
    useEffect(() => {
        setMovieLoading(true);
        fetchTopRatedMovies(moviePage, query)
            .then((data) => {
                setMovies((prev) => [...prev, ...data]);
                if (data.length === 0) setMovieHasMore(false);
            })
            .catch(console.error)
            .finally(() => setMovieLoading(false));
    }, [moviePage, query]);

    // Fetch TV shows
    useEffect(() => {
        setShowLoading(true);
        fetchTopRatedTVShows(showPage, query)
            .then((data) => {
                setShows((prev) => [...prev, ...data]);
                if (data.length === 0) setShowHasMore(false);
            })
            .catch(console.error)
            .finally(() => setShowLoading(false));
    }, [showPage, query]);

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8 bg-imdb-black min-h-screen flex flex-col gap-8">
            {/* Search bar */}
            <Searchbar />

            {/* Top Movies Section */}
            <section>
                <h1 className="text-2xl font-bold text-imdb-white mb-4">
                    {query ? `Movie Results for "${query}"` : "Top Rated Movies"}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {movies.map((movie, index) => {
                        if (index === movies.length - 1) {
                            return (
                                <div key={movie.id} ref={lastMovieRef}>
                                    <MovieCard {...movie} />
                                </div>
                            );
                        }
                        return <MovieCard key={`movie-${movie.id}`} {...movie} />;
                    })}
                </div>
                {movieLoading && <p className="text-imdb-white text-center mt-4">Loading more movies...</p>}
            </section>

            {/* Top TV Shows Section */}
            <section>
                <h1 className="text-2xl font-bold text-imdb-white mb-4">
                    {query ? `TV Show Results for "${query}"` : "Top Rated TV Shows"}
                </h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {shows.map((show, index) => {
                        if (index === shows.length - 1) {
                            return (
                                <div key={show.id} ref={lastShowRef}>
                                    <MovieCard key={`tv-${show.id}`} {...show} />
                                </div>
                            );
                        }
                        return <MovieCard key={show.id} {...show} />;
                    })}
                </div>
                {showLoading && <p className="text-imdb-white text-center mt-4">Loading more TV shows...</p>}
            </section>
        </div>
    );
};

export default TopRatedPage;
