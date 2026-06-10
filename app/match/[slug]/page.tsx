"use client"

import { useMemo, useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  getGameSlug,
} from "@/lib/services/apiSlice"
import {
  Trophy,
  Calendar,
  MapPin,
  ArrowLeft,
  Play,
  Volume2,
  Settings,
  Maximize2,
  Tv,
  X,
  ShieldAlert,
  Film,
  Infinity,
  Ban,
  Smartphone,
} from "lucide-react"

import {
  LanguageCode,
  LANGUAGES,
  translate,
  detectBrowserLanguage,
  parseStadiumLocalDate,
  formatLocalTime,
  formatCountdownTime,
} from "@/lib/i18n"

// Countdown Component for upcoming matches
function Countdown({ dateStr, stadiumId, lang }: { dateStr: string; stadiumId: string; lang: LanguageCode }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const targetDate = parseStadiumLocalDate(dateStr, stadiumId)

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now()
      if (difference <= 0) {
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      })
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [dateStr, stadiumId])

  if (!timeLeft) {
    return (
      <span className="text-[9px] font-bold text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono tracking-wider animate-pulse">
        {formatCountdownTime(null, lang)}
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-cyan-500/90 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10 shadow-xs">
      <span>{formatCountdownTime(timeLeft, lang)}</span>
    </div>
  )
}

