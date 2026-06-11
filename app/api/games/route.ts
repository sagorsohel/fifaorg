import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { performGamesSync } from "@/lib/db/sync"

const globalForSync = global as unknown as {
  lastSyncTime: number | undefined
  syncPromise: Promise<any> | null
}

export async function GET() {
  try {
    await ensureTablesExist()
    let gamesList = await db.select().from(games)

    // Check if any game is live or starting soon
    const isLiveOrStartingSoon = gamesList.some((game) => {
      if (!game.finished || game.finished.toUpperCase() === "TRUE") return false
      if (!game.local_date) return false
      try {
        const kickoff = new Date(game.local_date)
        const now = new Date()
        const diff = kickoff.getTime() - now.getTime()
        // Starting in the next 15 minutes, or started in the last 4 hours (and not finished)
        return (diff <= 15 * 60 * 1000 && diff >= -4 * 60 * 60 * 1000)
      } catch {
        return false
      }
    })

    const now = Date.now()
    const lastSync = globalForSync.lastSyncTime || 0

    if (isLiveOrStartingSoon && now - lastSync > 30000) {
      if (!globalForSync.syncPromise) {
        globalForSync.lastSyncTime = now
        console.log("Triggering games-only sync on-demand...")
        globalForSync.syncPromise = performGamesSync()
          .then((res) => {
            globalForSync.syncPromise = null
            return res
          })
          .catch((err) => {
            globalForSync.syncPromise = null
            throw err
          })
      }

      try {
        await globalForSync.syncPromise
        // Re-fetch games from database to include the newly synced live scores
        gamesList = await db.select().from(games)
      } catch (err) {
        console.error("On-demand games sync failed:", err)
      }
    }

    return NextResponse.json({ games: gamesList })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

