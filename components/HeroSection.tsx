import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { formatPrice, getProductImage } from "@/lib/queries";
import type { CategoryTheme } from "@/lib/themes";

interface HeroSectionProps {
  theme: CategoryTheme;
  featuredProduct?: ShopifyProduct | null;
}

export function HeroSection({ theme, featuredProduct }: HeroSectionProps) {
  const imageUrl = featuredProduct ? getProductImage(featuredProduct) : null;
  const price = featuredProduct
    ? formatPrice(
      featuredProduct.priceRange.minVariantPrice.amount,
      featuredProduct.priceRange.minVariantPrice.currencyCode
    )
    : null;

  return (
    <section
      className="relative overflow-hidden mx-4 my-4 rounded-3xl"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 15%, var(--color-bg)) 0%, var(--color-bg) 100%)`,
        border: "1px solid color-mix(in srgb, var(--color-accent) 15%, transparent)",
      }}
    >
      {/* Glow background */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent) 20%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-10 py-14 lg:px-16">
        {/* Text */}
        <div className="space-y-6 z-10">
          <span
            className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full text-white"
            style={{ background: "var(--color-accent)" }}
          >
            {featuredProduct?.tags?.[0] || "Destacado"}
          </span>

          <h1
            className="text-4xl lg:text-6xl font-black leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            {featuredProduct?.title || theme.name}
          </h1>

          <p
            className="text-base leading-relaxed max-w-md"
            style={{ color: "var(--color-text-muted)" }}
          >
            {featuredProduct?.description?.slice(0, 120) ||
              theme.tagline}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            {featuredProduct && (
              <Link
                href={`/${theme.slug}/${featuredProduct.handle}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "var(--color-accent)" }}
              >
                Ver producto
                <span>→</span>
              </Link>
            )}
            <Link
              href={`/${theme.slug}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
              style={{
                background: "color-mix(in srgb, var(--color-text) 8%, transparent)",
                color: "var(--color-text)",
                border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
              }}
            >
              Ver catálogo
            </Link>
          </div>

          {/* Trust mini badges */}
          <div className="flex gap-5 pt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🚚</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Envío gratis
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💵</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Contraentrega
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">🛡️</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Garantía 30 días
              </span>
            </div>
          </div>
        </div>

        {/* Product image */}
        <div className="relative flex items-center justify-center">
          <div
            className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--color-accent) 8%, var(--color-bg-secondary))",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={featuredProduct?.title || theme.name}
                fill
                className="object-contain p-8 hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="text-8xl opacity-20">📦</span>
            )}
          </div>

          {/* Price badge */}
          {price && (
            <div
              className="absolute bottom-4 left-4 px-4 py-3 rounded-xl shadow-xl"
              style={{
                background: "var(--color-card-bg)",
                border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Precio
              </p>
              <p
                className="text-xl font-black"
                style={{ color: "var(--color-accent)" }}
              >
                {price}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}