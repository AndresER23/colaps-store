"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "@/app/user/actions";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
}

export function EditProfileModal({ isOpen, onClose, initialData }: EditProfileModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await updateProfile(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[var(--color-bg)] border border-[var(--color-text)]/10 shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
                  Editar Perfil
                </h2>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-[var(--color-text)]/5 flex items-center justify-center hover:bg-[var(--color-text)]/10 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/10 focus:outline-none focus:border-[var(--color-accent)] transition-all font-medium"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/10 focus:outline-none focus:border-[var(--color-accent)] transition-all font-medium"
                    placeholder="300 123 4567"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Dirección de Envío
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/10 focus:outline-none focus:border-[var(--color-accent)] transition-all font-medium"
                    placeholder="Calle 123 #45-67"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-wider mb-2 block">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/10 focus:outline-none focus:border-[var(--color-accent)] transition-all font-medium"
                    placeholder="Bogotá"
                  />
                </div>

                {error && (
                  <p className="text-sm font-bold text-red-500 text-center animate-shake">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[var(--color-accent)] text-white font-black shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  style={{ background: "linear-gradient(135deg, #ff3b30, #ff6b00)" }}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
