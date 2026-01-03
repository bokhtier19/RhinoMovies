import {NextResponse} from "next/server";
import {tmdbFetch} from "@/src/lib/tmdb/client";

type Genre = {
    id: number;
    name: string;
};

export async function GET() {
    try {
        const data = await tmdbFetch<{genres: Genre[]}>("/genre/movie/list", {
            params: {language: "en-US"},
            next: {revalidate: 86400} // cache for 24 hours
        });

        return NextResponse.json(data.genres);
    } catch (error) {
        console.error("Failed to fetch genres", error);
        return NextResponse.json([], {status: 500});
    }
}
