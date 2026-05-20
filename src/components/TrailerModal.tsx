"use client";

import { useEffect } from "react";
import { HiX } from "react-icons/hi";

interface Props {
    videoKey: string;
    onClose: () => void;
}

export function TrailerModal({ videoKey, onClose }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 flex items-center gap-1 text-sm text-white/70 transition-colors hover:text-white"
                >
                    <HiX size={18} /> Close
                </button>
                <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
                        title="Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
}
