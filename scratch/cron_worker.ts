import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, "../.env") })

const SYNC_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

async function runSync() {
  try {
    // Dynamic import to guarantee environment variables are loaded
    const { db } = await import("../lib/db")
    const { teams } = await import("../lib/db/schema")
    const { performSync, performGamesSync } = await import("../lib/db/sync")

    const existingTeams = await db.select({ id: teams.id }).from(teams).limit(1)
    const hasTeams = existingTeams.length > 0

    if (hasTeams) {
      console.log(`[${new Date().toISOString()}] Running fast games-only sync...`);
      await performGamesSync();
    } else {
      console.log(`[${new Date().toISOString()}] Running full sync...`);
      await performSync();
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Sync failed:`, err);
  }
}

console.log("Cron worker initialized. Running initial sync...");
runSync();

setInterval(runSync, SYNC_INTERVAL_MS);
console.log("Cron worker running. Will sync every 5 minutes.");
