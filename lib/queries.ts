import { shopifyFetch } from "./shopify";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  productType: string;
  description: string;
  tags: string[];
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange: {
    minVariantPrice: {
      amount: string;
    };
  };
  images: {
    edges: {
      node: {
        id: string;
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }[];
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  id
  title
  handle
  vendor
  productType
  description
  tags
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  compareAtPriceRange {
    minVariantPrice {
      amount
    }
  }
  images(first: 3) {
    edges {
      node {
        id
        url
        altText
      }
    }
  }
  variants(first: 5) {
    edges {
      node {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;

const GET_COLLECTION_PRODUCTS = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      title
      description
      products(first: $first) {
        edges {
          node {
            ${PRODUCT_FIELDS}
          }
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
    }
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Devuelve los productos de una colección por su handle.
 * El handle debe coincidir con el slug de categoría en Shopify:
 * "tecnologia", "belleza" o "hogar"
 */
export async function getCollectionProducts(
  handle: string,
  limit = 12
): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{
    collection: {
      products: { edges: { node: ShopifyProduct }[] };
    } | null;
  }>(GET_COLLECTION_PRODUCTS, { handle, first: limit });

  if (!data.collection) return [];

  return data.collection.products.edges.map((e) => e.node);
}

/**
 * Devuelve un producto individual por su handle.
 * Usado en las páginas /[category]/[slug]
 */
export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    GET_PRODUCT_BY_HANDLE,
    { handle }
  );

  return data.product;
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/** Formatea el precio a moneda local */
export function formatPrice(amount: string , currencyCode = "USD"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
}

/** Extrae la primera imagen de un producto */
export function getProductImage(product: ShopifyProduct): string | null {
  return product.images.edges[0]?.node.url ?? null;
}

/** Verifica si un producto tiene descuento */
export function hasDiscount(product: ShopifyProduct): boolean {
  const price = parseFloat(product.priceRange.minVariantPrice.amount);
  const compare = parseFloat(
    product.compareAtPriceRange.minVariantPrice.amount
  );
  return compare > 0 && compare > price;
}
