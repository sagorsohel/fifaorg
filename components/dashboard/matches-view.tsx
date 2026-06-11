"use client"

import { Game, Team, Stadium } from "@/lib/services/apiSlice"
import { useAppSelector } from "@/lib/store"
import MatchCard from "./match-card"
import AdCard from "./ad-card"

interface MatchesViewProps {
  gamesGroupedByDate: Array<{ date: string; matches: Game[] }>
  flagMap: Record<string, string>
  teamNamesMap: Record<string, Team>
  stadiumsMap: Record<string, Stadium>
  adsConfig: { header_ads?: string; hero_ads?: string; modal_ads?: string } | null
}

export default function MatchesView({
  gamesGroupedByDate,
  flagMap,
  teamNamesMap,
  stadiumsMap,
  adsConfig,
}: MatchesViewProps) {
  const lang = useAppSelector((state) => state.ui.language)

  const getStadiumName = (stadiumId: string) => {
    const stadium = stadiumsMap[stadiumId]
    if (!stadium) return ""
    if (stadium.translations) {
      try {
        const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
        if (parsed && parsed[lang]) return parsed[lang]
      } catch { }
    }
    if (lang === "ar" && stadium.name_fa && stadium.city_fa) {
      return `${stadium.name_fa}, ${stadium.city_fa}`
    }
    return `${stadium.name_en}, ${stadium.city_en}`
  }

  return (
    <div className="space-y-10">
      {gamesGroupedByDate.map(({ date, matches }) => {
        const isOdd = matches.length % 2 !== 0

        return (
          <div key={date} className="space-y-4">
            {/* Date Heading */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-800/80"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-900">
                {date}
              </span>
              <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-800/80"></div>
            </div>

            {/* Matches Box */}
            <div className="p-6 rounded-3xl bg-slate-950/20 border border-slate-900/60 shadow-xl">
              {/* Games Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matches.map((match) => (
                  <MatchCard
                    key={match._id}
                    match={match}
                    flagMap={flagMap}
                    stadiumName={getStadiumName(match.stadium_id) || `#${match.stadium_id}`}
                    teamNamesMap={teamNamesMap}
                  />
                ))}

                {/* Ads Card (only shown if matches count is odd) */}
                {isOdd && <AdCard scriptHtml={adsConfig?.header_ads} />}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
