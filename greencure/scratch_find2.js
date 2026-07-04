const fs = require('fs');
const text = fs.readFileSync('organichealthshopbuea.html', 'utf-8');
const urls = text.match(/https?:\/\/[^\s\"'\)]+\.(?:jpg|png|webp|jpeg)/gi) || [];
const uniqueUrls = [...new Set(urls)];
console.log(uniqueUrls.filter(u => u.includes('organichealthshopbuea.com')).join('\n'));
