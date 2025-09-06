import Link from "next/link";
import React from "react";
import { PiFilmReelFill } from "react-icons/pi";

const Footer = () => {
    return (
        <footer className="bg-imdb-border text-imdb-white p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:gap-6 lg:gap-8">
                {/* Logo Section */}
                <div className="flex-1 flex flex-col items-center md:items-start mb-6 md:mb-0 text-imdb-yellow">
                    <PiFilmReelFill size={40} />
                    <p className="text-xl font-bold">RHINOMOVIES</p>
                </div>

                {/* About + Links */}
                <div className="flex-1 flex flex-col gap-4 mb-6 md:mb-0">
                    <p className="text-xs leading-relaxed text-center md:text-left">
                        RHINOMOVIES is a Free Movies streaming site with zero ads. We let you watch movies online
                        without having to register or paying, with over 10000 movies and TV-Series. You can also
                        Download full movies from RHINOMOVIES and watch it later if you want.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm font-bold">
                        <Link href={"/"}>Android App</Link>
                        <Link href={"/"}>Sitemap</Link>
                        <Link href={"/"}>Terms of Service</Link>
                        <Link href={"/"}>Contact</Link>
                        <Link href={"/"}>FAQs</Link>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="flex-1 flex items-center justify-center md:justify-end">
                    <p className="border p-2 text-xs text-center md:text-left">
                        RHINOMOVIES does not store any files on our server, we only link to the media hosted on
                        3rd-party services.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
