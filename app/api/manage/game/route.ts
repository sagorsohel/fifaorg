import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { games } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sanitizeImageUrl } from "@/lib/utils"

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
        modal_image: sanitizeImageUrl(modal_image),
        bg_image: sanitizeImageUrl(bg_image)
      })
      .where(eq(games.id, id))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
