"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { MdClose } from "react-icons/md";

type Genre = { id: number; name: string };
type Country = { code: string; name: string };

const SORT_OPTIONS = [
    { value: "popularity", label: "Popularity" },
    { value: "rating",     label: "Rating" },
    { value: "date",       label: "Release Date" },
    { value: "name",       label: "Name A–Z" },
    { value: "revenue",    label: "Revenue",    movieOnly: true },
    { value: "budget",     label: "Budget",     movieOnly: true },
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1919 }, (_, i) => CURRENT_YEAR - i);

function PillButton({
    active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={
                active
                    ? { backgroundColor: "#f5c518", color: "#000" }
                    : { border: "1px solid var(--border)", color: "var(--foreground)" }
            }
        >
            {children}
        </button>
    );
}

function SelectField({
    label, value, onChange, children,
}: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
    return (
        <section>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                {label}
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none cursor-pointer"
                style={{ backgroundColor: "var(--background)", border: "1px solid var(--border)", color: "var(--foreground)" }}
            >
                {children}
            </select>
        </section>
    );
}

interface AdvancedFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdvancedFilterModal({ isOpen, onClose }: AdvancedFilterModalProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [genres, setGenres] = useState<Genre[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);

    const pageType: "movie" | "series" = pathname.includes("/shows") ? "series" : "movie";

    const [selectedType, setSelectedType] = useState<"movie" | "series">(pageType);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedSort, setSelectedSort] = useState("popularity");
    const [selectedOrder, setSelectedOrder] = useState("desc");

    useEffect(() => {
        fetch("/api/genres").then(r => r.json()).then(setGenres).catch(() => {});
        fetch("/api/countries").then(r => r.json()).then(setCountries).catch(() => {});
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setSelectedType(pageType);
        const rawGenre = searchParams.get("genre") ?? "";
        setSelectedGenres(rawGenre ? rawGenre.split("|") : []);
        setSelectedCountry(searchParams.get("country") ?? "");
        setSelectedYear(searchParams.get("year") ?? "");
        setSelectedSort(searchParams.get("sort") ?? "popularity");
        setSelectedOrder(searchParams.get("order") ?? "desc");
    }, [isOpen, searchParams, pageType]);

    if (!isOpen) return null;

    const isTVMode = selectedType === "series";

    const toggleGenre = (id: string) =>
        setSelectedGenres(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );

    const handleApply = () => {
        const params = new URLSearchParams();
        if (selectedGenres.length > 0) params.set("genre", selectedGenres.join("|"));
        if (selectedCountry) params.set("country", selectedCountry);
        if (selectedYear) params.set("year", selectedYear);
        const sortChanged = selectedSort !== "popularity";
        const orderChanged = selectedOrder !== "desc";
        if (sortChanged || orderChanged) {
            params.set("sort", selectedSort);
            params.set("order", selectedOrder);
        }
        const dest = selectedType === "series" ? "/shows" : "/movies";
        const qs = params.toString();
        router.push(qs ? `${dest}?${qs}` : dest);
        onClose();
    };

    const handleReset = () => {
        const dest = selectedType === "series" ? "/shows" : "/movies";
        router.push(dest);
        onClose();
    };

    const visibleSortOptions = SORT_OPTIONS.filter(
        o => !("movieOnly" in o && o.movieOnly && isTVMode)
    );

    const activeFilterCount = [
        selectedGenres.length > 0,
        !!selectedCountry,
        !!selectedYear,
        selectedSort !== "popularity" || selectedOrder !== "desc",
    ].filter(Boolean).length;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60" />
            <div
                className="relative z-10 w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-2xl flex flex-col"
                style={{ backgroundColor: "var(--surface)", border: "1px solid var(--border)", maxHeight: "90vh" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4 shrink-0"
                    style={{ borderBottom: "1px solid var(--border)" }}
                >
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                            Advanced Filters
                        </h2>
                        {activeFilterCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-imdb-yellow text-black">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                        <MdClose size={22} style={{ color: "var(--muted)" }} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

                    {/* Type */}
                    <section>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                            Type
                        </label>
                        <div className="flex gap-2">
                            {(["movie", "series"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSelectedType(t)}
                                    className="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
                                    style={
                                        selectedType === t
                                            ? { backgroundColor: "#f5c518", color: "#000" }
                                            : { border: "1px solid var(--border)", color: "var(--foreground)" }
                                    }
                                >
                                    {t === "movie" ? "Movies" : "TV Shows"}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Genre */}
                    <section>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                            Genre
                            {selectedGenres.length > 0 && (
                                <span className="ml-2 normal-case font-normal" style={{ color: "#f5c518" }}>
                                    {selectedGenres.length} selected
                                </span>
                            )}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(g => (
                                <PillButton
                                    key={g.id}
                                    active={selectedGenres.includes(String(g.id))}
                                    onClick={() => toggleGenre(String(g.id))}
                                >
                                    {g.name}
                                </PillButton>
                            ))}
                        </div>
                    </section>

                    {/* Country */}
                    <SelectField label="Country" value={selectedCountry} onChange={setSelectedCountry}>
                        <option value="">All Countries</option>
                        {countries.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </SelectField>

                    {/* Year */}
                    <SelectField label="Year" value={selectedYear} onChange={setSelectedYear}>
                        <option value="">All Years</option>
                        {YEARS.map(y => (
                            <option key={y} value={String(y)}>{y}</option>
                        ))}
                    </SelectField>

                    {/* Sort By */}
                    <section>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                            Sort By
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {visibleSortOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSelectedSort(opt.value)}
                                    className="py-2 rounded-lg text-sm font-medium transition-colors"
                                    style={
                                        selectedSort === opt.value
                                            ? { backgroundColor: "#f5c518", color: "#000" }
                                            : { border: "1px solid var(--border)", color: "var(--foreground)" }
                                    }
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Order */}
                    <section>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted)" }}>
                            Order
                        </label>
                        <div className="flex gap-2">
                            {(["desc", "asc"] as const).map(o => (
                                <button
                                    key={o}
                                    onClick={() => setSelectedOrder(o)}
                                    className="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
                                    style={
                                        selectedOrder === o
                                            ? { backgroundColor: "#f5c518", color: "#000" }
                                            : { border: "1px solid var(--border)", color: "var(--foreground)" }
                                    }
                                >
                                    {o === "desc" ? "Descending" : "Ascending"}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div
                    className="px-6 py-4 shrink-0 flex gap-3"
                    style={{ borderTop: "1px solid var(--border)" }}
                >
                    <button
                        onClick={handleReset}
                        className="flex-1 py-2.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
                        style={{ border: "1px solid var(--border)", color: "var(--muted)" }}
                    >
                        Reset All
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 py-2.5 rounded-full text-sm font-medium bg-imdb-yellow text-imdb-black hover:opacity-90 transition-opacity"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
}
