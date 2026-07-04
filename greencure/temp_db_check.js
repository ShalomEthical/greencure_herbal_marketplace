const sqlite3 = require('sqlite3').verbose();
const path = require('path').join(process.cwd(), 'dev.db');
console.log('DB path:', path);
const db = new sqlite3.Database(path, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('DB open error:', err.message);
    process.exit(1);
  }
  db.all("SELECT id,name,email,role,password FROM User WHERE email LIKE '%supplier%';", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    console.log('--- supplier users ---');
    rows.forEach((r) => console.log(r));
    db.all('SELECT id,name,email,role FROM User;', [], (err2, rows2) => {
      if (err2) {
        console.error(err2.message);
        process.exit(1);
      }
      console.log('--- all users ---');
      rows2.forEach((r) => console.log(r));
      db.close();
    });
  });
});
