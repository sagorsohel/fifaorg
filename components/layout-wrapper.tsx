"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
import { detectBrowserLanguage, LANGUAGES, mapCountryToLanguage } from "@/lib/i18n"
import { Footer } from "./footer"
// import { MobileNav } from "./mobile-nav"
import { Navbar } from "./navbar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)

  useEffect(() => {
    // Detect browser, local storage, or IP-based region and sync to Redux
    const initLanguage = async () => {
      try {
        const saved = localStorage.getItem("worldcup2026_lang")
        if (saved) {
          dispatch(setLanguage(saved as any))
          return
        }

        // 1. Initial guess based on timezone/browser locale (instant)
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))

        // 2. Fetch region/country based on IP (background)
        const res = await fetch("/api/detect-region")
        if (res.ok) {
          const data = await res.json()
          if (data && data.country_code) {
            const mappedLang = mapCountryToLanguage(data.country_code)
            if (mappedLang) {
              dispatch(setLanguage(mappedLang))
              localStorage.setItem("worldcup2026_lang", mappedLang)
              return
            }
          }
        }

        // If fetch fails or no mapped language, save the initial timezone/browser locale guess
        localStorage.setItem("worldcup2026_lang", detected)
      } catch (e) {
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
      }
    }

    initLanguage()
  }, [dispatch])

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || "ltr"

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
