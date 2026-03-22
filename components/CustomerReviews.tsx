"use client"; // Componente de reseñas de clientes

import { motion } from "framer-motion";

interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    comment: string;
    product: string;
    verified: boolean;
}

const reviews: Review[] = [
    {
        id: 1,
        name: "María Rodríguez",
        rating: 5,
        date: "Hace 2 días",
        comment: "Excelente calidad! El producto llegó en 3 días y funciona perfecto. La batería dura mucho más de lo esperado.",
        product: "Smart Watch T500",
        verified: true,
    },
    {
        id: 2,
        name: "Carlos Méndez",
        rating: 5,
        date: "Hace 1 semana",
        comment: "Increíble servicio al cliente. Tuve una duda y me respondieron por WhatsApp en menos de 5 minutos. El producto suena espectacular.",
        product: "AirPods Pro 3",
        verified: true,
    },
    {
        id: 3,
        name: "Ana Sofía Torres",
        rating: 4,
        date: "Hace 2 semanas",
        comment: "Muy buena compra. El producto es tal cual como se muestra. El envío fue rápido a Medellín. Recomendado 100%",
        product: "Audífonos Bose",
        verified: true,
    },
    {
        id: 4,
        name: "Jorge López",
        rating: 5,
        date: "Hace 3 semanas",
        comment: "Pagué contraentrega y todo perfecto. El producto es original y viene con garantía. Ya compré varios productos aquí.",
        product: "Reloj SmartWatch",
        verified: true,
    },
    {
        id: 5,
        name: "Laura Gómez",
        rating: 5,
        date: "Hace 1 mes",
        comment: "Me encantó! Es mi segunda compra y siempre llega todo en perfectas condiciones. Funciona de maravilla.",
        product: "Cargador iPhone 20W",
        verified: true,
    },
    {
        id: 6,
        name: "Diego Ramírez",
        rating: 5,
        date: "Hace 1 mes",
        comment: "Excelente relación calidad-precio. Muy cómodos y el sonido es impresionante. Superó mis expectativas.",
        product: "Airpods Pro Max",
        verified: true,
    },
];

export function CustomerReviews() {
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    const totalReviews = reviews.length;

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
                {/* Header */}
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
                        Lo que dicen nuestros clientes
                    </h2>
                    <p className="text-sm text-slate-400 mb-6">
                        Miles de colombianos ya confían en nosotros
                    </p>

                    {/* Rating Summary */}
                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="text-xl"
                                        style={{ color: i < Math.floor(averageRating) ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="text-2xl font-black text-white">
                                {averageRating.toFixed(1)}
                            </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            <p className="font-semibold">Basado en {totalReviews}+ reseñas</p>
                            <p className="text-xs">98% de satisfacción</p>
                        </div>
                    </div>
                </motion.div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -6 }}
                            className="p-5 rounded-2xl relative group transition-all duration-300"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-[#ff3b30]">
                                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                                </svg>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="text-xs"
                                            style={{ color: i < review.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                {review.verified && (
                                    <span
                                        className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                        style={{
                                            background: "rgba(52,199,89,0.15)",
                                            color: "#34c759",
                                            border: "1px solid rgba(52,199,89,0.3)",
                                        }}
                                    >
                                        ✓ Verificada
                                    </span>
                                )}
                            </div>

                            {/* Comment */}
                            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                                "{review.comment}"
                            </p>

                            {/* Product */}
                            <p className="text-xs font-semibold mb-3" style={{ color: '#ff3b30' }}>
                                {review.product}
                            </p>

                            {/* User Info */}
                            <div
                                className="flex items-center justify-between pt-3"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                        style={{
                                            background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                                        }}
                                    >
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-xs">
                                            {review.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {review.date}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <p className="text-slate-400 text-sm mb-4">
                        ¿Ya compraste con nosotros?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-3 rounded-xl font-bold text-sm text-white transition-all"
                        style={{
                            background: "linear-gradient(135deg, #ff3b30, #ff6b00)",
                            boxShadow: "0 8px 24px rgba(255,59,48,0.4)",
                        }}
                    >
                        Dejá tu reseña y obtené 5% de descuento
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}