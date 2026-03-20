"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/queries";
import { getSalePrice } from "@/lib/pricing";

interface AnimationConfig {
  folderPath: string;
  totalFrames: number;
  productHandle: string; // Handle del producto para construir la URL
  buttonText: string;
}

const ANIMATIONS_BY_CATEGORY: Record<string, AnimationConfig> = {
  tecnologia: {
    folderPath: "/animations/airpodspromax",
    totalFrames: 240,
    productHandle: "audifonos-diadema-airpods-pro-max",
    buttonText: "Comprar Ahora",
  },
};

interface ScrollAnimationProps {
  category: string;
  product: ShopifyProduct; // ✅ Recibe el producto completo
}

export function ScrollAnimation({ category, product }: ScrollAnimationProps) {
  const config = ANIMATIONS_BY_CATEGORY[category];

  if (!config) {
    return null;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const { folderPath, totalFrames, productHandle, buttonText } = config;

  // ✅ Obtener datos dinámicos del producto
  const productName = product.title;
  const productPrice = getSalePrice(product.priceRange.minVariantPrice.amount);
  const productUrl = `/${category}/${productHandle}`;

  // Precargar imágenes
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, "0");
      img.src = `${folderPath}/ezgif-frame-${frameNumber}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        console.error(`Failed to load: ${img.src}`);
        loadedCount++;
        if (loadedCount === totalFrames) {
          setImagesLoaded(true);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;
  }, [folderPath, totalFrames]);

  // Renderizar frame
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[currentFrame - 1];
    if (!img || !img.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = img.width;
    const displayHeight = img.height;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);
    ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
  }, [currentFrame, imagesLoaded]);

  // Detectar visibilidad y animar
  useEffect(() => {
    if (!imagesLoaded || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (entry.isIntersecting && !animationStarted) {
          setAnimationStarted(true);
          let frame = 1;
          const animate = () => {
            if (frame <= totalFrames) {
              setCurrentFrame(frame);
              frame++;
              requestAnimationFrame(animate);
            }
          };
          animate();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px"
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [imagesLoaded, animationStarted, totalFrames]);

  return (
    <div
      ref={sectionRef}
      className="h-screen w-full flex items-center justify-center bg-white"
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        minHeight: "100vh",
      }}
    >
      {!imagesLoaded ? (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin text-4xl">⏳</div>
          <p className="text-slate-600">Cargando experiencia...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-7xl px-4 lg:px-20">
          {/* Animación */}
          <div className="flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto object-contain"
            />
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center gap-8 text-center lg:text-left">
            {/* ✅ Título dinámico del producto */}
            <div
              className="transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px)`
              }}
            >
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight">
                {productName}
              </h2>
            </div>

            {/* ✅ Precio dinámico del producto */}
            <div
              className="transition-all duration-700 delay-200"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px)`
              }}
            >
              <p className="text-4xl lg:text-5xl font-bold text-slate-400">
                {productPrice}
              </p>
            </div>

            {/* Botón */}
            <div
              className="transition-all duration-700 delay-400"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: `translateY(${isVisible ? 0 : 30}px)`
              }}
            >
              <Link
                href={productUrl}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full font-black text-xl shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all w-fit mx-auto lg:mx-0"
              >
                <span>{buttonText}</span>
                <span className="text-2xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}