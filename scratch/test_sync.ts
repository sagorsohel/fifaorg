import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Use dynamic import so env variables are fully loaded first
const { performGamesSync } = await import("../lib/db/sync.js");

async function run() {
  console.log("Starting games sync test with loaded environment variables...");
  try {
    const res = await performGamesSync();
    console.log("Sync completed successfully:", res);
  } catch (err) {
    console.error("Sync failed:", err);
  }
}

run();
