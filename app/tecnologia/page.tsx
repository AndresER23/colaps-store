import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";

const theme = themes.tecnologia;

export default async function TecnologiaPage() {
  const [featured, products] = await Promise.all([
    getCollectionProducts("featured-tecnologia", 5),
    getCollectionProducts("tecnologia", 12),
  ]);

  const heroProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <ThemeProvider theme={theme}>
      <HeroCarousel theme={theme} products={heroProducts} />
      <ProductGrid products={products} categorySlug="tecnologia" title="Productos" />
    </ThemeProvider>
  );
}