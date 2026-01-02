import React from "react";
import {SearchProvider} from "@/src/context/SearchContext";

export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <SearchProvider>
            <section>{children}</section>
        </SearchProvider>
    );
}
