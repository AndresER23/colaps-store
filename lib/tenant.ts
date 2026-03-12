import { type CategorySlug, themes } from "./themes";

export interface TenantConfig {
  slug: CategorySlug;
  name: string;
  subdomain: string;
  domain: string;
}

export const tenants: Record<string, TenantConfig> = {
  tech: {
    slug: "tecnologia",
    name: "Colaps Tech",
    subdomain: "tech",
    domain: "tech.colaps.store",
  },
  tecnologia: {
    slug: "tecnologia",
    name: "Colaps Tech",
    subdomain: "tech",
    domain: "tech.colaps.store",
  },
  beauty: {
    slug: "belleza",
    name: "Colaps Beauty",
    subdomain: "beauty",
    domain: "beauty.colaps.store",
  },
  belleza: {
    slug: "belleza",
    name: "Colaps Beauty",
    subdomain: "beauty",
    domain: "beauty.colaps.store",
  },
  hogar: {
    slug: "hogar",
    name: "Colaps Hogar",
    subdomain: "hogar",
    domain: "hogar.colaps.store",
  },
};

/** Devuelve el tenant según el hostname del request */
export function getTenantFromHost(host: string): TenantConfig {
  // 🔥 TEMPORAL: Si estamos en vercel.app o localhost, 
  // el tenant se determinará por la ruta, no por el host
  if (host.includes("vercel.app") || host.includes("localhost")) {
    return tenants.tech; // Devolvemos un default, el middleware manejará la lógica
  }

  // 🎯 PRODUCCIÓN: Extraer subdominio: "tech.colaps.store" → "tech"
  const subdomain = host.split(".")[0].toLowerCase();

  // Si no coincide con un tenant conocido, usar default
  if (!tenants[subdomain]) {
    return tenants.tech;
  }

  return tenants[subdomain];
}

/** Devuelve el tenant según el slug (para usar con rutas) */
export function getTenantFromSlug(slug: string): TenantConfig | null {
  // Buscar por slug o por key
  const tenant = Object.values(tenants).find(t => t.slug === slug);
  if (tenant) return tenant;

  // Buscar directamente por key
  if (tenants[slug]) return tenants[slug];

  return null;
}

/** Devuelve el tema visual del tenant */
export function getTenantTheme(tenant: TenantConfig) {
  return themes[tenant.slug];
}