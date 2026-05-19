import Link from "next/link";
import { PiFilmReelFill } from "react-icons/pi";

const LINKS = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/movies" },
    { label: "TV Shows", href: "/shows" },
    { label: "Top IMDb", href: "/topimdb" },
];

const LEGAL = [
    { label: "Terms of Service", href: "/" },
    { label: "Contact", href: "/" },
    { label: "FAQs", href: "/" },
    { label: "Sitemap", href: "/" },
];

export default function Footer() {
    return (
        <footer style={{ backgroundColor: "#111111", borderTop: "2px solid #f5c518" }}>
            <div className="mx-auto max-w-[1400px] px-6 py-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

                    {/* Brand */}
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <PiFilmReelFill size={32} style={{ color: "#f5c518" }} />
                            <span className="text-xl font-extrabold uppercase tracking-wider">
                                <span style={{ color: "#f5c518" }}>Rhino</span>
                                <span className="text-white">Movies</span>
                            </span>
                        </Link>
                        <p className="text-xs leading-relaxed text-gray-400 max-w-xs">
                            Free movies and TV streaming with zero ads. Watch or download over 10,000 titles without registering.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f5c518" }}>
                            Browse
                        </p>
                        <ul className="flex flex-col gap-2">
                            {LINKS.map(({ label, href }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-400 transition-colors hover:text-white">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#f5c518" }}>
                            Company
                        </p>
                        <ul className="flex flex-col gap-2">
                            {LEGAL.map(({ label, href }) => (
                                <li key={label}>
                                    <Link href={href} className="text-sm text-gray-400 transition-colors hover:text-white">
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 rounded-lg p-3 text-xs leading-relaxed text-gray-500" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                            RhinoMovies does not store any files on its servers. We only link to media hosted on third-party services.
                        </p>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col items-center gap-2 border-t pt-6 text-xs text-gray-600 md:flex-row md:justify-between" style={{ borderColor: "#222222" }}>
                    <p>© {new Date().getFullYear()} RhinoMovies. All rights reserved.</p>
                    <p>
                        Built for entertainment purposes only. Not affiliated with any streaming service.
                    </p>
                </div>
            </div>
        </footer>
    );
}
