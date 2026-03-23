"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SocialFloatingButtonsProps {
    whatsappNumber: string;
    instagramUser: string;
    messengerUser: string;
}

export function SocialFloatingButtons({
    whatsappNumber,
    instagramUser,
    messengerUser
}: SocialFloatingButtonsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const buttons = [
        {
            name: "WhatsApp",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            ),
            url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Tengo una consulta")}`,
            color: "linear-gradient(135deg, #25d366, #128c7e)",
            shadow: "rgba(37,211,102,0.4)"
        },
        {
            name: "Instagram",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            url: `https://ig.me/m/${instagramUser}`,
            color: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
            shadow: "rgba(253,29,29,0.35)"
        },
        {
            name: "Messenger",
            icon: (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.303 2.254.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.291 14.193l-3.076-3.275-5.995 3.275 6.592-7.005 3.125 3.275 5.946-3.275-6.592 7.005z" />
                </svg>
            ),
            url: `https://m.me/${messengerUser}`,
            color: "linear-gradient(135deg, #0084ff, #00c6ff)",
            shadow: "rgba(0,132,255,0.4)"
        }
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <div className="flex flex-col gap-3 items-end">
                        {buttons.map((btn, i) => (
                            <motion.a
                                key={btn.name}
                                href={btn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ scale: 0, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0, opacity: 0, y: 20 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-xl relative group"
                                style={{
                                    background: btn.color,
                                    boxShadow: `0 6px 16px ${btn.shadow}`,
                                }}
                            >
                                {btn.icon}
                                {/* Tooltip */}
                                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-wider">
                                    {btn.name}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl relative z-10"
                style={{
                    background: isOpen ? "#1f2937" : "linear-gradient(135deg, #25d366, #128c7e)",
                    boxShadow: isOpen ? "0 8px 24px rgba(0,0,0,0.2)" : "0 8px 24px rgba(37,211,102,0.4)",
                }}
            >
                <div className="relative w-6 h-6">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.svg
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                viewBox="0 0 24 24"
                                className="absolute inset-0 w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key="app"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                viewBox="0 0 24 24"
                                className="absolute inset-0 w-6 h-6"
                                fill="currentColor"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </div>

                {/* Badge if closed */}
                {!isOpen && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[10px] font-black flex items-center justify-center border-2 border-white shadow-lg"
                    >
                        3
                    </motion.span>
                )}
            </motion.button>
        </div>
    );
}
