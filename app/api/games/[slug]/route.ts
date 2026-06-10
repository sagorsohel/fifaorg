import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { eq, or } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: "Missing slug parameter" }, { status: 400 })
    }

    const matchedGames = await db
      .select()
      .from(games)
      .where(
        or(
          eq(games.slug, slug),
          eq(games.id, slug),
          eq(games._id, slug)
        )
      )
      .limit(1)

    if (matchedGames.length === 0) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    return NextResponse.json({ game: matchedGames[0] })
  } catch (error: any) {
    console.error("Fetch single game error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
