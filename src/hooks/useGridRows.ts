"use client";

import { useRef, useState, useEffect } from "react";

export function useGridRows(rows = 5) {
    const gridRef = useRef<HTMLDivElement>(null);
    const [cols, setCols] = useState(6);

    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const recalc = () => {
            const template = window.getComputedStyle(el).gridTemplateColumns;
            const count = template && template !== "none" ? template.split(" ").length : 6;
            setCols(count);
        };

        recalc();
        const ro = new ResizeObserver(recalc);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const limit = cols * rows;
    const ghosts = (count: number) => {
        const remainder = count % cols;
        return remainder === 0 ? 0 : cols - remainder;
    };

    return { gridRef, cols, limit, ghosts };
}
