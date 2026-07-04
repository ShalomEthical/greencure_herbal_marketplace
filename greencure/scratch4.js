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
  try {
    await download('https://organichealthshopbuea.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-13-at-4.46.45-AM.jpeg', 'public/hero-bg1.jpeg');
    console.log('Downloaded 1');
  } catch (e) { console.error('Failed 1', e); }
  
  try {
    await download('https://organichealthshopbuea.com/wp-content/uploads/2022/12/b47381cb-5d87-46e6-8e7c-cffa76e25b78.jpeg', 'public/hero-bg2.jpeg');
    console.log('Downloaded 2');
  } catch (e) { console.error('Failed 2', e); }
}
go();
