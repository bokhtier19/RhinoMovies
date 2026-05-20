"use client";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useGuest } from "@/src/context/GuestContext";
import { MdWarningAmber } from "react-icons/md";

export function GuestBanner() {
    const { isGuest, exitGuestMode } = useGuest();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user && isGuest) exitGuestMode();
    }, [session, isGuest, exitGuestMode]);

    if (!isGuest || session?.user) return null;

    return (
        <div
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            style={{ backgroundColor: "#1a1400", borderBottom: "1px solid #3a2800" }}
        >
            <div className="flex items-center gap-2 text-amber-400">
                <MdWarningAmber size={16} className="shrink-0" />
                <span className="text-xs">
                    <span className="font-semibold">Guest mode:</span> Your data is saved locally in this browser only.
                </span>
            </div>
            <button
                onClick={() => signIn("google")}
                className="shrink-0 rounded-lg px-3 py-1 text-xs font-semibold text-black transition-opacity hover:opacity-80"
                style={{ backgroundColor: "#f5c518" }}
            >
                Sign in to sync
            </button>
        </div>
    );
}
