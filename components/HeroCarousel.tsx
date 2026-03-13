"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";
import type { CategoryTheme } from "@/lib/themes";

interface HeroCarouselProps {
    theme: CategoryTheme;
    products: ShopifyProduct[];
}

export function HeroCarousel({ theme, products }: HeroCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState<"next" | "prev">("next");

    const goTo = useCallback(
        (index: number, dir: "next" | "prev" = "next") => {
            if (isAnimating || index === current) return;
            setDirection(dir);
            setIsAnimating(true);
            setTimeout(() => {
                setCurrent(index);
                setIsAnimating(false);
            }, 300);
        },
        [isAnimating, current]
    );

    const goNext = useCallback(() => {
        goTo((current + 1) % products.length, "next");
    }, [current, products.length, goTo]);

    const goPrev = useCallback(() => {
        goTo((current - 1 + products.length) % products.length, "prev");
    }, [current, products.length, goTo]);

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (products.length <= 1) return;
        const timer = setInterval(goNext, 4000);
        return () => clearInterval(timer);
    }, [goNext, products.length]);

    if (!products.length) return null;

    const product = products[current];
    const imageUrl = getProductImage(product);
    const price = getSalePrice(product.priceRange.minVariantPrice.amount);
    const hasCompare =
        parseFloat(product.compareAtPriceRange.minVariantPrice.amount) >
        parseFloat(product.priceRange.minVariantPrice.amount);
    const comparePrice = hasCompare
        ? getSalePrice(product.compareAtPriceRange.minVariantPrice.amount)
        : null;
    const discountPct = hasCompare
        ? Math.round(
            (1 -
                parseFloat(product.priceRange.minVariantPrice.amount) /
                parseFloat(product.compareAtPriceRange.minVariantPrice.amount)) *
            100
        )
        : null;

    const slideStyle = {
        opacity: isAnimating ? 0 : 1,
        transform: isAnimating
            ? `translateX(${direction === "next" ? "-20px" : "20px"})`
            : "translateX(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
    };

    return (
        <section
            className="relative overflow-hidden mx-4 my-4 rounded-3xl"
            style={{
                background: `linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 15%, var(--color-bg)) 0%, var(--color-bg) 100%)`,
                border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
                minHeight: "420px",
            }}
        >
            {/* Glow */}
            <div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700"
                style={{
                    background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent) 25%, transparent) 0%, transparent 70%)`,
                }}
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-10 py-14 lg:px-16">
                {/* Text side */}
                <div className="space-y-5 z-10" style={slideStyle}>
                    {/* Badges */}
                    <div className="flex gap-2 flex-wrap">
                        {discountPct && (
                            <span className="inline-block px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full bg-red-500 text-white">
                                -{discountPct}% OFF
                            </span>
                        )}
                        {product.tags?.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full text-white"
                                style={{ background: "var(--color-accent)" }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <h1
                        className="text-4xl lg:text-5xl font-black leading-tight"
                        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                    >
                        {product.title}
                    </h1>

                    <p
                        className="text-sm leading-relaxed max-w-md"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        {product.description?.slice(0, 120) || theme.tagline}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-3">
                        <span
                            className="text-3xl font-black"
                            style={{ color: "var(--color-accent)" }}
                        >
                            {price}
                        </span>
                        {comparePrice && (
                            <span
                                className="text-base line-through opacity-50"
                                style={{ color: "var(--color-text)" }}
                            >
                                {comparePrice}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        <Link
                            href={`/${theme.slug}/${product.handle}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                            style={{ background: "var(--color-accent)" }}
                        >
                            Ver producto <span>→</span>
                        </Link>
                        <Link
                            href={`/${theme.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                            style={{
                                background: "color-mix(in srgb, var(--color-text) 8%, transparent)",
                                color: "var(--color-text)",
                                border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
                            }}
                        >
                            Ver catálogo
                        </Link>
                    </div>

                    {/* Trust badges */}
                    <div className="flex gap-5 pt-1">
                        {[
                            { icon: "🚚", label: "Envío gratis" },
                            { icon: "💵", label: "Contraentrega" },
                            { icon: "🛡️", label: "Garantía 30 días" },
                        ].map((b) => (
                            <div key={b.label} className="flex items-center gap-1.5">
                                <span className="text-sm">{b.icon}</span>
                                <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                                    {b.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Image side */}
                <div className="relative flex items-center justify-center" style={slideStyle}>
                    <div
                        className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden"
                        style={{
                            background: "color-mix(in srgb, var(--color-accent) 8%, var(--color-bg-secondary))",
                        }}
                    >
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={product.title}
                                fill
                                className="object-contain p-8"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        ) : (
                            <span className="text-8xl opacity-20 absolute inset-0 flex items-center justify-center">📦</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Controls — solo si hay más de 1 producto */}
            {products.length > 1 && (
                <>
                    {/* Prev / Next arrows */}
                    <button
                        onClick={goPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{
                            background: "color-mix(in srgb, var(--color-text) 10%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
                            color: "var(--color-text)",
                        }}
                    >
                        ←
                    </button>
                    <button
                        onClick={goNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{
                            background: "color-mix(in srgb, var(--color-text) 10%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--color-text) 15%, transparent)",
                            color: "var(--color-text)",
                        }}
                    >
                        →
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                        {products.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goTo(i, i > current ? "next" : "prev")}
                                className="rounded-full transition-all duration-300"
                                style={{
                                    width: i === current ? "20px" : "6px",
                                    height: "6px",
                                    background:
                                        i === current
                                            ? "var(--color-accent)"
                                            : "color-mix(in srgb, var(--color-text) 25%, transparent)",
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}