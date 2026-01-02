import {Movie} from "@/src/types/movie";
import {TVShow} from "@/src/types/tv";

import MovieCard from "@/src/components/MovieCard";

import {getTrendingAll} from "@/src/lib/tmdb/trending";
import {getNowPlayingMovies, getUpcomingMovies} from "@/src/lib/tmdb/movies";
import {getTrendingTVShows} from "@/src/lib/tmdb/tv";
import Title from "@/src/components/Title";

export default async function HomePage() {
    let trending: (Movie | TVShow)[] = [];
    let latestMovies: Movie[] = [];
    let latestShows: TVShow[] = [];
    let upcomingMovies: Movie[] = [];

    try {
        const [trendingData, latestMoviesData, latestShowsData, upcomingMoviesData] = await Promise.all([getTrendingAll(), getNowPlayingMovies(), getTrendingTVShows(), getUpcomingMovies()]);

        trending = trendingData.results;
        latestMovies = latestMoviesData.results;
        latestShows = latestShowsData.results;
        upcomingMovies = upcomingMoviesData.results;
    } catch (error) {
        console.error(error);
        return <div className="flex items-center justify-center min-h-screen text-red-500">Failed to load content. Please try again later.</div>;
    }

    return (
        <div className="px-2 md:px-8 lg:px-16 py-8 min-h-screen flex flex-col gap-8">
            {/* Trending */}
            {trending.length > 0 && (
                <section>
                    <Title title="Trending Movies & TV Shows" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                        {trending.map((item) => (
                            <MovieCard key={`trending-${item.media_type}-${item.id}`} {...item} />
                        ))}
                    </div>
                </section>
            )}

            {/* Latest Movies */}
            {latestMovies.length > 0 && (
                <section>
                    <Title title="Latest Movies" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                        {latestMovies.map((movie) => (
                            <MovieCard key={`latest-movie-${movie.id}`} {...movie} />
                        ))}
                    </div>
                </section>
            )}

            {/* Latest TV Shows */}
            {latestShows.length > 0 && (
                <section>
                    <Title title="Latest TV Shows" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                        {latestShows.map((show) => (
                            <MovieCard key={`latest-show-${show.id}`} {...show} />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Movies */}
            {upcomingMovies.length > 0 && (
                <section>
                    <Title title="Upcoming Movies" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                        {upcomingMovies.map((movie) => (
                            <MovieCard key={`upcoming-${movie.id}`} {...movie} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
