"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
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
      try {
        const saved = localStorage.getItem("worldcup2026_lang")
        if (saved) {
          dispatch(setLanguage(saved as any))
          document.cookie = `worldcup2026_lang=${saved}; path=/; max-age=31536000`
          return
        }

        // 1. Initial guess based on timezone/browser locale (instant)
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
        document.cookie = `worldcup2026_lang=${detected}; path=/; max-age=31536000`

        // 2. Fetch region/country based on IP (background)
        const res = await fetch("/api/detect-region")
        if (res.ok) {
          const data = await res.json()
          if (data && data.country_code) {
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
      if (e.metaKey && e.altKey && ["I", "J", "C", "U", "i", "j", "c", "u"].includes(e.key)) {
        e.preventDefault()
        return
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

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
