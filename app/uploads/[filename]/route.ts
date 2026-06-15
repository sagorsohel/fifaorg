import { NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const filePath = join(process.cwd(), "public", "uploads", filename)

    if (!existsSync(filePath)) {
      return new NextResponse("File Not Found", { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    // Determine content-type based on file extension
    let contentType = "application/octet-stream"
    const lowerName = filename.toLowerCase()
    if (lowerName.endsWith(".png")) contentType = "image/png"
    else if (lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")) contentType = "image/jpeg"
    else if (lowerName.endsWith(".gif")) contentType = "image/gif"
    else if (lowerName.endsWith(".svg")) contentType = "image/svg+xml"
    else if (lowerName.endsWith(".webp")) contentType = "image/webp"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (err: any) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
