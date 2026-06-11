import { Metadata } from "next"
import { db } from "@/lib/db"
import { games, teams } from "@/lib/db/schema"
import MatchClientPage from "@/components/match-client-page"

async function getGameAndTeamsBySlug(slug: string) {
  try {
    const allGames = await db.select().from(games)
    const allTeams = await db.select().from(teams)

    const teamMap = new Map(allTeams.map((t) => [t.id, t]))

    const matchedGame = allGames.find((g) => {
      if (g._id === slug || g.id === slug || g.slug === slug) {
        return true
      }
      const homeTeam = teamMap.get(g.home_team_id)
      const awayTeam = teamMap.get(g.away_team_id)
      const homeName = homeTeam?.name_en || "tbd"
      const awayName = awayTeam?.name_en || "tbd"
      const homeSlug = homeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const awaySlug = awayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const computedSlug = `${homeSlug}-vs-${awaySlug}-${g.id || g._id}`
      return computedSlug === slug
    })

    if (!matchedGame) return null

    const homeTeam = teamMap.get(matchedGame.home_team_id)
    const awayTeam = teamMap.get(matchedGame.away_team_id)

    return {
      game: matchedGame,
      homeTeam,
      awayTeam,
    }
  } catch (error) {
    console.error("Failed to query match from database:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const matchInfo = await getGameAndTeamsBySlug(resolvedParams.slug)

  if (!matchInfo) {
    return {
      title: "Match Not Found | FIFA WC26 on Screen",
    }
  }

  const homeName = matchInfo.homeTeam?.name_en || "TBD"
  const awayName = matchInfo.awayTeam?.name_en || "TBD"
  
  const title = `LIVE: ${homeName} vs ${awayName} Match Stream`
  const description = `Stream "${homeName} vs ${awayName}" live 2026 FIFA World Cup match including scores, standings, and highlights.`
  const images = matchInfo.homeTeam?.flag ? [matchInfo.homeTeam.flag] : []

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  }
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <MatchClientPage slug={resolvedParams.slug} />
}
