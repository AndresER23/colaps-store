"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "login" | "register";
  redirectTo?: string;
}

export function AuthModal({ isOpen, onClose, defaultView = "login", redirectTo }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(defaultView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { 
        callbackUrl: redirectTo || "/user" 
      });
    } catch (err) {
      setError("Error al iniciar sesión con Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contraseña incorrectos");
      } else {
        window.location.href = redirectTo || "/user";
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Registrar usuario
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al registrarse");
      }

      // Auto-login después de registro
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Cuenta creada. Por favor inicia sesión.");
        setView("login");
      } else {
        window.location.href = redirectTo || "/bienvenido";
      }
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0a0a0f 0%, #111827 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10">
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: "linear-gradient(90deg, transparent, #ff3b30, transparent)" }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
              {view === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {view === "login" 
                ? "Accedé a tu cuenta para ver tus pedidos" 
                : "Creá una cuenta para rastrear tus pedidos"}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#1f2937",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500">o</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={view === "login" ? handleCredentialsLogin : handleRegister} className="space-y-3">
              {view === "register" && (
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Nombre completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={view === "register"}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30] transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30] transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#ff3b30] transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                  boxShadow: "0 8px 24px rgba(255,59,48,0.3)",
                }}
              >
                {isLoading ? "Cargando..." : view === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
              </motion.button>
            </form>

            {/* Toggle View */}
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  setView(view === "login" ? "register" : "login");
                  setError("");
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {view === "login" ? (
                  <>¿No tenés cuenta? <span className="text-[#ff3b30] font-semibold">Registrate</span></>
                ) : (
                  <>¿Ya tenés cuenta? <span className="text-[#ff3b30] font-semibold">Iniciá sesión</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
