import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { teams, stadiums, games } from "@/lib/db/schema"
import { getGameSlug } from "@/lib/services/apiSlice"
import { teamTranslations, stadiumTranslations } from "@/lib/db/translations"

async function fetchFromApi(endpoint: string) {
  let res
  try {
    res = await fetch(`http://worldcup26.ir:3050/get/${endpoint}`)
  } catch (err) {
    console.warn(`Sync fetch for ${endpoint} via domain failed, falling back to direct IP address.`)
    res = await fetch(`http://82.115.13.31:3050/get/${endpoint}`)
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status}`)
  }
  return res.json()
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get("secret")
    const envSecret = process.env.CRON_SECRET

    if (envSecret && secret !== envSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureTablesExist()

    console.log("Database Sync Started...")

    // 1. Fetch data from external APIs
    const teamsData = await fetchFromApi("teams")
    const stadiumsData = await fetchFromApi("stadiums")
    const gamesData = await fetchFromApi("games")

    const teamsList = teamsData?.teams || []
    const stadiumsList = stadiumsData?.stadiums || []
    const gamesList = gamesData?.games || []

    console.log(`Fetched ${teamsList.length} teams, ${stadiumsList.length} stadiums, ${gamesList.length} games.`)

    // 2. Sync Teams
    let syncedTeams = 0
    for (const team of teamsList) {
      const teamTrans = teamTranslations[team.name_en] || null
      const serializedTeamTrans = teamTrans ? JSON.stringify(teamTrans) : null

      await db
        .insert(teams)
        .values({
          id: team.id,
          _id: team._id,
          name_en: team.name_en,
          name_fa: team.name_fa || null,
          flag: team.flag || null,
          fifa_code: team.fifa_code || null,
          iso2: team.iso2 || null,
          groups: team.groups || null,
          translations: serializedTeamTrans,
        })
        .onDuplicateKeyUpdate({
          set: {
            name_en: team.name_en,
            name_fa: team.name_fa || null,
            flag: team.flag || null,
            fifa_code: team.fifa_code || null,
            iso2: team.iso2 || null,
            groups: team.groups || null,
            translations: serializedTeamTrans,
          },
        })
      syncedTeams++
    }

    // 3. Sync Stadiums
    let syncedStadiums = 0
    for (const stadium of stadiumsList) {
      const stadiumTrans = stadiumTranslations[stadium.name_en] || null
      const serializedStadiumTrans = stadiumTrans ? JSON.stringify(stadiumTrans) : null

      await db
        .insert(stadiums)
        .values({
          id: stadium.id,
          _id: stadium._id,
          name_en: stadium.name_en,
          name_fa: stadium.name_fa || null,
          fifa_name: stadium.fifa_name || null,
          city_en: stadium.city_en || null,
          city_fa: stadium.city_fa || null,
          country_en: stadium.country_en || null,
          country_fa: stadium.country_fa || null,
          capacity: stadium.capacity ? Number(stadium.capacity) : null,
          region: stadium.region || null,
          translations: serializedStadiumTrans,
        })
        .onDuplicateKeyUpdate({
          set: {
            name_en: stadium.name_en,
            name_fa: stadium.name_fa || null,
            fifa_name: stadium.fifa_name || null,
            city_en: stadium.city_en || null,
            city_fa: stadium.city_fa || null,
            country_en: stadium.country_en || null,
            country_fa: stadium.country_fa || null,
            capacity: stadium.capacity ? Number(stadium.capacity) : null,
            region: stadium.region || null,
            translations: serializedStadiumTrans,
          },
        })
      syncedStadiums++
    }

    // 4. Sync Games
    let syncedGames = 0
    for (const game of gamesList) {
      const gameSlug = getGameSlug(game)
      await db
        .insert(games)
        .values({
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
        })
        .onDuplicateKeyUpdate({
          set: {
            home_score: game.home_score || "0",
            away_score: game.away_score || "0",
            home_scorers: game.home_scorers || null,
            away_scorers: game.away_scorers || null,
            local_date: game.local_date || null,
            persian_date: game.persian_date || null,
            stadium_id: game.stadium_id || null,
            finished: game.finished || "FALSE",
            time_elapsed: game.time_elapsed || null,
            slug: gameSlug,
          },
        })
      syncedGames++
    }

    console.log("Database Sync Completed Successfully!")

    return NextResponse.json({
      success: true,
      message: "Synchronization completed successfully",
      synced: {
        teams: syncedTeams,
        stadiums: syncedStadiums,
        games: syncedGames,
      },
    })
  } catch (error: any) {
    console.error("Database sync failed:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
