"use client";

import { useEffect, useState } from "react";
import { useSearch } from "@/src/context/SearchContext";
import { useGridRows } from "@/src/hooks/useGridRows";

import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import Title from "@/src/components/Title";
import { Movie } from "@/src/types/movie";

type ApiResponse = {
    results: Movie[];
    total_pages: number;
};

export default function TopRatedMoviesPage() {
    const { query } = useSearch();
    const { gridRef, limit, ghosts } = useGridRows(5);

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMovies = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({ page: String(page) });
                if (query?.trim()) params.set("query", query);

                const res = await fetch(`/api/movies?${params.toString()}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Failed to fetch movies");

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
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <Searchbar />
            <Title title={query?.trim() ? `Results for "${query}"` : "Top Rated Movies"} />

            {error && <p className="mb-6 text-center text-red-400">{error}</p>}
            {loading && <p className="text-imdb-white mb-6 text-center">Loading…</p>}

            {!loading && movies.length > 0 && (
                <div
                    ref={gridRef}
                    className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4"
                >
                    {movies.slice(0, limit).map((movie) => (
                        <MovieCard key={movie.id} {...movie} />
                    ))}
                    {Array.from({ length: ghosts(Math.min(movies.length, limit)) }).map((_, i) => (
                        <div key={`ghost-${i}`} />
                    ))}
                </div>
            )}

            {!loading && movies.length === 0 && !error && (
                <p className="text-imdb-white mt-10 text-center">No movies found.</p>
            )}

            {!loading && totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
