# Colaps Store 🏪

Tienda headless con Shopify + Next.js. Cada categoría transforma la estética visual completa del sitio.

## Quick Start

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Estructura

```
app/
├── page.tsx              → Landing principal
├── tecnologia/page.tsx   → Catálogo tech (tema oscuro/azul)
├── belleza/page.tsx      → Catálogo belleza (tema cálido/dorado)
└── hogar/page.tsx        → Catálogo hogar (tema verde/orgánico)

components/
├── Navbar.tsx            → Nav adaptativo al tema
├── Footer.tsx            → Footer
├── ProductCard.tsx       → Card de producto con hover
├── CategoryHero.tsx      → Hero por categoría con glow
└── ThemeProvider.tsx      → Inyecta CSS vars del tema

lib/
└── themes.ts             → Sistema de temas (colores, fonts, gradients)
```

## Cómo funciona el sistema de temas

`lib/themes.ts` define colores, fuentes y radios por categoría. El `ThemeProvider` inyecta las CSS variables en el `<body>`, y Tailwind las consume a través de `tailwind.config.ts`. Así todo el sitio transiciona automáticamente.

## Próximos pasos

1. **Conectar Dropi** — Reemplazar productos placeholder con fetch a la API de Dropi
2. **Conectar Shopify Storefront API** — Carrito y checkout reales
3. **Deploy en Vercel** — `vercel` desde la terminal
4. **Páginas de producto** — `/tecnologia/[slug]`, etc.
5. **Responsive** — Adaptar grid a móvil
