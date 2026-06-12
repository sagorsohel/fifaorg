const mysql = require("mysql2/promise");

async function run() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "world_cup_2026",
    port: 3306,
  });

  try {
    const [rows] = await connection.query(`
      SELECT id, name_en, city_en FROM stadiums
    `);
    console.log("Stadiums in Database:");
    console.log(JSON.stringify(rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}
run();
