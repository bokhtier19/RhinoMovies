import {NextResponse} from "next/server";
import {getTopRatedTVShows, searchTVShows} from "@/src/lib/tmdb/tv";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const query = searchParams.get("query")?.trim();

    try {
        if (query) {
            const data = await searchTVShows(query, page);
            return NextResponse.json({
                results: data.results,
                total_pages: Math.min(data.total_pages ?? 0, 500)
            });
        }

        // Fetch 2 consecutive TMDB pages to supply enough items for 5 rows
        const tmdbPage1 = page * 2 - 1;
        const tmdbPage2 = page * 2;

        const [d1, d2] = await Promise.all([
            getTopRatedTVShows(tmdbPage1),
            getTopRatedTVShows(tmdbPage2)
        ]);

        return NextResponse.json({
            results: [...d1.results, ...d2.results],
            total_pages: Math.min(Math.ceil((d1.total_pages ?? 0) / 2), 250)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch TV shows"}, {status: 500});
    }
}
