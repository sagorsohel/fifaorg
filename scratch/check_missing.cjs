const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });

  try {
    const [rows] = await connection.query("SELECT id, name_en, translations FROM teams");
    console.log(`Total teams: ${rows.length}`);
    let missingJp = 0;
    let missingZh = 0;
    let missingDe = 0;
    for (const r of rows) {
      if (!r.translations) {
        missingJp++;
        missingZh++;
        missingDe++;
        continue;
      }
      try {
        const parsed = JSON.parse(r.translations);
        if (!parsed.jp) missingJp++;
        if (!parsed.zh) missingZh++;
        if (!parsed.de) missingDe++;
      } catch (e) {
        missingJp++;
        missingZh++;
        missingDe++;
      }
    }
    console.log(`Teams missing jp: ${missingJp}`);
    console.log(`Teams missing zh: ${missingZh}`);
    console.log(`Teams missing de: ${missingDe}`);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
run();
