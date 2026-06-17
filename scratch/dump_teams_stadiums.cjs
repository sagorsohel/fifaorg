require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: Number(process.env.MYSQL_PORT),
  });

  try {
    const [teams] = await connection.query("SELECT id, name_en FROM teams ORDER BY name_en");
    console.log("ALL TEAMS:");
    console.log(JSON.stringify(teams, null, 2));

    const [stadiums] = await connection.query("SELECT id, name_en, city_en FROM stadiums ORDER BY id");
    console.log("\nALL STADIUMS:");
    console.log(JSON.stringify(stadiums, null, 2));
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await connection.end();
  }
}

run();
