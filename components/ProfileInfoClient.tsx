"use client";

import { useState } from "react";
import { EditProfileModal } from "./EditProfileModal";
import Link from "next/link";

interface ProfileInfoClientProps {
  user: {
    name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
  };
}

export function ProfileInfoClient({ user }: ProfileInfoClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialData = {
    name: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black mb-6">Información</h2>
      
      <div className="p-8 rounded-3xl bg-[var(--color-bg-secondary)] border border-[var(--color-text)]/5 space-y-6">
        <div>
          <h4 className="text-xs font-black text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Datos de Envío</h4>
          <div className="space-y-2">
            <p className="font-bold">{user.address || "Sin dirección"}</p>
            <p className="text-sm opacity-70 font-medium">{user.city || "Ciudad no especificada"}</p>
            <p className="text-sm opacity-70 font-medium">{user.phone || "Teléfono no especificado"}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--color-text)]/10">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 rounded-xl border border-[var(--color-text)]/10 text-sm font-bold hover:bg-[var(--color-text)]/5 transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      </div>

      <div 
        className="p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-indigo-500/10"
        style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
      >
        <div className="relative z-10">
          <h3 className="text-xl font-black mb-2">Soporte VIP</h3>
          <p className="text-sm opacity-80 mb-6 font-medium">¿Necesitas ayuda con un pedido o tienes alguna duda?</p>
          <Link 
            href="https://wa.me/message/COLAPS" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-indigo-600 font-bold text-sm hover:scale-105 transition-transform shadow-lg"
          >
            WhatsApp Support
          </Link>
        </div>
        <div className="absolute top-0 right-0 p-4 text-6xl opacity-20 rotate-12 pointer-events-none">💬</div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={initialData} 
      />
    </div>
  );
}
