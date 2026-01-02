"use client";

import {useEffect, useState} from "react";
import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import {Movie} from "@/src/types/interface";
import {useSearch} from "@/src/context/SearchContext";

type ApiResponse = {
    results: Movie[];
    total_pages: number;
};

export default function TopRatedMoviesPage() {
    const {query} = useSearch();

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset pagination when search changes
    useEffect(() => {
        setPage(1);
    }, [query]);

    // Fetch movies (SINGLE source of truth)
    useEffect(() => {
        const controller = new AbortController();

        const fetchMovies = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    page: String(page)
                });

                if (query?.trim()) {
                    params.set("query", query);
                }

                const res = await fetch(`/api/movies?${params.toString()}`, {
                    signal: controller.signal
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data: ApiResponse = await res.json();

                setMovies(data.results);
                setTotalPages(data.total_pages);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Something went wrong while loading movies.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();

        return () => controller.abort();
    }, [page, query]);

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8 bg-imdb-black min-h-screen">
            <Searchbar />

            <h1 className="text-2xl font-bold text-imdb-white mb-6">{query?.trim() ? `Results for "${query}"` : "Top Rated Movies"}</h1>

            {/* Error */}
            {error && <p className="text-red-400 text-center mb-6">{error}</p>}

            {/* Loading */}
            {loading && <p className="text-imdb-white text-center mb-6">Loading…</p>}

            {/* Movies Grid */}
            {!loading && movies.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && movies.length === 0 && !error && <p className="text-imdb-white text-center mt-10">No movies found.</p>}

            {/* Pagination UI */}
            {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
    );
}
