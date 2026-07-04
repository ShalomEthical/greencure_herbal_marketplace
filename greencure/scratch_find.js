const fs = require('fs');

async function go() {
  const res = await fetch('https://organichealthshopbuea.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const text = await res.text();
  fs.writeFileSync('organichealthshopbuea.html', text);
  console.log('Saved HTML');
}
go();
