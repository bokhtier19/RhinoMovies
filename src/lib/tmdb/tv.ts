import {tmdbFetch} from "./client";
import {TVShow, TVShowCredits, TVShowDetails} from "@/src/types/tv";
import {PaginatedResponse, WatchProvidersResponse} from "@/src/types/common";

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
        }
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
export function getTrendingTVShows(page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/trending/tv/day", {
        params: {
            language: "en-US",
            page
        }
    });
}

export function getTVShowsByGenre(genreId: number, page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/discover/tv", {
        params: {
            with_genres: genreId,
            page,
            language: "en-US",
            sort_by: "popularity.desc"
        }
    });
}

export function getTVShowsByCountry(countryCode: string, page = 1) {
    return tmdbFetch<PaginatedResponse<TVShow>>("/discover/tv", {
        params: {
            with_origin_country: countryCode,
            page,
            language: "en-US",
            sort_by: "popularity.desc"
        }
    });
}

/**
 * General discover with all filter/sort params combined
 */
export function discoverTVFiltered(p: {
    genres?: string;
    country?: string;
    year?: string;
    sortBy?: string;
    page?: number;
}) {
    const params: Record<string, string | number | undefined> = {
        language: "en-US",
        page: p.page ?? 1,
    };
    if (p.genres) params.with_genres = p.genres;
    if (p.country) params.with_origin_country = p.country;
    if (p.year) params.first_air_date_year = p.year;
    if (p.sortBy) params.sort_by = p.sortBy;
    if (p.sortBy?.startsWith("vote_average")) params["vote_count.gte"] = 50;
    return tmdbFetch<PaginatedResponse<TVShow>>("/discover/tv", { params });
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
 * Recommended TV shows (TMDB personalised)
 */
export function getTVRecommendations(id: string) {
    return tmdbFetch<PaginatedResponse<TVShow>>(`/tv/${id}/recommendations`, {
        params: { language: "en-US" },
    });
}

/**
 * Similar TV shows (keyword/genre based)
 */
export function getTVSimilar(id: string) {
    return tmdbFetch<PaginatedResponse<TVShow>>(`/tv/${id}/similar`, {
        params: { language: "en-US" },
    });
}

/**
 * Streaming / rent / buy providers per country
 */
export function getTVWatchProviders(id: string) {
    return tmdbFetch<WatchProvidersResponse>(`/tv/${id}/watch/providers`);
}

/**
 * TV show videos (trailers, teasers, etc.)
 */
export function getTVVideos(id: string) {
    return tmdbFetch<{ results: { key: string; site: string; type: string; official: boolean }[] }>(`/tv/${id}/videos`, {
        params: { language: "en-US" },
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
