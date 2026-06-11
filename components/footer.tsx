"use client"

import { useAppSelector } from "@/lib/store"
import { translate } from "@/lib/i18n"

export function Footer() {
  const lang = useAppSelector((state) => state.ui.language)

  return (
    <footer className="mb-24 sm:mb-0 mt-16 py-8 border-t border-slate-900/60 bg-slate-950/40 text-center text-xs text-slate-600 relative z-10">
      <p className="max-w-7xl mx-auto px-4">
        {translate("title", lang)} Dashboard • Integrated with worldcup26.ir APIs
      </p>
    </footer>
  )
}
