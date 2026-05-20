"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { useGuest } from "@/src/context/GuestContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

const GUEST_KEY = "rhino_guest_ratings";

type Vote = "like" | "dislike" | null;

interface GuestRating { id: number; type: "movie" | "tv"; rating: Vote; }

interface Props {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

function getGuestRatings(): GuestRating[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]"); }
    catch { return []; }
}

function saveGuestRatings(items: GuestRating[]) {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function LikeDislike({ id, type, title, poster_path }: Props) {
    const { data: session, status } = useSession();
    const { isGuest } = useGuest();
    const { open: openModal } = useAuthModal();
    const [vote, setVote] = useState<Vote>(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (session?.user?.email) {
            fetch(`/api/ratings?media_id=${id}&media_type=${type}`)
                .then((r) => r.ok ? r.json() : { rating: null })
                .then((d) => setVote(d?.rating ?? null))
                .catch(() => {});
        } else if (isGuest) {
            const found = getGuestRatings().find((r) => r.id === id && r.type === type);
            setVote(found?.rating ?? null);
        } else {
            setVote(null);
        }
    }, [id, type, session, status, isGuest]);

    const handleVote = async (v: Vote) => {
        if (!session?.user?.email && !isGuest) { openModal(); return; }

        const next: Vote = vote === v ? null : v;

        if (session?.user?.email) {
            setBusy(true);
            const prev = vote;
            setVote(next); // optimistic
            try {
                const res = next === null
                    ? await fetch(`/api/ratings?media_id=${id}&media_type=${type}`, { method: "DELETE" })
                    : await fetch("/api/ratings", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ media_id: id, media_type: type, title, poster_path, rating: next }),
                    });
                if (!res.ok) setVote(prev); // rollback
            } catch {
                setVote(prev); // rollback on network error
            } finally {
                setBusy(false);
            }
        } else {
            const ratings = getGuestRatings().filter((r) => !(r.id === id && r.type === type));
            if (next !== null) ratings.push({ id, type, rating: next });
            saveGuestRatings(ratings);
            setVote(next);
        }
    };

    return (
        <div className="mt-2 flex gap-2">
            <button
                onClick={() => handleVote("like")}
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-200"
                style={{
                    backgroundColor: vote === "like" ? "#16a34a" : "transparent",
                    color: vote === "like" ? "#fff" : "#16a34a",
                    border: "1px solid #16a34a",
                    opacity: vote === "dislike" ? 0.3 : busy ? 0.6 : 1,
                }}
            >
                <FaThumbsUp size={11} /> Like
            </button>
            <button
                onClick={() => handleVote("dislike")}
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-200"
                style={{
                    backgroundColor: vote === "dislike" ? "#dc2626" : "transparent",
                    color: vote === "dislike" ? "#fff" : "#dc2626",
                    border: "1px solid #dc2626",
                    opacity: vote === "like" ? 0.3 : busy ? 0.6 : 1,
                }}
            >
                <FaThumbsDown size={11} /> Dislike
            </button>
        </div>
    );
}
