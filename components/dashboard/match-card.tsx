"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"
import { Game, Team, getGameSlug } from "@/lib/services/apiSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedTeamId } from "@/lib/features/uiSlice"
import {
  LanguageCode,
  translate,
  parseStadiumLocalDate,
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

interface MatchCardProps {
  match: Game
  flagMap: Record<string, string>
  stadiumName: string
  teamNamesMap: Record<string, Team>
}

export default function MatchCard({ match, flagMap, stadiumName, teamNamesMap }: MatchCardProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const lang = useAppSelector((state) => state.ui.language)
  const isFinished = match.finished.toUpperCase() === "TRUE"
  const gameDate = parseStadiumLocalDate(match.local_date, match.stadium_id)
  const hasStarted = Date.now() >= gameDate.getTime()
  const isLive = !!(match.time_elapsed && match.time_elapsed !== "" && match.time_elapsed !== "null")
  const shouldShowScore = isFinished || isLive

  const homeFlag = flagMap[match.home_team_id] || (match.home_team_name_en ? flagMap[match.home_team_name_en.toLowerCase()] : undefined)
  const awayFlag = flagMap[match.away_team_id] || (match.away_team_name_en ? flagMap[match.away_team_name_en.toLowerCase()] : undefined)

  const getTeamName = (teamId: string) => {
    const team = teamNamesMap[teamId]
    if (!team) return "TBD"
    if (team.translations) {
      try {
        const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
        if (parsed && parsed[lang]) return parsed[lang]
      } catch { }
    }
    if (lang === "ar" && team.name_fa) return team.name_fa
    return team.name_en
  }

  const getTeamCode = (teamId: string) => {
    const team = teamNamesMap[teamId]
    if (!team) return "TBD"
    return team.fifa_code || team.id.toUpperCase().substring(0, 3)
  }

  const getTeamSlugName = (teamId: string) => {
    const team = teamNamesMap[teamId]
    if (!team) return teamId
    return team.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
  }

  return (
    <div
      onClick={() => router.push(`/match/${getGameSlug(match)}`)}
      className="bg-slate-900/30 border border-slate-600/60 hover:bg-slate-900/60 backdrop-blur-xs hover:border-slate-800 rounded-2xl p-2 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group shadow-xs hover:shadow-md cursor-pointer"
    >
      {/* Card Header info */}
      <div className="flex items-center justify-between text-slate-400 text-xs mb-4 pb-2 border-b border-slate-900/40">
        <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900 font-medium">
          {translate("group", lang)} {match.group} • {translate("matchday", lang)} {match.matchday}
        </span>

        {!isFinished && <Countdown dateStr={match.local_date} stadiumId={match.stadium_id} lang={lang} />}


      </div>

      {/* Teams and Scores row */}
      <div className="flex items-center justify-between my-2">
        {/* Home Team */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/team/${getTeamSlugName(match.home_team_id)}`)
          }}
          className="flex flex-1 items-center gap-3 min-w-0 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded-xl transition-all group/team"
        >
          {homeFlag ? (
            <div className="relative w-9 h-6 overflow-hidden rounded-md border border-slate-800 shrink-0 shadow-xs">
              <Image
                src={homeFlag}
                alt={getTeamName(match.home_team_id)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-9 h-6 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xs">🏴</div>
          )}
          <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover/team:text-cyan-400 transition-colors">
            <span className="sm:hidden">{getTeamCode(match.home_team_id)}</span>
            <span className="hidden sm:inline">{getTeamName(match.home_team_id)}</span>
          </span>
        </div>

        {/* Match Center: Score / Kickoff Time Button */}
        <div className="px-4 flex items-center justify-center shrink-0">
          {shouldShowScore ? (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-855 shadow-inner font-mono font-bold text-lg text-emerald-400">
                <span>{match.home_score}</span>
                <span className="text-slate-655 text-sm font-sans">:</span>
                <span>{match.away_score}</span>
              </div>
              {isLive && match.time_elapsed && (
                <span className="text-[8px] font-bold text-red-500 bg-red-550/10 px-2 py-0.5 rounded border border-red-500/25 uppercase tracking-widest font-mono animate-pulse">
                  {(() => {
                    if (match.time_elapsed.toLowerCase() === "live") {
                      return lang === "ar" ? "مباشر" : "LIVE"
                    }
                    return match.time_elapsed
                  })()}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/match/${getGameSlug(match)}`)
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-mono font-bold text-xs shadow-md shadow-cyan-500/10 hover:shadow-cyan-500/20 active:scale-95 hover:scale-[1.03] transition-all duration-300 cursor-pointer shrink-0"
            >
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-550"></span>
              </span>
              <span>
                {(() => {
                  const gameDate = parseStadiumLocalDate(match.local_date, match.stadium_id)
                  const localeStr = lang === "en-us" ? "en-US" : lang === "pt" ? "pt-BR" : lang === "es-la" ? "es-419" : lang
                  return gameDate.toLocaleTimeString(localeStr, { hour: "2-digit", minute: "2-digit" })
                })()}
              </span>
            </button>
          )}
        </div>

        {/* Away Team */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/team/${getTeamSlugName(match.away_team_id)}`)
          }}
          className="flex flex-1 items-center justify-end gap-3 min-w-0 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded-xl transition-all group/team"
        >
          <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover/team:text-cyan-400 transition-colors">
            <span className="sm:hidden">{getTeamCode(match.away_team_id)}</span>
            <span className="hidden sm:inline">{getTeamName(match.away_team_id)}</span>
          </span>
          {awayFlag ? (
            <div className="relative w-9 h-6 overflow-hidden rounded-md border border-slate-800 shrink-0 shadow-xs">
              <Image
                src={awayFlag}
                alt={getTeamName(match.away_team_id)}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-9 h-6 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xs">🏴</div>
          )}
        </div>
      </div>

      {/* Stadium & Scorers footer info */}
      <div className="mt-4 pt-3 border-t flex justify-between items-center border-slate-900/40  gap-2 text-slate-400 text-xs">
        {/* Stadium details */}
        <div className="flex items-center justify-between text-[11px] text-slate-505 w-full">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-600" />
            <span>{stadiumName}</span>
          </div>
        </div>
        <span
          className={`px-2 py-0.5 rounded font-semibold text-[10px] tracking-wide uppercase ${isFinished
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : isLive
            ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse"
            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            }`}
        >
          {isFinished
            ? translate("finished", lang)
            : isLive
            ? (lang === "ar" ? "مباشر" : "LIVE")
            : translate("upcoming", lang)}
        </span>


        {/* Scorers */}
        {shouldShowScore &&
          ((match.home_scorers && match.home_scorers !== "null") ||
            (match.away_scorers && match.away_scorers !== "null")) && (
            <div className="bg-slate-955/50 p-2.5 rounded-xl border border-slate-950/80 flex flex-col gap-1 text-[10px]">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                ⚽ {translate("goal_scorers", lang)}
              </span>
              <div className="flex justify-between gap-4">
                <div className="text-slate-400 font-medium truncate flex-1 font-sans">
                  {match.home_scorers && match.home_scorers !== "null" ? match.home_scorers : ""}
                </div>
                <div className="text-slate-400 font-medium truncate flex-1 text-right font-sans">
                  {match.away_scorers && match.away_scorers !== "null" ? match.away_scorers : ""}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
