import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { TrustBadges } from "@/components/TrustBadges";
import { getCollectionProducts } from "@/lib/queries";

const theme = themes.tecnologia;

export const metadata = {
  title: "Colaps Tech — Gadgets y tecnología con envío gratis",
  description: "Los mejores gadgets y accesorios tech. Envío gratis, pago contraentrega y garantía de 30 días.",
};

export default async function TecnologiaPage() {
  const products = await getCollectionProducts("tecnologia", 12);

  return (
    <ThemeProvider theme={theme}>
      <TrustBadges />
      <CategoryHero theme={theme} />
      <section className="px-12 pb-20 max-w-[1200px] mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-lg font-medium">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} categorySlug="tecnologia" />
            ))}
          </div>
        )}
      </section>
    </ThemeProvider>
  );
}