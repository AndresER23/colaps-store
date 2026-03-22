"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ShopifyProduct } from "@/lib/queries";
import { calcSalePrice } from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = "relevance" | "price-asc" | "price-desc" | "name-asc";

export interface FilterState {
    search: string;
    selectedTags: string[];
    sort: SortOption;
    priceRange: [number, number];
}

interface ProductFiltersProps {
    products: ShopifyProduct[];
    onFilteredProducts: (filtered: ShopifyProduct[]) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getProductPrice(p: ShopifyProduct): number {
    return calcSalePrice(p.priceRange.minVariantPrice.amount);
}

function getAllTags(products: ShopifyProduct[]): string[] {
    const tagCount = new Map<string, number>();
    products.forEach((p) =>
        p.tags.forEach((t) => {
            const tag = t.trim();
            if (tag) tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
        })
    );
    return Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([tag]) => tag);
}

// ─── Sort labels ──────────────────────────────────────────────────────────────

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: "relevance", label: "Relevancia" },
    { value: "price-asc", label: "Menor precio" },
    { value: "price-desc", label: "Mayor precio" },
    { value: "name-asc", label: "Nombre A–Z" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductFilters({ products, onFilteredProducts }: ProductFiltersProps) {
    const allTags = useMemo(() => getAllTags(products), [products]);

    const priceExtent = useMemo(() => {
        if (products.length === 0) return [0, 1000000] as [number, number];
        const prices = products.map(getProductPrice);
        return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] as [number, number];
    }, [products]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [sort, setSort] = useState<SortOption>("relevance");
    const [priceRange, setPriceRange] = useState<[number, number]>(priceExtent);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Sync price extent when products change
    useEffect(() => {
        setPriceRange(priceExtent);
    }, [priceExtent]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 250);
        return () => clearTimeout(timer);
    }, [search]);

    // ── Filtering & sorting logic ─────────────────────────────────────────────

    const filtered = useMemo(() => {
        let result = [...products];

        // Search
        if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q) ||
                    p.tags.some((t) => t.toLowerCase().includes(q))
            );
        }

        // Tags
        if (selectedTags.length > 0) {
            result = result.filter((p) =>
                selectedTags.some((tag) => p.tags.includes(tag))
            );
        }

        // Price
        result = result.filter((p) => {
            const price = getProductPrice(p);
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sort
        switch (sort) {
            case "price-asc":
                result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
                break;
            case "price-desc":
                result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
                break;
            case "name-asc":
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return result;
    }, [products, debouncedSearch, selectedTags, sort, priceRange]);

    // Push filtered results up
    useEffect(() => {
        onFilteredProducts(filtered);
    }, [filtered, onFilteredProducts]);

    // ── Toggle tag ────────────────────────────────────────────────────────────

    const toggleTag = useCallback((tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    }, []);

    const clearAll = useCallback(() => {
        setSearch("");
        setSelectedTags([]);
        setSort("relevance");
        setPriceRange(priceExtent);
    }, [priceExtent]);

    const hasActiveFilters = search || selectedTags.length > 0 || sort !== "relevance" ||
        priceRange[0] !== priceExtent[0] || priceRange[1] !== priceExtent[1];

    const formatCOP = (n: number) =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="space-y-4">
            {/* ═══ Search + Sort Row ═══ */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div
                    className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 focus-within:ring-2"
                    style={{
                        background: "color-mix(in srgb, var(--color-bg-secondary) 80%, var(--color-card-bg))",
                        border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                        // @ts-ignore
                        "--tw-ring-color": "var(--color-accent)",
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar productos..."
                        className="flex-1 bg-transparent outline-none text-sm"
                        style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                            style={{ color: "var(--color-text)" }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Sort + Mobile filter toggle */}
                <div className="flex gap-2">
                    {/* Sort dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-80"
                            style={{
                                background: "color-mix(in srgb, var(--color-bg-secondary) 80%, var(--color-card-bg))",
                                border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                                color: "var(--color-text)",
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--color-text-muted)" }}>
                                <path d="M3 6h18M6 12h12M9 18h6" />
                            </svg>
                            <span className="hidden sm:inline">
                                {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                            </span>
                        </button>

                        <AnimatePresence>
                            {showSortDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full mt-2 z-50 min-w-[180px] rounded-xl overflow-hidden shadow-xl"
                                        style={{
                                            background: "var(--color-card-bg)",
                                            border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                                        }}
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setSort(option.value);
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm transition-all hover:opacity-70"
                                                style={{
                                                    color: sort === option.value ? "var(--color-accent)" : "var(--color-text)",
                                                    fontWeight: sort === option.value ? 700 : 400,
                                                    background: sort === option.value
                                                        ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
                                                        : "transparent",
                                                }}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile filters toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-all"
                        style={{
                            background: showMobileFilters
                                ? "var(--color-accent)"
                                : "color-mix(in srgb, var(--color-bg-secondary) 80%, var(--color-card-bg))",
                            border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                            color: showMobileFilters ? "#fff" : "var(--color-text)",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        {hasActiveFilters && !showMobileFilters && (
                            <span
                                className="w-2 h-2 rounded-full"
                                style={{ background: "var(--color-accent)" }}
                            />
                        )}
                    </button>
                </div>
            </div>

            {/* ═══ Filters Panel (desktop: always visible, mobile: toggle) ═══ */}
            <div className={`${showMobileFilters ? "block" : "hidden"} sm:block`}>
                <div className="space-y-4">
                    {/* Category pills */}
                    {allTags.length > 0 && (
                        <div>
                            <p
                                className="text-xs font-semibold uppercase tracking-wider mb-2"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                Categorías
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {allTags.slice(0, 12).map((tag) => {
                                    const isActive = selectedTags.includes(tag);
                                    return (
                                        <motion.button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                                            style={{
                                                background: isActive
                                                    ? "var(--color-accent)"
                                                    : "color-mix(in srgb, var(--color-text) 6%, transparent)",
                                                color: isActive ? "#fff" : "var(--color-text)",
                                                border: isActive
                                                    ? "1px solid var(--color-accent)"
                                                    : "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                                            }}
                                        >
                                            {tag}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Price range */}
                    <div>
                        <p
                            className="text-xs font-semibold uppercase tracking-wider mb-2"
                            style={{ color: "var(--color-text-muted)" }}
                        >
                            Precio
                        </p>
                        <div className="flex items-center gap-2">
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
                                style={{
                                    background: "color-mix(in srgb, var(--color-bg-secondary) 80%, var(--color-card-bg))",
                                    border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                                }}
                            >
                                <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Mín</span>
                                <input
                                    type="number"
                                    value={priceRange[0] || ""}
                                    onChange={(e) => {
                                        const val = Number(e.target.value) || 0;
                                        setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
                                    }}
                                    onBlur={() => {
                                        if (priceRange[0] < priceExtent[0]) setPriceRange([priceExtent[0], priceRange[1]]);
                                    }}
                                    placeholder={formatCOP(priceExtent[0])}
                                    className="flex-1 bg-transparent outline-none text-sm w-full min-w-0"
                                    style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}
                                />
                            </div>
                            <span className="text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>—</span>
                            <div
                                className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1"
                                style={{
                                    background: "color-mix(in srgb, var(--color-bg-secondary) 80%, var(--color-card-bg))",
                                    border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                                }}
                            >
                                <span className="text-[10px] font-semibold uppercase" style={{ color: "var(--color-text-muted)" }}>Máx</span>
                                <input
                                    type="number"
                                    value={priceRange[1] || ""}
                                    onChange={(e) => {
                                        const val = Number(e.target.value) || 0;
                                        setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
                                    }}
                                    onBlur={() => {
                                        if (priceRange[1] > priceExtent[1]) setPriceRange([priceRange[0], priceExtent[1]]);
                                    }}
                                    placeholder={formatCOP(priceExtent[1])}
                                    className="flex-1 bg-transparent outline-none text-sm w-full min-w-0"
                                    style={{ color: "var(--color-text)", fontFamily: "var(--font-body)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Active Filters Bar ═══ */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 flex-wrap"
                    >
                        <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                            {filtered.length} producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex-1" />
                        {selectedTags.map((tag) => (
                            <motion.button
                                key={tag}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => toggleTag(tag)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                style={{
                                    background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                                    color: "var(--color-accent)",
                                    border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                                }}
                            >
                                {tag}
                                <span className="opacity-60">✕</span>
                            </motion.button>
                        ))}
                        {debouncedSearch && (
                            <span
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                                style={{
                                    background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                                    color: "var(--color-accent)",
                                    border: "1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)",
                                }}
                            >
                                &quot;{debouncedSearch}&quot;
                            </span>
                        )}
                        <button
                            onClick={clearAll}
                            className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full transition-all hover:opacity-70"
                            style={{
                                color: "var(--color-text-muted)",
                                border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                            }}
                        >
                            Limpiar todo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
