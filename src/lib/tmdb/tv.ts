import {tmdbFetch} from "./client";
import {TVShow, TVShowCredits, TVShowDetails} from "@/src/types/tv";
import {PaginatedResponse} from "@/src/types/common";

/**
 * Discover TV shows
 */
export function discoverTVShows(page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/discover/tv", {
        params: {
            language: "en-US",
            page
        }
    });
}

/**
 * Search TV shows
 */
export function searchTVShows(query: string, page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/search/tv", {
        params: {
            query,
            language: "en-US",
            page
        }
    });
}

/**
 * TV show details
 */
export function getTVShowById(id: string) {
    return tmdbFetch<TVShowDetails>(`/tv/${id}`, {
        params: {
            language: "en-US"
        },
        cache: "no-store"
    });
}

/**
 * TV show credits
 */
export function getTVCredits(id: string) {
    return tmdbFetch<TVShowCredits>(`/tv/${id}/credits`, {
        params: {
            language: "en-US"
        }
    });
}

/**
 * Trending TV shows (daily)
 */
export function getTrendingTVShows() {
    return tmdbFetch<PaginatedResponse<TVShow>>("/trending/tv/day", {
        params: {
            language: "en-US"
        }
    });
}

/**
 * Latest / currently airing TV shows
 */
export function getOnTheAirTVShows(page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/tv/on_the_air", {
        params: {
            language: "en-US",
            page
        }
    });
}

/**
 * Top rated TV shows
 */
export function getTopRatedTVShows(page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/tv/top_rated", {
        params: {
            language: "en-US",
            page
        }
    });
}
