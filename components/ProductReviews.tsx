"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
    helpful: number;
}

interface ProductReviewsProps {
    productTitle: string;
}

// ─── Seed reviews per product ──────────────────────────────────────────────────

const REVIEW_POOL: Record<string, Review[]> = {
    default: [
        { id: 1, name: "María R.", rating: 5, date: "Hace 3 días", comment: "Excelente producto! Llegó súper rápido y funciona de maravilla. Totalmente recomendado.", verified: true, helpful: 12 },
        { id: 2, name: "Carlos M.", rating: 4, date: "Hace 1 semana", comment: "Buena calidad. El envío fue rápido a Medellín. Solo le faltó un poco mejor el empaque.", verified: true, helpful: 8 },
        { id: 3, name: "Ana S.", rating: 5, date: "Hace 2 semanas", comment: "Me encantó! Pagué contraentrega y todo perfecto. Ya es mi segunda compra acá.", verified: true, helpful: 15 },
    ],
    "AUDIFONOS BOSE CANCELACION RUIDO": [
        { id: 1, name: "Santiago G.", rating: 5, date: "Hace 2 días", comment: "Increíble calidad de sonido y la cancelación de ruido es perfecta. Los uso para trabajar y son espectaculares.", verified: true, helpful: 24 },
        { id: 2, name: "Valentina P.", rating: 5, date: "Hace 1 semana", comment: "Son muy cómodos, los uso todo el día y no molestan. El sonido es premium.", verified: true, helpful: 18 },
        { id: 3, name: "Diego R.", rating: 4, date: "Hace 3 semanas", comment: "Excelente producto. La batería dura bastante. Recomendados 100%.", verified: true, helpful: 11 },
    ],
    "AIRPODS PRO 3": [
        { id: 1, name: "Laura G.", rating: 5, date: "Hace 3 días", comment: "Sonido espectacular y se conectan al instante con el iPhone. Muy satisfecha con la compra.", verified: true, helpful: 20 },
        { id: 2, name: "Andrés C.", rating: 5, date: "Hace 1 semana", comment: "Son originales y la calidad se nota. El estuche carga súper rápido.", verified: true, helpful: 14 },
        { id: 3, name: "Camila V.", rating: 4, date: "Hace 2 semanas", comment: "Muy buenos para hacer ejercicio. Se mantienen bien en el oído.", verified: true, helpful: 9 },
    ],
    "SMART WATCH T500": [
        { id: 1, name: "Jorge L.", rating: 5, date: "Hace 4 días", comment: "Increíble reloj por este precio. Mide el ritmo cardíaco y la pantalla se ve muy bien.", verified: true, helpful: 22 },
        { id: 2, name: "Paula M.", rating: 5, date: "Hace 1 semana", comment: "Lo uso para el gimnasio y funciona perfecto. La batería dura como 3 días.", verified: true, helpful: 16 },
        { id: 3, name: "Mateo S.", rating: 4, date: "Hace 3 semanas", comment: "Buen producto por el precio. Las notificaciones funcionan bien con Android.", verified: true, helpful: 7 },
    ],
};

function getReviewsForProduct(title: string): Review[] {
    // Try exact match first, then partial match
    if (REVIEW_POOL[title]) return REVIEW_POOL[title];
    const key = Object.keys(REVIEW_POOL).find(
        (k) => k !== "default" && title.toLowerCase().includes(k.toLowerCase())
    );
    return key ? REVIEW_POOL[key] : REVIEW_POOL.default;
}

// ─── Stars Component ──────────────────────────────────────────────────────────

