import { notFound } from "next/navigation";
import { themes } from "@/lib/themes";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductDetail } from "@/components/ProductDetail";
import { getProductByHandle, getCollectionProducts } from "@/lib/queries";

const theme = themes.belleza;

export default async function BellezaProductPage({
    params,
}: {
    params: { slug: string };
}) {
    const [product, related] = await Promise.all([
        getProductByHandle(params.slug),
        getCollectionProducts("belleza", 8),
    ]);

    if (!product) notFound();

    const relatedProducts = related.filter((p) => p.handle !== params.slug);

    return (
        <ThemeProvider theme={theme}>
            <ProductDetail
                product={product}
                categorySlug="belleza"
                relatedProducts={relatedProducts}
            />
        </ThemeProvider>
    );
}