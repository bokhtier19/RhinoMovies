import {tmdbFetch} from "./client";
import type {Movie, MovieDetails} from "@/src/types/movie";
import type {PaginatedResponse, WatchProvidersResponse} from "@/src/types/common";

/**
 * Discover movies
 */
export function discoverMovies(page = 2) {
    return tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", {
        params: {
            language: "en-US",
            page
        }
    });
}

/**
 * Movie details (no cache – always fresh)
 */
export function getMovieById(id: string) {
    return tmdbFetch<MovieDetails>(`/movie/${id}`, {
        params: {
            language: "en-US"
        }
    });
}

/**
 * Movie credits
 */
export function getMovieCredits(id: string) {
    return tmdbFetch<MovieDetails>(`/movie/${id}/credits`, {
        params: {
            language: "en-US"
        }
    });
}

/**
 * Search movies
 */
export function searchMovies(query: string, page = 2) {
    return tmdbFetch<PaginatedResponse<Movie>>("/search/movie", {
        params: {
            query,
            page,
            language: "en-US"
        }
    });
}

/**
 * Top rated movies
 */
export function getTopRatedMovies(page = 2) {
    return tmdbFetch<PaginatedResponse<Movie>>("/movie/top_rated", {
        params: {
            page,
            language: "en-US"
        }
    });
}

/**
 * Trending movies (weekly)
 */
export function getTrendingMovies(page = 1) {
    return tmdbFetch<PaginatedResponse<Movie>>("/trending/movie/week", {
        params: {
            language: "en-US",
            page
        }
    });
}

/**
 * Upcoming movies
 */
export function getUpcomingMovies(page = 2) {
    return tmdbFetch<PaginatedResponse<Movie>>("/movie/upcoming", {
        params: {
            page,
            language: "en-US"
        }
    });
}

/**
 * Now playing movies
 */
export function getNowPlayingMovies(page = 2) {
    return tmdbFetch<PaginatedResponse<Movie>>("/movie/now_playing", {
        params: {
            page,
            language: "en-US"
        }
    });
}

/**
 * Movies by genre
 */
export function getMoviesByGenre(genreId: number, page = 1) {
    return tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", {
        params: {
            with_genres: genreId,
            page,
            language: "en-US",
            sort_by: "popularity.desc"
        }
    });
}

/**
 * Recommended movies (TMDB personalised)
 */
export function getMovieRecommendations(id: string) {
    return tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/recommendations`, {
        params: { language: "en-US" },
    });
}

/**
 * Similar movies (keyword/genre based)
 */
export function getMovieSimilar(id: string) {
    return tmdbFetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`, {
        params: { language: "en-US" },
    });
}

/**
 * Streaming / rent / buy providers per country
 */
export function getMovieWatchProviders(id: string) {
    return tmdbFetch<WatchProvidersResponse>(`/movie/${id}/watch/providers`);
}

/**
 * Movie videos (trailers, teasers, etc.)
 */
export function getMovieVideos(id: string) {
    return tmdbFetch<{ results: { key: string; site: string; type: string; official: boolean }[] }>(`/movie/${id}/videos`, {
        params: { language: "en-US" },
    });
}

/**
 * Movies by country (ISO 3166-1 code)
 */
export function getMoviesByCountry(countryCode: string, page = 1) {
    return tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", {
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
export function discoverMoviesFiltered(p: {
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
    if (p.year) params.primary_release_year = p.year;
    if (p.sortBy) params.sort_by = p.sortBy;
    if (p.sortBy?.startsWith("vote_average")) params["vote_count.gte"] = 100;
    return tmdbFetch<PaginatedResponse<Movie>>("/discover/movie", { params });
}
