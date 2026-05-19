import {Movie} from "@/src/types/movie";
import {TVShow} from "@/src/types/tv";

import MovieCard from "@/src/components/MovieCard";

import {getTrendingAll} from "@/src/lib/tmdb/trending";
import {getNowPlayingMovies, getUpcomingMovies} from "@/src/lib/tmdb/movies";
import {getTrendingTVShows} from "@/src/lib/tmdb/tv";
import Title from "@/src/components/Title";

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
        safe(() => getTrendingAll(), empty as {results: (Movie | TVShow)[]}),
        safe(() => getNowPlayingMovies(), empty as {results: Movie[]}),
        safe(() => getTrendingTVShows(), empty as {results: TVShow[]}),
        safe(() => getUpcomingMovies(), empty as {results: Movie[]}),
    ]);

    const trending = trendingData.results;
    const latestMovies = latestMoviesData.results;
    const latestShows = latestShowsData.results;
    const upcomingMovies = upcomingMoviesData.results;

    const hasContent = trending.length > 0 || latestMovies.length > 0 || latestShows.length > 0 || upcomingMovies.length > 0;

    if (!hasContent) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">Failed to load content. Please try again later.</div>;
    }

    return (
        <div className="px-2 md:px-8 lg:px-16 py-8 min-h-screen flex flex-col gap-8">
            {trending.length > 0 && (
                <section>
                    <Title title="Trending Movies & TV Shows" />
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {trending.map((item) => (
                            <MovieCard key={`trending-${item.media_type}-${item.id}`} {...item} />
                        ))}
                    </div>
                </section>
            )}

            {latestMovies.length > 0 && (
                <section>
                    <Title title="Latest Movies" />
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {latestMovies.map((movie) => (
                            <MovieCard key={`latest-movie-${movie.id}`} {...movie} />
                        ))}
                    </div>
                </section>
            )}

            {latestShows.length > 0 && (
                <section>
                    <Title title="Latest TV Shows" />
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {latestShows.map((show) => (
                            <MovieCard key={`latest-show-${show.id}`} {...show} />
                        ))}
                    </div>
                </section>
            )}

            {upcomingMovies.length > 0 && (
                <section>
                    <Title title="Upcoming Movies" />
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
                        {upcomingMovies.map((movie) => (
                            <MovieCard key={`upcoming-${movie.id}`} {...movie} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
