"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdDelete, MdHistory, MdBookmark, MdThumbUp, MdThumbDown } from "react-icons/md";
import { CopyCardButton } from "@/src/components/CopyCardButton";

interface MediaItem {
    id: string;
    media_id: number;
    media_type: "movie" | "tv";
    title: string;
    poster_path: string | null;
    created_at?: string;
    viewed_at?: string;
    rating?: "like" | "dislike";
}

interface Props {
    watchlist: MediaItem[];
    ratings: MediaItem[];
    history: MediaItem[];
    defaultTab?: string;
}

type Tab = "watchlist" | "ratings" | "history";

function MediaCard({ item, onRemove, showRating }: { item: MediaItem; onRemove?: () => void; showRating?: boolean }) {
    const href = `/${item.media_type === "movie" ? "movies" : "shows"}/${item.media_id}`;
    const posterUrl = item.poster_path
        ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
        : null;

    return (
        <div className="group relative flex flex-col rounded-xl overflow-hidden shadow-md transition-transform hover:-translate-y-1" style={{ backgroundColor: "var(--card)" }}>
            <Link href={href}>
                {posterUrl ? (
                    <Image src={posterUrl} alt={item.title} width={200} height={300} className="w-full object-cover aspect-[2/3]" />
                ) : (
                    <div className="flex w-full aspect-[2/3] items-center justify-center text-xs text-center px-2" style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}>
                        No poster
                    </div>
                )}
            </Link>
            <div className="p-2.5">
                <Link href={href} className="block text-xs font-semibold leading-snug hover:text-[#f5c518] transition-colors line-clamp-2" style={{ color: "var(--foreground)" }}>
                    {item.title}
                </Link>
                {showRating && item.rating && (
                    <span className={`mt-1 flex items-center gap-1 text-xs font-medium ${item.rating === "like" ? "text-green-500" : "text-red-500"}`}>
                        {item.rating === "like" ? <MdThumbUp size={11} /> : <MdThumbDown size={11} />}
                        {item.rating === "like" ? "Liked" : "Disliked"}
                    </span>
                )}
                <div className="mt-2 flex gap-1">
                    <CopyCardButton
                        id={item.media_id}
                        mediaType={item.media_type}
                        title={item.title}
                        year=""
                        rating={0}
                        genres={[]}
                        overview=""
                    />
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="ml-auto rounded p-1 text-gray-500 transition-colors hover:text-red-400"
                            title="Remove"
                        >
                            <MdDelete size={14} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function ProfileTabs({ watchlist: initialWatchlist, ratings: initialRatings, history, defaultTab }: Props) {
    const [tab, setTab] = useState<Tab>(
        defaultTab === "ratings" ? "ratings" : defaultTab === "history" ? "history" : "watchlist"
    );
    const [watchlist, setWatchlist] = useState(initialWatchlist);
    const [ratings, setRatings] = useState(initialRatings);

    const removeFromWatchlist = async (item: MediaItem) => {
        const prev = watchlist;
        setWatchlist((w) => w.filter((x) => x.id !== item.id)); // optimistic
        const res = await fetch(`/api/watchlist?media_id=${item.media_id}&media_type=${item.media_type}`, { method: "DELETE" });
        if (!res.ok) setWatchlist(prev); // rollback
    };

    const removeRating = async (item: MediaItem) => {
        const prev = ratings;
        setRatings((r) => r.filter((x) => x.id !== item.id)); // optimistic
        const res = await fetch(`/api/ratings?media_id=${item.media_id}&media_type=${item.media_type}`, { method: "DELETE" });
        if (!res.ok) setRatings(prev); // rollback
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { key: "watchlist", label: "Watchlist", icon: <MdBookmark size={16} />, count: watchlist.length },
        { key: "ratings", label: "Ratings", icon: <MdThumbUp size={16} />, count: ratings.length },
        { key: "history", label: "History", icon: <MdHistory size={16} />, count: history.length },
    ];

    return (
        <div>
            {/* Tab bar */}
            <div className="mb-6 flex gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--surface)" }}>
                {tabs.map(({ key, label, icon, count }) => (
                    <button
                        key={key}
                        onClick={() => setTab(key)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all"
                        style={{
                            backgroundColor: tab === key ? "#f5c518" : "transparent",
                            color: tab === key ? "#000" : "var(--muted)",
                        }}
                    >
                        {icon}
                        <span className="hidden sm:inline">{label}</span>
                        <span className="rounded-full px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: tab === key ? "rgba(0,0,0,0.15)" : "var(--card)" }}>
                            {count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Watchlist */}
            {tab === "watchlist" && (
                watchlist.length === 0 ? (
                    <Empty message="Your watchlist is empty." cta="Browse movies" href="/movies" />
                ) : (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                        {watchlist.map((item) => (
                            <MediaCard key={item.id} item={item} onRemove={() => removeFromWatchlist(item)} />
                        ))}
                    </div>
                )
            )}

            {/* Ratings */}
            {tab === "ratings" && (
                ratings.length === 0 ? (
                    <Empty message="You haven't rated anything yet." cta="Browse movies" href="/movies" />
                ) : (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                        {ratings.map((item) => (
                            <MediaCard key={item.id} item={item} showRating onRemove={() => removeRating(item)} />
                        ))}
                    </div>
                )
            )}

            {/* History */}
            {tab === "history" && (
                history.length === 0 ? (
                    <Empty message="No watch history yet." cta="Start browsing" href="/" />
                ) : (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                        {history.map((item) => (
                            <MediaCard key={item.id} item={item} />
                        ))}
                    </div>
                )
            )}
        </div>
    );
}

function Empty({ message, cta, href }: { message: string; cta: string; href: string }) {
    return (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
            <p className="text-lg font-medium" style={{ color: "var(--muted)" }}>{message}</p>
            <Link href={href} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-80" style={{ backgroundColor: "#f5c518" }}>
                {cta}
            </Link>
        </div>
    );
}
