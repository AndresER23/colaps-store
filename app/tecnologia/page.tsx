import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeroSection } from "@/components/HeroSection";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionProducts } from "@/lib/queries";

const theme = themes.tecnologia;

export default async function TecnologiaPage() {
  const products = await getCollectionProducts("tecnologia", 12);
  const featured = products[0] ?? null;

  return (
    <ThemeProvider theme={theme}>
      <HeroSection theme={theme} featuredProduct={featured} />
      <ProductGrid 
        products={products} 
        categorySlug="tecnologia" 
        title="Tecnología y Gadgets" 
      />
    </ThemeProvider>
  );
}
