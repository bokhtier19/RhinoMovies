"use client";

import { useEffect, useState } from "react";
import { TVShow } from "@/src/types/tv";
import { useSearch } from "@/src/context/SearchContext";
import { useGridRows } from "@/src/hooks/useGridRows";

import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import Loader from "@/src/components/Loader";
import Title from "@/src/components/Title";

type ApiResponse = {
    results: TVShow[];
    total_pages: number;
};

export default function TopRatedTVShowsPage() {
    const { query } = useSearch();
    const { gridRef, limit, ghosts } = useGridRows(5);

    const [shows, setShows] = useState<TVShow[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchShows = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({ page: String(page) });
                if (query?.trim()) params.set("query", query.trim());

                const res = await fetch(`/api/tv?${params.toString()}`, { signal: controller.signal });
                if (!res.ok) throw new Error("Failed to fetch TV shows");

                const data: ApiResponse = await res.json();
                setShows(data.results);
                setTotalPages(data.total_pages);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Something went wrong while loading TV shows.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
        return () => controller.abort();
    }, [page, query]);

    return (
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <Searchbar />
            <Title title={query?.trim() ? `Results for "${query}"` : "Top Rated TV Shows"} />

            {error && <p className="mb-6 text-center text-red-400">{error}</p>}
            {loading && <Loader />}

            {!loading && shows.length > 0 && (
                <div
                    ref={gridRef}
                    className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4"
                >
                    {shows.slice(0, limit).map((show) => (
                        <MovieCard key={show.id} {...show} />
                    ))}
                    {Array.from({ length: ghosts(Math.min(shows.length, limit)) }).map((_, i) => (
                        <div key={`ghost-${i}`} />
                    ))}
                </div>
            )}

            {!loading && shows.length === 0 && !error && (
                <p className="text-imdb-white mt-10 text-center">No TV shows found.</p>
            )}

            {!loading && totalPages > 1 && (
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
