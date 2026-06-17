import "./load-env"
import { db, ensureTablesExist } from "../lib/db"
import { teams, stadiums } from "../lib/db/schema"
import { teamTranslations, stadiumTranslations } from "../lib/db/translations"
import { sql } from "drizzle-orm"

async function run() {
  console.log("Connecting to database and updating translations...")
  await ensureTablesExist()

  // 1. Update Teams
  const allTeams = await db.select().from(teams)
  console.log(`Found ${allTeams.length} teams in database.`)
  let updatedTeams = 0
  for (const team of allTeams) {
    const teamTrans = teamTranslations[team.name_en]
    if (teamTrans) {
      const serialized = JSON.stringify(teamTrans)
      await db
        .update(teams)
        .set({ translations: serialized })
        .where(sql`id = ${team.id}`)
      updatedTeams++
    }
  }
  console.log(`Updated translations for ${updatedTeams}/${allTeams.length} teams.`)

  // 2. Update Stadiums
  const allStadiums = await db.select().from(stadiums)
  console.log(`Found ${allStadiums.length} stadiums in database.`)
  let updatedStadiums = 0
  for (const stadium of allStadiums) {
    const stadiumTrans = stadiumTranslations[stadium.name_en]
    if (stadiumTrans) {
      const serialized = JSON.stringify(stadiumTrans)
      await db
        .update(stadiums)
        .set({ translations: serialized })
        .where(sql`id = ${stadium.id}`)
      updatedStadiums++
    }
  }
  console.log(`Updated translations for ${updatedStadiums}/${allStadiums.length} stadiums.`)

  console.log("Database translations update completed!")
  process.exit(0)
}

run().catch((err) => {
  console.error("Failed to update translations directly:", err)
  process.exit(1)
})
