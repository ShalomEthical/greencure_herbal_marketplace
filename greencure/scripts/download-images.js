/**
 * Downloads product images from organichealthshopbuea.com
 * and saves them to public/products/ for local serving.
 */
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'public', 'products');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Map: filename -> source URL
// We'll try multiple strategies to get around CDN blocks
const IMAGES = {
  // Herbal Teas
  'moringa-tea.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/moringa-tea.jpg',
  'lemongrass-tea.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/lemongrass-tea.jpg',
  'hibiscus-tea.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/hibiscus-tea.jpg',
  'ginger-tea.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/ginger-tea.jpg',

  // Essential Oils
  'neem-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/neem-oil.jpg',
  'eucalyptus-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/eucalyptus-oil.jpg',
  'coconut-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/coconut-oil.jpg',
  'black-seed-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/black-seed-oil.jpg',

  // Natural Supplements
  'moringa-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/moringa-powder.jpg',
  'spirulina-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/spirulina-powder.jpg',
  'baobab-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/baobab-powder.jpg',
  'charcoal-capsules.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/charcoal-capsules.jpg',

  // Skin Care
  'shea-butter.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/shea-butter.jpg',
  'black-soap.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/black-soap.jpg',
  'aloe-vera-gel.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/aloe-vera-gel.jpg',
  'turmeric-face-mask.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/turmeric-face-mask.jpg',

  // Hair Care
  'castor-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/castor-oil.jpg',
  'chebe-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/chebe-powder.jpg',
  'argan-oil.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/argan-oil.jpg',

  // Superfoods
  'raw-honey.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/raw-honey.jpg',
  'turmeric-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/turmeric-powder.jpg',
  'cacao-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/cacao-powder.jpg',

  // Spices & Seasonings
  'white-pepper.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/white-pepper.jpg',
  'njansang.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/njansang.jpg',
  'garlic-powder.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/garlic-powder.jpg',

  // Detox & Cleanse
  'detox-tea.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/detox-tea.jpg',
  'apple-cider-vinegar.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/apple-cider-vinegar.jpg',
  'bentonite-clay.jpg': 'https://organichealthshopbuea.com/wp-content/uploads/2023/03/bentonite-clay.jpg',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;

    const req = client.get(url, {
      headers: {
        // Mimic a real browser request to bypass hotlink protection
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://organichealthshopbuea.com/',
      },
      timeout: 15000,
    }, (response) => {
      // Follow redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        // Check if file is too small (likely an error page)
        const stats = fs.statSync(dest);
        if (stats.size < 1000) {
          fs.unlinkSync(dest);
          reject(new Error(`File too small (${stats.size} bytes) - likely blocked`));
        } else {
          resolve(dest);
        }
      });
    });

    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  const entries = Object.entries(IMAGES);
  console.log(`\n🌿 Downloading ${entries.length} product images...\n`);

  let success = 0;
  let failed = 0;
  const failures = [];

  for (const [filename, url] of entries) {
    const dest = path.join(OUT_DIR, filename);

    // Skip if already downloaded
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`  ⏭  ${filename} (already exists)`);
      success++;
      continue;
    }

    process.stdout.write(`  ⬇  ${filename}...`);
    try {
      await download(url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(` ✅ (${size}KB)`);
      success++;
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
      failures.push(filename);
    }

    // Small delay between requests to be polite
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n📊 Results: ${success} downloaded, ${failed} failed`);
  if (failures.length > 0) {
    console.log(`❌ Failed: ${failures.join(', ')}`);
    console.log(`\n💡 For failed images, we'll use the Unsplash fallbacks.`);
  }
  console.log('');
}

main();
