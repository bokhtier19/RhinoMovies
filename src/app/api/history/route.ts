import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { createSupabaseClient } from "@/src/lib/supabase";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = createSupabaseClient();
    const { data, error } = await db
        .from("watch_history")
        .select("*")
        .eq("user_email", session.user.email)
        .order("viewed_at", { ascending: false })
        .limit(100);

    if (error) return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
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

    const { media_id, media_type, title, poster_path } = body as Record<string, unknown>;

    const id = Number(media_id);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid media_id" }, { status: 400 });
    if (media_type !== "movie" && media_type !== "tv") return NextResponse.json({ error: "Invalid media_type" }, { status: 400 });
    if (!title || typeof title !== "string") return NextResponse.json({ error: "title is required" }, { status: 400 });

    const db = createSupabaseClient();
    // Atomic upsert: update viewed_at if already exists, insert if not
    const { error } = await db.from("watch_history").upsert(
        {
            user_email: session.user.email,
            media_id: id,
            media_type,
            title: title.slice(0, 500),
            poster_path: typeof poster_path === "string" ? poster_path : null,
            viewed_at: new Date().toISOString(),
        },
        { onConflict: "user_email,media_id,media_type" },
    );

    if (error) return NextResponse.json({ error: "Failed to record history" }, { status: 500 });
    return NextResponse.json({ success: true });
}
