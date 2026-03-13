"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";
import { AddToCartButton } from "@/components/AddToCartButton";

interface ProductDetailProps {
    product: ShopifyProduct;
    categorySlug: string;
    relatedProducts: ShopifyProduct[];
}

export function ProductDetail({
    product,
    categorySlug,
    relatedProducts,
}: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    // ✅ FIX: Guardar el ID de la variante (string), no el índice (number)
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants.edges[0]?.node.id || ""
    );

    const images = product.images.edges.map((edge) => edge.node);
    const mainImage = images[selectedImage] || images[0];
    const price = getSalePrice(product.priceRange.minVariantPrice.amount);
    const rawCost = parseFloat(product.priceRange.minVariantPrice.amount);
    const rawCompare = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
    const hasDiscount = rawCompare > rawCost;
    const discountPct = hasDiscount ? Math.round((1 - rawCost / rawCompare) * 100) : null;
    const comparePrice = hasDiscount ? getSalePrice(rawCompare.toString()) : null;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-8">
                <Link href="/" className="hover:underline opacity-60">
                    Inicio
                </Link>
                <span className="opacity-40">→</span>
                <Link href={`/${categorySlug}`} className="hover:underline opacity-60 capitalize">
                    {categorySlug}
                </Link>
                <span className="opacity-40">→</span>
                <span className="font-medium">{product.title}</span>
            </nav>

            {/* Product Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                {/* Images */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border">
                        {mainImage ? (
                            <Image
                                src={mainImage.url}
                                alt={mainImage.altText || product.title}
                                fill
                                className="object-contain p-8"
                                priority
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-10">
                                📦
                            </div>
                        )}

                        {/* Discount Badge */}
                        {discountPct && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                                -{discountPct}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage
                                            ? "border-black scale-105"
                                            : "border-transparent hover:border-gray-300"
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.altText || `${product.title} ${i + 1}`}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                        {/* Vendor opcional - solo muestra si existe en el tipo */}
                        {"vendor" in product && product.vendor && (
                            <p className="text-sm opacity-60">Por {product.vendor}</p>
                        )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 pb-6 border-b">
                        <span className="text-5xl font-bold">{price}</span>
                        {comparePrice && (
                            <div className="flex flex-col">
                                <span className="text-lg line-through opacity-50">{comparePrice}</span>
                                {discountPct && (
                                    <span className="text-sm font-bold text-red-500">
                                        Ahorrás {discountPct}%
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Variants Selector */}
                    {product.variants.edges.length > 1 && (
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold">
                                Selecciona una opción:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {product.variants.edges.map(({ node }) => {
                                    const variantPrice = getSalePrice(node.price.amount);
                                    return (
                                        <button
                                            key={node.id}
                                            onClick={() => setSelectedVariant(node.id)} // ✅ FIX: Guardar el ID, no el índice
                                            className={`px-4 py-3 rounded-lg border-2 transition-all text-left ${selectedVariant === node.id
                                                    ? "border-black bg-black text-white"
                                                    : "border-gray-200 hover:border-gray-400"
                                                }`}
                                        >
                                            <div className="font-medium">{node.title}</div>
                                            <div className="text-sm opacity-70">{variantPrice}</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ✅ AddToCartButton con variantId correcto (string) */}
                    <AddToCartButton
                        product={product}
                        variantId={selectedVariant}
                        variant="hero"
                        className="w-full"
                    >
                        Agregar al Carrito
                    </AddToCartButton>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                        {[
                            { icon: "🚚", label: "Envío gratis" },
                            { icon: "💵", label: "Contraentrega" },
                            { icon: "🛡️", label: "Garantía 30d" },
                        ].map((badge) => (
                            <div key={badge.label} className="text-center">
                                <div className="text-2xl mb-1">{badge.icon}</div>
                                <div className="text-xs opacity-70">{badge.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="pt-6 border-t">
                            <h2 className="text-lg font-bold mb-3">Descripción</h2>
                            <p className="leading-relaxed opacity-80">{product.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">También te puede gustar</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.slice(0, 4).map((p) => { // ✅ FIX: Usar 'p' en lugar de 'relatedProduct'
                            const relatedImage = getProductImage(p);
                            const relatedPrice = getSalePrice(p.priceRange.minVariantPrice.amount);

                            return (
                                <div key={p.id} className="group">
                                    <Link href={`/${categorySlug}/${p.handle}`}>
                                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-3 border group-hover:border-gray-400 transition-all">
                                            {relatedImage ? (
                                                <Image
                                                    src={relatedImage}
                                                    alt={p.title}
                                                    fill
                                                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-10">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                    <h3 className="font-semibold text-sm mb-1 group-hover:underline">
                                        <Link href={`/${categorySlug}/${p.handle}`}>{p.title}</Link>
                                    </h3>
                                    <p className="text-sm font-bold mb-2">{relatedPrice}</p>

                                    {/* ✅ AddToCartButton para productos relacionados */}
                                    <AddToCartButton
                                        product={p}
                                        variantId={p.variants.edges[0]?.node.id || ""} // ✅ FIX: Usar el ID de la primera variante
                                        variant="primary"
                                        className="w-full text-xs"
                                    >
                                        Agregar
                                    </AddToCartButton>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}