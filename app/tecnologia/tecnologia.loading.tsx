import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";

const theme = themes.tecnologia;

export default function Loading() {
  return (
    <ThemeProvider theme={theme}>
      <CategoryHero theme={theme} />
      <section className="px-12 pb-20 max-w-[1200px] mx-auto">
        <ProductGridSkeleton count={6} />
      </section>
    </ThemeProvider>
  );
}
