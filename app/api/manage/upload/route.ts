import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    
    if (!file) {
      return NextResponse.json({ error: "No file provided in form data" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Clean up file name to prevent filesystem syntax errors
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${Date.now()}-${safeName}`

    // Save under public/uploads/ in project workspace
    const uploadDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const filePath = join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Return the local serving path
    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`
    })
  } catch (err: any) {
    console.error("Upload API Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
