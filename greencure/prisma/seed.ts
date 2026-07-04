import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿 Seeding GreenCure database with real product data...');

  // Clean DB
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Chen',
      email: 'admin@greencure.com',
      password: hashedPassword,
      role: 'ADMIN',
      approved: true,
    },
  });

  const supplierApproved = await prisma.user.create({
    data: {
      name: 'Organic Health Shop Buea',
      email: 'supplier@greencure.com',
      password: hashedPassword,
      role: 'SUPPLIER',
      approved: true,
    },
  });

  const supplierPending = await prisma.user.create({
    data: {
      name: 'PharmaLeaf Inc.',
      email: 'pharma@greencure.com',
      password: hashedPassword,
      role: 'SUPPLIER',
      approved: false,
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: 'Amadou Diallo',
      email: 'delivery@greencure.com',
      password: hashedPassword,
      role: 'DELIVERY_AGENT',
      approved: true,
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Alice Mitchell',
      email: 'customer@greencure.com',
      password: hashedPassword,
      role: 'CUSTOMER',
      approved: true,
    },
  });

  console.log('✅ Users seeded');

  // ─── Real Products from organichealthshopbuea.com ────────────────────
  const products = [
    // ── Herbal Teas ──
    {
      name: 'Moringa Leaf Tea',
      description: 'Premium dried moringa leaves for a nutrient-rich herbal infusion. Known as the "miracle tree," moringa provides essential vitamins, minerals, and antioxidants for daily vitality.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop',
      category: 'Herbal Teas',
      stock: 45,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Fever Grass Tea (Lemongrass)',
      description: 'Refreshing Cameroonian lemongrass herbal infusion for digestion, detox, and natural energy. Traditionally used for fever reduction and immune support.',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=600&h=600&fit=crop',
      category: 'Herbal Teas',
      stock: 60,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Hibiscus Flower Tea (Bissap)',
      description: 'Deep crimson hibiscus flowers for a tart, refreshing tea packed with vitamin C. Supports healthy blood pressure and cardiovascular function.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=600&fit=crop',
      category: 'Herbal Teas',
      stock: 35,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Ginger Root Tea',
      description: 'Strong and warming organic ginger root tea. Aids digestion, reduces nausea, and provides natural anti-inflammatory support. Hand-harvested from local farms.',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop',
      category: 'Herbal Teas',
      stock: 50,
      supplierId: supplierApproved.id,
    },

    // ── Essential Oils ──
    {
      name: 'Pure Neem Oil',
      description: 'Cold-pressed neem oil for skin restoration, hair care, and natural pest control. Rich in fatty acids and vitamin E for deep nourishment.',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
      category: 'Essential Oils',
      stock: 20,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Eucalyptus Essential Oil',
      description: 'Steam-distilled eucalyptus oil for respiratory relief and aromatherapy. Opens airways, clears congestion, and provides antimicrobial protection.',
      price: 6500,
      image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=600&fit=crop',
      category: 'Essential Oils',
      stock: 15,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Coconut Oil (Extra Virgin)',
      description: 'Cold-pressed extra virgin coconut oil for cooking, skin, and hair care. A versatile superfood oil with antimicrobial and moisturizing properties.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&h=600&fit=crop',
      category: 'Essential Oils',
      stock: 30,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Black Seed Oil (Nigella Sativa)',
      description: 'Premium cold-pressed black seed oil, known as "the remedy for everything except death." Supports immunity, digestion, and overall vitality.',
      price: 8500,
      image: 'https://images.unsplash.com/photo-1611241893603-3c228ee1bbfa?w=600&h=600&fit=crop',
      category: 'Essential Oils',
      stock: 12,
      supplierId: supplierApproved.id,
    },

    // ── Natural Supplements ──
    {
      name: 'Moringa Powder (200g)',
      description: 'Finely ground moringa leaf powder packed with iron, calcium, and protein. Add to smoothies, soups, or water for a natural nutritional boost.',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1622467931646-5e92e1a286b3?w=600&h=600&fit=crop',
      category: 'Natural Supplements',
      stock: 40,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Spirulina Powder',
      description: 'Organic spirulina algae powder, a complete protein source with B-vitamins and iron. Supports energy, detoxification, and immune system function.',
      price: 7500,
      image: 'https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=600&h=600&fit=crop',
      category: 'Natural Supplements',
      stock: 18,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Baobab Fruit Powder',
      description: 'Wild-harvested baobab fruit powder rich in vitamin C, fiber, and antioxidants. A tangy superfood for smoothies and natural energy drinks.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf71?w=600&h=600&fit=crop',
      category: 'Natural Supplements',
      stock: 25,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Activated Charcoal Capsules',
      description: 'Food-grade activated charcoal capsules for natural detoxification, digestive support, and bloating relief. Made from sustainably sourced coconut shells.',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop',
      category: 'Natural Supplements',
      stock: 22,
      supplierId: supplierApproved.id,
    },

    // ── Skin Care ──
    {
      name: 'Raw Shea Butter (Unrefined)',
      description: 'Pure unrefined shea butter from Northern Cameroon. Deeply moisturizing for dry skin, stretch marks, eczema relief, and natural hair conditioning.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
      category: 'Skin Care',
      stock: 55,
      supplierId: supplierApproved.id,
    },
    {
      name: 'African Black Soap',
      description: 'Handmade traditional African black soap for acne, blemishes, and deep cleansing. Made from plantain skin ash, cocoa pods, and palm oil.',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e68e0?w=600&h=600&fit=crop',
      category: 'Skin Care',
      stock: 70,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Aloe Vera Gel (Pure)',
      description: 'Cold-pressed pure aloe vera gel for skin hydration, sunburn relief, and natural hair styling. No artificial colors or fragrances added.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1596040033189-25a6ce93ab3e?w=600&h=600&fit=crop',
      category: 'Skin Care',
      stock: 38,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Turmeric & Honey Face Mask',
      description: 'Natural face mask combining turmeric anti-inflammatory properties with raw honey for glowing, blemish-free skin. Suitable for all skin types.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=600&fit=crop',
      category: 'Skin Care',
      stock: 28,
      supplierId: supplierApproved.id,
    },

    // ── Hair Care ──
    {
      name: 'Castor Oil (Jamaican Black)',
      description: 'Traditional Jamaican black castor oil for hair growth, thickness, and scalp health. Cold-pressed and roasted for maximum potency.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=600&fit=crop',
      category: 'Hair Care',
      stock: 24,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Chebe Powder (Hair Growth)',
      description: 'Authentic Chadian chebe powder for extreme hair growth and retention. Traditional recipe used by Basara women for centuries to grow waist-length hair.',
      price: 6000,
      image: 'https://images.unsplash.com/photo-1631390139523-551312a4e3d3?w=600&h=600&fit=crop',
      category: 'Hair Care',
      stock: 16,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Argan Oil (Pure Moroccan)',
      description: 'Cold-pressed Moroccan argan oil for hair shine, frizz control, and scalp nourishment. Rich in vitamin E and essential fatty acids.',
      price: 9000,
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop',
      category: 'Hair Care',
      stock: 10,
      supplierId: supplierApproved.id,
    },

    // ── Superfoods ──
    {
      name: 'Raw Organic Honey (500ml)',
      description: 'Unprocessed raw honey from Oku mountain apiaries. Rich in enzymes, antioxidants, and natural antibacterial properties. Perfect for teas and wellness.',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=600&fit=crop',
      category: 'Superfoods',
      stock: 32,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Organic Turmeric Powder',
      description: 'High-curcumin organic turmeric powder for cooking and golden milk lattes. Powerful anti-inflammatory and antioxidant properties.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&h=600&fit=crop',
      category: 'Superfoods',
      stock: 42,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Cacao Powder (Raw)',
      description: 'Unprocessed raw cacao powder from Cameroon cocoa farms. High in magnesium, iron, and mood-boosting compounds. Use in smoothies and healthy desserts.',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop',
      category: 'Superfoods',
      stock: 30,
      supplierId: supplierApproved.id,
    },

    // ── Spices & Seasonings ──
    {
      name: 'Cameroon White Pepper',
      description: 'Premium Penja white pepper, one of the world\'s most sought-after spices. Grown in the volcanic soils of Mount Cameroon for a unique, refined flavor.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1596040033189-25a6ce93ab3e?w=600&h=600&fit=crop',
      category: 'Spices & Seasonings',
      stock: 35,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Country Onion (Njansang)',
      description: 'Traditional Cameroonian njansang seeds for authentic African cooking. Essential spice for eru, ndolé, and other local delicacies.',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
      category: 'Spices & Seasonings',
      stock: 48,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Organic Garlic Powder',
      description: 'Dehydrated organic garlic powder for cooking and natural health support. Known for cardiovascular benefits and immune system support.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&h=600&fit=crop',
      category: 'Spices & Seasonings',
      stock: 40,
      supplierId: supplierApproved.id,
    },

    // ── Detox & Cleanse ──
    {
      name: 'Detox Tea Blend',
      description: 'Carefully formulated blend of green tea, dandelion root, ginger, and lemongrass for a comprehensive body cleanse. Supports liver function and digestion.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop',
      category: 'Detox & Cleanse',
      stock: 28,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Apple Cider Vinegar (Raw)',
      description: 'Organic raw apple cider vinegar with the "mother" culture. Supports weight management, digestion, and blood sugar balance. Use diluted in water.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1473348109699-9cdd7c8a0fa0?w=600&h=600&fit=crop',
      category: 'Detox & Cleanse',
      stock: 20,
      supplierId: supplierApproved.id,
    },
    {
      name: 'Bentonite Clay (Food Grade)',
      description: 'Natural food-grade bentonite clay for internal and external detoxification. Use as face masks, body wraps, or digestive support.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=600&fit=crop',
      category: 'Detox & Cleanse',
      stock: 25,
      supplierId: supplierApproved.id,
    },
  ];

  const dbProducts = [];
  for (const prod of products) {
    const dbProd = await prisma.product.create({
      data: prod,
    });
    dbProducts.push(dbProd);
  }

  console.log(`✅ ${dbProducts.length} products seeded`);

  // ─── Mock Orders ──────────────────────────────────────────────────────
  await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'PENDING',
      total: 12000,
      address: '12 Forestry Ave, Molyko, Buea',
      phone: '+237677123456',
      deliveryAgentId: agent.id,
      items: {
        create: [
          { productId: dbProducts[0].id, quantity: 2, price: dbProducts[0].price },
          { productId: dbProducts[12].id, quantity: 1, price: dbProducts[12].price },
          { productId: dbProducts[4].id, quantity: 1, price: dbProducts[4].price },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'DELIVERED',
      total: 5500,
      address: 'Clerk Quarters, Buea Town',
      phone: '+237677123456',
      deliveryAgentId: agent.id,
      items: {
        create: [
          { productId: dbProducts[13].id, quantity: 1, price: dbProducts[13].price },
          { productId: dbProducts[12].id, quantity: 1, price: dbProducts[12].price },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'PROCESSING',
      total: 15500,
      address: 'Mile 17, Buea',
      phone: '+237677123456',
      items: {
        create: [
          { productId: dbProducts[7].id, quantity: 1, price: dbProducts[7].price },
          { productId: dbProducts[9].id, quantity: 1, price: dbProducts[9].price },
        ],
      },
    },
  });

  console.log('✅ Orders seeded');

  // ─── Mock Consultations ───────────────────────────────────────────────
  await prisma.consultation.create({
    data: {
      name: 'Alice Mitchell',
      email: 'customer@greencure.com',
      phone: '+237677123456',
      date: '2026-07-15',
      time: '10:00 AM',
      message: 'Looking for advice on natural remedies for chronic sinus support and seasonal allergies.',
      status: 'PENDING',
    },
  });

  await prisma.consultation.create({
    data: {
      name: 'Jean-Pierre Nkomo',
      email: 'jpnkomo@gmail.com',
      phone: '+237699887766',
      date: '2026-07-18',
      time: '2:00 PM',
      message: 'Interested in a comprehensive detox program and weight management support using herbal supplements.',
      status: 'PENDING',
    },
  });

  console.log('✅ Consultations seeded');
  console.log('🌿 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
