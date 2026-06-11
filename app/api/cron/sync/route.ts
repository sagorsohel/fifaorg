import { NextResponse } from "next/server"
import { performSync, performGamesSync } from "@/lib/db/sync"
import { db } from "@/lib/db"
import { teams } from "@/lib/db/schema"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    const envSecret = process.env.CRON_SECRET

    if (envSecret && secret !== envSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    // Check if teams already exist to determine if we can do a games-only sync
    const existingTeams = await db.select({ id: teams.id }).from(teams).limit(1)
    const hasTeams = existingTeams.length > 0
    const full = searchParams.get("full") === "true"

    let stats
    let mode = ""
    if (hasTeams && !full) {
      console.log("Running fast games-only sync via cron...")
      stats = await performGamesSync()
      mode = "games-only"
    } else {
      console.log("Running full database sync (teams + stadiums + games) via cron...")
      stats = await performSync()
      mode = "full"
    }

    return NextResponse.json({
      success: true,
      message: `Synchronization completed successfully (${mode})`,
      synced: stats,
    })
  } catch (error: any) {
    console.error("Database sync failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

