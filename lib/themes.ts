export type CategorySlug = "tecnologia" | "belleza" | "hogar";

export interface CategoryTheme {
  slug: CategorySlug;
  name: string;
  tagline: string;
  accent: string;
  accentLight: string;
  bg: string;
  bgSecondary: string;
  text: string;
  textMuted: string;
  cardBg: string;
  gradient: string;
  radiusCard: string;
  fontDisplay: string;
  fontBody: string;
}

export const themes: Record<CategorySlug, CategoryTheme> = {
  tecnologia: {
    slug: "tecnologia",
    name: "Tecnología",
    tagline: "Engineered to inspire.",
    accent: "#0071e3",
    accentLight: "#147ce5",
    bg: "#000000",
    bgSecondary: "#111111",
    text: "#f5f5f7",
    textMuted: "#86868b",
    cardBg: "#1d1d1f",
    gradient: "linear-gradient(135deg, #0071e3 0%, #00c7ff 100%)",
    radiusCard: "16px",
    fontDisplay: "'SF Pro Display', 'Helvetica Neue', sans-serif",
    fontBody: "'SF Pro Text', 'Helvetica Neue', sans-serif",
  },
  belleza: {
    slug: "belleza",
    name: "Belleza",
    tagline: "Ritual. Refinement. Radiance.",
    accent: "#c4a882",
    accentLight: "#d4b892",
    bg: "#fdf8f4",
    bgSecondary: "#f5ece3",
    text: "#2c2420",
    textMuted: "#8a7d74",
    cardBg: "#ffffff",
    gradient: "linear-gradient(135deg, #c4a882 0%, #e8d5c0 100%)",
    radiusCard: "24px",
    fontDisplay: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', sans-serif",
  },
  hogar: {
    slug: "hogar",
    name: "Hogar",
    tagline: "Where comfort meets intention.",
    accent: "#5a7247",
    accentLight: "#6a8257",
    bg: "#f7f5f0",
    bgSecondary: "#edeae2",
    text: "#2a2a22",
    textMuted: "#7a7a6e",
    cardBg: "#ffffff",
    gradient: "linear-gradient(135deg, #5a7247 0%, #8fa97a 100%)",
    radiusCard: "20px",
    fontDisplay: "'Playfair Display', Georgia, serif",
    fontBody: "'Inter', sans-serif",
  },
};

/**
 * Genera las CSS variables a partir de un tema.
 * Se inyectan en el layout de cada categoría.
 */
export function themeToCSS(theme: CategoryTheme): Record<string, string> {
  return {
    "--color-accent": theme.accent,
    "--color-accent-light": theme.accentLight,
    "--color-bg": theme.bg,
    "--color-bg-secondary": theme.bgSecondary,
    "--color-text": theme.text,
    "--color-text-muted": theme.textMuted,
    "--color-card-bg": theme.cardBg,
    "--radius-card": theme.radiusCard,
    "--font-display": theme.fontDisplay,
    "--font-body": theme.fontBody,
  };
}

/** Devuelve todas las slugs de categoría para generateStaticParams */
export function getAllCategories(): CategorySlug[] {
  return Object.keys(themes) as CategorySlug[];
}
