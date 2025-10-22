"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { ModeToggle } from "@/components/ThemeProvider";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let currentScrollPos = window.pageYOffset;

        const handleVisibility = () => {
            const newScollPos = window.pageYOffset;
            if (newScollPos > currentScrollPos && newScollPos > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
            currentScrollPos = newScollPos;
        };

        window.addEventListener("scroll", handleVisibility);
        return () => window.removeEventListener("scroll", handleVisibility);
    });

    return (
        <nav className={` sticky top-0 z-50 bg-imdb-border py-2 text-white dark:bg-gray-900 shadow-2xl ${isVisible ? "-translate-y-full" : "-translate-y-0"} transition-transform duration-300`}>
            <div className="flex justify-between items-center px-4 max-w-[90%] mx-auto">
                {/* Logo */}
                <Link href={"/"} className="flex items-center gap-2">
                    <PiFilmReelFill size={36} className="text-imdb-yellow" />
                    <h1 className="text-imdb-yellow font-bold uppercase text-lg">RhinoMovies</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 uppercase text-sm">
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/home"}>
                        Home
                    </Link>
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/movies"}>
                        Genre
                    </Link>
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/movies"}>
                        Country
                    </Link>
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/movies"}>
                        Movies
                    </Link>
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/shows"}>
                        TV Shows
                    </Link>
                    <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/topimdb"}>
                        Top IMDB
                    </Link>
                    {/* <Link className="hover:cursor-pointer hover:text-imdb-yellow" href={"/movies"}>
                        Android App
                        </Link> */}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <ModeToggle />
                    {/* Search Button */}
                    <Link href={"/movies"}>
                        <button className="flex items-center gap-1 text-imdb-black bg-imdb-white py-2 px-4 rounded-sm hover:cursor-pointer">
                            <MdSearch className="text-imdb-black" size={20} />
                            Search
                        </button>
                    </Link>

                    {/* Login Button */}
                    <button className="py-2 px-4 bg-imdb-yellow rounded-sm text-imdb-black flex items-center gap-2">
                        <CgProfile size={20} />
                        Login
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}</button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-imdb-border px-6 py-4 flex flex-col gap-4 uppercase text-sm">
                    <Link href={"/home"} onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>
                    <Link href={"/movies"} onClick={() => setMenuOpen(false)}>
                        Genre
                    </Link>
                    <Link href={"/movies"} onClick={() => setMenuOpen(false)}>
                        Country
                    </Link>
                    <Link href={"/movies"} onClick={() => setMenuOpen(false)}>
                        Movies
                    </Link>
                    <Link href={"/shows"} onClick={() => setMenuOpen(false)}>
                        TV Shows
                    </Link>
                    <Link href={"/topimdb"} onClick={() => setMenuOpen(false)}>
                        Top IMDB
                    </Link>
                    <Link href={"/movies"} onClick={() => setMenuOpen(false)}>
                        Android App
                    </Link>

                    <hr className="border-imdb-yellow/30" />

                    {/* Actions for mobile */}
                    <Link href={"/movies"} onClick={() => setMenuOpen(false)}>
                        <button className="w-full flex items-center gap-1 text-imdb-black bg-imdb-white py-2 px-4 rounded-sm">
                            <MdSearch className="text-imdb-black" size={20} />
                            Search
                        </button>
                    </Link>
                    <button className="w-full py-2 px-4 bg-imdb-yellow rounded-sm text-imdb-black flex items-center gap-2">
                        <CgProfile size={20} />
                        Login
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
