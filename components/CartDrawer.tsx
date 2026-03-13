"use client";

import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import { getProductImage } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalItems,
    subtotal,
    isCreatingCheckout,
    createCheckout,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeCart}
          style={{ opacity: isOpen ? 1 : 0 }}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Tu Carrito</h2>
            <p className="text-sm text-slate-500">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4 opacity-20">🛒</div>
              <p className="text-slate-500 text-sm">Tu carrito está vacío</p>
              <button
                onClick={closeCart}
                className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const imageUrl = getProductImage(item.product);
                const price = parseFloat(item.product.priceRange.minVariantPrice.amount);
                const total = price * item.quantity;

                return (
                  <div
                    key={item.variantId}
                    className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-20">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 truncate">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {getSalePrice(price.toString())}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="text-sm font-medium text-slate-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white border border-slate-300 rounded text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-xs"
                      >
                        🗑️
                      </button>
                      <p className="text-sm font-bold text-slate-900">
                        {getSalePrice(total.toString())}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 px-6 py-4 space-y-4 bg-slate-50">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Subtotal</span>
              <span className="text-xl font-bold text-slate-900">
                {getSalePrice(subtotal.toString())}
              </span>
            </div>

            {/* Shipping notice */}
            <p className="text-xs text-slate-500 text-center">
              Envío e impuestos calculados al finalizar la compra
            </p>

            {/* Checkout button */}
            <button
              onClick={createCheckout}
              disabled={isCreatingCheckout}
              className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-bold text-sm hover:from-slate-800 hover:to-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreatingCheckout ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Procesando...
                </>
              ) : (
                <>Ir al Checkout →</>
              )}
            </button>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              className="w-full py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}