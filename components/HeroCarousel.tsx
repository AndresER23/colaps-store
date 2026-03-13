"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";
import type { CategoryTheme } from "@/lib/themes";
import { AddToCartButton } from "./AddToCartButton";

interface HeroCarouselProps {
  theme: CategoryTheme;
  products: ShopifyProduct[];
}

// Detecta el tipo de promo desde los tags del producto
function getPromoType(tags: string[]): { label: string; color: string } | null {
  const upper = tags.map((t) => t.toUpperCase());
  if (upper.some((t) => t.includes("2X1"))) return { label: "2X1", color: "#ff3b30" };
  if (upper.some((t) => t.includes("COMBO"))) return { label: "COMBO", color: "#ff6b00" };
  if (upper.some((t) => t.includes("NUEVO") || t.includes("NEW"))) return { label: "NUEVO", color: "#34c759" };
  if (upper.some((t) => t.includes("HOT") || t.includes("VIRAL"))) return { label: "🔥 VIRAL", color: "#ff3b30" };
  return null;
}

function Countdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    // Genera un tiempo aleatorio entre 1-23h para urgencia
    const endTime = Date.now() + (Math.floor(Math.random() * 22) + 1) * 3600000 + Math.random() * 3600000;

    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-red-400">
        ⏰ Oferta termina en:
      </span>
      <div className="flex items-center gap-1">
        {[pad(time.h), pad(time.m), pad(time.s)].map((val, i) => (
          <span key={i} className="flex items-center gap-1">
            <span
              className="inline-block min-w-[32px] text-center px-1.5 py-0.5 rounded-md text-sm font-black tabular-nums"
              style={{ background: "#ff3b30", color: "#fff" }}
            >
              {val}
            </span>
            {i < 2 && <span className="text-red-400 font-black text-sm">:</span>}
          </span>
        ))}
      </div>
    </div>
  );
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
      }, 350);
    },
    [isAnimating, current]
  );

  const goNext = useCallback(() => {
    goTo((current + 1) % products.length, "next");
  }, [current, products.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + products.length) % products.length, "prev");
  }, [current, products.length, goTo]);

  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, products.length]);

  if (!products.length) return null;

  const product = products[current];
  const imageUrl = getProductImage(product);
  const price = getSalePrice(product.priceRange.minVariantPrice.amount);
  const rawCost = parseFloat(product.priceRange.minVariantPrice.amount);
  const rawCompare = parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
  const hasDiscount = rawCompare > rawCost;
  const discountPct = hasDiscount ? Math.round((1 - rawCost / rawCompare) * 100) : null;
  const comparePrice = hasDiscount ? getSalePrice(rawCompare.toString()) : null;
  const promoType = getPromoType(product.tags || []);

  const slideStyle = {
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating
      ? `translateX(${direction === "next" ? "-24px" : "24px"})`
      : "translateX(0)",
    transition: "opacity 0.35s ease, transform 0.35s ease",
  };

  return (
    <section
      className="relative overflow-hidden mx-4 my-4 rounded-3xl"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #111827 100%)",
        border: "1px solid rgba(255,59,48,0.2)",
        minHeight: "440px",
      }}
    >
      {/* Fondo con glow rojo de urgencia */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 80% 50%, rgba(255,59,48,0.08) 0%, transparent 60%)",
        }}
      />
      {/* Línea superior de acento rojo */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #ff3b30, transparent)" }}
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-10 py-10 lg:px-16">
        {/* Texto */}
        <div className="space-y-4 z-10" style={slideStyle}>

          {/* Countdown + badges */}
          <div className="space-y-2">
            <Countdown />
            <div className="flex gap-2 flex-wrap">
              {discountPct && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase text-white"
                  style={{
                    background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                    boxShadow: "0 4px 15px rgba(255,59,48,0.4)",
                  }}
                >
                  🔥 -{discountPct}% OFF
                </span>
              )}
              {promoType && (
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase text-white"
                  style={{
                    background: promoType.color,
                    boxShadow: `0 4px 15px ${promoType.color}66`,
                  }}
                >
                  {promoType.label}
                </span>
              )}
            </div>
          </div>

          {/* Título */}
          <h1
            className="text-3xl lg:text-5xl font-black leading-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.title}
          </h1>

          {/* Descripción */}
          <p className="text-sm leading-relaxed text-slate-400 max-w-md">
            {product.description?.slice(0, 100) || theme.tagline}
          </p>

          {/* Precios */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-white">{price}</span>
            {comparePrice && (
              <div className="flex flex-col">
                <span className="text-sm line-through text-slate-500">{comparePrice}</span>
                {discountPct && (
                  <span className="text-xs font-bold text-red-400">Ahorrás {discountPct}%</span>
                )}
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <AddToCartButton
              product={product}
              variant="hero"
            >
              ¡Lo quiero! →
            </AddToCartButton>
            <Link
              href={`/${theme.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-300 transition-all hover:text-white"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Ver todo
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex gap-4 pt-1">
            {[
              { icon: "🚚", label: "Envío gratis" },
              { icon: "💵", label: "Contraentrega" },
              { icon: "🛡️", label: "Garantía 30d" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-1.5">
                <span className="text-sm">{b.icon}</span>
                <span className="text-xs text-slate-400">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Imagen */}
        <div className="relative flex items-center justify-center" style={slideStyle}>
          {/* Glow detrás de la imagen */}
          <div
            className="absolute inset-0 rounded-2xl blur-2xl"
            style={{ background: "radial-gradient(circle, rgba(255,59,48,0.15) 0%, transparent 70%)" }}
          />
          <div
            className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.title}
                fill
                className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="text-8xl opacity-10 absolute inset-0 flex items-center justify-center">📦</span>
            )}
          </div>

          {/* Badge de descuento flotante */}
          {discountPct && (
            <div
              className="absolute -top-3 -right-3 w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-black"
              style={{
                background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                boxShadow: "0 4px 20px rgba(255,59,48,0.5)",
                fontSize: "11px",
              }}
            >
              <span className="text-lg leading-none">-{discountPct}</span>
              <span className="text-[9px]">%OFF</span>
            </div>
          )}
        </div>
      </div>

      {/* Controles */}
      {products.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            ←
          </button>
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            →
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "24px" : "6px",
                  height: "6px",
                  background: i === current ? "#ff3b30" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
            <div
              className="h-full bg-red-500"
              style={{
                width: `${((current + 1) / products.length) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        </>
      )}
    </section>
  );
}