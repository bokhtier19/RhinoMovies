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
        <button onClick={() => setTheme(() => (theme === "dark" ? "light" : "dark"))} className="p-2 rounded-md hover:cursor-pointer hover:text-imdb-yellow transition-colors">
            {theme === "dark" ? <IoSunnyOutline className="" size={20} /> : <IoMoonOutline className="" size={20} />}
        </button>
    );
}
