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
import AdvancedFilterModal from "@/src/components/AdvancedFilterModal";
import MovieGridSkeleton from "@/src/components/MovieGridSkeleton";

type ApiResponse = { results: Movie[]; total_pages: number };
type Genre = { id: number; name: string };

export default function MoviesPage() {
    const { query } = useSearch();
    const searchParams = useSearchParams();

    const genreParam  = searchParams.get("genre") ?? "";
    const countryCode = searchParams.get("country") ?? "";
    const year        = searchParams.get("year") ?? "";
    const sort        = searchParams.get("sort") ?? "";
    const order       = searchParams.get("order") ?? "desc";
    const category    = searchParams.get("category") ?? "";

    const { gridRef, limit, ghosts } = useGridRows(5);

    const [movies, setMovies]         = useState<Movie[]>([]);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [genreLabel, setGenreLabel] = useState<string | null>(null);
    const [countryName, setCountryName] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => { setPage(1); }, [query, genreParam, countryCode, year, sort, order, category]);

    // Resolve first genre name for the page title
    useEffect(() => {
        if (!genreParam) { setGenreLabel(null); return; }
        const firstId = genreParam.split("|")[0];
        fetch("/api/genres")
            .then(r => r.json())
            .then((list: Genre[]) => {
                const name = list.find(g => String(g.id) === firstId)?.name ?? null;
                const count = genreParam.split("|").length;
                setGenreLabel(name ? (count > 1 ? `${name} & more` : name) : null);
            })
            .catch(() => setGenreLabel(null));
    }, [genreParam]);

    useEffect(() => {
        if (!countryCode) { setCountryName(null); return; }
        fetch("/api/countries")
            .then(r => r.json())
            .then((list: { code: string; name: string }[]) => {
                setCountryName(list.find(c => c.code === countryCode)?.name ?? null);
            })
            .catch(() => setCountryName(null));
    }, [countryCode]);

    const fetchMovies = useCallback(async (signal: AbortSignal) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (query?.trim()) {
                params.set("query", query.trim());
            } else {
                if (genreParam)   params.set("genre", genreParam);
                if (countryCode)  params.set("country", countryCode);
                if (year)         params.set("year", year);
                if (sort)         params.set("sort", sort);
                if (order !== "desc") params.set("order", order);
                if (category)     params.set("category", category);
            }

            const res = await fetch(`/api/movies?${params}`, { signal });
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
    }, [page, query, genreParam, countryCode, year, sort, order, category]);

    useEffect(() => {
        const controller = new AbortController();
        fetchMovies(controller.signal);
        return () => controller.abort();
    }, [fetchMovies]);

    const hasActiveFilter = !!(genreParam || countryCode || year || sort || order !== "desc");

    const SORT_LABELS: Record<string, string> = {
        popularity: "Popular", rating: "Top Rated", date: "New",
        name: "A–Z", revenue: "Revenue", budget: "Budget",
    };

    const pageTitle = query?.trim()
        ? `Results for "${query}"`
        : genreLabel
        ? `${genreLabel} Movies`
        : countryName
        ? `Movies from ${countryName}`
        : year
        ? `${year} Movies`
        : category === "trending" ? "Trending Movies"
        : category === "upcoming" ? "Upcoming Movies"
        : category === "latest"   ? "Latest Movies"
        : sort && SORT_LABELS[sort]
        ? `${SORT_LABELS[sort]} Movies`
        : "Top Rated Movies";

    return (
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <Searchbar
                onFilterClick={() => setFilterOpen(true)}
                hasActiveFilter={hasActiveFilter}
            />

            <Title title={pageTitle} />

            {error && <p className="mb-6 text-center text-red-400">{error}</p>}
            {loading && <MovieGridSkeleton />}

            {!loading && movies.length > 0 && (
                <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                    {movies.slice(0, limit).map(movie => <MovieCard key={movie.id} {...movie} />)}
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

            <AdvancedFilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
    );
}
