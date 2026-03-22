"use client";

import { motion } from "framer-motion";

const trustFeatures = [
  {
    icon: "🚚",
    title: "Envío Gratis a toda Colombia",
    description: "Sin mínimo de compra. Entregamos en 3 a 7 días hábiles a cualquier ciudad.",
  },
  {
    icon: "💵",
    title: "Pago Contraentrega",
    description: "Pagás cuando el producto llega a tu puerta. Sin tarjeta, sin riesgo.",
  },
  {
    icon: "🛡️",
    title: "Garantía de 30 días",
    description: "Si no quedás satisfecho, te devolvemos el dinero. Sin preguntas.",
  },
  {
    icon: "📞",
    title: "Soporte 24/7",
    description: "Nuestro equipo está disponible para ayudarte vía WhatsApp cuando lo necesites.",
  },
];

const statsData = [
  { label: "Clientes Felices", value: "10,000+", icon: "🏆" },
  { label: "Productos Entregados", value: "25,000+", icon: "📦" },
  { label: "Ciudades en Colombia", value: "50+", icon: "📍" },
  { label: "Satisfacción", value: "98%", icon: "⭐" },
];

export function EnhancedTrustSection() {
  return (
    <section
      className="mx-4 my-8 rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #111827 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Línea superior de acento */}
      <div
        className="h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #ff3b30, transparent)" }}
      />

      <div className="px-6 py-12 lg:px-12">
        {/* Título de la sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl lg:text-4xl font-black mb-3 text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Comprá con total confianza
          </h2>
          <p className="text-sm text-slate-400">
            Tu satisfacción es nuestra prioridad. Ofrecemos las mejores garantías del mercado.
          </p>
        </motion.div>

        {/* Grid de características */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-5 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, rgba(255,59,48,0.15), rgba(255,107,0,0.15))",
                  border: "1px solid rgba(255,59,48,0.2)",
                }}
              >
                {feature.icon}
              </div>

              <h3 className="font-bold text-sm mb-2 text-white">
                {feature.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 lg:p-10"
          style={{
            background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
            boxShadow: "0 16px 48px rgba(255,59,48,0.3)",
          }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <p
                  className="text-3xl lg:text-4xl font-black text-white mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </p>
                <p className="text-white/80 text-xs font-medium">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Métodos de pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-green-400">🔒</span>
            <p className="text-slate-400 font-semibold text-sm">
              Pagos 100% Seguros
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Efectivo", "Tarjetas", "PSE", "Nequi", "Daviplata"].map((method, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-lg font-bold text-xs text-slate-300 transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}