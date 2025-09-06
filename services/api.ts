import { Movie, TVShow } from "@/interfaces/interface";

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

// Trending movies & shows

export async function TrendingMoviesAndShows(): Promise<{ results: (Movie | TVShow)[] }> {
    const res = await fetch(`${API_URL}/trending/all/day?language=en-US`, options);

    if (!res.ok) {
        throw new Error("Failed to fetch trending movies and shows");
    }

    return res.json();
}
