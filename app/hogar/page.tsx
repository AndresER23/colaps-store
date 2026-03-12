import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";

const theme = themes.hogar;

export default async function HogarPage() {
  const products = await getCollectionProducts("hogar", 12);
  const featured = products[0] ?? null;

  return (
    <ThemeProvider theme={theme}>
      <HeroSection theme={theme} featuredProduct={featured} />
      <ProductGrid products={products} categorySlug="hogar" title="Productos" />
    </ThemeProvider>
  );
}