function Stars({ rating, size = "text-sm", interactive = false, onChange }: {
    rating: number;
    size?: string;
    interactive?: boolean;
    onChange?: (r: number) => void;
}) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={`${size} transition-transform ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}`}
                    style={{
                        color: star <= (hover || rating) ? "#fbbf24" : "rgba(255,255,255,0.15)",
                    }}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductReviews({ productTitle }: ProductReviewsProps) {
    const reviews = getReviewsForProduct(productTitle);
    const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [formName, setFormName] = useState("");
    const [formRating, setFormRating] = useState(5);
    const [formComment, setFormComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [localReviews, setLocalReviews] = useState<Review[]>([]);

    const allReviews = [...localReviews, ...reviews];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim() || !formComment.trim()) return;

        const newReview: Review = {
            id: Date.now(),
            name: formName.trim(),
            rating: formRating,
            date: "Ahora",
            comment: formComment.trim(),
            verified: false,
            helpful: 0,
        };

        setLocalReviews((prev) => [newReview, ...prev]);
        setFormName("");
        setFormComment("");
        setFormRating(5);
        setSubmitted(true);
        setShowForm(false);
        setTimeout(() => setSubmitted(false), 4000);
    };

    // ── Rating distribution ───────────────────────────────────────────────────

    const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: allReviews.filter((r) => r.rating === star).length,
        pct: Math.round((allReviews.filter((r) => r.rating === star).length / allReviews.length) * 100),
    }));

    return (
        <section className="max-w-[1280px] mx-auto px-6 py-10">
            <div
                className="rounded-3xl overflow-hidden"
                style={{
                    background: "color-mix(in srgb, var(--color-bg-secondary) 50%, var(--color-card-bg))",
                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                }}
            >
                <div className="p-6 lg:p-10">
                    {/* ═══ Header ═══ */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
                        {/* Left: Title + Summary */}
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1 h-6 rounded-full" style={{ background: "var(--color-accent)" }} />
                                <h2
                                    className="text-2xl font-black"
                                    style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                                >
                                    Opiniones del producto
                                </h2>
                            </div>
                            <p className="text-sm ml-4" style={{ color: "var(--color-text-muted)" }}>
                                {allReviews.length} reseña{allReviews.length !== 1 ? "s" : ""} de compradores verificados
                            </p>
                        </div>

                        {/* Right: Rating summary + distribution */}
                        <div className="flex items-start gap-6">
                            {/* Big number */}
                            <div className="text-center">
                                <p className="text-4xl font-black" style={{ color: "var(--color-text)" }}>
                                    {avgRating.toFixed(1)}
                                </p>
                                <Stars rating={Math.round(avgRating)} size="text-base" />
                            </div>
                            {/* Bar chart */}
                            <div className="space-y-1 min-w-[160px]">
                                {ratingDist.map((d) => (
                                    <div key={d.star} className="flex items-center gap-2 text-xs">
                                        <span className="w-3 font-bold" style={{ color: "var(--color-text-muted)" }}>{d.star}</span>
                                        <span style={{ color: "#fbbf24", fontSize: "10px" }}>★</span>
                                        <div
                                            className="flex-1 h-2 rounded-full overflow-hidden"
                                            style={{ background: "color-mix(in srgb, var(--color-text) 8%, transparent)" }}
                                        >
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${d.pct}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: 0.1 }}
                                                className="h-full rounded-full"
                                                style={{ background: "#fbbf24" }}
                                            />
                                        </div>
                                        <span className="w-8 text-right" style={{ color: "var(--color-text-muted)" }}>
                                            {d.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ═══ Write Review Button ═══ */}
                    <div className="mb-8">
                        <AnimatePresence>
                            {submitted && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-3 rounded-xl text-sm font-semibold text-center"
                                    style={{
                                        background: "rgba(52,199,89,0.12)",
                                        color: "#34c759",
                                        border: "1px solid rgba(52,199,89,0.3)",
                                    }}
                                >
                                    ✓ ¡Gracias por tu reseña!
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!showForm ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowForm(true)}
                                className="w-full py-3 rounded-xl text-sm font-bold transition-all"
                                style={{
                                    background: "var(--color-accent)",
                                    color: "#fff",
                                    boxShadow: "0 4px 16px color-mix(in srgb, var(--color-accent) 30%, transparent)",
                                }}
                            >
                                ✍️ Escribir una reseña
                            </motion.button>
                        ) : (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmit}
                                className="space-y-4 p-5 rounded-2xl"
                                style={{
                                    background: "color-mix(in srgb, var(--color-text) 3%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                                        Tu opinión
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="text-xs opacity-50 hover:opacity-100"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        ✕ Cerrar
                                    </button>
                                </div>

                                {/* Name */}
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="Tu nombre"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-transparent outline-none text-sm transition-all focus:ring-2"
                                    style={{
                                        color: "var(--color-text)",
                                        border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
                                        // @ts-ignore
                                        "--tw-ring-color": "var(--color-accent)",
                                    }}
                                />

                                {/* Rating */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                                        Calificación
                                    </span>
                                    <Stars rating={formRating} size="text-2xl" interactive onChange={setFormRating} />
                                </div>

                                {/* Comment */}
                                <textarea
                                    value={formComment}
                                    onChange={(e) => setFormComment(e.target.value)}
                                    placeholder="¿Qué te pareció el producto?"
                                    required
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl bg-transparent outline-none text-sm resize-none transition-all focus:ring-2"
                                    style={{
                                        color: "var(--color-text)",
                                        border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
                                        // @ts-ignore
                                        "--tw-ring-color": "var(--color-accent)",
                                    }}
                                />

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                                    style={{
                                        background: "var(--color-accent)",
                                        boxShadow: "0 4px 16px color-mix(in srgb, var(--color-accent) 30%, transparent)",
                                    }}
                                >
                                    Publicar reseña
                                </button>
                            </motion.form>
                        )}
                    </div>

                    {/* ═══ Reviews List ═══ */}
                    <div className="space-y-4">
                        {allReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="p-5 rounded-2xl transition-all"
                                style={{
                                    background: "color-mix(in srgb, var(--color-text) 3%, transparent)",
                                    border: "1px solid color-mix(in srgb, var(--color-text) 6%, transparent)",
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
                                            style={{ background: "var(--color-accent)" }}
                                        >
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                                                    {review.name}
                                                </p>
                                                {review.verified && (
                                                    <span
                                                        className="text-[9px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                                        style={{
                                                            background: "rgba(52,199,89,0.12)",
                                                            color: "#34c759",
                                                            border: "1px solid rgba(52,199,89,0.25)",
                                                        }}
                                                    >
                                                        ✓ Compra verificada
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                                                {review.date}
                                            </p>
                                        </div>
                                    </div>
                                    <Stars rating={review.rating} size="text-xs" />
                                </div>

                                {/* Comment */}
                                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--color-text)" }}>
                                    {review.comment}
                                </p>

                                {/* Helpful */}
                                {review.helpful > 0 && (
                                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                                        👍 {review.helpful} personas encontraron útil esta reseña
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
