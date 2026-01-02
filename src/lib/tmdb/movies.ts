import {tmdbFetch} from "./client";
import type {Movie, MovieDetails} from "@/src/types/movie";
import type {PaginatedResponse} from "@/src/types/common";

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
        },
        cache: "no-store"
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
export function getTrendingMovies() {
    return tmdbFetch<PaginatedResponse<Movie>>("/trending/movie/week", {
        params: {
            language: "en-US"
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
