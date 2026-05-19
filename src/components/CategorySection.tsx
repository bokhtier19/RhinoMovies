"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import MovieCard from "@/src/components/MovieCard";

interface Item {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    release_date?: string;
    first_air_date?: string;
    media_type?: "movie" | "tv";
    backdrop_path?: string | null;
    vote_average?: number;
}

interface Props {
    title: string;
    items: Item[];
    showMoreHref: string;
    moreLabel: string;
}

const CARD_MIN_WIDTH = 160;
const GAP = 16;

export function CategorySection({ title, items, showMoreHref, moreLabel }: Props) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState(7);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const recalc = () => {
            const cols = Math.max(2, Math.floor((el.offsetWidth + GAP) / (CARD_MIN_WIDTH + GAP)));
            setCols(cols);
        };

        recalc();
        const ro = new ResizeObserver(recalc);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Rows scale with column count: fewer cols = more rows (mobile gets 4, desktop gets 2)
    const rows = cols <= 2 ? 4 : cols <= 4 ? 3 : 2;
    const displayItems = items.slice(0, cols * rows - 1);

    return (
        <section>
            {/* Section header */}
            <div className="flex items-center justify-between my-4">
                <Link
                    href={showMoreHref}
                    className="text-lg font-bold uppercase tracking-wider transition-opacity hover:opacity-75"
                    style={{ color: "#f5c518" }}
                >
                    {title}
                </Link>
                <Link
                    href={showMoreHref}
                    className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-75"
                    style={{ color: "#f5c518" }}
                >
                    {moreLabel}
                    <HiArrowRight size={16} />
                </Link>
            </div>
            <div
                ref={gridRef}
                className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4"
            >
                {displayItems.map((item) => (
                    <MovieCard key={`${item.media_type ?? "item"}-${item.id}`} {...item} />
                ))}

                {/* Show More card — occupies the last slot of row 2 */}
                <Link href={showMoreHref} className="block">
                    <div
                        className="flex w-full flex-col items-center justify-center gap-3 rounded-sm hover:scale-105 transition-all"
                        style={{ backgroundColor: "var(--card)", minHeight: "310px", height: "100%" }}
                    >
                        <div
                            className="flex h-14 w-14 items-center justify-center rounded-full transition-transform"
                            style={{ backgroundColor: "rgba(245,197,24,0.12)" }}
                        >
                            <HiArrowRight size={26} style={{ color: "#f5c518" }} />
                        </div>
                        <span
                            className="text-xs font-semibold uppercase tracking-widest text-center px-4"
                            style={{ color: "var(--muted)" }}
                        >
                            {moreLabel}
                        </span>
                    </div>
                </Link>
            </div>
        </section>
    );
}
