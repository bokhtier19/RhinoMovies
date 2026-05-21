import {NextResponse} from "next/server";
import {
    getTopRatedMovies, searchMovies, getTrendingMovies,
    getUpcomingMovies, getNowPlayingMovies, discoverMoviesFiltered
} from "@/src/lib/tmdb/movies";

const SORT_MAP: Record<string, string> = {
    popularity: "popularity",
    revenue:    "revenue",
    budget:     "budget",
    rating:     "vote_average",
    date:       "primary_release_date",
    name:       "original_title",
};

function buildSortBy(sort: string, order: string) {
    const field = SORT_MAP[sort] ?? "popularity";
    const dir = order === "asc" ? "asc" : "desc";
    return `${field}.${dir}`;
}

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);

    const page     = Number(searchParams.get("page") ?? 1);
    const query    = searchParams.get("query")?.trim();
    const genre    = searchParams.get("genre") ?? undefined;
    const country  = searchParams.get("country") ?? undefined;
    const year     = searchParams.get("year") ?? undefined;
    const sort     = searchParams.get("sort") ?? undefined;
    const order    = searchParams.get("order") ?? "desc";
    const category = searchParams.get("category");

    const useDiscover = !!(genre || country || year || sort);

    try {
        if (query) {
            const data = await searchMovies(query, page);
            return NextResponse.json({
                results: data.results,
                total_pages: Math.min(data.total_pages ?? 1, 500),
            });
        }

        const tmdbPage1 = page * 2 - 1;
        const tmdbPage2 = page * 2;

        if (useDiscover) {
            const sortBy = buildSortBy(sort ?? "popularity", order);
            const [d1, d2] = await Promise.all([
                discoverMoviesFiltered({ genres: genre, country, year, sortBy, page: tmdbPage1 }),
                discoverMoviesFiltered({ genres: genre, country, year, sortBy, page: tmdbPage2 }),
            ]);
            return NextResponse.json({
                results: [...d1.results, ...d2.results],
                total_pages: Math.min(Math.ceil((d1.total_pages ?? 1) / 2), 250),
            });
        }

        const fetcher =
            category === "trending" ? (p: number) => getTrendingMovies(p) :
            category === "upcoming" ? (p: number) => getUpcomingMovies(p) :
            category === "latest"   ? (p: number) => getNowPlayingMovies(p) :
                                      (p: number) => getTopRatedMovies(p);

        const [d1, d2] = await Promise.all([fetcher(tmdbPage1), fetcher(tmdbPage2)]);
        return NextResponse.json({
            results: [...d1.results, ...d2.results],
            total_pages: Math.min(Math.ceil((d1.total_pages ?? 1) / 2), 250),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch movies"}, {status: 500});
    }
}
