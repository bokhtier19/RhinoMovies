"use client";
import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

type Vote = "like" | "dislike" | null;

export function LikeDislike() {
    const [vote, setVote] = useState<Vote>(null);
    const toggle = (v: Vote) => setVote((prev) => (prev === v ? null : v));

    return (
        <div className="mt-2 flex gap-2">
            <button
                onClick={() => toggle("like")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-200"
                style={{
                    backgroundColor: vote === "like" ? "#16a34a" : "transparent",
                    color: vote === "like" ? "#fff" : "#16a34a",
                    border: "1px solid #16a34a",
                    opacity: vote === "dislike" ? 0.3 : 1,
                }}
            >
                <FaThumbsUp size={11} /> Like
            </button>
            <button
                onClick={() => toggle("dislike")}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-semibold transition-all duration-200"
                style={{
                    backgroundColor: vote === "dislike" ? "#dc2626" : "transparent",
                    color: vote === "dislike" ? "#fff" : "#dc2626",
                    border: "1px solid #dc2626",
                    opacity: vote === "like" ? 0.3 : 1,
                }}
            >
                <FaThumbsDown size={11} /> Dislike
            </button>
        </div>
    );
}
