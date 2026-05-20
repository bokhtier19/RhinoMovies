"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useGuest } from "@/src/context/GuestContext";
import { useAuthModal } from "@/src/context/AuthModalContext";

const GUEST_KEY = "rhino_guest_watchlist";

interface WatchlistItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

interface Props {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

function getGuestList(): WatchlistItem[] {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]"); }
    catch { return []; }
}

function saveGuestList(items: WatchlistItem[]) {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

export function FavouriteButton({ id, type, title, poster_path }: Props) {
    const { data: session, status } = useSession();
    const { isGuest } = useGuest();
    const { open: openModal } = useAuthModal();
    const [isFav, setIsFav] = useState(false);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (status === "loading") return;
        if (session?.user?.email) {
            fetch(`/api/watchlist?media_id=${id}&media_type=${type}`)
                .then((r) => r.ok ? r.json() : { exists: false })
                .then((d) => setIsFav(!!d?.exists))
                .catch(() => {});
        } else if (isGuest) {
            setIsFav(getGuestList().some((f) => f.id === id && f.type === type));
        } else {
            setIsFav(false);
        }
    }, [id, type, session, status, isGuest]);

    const toggle = async () => {
        if (!session?.user?.email && !isGuest) { openModal(); return; }

        if (session?.user?.email) {
            setBusy(true);
            const prev = isFav;
            setIsFav(!prev); // optimistic
            try {
                const res = isFav
                    ? await fetch(`/api/watchlist?media_id=${id}&media_type=${type}`, { method: "DELETE" })
                    : await fetch("/api/watchlist", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ media_id: id, media_type: type, title, poster_path }),
                    });
                if (!res.ok) setIsFav(prev); // rollback on failure
            } catch {
                setIsFav(prev); // rollback on network error
            } finally {
                setBusy(false);
            }
        } else {
            const list = getGuestList();
            if (isFav) {
                saveGuestList(list.filter((f) => !(f.id === id && f.type === type)));
            } else {
                saveGuestList([...list, { id, type, title, poster_path }]);
            }
            setIsFav((v) => !v);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={busy}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{
                borderColor: isFav ? "#f5c518" : "var(--detail-btn-border)",
                color: isFav ? "#f5c518" : "var(--detail-btn-color)",
                opacity: busy ? 0.6 : 1,
            }}
        >
            {isFav ? <MdFavorite size={14} /> : <MdFavoriteBorder size={14} />}
            {isFav ? "In Watchlist" : "Add to Watchlist"}
        </button>
    );
}
