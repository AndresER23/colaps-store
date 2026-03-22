import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";
import { EnhancedTrustSection } from "@/components/TrustBadges";
import { CustomerReviews } from "@/components/CustomerReviews";

const theme = themes.belleza;

export default async function BellezaPage() {
  const [featured, products] = await Promise.all([
    getCollectionProducts("featured-belleza", 5),
    getCollectionProducts("belleza", 12),
  ]);

  const heroProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <ThemeProvider theme={theme}>
      <HeroCarousel theme={theme} products={heroProducts} />
      <ProductGrid products={products} categorySlug="belleza" title="Productos" />
      <EnhancedTrustSection />
      <CustomerReviews />
    </ThemeProvider>
  );
}