import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { stadiums } from "@/lib/db/schema"

export async function GET() {
  try {
    const stadiumsList = await db.select().from(stadiums)
    return NextResponse.json({ stadiums: stadiumsList })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
