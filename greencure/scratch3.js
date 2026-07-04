const fs = require('fs');
const html = fs.readFileSync('organichealthshopbuea.html', 'utf-8');
const urls = html.match(/https:\/\/[^\"'\s]+\.(?:jpg|png|webp|jpeg)/gi) || [];
const set = Array.from(new Set(urls));
fs.writeFileSync('all_images.txt', set.join('\n'));
