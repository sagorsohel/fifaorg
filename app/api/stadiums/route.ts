import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { stadiums } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await ensureTablesExist()
    const stadiumsList = await db.select().from(stadiums)
    const formattedStadiums = stadiumsList.map(stadium => {
      let parsed = null
      if (stadium.translations) {
        try {
          parsed = JSON.parse(stadium.translations)
        } catch (e) {}
      }
      return {
        ...stadium,
        translations: parsed
      }
    })
    return NextResponse.json({ stadiums: formattedStadiums })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
