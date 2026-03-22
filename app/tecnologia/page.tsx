import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";
import { EnhancedTrustSection } from "@/components/TrustBadges";
import { CustomerReviews } from "@/components/CustomerReviews";

const theme = themes.tecnologia;

export default async function TecnologiaPage() {
  const [featured, products] = await Promise.all([
    getCollectionProducts("featured-tecnologia", 5),
    getCollectionProducts("tecnologia", 12),
  ]);

  const heroProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col gap-12 pb-20">
        <HeroCarousel theme={theme} products={heroProducts} />
        <ProductGrid
          products={products}
          categorySlug="tecnologia"
          title="Productos"
        />
        <EnhancedTrustSection />
        <CustomerReviews />
      </div>
    </ThemeProvider>
  );
}