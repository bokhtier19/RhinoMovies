"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { TVShow } from "@/interfaces/interface";
import MovieCard from "@/components/Moviecard";
import Searchbar from "@/components/Searchbar";
import { useSearch } from "@/context/SearchContext";
import Loader from "@/components/Loader";

const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN as string;

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
};

type PageResp = { results: TVShow[]; total_pages: number };

const fetchTopRatedTVShowsPage = async (page: number, query?: string): Promise<PageResp> => {
    const url = query?.trim() ? `${API_URL}/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}` : `${API_URL}/tv/top_rated?language=en-US&page=${page}`;

    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Failed to fetch TV shows");
    const data = await res.json();
    return { results: data.results ?? [], total_pages: data.total_pages ?? 1 };
};

// merge and dedupe by id
const mergeUniqueById = (prev: TVShow[], next: TVShow[]) => Array.from(new Map([...prev, ...next].map((s) => [s.id, s])).values());

const TopRatedTVShowsPage = () => {
    const { query } = useSearch();
    const [shows, setShows] = useState<TVShow[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const reqIdRef = useRef(0);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastCardRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setPage((prev) => {
                            if (totalPages && prev >= totalPages) return prev;
                            return prev + 1;
                        });
                    }
                },
                { root: null, rootMargin: "600px", threshold: 0.1 }
            );
            if (node) observer.current.observe(node);
        },
        [loading, totalPages]
    );

    // reset on query change
    useEffect(() => {
        setShows([]);
        setPage(1);
        setTotalPages(null);
    }, [query]);

    // fetch shows
    useEffect(() => {
        let aborted = false;
        const currentReq = ++reqIdRef.current;

        const run = async () => {
            setLoading(true);
            try {
                const { results, total_pages } = await fetchTopRatedTVShowsPage(page, query);
                if (aborted || currentReq !== reqIdRef.current) return;
                setShows((prev) => mergeUniqueById(prev, results));
                setTotalPages(total_pages);
            } catch (e) {
                console.error(e);
            } finally {
                if (!aborted) setLoading(false);
            }
        };

        run();
        return () => {
            aborted = true;
        };
    }, [page, query]);

    return (
        <div className="px-4 md:px-8 lg:px-16 py-8 bg-imdb-black min-h-screen">
            <Searchbar />

            <h1 className="text-2xl font-bold text-imdb-white mb-6">{query?.trim() ? `Results for "${query}"` : "Top Rated TV Shows"}</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-6">
                {shows.map((show, i) => {
                    const isLast = i === shows.length - 1;
                    const card = <MovieCard key={show.id} {...show} />;
                    return isLast ? (
                        <div ref={lastCardRef} key={`wrap-${show.id}`}>
                            {card}
                        </div>
                    ) : (
                        card
                    );
                })}
            </div>

            {loading && <Loader />}
            {totalPages && page >= totalPages && !loading && <p className="text-imdb-white text-center mt-4">No more shows to load</p>}
        </div>
    );
};

export default TopRatedTVShowsPage;
