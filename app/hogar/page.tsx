import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";
import { EnhancedTrustSection } from "@/components/TrustBadges";
import { CustomerReviews } from "@/components/CustomerReviews";

const theme = themes.hogar;

export default async function HogarPage() {
  const [featured, products] = await Promise.all([
    getCollectionProducts("featured-hogar", 5),
    getCollectionProducts("hogar", 12),
  ]);

  const heroProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <ThemeProvider theme={theme}>
      <HeroCarousel theme={theme} products={heroProducts} />
      <ProductGrid products={products} categorySlug="hogar" title="Productos" />
      <EnhancedTrustSection />
      <CustomerReviews />
    </ThemeProvider>
  );
}