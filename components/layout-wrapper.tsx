"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setLanguage, setDetectedTimezone } from "@/lib/features/uiSlice"
import { detectBrowserLanguage, LANGUAGES, mapCountryToLanguage } from "@/lib/i18n"
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

        const saved = localStorage.getItem("worldcup2026_lang")
        if (saved) {
          dispatch(setLanguage(saved as any))
          document.cookie = `worldcup2026_lang=${saved}; path=/; max-age=31536000`
          
          // Still fetch IP-based timezone background even if language is saved
          try {
            const data = await getRegionData()
            if (data && data.timezone) {
              dispatch(setDetectedTimezone(data.timezone))
            }
          } catch (e) {}
          return
        }

        // 1. Initial guess based on timezone/browser locale (instant)
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
        document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`

        // 2. Fetch region/country/timezone based on IP (background)
        const data = await getRegionData()
        if (data) {
          if (data.timezone) {
            dispatch(setDetectedTimezone(data.timezone))
          }
          if (data.country_code) {
            const mappedLang = mapCountryToLanguage(data.country_code)
            if (mappedLang) {
              dispatch(setLanguage(mappedLang))
              localStorage.setItem("worldcup2026_lang", mappedLang)
              document.cookie = `worldcup2026_lang=${mappedLang}; path=/; max-age=31536000`
              return
            }
          }
        }

        // If fetch fails or no mapped language, save the initial timezone/browser locale guess
        localStorage.setItem("worldcup2026_lang", detected)
        document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`
      } catch (e) {
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
        document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`
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
  const isManageRoute = pathname?.startsWith("/manage")

  if (isManageRoute) {
    return (
      <div dir={dir} className="dark min-h-screen bg-slate-955 text-slate-100 font-sans antialiased relative">
        {children}
      </div>
    )
  }

  return (
    <div dir={dir} className="min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 relative flex flex-col justify-between">
      <Navbar />
      <div className="flex-1 w-full relative z-10">
        {children}
      </div>
      <Footer />
      {/* <MobileNav /> */}
    </div>
  )
}
