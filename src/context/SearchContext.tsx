"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type SearchContextType = {
    query: string;
    setQuery: (q: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [query, setQuery] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        setQuery("");
    }, [pathname]);

    return <SearchContext.Provider value={{ query, setQuery }}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be inside SearchProvider");
    return ctx;
};
