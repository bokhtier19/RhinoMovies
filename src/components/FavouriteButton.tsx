"use client";

import { useState, useEffect } from "react";
import { IoMdAdd, IoMdCheckmark } from "react-icons/io";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";

interface FavouriteItem {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

const STORAGE_KEY = "rhino_favourites";

function getFavourites(): FavouriteItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
        return [];
    }
}

function saveFavourites(items: FavouriteItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface Props {
    id: number;
    type: "movie" | "tv";
    title: string;
    poster_path: string | null;
}

export function FavouriteButton({ id, type, title, poster_path }: Props) {
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        setIsFav(getFavourites().some((f) => f.id === id && f.type === type));
    }, [id, type]);

    const toggle = () => {
        const current = getFavourites();
        if (isFav) {
            saveFavourites(current.filter((f) => !(f.id === id && f.type === type)));
            setIsFav(false);
        } else {
            saveFavourites([...current, { id, type, title, poster_path }]);
            setIsFav(true);
        }
    };

    return (
        <button
            onClick={toggle}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{
                borderColor: isFav ? "#f5c518" : "var(--detail-btn-border)",
                color: isFav ? "#f5c518" : "var(--detail-btn-color)",
            }}
        >
            {isFav ? <MdFavorite size={14} /> : <MdFavoriteBorder size={14} />}
            {isFav ? "In Watchlist" : "Add to Watchlist"}
        </button>
    );
}
