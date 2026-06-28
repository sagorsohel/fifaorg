const mysql = require("mysql2/promise");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function run() {
  // 1. Fetch games from the external API
  let apiGames = [];
  try {
    const res = await fetch("http://worldcup26.ir:3050/get/games");
    const data = await res.json();
    apiGames = data?.games || [];
    console.log(`API returned ${apiGames.length} games.`);
  } catch (err) {
    console.error("Failed to fetch games from API:", err);
  }

  // 2. Fetch games from local database
  let dbGames = [];
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: Number(process.env.MYSQL_PORT),
    });
    const [rows] = await connection.query("SELECT * FROM games");
    dbGames = rows;
    console.log(`Local DB has ${dbGames.length} games.`);
  } catch (err) {
    console.error("Database connection/query error:", err);
  } finally {
    if (connection) await connection.end();
  }

  // 3. Comparison & details
  if (apiGames.length > 0 && dbGames.length > 0) {
    // Check if there are any game IDs in API that are not in DB
    const dbGameIds = new Set(dbGames.map(g => g.id));
    const missingInDb = apiGames.filter(g => !dbGameIds.has(g.id));
    console.log(`Games in API but missing in local DB: ${missingInDb.length}`);
    if (missingInDb.length > 0) {
      console.log("Missing games sample:", JSON.stringify(missingInDb.slice(0, 5), null, 2));
    }

    // Check if there are differences in home_team_id or away_team_id or group or matchday
    const dbGamesMap = new Map(dbGames.map(g => [g.id, g]));
    let countDiffTeams = 0;
    const diffs = [];
    for (const apiG of apiGames) {
      const dbG = dbGamesMap.get(apiG.id);
      if (dbG) {
        if (dbG.home_team_id !== apiG.home_team_id || dbG.away_team_id !== apiG.away_team_id || dbG.group !== apiG.group || dbG.matchday !== apiG.matchday) {
          countDiffTeams++;
          diffs.push({
            id: apiG.id,
            api: { home: apiG.home_team_id, away: apiG.away_team_id, group: apiG.group, matchday: apiG.matchday },
            db: { home: dbG.home_team_id, away: dbG.away_team_id, group: dbG.group, matchday: dbG.matchday }
          });
        }
      }
    }
    console.log(`Games with mismatched details (home/away team/group/matchday) in DB: ${countDiffTeams}`);
    if (diffs.length > 0) {
      console.log("Mismatched details sample:", JSON.stringify(diffs.slice(0, 10), null, 2));
    }
  }
}

run();
