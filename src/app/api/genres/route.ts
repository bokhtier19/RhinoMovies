import {NextResponse} from "next/server";
import {tmdbFetch} from "@/src/lib/tmdb/client";

export const revalidate = 86400;

type Genre = {
    id: number;
    name: string;
};

export async function GET() {
    try {
        const data = await tmdbFetch<{genres: Genre[]}>("/genre/movie/list", {
            params: {language: "en-US"},
        });

        return NextResponse.json(data.genres);
    } catch (error) {
        console.error("Failed to fetch genres", error);
        return NextResponse.json([], {status: 500});
    }
}
