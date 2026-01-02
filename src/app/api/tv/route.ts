import {NextResponse} from "next/server";
import {getTopRatedTVShows, searchTVShows} from "@/src/lib/tmdb/tv";

export async function GET(req: Request) {
    const {searchParams} = new URL(req.url);

    const rawPage = searchParams.get("page");
    const page = rawPage ? Number(rawPage) : 1;

    const query = searchParams.get("query")?.trim();

    try {
        const data = query ? await searchTVShows(query, page) : await getTopRatedTVShows(page);

        return NextResponse.json({
            results: data.results,
            total_pages: Math.min(data.total_pages ?? 0, 500)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Failed to fetch TV shows"}, {status: 500});
    }
}
