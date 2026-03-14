"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { ShopifyProduct } from "@/lib/queries";
import { calcSalePrice } from "@/lib/pricing";

export interface CartItem {
  product: ShopifyProduct;
  quantity: number;
  variantId: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: ShopifyProduct, variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: number;
  subtotal: number;
  isCreatingCheckout: boolean;
  checkoutUrl: string | null;
  createCheckout: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Marcar como montado solo en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar carrito desde localStorage solo en el cliente
  useEffect(() => {
    if (!isMounted) return;

    try {
      const saved = localStorage.getItem("colaps-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        setItems(parsed);
      }
    } catch (e) {
      console.error("Error loading cart:", e);
    }
  }, [isMounted]);

  // Guardar carrito en localStorage solo en el cliente
  useEffect(() => {
    if (!isMounted) return;

    try {
      if (items.length > 0) {
        localStorage.setItem("colaps-cart", JSON.stringify(items));
      } else {
        localStorage.removeItem("colaps-cart");
      }
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  }, [items, isMounted]);

  const addItem = (product: ShopifyProduct, variantId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === variantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, variantId, quantity }];
    });
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCheckoutUrl(null);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = calcSalePrice(item.product.priceRange.minVariantPrice.amount);
    return sum + price * item.quantity;
  }, 0);

  const createCheckout = async () => {
    if (items.length === 0) return;

    setIsCreatingCheckout(true);
    try {
      const lineItems = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems }),
      });

      if (!response.ok) throw new Error("Failed to create checkout");

      const data = await response.json();
      setCheckoutUrl(data.webUrl);

      if (data.webUrl) {
        window.location.href = data.webUrl;
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Hubo un error al crear el checkout. Intenta de nuevo.");
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
        isCreatingCheckout,
        checkoutUrl,
        createCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}