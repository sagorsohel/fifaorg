"use client"

import { Game, Team, Stadium } from "@/lib/services/apiSlice"
import { useAppSelector } from "@/lib/store"
import MatchCard from "./match-card"
import AdCard from "./ad-card"
import { getLocalizedStadiumName } from "@/lib/i18n"

interface MatchesViewProps {
  gamesGroupedByDate: Array<{ date: string; matches: Game[] }>
  flagMap: Record<string, string>
  teamNamesMap: Record<string, Team>
  stadiumsMap: Record<string, Stadium>
  adsConfig: { header_ads?: string; hero_ads?: string; hero2_ads?: string; modal_ads?: string } | null
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
    return getLocalizedStadiumName(stadium, lang)
  }

  return (
    <div className="space-y-10">
      {gamesGroupedByDate.map(({ date, matches }) => {
        const isOdd = matches.length % 2 !== 0

        return (
          <div key={date} id={date} className="space-y-4">
            {/* Date Heading */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-800/80"></div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-900" suppressHydrationWarning>
                {date}
              </span>
              <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-800/80"></div>
            </div>

            {/* Matches Box */}
            <div className="sm:p-6 p-2 rounded-3xl bg-slate-950/20 border border-slate-900/60 shadow-xl">
              {/* Games Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {(() => {
                  const firstUpcomingMatch = matches.find(
                    (m) => m.finished.toUpperCase() !== "TRUE" && m.time_elapsed?.toLowerCase() !== "finished"
                  )
                  return matches.map((match) => {
                    const isFirstUpcoming = firstUpcomingMatch && firstUpcomingMatch.id === match.id
                    return (
                      <div key={match._id} id={isFirstUpcoming ? `upcoming-${date}` : undefined}>
                        <MatchCard
                          match={match}
                          flagMap={flagMap}
                          stadiumName={getStadiumName(match.stadium_id) || `#${match.stadium_id}`}
                          teamNamesMap={teamNamesMap}
                        />
                      </div>
                    )
                  })
                })()}

                {/* Ads Card (only shown if matches count is odd) */}
                {isOdd && <AdCard scriptHtml={adsConfig?.hero_ads} scriptHtml2={adsConfig?.hero2_ads} />}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
