import { Movie, MovieDetails, TVShow, TVShowDetails } from "@/interfaces/interface";

const API_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Helper: common fetch options
const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
};

// Discover movies
export async function fetchMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/discover/movie`, options);

    if (!res.ok) {
        throw new Error("Failed to fetch movies");
    }

    return res.json();
}

// Movie details
export async function fetchMovieDetails(movie_id: string) {
    const res = await fetch(`${API_URL}/movie/${movie_id}`, {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${TMDB_TOKEN}`,
        },
        cache: "no-store", // avoids Next.js stale cache
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch movie details: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

// Movie credits
export async function fetchCredits(id: string) {
    const res = await fetch(`${API_URL}/movie/${id}/credits`, options);

    if (!res.ok) {
        throw new Error("Failed to fetch movie credits");
    }

    return res.json();
}

// Search movies
export async function searchMovies(query: string): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/search/movie?query=${encodeURIComponent(query)}`, options);

    if (!res.ok) {
        throw new Error("Failed to search movies");
    }

    return res.json();
}

//Top Rated Movies

export async function TopRatedMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/movie/top_rated`, options);

    if (!res.ok) {
        throw new Error("Failed to search movies");
    }

    return res.json();
}

//Trending Movies
export async function TrendingMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/trending/movie/week`, options);

    if (!res.ok) {
        throw new Error("Failed to search movies");
    }

    return res.json();
}

//Upcoming Movies
export async function UpcomingMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/movie/upcoming`, options);

    if (!res.ok) {
        throw new Error("Failed to search movies");
    }

    return res.json();
}

//Latest Movies
export async function LatestMovies(): Promise<{ results: Movie[] }> {
    const res = await fetch(`${API_URL}/movie/now_playing`, options);

    if (!res.ok) {
        throw new Error("Failed to search movies");
    }

    return res.json();
}
