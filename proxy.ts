import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { LANGUAGES, COUNTRY_TO_LANG, VALID_PREFIXES } from "./lib/i18n"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Ignore static assets, api routes, uploads, manage routes, etc.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/manage") ||
    pathname === "/favicon.ico" ||
    pathname === "/logo.png" ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // ignore files with extensions
  ) {
    return NextResponse.next()
  }

  // Extract first path segment
  const segments = pathname.split("/")
  const firstSegment = segments[1]?.toLowerCase()

  if (firstSegment && VALID_PREFIXES.has(firstSegment)) {
    // This is a valid prefix!
    // Resolve language
    let lang = firstSegment
    if (COUNTRY_TO_LANG[firstSegment]) {
      lang = COUNTRY_TO_LANG[firstSegment]
    }

    // Rewrite URL to remove the prefix internally
    const restOfPath = "/" + segments.slice(2).join("/")
    const url = new URL(restOfPath, request.url)
    
    // Copy search params
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value)
    })

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-next-lang", lang)
    requestHeaders.set("x-url", pathname) // Preserve original request pathname in x-url header

    const response = NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      }
    })

    // Set cookie if it's different
    const currentCookie = request.cookies.get("worldcup2026_lang")?.value
    if (currentCookie !== lang) {
      response.cookies.set("worldcup2026_lang", lang, {
        path: "/",
        maxAge: 31536000
      })
    }

    return response
  }

  // If there is no valid prefix, we check if we should auto-redirect to a prefixed URL.
  const cookieLang = request.cookies.get("worldcup2026_lang")?.value
  let targetPrefix = ""

  if (cookieLang && LANGUAGES.some(l => l.code === cookieLang)) {
    if (cookieLang === "en-us") targetPrefix = "us"
    else if (cookieLang === "hi") targetPrefix = "in"
    else targetPrefix = cookieLang
  } else {
    // Check Accept-Language
    const acceptLang = request.headers.get("accept-language")
    if (acceptLang) {
      const preferred = acceptLang.split(",")[0].split(";")[0].trim().toLowerCase()
      const base = preferred.split("-")[0]
      if (preferred === "bn" || base === "bn") targetPrefix = "bn"
      else if (preferred === "hi" || base === "hi") targetPrefix = "in"
      else if (preferred === "en-us" || preferred === "en-ca") targetPrefix = "us"
      else if (VALID_PREFIXES.has(preferred)) targetPrefix = preferred
      else if (VALID_PREFIXES.has(base)) targetPrefix = base
    }
  }

  // Default fallback is "en"
  if (!targetPrefix || !VALID_PREFIXES.has(targetPrefix)) {
    targetPrefix = "en"
  }

  // Redirect to prefixed URL
  const redirectUrl = new URL(`/${targetPrefix}${pathname}`, request.url)
  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.set(key, value)
  })

  const response = NextResponse.redirect(redirectUrl)
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
