"use client";

import * as React from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useTheme} from "next-themes";
import {IoSunnyOutline, IoMoonOutline} from "react-icons/io5";

export function ThemeProvider({children, ...props}: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function ModeToggle() {
    const {theme, setTheme} = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 transition-colors hover:cursor-pointer"
            style={{ color: "#ffffff", background: "rgba(255,255,255,0.08)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#f5c518")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <IoSunnyOutline size={20} /> : <IoMoonOutline size={20} />}
        </button>
    );
}
