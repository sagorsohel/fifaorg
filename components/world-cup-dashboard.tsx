"use client"

import { useMemo, useState, useEffect } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  Game,
  Team,
} from "@/lib/services/apiSlice"
import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store"
import {
  setSearchQuery,
  setFilterStatus,
  setActiveTab,
  setSelectedGroup,
  setSelectedTeamId,
  setSelectedGameId,
  resetFilters,
} from "@/lib/features/uiSlice"
import {
  Search,
  Trophy,
  Calendar,
  Users,
  RefreshCw,
  Clock,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  XCircle,
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

// Date parsing helper to format game times
function parseLocalDate(localDateStr: string): Date {
  try {
    const [datePart, timePart] = localDateStr.split(" ")
    const [month, day, year] = datePart.split("/")
    const [hours, minutes] = timePart.split(":")
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes))
  } catch (e) {
    return new Date(localDateStr)
  }
}

// Countdown Component for upcoming matches
function Countdown({ dateStr }: { dateStr: string }) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const targetDate = parseLocalDate(dateStr)

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
  }, [dateStr])

  if (!timeLeft) {
    return (
      <span className="text-[9px] font-bold text-emerald-450 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono tracking-wider">
        LIVE / STARTED
      </span>
    )
  }

  return (
    <div className="flex items-center gap-1 font-mono text-[9px] font-bold text-cyan-500/90 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/10 shadow-xs">
      <span>{timeLeft.days}d</span>
      <span className="text-slate-700">:</span>
      <span>{timeLeft.hours}h</span>
      <span className="text-slate-700">:</span>
      <span>{timeLeft.minutes}m</span>
      <span className="text-slate-700">:</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  )
}

