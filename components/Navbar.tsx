"use client";

import Link from "next/link";
import { CartBadge } from "./CartBadge";

interface NavbarProps {
  storeName?: string;
}

export function Navbar({ storeName = "Colaps Store" }: NavbarProps) {
  return (
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
          href="/"
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

      {/* Cart */}
      <CartBadge />
    </nav>
  );
}