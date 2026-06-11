import { Metadata } from "next"
import { db } from "@/lib/db"
import { teams } from "@/lib/db/schema"
import TeamClientPage from "@/components/team-client-page"

async function getTeamByIdOrSlug(id: string) {
  try {
    const allTeams = await db.select().from(teams)
    const target = id.toLowerCase().trim()
    return allTeams.find((t) => {
      const slug = t.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      return (
        t.id.toLowerCase() === target ||
        t._id.toLowerCase() === target ||
        t.fifa_code?.toLowerCase() === target ||
        slug === target
      )
    })
  } catch (error) {
    console.error("Failed to query team from database:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const team = await getTeamByIdOrSlug(resolvedParams.id)

  if (!team) {
    return {
      title: "Team Not Found | FIFA WC26 on Screen",
    }
  }

  const teamName = team.name_en
  const title = `${teamName} | Live Match, Fixture & Standing`
  const description = `Stream 2026 FIFA World Cup "${teamName}" match live including scores, standings, and highlights.`
  const images = team.flag ? [team.flag] : []

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

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <TeamClientPage teamId={resolvedParams.id} />
}
