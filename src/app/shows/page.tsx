"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { TVShow } from "@/src/types/tv";
import { useSearch } from "@/src/context/SearchContext";
import { useGridRows } from "@/src/hooks/useGridRows";

import MovieCard from "@/src/components/MovieCard";
import Searchbar from "@/src/components/Searchbar";
import Pagination from "@/src/components/Pagination";
import Title from "@/src/components/Title";
import AdvancedFilterModal from "@/src/components/AdvancedFilterModal";
import MovieGridSkeleton from "@/src/components/MovieGridSkeleton";

type ApiResponse = { results: TVShow[]; total_pages: number };
type Genre = { id: number; name: string };

export default function ShowsPage() {
    const { query } = useSearch();
    const searchParams = useSearchParams();

    const genreParam  = searchParams.get("genre") ?? "";
    const countryCode = searchParams.get("country") ?? "";
    const year        = searchParams.get("year") ?? "";
    const sort        = searchParams.get("sort") ?? "";
    const order       = searchParams.get("order") ?? "desc";
    const category    = searchParams.get("category") ?? "";

    const { gridRef, limit, ghosts } = useGridRows(5);

    const [shows, setShows]           = useState<TVShow[]>([]);
    const [page, setPage]             = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading]       = useState(false);
    const [error, setError]           = useState<string | null>(null);
    const [genreLabel, setGenreLabel] = useState<string | null>(null);
    const [countryName, setCountryName] = useState<string | null>(null);
    const [filterOpen, setFilterOpen] = useState(false);

    useEffect(() => { setPage(1); }, [query, genreParam, countryCode, year, sort, order, category]);

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

    const fetchShows = useCallback(async (signal: AbortSignal) => {
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

            const res = await fetch(`/api/tv?${params}`, { signal });
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
    }, [page, query, genreParam, countryCode, year, sort, order, category]);

    useEffect(() => {
        const controller = new AbortController();
        fetchShows(controller.signal);
        return () => controller.abort();
    }, [fetchShows]);

    const hasActiveFilter = !!(genreParam || countryCode || year || sort || order !== "desc");

    const SORT_LABELS: Record<string, string> = {
        popularity: "Popular", rating: "Top Rated", date: "New",
        name: "A–Z", revenue: "Revenue", budget: "Budget",
    };

    const pageTitle = query?.trim()
        ? `Results for "${query}"`
        : genreLabel
        ? `${genreLabel} TV Shows`
        : countryName
        ? `TV Shows from ${countryName}`
        : year
        ? `${year} TV Shows`
        : category === "trending" ? "Trending TV Shows"
        : category === "latest"   ? "Latest TV Shows"
        : sort && SORT_LABELS[sort]
        ? `${SORT_LABELS[sort]} TV Shows`
        : "Top Rated TV Shows";

    return (
        <div className="bg-imdb-black min-h-screen px-4 py-8 md:px-8 lg:px-16">
            <Searchbar
                onFilterClick={() => setFilterOpen(true)}
                hasActiveFilter={hasActiveFilter}
            />

            <Title title={pageTitle} />

            {error && <p className="mb-6 text-center text-red-400">{error}</p>}
            {loading && <MovieGridSkeleton />}

            {!loading && shows.length > 0 && (
                <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                    {shows.slice(0, limit).map(show => <MovieCard key={show.id} {...show} />)}
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

            <AdvancedFilterModal isOpen={filterOpen} onClose={() => setFilterOpen(false)} />
        </div>
    );
}
