const { getPayload } = require('payload');
const configPromise = require('./payload.config.js').default; // Adjust path if needed

async function checkData() {
  const payload = await getPayload({ config: configPromise });
  
  const products = await payload.find({
    collection: 'products',
    limit: 10,
    depth: 1,
  });

  console.log('--- PRODUCTS CHECK ---');
  products.docs.forEach(p => {
    console.log(`Product: ${p.name}`);
    console.log(`Category (Type: ${typeof p.category}, IsArray: ${Array.isArray(p.category)}):`);
    console.log(JSON.stringify(p.category, null, 2));
    if (Array.isArray(p.category)) {
      p.category.forEach(c => {
        console.log(`  - SubCategory Title: ${c.title} (Type: ${typeof c.title})`);
      });
    }
  });

  process.exit(0);
}

checkData();