export default function WorldCupDashboard() {
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()

  // Selectors from Redux UI State
  const searchQuery = useAppSelector((state) => state.ui.searchQuery)
  const filterStatus = useAppSelector((state) => state.ui.filterStatus)
  const activeTab = useAppSelector((state) => state.ui.activeTab)
  const selectedGroup = useAppSelector((state) => state.ui.selectedGroup)
  const selectedTeamId = useAppSelector((state) => state.ui.selectedTeamId)
  const selectedGameId = useAppSelector((state) => state.ui.selectedGameId)

  // Local state for streaming modal
  const [showStreamModal, setShowStreamModal] = useState(false)

  // API Queries via RTK Query
  const {
    data: teamsData,
    isLoading: isTeamsLoading,
    isError: isTeamsError,
    refetch: refetchTeams,
  } = useGetTeamsQuery()

  const {
    data: gamesData,
    isLoading: isGamesLoading,
    isError: isGamesError,
    refetch: refetchGames,
  } = useGetGamesQuery()

  const {
    data: stadiumsData,
    isLoading: isStadiumsLoading,
    isError: isStadiumsError,
    refetch: refetchStadiums,
  } = useGetStadiumsQuery()

  // Combine refetches
  const handleRefetch = () => {
    refetchTeams()
    refetchGames()
    refetchStadiums()
  }

  // Create a fast lookup map for team flags from teams data
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

  // Create a fast lookup map for stadiums
  const stadiumsMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (stadiumsData?.stadiums) {
      stadiumsData.stadiums.forEach((stadium) => {
        map[stadium.id] = `${stadium.name_en}, ${stadium.city_en}`
      })
    }
    return map
  }, [stadiumsData])

  // Selected team lookup & match filtering
  const selectedTeam = useMemo(() => {
    if (!selectedTeamId || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedTeamId || t._id === selectedTeamId)
  }, [selectedTeamId, teamsData])

  const selectedTeamMatches = useMemo(() => {
    if (!selectedTeamId || !gamesData?.games) return []
    return gamesData.games.filter(
      (game) => game.home_team_id === selectedTeamId || game.away_team_id === selectedTeamId
    ).sort((a, b) => parseLocalDate(a.local_date).getTime() - parseLocalDate(b.local_date).getTime())
  }, [selectedTeamId, gamesData])

  const selectedTeamUpcomingMatches = useMemo(() => {
    return selectedTeamMatches.filter((m) => m.finished.toUpperCase() === "FALSE")
  }, [selectedTeamMatches])

  const selectedTeamPlayedMatches = useMemo(() => {
    return selectedTeamMatches.filter((m) => m.finished.toUpperCase() === "TRUE")
  }, [selectedTeamMatches])

  // Selected game lookup
  const selectedGame = useMemo(() => {
    if (!selectedGameId || !gamesData?.games) return null
    return gamesData.games.find((g) => g._id === selectedGameId || g.id === selectedGameId)
  }, [selectedGameId, gamesData])

  const selectedGameHomeTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.home_team_id || t._id === selectedGame.home_team_id)
  }, [selectedGame, teamsData])

  const selectedGameAwayTeam = useMemo(() => {
    if (!selectedGame || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedGame.away_team_id || t._id === selectedGame.away_team_id)
  }, [selectedGame, teamsData])

  const selectedGameHomeFlag = useMemo(() => {
    if (!selectedGame) return undefined
    return selectedGameHomeTeam?.flag || flagMap[selectedGame.home_team_id] || (selectedGame.home_team_name_en ? flagMap[selectedGame.home_team_name_en.toLowerCase()] : undefined)
  }, [selectedGame, selectedGameHomeTeam, flagMap])

  const selectedGameAwayFlag = useMemo(() => {
    if (!selectedGame) return undefined
    return selectedGameAwayTeam?.flag || flagMap[selectedGame.away_team_id] || (selectedGame.away_team_name_en ? flagMap[selectedGame.away_team_name_en.toLowerCase()] : undefined)
  }, [selectedGame, selectedGameAwayTeam, flagMap])

  // Process and group matches for the dashboard matches timeline
  const processedGames = useMemo(() => {
    if (!gamesData?.games) return []

    let filtered = [...gamesData.games]

    // Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((game) => {
        return (
          (game.home_team_name_en && game.home_team_name_en.toLowerCase().includes(query)) ||
          (game.away_team_name_en && game.away_team_name_en.toLowerCase().includes(query)) ||
          (game.home_team_label && game.home_team_label.toLowerCase().includes(query)) ||
          (game.away_team_label && game.away_team_label.toLowerCase().includes(query)) ||
          `group ${game.group}`.toLowerCase().includes(query) ||
          `matchday ${game.matchday}`.toLowerCase().includes(query)
        )
      })
    }

    // Apply Status Filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((game) => {
        const isFinished = game.finished.toUpperCase() === "TRUE"
        return filterStatus === "finished" ? isFinished : !isFinished
      })
    }

    // Apply Group Filter
    if (selectedGroup !== "all") {
      filtered = filtered.filter(
        (game) => game.group.toUpperCase() === selectedGroup.toUpperCase()
      )
    }

    // Sort chronologically
    return filtered.sort((a, b) => {
      return parseLocalDate(a.local_date).getTime() - parseLocalDate(b.local_date).getTime()
    })
  }, [gamesData, searchQuery, filterStatus, selectedGroup])

  // Group games by date for display
  const gamesGroupedByDate = useMemo(() => {
    const groups: Record<string, Game[]> = {}

    processedGames.forEach((game) => {
      const parsed = parseLocalDate(game.local_date)
      const dateKey = parsed.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(game)
    })

    return Object.entries(groups).map(([date, matches]) => ({
      date,
      matches,
    }))
  }, [processedGames])

  // Group teams by their respective groups A to L
  const teamsGroupedByGroup = useMemo(() => {
    if (!teamsData?.teams) return {}

    const groups: Record<string, Team[]> = {}
    teamsData.teams.forEach((team) => {
      const groupName = team.groups || "Unassigned"
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(team)
    })

    // Sort teams within each group alphabetically
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => a.name_en.localeCompare(b.name_en))
    })

    return groups
  }, [teamsData])

  // Statistics calculation
  const stats = useMemo(() => {
    if (!gamesData?.games) return { total: 0, played: 0, remaining: 0 }
    const total = gamesData.games.length
    const played = gamesData.games.filter((g) => g.finished.toUpperCase() === "TRUE").length
    const remaining = total - played
    return { total, played, remaining }
  }, [gamesData])

  // Handle Loading State
  if (isTeamsLoading || isGamesLoading || isStadiumsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-black text-white p-6">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-emerald-500 border-l-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-slate-900 flex items-center justify-center">
            <span className="text-3xl">⚽</span>
          </div>
        </div>
        <p className="text-lg font-medium text-slate-300 animate-pulse">Loading World Cup details...</p>
      </div>
    )
  }

  // Handle Error State
  if (isTeamsError || isGamesError || isStadiumsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
        <div className="p-8 max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-red-500/30 text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-red-400">Failed to load tournament data</h2>
          <p className="text-slate-400 mb-6 text-sm">Please check your connection and try again.</p>
          <button
            onClick={handleRefetch}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-xl font-medium cursor-pointer shadow-lg shadow-red-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  const allGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans transition-all duration-300">
      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                FIFA World Cup 2026
              </h1>
              <p className="text-xs text-slate-400">Teams & Matches Tracker</p>
            </div>
          </div>

          {/* Action Filters / Theme */}
          <div className="flex items-center gap-3">
            {/* Dark Mode toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Dark Mode"
            >
              <span className="text-sm">🌓</span>
            </button>

            {/* Refresh indicator */}
            <button
              onClick={handleRefetch}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refetch API Data"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {selectedGame ? <div className="space-y-8 animate-fade-in">
            {/* Match Scoreboard Header Card (Sleek and compact) */}
            {(() => {
              const match = selectedGame;
              const isFinished = match.finished.toUpperCase() === "TRUE";
              const homeFlag = selectedGameHomeFlag;
              const awayFlag = selectedGameAwayFlag;
              const homeName = match.home_team_name_en || match.home_team_label || "TBD";
              const awayName = match.away_team_name_en || match.away_team_label || "TBD";
              
              return (
                <div className="p-4 rounded-2xl bg-linear-to-r from-slate-900/60 to-slate-950/60 border border-slate-900 shadow-xl flex flex-col gap-4 relative overflow-hidden max-w-4xl mx-auto">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {/* Top info and badge row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900/40 pb-2.5">
                    <span className="bg-slate-950 px-2.5 py-1 rounded-full border border-slate-900 font-semibold text-[10px] text-slate-400">
                      Group {match.group} • Matchday {match.matchday}
                    </span>

                    {!isFinished && <Countdown dateStr={match.local_date} />}

                    <span
                      className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] tracking-wide uppercase ${isFinished
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}
                    >
                      {isFinished ? "Finished" : "Upcoming"}
                    </span>
                  </div>

                  {/* Scoreboard Row */}
                  <div className="flex items-center justify-between gap-4 py-1">
                    {/* Home Team */}
                    <div 
                      onClick={() => {
                        if (match.home_team_id) {
                          dispatch(setSelectedTeamId(match.home_team_id));
                          dispatch(setSelectedGameId(null));
                        }
                      }}
                      className="flex flex-1 items-center gap-3 cursor-pointer hover:bg-slate-900/40 p-1.5 rounded-xl transition-all min-w-0 justify-start"
                    >
                      {homeFlag ? (
                        <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0">
                          <Image src={homeFlag} alt={homeName} fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="w-12 h-8 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xl">🏴</div>
                      )}
                      <span className="font-extrabold text-slate-100 text-xs sm:text-base hover:text-cyan-400 transition-colors truncate">
                        {homeName}
                      </span>
                    </div>

                    {/* score/time */}
                    <div className="px-3 flex flex-col items-center shrink-0">
                      {isFinished ? (
                        <div className="flex items-center gap-3 bg-slate-950 px-4 py-1 rounded-xl border border-slate-900 shadow-inner font-mono font-bold text-base sm:text-lg text-emerald-400">
                          <span>{match.home_score}</span>
                          <span className="text-slate-650 text-xs font-sans">:</span>
                          <span>{match.away_score}</span>
                        </div>
                      ) : (
                        <div className="text-center bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-900 min-w-[70px]">
                          <p className="font-mono text-xs font-bold text-cyan-500">
                            {match.local_date.split(" ")[1] || match.local_date}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div 
                      onClick={() => {
                        if (match.away_team_id) {
                          dispatch(setSelectedTeamId(match.away_team_id));
                          dispatch(setSelectedGameId(null));
                        }
                      }}
                      className="flex flex-1 items-center justify-end gap-3 cursor-pointer hover:bg-slate-900/40 p-1.5 rounded-xl transition-all min-w-0"
                    >
                      <span className="font-extrabold text-slate-100 text-xs sm:text-base hover:text-cyan-400 transition-colors truncate">
                        {awayName}
                      </span>
                      {awayFlag ? (
                        <div className="relative w-12 h-8 overflow-hidden rounded-md border border-slate-800 shadow-sm shrink-0">
                          <Image src={awayFlag} alt={awayName} fill className="object-cover" unoptimized />
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
                      Stadium: {stadiumsMap[match.stadium_id] || `#${match.stadium_id}`}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Stream Player Container (Centered) */}
            <div className="max-w-4xl mx-auto w-full space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Match Stream
              </h3>

              <div 
                onClick={() => setShowStreamModal(true)}
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

                {/* Center Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Golden Play button */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-amber-500 bg-amber-500/15 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/25 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] z-10">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 text-amber-500 fill-amber-500 translate-x-0.5" />
                  </div>

                  {/* loading spinner text */}
                  <div className="mt-4 bg-slate-955/95 border border-slate-900/80 px-4 py-2 rounded-full flex items-center gap-2.5 z-10 shadow-xl">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent animate-spin"></div>
                    <span className="text-[10px] sm:text-xs font-black font-mono tracking-widest text-slate-100 uppercase">
                      LOADING STREAM...
                    </span>
                  </div>
                </div>

                {/* bottom strip */}
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-xs border-t border-slate-900/60 px-5 py-3 flex items-center justify-between text-slate-400 text-xs z-10">
                  <div className="flex items-center gap-4">
                    <Play className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                    <Volume2 className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="border border-red-500/35 text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded font-black tracking-widest text-[9px] uppercase font-mono">
                      LIVE
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
                Smart Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Match Schedule */}
                <div className="bg-slate-905/30 border border-slate-905 rounded-2xl p-5 space-y-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Match Schedule</span>
                  <div className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-slate-900/60 text-xs">
                    <Calendar className="w-4 h-4 text-cyan-500" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{selectedGame.local_date}</span>
                      <span className="text-[10px] text-slate-455">Local Kickoff Time</span>
                    </div>
                  </div>

                  {/* Goal Scorers inside schedule card */}
                  {selectedGame.finished.toUpperCase() === "TRUE" &&
                    ((selectedGame.home_scorers && selectedGame.home_scorers !== "null") ||
                      (selectedGame.away_scorers && selectedGame.away_scorers !== "null")) && (
                      <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-900/60 text-[10px] space-y-2">
                        <span className="font-bold text-slate-500 uppercase tracking-wider block">⚽ Goal Scorers</span>
                        <div className="flex justify-between gap-4 text-slate-300">
                          <div className="truncate flex-1 flex flex-col gap-0.5">
                            <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">{selectedGame.home_team_name_en || "HOME"}</span>
                            {selectedGame.home_scorers && selectedGame.home_scorers !== "null" ? selectedGame.home_scorers : "-"}
                          </div>
                          <div className="truncate flex-1 text-right flex flex-col gap-0.5">
                            <span className="text-[7px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">{selectedGame.away_team_name_en || "AWAY"}</span>
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
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stadium Stats</span>
                      {stadium ? (
                        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/60 text-xs space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-500 font-bold">🏟️</span>
                            <span className="font-bold text-slate-200 text-[11px] truncate">{stadium.name_en}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-900/40 pt-2">
                            <div>
                              <span className="text-slate-500 block">Capacity</span>
                              <span className="font-bold text-slate-300 mt-0.5 block">{stadium.capacity.toLocaleString()} seats</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Location</span>
                              <span className="font-bold text-slate-300 mt-0.5 block truncate">{stadium.city_en}, {stadium.country_en}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/60 text-xs text-slate-500">
                          Stadium details unavailable.
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Column 3: Interactive Statistics */}
                <div className="bg-slate-905/30 border border-slate-905 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Match Statistics</span>
                  
                  <div className="space-y-3 bg-slate-950/50 p-3.5 rounded-xl border border-slate-900/60 text-xs">
                    {/* Stat 1: Possession */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "53%" : "50%"}</span>
                        <span className="text-slate-500 uppercase text-[8px] tracking-wider">Possession</span>
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "47%" : "50%"}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                        <div className="h-full bg-cyan-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "53%" : "50%" }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "47%" : "50%" }}></div>
                      </div>
                    </div>

                    {/* Stat 2: Shots */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "14" : "0"}</span>
                        <span className="text-slate-505 uppercase text-[8px] tracking-wider">Shots</span>
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "8" : "0"}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                        <div className="h-full bg-cyan-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "63%" : "50%" }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "37%" : "50%" }}></div>
                      </div>
                    </div>

                    {/* Stat 3: Fouls */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "9" : "0"}</span>
                        <span className="text-slate-505 uppercase text-[8px] tracking-wider">Fouls</span>
                        <span>{selectedGame.finished.toUpperCase() === "TRUE" ? "11" : "0"}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden flex">
                        <div className="h-full bg-cyan-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "45%" : "50%" }}></div>
                        <div className="h-full bg-emerald-500" style={{ width: selectedGame.finished.toUpperCase() === "TRUE" ? "55%" : "50%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button (At the very bottom) */}
            <div className="flex justify-center pt-4 max-w-4xl mx-auto w-full">
              <button
                onClick={() => dispatch(setSelectedGameId(null))}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg cursor-pointer text-slate-200"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500" />
                <span>Back to Timeline</span>
              </button>
            </div>
          </div> : selectedTeam ? (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Back row */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => dispatch(setSelectedTeamId(null))}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer text-slate-300"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-500" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            {/* Team details card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900/60 to-slate-950/60 border border-slate-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
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
                    FIFA Code: {selectedTeam.fifa_code} | Group: {selectedTeam.groups}
                  </p>
                </div>
              </div>

              {/* Quick statistics row */}
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 z-10">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Played Matches</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{selectedTeamPlayedMatches.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 text-center min-w-[120px]">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Upcoming Matches</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1 font-mono">{selectedTeamUpcomingMatches.length}</p>
                </div>
              </div>
            </div>

            {/* Matches list for this team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upcoming Matches */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2 border-b border-slate-900 pb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  Upcoming Matches
                </h3>
                {selectedTeamUpcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTeamUpcomingMatches.map((match) => {
                      const homeFlag = flagMap[match.home_team_id] || (match.home_team_name_en ? flagMap[match.home_team_name_en.toLowerCase()] : undefined)
                      const awayFlag = flagMap[match.away_team_id] || (match.away_team_name_en ? flagMap[match.away_team_name_en.toLowerCase()] : undefined)
                      return (
                        <div
                          key={match._id}
                          onClick={() => dispatch(setSelectedGameId(match._id))}
                          className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-805 hover:bg-slate-900/50 transition-all flex flex-col justify-between gap-4 group shadow-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-900/30">
                            <span>Group {match.group} • Matchday {match.matchday}</span>
                            <Countdown dateStr={match.local_date} />
                          </div>

                          <div className="flex items-center justify-between my-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {homeFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-850 shrink-0">
                                  <Image src={homeFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : <span className="text-xs">🏴</span>}
                              <span className="font-semibold text-xs text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                                {match.home_team_name_en || match.home_team_label || ""}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-600 font-bold font-mono px-3">VS</span>

                            <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                              <span className="font-semibold text-xs text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                                {match.away_team_name_en || match.away_team_label || ""}
                              </span>
                              {awayFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-850 shrink-0">
                                  <Image src={awayFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : <span className="text-xs">🏴</span>}
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-900/30">
                            <MapPin className="w-3.5 h-3.5 text-slate-600" />
                            <span>Stadium: {stadiumsMap[match.stadium_id] || `#${match.stadium_id}`} | {match.local_date}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/10 rounded-2xl border border-slate-900/40 text-slate-500 text-xs">
                    No upcoming matches scheduled.
                  </div>
                )}
              </div>

              {/* Played Matches */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 border-b border-slate-900 pb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Played Matches
                </h3>
                {selectedTeamPlayedMatches.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTeamPlayedMatches.map((match) => {
                      const homeFlag = flagMap[match.home_team_id] || (match.home_team_name_en ? flagMap[match.home_team_name_en.toLowerCase()] : undefined)
                      const awayFlag = flagMap[match.away_team_id] || (match.away_team_name_en ? flagMap[match.away_team_name_en.toLowerCase()] : undefined)
                      return (
                        <div
                          key={match._id}
                          onClick={() => dispatch(setSelectedGameId(match._id))}
                          className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-850 hover:bg-slate-900/50 transition-all flex flex-col justify-between gap-4 group shadow-xs cursor-pointer"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-900/30">
                            <span>Group {match.group} • Matchday {match.matchday}</span>
                            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/10 font-mono text-xs">{match.home_score} : {match.away_score}</span>
                          </div>

                          <div className="flex items-center justify-between my-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {homeFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-855 shrink-0">
                                  <Image src={homeFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : <span className="text-xs">🏴</span>}
                              <span className="font-semibold text-xs text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                                {match.home_team_name_en || match.home_team_label || ""}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-600 font-bold font-mono px-3">VS</span>

                            <div className="flex items-center justify-end gap-2 flex-1 min-w-0">
                              <span className="font-semibold text-xs text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                                {match.away_team_name_en || match.away_team_label || ""}
                              </span>
                              {awayFlag ? (
                                <div className="relative w-8 h-5.5 overflow-hidden rounded border border-slate-855 shrink-0">
                                  <Image src={awayFlag} alt="" fill className="object-cover" unoptimized />
                                </div>
                              ) : <span className="text-xs">🏴</span>}
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1 border-t border-slate-900/30 my-1">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            <span>Stadium: {stadiumsMap[match.stadium_id] || `#${match.stadium_id}`} | {match.local_date}</span>
                          </div>

                          {((match.home_scorers && match.home_scorers !== "null") || (match.away_scorers && match.away_scorers !== "null")) && (
                            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-950/80 flex flex-col gap-1 text-[9px] text-slate-550">
                              <div className="flex justify-between gap-4">
                                <div className="truncate flex-1">
                                  {match.home_scorers && match.home_scorers !== "null" ? match.home_scorers : ""}
                                </div>
                                <div className="truncate flex-1 text-right">
                                  {match.away_scorers && match.away_scorers !== "null" ? match.away_scorers : ""}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-900/10 rounded-2xl border border-slate-900/40 text-slate-505 text-xs">
                    No played matches recorded.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tournament Statistics Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Total Matches</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-100">{stats.total}</h3>
                </div>
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Played</p>
                  <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats.played}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Upcoming</p>
                  <h3 className="text-2xl font-bold mt-1 text-sky-400">{stats.remaining}</h3>
                </div>
                <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Teams</p>
                  <h3 className="text-2xl font-bold mt-1 text-slate-100">
                    {teamsData?.teams?.length || 48}
                  </h3>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </section>

            {/* Search & Main Tab Switcher */}
            <section className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900/20 p-3 rounded-2xl border border-slate-900/60">
              {/* Tabs */}
              <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-900">
                <button
                  onClick={() => dispatch(setActiveTab("matches"))}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "matches"
                    ? "bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Calendar className="w-4 h-4" />
                  Matches
                </button>
                <button
                  onClick={() => dispatch(setActiveTab("teams"))}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "teams"
                    ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-slate-200"
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Teams & Groups
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  placeholder="Search teams, matchdays, groups..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 rounded-xl border border-slate-900 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-sm outline-hidden transition-all placeholder:text-slate-500"
                />
              </div>
            </section>

            {/* MATCHES VIEW */}
            {activeTab === "matches" && (
              <div className="space-y-6">
                {/* Filters Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/10 p-4 rounded-xl border border-slate-900/40">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      Filter matches:
                    </span>

                    {/* Status Selector */}
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-900">
                      {(["all", "finished", "upcoming"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => dispatch(setFilterStatus(status))}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${filterStatus === status
                            ? "bg-slate-800 text-slate-100 font-semibold"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                          {status === "all"
                            ? "All Matches"
                            : status === "finished"
                              ? "Finished"
                              : "Upcoming"}
                        </button>
                      ))}
                    </div>

                    {/* Group Filter Selector */}
                    <select
                      value={selectedGroup}
                      onChange={(e) => dispatch(setSelectedGroup(e.target.value))}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-950 rounded-lg border border-slate-900 text-slate-300 outline-hidden hover:border-slate-850 cursor-pointer"
                    >
                      <option value="all">All Groups</option>
                      {allGroupLetters.map((group) => (
                        <option key={group} value={group}>
                          Group {group}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Reset Filters button */}
                  {(searchQuery || filterStatus !== "all" || selectedGroup !== "all") && (
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="text-xs text-cyan-500 hover:text-cyan-400 font-semibold flex items-center gap-1 bg-cyan-500/5 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/30 transition-all cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Matches Grouped list */}
                {gamesGroupedByDate.length > 0 ? (
                  <div className="space-y-10">
                    {gamesGroupedByDate.map(({ date, matches }) => (
                      <div key={date} className="space-y-4">
                        {/* Date Heading */}
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-linear-to-r from-transparent to-slate-800/80"></div>
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-4 py-1.5 rounded-full border border-slate-900">
                            {date}
                          </span>
                          <div className="h-px flex-1 bg-linear-to-l from-transparent to-slate-800/80"></div>
                        </div>

                        {/* Games Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {matches.map((match) => {
                            const isFinished = match.finished.toUpperCase() === "TRUE"
                            const homeFlag = flagMap[match.home_team_id] || (match.home_team_name_en ? flagMap[match.home_team_name_en.toLowerCase()] : undefined)
                            const awayFlag = flagMap[match.away_team_id] || (match.away_team_name_en ? flagMap[match.away_team_name_en.toLowerCase()] : undefined)

                            return (
                              <div
                                key={match._id}
                                onClick={() => dispatch(setSelectedGameId(match._id))}
                                className="bg-slate-900/30 hover:bg-slate-900/60 backdrop-blur-xs border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group shadow-xs hover:shadow-md cursor-pointer"
                              >
                                {/* Card Header info */}
                                <div className="flex items-center justify-between text-slate-400 text-xs mb-4 pb-2 border-b border-slate-900/40">
                                  <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900 font-medium">
                                    Group {match.group} • Matchday {match.matchday}
                                  </span>

                                  {!isFinished && <Countdown dateStr={match.local_date} />}

                                  <span
                                    className={`px-2 py-0.5 rounded font-semibold text-[10px] tracking-wide uppercase ${isFinished
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                                      }`}
                                  >
                                    {isFinished ? "Finished" : "Upcoming"}
                                  </span>
                                </div>

                                {/* Teams and Scores row */}
                                <div className="flex items-center justify-between my-2">
                                  {/* Home Team */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(setSelectedTeamId(match.home_team_id));
                                    }}
                                    className="flex flex-1 items-center gap-3 min-w-0 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded-xl transition-all"
                                  >
                                    {homeFlag ? (
                                      <div className="relative w-9 h-6 overflow-hidden rounded-md border border-slate-800 shrink-0 shadow-xs">
                                        <Image
                                          src={homeFlag}
                                          alt={match.home_team_name_en || match.home_team_label || ""}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-9 h-6 bg-slate-800 rounded-md shrink-0 flex items-center justify-center text-xs">🏴</div>
                                    )}
                                    <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover:text-cyan-400 transition-colors">
                                      {match.home_team_name_en || match.home_team_label || ""}
                                    </span>
                                  </div>

                                  {/* Match Center: Score / Time */}
                                  <div className="px-4 flex flex-col items-center shrink-0">
                                    {isFinished ? (
                                      <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-855 shadow-inner font-mono font-bold text-lg text-emerald-400">
                                        <span>{match.home_score}</span>
                                        <span className="text-slate-650 text-sm font-sans">:</span>
                                        <span>{match.away_score}</span>
                                      </div>
                                    ) : (
                                      <div className="text-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-855">
                                        <p className="font-mono text-xs font-bold text-cyan-500">
                                          {match.local_date.split(" ")[1]}
                                        </p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Away Team */}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      dispatch(setSelectedTeamId(match.away_team_id));
                                    }}
                                    className="flex flex-1 items-center justify-end gap-3 min-w-0 cursor-pointer hover:bg-slate-850/40 p-1.5 rounded-xl transition-all"
                                  >
                                    <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover:text-cyan-400 transition-colors">
                                      {match.away_team_name_en || match.away_team_label || ""}
                                    </span>
                                    {awayFlag ? (
                                      <div className="relative w-9 h-6 overflow-hidden rounded-md border border-slate-800 shrink-0 shadow-xs">
                                        <Image
                                          src={awayFlag}
                                          alt={match.away_team_name_en || match.away_team_label || ""}
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
                                <div className="mt-4 pt-3 border-t border-slate-900/40 flex flex-col gap-2 text-slate-400 text-xs">
                                  {/* Stadium */}
                                  <div className="flex items-center gap-1.5 text-[11px] text-slate-505">
                                    <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                    <span>
                                      Stadium: {stadiumsMap[match.stadium_id] || `#${match.stadium_id}`}
                                    </span>
                                  </div>

                                  {/* Scorers */}
                                  {isFinished &&
                                    ((match.home_scorers && match.home_scorers !== "null") ||
                                      (match.away_scorers && match.away_scorers !== "null")) && (
                                      <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-950/80 flex flex-col gap-1 text-[10px]">
                                        <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                                          ⚽ Scorers
                                        </span>
                                        <div className="flex justify-between gap-4">
                                          <div className="text-slate-400 font-medium truncate flex-1">
                                            {match.home_scorers && match.home_scorers !== "null"
                                              ? match.home_scorers
                                              : ""}
                                          </div>
                                          <div className="text-slate-400 font-medium truncate flex-1 text-right">
                                            {match.away_scorers && match.away_scorers !== "null"
                                              ? match.away_scorers
                                              : ""}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-900/10 rounded-2xl border border-slate-900/40">
                    <p className="text-slate-505 text-sm mb-4">No matches found matching your filters.</p>
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TEAMS & GROUPS VIEW */}
            {activeTab === "teams" && (
              <div className="space-y-8 animate-fade-in">
                {Object.keys(teamsGroupedByGroup).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allGroupLetters.map((groupLetter) => {
                      const teams = teamsGroupedByGroup[groupLetter] || []
                      if (teams.length === 0) return null

                      return (
                        <div
                          key={groupLetter}
                          className="bg-slate-900/30 backdrop-blur-xs border border-slate-900 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300 shadow-xs"
                        >
                          {/* Group Header */}
                          <div className="bg-linear-to-r from-emerald-500/10 to-emerald-600/5 px-5 py-4 border-b border-slate-900 flex justify-between items-center">
                            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/20"></span>
                              Group {groupLetter}
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                              {teams.length} Teams
                            </span>
                          </div>

                          {/* Teams List */}
                          <div className="p-4 divide-y divide-slate-900/40">
                            {teams.map((team) => (
                              <div
                                key={team._id}
                                onClick={() => {
                                  dispatch(setSelectedTeamId(team.id))
                                }}
                                className="flex items-center justify-between py-3 px-1 hover:bg-slate-900/50 rounded-xl transition-all cursor-pointer group"
                                title={`View details for ${team.name_en}`}
                              >
                                <div className="flex items-center gap-3">
                                  {team.flag ? (
                                    <div className="relative w-8 h-5.5 overflow-hidden rounded-md border border-slate-800 shadow-xs shrink-0">
                                      <Image
                                        src={team.flag}
                                        alt={team.name_en}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-5.5 bg-slate-850 rounded-md shrink-0 flex items-center justify-center text-xs">🏴</div>
                                  )}
                                  <span className="text-sm font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                                    {team.name_en}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                                    {team.fifa_code}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-900/10 rounded-2xl border border-slate-900/40">
                    <p className="text-slate-505 text-sm">No teams found.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="mt-16 py-8 border-t border-slate-900/60 bg-slate-950/40 text-center text-xs text-slate-600">
        <p className="max-w-7xl mx-auto px-4">
          FIFA World Cup 2026 Dashboard • Integrated with worldcup26.ir APIs
        </p>
      </footer>

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
                  FOOTBALL LIVE STREAM
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
                Please Sign Up to Watch <span className="text-amber-500">Football</span> Match Live
              </h3>
              
              {/* Main action button */}
              <button className="w-full py-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition-all rounded-xl text-slate-955 font-extrabold tracking-wider text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 cursor-pointer uppercase">
                SIGN UP & WATCH NOW!
              </button>
              
              {/* Adblocker warning section */}
              <div className="w-full bg-[#081324] border border-slate-900/65 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                    <ShieldAlert className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-100 font-bold text-sm">Ad Blocker Detected</span>
                    <span className="text-slate-450 text-[10px]">Unlock all high speed HD streams below</span>
                  </div>
                </div>
                <button className="px-3 py-2 bg-amber-500 text-slate-955 font-extrabold text-[10px] rounded-lg tracking-wider hover:bg-amber-600 transition-colors uppercase shrink-0">
                  UNLOCK HD
                </button>
              </div>
              
              {/* Features grid */}
              <div className="w-full grid grid-cols-2 gap-3">
                {/* Feature 1 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Film className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">High Quality Streaming</span>
                </div>
                {/* Feature 2 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Infinity className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">Watch Without Limits</span>
                </div>
                {/* Feature 3 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Ban className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">No Ads, 100% Free Access</span>
                </div>
                {/* Feature 4 */}
                <div className="flex items-center gap-2.5 p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl">
                  <Smartphone className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] font-semibold text-slate-300">Watch on any device</span>
                </div>
              </div>
              
              {/* Footer account login */}
              <p className="text-slate-400 text-xs font-semibold mt-2">
                Already Have Account? <span className="text-amber-500 hover:text-amber-400 cursor-pointer font-bold transition-colors">Login</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
