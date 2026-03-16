import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const theme = themes.tecnologia;

export default async function TecnologiaPage() {
  const [featured, products] = await Promise.all([
    getCollectionProducts("featured-tecnologia", 5),
    getCollectionProducts("tecnologia", 12),
  ]);

  const heroProducts = featured.length > 0 ? featured : products.slice(0, 3);

  // ✅ Buscar el producto específico para la animación
  // Puedes cambiar el handle si quieres usar otro producto
  const animationProductHandle = "audifonos-diadema-airpods-pro-max";
  const animationProduct =
    [...featured, ...products].find(p => p.handle === animationProductHandle)
    || products[0]; // Fallback al primer producto si no encuentra el específico

  return (
    <ThemeProvider theme={theme}>
      {/* ✅ Contenedor con Scroll Snap */}
      <div
        className="scroll-snap-container"
        style={{
          scrollSnapType: "y mandatory",
          overflowY: "scroll",
          height: "100vh",
        }}
      >
        {/* ═══ SECCIÓN 1: Hero Carousel ═══ */}
        <div
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <HeroCarousel theme={theme} products={heroProducts} />
        </div>

        {/* ═══ SECCIÓN 2: Animación ═══ */}
        {/* ✅ Pasar el producto como prop */}
        <ScrollAnimation category="tecnologia" product={animationProduct} />

        {/* ═══ SECCIÓN 3: Grilla de Productos ═══ */}
        <div
          style={{
            scrollSnapAlign: "start",
            scrollSnapStop: "always",
            minHeight: "100vh",
            padding: "2rem 0",
          }}
        >
          <ProductGrid
            products={products}
            categorySlug="tecnologia"
            title="Productos"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}