import { NextResponse } from "next/server"
import { performSync } from "@/lib/db/sync"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    const envSecret = process.env.CRON_SECRET

    if (envSecret && secret !== envSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Enforce running only at 12:00 AM (hour 0) unless manually bypassed
    const bypass = searchParams.get("bypass") === "true"
    const now = new Date()
    const is12AM = now.getHours() === 0 || now.getUTCHours() === 0

    if (!is12AM && !bypass) {
      return NextResponse.json({
        message: "Sync skipped. Cron job is restricted to run at 12:00 AM only. Use ?bypass=true to override."
      })
    }

    const stats = await performSync()

    return NextResponse.json({
      success: true,
      message: "Synchronization completed successfully",
      synced: stats,
    })
  } catch (error: any) {
    console.error("Database sync failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
