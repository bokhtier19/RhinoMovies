"use client";

import Link from "next/link";
import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-imdb-black text-imdb-whites shadow-md">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                {/* Logo */}
                <Link href={"/"} className="flex items-center gap-2">
                    <PiFilmReelFill size={36} className="text-imdb-yellow" />
                    <h1 className="text-imdb-yellow font-bold uppercase text-lg">RhinoMovies</h1>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 uppercase text-sm">
                    <Link href={"/home"}>Home</Link>
                    <Link href={"/movies"}>Genre</Link>
                    <Link href={"/movies"}>Country</Link>
                    <Link href={"/movies"}>Movies</Link>
                    <Link href={"/shows"}>TV Shows</Link>
                    <Link href={"/topimdb"}>Top IMDB</Link>
                    <Link href={"/movies"}>Android App</Link>
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
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
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                    </button>
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
