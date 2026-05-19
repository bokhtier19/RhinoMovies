import {NextResponse} from "next/server";
import {tmdbFetch} from "@/src/lib/tmdb/client";

export const revalidate = 86400;

type Country = {
    iso_3166_1: string;
    english_name: string;
};

export async function GET() {
    try {
        const data = await tmdbFetch<{results: Country[]}>("/watch/providers/regions", {
            params: {language: "en-US"},
        });

        // Normalize response
        const countries = data.results.map((c) => ({
            code: c.iso_3166_1,
            name: c.english_name
        }));

        return NextResponse.json(countries);
    } catch (error) {
        console.error("Failed to fetch countries", error);
        return NextResponse.json([], {status: 500});
    }
}
