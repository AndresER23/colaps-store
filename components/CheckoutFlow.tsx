"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { AuthModal } from "./AuthModal";
import { useTracking } from "./RemarketingScripts";
import { useEffect } from "react";

export function CheckoutFlow() {
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [asGuest, setAsGuest] = useState(false);
  const { trackEvent } = useTracking();

  // Track InitiateCheckout when the user reaches this page
  useEffect(() => {
    trackEvent("InitiateCheckout", {
      currency: "COP",
    });
  }, []);

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
  });

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Procesar pedido
    const orderData = {
      ...formData,
      userId: (session?.user as any)?.id || null, // null si es invitado
      items: [], // desde tu carrito
      total: 0,
    };

    console.log("Procesando pedido:", orderData);
  };

  // Si ya está logueado, mostrar formulario directo
  if (session) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-black mb-6">Completá tu pedido</h2>
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* Formulario normal */}
          {/* ... campos ... */}
          <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#ff3b30] to-[#ff6b00] rounded-xl text-white font-bold">
            Confirmar Pedido
          </button>
        </form>
      </div>
    );
  }

  // Si NO está logueado, mostrar opciones
  if (!asGuest) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div 
          className="rounded-2xl p-8 text-center"
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #111827 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="text-3xl font-black mb-3 text-white">
            ¿Cómo querés continuar?
          </h2>
          <p className="text-slate-400 mb-8">
            Podés crear una cuenta para trackear tu pedido o continuar como invitado
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Opción 1: Crear cuenta */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAuthModal(true)}
              className="p-6 rounded-xl text-left transition-all"
              style={{
                background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                boxShadow: "0 8px 24px rgba(255,59,48,0.3)",
              }}
            >
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Crear cuenta
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Rastreá tu pedido, guardá favoritos y recibí ofertas exclusivas
              </p>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>✓</span> Historial de pedidos
              </div>
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span>✓</span> Ofertas personalizadas
              </div>
            </motion.button>

            {/* Opción 2: Continuar como invitado */}
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAsGuest(true)}
              className="p-6 rounded-xl text-left transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">
                Continuar como invitado
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Comprá rápido sin necesidad de crear una cuenta
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>✓</span> Checkout rápido
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>✓</span> Sin formularios extra
              </div>
            </motion.button>
          </div>

          <p className="text-xs text-slate-500 mt-6">
            Podés crear una cuenta después de tu compra
          </p>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          redirectTo="/checkout"
        />
      </div>
    );
  }

  // Checkout como invitado
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-white">Completá tu pedido</h2>
        <button
          onClick={() => setShowAuthModal(true)}
          className="text-sm text-[#ff3b30] hover:underline"
        >
          ¿Querés crear una cuenta?
        </button>
      </div>

      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Nombre completo</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30]"
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30]"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Teléfono</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30]"
            placeholder="300 123 4567"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Dirección de envío</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30]"
            placeholder="Calle 123 #45-67"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1.5 block">Ciudad</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30]"
            placeholder="Bogotá"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 rounded-xl font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
            boxShadow: "0 8px 24px rgba(255,59,48,0.3)",
          }}
        >
          Confirmar Pedido
        </motion.button>

        {/* Sugerencia de crear cuenta */}
        <div 
          className="p-4 rounded-lg text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm text-slate-400 mb-2">
            💡 <strong className="text-white">Consejo:</strong> Creá una cuenta después de tu compra para rastrear tu pedido
          </p>
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="text-xs text-[#ff3b30] hover:underline"
          >
            Crear cuenta ahora →
          </button>
        </div>
      </form>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="register"
        redirectTo="/checkout"
      />
    </div>
  );
}
