import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"

export async function GET() {
  try {
    const gamesList = await db.select().from(games)
    return NextResponse.json({ games: gamesList })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
