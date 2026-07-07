const mysql = require("mysql2/promise");
require("dotenv").config();

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
      SELECT * FROM ads
    `);
    console.log("Ads table content:");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
run();
