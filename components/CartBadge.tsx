"use client";

import { useCart } from "@/contexts/CartContext";

export function CartBadge() {
  const { openCart, totalItems  } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Abrir carrito"
    >
      {/* Cart icon */}
      <svg
        className="w-6 h-6 text-gray-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Badge - por ahora siempre 0 */}
      {totalItems  > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {totalItems }
        </span>
      )}
    </button>
  );
}