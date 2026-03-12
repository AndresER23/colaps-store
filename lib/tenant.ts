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
  // Extraer subdominio: "tech.colaps.store" → "tech"
  const subdomain = host.split(".")[0].toLowerCase();

  // Si no coincide con un tenant conocido, es el landing principal o default
  if (!tenants[subdomain]) {
    return tenants.tech;
  }

  return tenants[subdomain];
}

/** Devuelve el tema visual del tenant */
export function getTenantTheme(tenant: TenantConfig) {
  return themes[tenant.slug];
}