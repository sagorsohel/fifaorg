"use client"

import Link from "next/link"
import { Trophy } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { LANGUAGES, translate } from "@/lib/i18n"

export function Navbar() {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)

  return (
    <header className="sticky top-0 z-40 bg-slate-955/80 backdrop-blur-md border-b border-slate-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer select-none">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15 group-hover:scale-[1.03] transition-transform duration-300">
            <Trophy className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300">
              {translate("title", lang)}
            </h1>
            <p className="text-xs text-slate-400 font-medium">{translate("subtitle", lang)}</p>
          </div>
        </Link>

        {/* Action Filters / Language Dropdown */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="flex items-center gap-2 z-50">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-3.5 py-2.5 rounded-xl hover:border-cyan-500/30 focus:outline-hidden transition-all cursor-pointer shadow-xs flex items-center gap-1.5 capitalize">
                <span>{LANGUAGES.find((l) => l.code === lang)?.name || "Language"}</span>
                <span className="text-[10px] text-slate-505">▼</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl min-w-[120px] shadow-xl p-1 z-50">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => {
                      dispatch(setLanguage(l.code))
                      try {
                        localStorage.setItem("worldcup2026_lang", l.code)
                      } catch { }
                    }}
                    className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${
                      lang === l.code ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300"
                    }`}
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
