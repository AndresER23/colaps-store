"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { ShopifyProduct } from "@/lib/queries";
import { useTracking } from "@/components/RemarketingScripts";

interface AddToCartButtonProps {
  product: ShopifyProduct;
  variantId?: string;
  quantity?: number;
  variant?: "primary" | "secondary" | "hero";
  className?: string;
  children?: React.ReactNode;
}

export function AddToCartButton({
  product,
  variantId,
  quantity = 1,
  variant = "primary",
  className = "",
  children,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { trackEvent } = useTracking();

  // Usar la primera variante si no se especifica
  const selectedVariantId =
    variantId || product.variants.edges[0]?.node.id || "";

  const handleAdd = async () => {
    if (!selectedVariantId) {
      alert("No hay variantes disponibles para este producto");
      return;
    }

    setIsAdding(true);

    // Simular delay mínimo para feedback visual
    await new Promise((resolve) => setTimeout(resolve, 300));

    addItem(product, selectedVariantId, quantity);
    setIsAdding(false);
    setJustAdded(true);

    trackEvent("AddToCart", {
      content_name: product.title,
      value: product.priceRange.minVariantPrice.amount,
      currency: product.priceRange.minVariantPrice.currencyCode,
    });

    // Abrir carrito después de agregar
    setTimeout(() => {
      openCart();
    }, 400);

    // Reset del estado "just added"
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  const baseStyles = "relative overflow-hidden transition-all duration-300 font-bold text-sm";

  const variantStyles = {
    primary:
      "px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-95",
    secondary:
      "px-6 py-3 bg-white text-slate-900 border-2 border-slate-900 rounded-xl hover:bg-slate-50 active:scale-95",
    hero: "px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl text-base shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:opacity-90 hover:scale-[1.01] active:scale-95",
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding || justAdded}
      className={`${baseStyles} ${variantStyles[variant]} ${className} disabled:opacity-70 disabled:cursor-not-allowed`}
    >
      {/* Loading spinner */}
      {isAdding && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <span className="animate-spin">⏳</span>
        </span>
      )}

      {/* Success checkmark */}
      {justAdded && (
        <span className="absolute inset-0 flex items-center justify-center bg-green-500 text-white">
          <span className="animate-bounce">✓</span>
        </span>
      )}

      {/* Content */}
      <span className={isAdding || justAdded ? "opacity-0" : "opacity-100"}>
        {children || "Agregar al carrito"}
      </span>
    </button>
  );
}
