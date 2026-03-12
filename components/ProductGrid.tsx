"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { formatPrice, getProductImage, hasDiscount } from "@/lib/queries";

interface ProductGridProps {
    products: ShopifyProduct[];
    categorySlug: string;
    title?: string;
}

function QuickBuyCard({
    product,
    categorySlug,
}: {
    product: ShopifyProduct;
    categorySlug: string;
}) {
    const [added, setAdded] = useState(false);
    const [hovered, setHovered] = useState(false);
    const imageUrl = getProductImage(product);
    const price = formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
    );
    const isOnSale = hasDiscount(product);
    const comparePrice = isOnSale
        ? formatPrice(product.compareAtPriceRange.minVariantPrice.amount)
        : null;

    const handleQuickBuy = (e: React.MouseEvent) => {
        e.preventDefault();
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    return (
        <Link
            href={`/${categorySlug}/${product.handle}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="block relative overflow-hidden transition-all duration-300 group"
            style={{
                borderRadius: "var(--radius-card)",
                background: "var(--color-card-bg)",
                border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                transform: hovered ? "translateY(-3px)" : "translateY(0)",
                boxShadow: hovered
                    ? "0 12px 40px color-mix(in srgb, var(--color-accent) 15%, rgba(0,0,0,0.08))"
                    : "0 2px 8px rgba(0,0,0,0.04)",
            }}
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {product.tags?.includes("BEST SELLER") && (
                    <span
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
                        style={{ background: "var(--color-accent)" }}
                    >
                        Best Seller
                    </span>
                )}
                {isOnSale && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500 text-white">
                        Oferta
                    </span>
                )}
            </div>

            {/* Image */}
            <div
                className="relative h-52 overflow-hidden"
                style={{
                    background: "color-mix(in srgb, var(--color-bg-secondary) 60%, var(--color-card-bg))",
                    borderRadius: "calc(var(--radius-card) - 1px) calc(var(--radius-card) - 1px) 0 0",
                }}
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500"
                        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">📦</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                {product.tags?.[0] && (
                    <p
                        className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                        style={{ color: "var(--color-accent)" }}
                    >
                        {product.tags[0]}
                    </p>
                )}
                <h3
                    className="text-sm font-semibold line-clamp-2 leading-snug mb-3"
                    style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-text)",
                    }}
                >
                    {product.title}
                </h3>

                <div className="flex items-center justify-between gap-2">
                    <div>
                        <span
                            className="text-base font-bold"
                            style={{ color: "var(--color-accent)" }}
                        >
                            {price}
                        </span>
                        {comparePrice && (
                            <span
                                className="text-xs line-through ml-1.5"
                                style={{ color: "var(--color-text-muted)" }}
                            >
                                {comparePrice}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleQuickBuy}
                        className="px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
                        style={{
                            background: added
                                ? "var(--color-accent)"
                                : "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                            color: added ? "#fff" : "var(--color-accent)",
                            border: "1px solid color-mix(in srgb, var(--color-accent) 30%, transparent)",
                        }}
                    >
                        {added ? "✓ Listo" : "Quick Buy"}
                    </button>
                </div>
            </div>
        </Link>
    );
}

export function ProductGrid({ products, categorySlug, title }: ProductGridProps) {
    return (
        <section className="px-6 py-8 max-w-[1280px] mx-auto">
            {title && (
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-1 h-6 rounded-full"
                            style={{ background: "var(--color-accent)" }}
                        />
                        <h2
                            className="text-xl font-bold"
                            style={{
                                fontFamily: "var(--font-display)",
                                color: "var(--color-text)",
                            }}
                        >
                            {title}
                        </h2>
                    </div>
                    <Link
                        href={`/${categorySlug}`}
                        className="text-xs font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--color-accent)" }}
                    >
                        Ver todo →
                    </Link>
                </div>
            )}

            {products.length === 0 ? (
                <div
                    className="text-center py-20 rounded-2xl"
                    style={{ background: "var(--color-bg-secondary)" }}
                >
                    <p className="text-4xl mb-3">📦</p>
                    <p
                        className="text-base font-medium"
                        style={{ color: "var(--color-text-muted)" }}
                    >
                        No hay productos disponibles
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((product) => (
                        <QuickBuyCard
                            key={product.id}
                            product={product}
                            categorySlug={categorySlug}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}