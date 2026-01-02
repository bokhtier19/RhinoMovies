import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import {SearchProvider} from "@/src/context/SearchContext";
import {Analytics} from "@vercel/analytics/next";
import {ThemeProvider} from "next-themes";
import ScrollToTop from "@/src/components/ScrollToTop";

export const metadata: Metadata = {
    title: "RhinoMovies",
    description: "Discover Movies and TV Shows Online for Free | RhinoMovies",
    icons: "/reel.png"
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SearchProvider>
                        <Navbar />
                        {children}
                        <ScrollToTop />
                        <Footer />
                        <Analytics />
                    </SearchProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
