"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { CartBadge } from "./CartBadge";
import { AuthModal } from "./AuthModal";

interface NavbarProps {
  storeName?: string;
}

export function Navbar({ storeName = "Colaps Store" }: NavbarProps) {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-xl bg-[var(--color-bg)]/90 border-b border-[var(--color-text)]/5 transition-all duration-500">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
          C
        </div>
        <span className="text-lg font-medium tracking-tight text-[var(--color-text)]">
          {storeName}
        </span>
      </Link>

      {/* Links */}
      <div className="flex gap-8 items-center">
        <Link
          href="/#productos"
          className="text-xs uppercase tracking-[0.04em] font-medium no-underline text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Productos
        </Link>
        <Link
          href="#trust"
          className="text-xs uppercase tracking-[0.04em] font-medium no-underline text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          Garantías
        </Link>
      </div>

      {/* Auth and Cart */}
      <div className="flex items-center gap-6">
        {session ? (
          <div className="flex items-center gap-4 text-xs font-semibold tracking-wide">
            <Link 
              href="/user"
              className="flex items-center gap-2 group no-underline"
            >
              <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all duration-300">
                {session.user?.name?.[0] || '👤'}
              </div>
              <span className="text-[var(--color-text)] opacity-80 uppercase group-hover:opacity-100 transition-opacity">
                Hola, {session.user?.name?.split(' ')[0]}
              </span>
            </Link>
            <div className="h-4 w-[1px] bg-[var(--color-text)]/10" />
            <button 
              onClick={() => signOut()}
              className="text-[#ef4444] uppercase hover:opacity-80 transition-opacity"
            >
              Salir
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuth(true)}
            className="text-xs uppercase tracking-[0.04em] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Iniciar Sesión
          </button>
        )}
        <CartBadge />
      </div>
    </nav>
    <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
  </>
  );
}