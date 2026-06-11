"use client"

import { useMemo, useState, useEffect, use } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  getGameSlug,
  Team,
  Stadium,
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
  Film,
  Infinity,
  Ban,
  Smartphone,
} from "lucide-react"

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
import { useIsMobile } from "@/hooks/use-mobile"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import {
  LanguageCode,
  LANGUAGES,
  translate,
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

const getTeamName = (team: Team | null | undefined, fallback: string, activeLang: LanguageCode) => {
  if (!team) return fallback
  if (team.translations) {
    try {
      const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
      if (parsed && parsed[activeLang]) return parsed[activeLang]
    } catch { }
  }
  if (activeLang === "ar" && team.name_fa) return team.name_fa
  return team.name_en
}

const getTeamSlug = (team: Team | null | undefined) => {
  if (!team) return ""
  return team.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function AdScriptContainer({ scriptHtml, className }: { scriptHtml?: string; className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!scriptHtml || !mounted) return null

  // Attempt to parse width and height from the ad configuration (e.g. from atOptions)
  const widthMatch = scriptHtml.match(/'width'\s*:\s*(\d+)/) || scriptHtml.match(/"width"\s*:\s*(\d+)/)
  const heightMatch = scriptHtml.match(/'height'\s*:\s*(\d+)/) || scriptHtml.match(/"height"\s*:\s*(\d+)/)

  const width = widthMatch ? parseInt(widthMatch[1], 10) : 320
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 50

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${scriptHtml}
      </body>
    </html>
  `

  return (
    <div className={`${className} flex justify-center items-center overflow-hidden`}>
      <iframe
        srcDoc={iframeSrcDoc}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden", background: "transparent" }}
        scrolling="no"
        title="Ad Space"
      />
    </div>
  )
}

export default function MatchCenterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug
  const dispatch = useAppDispatch()
  const isMobile = useIsMobile()
  // Local state for streamer actions
  const [isBuffering, setIsBuffering] = useState(false)
  const [showInlineSignup, setShowInlineSignup] = useState(false)

  const lang = useAppSelector((state) => state.ui.language)

  const [adsConfig, setAdsConfig] = useState<{
    header_ads?: string
    hero_ads?: string
    modal_ads?: string
  } | null>(null)

  useEffect(() => {
    fetch("/api/manage/ads")
      .then(res => res.json())
      .then(data => {
        if (data && data.ads) {
          setAdsConfig(data.ads)
        }
      })
      .catch(() => { })
  }, [])

  // API Queries via RTK Query
  const { data: teamsData, isLoading: isTeamsLoading } = useGetTeamsQuery()
  const { data: gamesData, isLoading: isGamesLoading } = useGetGamesQuery()
  const { data: stadiumsData, isLoading: isStadiumsLoading } = useGetStadiumsQuery()

  const selectedGame = useMemo(() => {
    if (!slug || !gamesData?.games) return null
    return gamesData.games.find((g) => g._id === slug || g.id === slug || g.slug === slug || getGameSlug(g) === slug)
  }, [slug, gamesData])


  const selectedGameHomeTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.home_team_id || t._id === selectedGame.home_team_id)
  }, [selectedGame, teamsData])

  const selectedGameAwayTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.away_team_id || t._id === selectedGame.away_team_id)
  }, [selectedGame, teamsData])

  useEffect(() => {
    if (selectedGame) {
      const homeName = getTeamName(selectedGameHomeTeam, selectedGame.home_team_name_en || selectedGame.home_team_label || "TBD", lang)
      const awayName = getTeamName(selectedGameAwayTeam, selectedGame.away_team_name_en || selectedGame.away_team_label || "TBD", lang)
      document.title = `${homeName} vs ${awayName} | ${translate("match_center", lang)}`
    }
  }, [selectedGame, selectedGameHomeTeam, selectedGameAwayTeam, lang])

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
    if (lang === "ar" && stadium.name_fa && stadium.city_fa) {
      return `${stadium.name_fa}, ${stadium.city_fa}`
    }
    return `${stadium.name_en}, ${stadium.city_en}`
  }

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
    if (!isMobile) {
      setShowInlineSignup(true)
      return
    }
    if (isBuffering || showInlineSignup) return
    setIsBuffering(true)
    setTimeout(() => {
      setIsBuffering(false)
      setShowInlineSignup(true)
    }, 1500)
  }

  const handleActionRedirect = () => {
    const targetUrl = (selectedGame && selectedGame.referral_link)
      ? selectedGame.referral_link
      : "https://lightsalmon-hummingbird-478538.hostingersite.com/register"

    if (isMobile) {
      window.location.href = targetUrl
    } else {
      window.open(targetUrl, "_blank")
    }
  }

  // Loading state fallback
  if (isTeamsLoading || isGamesLoading || isStadiumsLoading) {
    return (
      <>
        {/* Background Glows */}
        <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>



        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 animate-pulse relative z-10">
          {/* Hero Ads Placeholder */}
          <div className="max-w-4xl mx-auto w-full h-[90px] rounded-2xl bg-slate-900/60 border border-slate-900 flex items-center justify-center">
            <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">ADVERTISEMENT SKELETON</div>
          </div>

          {/* Match Scoreboard Header Card Skeleton */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-900 shadow-xl flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between border-b border-slate-900/40 pb-2.5">
              <div className="h-5 bg-slate-800 rounded-full w-32"></div>
              <div className="h-5 bg-slate-800 rounded-full w-24"></div>
            </div>
            <div className="flex items-center justify-between gap-4 py-1">
              <div className="flex flex-1 items-center gap-3 justify-start">
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0"></div>
                <div className="h-5 bg-slate-800 rounded w-24"></div>
              </div>
              <div className="h-8 bg-slate-800 rounded-xl w-16"></div>
              <div className="flex flex-1 items-center justify-end gap-3">
                <div className="h-5 bg-slate-800 rounded w-24"></div>
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0"></div>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-slate-900/40 pt-2.5">
              <div className="h-4 bg-slate-800 rounded w-48"></div>
              <div className="h-4 bg-slate-800 rounded w-16"></div>
            </div>
          </div>

          {/* Stream Player Container Skeleton */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="w-full aspect-video rounded-3xl border border-slate-900 bg-slate-900/40 flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-slate-800 bg-slate-850/50 flex items-center justify-center">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700 fill-slate-700 translate-x-0.5" />
              </div>
            </div>
          </div>

          {/* Details Tabs & Stats Skeleton */}
          <div className="max-w-4xl mx-auto w-full bg-slate-900/20 border border-slate-900/60 p-5 rounded-2xl min-h-[200px] flex flex-col gap-4">
            <div className="flex gap-2 border-b border-slate-900 pb-3">
              <div className="h-8 bg-slate-800 rounded-lg w-20"></div>
              <div className="h-8 bg-slate-800 rounded-lg w-20"></div>
              <div className="h-8 bg-slate-800 rounded-lg w-20"></div>
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-slate-800 rounded w-full"></div>
              <div className="h-4 bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-800 rounded w-4/5"></div>
            </div>
          </div>

          {/* Back Button Skeleton */}
          <div className="flex justify-center pt-4 max-w-4xl mx-auto w-full">
            <div className="w-40 h-10 bg-slate-900/60 border border-slate-900 rounded-xl"></div>
          </div>
        </main>
      </>
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
  const homeName = getTeamName(selectedGameHomeTeam, selectedGame.home_team_name_en || selectedGame.home_team_label || "TBD", lang)
  const awayName = getTeamName(selectedGameAwayTeam, selectedGame.away_team_name_en || selectedGame.away_team_label || "TBD", lang)

  return (
    <>
      {/* Page Background Image */}
      {selectedGame.bg_image && (
        <div className="fixed inset-0 z-0 select-none pointer-events-none">
          <Image
            src={selectedGame.bg_image}
            alt=""
            fill
            className="object-cover "
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/90 via-slate-950/80 to-slate-950/95"></div>
        </div>
      )}

      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 animate-fade-in relative z-10">

        {/* Match Scoreboard Header Card (Sleek and compact) */}
        <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900 to-slate-900 border border-slate-900 shadow-xl flex flex-col gap-4 relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top info and badge row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/40 pb-2.5">
            <span className="bg-slate-955 px-2.5 py-1 rounded-full border border-slate-900 font-semibold text-[10px] text-slate-400">
              {translate("group", lang)} {selectedGame.group} • {translate("matchday", lang)} {selectedGame.matchday}
            </span>

            {!isFinished && <Countdown dateStr={selectedGame.local_date} stadiumId={selectedGame.stadium_id} lang={lang} />}

          </div>

          {/* Scoreboard Row */}
          <div className="flex items-center justify-between gap-4 py-1">
            {/* Home Team */}
            <Link
              href={`/team/${selectedGameHomeTeam ? getTeamSlug(selectedGameHomeTeam) : selectedGame.home_team_id}`}
              className="flex flex-1 items-center gap-3 min-w-0 justify-start cursor-pointer hover:text-cyan-400 group/team transition-all duration-200"
            >
              {selectedGameHomeFlag ? (
                <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0 group-hover/team:border-cyan-500/50 transition-colors">
                  <Image src={selectedGameHomeFlag} alt={homeName} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xl">🏴</div>
              )}
              <span className="font-extrabold text-slate-100 text-xs sm:text-base truncate group-hover/team:text-cyan-400 transition-colors">
                {homeName}
              </span>
            </Link>

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
            <Link
              href={`/team/${selectedGameAwayTeam ? getTeamSlug(selectedGameAwayTeam) : selectedGame.away_team_id}`}
              className="flex flex-1 items-center justify-end gap-3 min-w-0 cursor-pointer hover:text-cyan-400 group/team transition-all duration-200"
            >
              <span className="font-extrabold text-slate-100 text-xs sm:text-base truncate group-hover/team:text-cyan-400 transition-colors">
                {awayName}
              </span>
              {selectedGameAwayFlag ? (
                <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0 group-hover/team:border-cyan-500/50 transition-colors">
                  <Image src={selectedGameAwayFlag} alt={awayName} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xl">🏴</div>
              )}
            </Link>
          </div>

          {/* Stadium Name */}
          <div className="flex justify-between items-center">
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 border-t border-slate-900/40 pt-2.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-medium">
                {getStadiumName(selectedGame.stadium_id) || `#${selectedGame.stadium_id}`}
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase ${isFinished
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                }`}
            >
              {isFinished ? translate("finished", lang) : translate("upcoming", lang)}
            </span>
          </div>
        </div>

        {/* Stream Player Container (Centered) */}
        <div className="max-w-4xl mx-auto w-full">
          {(!showInlineSignup || isMobile) ? (
            <div
              onClick={handlePlayClick}
              className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-cyan-500/30 bg-slate-955 relative group cursor-pointer shadow-[0_0_35px_rgba(6,182,212,0.15)] hover:border-cyan-455 hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] transition-all duration-500 transform hover:scale-[1.005]"
            >

              {/* Split Screen Image or Custom Background */}
              <div className="absolute inset-0 flex select-none">
                {selectedGame.modal_image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={selectedGame.modal_image}
                      alt=""
                      fill
                      className="object-cover opacity-85 scale-100 group-hover:scale-[1.03] transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                ) : (
                  <>
                    <div className="w-1/2 h-full relative overflow-hidden">
                      {selectedGameHomeFlag ? (
                        <Image
                          src={selectedGameHomeFlag}
                          alt=""
                          fill
                          className="object-cover blur-xs opacity-75 scale-110"
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
                          className="object-cover blur-xs opacity-75 scale-110"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-l from-slate-955 via-slate-955/20 to-transparent"></div>
                    </div>
                  </>
                )}
              </div>

              {/* Dark mask overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>

              {/* Center Overlays */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {!isBuffering ? (
                  /* Highlighted Play button with pulse radar ring */
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-cyan-500/25 animate-ping duration-1000 scale-125"></div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-cyan-400 bg-cyan-500/25 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-cyan-500/40 group-hover:shadow-[0_0_45px_rgba(6,182,212,0.75)] z-10 relative">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 text-cyan-400 fill-cyan-400 translate-x-0.5" />
                    </div>
                  </div>
                ) : (
                  /* rotating loading spinner text (shown during buffering delay) */
                  <div className="bg-slate-955/95 border border-slate-900/80 px-5 py-3 rounded-full flex items-center gap-3 z-10 shadow-xl animate-pulse">
                    <div className="w-4 h-4 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
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
          ) : (
            <div className="w-full min-h-[420px] md:aspect-video rounded-3xl overflow-hidden border border-cyan-500/25 bg-[#050b14]/90 backdrop-blur-md relative shadow-[0_0_60px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col justify-between p-6 animate-fade-in z-10">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <div className="flex items-center gap-2 text-cyan-500">
                  <Tv className="w-5 h-5 text-cyan-500" />
                  <span className="font-bold text-sm tracking-wider uppercase text-slate-100">
                    {translate("title", lang)}
                  </span>
                </div>
                <button
                  onClick={() => setShowInlineSignup(false)}
                  className="p-1 rounded-md text-slate-505 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>


              {/* Body */}
              <div className="flex-1 flex flex-col justify-center items-center gap-4 my-2">
                <h3 className="text-center font-bold text-sm sm:text-base text-slate-100 leading-snug px-2">
                  {translate("signup_title", lang)}
                </h3>

                {/* Main action button */}
                <button
                  onClick={handleActionRedirect}
                  className="w-full max-w-sm py-3 bg-cyan-700 hover:bg-cyan-600 active:scale-[0.98] transition-all rounded-xl text-slate-955 font-extrabold tracking-wider text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 cursor-pointer uppercase"
                >
                  {translate("signup_btn", lang)}
                </button>

                {/* Modal Ads show under signup button */}
                {adsConfig?.modal_ads && (
                  <AdScriptContainer scriptHtml={adsConfig.modal_ads} className="w-full max-w-sm flex justify-center my-2 shrink-0" />
                )}

                {/* Adblocker warning section */}


                {/* Features list */}
                <div className="w-full max-w-sm grid grid-cols-2 gap-2 text-[8px] sm:text-[9px]">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Film className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_1", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Infinity className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_2", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Ban className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_3", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_4", lang)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-2 border-t border-slate-900/60 shrink-0">
                <p className="text-slate-400 text-[10px] font-semibold">
                  {translate("already_account", lang)}{" "}
                  <span className="text-cyan-500 hover:text-cyan-400 cursor-pointer font-bold transition-colors">
                    {translate("login", lang)}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Smart Details (Below Video Player) */}
        <div className="max-w-4xl mx-auto w-full space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
            <span>📊</span>
            {translate("match_statistics", lang)}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Match Schedule */}
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-4">
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
                <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{translate("stadium_stats", lang)}</span>
                  {stadium ? (
                    <div className="bg-slate-955/50 p-3.5 rounded-xl border border-slate-900/60 text-xs space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-500 font-bold">🏟️</span>
                        <span className="font-bold text-slate-200 text-[11px] truncate">
                          {(() => {
                            if (stadium.translations) {
                              try {
                                const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
                                if (parsed && parsed[lang]) {
                                  return parsed[lang].split(",")[0].trim()
                                }
                              } catch { }
                            }
                            if (lang === "ar" && stadium.name_fa) return stadium.name_fa
                            return stadium.name_en
                          })()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-900/40 pt-2">
                        <div>
                          <span className="text-slate-500 block">{translate("capacity", lang)}</span>
                          <span className="font-bold text-slate-300 mt-0.5 block">
                            {stadium.capacity ? stadium.capacity.toLocaleString() : "TBD"} {translate("seats", lang)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">{translate("location", lang)}</span>
                          <span className="font-bold text-slate-300 mt-0.5 block truncate">
                            {(() => {
                              if (stadium.translations) {
                                try {
                                  const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
                                  if (parsed && parsed[lang]) {
                                    const parts = parsed[lang].split(",")
                                    if (parts.length > 1) {
                                      return parts.slice(1).join(",").trim()
                                    }
                                  }
                                } catch { }
                              }
                              if (lang === "ar" && stadium.city_fa && stadium.country_fa) {
                                return `${stadium.city_fa}, ${stadium.country_fa}`
                              }
                              return `${stadium.city_en}, ${stadium.country_en}`
                            })()}
                          </span>
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
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-3">
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
        {/* <div className="flex justify-center pt-4 max-w-4xl mx-auto w-full">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg cursor-pointer text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-500" />
            <span>{translate("back_timeline", lang)}</span>
          </Link>
        </div> */}

        {isMobile && (
          <Dialog open={showInlineSignup} onOpenChange={setShowInlineSignup}>
            <DialogContent className="bg-slate-950/95 backdrop-blur-md border border-cyan-500/25 text-slate-100 max-w-sm rounded-3xl p-5 shadow-[0_0_50px_rgba(6,182,212,0.15)] outline-hidden" showCloseButton={false}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <div className="flex items-center gap-2 text-cyan-500">
                  <Tv className="w-5 h-5 text-cyan-500" />
                  <span className="font-bold text-sm tracking-wider uppercase text-slate-100">
                    {translate("title", lang)}
                  </span>
                </div>
                <button
                  onClick={() => setShowInlineSignup(false)}
                  className="p-1 rounded-md text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex flex-col justify-center items-center gap-4 my-2">
                <h3 className="text-center font-bold text-sm sm:text-base text-slate-100 leading-snug px-2">
                  {translate("signup_title", lang)}
                </h3>

                {/* Main action button */}
                <button
                  onClick={handleActionRedirect}
                  className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 active:scale-[0.98] transition-all rounded-xl text-slate-955 font-extrabold tracking-wider text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 cursor-pointer uppercase"
                >
                  {translate("signup_btn", lang)}
                </button>

                {/* Modal Ads show under signup button */}
                {adsConfig?.modal_ads && (
                  <AdScriptContainer scriptHtml={adsConfig.modal_ads} className="w-full flex justify-center my-2 shrink-0" />
                )}

                {/* Features list */}
                <div className="w-full grid grid-cols-2 gap-2 text-[8px] sm:text-[9px] mt-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Film className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_1", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Infinity className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_2", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Ban className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_3", lang)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/25 border border-slate-900/60 rounded-lg">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span className="font-semibold text-slate-300 truncate">{translate("feature_4", lang)}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </>
  )
}
