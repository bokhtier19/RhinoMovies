"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGuest } from "@/src/context/GuestContext";

const GUEST_KEY = "rhino_guest_history";

interface HistoryItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
    viewed_at: string;
}

interface Props {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

export function HistoryTracker({ id, type, title, poster_path }: Props) {
    const { data: session } = useSession();
    const { isGuest } = useGuest();

    useEffect(() => {
        if (session?.user?.email) {
            fetch("/api/history", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ media_id: id, media_type: type, title, poster_path }),
            }).catch(() => {});
        } else if (isGuest) {
            try {
                const existing: HistoryItem[] = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
                const filtered = existing.filter((h) => !(h.id === id && h.type === type));
                localStorage.setItem(
                    GUEST_KEY,
                    JSON.stringify(
                        [{ id, type, title, poster_path, viewed_at: new Date().toISOString() }, ...filtered].slice(0, 50),
                    ),
                );
            } catch {
                /* localStorage unavailable */
            }
        }
    }, [id, type, title, poster_path, session, isGuest]);

    return null;
}
