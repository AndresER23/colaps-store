"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { formatPrice, getProductImage, hasDiscount } from "@/lib/queries";
import { Stars, getReviewsForProduct } from "./ProductReviews";

interface ProductCardProps {
  product: ShopifyProduct;
  categorySlug: string;
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const imageUrl = getProductImage(product);
  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );
  const isOnSale = hasDiscount(product);
  const comparePrice = isOnSale
    ? formatPrice(product.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const reviews = getReviewsForProduct(product.title);
  const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    // TODO: integrar con carrito global
  };

  return (
    <Link
      href={`/${categorySlug}/${product.handle}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block bg-card border border-[var(--color-text)]/5 p-6 cursor-pointer transition-all duration-400 relative"
      style={{
        borderRadius: "var(--radius-card)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,0,0,0.10)"
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {isOnSale && (
        <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-accent)] text-white z-10">
          Sale
        </span>
      )}

      <div
        className="relative h-52 mb-5 overflow-hidden bg-[var(--color-bg-secondary)] transition-transform duration-300"
        style={{
          borderRadius: "calc(var(--radius-card) - 4px)",
          transform: hovered ? "scale(1.02)" : "scale(1)",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">📦</span>
          </div>
        )}
      </div>

      <h3
        className="text-sm font-medium mb-1 line-clamp-2 leading-snug"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {product.title}
      </h3>

      <div className="mb-2">
        <Stars rating={Math.round(avgRating)} size="text-[10px]" />
      </div>

      {product.tags.length > 0 && (
        <p className="text-[11px] text-[var(--color-text-muted)] mb-3">
          {product.tags.slice(0, 2).join(" · ")}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <div>
          <span className="text-lg font-semibold">{price}</span>
          {comparePrice && (
            <span className="text-xs text-[var(--color-text-muted)] line-through ml-2">
              {comparePrice}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-xs font-medium tracking-wider border-[1.5px] transition-all duration-300"
          style={{
            borderRadius: "calc(var(--radius-card) - 6px)",
            borderColor: added
              ? "transparent"
              : "color-mix(in srgb, var(--color-accent) 40%, transparent)",
            background: added ? "var(--color-accent)" : "transparent",
            color: added ? "#fff" : "var(--color-accent)",
          }}
        >
          {added ? "✓ Agregado" : "Agregar"}
        </button>
      </div>
    </Link>
  );
}
