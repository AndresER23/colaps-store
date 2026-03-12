import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { getCollectionProducts } from "@/lib/queries";

const theme = themes.hogar;

export default async function HogarPage() {
  const products = await getCollectionProducts("hogar", 12);
  return (
    <ThemeProvider theme={theme}>
      <CategoryHero theme={theme} />
      <section className="px-12 pb-20 max-w-[1200px] mx-auto">
        {products.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-text-muted)]">
            <p className="text-4xl mb-4">📦</p>
            <p className="text-lg font-medium">No hay productos disponibles</p>
            <p className="text-sm mt-2">
              Asegurate de tener una colección con handle{" "}
              <code className="bg-[var(--color-bg-secondary)] px-2 py-0.5 rounded">
                "hogar"
              </code>{" "}
              en Shopify.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug="hogar"
              />
            ))}
          </div>
        )}
      </section>
    </ThemeProvider>
  );
}
