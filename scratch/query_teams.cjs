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
    const [rows] = await connection.query(`
      SELECT id, name_en, \`groups\`, mp, w, d, l, pts, gf, ga, gd FROM teams
    `);
    console.log(`Teams in Database (Total: ${rows.length}):`);
    console.log(JSON.stringify(rows.slice(0, 10), null, 2));
    
    const populated = rows.filter(t => t.mp > 0 || t.pts > 0);
    console.log(`Teams with mp > 0 or pts > 0: ${populated.length}`);
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
run();
