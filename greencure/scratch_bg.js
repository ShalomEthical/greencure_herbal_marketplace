const fs = require('fs');
const html = fs.readFileSync('organichealthshopbuea.html', 'utf-8');
const regex = /background(?:-image)?:\s*url\(\s*['\"]?(https?:\/\/[^\s\"'\)]+\.(?:jpg|png|webp|jpeg))['\"]?\s*\)/gi;
let match;
const bgs = new Set();
while ((match = regex.exec(html)) !== null) {
  bgs.add(match[1]);
}
console.log('Background images found:');
console.log(Array.from(bgs).join('\n'));
