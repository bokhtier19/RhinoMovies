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
                    className="fixed bottom-20 right-20 z-20 p-2 hover:cursor-pointer rounded-full bg-gray-800 text-imdb-yellow hover:bg-gray-700 transition-opacity duration-300">
                    <BiSolidArrowToTop size={35} />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
