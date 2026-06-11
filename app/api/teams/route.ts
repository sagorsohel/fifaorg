import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { teams } from "@/lib/db/schema"

export async function GET() {
  try {
    await ensureTablesExist()
    const teamsList = await db.select().from(teams)
    const formattedTeams = teamsList.map(team => {
      let parsed = null
      if (team.translations) {
        try {
          parsed = JSON.parse(team.translations)
        } catch (e) {}
      }
      return {
        ...team,
        translations: parsed
      }
    })
    return NextResponse.json({ teams: formattedTeams })
  } catch (error: any) {
    console.error("Teams API Route Error details:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
