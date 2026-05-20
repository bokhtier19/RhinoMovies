import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { createSupabaseClient } from "@/src/lib/supabase";

const VALID_RATINGS = ["like", "dislike"] as const;
type RatingValue = (typeof VALID_RATINGS)[number];

function validateMediaParams(media_id: string | null, media_type: string | null) {
    const id = Number(media_id);
    if (!media_id || !Number.isInteger(id) || id <= 0) {
        return { error: "Invalid media_id" } as const;
    }
    if (media_type !== "movie" && media_type !== "tv") {
        return { error: "media_type must be 'movie' or 'tv'" } as const;
    }
    return { id, type: media_type } as const;
}

export async function GET(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const media_id = searchParams.get("media_id");
    const media_type = searchParams.get("media_type");

    const db = createSupabaseClient();

    if (media_id || media_type) {
        const validated = validateMediaParams(media_id, media_type);
        if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

        const { data } = await db
            .from("ratings")
            .select("rating")
            .eq("user_email", session.user.email)
            .eq("media_id", validated.id)
            .eq("media_type", validated.type)
            .maybeSingle();
        return NextResponse.json({ rating: data?.rating ?? null });
    }

    const { data, error } = await db
        .from("ratings")
        .select("*")
        .eq("user_email", session.user.email)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
    return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { media_id, media_type, title, poster_path, rating } = body as Record<string, unknown>;
    const validated = validateMediaParams(String(media_id ?? ""), String(media_type ?? ""));
    if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 });
    if (!title || typeof title !== "string") return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (!VALID_RATINGS.includes(rating as RatingValue)) {
        return NextResponse.json({ error: "rating must be 'like' or 'dislike'" }, { status: 400 });
    }

    const db = createSupabaseClient();
    const { error } = await db.from("ratings").upsert({
        user_email: session.user.email,
        media_id: validated.id,
        media_type: validated.type,
        title: title.slice(0, 500),
        poster_path: typeof poster_path === "string" ? poster_path : null,
        rating,
    });

    if (error) return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
    return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const validated = validateMediaParams(searchParams.get("media_id"), searchParams.get("media_type"));
    if ("error" in validated) return NextResponse.json({ error: validated.error }, { status: 400 });

    const db = createSupabaseClient();
    const { error } = await db
        .from("ratings")
        .delete()
        .eq("user_email", session.user.email)
        .eq("media_id", validated.id)
        .eq("media_type", validated.type);

    if (error) return NextResponse.json({ error: "Failed to remove rating" }, { status: 500 });
    return NextResponse.json({ success: true });
}
