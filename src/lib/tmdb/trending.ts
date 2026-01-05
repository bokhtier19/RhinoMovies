import { tmdbFetch } from "./client";
import { Movie } from "@/src/types/movie";
import { TVShow } from "@/src/types/tv";

type TrendingResponse = {
    results: (Movie | TVShow)[];
};

export function getTrendingAll() {
    return tmdbFetch<TrendingResponse>("/trending/all/day", {
        params: {
            language: "en-US",
        },
    });
}
