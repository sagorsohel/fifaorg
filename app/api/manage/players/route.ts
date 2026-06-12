import { NextRequest, NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { players } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import crypto from "crypto"
import { sanitizeImageUrl } from "@/lib/utils"

// GET: Retrieve players by team_id
export async function GET(request: NextRequest) {
  try {
    await ensureTablesExist()
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get("team_id")

    if (!teamId) {
      return NextResponse.json({ error: "Missing team_id parameter" }, { status: 400 })
    }

    const teamPlayers = await db
      .select()
      .from(players)
      .where(eq(players.team_id, teamId))

    return NextResponse.json({ players: teamPlayers })
  } catch (err: any) {
    console.error("GET Players API Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: Add new player or update existing player
export async function POST(request: Request) {
  try {
    await ensureTablesExist()
    const body = await request.json()
    const { id, team_id, name, jersey_num, position, weight, height, picture_url, fifa_id } = body

    if (!team_id || !name) {
      return NextResponse.json({ error: "Missing required fields: team_id and name are required" }, { status: 400 })
    }

    const parsedJersey = jersey_num ? parseInt(jersey_num, 10) : null
    const parsedWeight = weight ? parseFloat(weight) : null
    const parsedHeight = height ? parseFloat(height) : null
    const sanitizedPic = sanitizeImageUrl(picture_url)

    if (id) {
      // Update existing player
      await db
        .update(players)
        .set({
          name,
          jersey_num: parsedJersey,
          position: position || null,
          weight: parsedWeight,
          height: parsedHeight,
          picture_url: sanitizedPic,
          fifa_id: fifa_id || null,
        })
        .where(eq(players.id, id))

      return NextResponse.json({ success: true, message: "Player updated successfully", id })
    } else {
      // Create new player
      const newId = crypto.randomUUID()
      await db.insert(players).values({
        id: newId,
        team_id,
        name,
        jersey_num: parsedJersey,
        position: position || null,
        weight: parsedWeight,
        height: parsedHeight,
        picture_url: sanitizedPic,
        fifa_id: fifa_id || null,
      })

      return NextResponse.json({ success: true, message: "Player created successfully", id: newId })
    }
  } catch (err: any) {
    console.error("POST Player API Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Delete a player by ID
export async function DELETE(request: NextRequest) {
  try {
    await ensureTablesExist()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing id parameter" }, { status: 400 })
    }

    await db.delete(players).where(eq(players.id, id))

    return NextResponse.json({ success: true, message: "Player deleted successfully" })
  } catch (err: any) {
    console.error("DELETE Player API Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
