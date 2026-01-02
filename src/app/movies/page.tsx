"use client";

import {useEffect, useState, useCallback} from "react";

import {Movie} from "@/src/types/interface";
import {useSearch} from "@/src/context/SearchContext";

import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import Title from "@/src/components/Title";

type ApiResponse = {
    results: Movie[];
    total_pages: number;
};

export default function TopRatedMoviesPage() {
    const {query} = useSearch();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(2);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Reset pagination whenever search query changes
     */
    useEffect(() => {
        setPage(1);
    }, [query]);

    /**
     * Centralized fetch logic
     */
    const fetchMovies = useCallback(
        async (signal: AbortSignal) => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    page: String(page)
                });

                if (query?.trim()) {
                    params.set("query", query.trim());
                }

                const res = await fetch(`/api/movies?${params.toString()}`, {
                    signal
                });

                if (!res.ok) {
                    throw new Error("API request failed");
                }

                const data: ApiResponse = await res.json();

                setMovies(data.results);
                // TMDB hard limit protection
                setTotalPages(Math.min(data.total_pages, 500));
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Something went wrong while loading movies.");
                }
            } finally {
                setLoading(false);
            }
        },
        [page, query]
    );

    /**
     * Effect trigger
     */
    useEffect(() => {
        const controller = new AbortController();
        fetchMovies(controller.signal);

        return () => controller.abort();
    }, [fetchMovies]);

    const title = query?.trim() ? `Results for "${query}"` : "Top Rated Movies";

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8 bg-imdb-black min-h-screen">
            <Searchbar />

            <Title title="Top rated movies" />

            {/* Error */}
            {error && <p className="text-red-400 text-center mb-6">{error}</p>}

            {/* Loading */}
            {loading && <p className="text-imdb-white text-center mb-6">Loading…</p>}

            {/* Movies Grid */}
            {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && movies.length === 0 && !error && <p className="text-imdb-white text-center mt-10">No movies found.</p>}

            {/* Pagination */}
            {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
    );
}
