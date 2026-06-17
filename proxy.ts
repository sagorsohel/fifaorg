import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { 
  VALID_PREFIXES, 
  getLanguageFromPrefix, 
  getPrefixFromLanguage, 
  COUNTRY_TO_LANG, 
  LANGUAGES 
} from "./lib/i18n"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Set the x-url header for layouts/components that use it
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-url", pathname)

  // Skip api routes, static files, uploads, next internal routes, manage routes, or files with extensions
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/manage") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Parse path segments
  const pathParts = pathname.split("/")
  const firstSeg = pathParts[1]

  // Check if first segment is a valid prefix (e.g. en, fr, bn, he, kr)
  if (firstSeg && VALID_PREFIXES.includes(firstSeg.toLowerCase())) {
    const langCode = getLanguageFromPrefix(firstSeg)

    // Construct the internal path (without prefix)
    const internalPath = "/" + pathParts.slice(2).join("/")

    // Set request headers so the server components can read x-next-lang
    requestHeaders.set("x-next-lang", langCode)

    const response = NextResponse.rewrite(new URL(internalPath, request.url), {
      request: {
        headers: requestHeaders,
      },
    })

    // Set language cookie so the client state and subsequent requests persist
    response.cookies.set("worldcup2026_lang", langCode, { path: "/", maxAge: 31536000 })
    return response
  }

  // If no prefix is present: auto-detect and redirect
  let detectedLang: string | undefined = undefined

  // Check for overrides in query params first (ideal for testing/debugging)
  const langParam = request.nextUrl.searchParams.get("lang")
  const countryParam = request.nextUrl.searchParams.get("country")

  if (langParam && LANGUAGES.some(l => l.code === langParam.toLowerCase())) {
    detectedLang = langParam.toLowerCase()
  } else if (countryParam && COUNTRY_TO_LANG[countryParam.toUpperCase()]) {
    detectedLang = COUNTRY_TO_LANG[countryParam.toUpperCase()]
  }

  // 1. Check if user already has a valid language cookie and it was set manually
  if (!detectedLang) {
    const isManual = request.cookies.get("worldcup2026_lang_manual")?.value === "true"
    if (isManual) {
      detectedLang = request.cookies.get("worldcup2026_lang")?.value
    }
  }
  
  if (!detectedLang || !LANGUAGES.some(l => l.code === detectedLang)) {
    // 2. Detect from Cloudflare or Vercel GeoIP country headers
    const country = request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country")
    if (country && COUNTRY_TO_LANG[country.toUpperCase()]) {
      detectedLang = COUNTRY_TO_LANG[country.toUpperCase()]
    } else {
      // Check if we are running locally (localhost or LAN IP)
      const host = request.headers.get("host") || ""
      const isLocal = host.includes("localhost") || host.includes("127.0.0.1") || host.includes("192.168.")
      let localTzLang: any = null
      
      if (isLocal) {
        try {
          const serverTz = Intl.DateTimeFormat().resolvedOptions().timeZone
          if (serverTz) {
            const tzLower = serverTz.toLowerCase()
            if (tzLower.includes("dhaka") || tzLower.includes("kolkata") || tzLower.includes("calcutta")) localTzLang = "bn"
            else if (tzLower.includes("sao_paulo") || tzLower.includes("brazil") || tzLower.includes("rio") || tzLower.includes("manaus") || tzLower.includes("recife") || tzLower.includes("fortaleza")) localTzLang = "pt"
            else if (tzLower.includes("lisbon") || tzLower.includes("portugal") || tzLower.includes("madeira") || tzLower.includes("azores")) localTzLang = "pt-pt"
            else if (tzLower.includes("madrid") || tzLower.includes("spain") || tzLower.includes("canary") || tzLower.includes("balearic")) localTzLang = "es"
            else if (["buenos_aires", "santiago", "bogota", "lima", "mexico", "caracas", "quito", "guayaquil", "montevideo", "asuncion", "la_paz", "panama", "costa_rica", "san_jose", "honduras", "tegucigalpa", "el_salvador", "guatemala", "nicaragua", "managua"].some(city => tzLower.includes(city))) localTzLang = "es-la"
            else if (tzLower.includes("paris") || tzLower.includes("france") || tzLower.includes("monaco")) localTzLang = "fr"
            else if (tzLower.includes("rome") || tzLower.includes("italy") || tzLower.includes("san_marino") || tzLower.includes("vatican")) localTzLang = "it"
            else if (tzLower.includes("amsterdam") || tzLower.includes("netherlands") || tzLower.includes("brussels") || tzLower.includes("belgium") || tzLower.includes("suriname")) localTzLang = "nl"
            else if (tzLower.includes("berlin") || tzLower.includes("germany") || tzLower.includes("vienna") || tzLower.includes("austria") || tzLower.includes("liechtenstein")) localTzLang = "de"
            else if (tzLower.includes("tehran")) localTzLang = "ar"
            else if (["riyadh", "cairo", "baghdad", "dubai", "kuwait", "qatar", "doha", "muscat", "bahrain", "amman", "beirut", "damascus", "khartoum", "tripoli", "tunis", "algiers", "casablanca"].some(city => tzLower.includes(city))) localTzLang = "ar"
            else if (tzLower.includes("baku")) localTzLang = "az"
            else if (tzLower.includes("istanbul")) localTzLang = "tr"
            else if (tzLower.includes("shanghai") || tzLower.includes("urumqi") || tzLower.includes("hong_kong") || tzLower.includes("taipei") || tzLower.includes("beijing") || tzLower.includes("china")) localTzLang = "zh"
            else if (tzLower.includes("tokyo") || tzLower.includes("japan")) localTzLang = "jp"
            else if (tzLower.includes("seoul") || tzLower.includes("korea")) localTzLang = "kr"
            else if (tzLower.includes("saigon") || tzLower.includes("hanoi") || tzLower.includes("vietnam")) localTzLang = "vn"
            else if (tzLower.includes("jerusalem") || tzLower.includes("tel_aviv") || tzLower.includes("israel")) localTzLang = "he"
            else if (tzLower.includes("bangkok") || tzLower.includes("thai")) localTzLang = "th"
            else if (tzLower.includes("zurich") || tzLower.includes("geneva") || tzLower.includes("switzerland")) localTzLang = "ch"
          }
        } catch (e) {}
      }

      if (localTzLang) {
        detectedLang = localTzLang
      }
    }
  }

  // Fallback to "en" if nothing is resolved
  const finalLang = (detectedLang && LANGUAGES.some(l => l.code === detectedLang)) 
    ? (detectedLang as any) 
    : "en"

  const redirectPrefix = getPrefixFromLanguage(finalLang)

  // Redirect to prefixed URL, keeping query parameters and pathname
  const redirectUrl = new URL(`/${redirectPrefix}${pathname}${request.nextUrl.search}`, request.url)
  const response = NextResponse.redirect(redirectUrl, 307)
  response.cookies.set("worldcup2026_lang", finalLang, { path: "/", maxAge: 31536000 })
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (upload files)
     */
    "/((?!api|_next/static|_next/image|uploads|favicon.ico).*)",
  ],
}
