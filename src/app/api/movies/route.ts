import {NextResponse} from "next/server";
import {getTopRatedMovies, getMoviesByGenre, getMoviesByCountry, searchMovies} from "@/src/lib/tmdb/movies";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const query = searchParams.get("query")?.trim();
    const genre = searchParams.get("genre");
    const country = searchParams.get("country");

    try {
        if (query) {
            const data = await searchMovies(query, page);
            return NextResponse.json({
                results: data.results,
                total_pages: Math.min(data.total_pages ?? 1, 500)
            });
        }

        // Fetch 2 consecutive TMDB pages to supply enough items for 5 rows
        const tmdbPage1 = page * 2 - 1;
        const tmdbPage2 = page * 2;

        const fetcher = genre
            ? (p: number) => getMoviesByGenre(Number(genre), p)
            : country
            ? (p: number) => getMoviesByCountry(country, p)
            : (p: number) => getTopRatedMovies(p);

        const [d1, d2] = await Promise.all([fetcher(tmdbPage1), fetcher(tmdbPage2)]);

        return NextResponse.json({
            results: [...d1.results, ...d2.results],
            total_pages: Math.min(Math.ceil((d1.total_pages ?? 1) / 2), 250)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch movies"}, {status: 500});
    }
}
