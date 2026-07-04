/**
 * Seeds the local DB with ALL products from organichealthshopbuea.com
 * using their public WooCommerce Store API.
 * Images are served via i0.wp.com CDN — publicly accessible.
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function fetchAllProducts() {
  let all = [];
  let page = 1;
  while (true) {
    process.stdout.write(`  Fetching page ${page}...`);
    const url = `https://organichealthshopbuea.com/wp-json/wc/store/v1/products?per_page=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) { console.log(' done'); break; }
    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) { console.log(' done'); break; }
    console.log(` ${products.length} products`);
    all.push(...products);
    page++;
  }
  return all;
}

// Map WooCommerce slugs → our marketplace categories
const WC_CATEGORY_MAP = {
  'herbal-teas': 'Herbal Teas',
  'natural-oil': 'Essential Oils',
  'supplements': 'Natural Supplements',
  'seeds-and-supplements': 'Natural Supplements',
  'vitamins-and-minerals': 'Natural Supplements',
  'antibiotics': 'Natural Supplements',
  'nautural-medicines': 'Natural Supplements',
  'organic-nuts': 'Superfoods',
  'dried-fruits': 'Superfoods',
  'organic-sweeteners': 'Superfoods',
  'grains-and-fufu': 'Superfoods',
  'herbs-and-spices': 'Spices & Seasonings',
  'seasoners': 'Spices & Seasonings',
  'healing-roots': 'Spices & Seasonings',
  'heeling-balm': 'Skin Care',
  'masagers': 'Skin Care',
  'toothpaste': 'Skin Care',
  'face-mask': 'Skin Care',
  'drinkable-ample': 'Detox & Cleanse',
  'weight-gainer': 'Detox & Cleanse',
  'heart-and-nerve-support': 'Natural Supplements',
  'coffee': 'Herbal Teas',
  'eye-drop': 'Natural Supplements',
  'eye-glasses': 'Natural Supplements',
  'gummmies': 'Natural Supplements',
  'whole-sale-retail-product': 'Natural Supplements',
};

function mapCategory(categories) {
  if (!categories || categories.length === 0) return 'Natural Supplements';
  const slug = categories[0].slug.toLowerCase();

  // Direct slug match first
  if (WC_CATEGORY_MAP[slug]) return WC_CATEGORY_MAP[slug];

  // Fallback to keyword matching
  const name = categories[0].name.toLowerCase();
  if (name.includes('tea') || name.includes('coffee')) return 'Herbal Teas';
  if (name.includes('oil')) return 'Essential Oils';
  if (name.includes('nut') || name.includes('fruit') || name.includes('grain') || name.includes('sweetener') || name.includes('honey')) return 'Superfoods';
  if (name.includes('spice') || name.includes('herb') || name.includes('root') || name.includes('season')) return 'Spices & Seasonings';
  if (name.includes('balm') || name.includes('cream') || name.includes('skin') || name.includes('mask') || name.includes('soap') || name.includes('tooth')) return 'Skin Care';
  if (name.includes('detox') || name.includes('cleanse') || name.includes('drink') || name.includes('weight')) return 'Detox & Cleanse';
  if (name.includes('supplement') || name.includes('vitamin') || name.includes('mineral')) return 'Natural Supplements';
  return 'Natural Supplements';
}

function cleanName(name) {
  // Remove long subtitles after colon if total is too long
  if (name.length > 60) {
    const parts = name.split(':');
    return parts[0].trim();
  }
  return name.trim();
}

function stripHtml(html) {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

const categoryPriceRanges = {
  'Herbal Teas': [2500, 5500],
  'Essential Oils': [3500, 12000],
  'Natural Supplements': [3500, 9000],
  'Skin Care': [2000, 7000],
  'Hair Care': [3000, 8000],
  'Superfoods': [3000, 7000],
  'Spices & Seasonings': [1500, 5000],
  'Detox & Cleanse': [3000, 7000],
};

async function main() {
  console.log('\n🌿 Seeding ALL products from organichealthshopbuea.com...\n');

  const allExternal = await fetchAllProducts();
  console.log(`\n  Total fetched: ${allExternal.length} products\n`);

  // Filter: must have images and some description
  const valid = allExternal.filter(p => {
    if (!p.images || p.images.length === 0 || !p.images[0].src) return false;
    const desc = stripHtml(p.short_description || p.description || '');
    return desc.length >= 10;
  });

  console.log(`  Valid (with images + description): ${valid.length}\n`);

  // Clean database
  console.log('  Cleaning database...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: { name: 'Dr. Sarah Chen', email: 'admin@greencure.com', password: hashedPassword, role: 'ADMIN', approved: true },
  });
  const supplier = await prisma.user.create({
    data: { name: 'Organic Health Shop Buea', email: 'supplier@greencure.com', password: hashedPassword, role: 'SUPPLIER', approved: true },
  });
  await prisma.user.create({
    data: { name: 'PharmaLeaf Inc.', email: 'pharma@greencure.com', password: hashedPassword, role: 'SUPPLIER', approved: false },
  });
  const agent = await prisma.user.create({
    data: { name: 'Amadou Diallo', email: 'delivery@greencure.com', password: hashedPassword, role: 'DELIVERY_AGENT', approved: true },
  });
  const customer = await prisma.user.create({
    data: { name: 'Alice Mitchell', email: 'customer@greencure.com', password: hashedPassword, role: 'CUSTOMER', approved: true },
  });

  console.log('  ✅ Users seeded\n');

  // Create ALL products
  const dbProducts = [];
  const categoryCounts = {};

  for (const ext of valid) {
    const name = cleanName(ext.name);
    const category = mapCategory(ext.categories);
    const desc = stripHtml(ext.short_description || ext.description || '').substring(0, 500);
    const imageUrl = ext.images[0].src;

    // Parse price from WooCommerce (in minor units)
    let price = parseInt(ext.prices?.price || '0', 10);
    if (price > 0) {
      price = Math.round(price / 100);
    }
    // Assign realistic price if 0
    if (price <= 0) {
      const [minP, maxP] = categoryPriceRanges[category] || [3000, 6000];
      price = Math.round((minP + Math.random() * (maxP - minP)) / 500) * 500;
    }

    const stock = 10 + Math.floor(Math.random() * 50);

    try {
      const prod = await prisma.product.create({
        data: {
          name,
          description: desc,
          price,
          image: imageUrl,
          category,
          stock,
          supplierId: supplier.id,
        },
      });
      dbProducts.push(prod);
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      process.stdout.write(`\r  🌱 ${dbProducts.length} products seeded...`);
    } catch (err) {
      // Skip duplicates or errors
      console.log(`\n  ⚠️  Skipped "${name}": ${err.message.substring(0, 60)}`);
    }
  }

  console.log(`\n\n  ✅ ${dbProducts.length} products seeded across categories:\n`);
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`     ${cat.padEnd(22)} ${count}`);
    });

  // Create sample orders
  if (dbProducts.length >= 5) {
    const orderProducts = dbProducts.slice(0, 10);

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'PENDING', total: 15500,
        address: '12 Forestry Ave, Molyko, Buea', phone: '+237677123456',
        deliveryAgentId: agent.id,
        items: { create: [
          { productId: orderProducts[0].id, quantity: 2, price: orderProducts[0].price },
          { productId: orderProducts[2].id, quantity: 1, price: orderProducts[2].price },
          { productId: orderProducts[4].id, quantity: 1, price: orderProducts[4].price },
        ]},
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'DELIVERED', total: 8000,
        address: 'Clerk Quarters, Buea Town', phone: '+237677123456',
        deliveryAgentId: agent.id,
        items: { create: [
          { productId: orderProducts[1].id, quantity: 1, price: orderProducts[1].price },
          { productId: orderProducts[3].id, quantity: 1, price: orderProducts[3].price },
        ]},
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'PROCESSING', total: 12000,
        address: 'Mile 17, Buea', phone: '+237677123456',
        items: { create: [
          { productId: orderProducts[5].id, quantity: 1, price: orderProducts[5].price },
          { productId: orderProducts[6].id, quantity: 2, price: orderProducts[6].price },
        ]},
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'CANCELLED', total: 4500,
        address: 'Great Soppo, Buea', phone: '+237677123456',
        items: { create: [
          { productId: orderProducts[7].id, quantity: 1, price: orderProducts[7].price },
        ]},
      },
    });

    await prisma.order.create({
      data: {
        userId: customer.id, status: 'DELIVERED', total: 9500,
        address: 'Bokwango, Buea', phone: '+237677123456',
        deliveryAgentId: agent.id,
        items: { create: [
          { productId: orderProducts[8].id, quantity: 1, price: orderProducts[8].price },
          { productId: orderProducts[9].id, quantity: 1, price: orderProducts[9].price },
        ]},
      },
    });
  }

  // Consultations
  await prisma.consultation.create({
    data: {
      name: 'Alice Mitchell', email: 'customer@greencure.com', phone: '+237677123456',
      date: '2026-07-15', time: '10:00 AM',
      message: 'Looking for advice on natural remedies for chronic sinus support and seasonal allergies.',
      status: 'PENDING',
    },
  });
  await prisma.consultation.create({
    data: {
      name: 'Jean-Pierre Nkomo', email: 'jpnkomo@gmail.com', phone: '+237699887766',
      date: '2026-07-18', time: '2:00 PM',
      message: 'Interested in a comprehensive detox program and weight management support using herbal supplements.',
      status: 'PENDING',
    },
  });
  await prisma.consultation.create({
    data: {
      name: 'Amina Bello', email: 'amina.b@gmail.com', phone: '+237655443322',
      date: '2026-07-20', time: '11:00 AM',
      message: 'Need guidance on natural skincare routine for sensitive skin and eczema management.',
      status: 'APPROVED',
    },
  });

  console.log('\n  ✅ Orders & consultations seeded');
  console.log(`\n🌿 Database fully seeded with ${dbProducts.length} REAL products!\n`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
