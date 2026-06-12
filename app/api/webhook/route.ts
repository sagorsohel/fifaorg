import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { games, teams } from "@/lib/db/schema"
import { sql } from "drizzle-orm"
import { getGameSlug } from "@/lib/services/apiSlice"
import { performGamesSync } from "@/lib/db/sync"

export async function POST(req: Request) {
  try {
    await ensureTablesExist()

    // Parse JSON body if present
    let body: any = null
    try {
      body = await req.json()
    } catch (e) {
      // Empty or non-JSON body is allowed (will fallback to active pull sync)
    }

    console.log("Sync webhook triggered! Payload:", body)

    if (body) {
      let updatedCount = 0

      // Case 1: Directly push games data list
      if (Array.isArray(body.games) && body.games.length > 0) {
        console.log(`Directly syncing ${body.games.length} games via webhook payload...`)
        const gamesValues = body.games.map((game: any) => {
          const gameSlug = getGameSlug(game)
          return {
            id: game.id,
            _id: game._id,
            home_team_id: game.home_team_id,
            away_team_id: game.away_team_id,
            home_score: game.home_score || "0",
            away_score: game.away_score || "0",
            home_scorers: game.home_scorers || null,
            away_scorers: game.away_scorers || null,
            group: game.group || null,
            matchday: game.matchday || null,
            local_date: game.local_date || null,
            persian_date: game.persian_date || null,
            stadium_id: game.stadium_id || null,
            finished: game.finished || "FALSE",
            time_elapsed: game.time_elapsed || null,
            type: game.type || null,
            slug: gameSlug,
            referral_link: game.referral_link || null,
            modal_image: game.modal_image || null,
            bg_image: game.bg_image || null,
          }
        })

        await db
          .insert(games)
          .values(gamesValues)
          .onDuplicateKeyUpdate({
            set: {
              home_score: sql`VALUES(home_score)`,
              away_score: sql`VALUES(away_score)`,
              home_scorers: sql`VALUES(home_scorers)`,
              away_scorers: sql`VALUES(away_scorers)`,
              local_date: sql`VALUES(local_date)`,
              persian_date: sql`VALUES(persian_date)`,
              stadium_id: sql`VALUES(stadium_id)`,
              finished: sql`VALUES(finished)`,
              time_elapsed: sql`VALUES(time_elapsed)`,
              slug: sql`VALUES(slug)`,
            }
          })
        updatedCount += body.games.length
      }

      // Case 2: Directly push teams data list
      if (Array.isArray(body.teams) && body.teams.length > 0) {
        console.log(`Directly syncing ${body.teams.length} teams via webhook payload...`)
        const teamsValues = body.teams.map((team: any) => {
          return {
            id: team.id,
            _id: team._id,
            name_en: team.name_en,
            name_fa: team.name_fa || null,
            flag: team.flag || null,
            fifa_code: team.fifa_code || null,
            iso2: team.iso2 || null,
            groups: team.groups || null,
            fifa_team_id: team.fifa_team_id || null,
          }
        })

        await db
          .insert(teams)
          .values(teamsValues)
          .onDuplicateKeyUpdate({
            set: {
              name_en: sql`VALUES(name_en)`,
              name_fa: sql`VALUES(name_fa)`,
              flag: sql`VALUES(flag)`,
              fifa_code: sql`VALUES(fifa_code)`,
              iso2: sql`VALUES(iso2)`,
              groups: sql`VALUES(groups)`,
              fifa_team_id: sql`VALUES(fifa_team_id)`,
            }
          })
        updatedCount += body.teams.length
      }

      // If we synced direct pushed items, return success immediately
      if (updatedCount > 0) {
        return NextResponse.json({
          success: true,
          message: `Webhook processed successfully: synced ${updatedCount} items.`,
        })
      }
    }

    // Default Fallback: Fetch latest data directly from the external API
    console.log("Webhook payload empty or incomplete. Triggering remote API games sync fallback...")
    const stats = await performGamesSync()

    return NextResponse.json({
      success: true,
      message: "Webhook processed via remote API pull sync.",
      synced: stats,
    })
  } catch (error: any) {
    console.error("Webhook processing failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
