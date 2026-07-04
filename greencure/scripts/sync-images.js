/**
 * Fetches real product images from organichealthshopbuea.com 
 * via their public WooCommerce Store API, then updates local DB.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getExternalProducts() {
  let allProducts = [];
  let page = 1;
  while (true) {
    console.log(`  Fetching page ${page}...`);
    const url = `https://organichealthshopbuea.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) break;
    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) break;
    allProducts.push(...products);
    page++;
  }
  return allProducts;
}

function clean(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function main() {
  console.log('\n🌿 Syncing product images from organichealthshopbuea.com...\n');
  
  const externalProducts = await getExternalProducts();
  console.log(`\n  Found ${externalProducts.length} external products\n`);

  // Log all external product names + their image URLs for reference
  const imageMap = {};
  for (const ext of externalProducts) {
    if (ext.images && ext.images.length > 0) {
      imageMap[ext.name] = ext.images[0].src;
    }
  }

  const localProducts = await prisma.product.findMany();
  console.log(`  Found ${localProducts.length} local products\n`);

  let matched = 0;
  let unmatched = [];

  for (const local of localProducts) {
    const cleanLocal = clean(local.name);
    
    // Try exact match first
    let match = externalProducts.find(ext => clean(ext.name) === cleanLocal);
    
    // Try partial match
    if (!match) {
      match = externalProducts.find(ext => {
        const cleanExt = clean(ext.name);
        return cleanExt.includes(cleanLocal) || cleanLocal.includes(cleanExt);
      });
    }

    // Try word-based fuzzy match
    if (!match) {
      const localWords = cleanLocal.split('').join('');
      match = externalProducts.find(ext => {
        const extName = clean(ext.name);
        // Check if the first significant word matches
        const localFirst = local.name.split(/[\s(]/)[0].toLowerCase();
        const extFirst = ext.name.split(/[\s(]/)[0].toLowerCase();
        return localFirst.length > 3 && (extName.includes(localFirst) || extFirst === localFirst);
      });
    }

    if (match && match.images && match.images.length > 0) {
      const imageUrl = match.images[0].src;
      await prisma.product.update({
        where: { id: local.id },
        data: { image: imageUrl },
      });
      console.log(`  ✅ "${local.name}" → ${match.name}`);
      matched++;
    } else {
      console.log(`  ❌ "${local.name}" — no match found`);
      unmatched.push(local.name);
    }
  }

  console.log(`\n📊 Matched: ${matched} / ${localProducts.length}`);
  
  if (unmatched.length > 0) {
    console.log(`\n⚠️  Unmatched products (will keep current images):`);
    unmatched.forEach(n => console.log(`   - ${n}`));
  }

  // Print available external products for manual mapping
  if (unmatched.length > 0) {
    console.log(`\n📋 Available external products for reference:`);
    Object.entries(imageMap).slice(0, 30).forEach(([name]) => {
      console.log(`   - ${name}`);
    });
  }

  console.log('\n✅ Done!\n');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
