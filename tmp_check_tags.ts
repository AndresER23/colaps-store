import { getCollectionProducts } from "./lib/queries";

async function checkTags() {
    const collections = ["tecnologia", "belleza", "hogar"];
    for (const handle of collections) {
        console.log(`\nCollection: ${handle}`);
        const products = await getCollectionProducts(handle, 20);
        if (products.length === 0) {
            console.log("No products found.");
            continue;
        }
        products.forEach(p => {
            console.log(`- ${p.title} | Tags: [${p.tags.join(", ")}] | Vendor: ${p.vendor}`);
        });
    }
}

checkTags().catch(console.error);
