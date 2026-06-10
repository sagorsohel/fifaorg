import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  try {
    await ensureTablesExist()
    const { id, referral_link, modal_image, bg_image } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: "Missing match ID" }, { status: 400 })
    }

    await db.update(games)
      .set({
        referral_link: referral_link || null,
        modal_image: modal_image || null,
        bg_image: bg_image || null
      })
      .where(eq(games.id, id))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
