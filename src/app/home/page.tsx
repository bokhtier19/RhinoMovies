import { Movie } from "@/src/types/movie";
import { TVShow } from "@/src/types/tv";

import { getTrendingAll } from "@/src/lib/tmdb/trending";
import { getNowPlayingMovies, getUpcomingMovies } from "@/src/lib/tmdb/movies";
import { getTrendingTVShows } from "@/src/lib/tmdb/tv";
import { CategorySection } from "@/src/components/CategorySection";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try {
        return await fn();
    } catch {
        return fallback;
    }
}

export default async function HomePage() {
    const empty = { results: [] };

    const [trendingData, latestMoviesData, latestShowsData, upcomingMoviesData] = await Promise.all([
        safe(() => getTrendingAll(), empty as { results: (Movie | TVShow)[] }),
        safe(() => getNowPlayingMovies(), empty as { results: Movie[] }),
        safe(() => getTrendingTVShows(), empty as { results: TVShow[] }),
        safe(() => getUpcomingMovies(), empty as { results: Movie[] }),
    ]);

    const trending = trendingData.results;
    const latestMovies = latestMoviesData.results;
    const latestShows = latestShowsData.results;
    const upcomingMovies = upcomingMoviesData.results;

    const hasContent =
        trending.length > 0 || latestMovies.length > 0 || latestShows.length > 0 || upcomingMovies.length > 0;

    if (!hasContent) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Failed to load content. Please try again later.
            </div>
        );
    }

    return (
        <div className="px-2 md:px-8 lg:px-16 py-8 min-h-screen flex flex-col gap-10">
            {trending.length > 0 && (
                <CategorySection title="Trending Movies & TV Shows" items={trending} showMoreHref="/" moreLabel="All Trending" />
            )}
            {latestMovies.length > 0 && (
                <CategorySection title="Latest Movies" items={latestMovies} showMoreHref="/movies" moreLabel="All Movies" />
            )}
            {latestShows.length > 0 && (
                <CategorySection title="Latest TV Shows" items={latestShows} showMoreHref="/shows" moreLabel="All TV Shows" />
            )}
            {upcomingMovies.length > 0 && (
                <CategorySection title="Upcoming Movies" items={upcomingMovies} showMoreHref="/movies" moreLabel="Upcoming" />
            )}
        </div>
    );
}
