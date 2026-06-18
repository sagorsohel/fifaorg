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
    const [rows] = await connection.query("SELECT id, name_en, translations FROM teams WHERE translations IS NULL");
    console.log(`Teams with NULL translations: ${rows.length}`);
    for (const r of rows) {
      console.log(`- ${r.name_en} (${r.id})`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
run();
