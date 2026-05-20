"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface MediaItem {
    id: number;
    poster_path: string | null;
    vote_average: number;
    title?: string;
    name?: string;
}

interface Props {
    title: string;
    items: MediaItem[];
    mediaType: "movie" | "tv";
}

export function MediaRow({ title, items, mediaType }: Props) {
    if (!items.length) return null;

    const basePath = mediaType === "movie" ? "/movies" : "/shows";
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
    };

    return (
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 md:py-8">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest sm:mb-5" style={{ color: "var(--detail-accent)" }}>
                {title}
            </h2>

            <div className="relative">
                {/* Left scroll button — desktop only */}
                <button
                    onClick={() => scroll("left")}
                    aria-label="Scroll left"
                    className="absolute left-0 top-[40%] z-10 hidden -translate-x-3 -translate-y-1/2 sm:flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-black/85 hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                {/* Scrollable row */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto pb-2 sm:gap-4 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: "none" }}
                >
                    {items.map((item) => {
                        const label = item.title ?? item.name ?? "";
                        return (
                            <Link
                                key={item.id}
                                href={`${basePath}/${item.id}`}
                                className="group w-28 shrink-0 sm:w-36"
                            >
                                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-md ring-1 ring-white/10 transition-transform group-hover:scale-105">
                                    {item.poster_path ? (
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                                            alt={label}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 112px, 144px"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-full items-center justify-center px-2 text-center text-[9px]"
                                            style={{ backgroundColor: "var(--surface)", color: "var(--muted)" }}
                                        >
                                            No poster
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-yellow-400">
                                        ★ {item.vote_average.toFixed(1)}
                                    </div>
                                </div>
                                <p className="mt-1.5 line-clamp-2 text-[10px] leading-tight sm:text-xs" style={{ color: "var(--detail-title)" }}>
                                    {label}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Right scroll button — desktop only */}
                <button
                    onClick={() => scroll("right")}
                    aria-label="Scroll right"
                    className="absolute right-0 top-[40%] z-10 hidden translate-x-3 -translate-y-1/2 sm:flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-black/85 hover:scale-110"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
