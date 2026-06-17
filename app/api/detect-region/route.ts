import { NextRequest, NextResponse } from "next/server"

async function fetchRegionData(ip: string): Promise<{ country_code: string | null; timezone: string | null }> {
  const providers = [
    async () => {
      const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/"
      const r = await fetch(url, { signal: AbortSignal.timeout(1500) })
      if (r.ok) {
        const d = await r.json()
        return {
          country_code: d.country_code || null,
          timezone: d.timezone || null
        }
      }
      return null
    },
    async () => {
      const url = ip ? `https://ipwhois.app/json/${ip}` : "https://ipwhois.app/json/"
      const r = await fetch(url, { signal: AbortSignal.timeout(1500) })
      if (r.ok) {
        const d = await r.json()
        return {
          country_code: d.country_code || null,
          timezone: d.timezone || null
        }
      }
      return null
    },
    async () => {
      const url = ip ? `http://ip-api.com/json/${ip}` : "http://ip-api.com/json/"
      const r = await fetch(url, { signal: AbortSignal.timeout(1500) })
      if (r.ok) {
        const d = await r.json()
        return {
          country_code: d.countryCode || null,
          timezone: d.timezone || null
        }
      }
      return null
    }
  ]

  for (const provider of providers) {
    try {
      const res = await provider()
      if (res && (res.country_code || res.timezone)) {
        return {
          country_code: res.country_code ? res.country_code.toUpperCase() : null,
          timezone: res.timezone || null
        }
      }
    } catch (e) {
      // Continue to the next fallback provider
    }
  }
  return { country_code: null, timezone: null }
}

export async function GET(request: NextRequest) {
  try {
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || ""
    if (ip) {
      ip = ip.split(",")[0].trim()
    }

    // Filter out localhost / private IPs so the proxy doesn't query them
    const isLocal = !ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.")

    const regionData = await fetchRegionData(isLocal ? "" : ip)
    return NextResponse.json(regionData)
  } catch (e: any) {
    return NextResponse.json({ country_code: null, timezone: null, error: e.message })
  }
}
