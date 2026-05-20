"use client";

import { useState } from "react";
import { FaPlay } from "react-icons/fa";
import { TrailerModal } from "@/src/components/TrailerModal";

interface Props {
    videoKey: string | null;
}

export function WatchButton({ videoKey }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => videoKey && setOpen(true)}
                disabled={!videoKey}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity sm:gap-2 sm:px-5 sm:py-2.5 sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#f5c518", color: "#000" }}
                title={videoKey ? "Watch trailer" : "No trailer available"}
            >
                <FaPlay size={10} /> Watch Trailer
            </button>
            {open && videoKey && <TrailerModal videoKey={videoKey} onClose={() => setOpen(false)} />}
        </>
    );
}
