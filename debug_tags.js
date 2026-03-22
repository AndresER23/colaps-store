const { getCollectionProducts } = require("./lib/queries");

async function run() {
    try {
        const products = await getCollectionProducts("tecnologia", 5);
        console.log("PRODUCTS_START");
        products.forEach(p => {
            console.log(`Product: ${p.title} | Tags: [${p.tags.join(", ")}]`);
        });
        console.log("PRODUCTS_END");
    } catch (e) {
        console.error(e);
    }
}

run();
