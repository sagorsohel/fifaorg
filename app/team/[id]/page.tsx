"use client"

import { useMemo, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetPlayersQuery,
  getGameSlug,
  Player
} from "@/lib/services/apiSlice"
import {
  Trophy,
  Calendar,
  Users,
  ArrowLeft,
} from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"

import {
  LANGUAGES,
  translate,
  parseStadiumLocalDate,
} from "@/lib/i18n"

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const teamId = resolvedParams.id
  const dispatch = useAppDispatch()
  const router = useRouter()
  const lang = useAppSelector((state) => state.ui.language)

  // API Queries via RTK Query
  const { data: teamsData, isLoading: isTeamsLoading } = useGetTeamsQuery()
  const { data: gamesData, isLoading: isGamesLoading } = useGetGamesQuery()
  const { data: squadData, isLoading: isSquadLoading } = useGetPlayersQuery(teamId)

  const [activeTab, setActiveTab] = useState<"matches" | "squad">("matches")

  // Find the selected team
  const team = useMemo(() => {
    if (!teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === teamId || t._id === teamId)
  }, [teamId, teamsData])

  // Flag lookup map
  const flagMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((t) => {
        map[t.id] = t.flag
        map[t.name_en.toLowerCase()] = t.flag
      })
    }
    return map
  }, [teamsData])

  // Filter team matches
  const teamMatches = useMemo(() => {
    if (!gamesData?.games) return []
    return gamesData.games.filter(
      (game) => game.home_team_id === teamId || game.away_team_id === teamId
    )
  }, [teamId, gamesData])

  const playedMatches = useMemo(() => {
    return teamMatches.filter((m) => m.finished.toUpperCase() === "TRUE")
  }, [teamMatches])

  const upcomingMatches = useMemo(() => {
    return teamMatches.filter((m) => m.finished.toUpperCase() === "FALSE")
  }, [teamMatches])

  // Group squad players by position
  const playersByPosition = useMemo(() => {
    const groups = {
      Goalkeeper: [] as Player[],
      Defender: [] as Player[],
      Midfielder: [] as Player[],
      Forward: [] as Player[],
    }

    if (squadData?.players) {
      squadData.players.forEach((player) => {
        const pos = player.position || "Forward"
        if (pos.toLowerCase().includes("goalkeeper") || pos.toLowerCase() === "gk") {
          groups.Goalkeeper.push(player)
        } else if (pos.toLowerCase().includes("defender") || pos.toLowerCase() === "df") {
          groups.Defender.push(player)
        } else if (pos.toLowerCase().includes("midfielder") || pos.toLowerCase() === "mf") {
          groups.Midfielder.push(player)
        } else {
          groups.Forward.push(player)
        }
      })
    }

    // Sort players by jersey number
    Object.keys(groups).forEach((key) => {
      groups[key as keyof typeof groups].sort((a, b) => (a.jersey_num || 99) - (b.jersey_num || 99))
    })

    return groups
  }, [squadData])

  // Loading state fallback
  if (isTeamsLoading || isGamesLoading || isSquadLoading) {
    return (
      <>
        {/* Background Glows */}
        <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

        {/* Header Banner */}
        <header className="sticky top-0 z-40 bg-slate-900 backdrop-blur-md border-b border-slate-900 mb-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15">
                <Trophy className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  {translate("title", lang)}
                </h1>
                <p className="text-xs text-slate-400">{translate("match_center", lang)}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse relative z-10">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-6">
              <div className="w-28 h-20 bg-slate-800 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-8 bg-slate-800 rounded w-48"></div>
                <div className="h-4 bg-slate-800 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto w-full bg-slate-900/20 border border-slate-900/60 p-5 rounded-2xl min-h-[300px]"></div>
        </main>
      </>
    )
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-955 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">{translate("not_found", lang)}</h2>
        <Link href="/" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-xs font-semibold">
          {translate("back_dashboard", lang)}
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Header Banner */}
      <header className="sticky top-0 z-40 bg-slate-900 backdrop-blur-md border-b border-slate-900 mb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15 cursor-pointer">
              <Trophy className="w-6 h-6 text-slate-950" />
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {translate("title", lang)}
              </h1>
              <p className="text-xs text-slate-400">{translate("match_center", lang)}</p>
            </div>
          </div>

          {/* Language selector */}
          <div className="hidden sm:flex items-center gap-2 z-50">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 px-3.5 py-2.5 rounded-xl hover:border-cyan-500/30 focus:outline-hidden transition-all cursor-pointer shadow-xs flex items-center gap-1.5 capitalize">
                <span>{LANGUAGES.find((l) => l.code === lang)?.name || "Language"}</span>
                <span className="text-[10px] text-slate-555">▼</span>
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
                    className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${lang === l.code ? "bg-cyan-500/10 text-cyan-400" : "text-slate-355"
                      }`}
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6 pb-28 sm:pb-8 relative z-10 animate-fade-in">
        {/* Back row */}
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500" />
            <span>{translate("back_dashboard", lang)}</span>
          </Link>
        </div>

        {/* Team details card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900/60 to-slate-955/60 border border-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden max-w-4xl mx-auto w-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10">
            {team.flag ? (
              <div className="relative w-28 h-20 overflow-hidden rounded-2xl border-2 border-slate-800 shadow-2xl shrink-0">
                <Image
                  src={team.flag}
                  alt={team.name_en}
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
                {lang === "ar" && team.name_fa ? team.name_fa : team.name_en}
              </h2>
              <p className="text-sm text-slate-400 mt-1 font-mono font-medium">
                FIFA Code: {team.fifa_code} | {translate("group", lang)}: {team.groups}
              </p>
            </div>
          </div>

          {/* Quick statistics row */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 z-10">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
              <p className="text-[10px] text-slate-555 font-bold uppercase tracking-wider">{translate("played_matches", lang)}</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{playedMatches.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
              <p className="text-[10px] text-slate-555 font-bold uppercase tracking-wider">{translate("upcoming_matches", lang)}</p>
              <p className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{upcomingMatches.length}</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher for Team Details */}
        <div className="flex bg-slate-900/40 p-1 rounded-xl border border-slate-900 max-w-xs font-sans mx-auto">
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${activeTab === "matches"
              ? "bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md font-extrabold"
              : "text-slate-400 hover:text-slate-205"
              }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Matches</span>
          </button>
          <button
            onClick={() => setActiveTab("squad")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${activeTab === "squad"
              ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-955 shadow-md font-extrabold"
              : "text-slate-400 hover:text-slate-205"
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squad</span>
          </button>
        </div>

        {/* Dynamic content tab */}
        <div className="max-w-4xl mx-auto w-full">
          {activeTab === "matches" ? (
            <div className="space-y-6">
              {/* Upcoming Matches */}
              <div>
                <h3 className="text-xs font-extrabold tracking-widest text-cyan-500 uppercase mb-3 border-l-2 border-cyan-500 pl-2">
                  {translate("upcoming_matches", lang)}
                </h3>
                {upcomingMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingMatches.map((match) => {
                      const homeFlag = flagMap[match.home_team_id]
                      const awayFlag = flagMap[match.away_team_id]
                      return (
                        <div
                          key={match._id}
                          onClick={() => router.push(`/match/${getGameSlug(match)}`)}
                          className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all flex flex-col justify-between gap-4 group shadow-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-900/30">
                            <span>{translate("group", lang)} {match.group} • {translate("matchday", lang)} {match.matchday}</span>
                            <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/10 font-mono text-[10px]">
                              {(() => {
                                const date = parseStadiumLocalDate(match.local_date, match.stadium_id)
                                return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                              })()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between my-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {homeFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-800 shrink-0">
                                  <Image src={homeFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : (
                                <div className="w-8 h-5.5 bg-slate-800 rounded shrink-0 flex items-center justify-center text-[10px]">🏴</div>
                              )}
                              <span className="font-bold text-slate-205 text-xs truncate group-hover:text-cyan-400 transition-colors">
                                {lang === "ar" && match.home_team_name_fa ? match.home_team_name_fa : match.home_team_name_en}
                              </span>
                            </div>
                            <span className="text-slate-500 text-[10px] px-2 font-black shrink-0 font-mono">VS</span>
                            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                              <span className="font-bold text-slate-205 text-xs truncate group-hover:text-cyan-400 transition-colors">
                                {lang === "ar" && match.away_team_name_fa ? match.away_team_name_fa : match.away_team_name_en}
                              </span>
                              {awayFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-800 shrink-0">
                                  <Image src={awayFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : (
                                <div className="w-8 h-5.5 bg-slate-800 rounded shrink-0 flex items-center justify-center text-[10px]">🏴</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-900/10 border border-slate-900 rounded-2xl text-center">No upcoming matches</p>
                )}
              </div>

              {/* Played Matches */}
              <div>
                <h3 className="text-xs font-extrabold tracking-widest text-emerald-500 uppercase mb-3 border-l-2 border-emerald-500 pl-2">
                  {translate("played_matches", lang)}
                </h3>
                {playedMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {playedMatches.map((match) => {
                      const homeFlag = flagMap[match.home_team_id]
                      const awayFlag = flagMap[match.away_team_id]
                      return (
                        <div
                          key={match._id}
                          onClick={() => router.push(`/match/${getGameSlug(match)}`)}
                          className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/50 transition-all flex flex-col justify-between gap-4 group shadow-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-900/30">
                            <span>{translate("group", lang)} {match.group} • {translate("matchday", lang)} {match.matchday}</span>
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 font-mono text-xs">{match.home_score} : {match.away_score}</span>
                          </div>
                          <div className="flex items-center justify-between my-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {homeFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-800 shrink-0">
                                  <Image src={homeFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : (
                                <div className="w-8 h-5.5 bg-slate-800 rounded shrink-0 flex items-center justify-center text-[10px]">🏴</div>
                              )}
                              <span className="font-bold text-slate-205 text-xs truncate group-hover:text-cyan-400 transition-colors">
                                {lang === "ar" && match.home_team_name_fa ? match.home_team_name_fa : match.home_team_name_en}
                              </span>
                            </div>
                            <span className="text-slate-500 text-[10px] px-2 font-black shrink-0 font-mono">VS</span>
                            <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                              <span className="font-bold text-slate-205 text-xs truncate group-hover:text-cyan-400 transition-colors">
                                {lang === "ar" && match.away_team_name_fa ? match.away_team_name_fa : match.away_team_name_en}
                              </span>
                              {awayFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-800 shrink-0">
                                  <Image src={awayFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : (
                                <div className="w-8 h-5.5 bg-slate-800 rounded shrink-0 flex items-center justify-center text-[10px]">🏴</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-900/10 border border-slate-900 rounded-2xl text-center">No played matches</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {Object.entries(playersByPosition).map(([pos, list]) => (
                <div key={pos}>
                  <h3 className="text-xs font-extrabold tracking-widest text-slate-405 uppercase mb-3 border-l-2 border-slate-600 pl-2">
                    {pos}s ({list.length})
                  </h3>
                  {list.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {list.map((player) => (
                        <div
                          key={player.id}
                          className="relative p-4 rounded-2xl bg-linear-to-b from-slate-900/60 to-slate-950/60 border border-slate-900 hover:border-slate-800 transition-all duration-350 flex flex-col items-center text-center gap-3 group overflow-hidden shadow-xs hover:shadow-cyan-500/5 hover:-translate-y-0.5"
                        >
                          <div className="absolute -top-10 -left-10 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors"></div>
                          <div className="relative w-16 h-16 rounded-full border border-slate-850 overflow-hidden shrink-0 flex items-center justify-center bg-slate-955 shadow-inner">
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
                              <span className="text-xs font-black text-slate-700 font-mono">{player.name.substring(0, 2).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="space-y-1 w-full min-w-0">
                            <div className="flex items-center justify-center gap-1.5 min-w-0">
                              {player.jersey_num !== null && (
                                <span className="px-1.5 py-0.5 rounded-xs bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 font-mono text-[9px] font-black leading-none">
                                  {player.jersey_num}
                                </span>
                              )}
                              <span className="font-extrabold text-slate-205 text-xs truncate block group-hover:text-cyan-400 transition-colors" title={player.name}>
                                {player.name}
                              </span>
                            </div>
                            {player.fifa_id && (
                              <span className="text-[8px] text-slate-600 font-mono block select-all">ID: {player.fifa_id}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-555 italic p-4 bg-slate-900/10 border border-slate-900 rounded-2xl text-center">No {pos}s registered</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
