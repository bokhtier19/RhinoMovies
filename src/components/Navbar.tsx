"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

import { CgProfile } from "react-icons/cg";
import { MdSearch } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";
import { MdKeyboardArrowDown } from "react-icons/md";

import { ModeToggle } from "@/src/components/ThemeProvider";

const BRAND_BG = "#111111";
const BRAND_ACCENT = "#f5c518";
const DROPDOWN_BG = "#1a1a1a";
const DROPDOWN_BORDER = "#2a2a2a";

type Genre = { id: number; name: string };
type Country = { code: string; name: string };

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    const pathname = usePathname();
    const active = pathname === href;
    return (
        <Link
            href={href}
            className="relative px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-200"
            style={{ color: active ? BRAND_ACCENT : "#d1d1d1" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = active ? BRAND_ACCENT : "#d1d1d1")}
        >
            {children}
            {active && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ backgroundColor: BRAND_ACCENT }} />
            )}
        </Link>
    );
}

function MegaMenu({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="group relative">
            <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors duration-200"
                style={{ color: "#d1d1d1" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_ACCENT)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#d1d1d1")}
            >
                {label}
                <MdKeyboardArrowDown size={16} className="transition-transform duration-200 group-hover:rotate-180" />
            </button>

            {/* Hover bridge */}
            <div className="absolute top-full left-0 right-0 h-3" />

            {/* Dropdown panel */}
            <div
                className="invisible absolute top-[calc(100%+0.75rem)] left-1/2 z-50 w-[700px] -translate-x-1/2 rounded-xl opacity-0 shadow-2xl transition-all duration-200 group-hover:visible group-hover:opacity-100"
                style={{
                    backgroundColor: DROPDOWN_BG,
                    border: `1px solid ${DROPDOWN_BORDER}`,
                    borderTop: `2px solid ${BRAND_ACCENT}`,
                }}
            >
                {children}
            </div>
        </div>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    useEffect(() => {
        fetch("/api/genres")
            .then((r) => r.json())
            .then(setGenres)
            .catch(() => setGenres([]));
        fetch("/api/countries")
            .then((r) => r.json())
            .then(setCountries)
            .catch(() => setCountries([]));
    }, []);

    const createScrollHandler = useCallback(() => {
        let lastScrollY = window.scrollY;
        return () => {
            const y = window.scrollY;
            setHidden(y > lastScrollY && y > 100);
            lastScrollY = y;
        };
    }, []);

    useEffect(() => {
        const onScroll = createScrollHandler();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [createScrollHandler]);

    return (
        <nav
            className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
            style={{ backgroundColor: BRAND_BG, boxShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
        >
            {/* Main bar */}
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                    <PiFilmReelFill size={30} style={{ color: BRAND_ACCENT }} />
                    <span className="text-lg font-extrabold uppercase tracking-wider">
                        <span style={{ color: BRAND_ACCENT }}>Rhino</span>
                        <span className="text-white">Movies</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden items-center md:flex">
                    <NavLink href="/">Home</NavLink>

                    <MegaMenu label="Genre">
                        <div className="p-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: BRAND_ACCENT }}>
                                Browse by Genre
                            </p>
                            <ul className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-300">
                                {genres.map((g) => (
                                    <li key={g.id}>
                                        <Link
                                            href={`/movies?genre=${g.id}`}
                                            className="block py-0.5 transition-colors duration-150 hover:text-[#f5c518]"
                                        >
                                            {g.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </MegaMenu>

                    <MegaMenu label="Country">
                        <div className="p-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: BRAND_ACCENT }}>
                                Browse by Country
                            </p>
                            <ul className="grid max-h-[300px] grid-cols-4 gap-x-6 gap-y-2 overflow-y-auto text-sm text-gray-300">
                                {countries.map((c) => (
                                    <li key={c.code}>
                                        <Link
                                            href={`/movies?country=${c.code}`}
                                            className="block py-0.5 transition-colors duration-150 hover:text-[#f5c518]"
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </MegaMenu>

                    <NavLink href="/movies">Movies</NavLink>
                    <NavLink href="/shows">TV Shows</NavLink>
                    <NavLink href="/topimdb">Top IMDb</NavLink>
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-3 md:flex">
                    <Link href="/movies" aria-label="Search" className="rounded-lg p-2 text-gray-400 transition-colors hover:text-white" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <MdSearch size={20} />
                    </Link>

                    <ModeToggle />

                    <button aria-label="Profile" className="rounded-lg p-2 transition-colors" style={{ color: BRAND_ACCENT, background: "rgba(245,197,24,0.08)" }}>
                        <CgProfile size={20} />
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setMenuOpen((v) => !v)}>
                    {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Yellow accent line */}
            <div style={{ height: "2px", background: `linear-gradient(90deg, transparent, ${BRAND_ACCENT}, transparent)` }} />

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden" style={{ backgroundColor: "#0d0d0d" }}>
                    <div className="flex flex-col px-4 py-3 text-sm">
                        {[
                            { href: "/", label: "Home" },
                            { href: "/movies", label: "Movies" },
                            { href: "/shows", label: "TV Shows" },
                            { href: "/topimdb", label: "Top IMDb" },
                        ].map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className="border-b py-3 font-medium uppercase tracking-wide text-gray-300 transition-colors hover:text-white"
                                style={{ borderColor: "#222222" }}
                            >
                                {label}
                            </Link>
                        ))}

                        <div className="mt-4 flex items-center gap-3 pb-2">
                            <Link href="/movies" onClick={() => setMenuOpen(false)} className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-300" style={{ background: "#222222" }}>
                                <MdSearch size={18} />
                                Search
                            </Link>
                            <ModeToggle />
                            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-black" style={{ backgroundColor: BRAND_ACCENT }}>
                                <CgProfile size={18} />
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