export default function MatchCenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const router = useRouter()

  // Local state for streamer actions
  const [isBuffering, setIsBuffering] = useState(false)
  const [showStreamModal, setShowStreamModal] = useState(false)

  const [lang, setLang] = useState<LanguageCode>("en")

  useEffect(() => {
    setLang(detectBrowserLanguage())
  }, [])

  // API Queries via RTK Query
  const { data: teamsData, isLoading: isTeamsLoading } = useGetTeamsQuery()
  const { data: gamesData, isLoading: isGamesLoading } = useGetGamesQuery()
  const { data: stadiumsData, isLoading: isStadiumsLoading } = useGetStadiumsQuery()

  const selectedGame = useMemo(() => {
    if (!slug || !gamesData?.games) return null
    return gamesData.games.find((g) => g._id === slug || g.id === slug || g.slug === slug || getGameSlug(g) === slug)
  }, [slug, gamesData])

  useEffect(() => {
    if (selectedGame) {
      document.title = selectedGame.slug || getGameSlug(selectedGame)
    }
  }, [selectedGame])

  const selectedGameHomeTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.home_team_id || t._id === selectedGame.home_team_id)
  }, [selectedGame, teamsData])

  const selectedGameAwayTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.away_team_id || t._id === selectedGame.away_team_id)
  }, [selectedGame, teamsData])

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

  const stadiumsMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (stadiumsData?.stadiums) {
      stadiumsData.stadiums.forEach((stadium) => {
        map[stadium.id] = `${stadium.name_en}, ${stadium.city_en}`
      })
    }
    return map
  }, [stadiumsData])

  const selectedGameHomeFlag = useMemo(() => {
    if (!selectedGame) return undefined
    return selectedGameHomeTeam?.flag || flagMap[selectedGame.home_team_id] || (selectedGame.home_team_name_en ? flagMap[selectedGame.home_team_name_en.toLowerCase()] : undefined)
  }, [selectedGame, selectedGameHomeTeam, flagMap])

  const selectedGameAwayFlag = useMemo(() => {
    if (!selectedGame) return undefined
    return selectedGameAwayTeam?.flag || flagMap[selectedGame.away_team_id] || (selectedGame.away_team_name_en ? flagMap[selectedGame.away_team_name_en.toLowerCase()] : undefined)
  }, [selectedGame, selectedGameAwayTeam, flagMap])

  // Play button click simulation
  const handlePlayClick = () => {
    if (isBuffering || showStreamModal) return
    setIsBuffering(true)
    setTimeout(() => {
      setIsBuffering(false)
      setShowStreamModal(true)
    }, 1500)
  }

  // Loading state fallback
  if (isTeamsLoading || isGamesLoading || isStadiumsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-955 text-white p-6">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-emerald-500 border-l-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-slate-900 flex items-center justify-center">
            <span className="text-3xl">⚽</span>
          </div>
        </div>
        <p className="text-lg font-medium text-slate-300 animate-pulse">{translate("loading", lang)}</p>
      </div>
    )
  }

  if (!selectedGame) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-955 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">{translate("not_found", lang)}</h2>
        <Link href="/" className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 transition-all text-xs font-semibold">
          {translate("return_dashboard", lang)}
        </Link>
      </div>
    )
  }

  const isFinished = selectedGame.finished.toUpperCase() === "TRUE"
  const homeName = selectedGameHomeTeam
    ? (lang === "ar" && selectedGameHomeTeam.name_fa ? selectedGameHomeTeam.name_fa : selectedGameHomeTeam.name_en)
    : (selectedGame.home_team_name_en || selectedGame.home_team_label || "TBD")

  const awayName = selectedGameAwayTeam
    ? (lang === "ar" && selectedGameAwayTeam.name_fa ? selectedGameAwayTeam.name_fa : selectedGameAwayTeam.name_en)
    : (selectedGame.away_team_name_en || selectedGame.away_team_label || "TBD")

  return (
    <div dir={LANGUAGES.find(l => l.code === lang)?.dir || "ltr"} className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 transition-all duration-300">
      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Banner */}
      <header className="sticky top-0 z-40 bg-slate-955/80 backdrop-blur-md border-b border-slate-900 mb-8">
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

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguageCode)}
              className="bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 px-3 py-2 rounded-xl focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all cursor-pointer shadow-xs"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        {/* Match Scoreboard Header Card (Sleek and compact) */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900/60 to-slate-955/60 border border-slate-900 shadow-xl flex flex-col gap-4 relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Top info and badge row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/40 pb-2.5">
            <span className="bg-slate-955 px-2.5 py-1 rounded-full border border-slate-900 font-semibold text-[10px] text-slate-400">
              {translate("group", lang)} {selectedGame.group} • {translate("matchday", lang)} {selectedGame.matchday}
            </span>

            {!isFinished && <Countdown dateStr={selectedGame.local_date} stadiumId={selectedGame.stadium_id} lang={lang} />}

            <span
              className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase ${isFinished
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                }`}
            >
              {isFinished ? translate("finished", lang) : translate("upcoming", lang)}
            </span>
          </div>

          {/* Scoreboard Row */}
          <div className="flex items-center justify-between gap-4 py-1">
            {/* Home Team */}
            <div className="flex flex-1 items-center gap-3 min-w-0 justify-start">
              {selectedGameHomeFlag ? (
                <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0">
                  <Image src={selectedGameHomeFlag} alt={homeName} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xl">🏴</div>
              )}
              <span className="font-extrabold text-slate-100 text-xs sm:text-base truncate">
                {homeName}
              </span>
            </div>

            {/* score/time */}
            <div className="px-3 flex flex-col items-center shrink-0">
              {isFinished ? (
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-1 rounded-xl border border-slate-900 shadow-inner font-mono font-bold text-base sm:text-lg text-emerald-400">
                  <span>{selectedGame.home_score}</span>
                  <span className="text-slate-655 text-xs font-sans">:</span>
                  <span>{selectedGame.away_score}</span>
                </div>
              ) : (
                <div className="text-center bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-900 min-w-[70px]">
                  <p className="font-mono text-xs font-bold text-cyan-500">
                    {(() => {
                      const gameDate = parseStadiumLocalDate(selectedGame.local_date, selectedGame.stadium_id)
                      const localeStr = lang === "en-us" ? "en-US" : lang === "pt" ? "pt-BR" : lang === "es-la" ? "es-419" : lang
                      return gameDate.toLocaleTimeString(localeStr, { hour: "2-digit", minute: "2-digit" })
                    })()}
                  </p>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
              <span className="font-extrabold text-slate-100 text-xs sm:text-base truncate">
                {awayName}
              </span>
              {selectedGameAwayFlag ? (
                <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0">
                  <Image src={selectedGameAwayFlag} alt={awayName} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xl">🏴</div>
              )}
            </div>
          </div>

          {/* Stadium Name */}
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 border-t border-slate-900/40 pt-2.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-medium">
              {translate("stadium", lang)}: {stadiumsMap[selectedGame.stadium_id] || `#${selectedGame.stadium_id}`}
            </span>
          </div>
        </div>

        {/* Stream Player Container (Centered) */}
        <div className="max-w-4xl mx-auto w-full">
          <div 
            onClick={handlePlayClick}
            className="w-full aspect-video rounded-3xl overflow-hidden border border-slate-900 bg-slate-955 relative group cursor-pointer shadow-2xl hover:border-amber-500/20 transition-all duration-300"
          >
            {/* Split Screen Image */}
            <div className="absolute inset-0 flex select-none">
              <div className="w-1/2 h-full relative overflow-hidden">
                {selectedGameHomeFlag ? (
                  <Image
                    src={selectedGameHomeFlag}
                    alt=""
                    fill
                    className="object-cover blur-md opacity-35 scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-linear-to-r from-slate-955 via-slate-955/20 to-transparent"></div>
              </div>
              <div className="w-1/2 h-full relative overflow-hidden">
                {selectedGameAwayFlag ? (
                  <Image
                    src={selectedGameAwayFlag}
                    alt=""
                    fill
                    className="object-cover blur-md opacity-35 scale-110"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
                <div className="absolute inset-0 bg-linear-to-l from-slate-955 via-slate-955/20 to-transparent"></div>
              </div>
            </div>

            {/* Dark mask overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>

            {/* Center Overlays */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {!isBuffering ? (
                /* Golden Play button (shown initially) */
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-amber-500 bg-amber-500/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/25 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] z-10">
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-amber-500 fill-amber-500 translate-x-0.5" />
                </div>
              ) : (
                /* rotating loading spinner text (shown during buffering delay) */
                <div className="bg-slate-955/95 border border-slate-900/80 px-5 py-3 rounded-full flex items-center gap-3 z-10 shadow-xl animate-pulse">
                  <div className="w-4 h-4 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent animate-spin"></div>
                  <span className="text-[10px] sm:text-xs font-black font-mono tracking-widest text-slate-100 uppercase">
                    {translate("loading", lang).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* bottom strip */}
            <div className="absolute bottom-0 inset-x-0 bg-slate-955/90 backdrop-blur-xs border-t border-slate-900/60 px-5 py-3 flex items-center justify-between text-slate-400 text-xs z-10">
              <div className="flex items-center gap-4">
                <Play className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                <Volume2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-4">
                <span className="border border-red-500/35 text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded font-black tracking-widest text-[9px] uppercase font-mono">
                  {lang === "ar" ? "مباشر" : "LIVE"}
                </span>
                <Settings className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Details (Below Video Player) */}
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <span>📊</span>
            {translate("match_statistics", lang)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Match Schedule */}
            <div className="bg-slate-905/30 border border-slate-905 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{translate("match_schedule", lang)}</span>
              <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-900/60 text-xs">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">{formatLocalTime(parseStadiumLocalDate(selectedGame.local_date, selectedGame.stadium_id), lang)}</span>
                  <span className="text-[10px] text-slate-455">{translate("local_kickoff", lang)}</span>
                </div>
              </div>

              {/* Goal Scorers inside schedule card */}
              {isFinished &&
                ((selectedGame.home_scorers && selectedGame.home_scorers !== "null") ||
                  (selectedGame.away_scorers && selectedGame.away_scorers !== "null")) && (
                  <div className="bg-slate-955/60 p-3.5 rounded-xl border border-slate-900/60 text-[10px] space-y-2">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block">⚽ {translate("goal_scorers", lang)}</span>
                    <div className="flex justify-between gap-4 text-slate-300">
                      <div className="truncate flex-1 flex flex-col gap-0.5">
                        <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">{selectedGame.home_team_name_en || (lang === "ar" ? "المضيف" : "HOME")}</span>
                        {selectedGame.home_scorers && selectedGame.home_scorers !== "null" ? selectedGame.home_scorers : "-"}
                      </div>
                      <div className="truncate flex-1 text-right flex flex-col gap-0.5">
                        <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">{selectedGame.away_team_name_en || (lang === "ar" ? "الضيف" : "AWAY")}</span>
                        {selectedGame.away_scorers && selectedGame.away_scorers !== "null" ? selectedGame.away_scorers : "-"}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Column 2: Stadium Stats */}
            {(() => {
              const stadium = stadiumsData?.stadiums?.find(
                (s) => s.id === selectedGame.stadium_id || s._id === selectedGame.stadium_id
              );
              return (
                <div className="bg-slate-905/30 border border-slate-905 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{translate("stadium_stats", lang)}</span>
                  {stadium ? (
                    <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/60 text-xs space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-500 font-bold">🏟️</span>
                        <span className="font-bold text-slate-200 text-[11px] truncate">{stadium.name_en}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-900/40 pt-2">
                        <div>
                          <span className="text-slate-500 block">{translate("capacity", lang)}</span>
                          <span className="font-bold text-slate-300 mt-0.5 block">{stadium.capacity.toLocaleString()} {translate("seats", lang)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">{translate("location", lang)}</span>
                          <span className="font-bold text-slate-300 mt-0.5 block truncate">{stadium.city_en}, {stadium.country_en}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/60 text-xs text-slate-505">
                      {lang === "ar" ? "تفاصيل الملعب غير متوفرة." : "Stadium details unavailable."}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Column 3: Interactive Statistics */}
            <div className="bg-slate-905/30 border border-slate-905 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{translate("match_statistics", lang)}</span>
              
              <div className="space-y-3 bg-slate-955/50 p-3.5 rounded-xl border border-slate-900/60 text-xs">
                {/* Stat 1: Possession */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{isFinished ? "53%" : "50%"}</span>
                    <span className="text-slate-505 uppercase text-[8px] tracking-wider">{translate("possession", lang)}</span>
                    <span>{isFinished ? "47%" : "50%"}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-500" style={{ width: isFinished ? "53%" : "50%" }}></div>
                    <div className="h-full bg-emerald-500" style={{ width: isFinished ? "47%" : "50%" }}></div>
                  </div>
                </div>

                {/* Stat 2: Shots */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{isFinished ? "14" : "0"}</span>
                    <span className="text-slate-505 uppercase text-[8px] tracking-wider">{translate("shots", lang)}</span>
                    <span>{isFinished ? "8" : "0"}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-500" style={{ width: isFinished ? "63%" : "50%" }}></div>
                    <div className="h-full bg-emerald-500" style={{ width: isFinished ? "37%" : "50%" }}></div>
                  </div>
                </div>

                {/* Stat 3: Fouls */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400">
                    <span>{isFinished ? "9" : "0"}</span>
                    <span className="text-slate-555 uppercase text-[8px] tracking-wider">{translate("fouls", lang)}</span>
                    <span>{isFinished ? "11" : "0"}</span>
                  </div>
                  <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="h-full bg-cyan-500" style={{ width: isFinished ? "45%" : "50%" }}></div>
                    <div className="h-full bg-emerald-500" style={{ width: isFinished ? "55%" : "50%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button (At the very bottom) */}
        <div className="flex justify-center pt-4 max-w-4xl mx-auto w-full">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg cursor-pointer text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500" />
            <span>{translate("back_timeline", lang)}</span>
          </Link>
        </div>
      </main>

      {/* SIGN-UP STREAM MODAL */}
      {showStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop (Darker and highly blurred for focus) */}
          <div 
            onClick={() => setShowStreamModal(false)}
            className="absolute inset-0 bg-slate-955/95 backdrop-blur-xl transition-opacity duration-300"
          ></div>
          
          {/* Modal Content (Focused with golden border glow) */}
          <div className="bg-[#050b14] border border-amber-500/25 rounded-3xl w-full max-w-md overflow-hidden relative shadow-[0_0_60px_rgba(245,158,11,0.18)] z-10 animate-fade-in">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-900/60">
              <div className="flex items-center gap-2 text-amber-500">
                <Tv className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-sm tracking-wider uppercase text-slate-100">
                  {translate("live_stream", lang)}
                </span>
              </div>
              <button 
                onClick={() => setShowStreamModal(false)}
                className="p-1 rounded-md text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center gap-6">
              {/* Subtitle */}
              <h3 className="text-center font-bold text-lg text-slate-100 leading-snug px-2">
                {translate("signup_title", lang)}
              </h3>
              
              {/* Main action button */}
              <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition-all rounded-xl text-slate-955 font-extrabold tracking-wider text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 cursor-pointer uppercase">
                {translate("signup_btn", lang)}
              </button>
              
              {/* Adblocker warning section */}
              <div className="w-full bg-[#081324] border border-slate-900/65 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-bold text-sm">{translate("adblocker_title", lang)}</span>
                    <span className="text-slate-450 text-[10px]">{translate("adblocker_text", lang)}</span>
                  </div>
                </div>
                <button className="px-3 py-2 bg-amber-500 text-slate-955 font-extrabold text-[10px] rounded-lg tracking-wider hover:bg-amber-600 transition-colors uppercase shrink-0">
                  {translate("unlock_hd", lang)}
                </button>
              </div>
              
              {/* Features grid */}
              <div className="w-full grid grid-cols-2 gap-3">
                {/* Feature 1 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Film className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">{translate("feature_1", lang)}</span>
                </div>
                {/* Feature 2 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Infinity className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">{translate("feature_2", lang)}</span>
                </div>
                {/* Feature 3 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Ban className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">{translate("feature_3", lang)}</span>
                </div>
                {/* Feature 4 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Smartphone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">{translate("feature_4", lang)}</span>
                </div>
              </div>
              
              {/* Footer account login */}
              <p className="text-slate-400 text-xs font-semibold mt-2">
                {translate("already_account", lang)}{" "}
                <span className="text-amber-500 hover:text-amber-400 cursor-pointer font-bold transition-colors">
                  {translate("login", lang)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
