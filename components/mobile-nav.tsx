"use client"

import { useRouter, usePathname } from "next/navigation"
import { RefreshCw } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setActiveTab, setSelectedTeamId, setLanguage } from "@/lib/features/uiSlice"
import { LANGUAGES, translate, VALID_PREFIXES } from "@/lib/i18n"
import { useGetTeamsQuery, useGetGamesQuery, useGetStadiumsQuery } from "@/lib/services/apiSlice"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export function MobileNav() {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { activeTab, selectedTeamId, language: lang } = useAppSelector((state) => state.ui)

  const { refetch: refetchTeams } = useGetTeamsQuery()
  const { refetch: refetchGames } = useGetGamesQuery()
  const { refetch: refetchStadiums } = useGetStadiumsQuery()

  const handleRefetch = () => {
    refetchTeams()
    refetchGames()
    refetchStadiums()
  }

  const navigateToTab = (tab: "matches" | "teams") => {
    dispatch(setActiveTab(tab))
    dispatch(setSelectedTeamId(null))
    const isHome = pathname === "/" || VALID_PREFIXES.some(prefix => pathname === `/${prefix}` || pathname === `/${prefix}/`)
    if (!isHome) {
      router.push("/")
    }
  }

  return (
    <nav
      aria-label="Mobile navigation"
      className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end px-4 rounded-[12px] bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 shadow-2xl shadow-black/40"
      style={{ minWidth: 320, height: 64, paddingBottom: 8, gap: 4 }}
    >
      {/* Fixtures Tab */}
      <button
        id="mobile-nav-fixtures"
        onClick={() => navigateToTab("matches")}
        className="relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer"
        style={{ paddingBottom: 2 }}
      >
        {activeTab === "matches" && !selectedTeamId ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-[58px] h-[58px] rounded-full bg-linear-to-br from-cyan-400 to-cyan-600 shadow-xl shadow-cyan-500/50 border-[3px] border-slate-900 transition-all duration-300">
            <span className="text-xl leading-none select-none">⚽</span>
            <span className="text-[8px] font-black uppercase tracking-wider text-white leading-none mt-0.5 select-none">Fixtures</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-cyan-400 transition-colors duration-200 select-none font-sans">
            <span className="text-[18px] leading-none">⚽</span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Fixtures</span>
          </span>
        )}
      </button>

      {/* Divider */}
      <span className="w-px bg-slate-800 shrink-0 self-center" style={{ height: 32 }} />

      {/* Teams Tab */}
      <button
        id="mobile-nav-teams"
        onClick={() => navigateToTab("teams")}
        className="relative flex flex-col items-center justify-end flex-1 h-full cursor-pointer"
        style={{ paddingBottom: 2 }}
      >
        {activeTab === "teams" && !selectedTeamId ? (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-[58px] h-[58px] rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/50 border-[3px] border-slate-900 transition-all duration-300">
            <span className="text-xl leading-none select-none">🏆</span>
            <span className="text-[8px] font-black uppercase tracking-wider text-white leading-none mt-0.5 select-none font-sans">Teams</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-400 transition-colors duration-200 select-none font-sans">
            <span className="text-[18px] leading-none">🏆</span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">Teams</span>
          </span>
        )}
      </button>

      {/* Divider */}
      <span className="w-px bg-slate-800 shrink-0 self-center" style={{ height: 32 }} />

      {/* Language Dropdown */}
      <div className="flex flex-col items-center justify-end flex-1 h-full cursor-pointer relative" style={{ paddingBottom: 2 }}>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-cyan-400 transition-colors duration-200 select-none outline-hidden cursor-pointer font-sans">
            <span className="text-[18px] leading-none">🌐</span>
            <span className="text-[9px] font-bold uppercase tracking-wider leading-none">
              {lang === "en" || lang === "en-us" ? "EN" : lang.toUpperCase()} ▼
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="center" className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl min-w-[120px] shadow-xl p-1 z-50">
            {LANGUAGES.map((l) => (
              <DropdownMenuItem
                key={l.code}
                onClick={() => {
                  dispatch(setLanguage(l.code))
                  try {
                    localStorage.setItem("worldcup2026_lang", l.code)
                    localStorage.setItem("worldcup2026_lang_manual", "true")
                    document.cookie = `worldcup2026_lang=${l.code}; path=/; max-age=31536000`
                  } catch (err) { }
                }}
                className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${lang === l.code ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300"
                  }`}
              >
                {l.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Divider */}
      <span className="w-px bg-slate-800 shrink-0 self-center" style={{ height: 32 }} />

      {/* Refresh Tab */}
      <button
        id="mobile-nav-refresh"
        onClick={handleRefetch}
        className="flex flex-col items-center justify-end flex-1 h-full cursor-pointer"
        style={{ paddingBottom: 2 }}
      >
        <span className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-emerald-450 transition-colors duration-200 select-none font-sans">
          <RefreshCw className="w-4.5 h-4.5 text-slate-400 hover:text-emerald-400 transition-colors duration-200" />
          <span className="text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5">Refresh</span>
        </span>
      </button>
    </nav>
  )
}
