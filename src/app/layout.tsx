import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import {SearchProvider} from "@/src/context/SearchContext";
import {Analytics} from "@vercel/analytics/next";
import {ThemeProvider} from "next-themes";
import ScrollToTop from "@/src/components/ScrollToTop";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import { SessionProvider } from "@/src/components/SessionProvider";
import { GuestProvider } from "@/src/context/GuestContext";
import { AuthModalProvider } from "@/src/context/AuthModalContext";
import { AuthModal } from "@/src/components/AuthModal";
import { GuestBanner } from "@/src/components/GuestBanner";

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
                    <SessionProvider>
                        <GuestProvider>
                            <AuthModalProvider>
                                <SearchProvider>
                                    <Navbar />
                                    <GuestBanner />
                                    <ErrorBoundary>
                                        <main className="max-w-[1920px] mx-auto w-full">
                                            {children}
                                        </main>
                                    </ErrorBoundary>
                                    <ScrollToTop />
                                    <Footer />
                                    <Analytics />
                                    <AuthModal />
                                </SearchProvider>
                            </AuthModalProvider>
                        </GuestProvider>
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
