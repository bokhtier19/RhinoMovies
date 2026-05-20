"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

import { CgProfile } from "react-icons/cg";
import { MdSearch, MdKeyboardArrowDown, MdBookmark, MdHistory } from "react-icons/md";
import { PiFilmReelFill } from "react-icons/pi";
import { HiMenu, HiX } from "react-icons/hi";

import { ModeToggle } from "@/src/components/ThemeProvider";
import { useAuthModal } from "@/src/context/AuthModalContext";
import { useGuest } from "@/src/context/GuestContext";

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
            className="relative px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200"
            style={{ color: active ? BRAND_ACCENT : "#d1d1d1" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = active ? BRAND_ACCENT : "#d1d1d1")}
        >
            {children}
            {active && (
                <span
                    className="absolute right-3 bottom-0 left-3 h-[2px] rounded-full"
                    style={{ backgroundColor: BRAND_ACCENT }}
                />
            )}
        </Link>
    );
}

function MegaMenu({ label, children }: { label: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-200"
                style={{ color: open ? BRAND_ACCENT : "#d1d1d1" }}
            >
                {label}
                <MdKeyboardArrowDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Hover bridge — keeps panel open while cursor moves from button to panel */}
            <div className="absolute top-full right-0 left-0 h-3" />

            <div
                className={`absolute top-[calc(100%+0.75rem)] left-1/2 z-50 w-[700px] -translate-x-1/2 rounded-xl shadow-2xl transition-all duration-200 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
                style={{
                    backgroundColor: DROPDOWN_BG,
                    border: `1px solid ${DROPDOWN_BORDER}`,
                    borderTop: `2px solid ${BRAND_ACCENT}`,
                }}
                onClick={() => setOpen(false)}
            >
                {children}
            </div>
        </div>
    );
}

function DropdownMenu({ children, trigger }: { children: React.ReactNode; trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
            {open && (
                <div
                    className="absolute top-[calc(100%+0.5rem)] right-0 z-50 w-52 rounded-xl py-1 shadow-2xl"
                    style={{ backgroundColor: DROPDOWN_BG, border: `1px solid ${DROPDOWN_BORDER}` }}
                    onClick={() => setOpen(false)}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

const NAV_LINK_CLS =
    "flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white w-full text-left";
const DIVIDER = <div className="my-1 border-t" style={{ borderColor: DROPDOWN_BORDER }} />;

function ProfileDropdown() {
    const { data: session } = useSession();
    const { isGuest } = useGuest();
    const { open: openModal } = useAuthModal();

    if (session?.user) {
        return (
            <DropdownMenu
                trigger={
                    <button
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors"
                        style={{ background: "rgba(245,197,24,0.08)" }}
                    >
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt="Avatar"
                                width={28}
                                height={28}
                                className="rounded-full"
                            />
                        ) : (
                            <div
                                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-black"
                                style={{ backgroundColor: BRAND_ACCENT }}
                            >
                                {session.user.name?.[0]?.toUpperCase() ?? "?"}
                            </div>
                        )}
                        <MdKeyboardArrowDown size={14} style={{ color: "#d1d1d1" }} />
                    </button>
                }
            >
                <div className="border-b px-4 py-2.5" style={{ borderColor: DROPDOWN_BORDER }}>
                    <p className="truncate text-xs font-semibold text-white">{session.user.name}</p>
                    <p className="truncate text-[10px] text-gray-500">{session.user.email}</p>
                </div>
                <Link href="/profile?tab=watchlist" className={NAV_LINK_CLS}>
                    <MdBookmark size={15} style={{ color: BRAND_ACCENT }} /> Watchlist
                </Link>
                <Link href="/profile" className={NAV_LINK_CLS}>
                    <CgProfile size={15} style={{ color: BRAND_ACCENT }} /> Profile
                </Link>
                <Link href="/profile?tab=history" className={NAV_LINK_CLS}>
                    <MdHistory size={15} style={{ color: BRAND_ACCENT }} /> History
                </Link>
                {DIVIDER}
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`${NAV_LINK_CLS} text-red-400 hover:text-red-300`}
                >
                    Sign out
                </button>
            </DropdownMenu>
        );
    }

    if (isGuest) {
        return (
            <DropdownMenu
                trigger={
                    <button
                        className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors"
                        style={{ color: "#d1d1d1", background: "rgba(255,255,255,0.06)" }}
                    >
                        <CgProfile size={18} />
                        Guest
                        <MdKeyboardArrowDown size={13} />
                    </button>
                }
            >
                <Link href="/profile?tab=watchlist" className={NAV_LINK_CLS}>
                    <MdBookmark size={15} style={{ color: BRAND_ACCENT }} /> Watchlist
                </Link>
                <Link href="/profile" className={NAV_LINK_CLS}>
                    <CgProfile size={15} style={{ color: BRAND_ACCENT }} /> Profile
                </Link>
                <Link href="/profile?tab=history" className={NAV_LINK_CLS}>
                    <MdHistory size={15} style={{ color: BRAND_ACCENT }} /> History
                </Link>
                {DIVIDER}
                <button
                    onClick={() => signIn("google")}
                    className={`${NAV_LINK_CLS} text-[#f5c518] hover:text-yellow-300`}
                >
                    Sign in with Google
                </button>
            </DropdownMenu>
        );
    }

    return (
        <button
            onClick={openModal}
            aria-label="Sign in"
            className="rounded-lg p-2 transition-colors"
            style={{ color: BRAND_ACCENT, background: "rgba(245,197,24,0.08)" }}
        >
            <CgProfile size={20} />
        </button>
    );
}

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const { data: session } = useSession();
    const { isGuest } = useGuest();
    const { open: openModal } = useAuthModal();
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

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

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!menuOpen) return;
        const handleOutsideClick = (e: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [menuOpen]);

    return (
        <nav
            className={`sticky top-0 z-50 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
            style={{ backgroundColor: BRAND_BG, boxShadow: "0 2px 20px rgba(0,0,0,0.6)" }}
        >
            {/* Main bar */}
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
                {/* Logo */}
                <Link href="/" className="flex flex-shrink-0 items-center gap-2">
                    <PiFilmReelFill size={30} style={{ color: BRAND_ACCENT }} />
                    <span className="text-lg font-extrabold tracking-wider uppercase">
                        <span style={{ color: BRAND_ACCENT }}>Rhino</span>
                        <span className="text-white">Movies</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden items-center md:flex">
                    <NavLink href="/">Home</NavLink>

                    <MegaMenu label="GENRES">
                        <div className="p-5">
                            <p
                                className="mb-3 text-xs font-semibold tracking-widest uppercase"
                                style={{ color: BRAND_ACCENT }}
                            >
                                Browse by Genre
                            </p>
                            <ul className="grid grid-cols-4 gap-x-6 gap-y-2 text-sm text-gray-300">
                                {genres.map((g) => (
                                    <li key={g.id}>
                                        <Link
                                            href={`/movies?genre=${g.id}`}
                                            className="block py-0.5 tracking-wide transition-colors duration-150 hover:text-[#f5c518]"
                                        >
                                            {g.name.toUpperCase()}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </MegaMenu>

                    <MegaMenu label="COUNTRY">
                        <div className="p-5">
                            <p
                                className="mb-3 text-xs font-semibold tracking-widest uppercase"
                                style={{ color: BRAND_ACCENT }}
                            >
                                Browse by Country
                            </p>
                            <ul className="grid max-h-[300px] grid-cols-4 gap-x-6 gap-y-2 overflow-y-auto text-sm text-gray-300">
                                {countries.map((c) => (
                                    <li key={c.code}>
                                        <Link
                                            href={`/movies?country=${c.code}`}
                                            className="block py-0.5 tracking-wide transition-colors duration-150 hover:text-[#f5c518]"
                                        >
                                            {c.name.toUpperCase()}
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
                    <Link
                        href="/movies"
                        aria-label="Search"
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:text-white"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                        <MdSearch size={20} />
                    </Link>
                    <ModeToggle />
                    <ProfileDropdown />
                </div>

                {/* Mobile hamburger */}
                <button className="rounded-lg p-2 text-white md:hidden" onClick={() => setMenuOpen((v) => !v)}>
                    {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Yellow accent line */}
            <div
                style={{
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${BRAND_ACCENT}, transparent)`,
                }}
            />

            {/* Mobile menu */}
            {menuOpen && (
                <div ref={mobileMenuRef} className="md:hidden" style={{ backgroundColor: "#0d0d0d" }}>
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
                                className="border-b py-3 font-medium tracking-wide text-gray-300 uppercase transition-colors hover:text-white"
                                style={{ borderColor: "#222222" }}
                            >
                                {label}
                            </Link>
                        ))}

                        <div className="mt-4 flex items-center gap-3 pb-2">
                            <Link
                                href="/movies"
                                onClick={() => setMenuOpen(false)}
                                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium text-gray-300"
                                style={{ background: "#222222" }}
                            >
                                <MdSearch size={18} />
                                Search
                            </Link>
                            <ModeToggle />
                            {session?.user || isGuest ? (
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-black"
                                    style={{ backgroundColor: BRAND_ACCENT }}
                                >
                                    <CgProfile size={18} />
                                    Profile
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        openModal();
                                    }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold text-black"
                                    style={{ backgroundColor: BRAND_ACCENT }}
                                >
                                    <CgProfile size={18} />
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
