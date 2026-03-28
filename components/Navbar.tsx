"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User as UserIcon, LogOut, ChevronRight } from "lucide-react";
import { CartBadge } from "./CartBadge";
import { AuthModal } from "./AuthModal";

interface NavbarProps {
  storeName?: string;
}

export function Navbar({ storeName = "Colaps Store" }: NavbarProps) {
  const { data: session } = useSession();
  const [showAuth, setShowAuth] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 md:py-5 backdrop-blur-xl bg-[var(--color-bg)]/90 border-b border-[var(--color-text)]/5 transition-all duration-500">
        
        {/* Left: Hamburger (Mobile) */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 -ml-2 text-[var(--color-text)] hover:opacity-70 transition-opacity"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center: Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
            C
          </div>
          <span className="text-lg font-black tracking-tight text-[var(--color-text)] hidden sm:block">
            {storeName}
          </span>
        </Link>

        {/* Center: Desktop Links */}
        <div className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
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

        {/* Right: Auth and Cart */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:block">
            {session ? (
              <div className="flex items-center gap-4 text-xs font-semibold tracking-wide">
                <Link 
                  href="/user"
                  className="flex items-center gap-2 group no-underline"
                >
                  <div className="w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all duration-300">
                    {session.user?.name?.[0] || <UserIcon className="w-4 h-4" />}
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
          </div>
          <CartBadge />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-[280px] bg-[var(--color-bg)] border-r border-white/5 shadow-2xl md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <span className="font-black text-white tracking-tight">{storeName}</span>
                <button onClick={toggleMenu} className="p-2 -mr-2 text-slate-400 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                <Link
                  href="/#productos"
                  onClick={toggleMenu}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-200">Productos</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#trust"
                  onClick={toggleMenu}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-sm font-semibold text-slate-200">Garantías</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Footer / Account */}
              <div className="p-4 border-t border-white/5 bg-black/20">
                {session ? (
                  <div className="space-y-2">
                    <Link
                      href="/user"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    >
                      <UserIcon className="w-5 h-5" />
                      <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider">Mi Cuenta</span>
                        <span className="text-[10px] opacity-70 truncate">{session.user?.name}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        toggleMenu();
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-wider">Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuth(true);
                      toggleMenu();
                    }}
                    className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #ff3b30, #ff6b00)" }}
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}