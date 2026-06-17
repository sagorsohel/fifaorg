"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setLanguage, setDetectedTimezone } from "@/lib/features/uiSlice"
import { detectBrowserLanguage, LANGUAGES, mapCountryToLanguage, VALID_PREFIXES, getPrefixFromLanguage, getLanguageFromPrefix, getTimezoneLanguage, LanguageCode } from "@/lib/i18n"
import { usePathname } from "next/navigation"
import { Footer } from "./footer"
// import { MobileNav } from "./mobile-nav"
import { Navbar } from "./navbar"
import { useTheme } from "next-themes"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isInitialized, setIsInitialized] = useState(false)
  const isManageRoute = pathname?.startsWith("/manage")

  // Synchronize URL prefix when pathname or language changes (without page reloads!)
  useEffect(() => {
    if (isManageRoute || !isInitialized) return

    const currentPrefix = getPrefixFromLanguage(lang)
    const pathParts = window.location.pathname.split("/")
    const firstSeg = pathParts[1]

    if (firstSeg && VALID_PREFIXES.includes(firstSeg.toLowerCase())) {
      const pathLang = getLanguageFromPrefix(firstSeg)
      if (pathLang !== lang) {
        // Language changed from the dropdown, update URL prefix in address bar without reload!
        pathParts[1] = currentPrefix
        const newPath = pathParts.join("/")
        const search = window.location.search
        
        // Update cookie, localStorage, and browser URL path without reload
        document.cookie = `worldcup2026_lang=${lang}; path=/; max-age=31536000`
        localStorage.setItem("worldcup2026_lang", lang)
        window.history.replaceState(null, "", newPath + search)
      }
    } else {
      // Path has no prefix. Normalizing URL in address bar without reload!
      const newPath = "/" + currentPrefix + window.location.pathname
      const search = window.location.search
      window.history.replaceState(null, "", newPath + search)
      document.cookie = `worldcup2026_lang=${lang}; path=/; max-age=31536000`
      localStorage.setItem("worldcup2026_lang", lang)
    }
  }, [lang, pathname, isManageRoute, isInitialized])

  useEffect(() => {
    // Detect browser, local storage, or IP-based region and sync to Redux
    const initLanguage = async () => {
      const getRegionData = async () => {
        try {
          const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
          if (isLocalhost) {
            // Fetch directly from client-side IP api to route through browser VPN extension
            const clientRes = await fetch("https://ipwhois.app/json/", { signal: AbortSignal.timeout(3000) })
            if (clientRes.ok) {
              const clientData = await clientRes.json()
              if (clientData && clientData.timezone) {
                return {
                  timezone: clientData.timezone,
                  country_code: clientData.country_code || null
                }
              }
            }
          }
        } catch (e) {
          console.error("Client side IP lookup failed, falling back to server:", e)
        }

        try {
          const res = await fetch("/api/detect-region")
          if (res.ok) {
            return await res.json()
          }
        } catch (e) {}
        return null
      }

      try {
        // Set initial timezone guess instantly
        try {
          const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone
          if (localTz) {
            dispatch(setDetectedTimezone(localTz))
          }
        } catch (tzErr) {}

        // Check URL pathname prefix first
        let pathLang: any = null
        if (typeof window !== "undefined") {
          const pathParts = window.location.pathname.split("/")
          const firstSeg = pathParts[1]
          if (firstSeg && VALID_PREFIXES.includes(firstSeg.toLowerCase())) {
            pathLang = getLanguageFromPrefix(firstSeg)
          }
        }

        const cookieMatch = typeof document !== "undefined" && document.cookie.match(/(?:^|; )worldcup2026_lang=([^;]*)/)
        const cookieLang = cookieMatch ? cookieMatch[1] : null

        const saved = localStorage.getItem("worldcup2026_lang")
        const hasManualCookie = typeof document !== "undefined" && document.cookie.includes("worldcup2026_lang_manual=true")
        const isManual = (localStorage.getItem("worldcup2026_lang_manual") === "true") || hasManualCookie

        if (pathLang) {
          dispatch(setLanguage(pathLang))
          localStorage.setItem("worldcup2026_lang", pathLang)
          document.cookie = `worldcup2026_lang=${pathLang}; path=/; max-age=31536000`
          
          // Verify physical location in background and override if not manual selection
          try {
            const data = await getRegionData()
            if (data) {
              if (data.timezone) {
                dispatch(setDetectedTimezone(data.timezone))
              }
              
              if (!isManual) {
                let detectedCountryLang: LanguageCode | null = null
                if (data.country_code) {
                  detectedCountryLang = mapCountryToLanguage(data.country_code)
                } else {
                  detectedCountryLang = getTimezoneLanguage()
                }
                
                if (detectedCountryLang && detectedCountryLang !== pathLang) {
                  console.log("[LAYOUT WRAPPER] Automatically overriding default prefix:", pathLang, "->", detectedCountryLang)
                  dispatch(setLanguage(detectedCountryLang))
                  localStorage.setItem("worldcup2026_lang", detectedCountryLang)
                  document.cookie = `worldcup2026_lang=${detectedCountryLang}; path=/; max-age=31536000`
                }
              }
            }
          } catch (e) {
            console.error("[LAYOUT WRAPPER] Failed dynamic prefix override check:", e)
          }
        } else if (cookieLang && isManual && LANGUAGES.some(l => l.code === cookieLang)) {
          dispatch(setLanguage(cookieLang as any))
          localStorage.setItem("worldcup2026_lang", cookieLang)
          
          // Only fetch timezone in background, do not overwrite language
          try {
            const data = await getRegionData()
            if (data && data.timezone) {
              dispatch(setDetectedTimezone(data.timezone))
            }
          } catch (e) {}
        } else if (saved && isManual) {
          dispatch(setLanguage(saved as any))
          document.cookie = `worldcup2026_lang=${saved}; path=/; max-age=31536000`
          
          // Still fetch IP-based timezone background even if language is saved
          try {
            const data = await getRegionData()
            if (data && data.timezone) {
              dispatch(setDetectedTimezone(data.timezone))
            }
          } catch (e) {}
        } else {
          // 1. Initial guess based on browser locale
          const detected = detectBrowserLanguage()
          dispatch(setLanguage(detected))
          document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`

          // 2. Fetch region/country/timezone based on IP (background)
          try {
            console.log("[LAYOUT WRAPPER] Fetching region data...")
            const data = await getRegionData()
            console.log("[LAYOUT WRAPPER] Geolocation response data:", data)
            
            let detectedCountryLang: LanguageCode | null = null

            if (data && data.country_code) {
              detectedCountryLang = mapCountryToLanguage(data.country_code)
            } else {
              // Fallback to client-side timezone check (highly accurate for local developers)
              detectedCountryLang = getTimezoneLanguage()
              console.log("[LAYOUT WRAPPER] Geolocation failed/empty, timezone fallback lang:", detectedCountryLang)
            }

            if (detectedCountryLang) {
              console.log("[LAYOUT WRAPPER] Setting active language and redirecting prefix to:", detectedCountryLang)
              dispatch(setLanguage(detectedCountryLang))
              localStorage.setItem("worldcup2026_lang", detectedCountryLang)
              document.cookie = `worldcup2026_lang=${detectedCountryLang}; path=/; max-age=31536000`
            }
          } catch (e) {
            console.error("[LAYOUT WRAPPER] Failed background detection:", e)
          }
        }
      } catch (e) {
        console.error("[LAYOUT WRAPPER] General initialization error:", e)
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
        document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`
      } finally {
        setIsInitialized(true)
      }
    }

    initLanguage()
  }, [dispatch])

  useEffect(() => {
    if (pathname?.startsWith("/manage")) {
      return
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12 key
      if (e.key === "F12") {
        e.preventDefault()
        return
      }

      // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && ["I", "J", "C", "i", "j", "c"].includes(e.key)) {
        e.preventDefault()
        return
      }

      // Disable Ctrl+U (View Source)
      if (e.ctrlKey && ["U", "u"].includes(e.key)) {
        e.preventDefault()
        return
      }

      // Disable Cmd+Opt+I, Cmd+Opt+J, Cmd+Opt+C, Cmd+Opt+U (macOS equivalents)
      if (metaKeyOrAltKey(e)) {
        e.preventDefault()
        return
      }
    }

    function metaKeyOrAltKey(e: KeyboardEvent) {
      return e.metaKey && e.altKey && ["I", "J", "C", "U", "i", "j", "c", "u"].includes(e.key);
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [pathname])

  useEffect(() => {
    if (pathname?.startsWith("/manage") && theme !== "dark") {
      setTheme("dark")
    }
  }, [pathname, theme, setTheme])

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || "ltr"

  if (isManageRoute) {
    return (
      <div suppressHydrationWarning dir={dir} className="dark min-h-screen bg-slate-955 text-slate-100 font-sans antialiased relative">
        {children}
      </div>
    )
  }

  return (
    <div suppressHydrationWarning dir={dir} className="min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 relative flex flex-col justify-between">
      <Navbar />
      <div suppressHydrationWarning className="flex-1 w-full relative z-10">
        {children}
      </div>
      <Footer />
      {/* <MobileNav /> */}
    </div>
  )
}
