import { formatPrice } from "./queries";

// ─── Configuración de precios ─────────────────────────────────────────────────
// Modificá estos valores para ajustar tu margen y costo de envío

export const PRICING = {
  /** Margen de ganancia (0.30 = 30%) */
  PROFIT_MARGIN: 0.40,
  /** Costo de envío que se suma al precio final (en COP) */
  DELIVERY_COST: 20_000,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calcula el precio de venta final a partir del costo base de Shopify.
 * Fórmula: (costo × (1 + margen)) + envío
 */
export function calcSalePrice(amount: string): number {
  const cost = parseFloat(amount);
  return cost * (1 + PRICING.PROFIT_MARGIN) + PRICING.DELIVERY_COST;
}

/**
 * Devuelve el precio de venta formateado en COP.
 */
export function getSalePrice(amount: string, currencyCode = "COP"): string {
  return formatPrice(calcSalePrice(amount).toString(), currencyCode);
}

/**
 * Verifica si hay descuento comparando compareAt vs precio calculado.
 */
export function getSaleDiscount(
  amount: string,
  compareAtAmount: string
): number | null {
  const compare = parseFloat(compareAtAmount);
  if (!compare || compare <= 0) return null;
  const sale = calcSalePrice(amount);
  const discount = Math.round(((compare - sale) / compare) * 100);
  return discount > 0 ? discount : null;
}