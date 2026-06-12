import { db, ensureTablesExist } from "./index"
import { teams, stadiums, games } from "./schema"
import { sql } from "drizzle-orm"
import { getGameSlug } from "../services/apiSlice"
import { teamTranslations, stadiumTranslations } from "./translations"

async function fetchFromApi(endpoint: string, timeoutMs = 15000) {
  let res
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      res = await fetch(`http://worldcup26.ir:3050/get/${endpoint}`, {
        signal: controller.signal,
        cache: "no-store"
      })
    } finally {
      clearTimeout(id)
    }
  } catch (err) {
    console.warn(`Sync fetch for ${endpoint} via domain failed, falling back to direct IP address. Error:`, err)
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    try {
      res = await fetch(`http://82.115.13.31:3050/get/${endpoint}`, {
        signal: controller.signal,
        cache: "no-store"
      })
    } finally {
      clearTimeout(id)
    }
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status}`)
  }
  return res.json()
}


export async function performSync() {
  await ensureTablesExist()

  console.log("Database Sync Started...")

  // 1. Fetch data from external APIs in parallel
  const [teamsData, stadiumsData, gamesData] = await Promise.all([
    fetchFromApi("teams"),
    fetchFromApi("stadiums"),
    fetchFromApi("games")
  ])

  const teamsList = teamsData?.teams || []
  const stadiumsList = stadiumsData?.stadiums || []
  const gamesList = gamesData?.games || []

  console.log(`Fetched ${teamsList.length} teams, ${stadiumsList.length} stadiums, ${gamesList.length} games.`)

  // 2. Bulk Sync Teams
  if (teamsList.length > 0) {
    const teamsValues = teamsList.map((team: any) => {
      const teamTrans = teamTranslations[team.name_en] || null
      const serializedTeamTrans = teamTrans ? JSON.stringify(teamTrans) : null
      return {
        id: team.id,
        _id: team._id,
        name_en: team.name_en,
        name_fa: team.name_fa || null,
        flag: team.flag || null,
        fifa_code: team.fifa_code || null,
        iso2: team.iso2 || null,
        groups: team.groups || null,
        translations: serializedTeamTrans,
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
          translations: sql`VALUES(translations)`,
          fifa_team_id: sql`VALUES(fifa_team_id)`,
        }
      })
  }

  // 3. Bulk Sync Stadiums
  if (stadiumsList.length > 0) {
    const stadiumsValues = stadiumsList.map((stadium: any) => {
      const stadiumTrans = stadiumTranslations[stadium.name_en] || null
      const serializedStadiumTrans = stadiumTrans ? JSON.stringify(stadiumTrans) : null
      return {
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
      }
    })

    await db
      .insert(stadiums)
      .values(stadiumsValues)
      .onDuplicateKeyUpdate({
        set: {
          name_en: sql`VALUES(name_en)`,
          name_fa: sql`VALUES(name_fa)`,
          fifa_name: sql`VALUES(fifa_name)`,
          city_en: sql`VALUES(city_en)`,
          city_fa: sql`VALUES(city_fa)`,
          country_en: sql`VALUES(country_en)`,
          country_fa: sql`VALUES(country_fa)`,
          capacity: sql`VALUES(capacity)`,
          region: sql`VALUES(region)`,
          translations: sql`VALUES(translations)`,
        }
      })
  }

  // 4. Bulk Sync Games
  if (gamesList.length > 0) {
    const gamesValues = gamesList.map((game: any) => {
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
  }

  try {
    await performGroupsSync()
  } catch (err) {
    console.error("Failed to sync groups during full sync:", err)
  }

  console.log("Database Sync Completed Successfully!")
  return {
    teams: teamsList.length,
    stadiums: stadiumsList.length,
    games: gamesList.length
  }
}

export async function performGamesSync() {
  await ensureTablesExist()

  console.log("Games-only Sync Started...")

  // Fetch games API
  const gamesData = await fetchFromApi("games")
  const gamesList = gamesData?.games || []

  console.log(`Fetched ${gamesList.length} games for games-only sync.`)

  if (gamesList.length > 0) {
    const gamesValues = gamesList.map((game: any) => {
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
  }

  try {
    await performGroupsSync()
  } catch (err) {
    console.error("Failed to sync groups during games sync:", err)
  }

  console.log("Games-only Sync Completed Successfully!")
  return {
    games: gamesList.length
  }
}

export async function performGroupsSync() {
  await ensureTablesExist()

  console.log("Groups Sync Started...")

  const groupsData = await fetchFromApi("groups")
  const groupsList = groupsData?.groups || []

  console.log(`Fetched ${groupsList.length} groups for sync.`)

  if (groupsList.length > 0) {
    for (const group of groupsList) {
      const groupTeams = group.teams || []
      for (const t of groupTeams) {
        await db
          .update(teams)
          .set({
            mp: Number(t.mp || 0),
            w: Number(t.w || 0),
            l: Number(t.l || 0),
            d: Number(t.d || 0),
            pts: Number(t.pts || 0),
            gf: Number(t.gf || 0),
            ga: Number(t.ga || 0),
            gd: Number(t.gd || 0),
          })
          .where(sql`id = ${t.team_id}`)
      }
    }
  }

  console.log("Groups Sync Completed Successfully!")
  return {
    groups: groupsList.length
  }
}



