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
    const [teams] = await connection.query("SELECT * FROM teams LIMIT 5");
    console.log("Local Teams Translations samples:");
    for (const t of teams) {
      console.log(`${t.name_en} (${t.fifa_code}):`, t.translations);
    }

    const [stadiums] = await connection.query("SELECT * FROM stadiums LIMIT 3");
    console.log("\nLocal Stadiums Translations samples:");
    for (const s of stadiums) {
      console.log(`${s.name_en} (${s.id}):`, s.translations);
    }
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await connection.end();
  }
}

run();
