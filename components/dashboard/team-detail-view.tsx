"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Calendar, Users, ArrowLeft, MapPin } from "lucide-react"
import {
  useGetPlayersQuery,
  Player,
  Game,
  Team,
  getGameSlug,
} from "@/lib/services/apiSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedTeamId } from "@/lib/features/uiSlice"
import {
  LanguageCode,
  translate,
  parseStadiumLocalDate,
} from "@/lib/i18n"
import MatchCard from "@/components/dashboard/match-card"

interface TeamDetailViewProps {
  selectedTeam: Team
  allMatches: Game[]
  flagMap: Record<string, string>
  teamNamesMap: Record<string, Team>
  stadiumNameGetter: (stadiumId: string) => string
}

export default function TeamDetailView({
  selectedTeam,
  allMatches,
  flagMap,
  teamNamesMap,
  stadiumNameGetter,
}: TeamDetailViewProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const lang = useAppSelector((state) => state.ui.language)

  const [teamTab, setTeamTab] = useState<"matches" | "squad">("matches")

  // Fetch players for the selected team
  const { data: teamPlayersData, isLoading: isPlayersLoading } = useGetPlayersQuery(
    selectedTeam.id || "",
    { skip: !selectedTeam.id }
  )

  // Filter matches for this team
  const teamMatches = useMemo(() => {
    return allMatches.filter(
      (game) => game.home_team_id === selectedTeam.id || game.away_team_id === selectedTeam.id
    ).sort((a, b) => parseStadiumLocalDate(a.local_date, a.stadium_id).getTime() - parseStadiumLocalDate(b.local_date, b.stadium_id).getTime())
  }, [selectedTeam.id, allMatches])

  const selectedTeamUpcomingMatches = useMemo(() => {
    return teamMatches.filter((m) => m.finished.toUpperCase() === "FALSE")
  }, [teamMatches])

  const selectedTeamPlayedMatches = useMemo(() => {
    return teamMatches.filter((m) => m.finished.toUpperCase() === "TRUE")
  }, [teamMatches])

  // Group players by position (Goalkeepers, Defenders, Midfielders, Forwards)
  const groupedPlayers = useMemo(() => {
    const groups = {
      Goalkeeper: [] as Player[],
      Defender: [] as Player[],
      Midfielder: [] as Player[],
      Forward: [] as Player[],
    }

    if (teamPlayersData?.players) {
      teamPlayersData.players.forEach((player) => {
        const pos = (player.position || "Goalkeeper").toLowerCase()
        if (pos.includes("goalkeeper") || pos.includes("gk")) {
          groups.Goalkeeper.push(player)
        } else if (pos.includes("defender") || pos.includes("df") || pos.includes("back")) {
          groups.Defender.push(player)
        } else if (pos.includes("midfielder") || pos.includes("mf") || pos.includes("mid")) {
          groups.Midfielder.push(player)
        } else if (
          pos.includes("forward") ||
          pos.includes("fw") ||
          pos.includes("striker") ||
          pos.includes("attacker") ||
          pos.includes("winger")
        ) {
          groups.Forward.push(player)
        } else {
          groups.Midfielder.push(player)
        }
      })
    }

    // Sort players in each group by jersey number
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof groups].sort((a, b) => (a.jersey_num || 99) - (b.jersey_num || 99))
    })

    return groups
  }, [teamPlayersData])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Back row */}
      {/* <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch(setSelectedTeamId(null))}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer text-slate-300"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-500" />
          <span>{translate("back_dashboard", lang)}</span>
        </button>
      </div> */}

      {/* Team details card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900/60 to-slate-955/60 border border-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
          {selectedTeam.flag ? (
            <div className="relative w-28 h-20 overflow-hidden rounded-2xl border-2 border-slate-800 shadow-2xl shrink-0">
              <Image
                src={selectedTeam.flag}
                alt={selectedTeam.name_en}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-28 h-20 bg-slate-850 rounded-2xl shrink-0 flex items-center justify-center text-3xl shadow-inner">🏴</div>
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
              {selectedTeam.name_en}
            </h2>
            <p className="text-sm text-slate-400 mt-1 font-mono font-medium">
              FIFA Code: {selectedTeam.fifa_code} | {translate("group", lang)}: {selectedTeam.groups}
            </p>
          </div>
        </div>

        {/* Quick statistics row */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 z-10">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
            <p className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">{translate("played_matches", lang)}</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{selectedTeamPlayedMatches.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
            <p className="text-[10px] text-slate-505 font-bold uppercase tracking-wider">{translate("upcoming_matches", lang)}</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{selectedTeamUpcomingMatches.length}</p>
          </div>
        </div>
      </div>

      {/* Tab Switcher for Team Details */}
      <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-900 max-w-xs font-sans">
        <button
          onClick={() => setTeamTab("matches")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${teamTab === "matches"
              ? "bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-955 shadow-md font-extrabold"
              : "text-slate-400 hover:text-slate-205"
            }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Matches</span>
        </button>
        <button
          onClick={() => setTeamTab("squad")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${teamTab === "squad"
              ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-955 shadow-md font-extrabold"
              : "text-slate-400 hover:text-slate-205"
            }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Squad / Lineup</span>
        </button>
      </div>

      {teamTab === "matches" ? (
        /* Matches list for this team */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
          {/* Upcoming Matches */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 border-b border-slate-900 pb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              {translate("upcoming_matches", lang)}
            </h3>
            {selectedTeamUpcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {selectedTeamUpcomingMatches.map((match) => (
                  <MatchCard
                    key={match._id || match.id}
                    match={match}
                    flagMap={flagMap}
                    stadiumName={stadiumNameGetter(match.stadium_id)}
                    teamNamesMap={teamNamesMap}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/10 rounded-2xl border border-slate-900/40 text-slate-505 text-xs">
                {translate("no_upcoming_matches", lang)}
              </div>
            )}
          </div>

          {/* Played Matches */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-900 pb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {translate("played_matches", lang)}
            </h3>
            {selectedTeamPlayedMatches.length > 0 ? (
              <div className="space-y-4">
                {selectedTeamPlayedMatches.map((match) => (
                  <MatchCard
                    key={match._id || match.id}
                    match={match}
                    flagMap={flagMap}
                    stadiumName={stadiumNameGetter(match.stadium_id)}
                    teamNamesMap={teamNamesMap}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/10 rounded-2xl border border-slate-900/40 text-slate-505 text-xs">
                {translate("no_played_matches", lang)}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Squad list for this team */
        <div className="space-y-8 animate-fade-in font-sans">
          {isPlayersLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse font-mono">
                Loading squad...
              </span>
            </div>
          ) : !teamPlayersData?.players || teamPlayersData.players.length === 0 ? (
            <div className="py-20 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-550 text-xs">
              <span className="text-xl">🏃‍♂️</span>
              <span className="font-bold uppercase tracking-wider text-slate-400">
                No squad players registered yet.
              </span>
              <span className="text-slate-600 text-[10px]">Please synchronize this squad from the admin console.</span>
            </div>
          ) : (
            <div className="space-y-10">
              {(["Goalkeeper", "Defender", "Midfielder", "Forward"] as const).map((positionKey) => {
                const playersInGroup = groupedPlayers[positionKey]
                if (playersInGroup.length === 0) return null

                return (
                  <div key={positionKey} className="space-y-4 animate-fade-in">
                    {/* Position Group Header */}
                    <div className="flex items-center gap-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 font-mono">
                        {positionKey === "Goalkeeper"
                          ? translate("goalkeepers", lang) || "Goalkeepers"
                          : positionKey === "Defender"
                            ? translate("defenders", lang) || "Defenders"
                            : positionKey === "Midfielder"
                              ? translate("midfielders", lang) || "Midfielders"
                              : translate("forwards", lang) || "Forwards"}
                      </h4>
                      <div className="h-[1px] bg-slate-900 flex-1"></div>
                    </div>

                    {/* Players Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {playersInGroup.map((player) => (
                        <div
                          key={player.id}
                          className="relative p-4 rounded-2xl bg-linear-to-b from-slate-900/60 to-slate-955/60 border border-slate-900 hover:border-slate-800 transition-all duration-350 flex flex-col items-center text-center gap-3 group overflow-hidden shadow-xs hover:shadow-cyan-500/5 hover:-translate-y-0.5"
                        >
                          <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>

                          {/* Player Photo */}
                          <div className="relative w-16 h-16 rounded-full border border-slate-855 overflow-hidden shrink-0 flex items-center justify-center bg-slate-950 shadow-inner">
                            {player.picture_url ? (
                              <Image
                                src={player.picture_url}
                                alt={player.name}
                                width={64}
                                height={64}
                                unoptimized
                                className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <span className="text-xs font-black text-slate-700 font-mono">
                                {player.name.substring(0, 2).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Info block */}
                          <div className="space-y-1 w-full min-w-0 font-sans">
                            <div className="flex items-center justify-center gap-1.5 min-w-0">
                              {player.jersey_num !== null && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 font-mono text-[9px] font-black leading-none">
                                  {player.jersey_num}
                                </span>
                              )}
                              <span
                                className="font-extrabold text-slate-205 text-xs truncate block group-hover:text-cyan-400 transition-colors"
                                title={player.name}
                              >
                                {player.name}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold block">{player.position}</span>
                            {(player.height || player.weight) && (
                              <span className="text-[9px] font-mono text-slate-550 font-bold block mt-1">
                                {player.height ? `${player.height}cm` : "-"} / {player.weight ? `${player.weight}kg` : "-"}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
