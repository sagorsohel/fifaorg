import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { teams } from "@/lib/db/schema"

export async function GET() {
  try {
    const teamsList = await db.select().from(teams)
    return NextResponse.json({ teams: teamsList })
  } catch (error: any) {
    console.error("Teams API Route Error details:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
