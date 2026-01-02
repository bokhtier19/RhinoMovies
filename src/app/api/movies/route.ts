import {NextResponse} from "next/server";
import {getTopRatedMovies, searchMovies} from "@/src/lib/tmdb/movies";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const query = searchParams.get("query")?.trim();

    try {
        const data = query ? await searchMovies(query, page) : await getTopRatedMovies(page);

        return NextResponse.json({
            results: data.results,
            total_pages: data.total_pages
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch movies"}, {status: 500});
    }
}
