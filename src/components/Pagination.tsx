"use client";

import {FaLongArrowAltLeft, FaLongArrowAltRight} from "react-icons/fa";

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisible?: number;
};

export default function Pagination({page, totalPages, onPageChange, maxVisible = 10}: PaginationProps) {
    const half = Math.floor(maxVisible / 2);

    const start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    const pages = Array.from({length: end - start + 1}, (_, i) => start + i);

    return (
        <div className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            {/* Prev */}
            <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-4 py-2 hover:cursor-pointer rounded flex gap-2 items-center disabled:opacity-40" style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}>
                <FaLongArrowAltLeft />
                Prev
            </button>

            {/* Page Numbers */}
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-2 hover:cursor-pointer rounded-full ${p === page ? "bg-imdb-yellow text-black font-bold" : ""}`}
                    style={p !== page ? { backgroundColor: "var(--surface)", color: "var(--foreground)" } : undefined}>
                    {p}
                </button>
            ))}

            {/* Next */}
            <button
                disabled={page === totalPages}
                onClick={() => onPageChange(page + 1)}
                className="px-4 py-2 hover:cursor-pointer rounded flex gap-2 items-center disabled:opacity-40"
                style={{ backgroundColor: "var(--surface)", color: "var(--foreground)" }}>
                Next
                <FaLongArrowAltRight />
            </button>
        </div>
    );
}
