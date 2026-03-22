"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";
import { AddToCartButton } from "./AddToCartButton";
import { ProductReviews } from "./ProductReviews";

interface ProductDetailProps {
    product: ShopifyProduct;
    categorySlug: string;
    relatedProducts?: ShopifyProduct[];
}

function buildWhatsAppUrl(product: ShopifyProduct, price: string): string {
    const msg = encodeURIComponent(
        `Hola! Me interesa este producto:\n\n*${product.title}*\nPrecio: ${price}\n\n¿Está disponible?`
    );
    return `https://wa.me/573222844958?text=${msg}`;
}

function buildInstagramUrl(): string {
    return "https://ig.me/m/colapstech";
}

export function ProductDetail({ product, categorySlug, relatedProducts = [] }: ProductDetailProps) {
    const images = product.images.edges.map((e) => e.node);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const variants = product.variants.edges.map((e) => e.node);
    const currentVariant = variants[selectedVariant];

    const price = getSalePrice(
        currentVariant?.price.amount || product.priceRange.minVariantPrice.amount
    );

    const whatsappUrl = buildWhatsAppUrl(product, price);
    const instagramUrl = buildInstagramUrl();

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
                                src={images[selectedImage].url}
                                alt={images[selectedImage].altText || product.title}
                                fill
                                className="object-contain p-6"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
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
                                    <Image src={img.url} alt={`Imagen ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
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
                        {/* WhatsApp */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                            style={{
                                background: "linear-gradient(135deg, #25d366, #128c7e)",
                                boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Comprar por WhatsApp
                        </a>

                        {/* Instagram */}
                        <a
                            href={instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.01]"
                            style={{
                                background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                                boxShadow: "0 4px 20px rgba(253,29,29,0.25)",
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Comprar por Instagram
                        </a>

                        {/* Divisor */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ background: "color-mix(in srgb, var(--color-text) 10%, transparent)" }} />
                            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>o</span>
                            <div className="flex-1 h-px" style={{ background: "color-mix(in srgb, var(--color-text) 10%, transparent)" }} />
                        </div>

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