"use client"

import { useMemo } from "react"
import Link from "next/link"
import { AlertTriangle, ChevronRight, Home } from "lucide-react"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  Team,
  Stadium
} from "@/lib/services/apiSlice"
import { useAppSelector } from "@/lib/store"
import { translate, parseStadiumLocalDate } from "@/lib/i18n"
import MatchCard from "@/components/dashboard/match-card"

export default function NotFound() {
  const lang = useAppSelector((state) => state.ui.language)

  // API Queries via RTK Query
  const { data: teamsData, isLoading: isTeamsLoading } = useGetTeamsQuery()
  const { data: gamesData, isLoading: isGamesLoading } = useGetGamesQuery()
  const { data: stadiumsData, isLoading: isStadiumsLoading } = useGetStadiumsQuery()

  // Create lookup maps
  const flagMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((team) => {
        map[team.id] = team.flag
        map[team.name_en.toLowerCase()] = team.flag
      })
    }
    return map
  }, [teamsData])

  const teamNamesMap = useMemo(() => {
    const map: Record<string, Team> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((team) => {
        map[team.id] = team
      })
    }
    return map
  }, [teamsData])

  const stadiumsMap = useMemo(() => {
    const map: Record<string, Stadium> = {}
    if (stadiumsData?.stadiums) {
      stadiumsData.stadiums.forEach((stadium) => {
        map[stadium.id] = stadium
      })
    }
    return map
  }, [stadiumsData])

  const getStadiumName = (stadiumId: string) => {
    const stadium = stadiumsMap[stadiumId]
    if (!stadium) return ""
    if (stadium.translations) {
      try {
        const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
        if (parsed && parsed[lang]) return parsed[lang]
      } catch { }
    }
    return `${stadium.name_en}, ${stadium.city_en}`
  }

  // Filter games scheduled for today (based on local user's calendar date)
  const todayGames = useMemo(() => {
    if (!gamesData?.games) return []
    const now = new Date()
    return gamesData.games.filter((game) => {
      if (!game.local_date) return false
      try {
        const gameDate = parseStadiumLocalDate(game.local_date, game.stadium_id)
        return (
          gameDate.getFullYear() === now.getFullYear() &&
          gameDate.getMonth() === now.getMonth() &&
          gameDate.getDate() === now.getDate()
        )
      } catch {
        return false
      }
    })
  }, [gamesData])

  const isLoading = isTeamsLoading || isGamesLoading || isStadiumsLoading

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[70vh] relative z-10 font-sans text-slate-100">
      {/* Background decoration glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>



      {/* Today's Match Section */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Today's Matches Only</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-md border border-slate-900/60" suppressHydrationWarning>
            {new Date().toLocaleDateString(lang === "ar" ? "ar" : "en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-slate-900/30 border border-slate-800 rounded-2xl animate-pulse flex flex-col justify-between p-5">
                <div className="h-5 bg-slate-800 rounded w-1/3"></div>
                <div className="flex items-center justify-between my-4">
                  <div className="h-6 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-800 rounded w-16"></div>
                  <div className="h-6 bg-slate-800 rounded w-1/4"></div>
                </div>
                <div className="h-4 bg-slate-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : todayGames.length > 0 ? (
          /* Render Today's Games */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {todayGames.map((game) => (
              <MatchCard
                key={game.id}
                match={game}
                flagMap={flagMap}
                stadiumName={getStadiumName(game.stadium_id) || `#${game.stadium_id}`}
                teamNamesMap={teamNamesMap}
              />
            ))}
          </div>
        ) : (
          /* No Matches Today Placeholder */
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl p-8 text-center space-y-3 max-w-xl mx-auto shadow-xl">
            <span className="text-3xl block">📅</span>
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">No Matches Scheduled Today</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              There are no FIFA World Cup matches scheduled for today. Check out the full tournament schedule on the home dashboard page.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>View Full Schedule</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
