"use client";
import {useSearch} from "@/src/context/SearchContext";
import React, {useEffect, useState} from "react";
import {MdOutlineSearch} from "react-icons/md";

const Searchbar = () => {
    const {query, setQuery} = useSearch();
    const [input, setInput] = useState(query);

    useEffect(() => {
        const handler = setTimeout(() => {
            setQuery(input);
        }, 400);

        return () => clearTimeout(handler);
    }, [input, setQuery]);

    // const handleClear = () => {
    //     setQuery("");
    //     setInput("");
    // };

    const handleSearchClick = () => {
        setQuery(input);
    };

    return (
        <div className="flex items-center bg-imdb-white pl-6 border border-imdb-white/20 rounded-full w-full max-w-3xl mx-auto mt-6">
            <MdOutlineSearch className="text-imdb-border" size={20} />
            <input
                type="text"
                placeholder="Search movies, TV shows, genres, celebrities..."
                className="flex-1 pl-3 bg-transparent text-imdb-border outline-none w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button
                className="bg-imdb-yellow text-imdb-black rounded-r-full rounded-l-none px-8 py-4 hover:cursor-pointer"
                onClick={handleSearchClick} // triggers search instantly
            >
                Search
            </button>
        </div>
    );
};

export default Searchbar;
