"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";
import { ProductReviews } from "./ProductReviews";
import { useTracking } from "@/components/RemarketingScripts";
import { getShopifyImageUrl } from "@/lib/shopify-images";

interface ProductDetailProps {
    product: ShopifyProduct;
    categorySlug: string;
    relatedProducts?: ShopifyProduct[];
}


export function ProductDetail({ product, categorySlug, relatedProducts = [] }: ProductDetailProps) {
    const images = product.images.edges.map((e) => e.node);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const { trackEvent } = useTracking();

    useEffect(() => {
        trackEvent("ViewContent", {
            content_name: product.title,
            value: product.priceRange.minVariantPrice.amount,
            currency: product.priceRange.minVariantPrice.currencyCode,
        });
    }, [product, trackEvent]);

    const variants = product.variants.edges.map((e) => e.node);
    const currentVariant = variants[selectedVariant];

    const price = getSalePrice(
        currentVariant?.price.amount || product.priceRange.minVariantPrice.amount
    );

    return (
        <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
            {/* Breadcrumb */}
            <div className="max-w-[1280px] mx-auto px-6 pt-6 pb-2">
                <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <Link href="/" className="hover:opacity-70 transition-opacity">Inicio</Link>
                    <span>›</span>
                    <Link href={`/${categorySlug}`} className="hover:opacity-70 transition-opacity capitalize">{categorySlug}</Link>
                    <span>›</span>
                    <span className="line-clamp-1">{product.title}</span>
                </div>
            </div>

            {/* Main */}
            <div className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Galería */}
                <div className="space-y-3">
                    <div
                        className="relative aspect-square rounded-2xl overflow-hidden"
                        style={{ background: "var(--color-bg-secondary)" }}
                    >
                        {images[selectedImage] ? (
                            <Image
                                src={getShopifyImageUrl(images[selectedImage].url, { width: 1200 })}
                                alt={images[selectedImage].altText || product.title}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                                quality={100}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-8xl opacity-20">📦</span>
                            </div>
                        )}
                    </div>

                    {images.length > 1 && (
                        <div className="flex gap-2">
                            {images.slice(0, 4).map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className="relative w-16 h-16 rounded-xl overflow-hidden transition-all"
                                    style={{
                                        background: "var(--color-bg-secondary)",
                                        border: selectedImage === i ? "2px solid var(--color-accent)" : "2px solid transparent",
                                        opacity: selectedImage === i ? 1 : 0.6,
                                    }}
                                >
                                    <Image 
                                        src={getShopifyImageUrl(img.url, { width: 200 })} 
                                        alt={`Imagen ${i + 1}`} 
                                        fill 
                                        className="object-contain p-1" 
                                        sizes="64px" 
                                        quality={80}
                                    />
                                </button>
                            ))}
                            {images.length > 4 && (
                                <div
                                    className="w-16 h-16 rounded-xl flex items-center justify-center text-xs font-medium"
                                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-muted)" }}
                                >
                                    +{images.length - 4}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-6">
                    {product.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {product.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                                    style={{
                                        background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                                        color: "var(--color-accent)",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1
                        className="text-3xl lg:text-4xl font-black leading-tight"
                        style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                    >
                        {product.title}
                    </h1>

                    <span className="text-3xl font-black block" style={{ color: "var(--color-accent)" }}>
                        {price}
                    </span>

                    {product.description && (
                        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                            {product.description}
                        </p>
                    )}

                    {variants.length > 1 && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                                Variante
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {variants.map((v, i) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(i)}
                                        disabled={!v.availableForSale}
                                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                        style={{
                                            background: selectedVariant === i ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text) 6%, transparent)",
                                            color: selectedVariant === i ? "#fff" : "var(--color-text)",
                                            border: selectedVariant === i ? "2px solid var(--color-accent)" : "2px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
                                            opacity: v.availableForSale ? 1 : 0.4,
                                        }}
                                    >
                                        {v.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Cantidad */}
                    <div className="flex items-center gap-3">
                        <div
                            className="flex items-center rounded-xl overflow-hidden"
                            style={{
                                background: "var(--color-bg-secondary)",
                                border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                            }}
                        >
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-11 flex items-center justify-center text-lg font-bold hover:opacity-60" style={{ color: "var(--color-text)" }}>−</button>
                            <span className="w-10 text-center font-semibold text-sm" style={{ color: "var(--color-text)" }}>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-11 flex items-center justify-center text-lg font-bold hover:opacity-60" style={{ color: "var(--color-text)" }}>+</button>
                        </div>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>unidades</p>
                    </div>

                    {/* ── Botones de compra ── */}
                    <div className="space-y-3">
                        {/* Checkout Shopify */}
                        <AddToCartButton
                            product={product}
                            variantId={currentVariant?.id}
                            quantity={quantity}
                            variant="hero"
                            className="w-full"
                        >
                            🛒 Agregar al carrito
                        </AddToCartButton>

                    </div>

                    {/* Trust badges */}
                    <div
                        className="grid grid-cols-3 gap-3 p-4 rounded-2xl"
                        style={{
                            background: "var(--color-bg-secondary)",
                            border: "1px solid color-mix(in srgb, var(--color-text) 5%, transparent)",
                        }}
                    >
                        {[
                            { icon: "🚚", text: "Envío gratis" },
                            { icon: "💵", text: "Contraentrega" },
                            { icon: "🛡️", text: "Garantía 30 días" },
                        ].map((b) => (
                            <div key={b.text} className="flex flex-col items-center gap-1 text-center">
                                <span className="text-xl">{b.icon}</span>
                                <span className="text-[10px] font-medium leading-tight" style={{ color: "var(--color-text-muted)" }}>{b.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Relacionados */}
            {relatedProducts.length > 0 && (
                <div className="max-w-[1280px] mx-auto px-6 py-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-6 rounded-full" style={{ background: "var(--color-accent)" }} />
                        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}>
                            También te puede gustar
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.slice(0, 4).map((p) => {
                            const relatedImage = getProductImage(p);
                            return (
                                <Link
                                    key={p.id}
                                    href={`/${categorySlug}/${p.handle}`}
                                    className="block rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                                    style={{
                                        background: "var(--color-card-bg)",
                                        border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                                    }}
                                >
                                    <div className="relative h-40" style={{ background: "var(--color-bg-secondary)" }}>
                                        {relatedImage && (
                                            <Image src={relatedImage} alt={p.title} fill className="object-cover" sizes="25vw" />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: "var(--color-text)" }}>
                                            {p.title}
                                        </p>
                                        <p className="text-sm font-bold" style={{ color: "var(--color-accent)" }}>
                                            {getSalePrice(p.priceRange.minVariantPrice.amount)}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reseñas del producto */}
            <ProductReviews productTitle={product.title} />
        </div>
    );
}