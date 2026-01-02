"use client";

import Link from "next/link";
import {useEffect, useState, useCallback} from "react";

import {CgProfile} from "react-icons/cg";
import {MdSearch} from "react-icons/md";
import {PiFilmReelFill} from "react-icons/pi";
import {HiMenu, HiX} from "react-icons/hi";

import {ModeToggle} from "@/src/components/ThemeProvider";

/* --------------------------------
   Navigation configuration
   Single source of truth for links
--------------------------------- */
const NAV_LINKS = [
    {label: "Home", href: "/"},
    {label: "Genre", href: "/movies"},
    {label: "Country", href: "/movies"},
    {label: "Movies", href: "/movies"},
    {label: "TV Shows", href: "/shows"},
    {label: "Top IMDB", href: "/topimdb"}
];

/* --------------------------------
   Navbar Component
   - Sticky header
   - Auto-hides on scroll down
   - Responsive (desktop + mobile)
--------------------------------- */
const Navbar = () => {
    /* UI state */
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    /* --------------------------------
       Scroll behavior
       Hide navbar when user scrolls
       down to maximize content space
    --------------------------------- */
    const createScrollHandler = useCallback(() => {
        let lastScrollY = window.scrollY;

        return () => {
            const currentScrollY = window.scrollY;

            // Hide only on intentional downward scroll
            setHidden(currentScrollY > lastScrollY && currentScrollY > 100);

            lastScrollY = currentScrollY;
        };
    }, []);

    useEffect(() => {
        const onScroll = createScrollHandler();
        window.addEventListener("scroll", onScroll);

        // Cleanup prevents memory leaks
        return () => window.removeEventListener("scroll", onScroll);
    }, [createScrollHandler]);

    return (
        <nav
            className={`sticky top-0 z-50 bg-imdb-border text-white dark:bg-imdb-border shadow-2xl
            transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}>
            <div className="flex justify-between items-center px-4 py-2 max-w-[90%] mx-auto">
                {/* --------------------------------
                   Brand / Logo
                --------------------------------- */}
                <Link href="/" className="flex items-center gap-2">
                    <PiFilmReelFill size={36} className="text-imdb-yellow" />
                    <span className="text-imdb-yellow font-bold uppercase text-lg">RhinoMovies</span>
                </Link>

                {/* --------------------------------
                   Desktop Navigation
                --------------------------------- */}
                <div className="hidden md:flex gap-6 uppercase text-sm">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} href={link.href} className="hover:text-imdb-yellow transition">
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* --------------------------------
                   Desktop Actions
                --------------------------------- */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Search */}
                    <Link href="/movies" aria-label="Search">
                        <MdSearch size={25} />
                    </Link>

                    {/* Theme toggle */}
                    <ModeToggle />

                    {/* Profile */}
                    <button aria-label="Profile" className="text-imdb-yellow flex items-center">
                        <CgProfile size={25} />
                    </button>
                </div>

                {/* --------------------------------
                   Mobile Menu Toggle
                --------------------------------- */}
                <button className="md:hidden" onClick={() => setMenuOpen((prev) => !prev)} aria-label="Toggle menu">
                    {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
                </button>
            </div>

            {/* --------------------------------
               Mobile Dropdown Menu
            --------------------------------- */}
            {menuOpen && (
                <div className="md:hidden bg-imdb-border px-6 py-4 flex flex-col gap-4 uppercase text-sm">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                            {link.label}
                        </Link>
                    ))}

                    <hr className="border-imdb-yellow/30" />

                    {/* Mobile Actions */}
                    <Link href="/movies" onClick={() => setMenuOpen(false)}>
                        <button className="w-full flex items-center gap-2 bg-imdb-white text-imdb-black py-2 px-4 rounded-sm">
                            <MdSearch size={20} />
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
