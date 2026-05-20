"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { HiX } from "react-icons/hi";
import { PiFilmReelFill } from "react-icons/pi";
import { useAuthModal } from "@/src/context/AuthModalContext";
import { useGuest } from "@/src/context/GuestContext";

export function AuthModal() {
    const { isOpen, close } = useAuthModal();
    const { enterGuestMode } = useGuest();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [close]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGuest = () => {
        enterGuestMode();
        close();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={close}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative z-10 w-full max-w-sm rounded-2xl p-8 shadow-2xl"
                style={{ backgroundColor: "#111111", border: "1px solid #2a2a2a" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={close}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-500 transition-colors hover:text-white"
                >
                    <HiX size={18} />
                </button>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2">
                        <PiFilmReelFill size={28} style={{ color: "#f5c518" }} />
                        <span className="text-lg font-extrabold uppercase tracking-wider">
                            <span style={{ color: "#f5c518" }}>Rhino</span>
                            <span className="text-white">Movies</span>
                        </span>
                    </div>

                    <div className="text-center">
                        <h2 className="text-xl font-bold text-white">Sign in to save your picks</h2>
                        <p className="mt-1.5 text-sm text-gray-400">
                            Keep your watchlist and ratings across all your devices.
                        </p>
                    </div>

                    <button
                        onClick={() => signIn("google", { callbackUrl: "/" })}
                        className="flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-semibold text-gray-900 transition-opacity hover:opacity-90"
                        style={{ backgroundColor: "#ffffff" }}
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </button>

                    <div className="flex w-full items-center gap-3">
                        <div className="flex-1 border-t" style={{ borderColor: "#2a2a2a" }} />
                        <span className="text-xs text-gray-600">or</span>
                        <div className="flex-1 border-t" style={{ borderColor: "#2a2a2a" }} />
                    </div>

                    <button
                        onClick={handleGuest}
                        className="w-full rounded-xl border px-5 py-3 text-sm font-medium text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
                        style={{ borderColor: "#2a2a2a" }}
                    >
                        Continue as Guest
                    </button>

                    <p className="text-center text-[11px] leading-relaxed text-gray-600">
                        Guest data is stored in your browser session only.
                        <br />
                        Closing the tab will erase your watchlist and ratings.
                    </p>
                </div>
            </div>
        </div>
    );
}
