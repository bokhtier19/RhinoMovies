"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { Movie } from "@/src/types/movie";
import { useSearch } from "@/src/context/SearchContext";
import { useGridRows } from "@/src/hooks/useGridRows";

import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import Title from "@/src/components/Title";

type ApiResponse = {
    results: Movie[];
    total_pages: number;
};

type Genre = { id: number; name: string };

export default function TopRatedMoviesPage() {
    const { query } = useSearch();
    const searchParams = useSearchParams();
    const genreId = searchParams.get("genre");
    const countryCode = searchParams.get("country");

    const { gridRef, limit, ghosts } = useGridRows(5);

    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genreName, setGenreName] = useState<string | null>(null);
    const [countryName, setCountryName] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [query, genreId, countryCode]);

    useEffect(() => {
        if (!genreId) { setGenreName(null); return; }
        fetch("/api/genres")
            .then((r) => r.json())
            .then((genres: Genre[]) => {
                setGenreName(genres.find((g) => String(g.id) === genreId)?.name ?? null);
            })
            .catch(() => setGenreName(null));
    }, [genreId]);

    useEffect(() => {
        if (!countryCode) { setCountryName(null); return; }
        fetch("/api/countries")
            .then((r) => r.json())
            .then((countries: { code: string; name: string }[]) => {
                setCountryName(countries.find((c) => c.code === countryCode)?.name ?? null);
            })
            .catch(() => setCountryName(null));
    }, [countryCode]);

    const fetchMovies = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (query?.trim()) params.set("query", query.trim());
            else if (genreId) params.set("genre", genreId);
            else if (countryCode) params.set("country", countryCode);

            const res = await fetch(`/api/movies?${params.toString()}`, { signal });
            if (!res.ok) throw new Error("API request failed");

            const data: ApiResponse = await res.json();
            setMovies(data.results);
            setTotalPages(Math.min(data.total_pages, 500));
        } catch (err: any) {
            if (err.name !== "AbortError") {
                console.error(err);
                setError("Something went wrong while loading movies.");
            }
        } finally {
            setLoading(false);
        }
    }, [page, query, genreId, countryCode]);

    useEffect(() => {
        const controller = new AbortController();
        fetchMovies(controller.signal);
        return () => controller.abort();
    }, [fetchMovies]);

    const pageTitle = query?.trim()
        ? `Results for "${query}"`
        : genreName
        ? `${genreName} Movies`
        : countryName
        ? `Movies from ${countryName}`
        : "Top Rated Movies";

    return (
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <Searchbar />
            <Title title={pageTitle} />

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
