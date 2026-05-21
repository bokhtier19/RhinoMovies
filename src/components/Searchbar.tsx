"use client";
import { useSearch } from "@/src/context/SearchContext";
import React, { useEffect, useState } from "react";
import { MdOutlineSearch, MdTune } from "react-icons/md";

interface SearchbarProps {
    inline?: boolean;
    onFilterClick?: () => void;
    hasActiveFilter?: boolean;
}

const Searchbar = ({ inline = false, onFilterClick, hasActiveFilter = false }: SearchbarProps) => {
    const { query, setQuery } = useSearch();
    const [input, setInput] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => setQuery(input), 400);
        return () => clearTimeout(handler);
    }, [input, setQuery]);

    const handleSearchClick = () => setQuery(input);

    return (
        <div
            className={`flex items-center pl-6 rounded-full w-full${!inline ? " max-w-3xl mx-auto mt-6" : ""}`}
            style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
        >
            <MdOutlineSearch style={{ color: "var(--muted)" }} size={20} />
            <input
                type="text"
                placeholder="Search movies, TV shows, genres, celebrities..."
                className="flex-1 pl-3 bg-transparent outline-none w-full"
                style={{ color: "var(--foreground)" }}
                value={input}
                onChange={e => setInput(e.target.value)}
            />
            {onFilterClick && (
                <button
                    onClick={onFilterClick}
                    className="flex items-center justify-center px-3 py-4 transition-colors hover:opacity-80"
                    style={{
                        borderLeft: "1px solid var(--border)",
                        color: hasActiveFilter ? "#f5c518" : "var(--muted)",
                    }}
                    title="Advanced Filters"
                >
                    <MdTune size={20} />
                </button>
            )}
            <button
                className="bg-imdb-yellow text-imdb-black rounded-r-full rounded-l-none px-8 py-4 hover:cursor-pointer hover:opacity-90"
                onClick={handleSearchClick}
            >
                Search
            </button>
        </div>
    );
};

export default Searchbar;
