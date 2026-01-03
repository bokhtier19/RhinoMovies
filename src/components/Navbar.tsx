"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

import { CgProfile } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";

import { ModeToggle } from "@/src/components/ThemeProvider";

/* --------------------------------
   Types
--------------------------------- */
type Genre = {
    id: number;
    name: string;
};

type Country = {
    code: string;
    name: string;
};

/* --------------------------------
   Navbar Component
--------------------------------- */
export default function Navbar() {
    /* UI state */
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    /* Data state */
    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    /* --------------------------------
       Fetch genres & countries once
    --------------------------------- */
    useEffect(() => {
        fetch("/api/genres")
            .then((res) => res.json())
            .then(setGenres)
            .catch(() => setGenres([]));

        fetch("/api/countries")
            .then((res) => res.json())
            .then(setCountries)
            .catch(() => setCountries([]));
    }, []);

    /* --------------------------------
       Hide navbar on scroll down
    --------------------------------- */
    const createScrollHandler = useCallback(() => {
        let lastScrollY = window.scrollY;

        return () => {
            const currentScrollY = window.scrollY;
            setHidden(currentScrollY > lastScrollY && currentScrollY > 100);
            lastScrollY = currentScrollY;
        };
    }, []);

    useEffect(() => {
        const onScroll = createScrollHandler();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [createScrollHandler]);

    return (
        <nav
            className={`bg-imdb-border sticky top-0 z-50 text-white shadow-2xl transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            <div className="mx-auto flex max-w-[92%] items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <PiFilmReelFill size={34} className="text-imdb-yellow" />
                    <span className="text-imdb-yellow text-lg font-bold uppercase">RhinoMovies</span>
                </Link>

                {/* --------------------------------
                   Desktop Navigation
                --------------------------------- */}
                <div className="hidden gap-8 text-sm md:flex">
                    <Link href="/" className="hover:text-imdb-yellow uppercase">
                        Home
                    </Link>

                    {/*_____________________________
                     GENRE MEGA MENU
                     ______________________________*/}

                    <div className="group relative">
                        {/* Trigger */}
                        <span className="hover:text-imdb-yellow cursor-pointer uppercase">Genre</span>

                        {/* Hover bridge */}
                        <div className="absolute top-full right-0 left-0 h-6" />

                        {/* Dropdown */}
                        <div className="invisible absolute top-[calc(100%+1.5rem)] left-1/2 z-50 w-[720px] -translate-x-1/2 rounded-xl bg-[#2b2b2b]/95 p-6 text-gray-200 opacity-0 shadow-2xl transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                            <ul className="grid grid-cols-4 gap-x-8 gap-y-2 text-sm">
                                {genres.map((genre) => (
                                    <li key={genre.id}>
                                        <Link
                                            href={`/movies?genre=${genre.id}`}
                                            className="hover:text-imdb-yellow transition"
                                        >
                                            {genre.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* COUNTRY MEGA MENU */}
                    <div className="group relative">
                        {/* Trigger */}
                        <span className="hover:text-imdb-yellow cursor-pointer uppercase">Country</span>

                        {/* Invisible hover bridge (VERY IMPORTANT) */}
                        <div className="absolute top-full right-0 left-0 h-6" />

                        {/* Dropdown */}
                        <div className="invisible absolute top-[calc(100%+1.5rem)] left-1/2 z-50 w-[720px] -translate-x-1/2 rounded-xl bg-[#2b2b2b]/95 p-6 text-gray-200 opacity-0 shadow-2xl transition-opacity duration-200 group-hover:visible group-hover:opacity-100">
                            <ul className="grid max-h-[320px] grid-cols-4 gap-x-8 gap-y-2 overflow-y-auto text-sm">
                                {countries.map((country) => (
                                    <li key={country.code}>
                                        <Link
                                            href={`/movies?country=${country.code}`}
                                            className="hover:text-imdb-yellow transition"
                                        >
                                            {country.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Link href="/movies" className="hover:text-imdb-yellow uppercase">
                        Movies
                    </Link>

                    <Link href="/shows" className="hover:text-imdb-yellow uppercase">
                        TV Shows
                    </Link>

                    <Link href="/topimdb" className="hover:text-imdb-yellow uppercase">
                        Top IMDB
                    </Link>
                </div>

                {/* --------------------------------
                   Desktop Actions
                --------------------------------- */}
                <div className="hidden items-center gap-4 md:flex">
                    <Link href="/movies" aria-label="Search">
                        <MdSearch size={22} />
                    </Link>

                    <ModeToggle />

                    <button aria-label="Profile" className="text-imdb-yellow">
                        <CgProfile size={22} />
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setMenuOpen((prev) => !prev)}>
                    {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
            </div>

            {/* --------------------------------
               Mobile Menu (simple links)
            --------------------------------- */}
            {menuOpen && (
                <div className="flex flex-col gap-4 bg-black px-6 py-4 text-sm uppercase md:hidden">
                    <Link href="/" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href="/movies" onClick={() => setMenuOpen(false)}>
                        Movies
                    </Link>
                    <Link href="/shows" onClick={() => setMenuOpen(false)}>
                        TV Shows
                    </Link>
                    <Link href="/topimdb" onClick={() => setMenuOpen(false)}>
                        Top IMDB
                    </Link>

                    <hr className="border-imdb-yellow/30" />

                    <Link href="/movies" onClick={() => setMenuOpen(false)}>
                        <button className="flex w-full items-center gap-2 rounded-sm bg-white px-4 py-2 text-black">
                            <MdSearch size={18} />
                            Search
                        </button>
                    </Link>

                    <button className="bg-imdb-yellow flex w-full items-center gap-2 rounded-sm px-4 py-2 text-black">
                        <CgProfile size={18} />
                        Login
                    </button>
                </div>
            )}
        </nav>
    );
}
