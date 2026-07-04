// Quick script to list all WooCommerce categories
async function main() {
  const url = 'https://organichealthshopbuea.com/wp-json/wc/store/v1/products?per_page=100&page=1';
  const res = await fetch(url);
  const products = await res.json();
  
  const cats = {};
  for (const p of products) {
    for (const c of (p.categories || [])) {
      cats[c.slug] = (cats[c.slug] || { name: c.name, count: 0 });
      cats[c.slug].count++;
    }
  }
  
  // Fetch all pages
  for (let page = 2; page <= 6; page++) {
    const r = await fetch(`https://organichealthshopbuea.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
    if (!r.ok) break;
    const prods = await r.json();
    if (!Array.isArray(prods) || prods.length === 0) break;
    for (const p of prods) {
      for (const c of (p.categories || [])) {
        cats[c.slug] = (cats[c.slug] || { name: c.name, count: 0 });
        cats[c.slug].count++;
      }
    }
  }
  
  console.log('\nWooCommerce Categories:\n');
  Object.entries(cats)
    .sort((a, b) => b[1].count - a[1].count)
    .forEach(([slug, { name, count }]) => {
      console.log(`  ${slug.padEnd(40)} ${name.padEnd(35)} ${count}`);
    });
}
main();
