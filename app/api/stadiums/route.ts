import { NextResponse } from "next/server"

export async function GET() {
  try {
    let res;
    try {
      res = await fetch("http://worldcup26.ir:3050/get/stadiums")
    } catch (err) {
      console.warn("Stadiums route DNS resolution failed, falling back to direct IP address.")
      res = await fetch("http://82.115.13.31:3050/get/stadiums")
    }
    
    if (!res.ok) {
      throw new Error(`Failed to fetch stadiums: ${res.status}`)
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
