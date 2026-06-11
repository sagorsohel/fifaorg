"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
import { detectBrowserLanguage, LANGUAGES } from "@/lib/i18n"
import { Footer } from "./footer"
import { MobileNav } from "./mobile-nav"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)

  useEffect(() => {
    // Detect browser or local storage language and sync to Redux
    try {
      const saved = localStorage.getItem("worldcup2026_lang")
      if (saved) {
        dispatch(setLanguage(saved as any))
      } else {
        const detected = detectBrowserLanguage()
        dispatch(setLanguage(detected))
        localStorage.setItem("worldcup2026_lang", detected)
      }
    } catch (e) {
      const detected = detectBrowserLanguage()
      dispatch(setLanguage(detected))
    }
  }, [dispatch])

  const dir = LANGUAGES.find((l) => l.code === lang)?.dir || "ltr"

  return (
    <div dir={dir} className="min-h-screen bg-slate-950 text-slate-100 transition-all duration-300 relative flex flex-col justify-between">
      <div className="flex-1 w-full relative z-10">
        {children}
      </div>
      <Footer />
      <MobileNav />
    </div>
  )
}
