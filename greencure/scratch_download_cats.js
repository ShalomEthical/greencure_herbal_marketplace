const fs = require('fs');
const https = require('https');

function download(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filename).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error('Status: ' + res.statusCode));
      }
      const file = fs.createWriteStream(filename);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => reject(err));
    });
  });
}

async function go() {
  await download('https://organichealthshopbuea.com/wp-content/uploads/2024/01/anti-typhoid-1.png', 'public/category-tea.png').catch(console.error);
  await download('https://organichealthshopbuea.com/wp-content/uploads/2022/11/Atemesia-oil.png', 'public/category-oil.png').catch(console.error);
  await download('https://organichealthshopbuea.com/wp-content/uploads/2023/09/BONE-UP.png', 'public/category-supplements.png').catch(console.error);
  await download('https://organichealthshopbuea.com/wp-content/uploads/2022/11/Argan-fruit.png', 'public/category-skincare.png').catch(console.error);
  console.log('Categories downloaded');
}
go();
