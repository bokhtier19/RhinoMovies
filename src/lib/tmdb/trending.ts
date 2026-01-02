import {tmdbFetch} from "./client";
import {Movie, TVShow} from "@/types/common";

type TrendingResponse = {
    results: (Movie | TVShow)[];
};

export function getTrendingAll() {
    return tmdbFetch<TrendingResponse>("/trending/all/day", {
        params: {
            language: "en-US"
        }
    });
}
