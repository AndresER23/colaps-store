/**
 * Utilidades para procesar URLs de imágenes de Shopify y aplicar transformaciones.
 * Aprovecha el CDN de Shopify para redimensionar y optimizar imágenes.
 */

export interface ImageTransformConfig {
  width?: number;
  height?: number;
  crop?: 'top' | 'center' | 'bottom' | 'left' | 'right';
  format?: 'webp' | 'jpg' | 'pjpg';
  quality?: number;
}

/**
 * Obtiene una URL de imagen de Shopify con transformaciones aplicadas.
 * Ejemple de entrada: https://cdn.shopify.com/s/files/1/0611/4820/1206/products/image.jpg?v=1646243452
 */
export function getShopifyImageUrl(
  url: string | null | undefined,
  config: ImageTransformConfig = {}
): string {
  if (!url) return "";

  try {
    const urlObj = new URL(url);
    
    // Si no es una URL de Shopify CDN, devolver la original
    if (!urlObj.hostname.includes("cdn.shopify.com")) {
      return url;
    }

    const { width, height, crop, format = 'webp' } = config;

    // Agregar parámetros de transformación de Shopify
    if (width) urlObj.searchParams.set("width", width.toString());
    if (height) urlObj.searchParams.set("height", height.toString());
    if (crop) urlObj.searchParams.set("crop", crop);
    if (format) urlObj.searchParams.set("format", format);

    return urlObj.toString();
  } catch (e) {
    return url || "";
  }
}

/**
 * Loader para el componente Image de Next.js que usa el CDN de Shopify
 */
export const shopifyLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return getShopifyImageUrl(src, { 
    width, 
    format: 'webp',
    quality: quality || 85
  });
};
