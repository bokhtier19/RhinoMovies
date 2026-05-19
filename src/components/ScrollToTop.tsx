"use client";
import React, { useEffect, useState } from "react";
import { BiSolidArrowToTop } from "react-icons/bi";

const BOTTOM_THRESHOLD = 400;

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const nearBottom =
                window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
            setIsVisible(nearBottom);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed right-5 bottom-8 z-40 flex flex-col items-center gap-1 rounded-full p-3 shadow-lg hover:cursor-pointer transition-all duration-300"
            style={{
                backgroundColor: "#111111",
                border: "1px solid #f5c518",
                color: "#f5c518",
                opacity: isVisible ? 1 : 0,
                pointerEvents: isVisible ? "auto" : "none",
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
            }}
        >
            <BiSolidArrowToTop size={22} />
        </button>
    );
};

export default ScrollToTop;
