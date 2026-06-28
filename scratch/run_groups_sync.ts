import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const { performGroupsSync } = await import("../lib/db/sync.js");

async function run() {
  console.log("Starting groups sync test...");
  try {
    const res = await performGroupsSync();
    console.log("Groups Sync completed successfully:", res);
  } catch (err) {
    console.error("Groups Sync failed:", err);
  }
}

run();
