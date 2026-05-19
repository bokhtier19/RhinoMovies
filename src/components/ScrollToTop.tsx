"use client";
import React, { useEffect, useState } from "react";

import { BiSolidArrowToTop } from "react-icons/bi";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const setVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", setVisibility);
        return () => {
            window.removeEventListener("scroll", setVisibility);
        };
    }, []);

    return (
        <div>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-20 z-20 p-2 hover:cursor-pointer rounded-full text-imdb-yellow transition-opacity duration-300"
                    style={{ backgroundColor: "var(--surface)" }}>
                    <BiSolidArrowToTop size={35} />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
