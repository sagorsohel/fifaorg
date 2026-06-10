import { NextResponse } from "next/server"
import { db, ensureTablesExist } from "@/lib/db"
import { ads } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    await ensureTablesExist()
    let adsData = await db.select().from(ads).where(eq(ads.id, "global")).then(r => r[0])
    if (!adsData) {
      await db.insert(ads).values({ id: "global", hero_ads: "", modal_ads: "", header_ads: "" })
      adsData = { id: "global", hero_ads: "", modal_ads: "", header_ads: "" }
    }
    return NextResponse.json({ success: true, ads: adsData })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await ensureTablesExist()
    const { hero_ads, modal_ads, header_ads } = await request.json()

    await db.update(ads)
      .set({
        hero_ads: hero_ads ?? "",
        modal_ads: modal_ads ?? "",
        header_ads: header_ads ?? ""
      })
      .where(eq(ads.id, "global"))

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
