"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { MdDelete, MdHistory, MdBookmark, MdThumbUp, MdThumbDown } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { CopyCardButton } from "@/src/components/CopyCardButton";

const KEYS = {
    watchlist: "rhino_guest_watchlist",
    ratings: "rhino_guest_ratings",
    history: "rhino_guest_history",
};

interface MediaItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
    rating?: "like" | "dislike";
    viewed_at?: string;
}

type Tab = "watchlist" | "ratings" | "history";

function load(key: string): MediaItem[] {
    try { return JSON.parse(localStorage.getItem(key) ?? "[]"); }
    catch { return []; }
}

function MediaCard({ item, onRemove, showRating }: { item: MediaItem; onRemove?: () => void; showRating?: boolean }) {
    const href = `/${item.type === "movie" ? "movies" : "shows"}/${item.id}`;
    const posterUrl = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : null;

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
                <div className="mt-2 flex items-center gap-1">
                    <CopyCardButton id={item.id} mediaType={item.type} title={item.title} />
                    {onRemove && (
                        <button onClick={onRemove} className="ml-auto rounded p-1 text-gray-500 transition-colors hover:text-red-400" title="Remove">
                            <MdDelete size={14} />
                        </button>
                    )}
                </div>
            </div>
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

export function GuestProfile({ defaultTab }: { defaultTab?: string }) {
    const [tab, setTab] = useState<Tab>(
        defaultTab === "ratings" ? "ratings" : defaultTab === "history" ? "history" : "watchlist"
    );
    const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
    const [ratings, setRatings] = useState<MediaItem[]>([]);
    const [history, setHistory] = useState<MediaItem[]>([]);

    useEffect(() => {
        setWatchlist(load(KEYS.watchlist));
        setRatings(load(KEYS.ratings));
        setHistory(load(KEYS.history));
    }, []);

    const removeFromWatchlist = (item: MediaItem) => {
        const next = watchlist.filter((w) => !(w.id === item.id && w.type === item.type));
        localStorage.setItem(KEYS.watchlist, JSON.stringify(next));
        setWatchlist(next);
    };

    const removeRating = (item: MediaItem) => {
        const next = ratings.filter((r) => !(r.id === item.id && r.type === item.type));
        localStorage.setItem(KEYS.ratings, JSON.stringify(next));
        setRatings(next);
    };

    const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { key: "watchlist", label: "Watchlist", icon: <MdBookmark size={16} />, count: watchlist.length },
        { key: "ratings", label: "Ratings", icon: <MdThumbUp size={16} />, count: ratings.length },
        { key: "history", label: "History", icon: <MdHistory size={16} />, count: history.length },
    ];

    return (
        <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
            <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">

                {/* Guest header */}
                <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: "var(--surface)" }}>
                        <CgProfile size={36} style={{ color: "var(--muted)" }} />
                    </div>
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>Guest</h1>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>Browsing locally — data saved in this browser</p>
                        <div className="mt-2 flex flex-wrap justify-center gap-4 text-sm sm:justify-start" style={{ color: "var(--muted)" }}>
                            <span><strong style={{ color: "var(--foreground)" }}>{watchlist.length}</strong> saved</span>
                            <span><strong style={{ color: "var(--foreground)" }}>{ratings.length}</strong> rated</span>
                            <span><strong style={{ color: "var(--foreground)" }}>{history.length}</strong> watched</span>
                        </div>
                    </div>
                    <button
                        onClick={() => signIn("google")}
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90 sm:ml-auto"
                        style={{ backgroundColor: "#f5c518" }}
                    >
                        Sign in to sync
                    </button>
                </div>

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

                {tab === "watchlist" && (
                    watchlist.length === 0 ? (
                        <Empty message="Your watchlist is empty." cta="Browse movies" href="/movies" />
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                            {watchlist.map((item) => (
                                <MediaCard key={`${item.id}-${item.type}`} item={item} onRemove={() => removeFromWatchlist(item)} />
                            ))}
                        </div>
                    )
                )}

                {tab === "ratings" && (
                    ratings.length === 0 ? (
                        <Empty message="You haven't rated anything yet." cta="Browse movies" href="/movies" />
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                            {ratings.map((item) => (
                                <MediaCard key={`${item.id}-${item.type}`} item={item} showRating onRemove={() => removeRating(item)} />
                            ))}
                        </div>
                    )
                )}

                {tab === "history" && (
                    history.length === 0 ? (
                        <Empty message="No watch history yet." cta="Start browsing" href="/" />
                    ) : (
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                            {history.map((item) => (
                                <MediaCard key={`${item.id}-${item.type}`} item={item} />
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
