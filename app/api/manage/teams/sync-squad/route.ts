import { NextRequest, NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { teams, players } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    await ensureTablesExist()
    const { fifa_team_id, team_id } = await request.json()

    if (!fifa_team_id) {
      return NextResponse.json({ error: "Missing fifa_team_id parameter" }, { status: 400 })
    }

    // 1. Fetch from FIFA API
    const squadUrl = `https://api.fifa.com/api/v3/teams/${fifa_team_id}/squad?idCompetition=17&idSeason=285023&language=en`
    const res = await fetch(squadUrl)
    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch squad from FIFA: ${res.statusText}` }, { status: res.status })
    }

    const squadData = await res.json()
    const idCountry = squadData.IdCountry // e.g. "ARG"
    const playersList = squadData.Players || []

    if (!idCountry) {
      return NextResponse.json({ error: "Failed to detect team country from FIFA API response" }, { status: 400 })
    }

    // 2. Identify the target team in the database
    let targetTeam = await db
      .select()
      .from(teams)
      .where(eq(teams.fifa_code, idCountry))
      .then(r => r[0])

    // Fallback to team_id if provided and country search yielded nothing
    if (!targetTeam && team_id) {
      targetTeam = await db
        .select()
        .from(teams)
        .where(eq(teams.id, team_id))
        .then(r => r[0])
    }

    if (!targetTeam) {
      return NextResponse.json({
        error: `No matching team found in database for country code "${idCountry}"${team_id ? ` or team ID "${team_id}"` : ""}.`
      }, { status: 404 })
    }

    const targetTeamId = targetTeam.id

    // 3. Update the team's fifa_team_id in database
    await db
      .update(teams)
      .set({ fifa_team_id: fifa_team_id.toString() })
      .where(eq(teams.id, targetTeamId))

    // 4. Process and Upsert Players
    let addedCount = 0
    let updatedCount = 0

    for (const player of playersList) {
      const fifaId = player.IdPlayer?.toString()
      if (!fifaId) continue

      // Extract name (fallback order: Locale 'en-GB', then any available description)
      let name = ""
      const names = player.PlayerName || []
      const enGbName = names.find((n: any) => n.Locale === "en-GB")
      if (enGbName && enGbName.Description) {
        name = enGbName.Description
      } else if (names.length > 0 && names[0].Description) {
        name = names[0].Description
      } else {
        name = player.ShortName?.[0]?.Description || `Player #${fifaId}`
      }

      // Extract position (fallback order: RealPositionLocalized en-GB, PositionLocalized en-GB, first position)
      let position = ""
      const realPositions = player.RealPositionLocalized || []
      const standardPositions = player.PositionLocalized || []
      const enGbRealPos = realPositions.find((p: any) => p.Locale === "en-GB")
      const enGbStdPos = standardPositions.find((p: any) => p.Locale === "en-GB")

      if (enGbRealPos && enGbRealPos.Description) {
        position = enGbRealPos.Description
      } else if (enGbStdPos && enGbStdPos.Description) {
        position = enGbStdPos.Description
      } else if (realPositions.length > 0 && realPositions[0].Description) {
        position = realPositions[0].Description
      } else if (standardPositions.length > 0 && standardPositions[0].Description) {
        position = standardPositions[0].Description
      } else {
        position = "Unknown"
      }

      const jerseyNum = player.JerseyNum ? parseInt(player.JerseyNum, 10) : null
      const weight = player.Weight ? parseFloat(player.Weight) : null
      const height = player.Height ? parseFloat(player.Height) : null
      const pictureUrl = player.PlayerPicture?.PictureUrl || null

      // Check if player already exists by (team_id, fifa_id) or (team_id, name)
      const existing = await db
        .select()
        .from(players)
        .where(
          and(
            eq(players.team_id, targetTeamId),
            eq(players.fifa_id, fifaId)
          )
        )
        .then(r => r[0])

      if (existing) {
        // Update player record
        await db
          .update(players)
          .set({
            name,
            jersey_num: jerseyNum,
            position,
            weight,
            height,
            // Only update picture_url if the API provides a valid photo or the db photo is empty
            picture_url: pictureUrl || existing.picture_url,
          })
          .where(eq(players.id, existing.id))
        updatedCount++
      } else {
        // Insert new player record
        await db.insert(players).values({
          id: crypto.randomUUID(),
          team_id: targetTeamId,
          name,
          jersey_num: jerseyNum,
          position,
          weight,
          height,
          picture_url: pictureUrl,
          fifa_id: fifaId,
        })
        addedCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Squad sync completed for ${targetTeam.name_en}.`,
      team: {
        id: targetTeamId,
        name: targetTeam.name_en,
        fifa_code: targetTeam.fifa_code,
        fifa_team_id: fifa_team_id
      },
      stats: {
        added: addedCount,
        updated: updatedCount,
        total: addedCount + updatedCount
      }
    })
  } catch (err: any) {
    console.error("Sync Squad API Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
