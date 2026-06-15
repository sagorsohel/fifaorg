import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatScorers(scorersStr: string | null | undefined): string {
  if (!scorersStr || scorersStr === "null" || scorersStr.trim() === "") return ""
  
  let clean = scorersStr.trim()
  if (clean.startsWith("{") && clean.endsWith("}")) {
    clean = clean.slice(1, -1)
  }
  
  const parts = clean.split(",")
  const formattedParts = parts.map(part => {
    let p = part.trim()
    // Strip leading/trailing quote characters of all kinds
    p = p.replace(/^["“'”‘]+|["“'”’]+$/g, "")
    return p.trim()
  }).filter(Boolean)
  
  return formattedParts.join(", ")
}

export function getScorersArray(scorersStr: string | null | undefined): string[] {
  if (!scorersStr || scorersStr === "null" || scorersStr.trim() === "") return []
  
  let clean = scorersStr.trim()
  if (clean.startsWith("{") && clean.endsWith("}")) {
    clean = clean.slice(1, -1)
  }
  
  const parts = clean.split(",")
  return parts.map(part => {
    let p = part.trim()
    // Strip leading/trailing quote characters of all kinds
    p = p.replace(/^["“'”‘]+|["“'”’]+$/g, "")
    return p.trim()
  }).filter(Boolean)
}
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const cleaned = url.trim()
  const uploadIndex = cleaned.indexOf("/uploads/")
  if (uploadIndex !== -1) {
    return cleaned.slice(uploadIndex)
  }
  return cleaned || null
}

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return ""
  const cleaned = url.trim()
  if (cleaned.startsWith("/uploads/")) {
    const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || process.env.image_link || ""
    const trimmedBase = base.replace(/\/$/, "")
    return trimmedBase ? `${trimmedBase}${cleaned}` : cleaned
  }
  return cleaned
}

