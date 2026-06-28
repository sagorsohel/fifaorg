const mysql = require("mysql2/promise");

async function run() {
  const prodConfig = {
    host: "lightsalmon-hummingbird-478538.hostingersite.com",
    port: 3306,
    database: "u271001591_worldcup",
    user: "u271001591_worldcup",
    password: "4f^WiW9B^v",
  };

  let connection;
  try {
    console.log("Connecting to production DB...");
    connection = await mysql.createConnection(prodConfig);
    console.log("Connected successfully!");

    const [rows] = await connection.query("SELECT * FROM games");
    console.log(`Production DB has ${rows.length} games.`);

    // 1. Fetch from API
    console.log("Fetching from API...");
    const res = await fetch("http://worldcup26.ir:3050/get/games");
    const data = await res.json();
    const apiGames = data?.games || [];
    console.log(`API has ${apiGames.length} games.`);

    const dbGameIds = new Set(rows.map(g => g.id));
    const missingInDb = apiGames.filter(g => !dbGameIds.has(g.id));
    console.log(`Games missing in production DB: ${missingInDb.length}`);

    // Check for mismatched details (especially home_team_id, away_team_id)
    const dbGamesMap = new Map(rows.map(g => [g.id, g]));
    let mismatched = [];
    for (const apiG of apiGames) {
      const dbG = dbGamesMap.get(apiG.id);
      if (dbG) {
        if (
          dbG.home_team_id !== apiG.home_team_id ||
          dbG.away_team_id !== apiG.away_team_id ||
          dbG.group !== apiG.group ||
          dbG.matchday !== apiG.matchday ||
          dbG.type !== apiG.type
        ) {
          mismatched.push({
            id: apiG.id,
            api: { home: apiG.home_team_id, away: apiG.away_team_id, group: apiG.group, matchday: apiG.matchday, type: apiG.type },
            db: { home: dbG.home_team_id, away: dbG.away_team_id, group: dbG.group, matchday: dbG.matchday, type: dbG.type }
          });
        }
      }
    }
    console.log(`Games in production DB with mismatched details: ${mismatched.length}`);
    if (mismatched.length > 0) {
      console.log("Mismatched sample:", JSON.stringify(mismatched.slice(0, 10), null, 2));
    }

  } catch (err) {
    console.error("Error connecting/querying production DB:", err.message);
  } finally {
    if (connection) await connection.end();
  }
}

run();
