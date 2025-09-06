import { TVShow, TVShowDetails } from "@/interfaces/interface";

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

// Fetch popular TV shows (discover endpoint)
export async function fetchTVShows(): Promise<{ results: TVShow[] }> {
    const res = await fetch(`${API_URL}/discover/tv`, options);

    if (!res.ok) {
        throw new Error("Failed to fetch TV shows");
    }

    return res.json();
}

// Search TV shows by query
export async function searchTVShows(query: string): Promise<{ results: TVShow[] }> {
    const res = await fetch(`${API_URL}/search/tv?query=${encodeURIComponent(query)}`, options);

    if (!res.ok) {
        throw new Error("Failed to search TV shows");
    }

    return res.json();
}

// TV show details by series ID
export async function fetchTVShowDetails(series_id: string): Promise<TVShowDetails> {
    const res = await fetch(`${API_URL}/tv/${series_id}`, options);

    if (!res.ok) {
        throw new Error("Failed to fetch TV show details");
    }

    return res.json();
}

// TV show credits (cast & crew)
export async function fetchTVCredits(series_id: string) {
    const res = await fetch(`${API_URL}/tv/${series_id}/credits?api_key=${API_KEY}&language=en-US`);

    if (!res.ok) {
        throw new Error("Failed to fetch TV credits");
    }

    return res.json();
}

// Trending TV shows
export async function TrendingTVShows(): Promise<{ results: TVShow[] }> {
    const res = await fetch(`${API_URL}/trending/tv/day?language=en-US`, options);
    if (!res.ok) {
        throw new Error("Failed to fetch trending TV shows");
    }
    return res.json();
}

//Latest TV Shows
export async function LatestTVShows(): Promise<{ results: TVShow[] }> {
    const res = await fetch(`${API_URL}/tv/on_the_air`, options);
    if (!res.ok) {
        throw new Error("Failed to fetch trending TV shows");
    }
    return res.json();
}
