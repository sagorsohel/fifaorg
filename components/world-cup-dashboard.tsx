"use client"

import { useMemo } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  useGetTeamsQuery,
  useGetGamesQuery,
  Game,
  Team,
} from "@/lib/services/apiSlice"
import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/store"
import {
  setLanguage,
  setSearchQuery,
  setFilterStatus,
  setActiveTab,
  setSelectedGroup,
  resetFilters,
} from "@/lib/features/uiSlice"
import {
  Search,
  Globe,
  Trophy,
  Calendar,
  Users,
  RefreshCw,
  Clock,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  XCircle,
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

// Translations dictionary for Persian language UI elements
const translations = {
  en: {
    title: "FIFA World Cup 2026",
    subtitle: "Teams & Matches Tracker",
    matches: "Matches",
    teams: "Teams & Groups",
    searchPlaceholder: "Search teams, matchdays, groups...",
    statusAll: "All Matches",
    statusFinished: "Finished",
    statusUpcoming: "Upcoming",
    totalMatches: "Total Matches",
    played: "Played",
    remaining: "Upcoming",
    participatingTeams: "Teams",
    group: "Group",
    matchday: "Matchday",
    groupStage: "Group Stage",
    stadium: "Stadium",
    noMatches: "No matches found matching your filters.",
    noTeams: "No teams found.",
    reset: "Clear Filters",
    allGroups: "All Groups",
    scorers: "Scorers",
    loading: "Loading World Cup details...",
    errorTitle: "Failed to load tournament data",
    errorDesc: "Please check your connection and try again.",
    retry: "Retry Connection",
    languageLabel: "Language",
    fifaCode: "FIFA Code",
    filterTitle: "Filter matches",
    groupFilterTitle: "Group",
  },
  fa: {
    title: "جام جهانی فوتبال ۲۰۲۶",
    subtitle: "پیگیری تیم‌ها و مسابقات",
    matches: "مسابقات",
    teams: "تیم‌ها و گروه‌ها",
    searchPlaceholder: "جستجوی تیم‌ها، روزهای مسابقه، گروه‌ها...",
    statusAll: "همه مسابقات",
    statusFinished: "برگزار شده",
    statusUpcoming: "پیش رو",
    totalMatches: "کل مسابقات",
    played: "بازی شده",
    remaining: "پیش رو",
    participatingTeams: "تیم‌ها",
    group: "گروه",
    matchday: "روز بازی",
    groupStage: "مرحله گروهی",
    stadium: "ورزشگاه",
    noMatches: "هیچ مسابقه‌ای با فیلترهای شما مطابقت ندارد.",
    noTeams: "تیم مسابقه‌ای یافت نشد.",
    reset: "پاک کردن فیلترها",
    allGroups: "همه گروه‌ها",
    scorers: "گلزنان",
    loading: "درحال بارگذاری اطلاعات جام جهانی...",
    errorTitle: "خطا در دریافت اطلاعات مسابقات",
    errorDesc: "لطفاً اتصال اینترنت خود را بررسی کرده و مجدداً تلاش کنید.",
    retry: "تلاش مجدد",
    languageLabel: "زبان",
    fifaCode: "کد فیفا",
    filterTitle: "فیلتر مسابقات",
    groupFilterTitle: "گروه",
  },
}

export default function WorldCupDashboard() {
  const dispatch = useAppDispatch()
  const { theme, setTheme } = useTheme()

  // Selectors from Redux UI State
  const language = useAppSelector((state) => state.ui.language)
  const searchQuery = useAppSelector((state) => state.ui.searchQuery)
  const filterStatus = useAppSelector((state) => state.ui.filterStatus)
  const activeTab = useAppSelector((state) => state.ui.activeTab)
  const selectedGroup = useAppSelector((state) => state.ui.selectedGroup)

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

  const t = translations[language]

  // Combine refetches
  const handleRefetch = () => {
    refetchTeams()
    refetchGames()
  }

  // Create a fast lookup map for team flags from teams data
  const flagMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((team) => {
        map[team.id] = team.flag
        map[team.name_en.toLowerCase()] = team.flag
        map[team.name_fa] = team.flag
      })
    }
    return map
  }, [teamsData])

  // Process and group matches
  const processedGames = useMemo(() => {
    if (!gamesData?.games) return []

    let filtered = [...gamesData.games]

    // Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((game) => {
        return (
          (game.home_team_name_en && game.home_team_name_en.toLowerCase().includes(query)) ||
          (game.home_team_name_fa && game.home_team_name_fa.includes(query)) ||
          (game.away_team_name_en && game.away_team_name_en.toLowerCase().includes(query)) ||
          (game.away_team_name_fa && game.away_team_name_fa.includes(query)) ||
          (game.home_team_label && game.home_team_label.toLowerCase().includes(query)) ||
          (game.away_team_label && game.away_team_label.toLowerCase().includes(query)) ||
          `group ${game.group}`.toLowerCase().includes(query) ||
          `گروه ${game.group}`.includes(query) ||
          `matchday ${game.matchday}`.toLowerCase().includes(query) ||
          `بازی ${game.matchday}`.includes(query)
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
      let dateKey = ""
      if (language === "fa") {
        // Use Persian Date formatted string as key
        // persian_date format example: "1405-03-21 13:00" -> extract date portion
        dateKey = game.persian_date.split(" ")[0]
      } else {
        // Format local date part to a human readable day string
        const parsed = parseLocalDate(game.local_date)
        dateKey = parsed.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(game)
    })

    return Object.entries(groups).map(([date, matches]) => ({
      date,
      matches,
    }))
  }, [processedGames, language])

  // Group teams by their respective groups A to L
  const teamsGroupedByGroup = useMemo(() => {
    if (!teamsData?.teams) return {}

    const groups: Record<string, Team[]> = {}
    teamsData.teams.forEach((team) => {
      // In sample team object, the key is 'groups': "A"
      const groupName = team.groups || "Unassigned"
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(team)
    })

    // Sort teams within each group alphabetically by English name
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
  if (isTeamsLoading || isGamesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-slate-900 via-slate-950 to-black text-white p-6">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-transparent border-b-emerald-500 border-l-transparent animate-spin"></div>
          <div className="absolute inset-3 rounded-full bg-slate-900 flex items-center justify-center">
            <span className="text-3xl">⚽</span>
          </div>
        </div>
        <p className="text-lg font-medium text-slate-300 animate-pulse">{t.loading}</p>
      </div>
    )
  }

  // Handle Error State
  if (isTeamsError || isGamesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">
        <div className="p-8 max-w-md w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-red-500/30 text-center shadow-2xl">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-red-400">{t.errorTitle}</h2>
          <p className="text-slate-400 mb-6 text-sm">{t.errorDesc}</p>
          <button
            onClick={handleRefetch}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 transition-colors rounded-xl font-medium cursor-pointer shadow-lg shadow-red-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            {t.retry}
          </button>
        </div>
      </div>
    )
  }

  const allGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  return (
    <div
      dir={language === "fa" ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans transition-all duration-300"
    >
      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-amber-500/15">
              <Trophy className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-xs text-slate-400">{t.subtitle}</p>
            </div>
          </div>

          {/* Action Filters / Theme / Language */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => dispatch(setLanguage(language === "en" ? "fa" : "en"))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === "en" ? "فارسی" : "English"}</span>
            </button>

            {/* Dark Mode toggle (Simple presentation hook) */}
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
        {/* Tournament Statistics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
            <div>
              <p className="text-xs text-slate-400 font-medium">{t.totalMatches}</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-100">{stats.total}</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
            <div>
              <p className="text-xs text-slate-400 font-medium">{t.played}</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats.played}</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
              <Trophy className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
            <div>
              <p className="text-xs text-slate-400 font-medium">{t.remaining}</p>
              <h3 className="text-2xl font-bold mt-1 text-sky-400">{stats.remaining}</h3>
            </div>
            <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
            <div>
              <p className="text-xs text-slate-400 font-medium">{t.participatingTeams}</p>
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
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "matches"
                  ? "bg-linear-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t.matches}
            </button>
            <button
              onClick={() => dispatch(setActiveTab("teams"))}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "teams"
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              {t.teams}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute ${language === "fa" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder={t.searchPlaceholder}
              className={`w-full ${language === "fa" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 bg-slate-950 rounded-xl border border-slate-900 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-sm outline-hidden transition-all placeholder:text-slate-500`}
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
                  {t.filterTitle}:
                </span>

                {/* Status Selector */}
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-900">
                  {(["all", "finished", "upcoming"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => dispatch(setFilterStatus(status))}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        filterStatus === status
                          ? "bg-slate-800 text-slate-100 font-semibold"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {status === "all"
                        ? t.statusAll
                        : status === "finished"
                        ? t.statusFinished
                        : t.statusUpcoming}
                    </button>
                  ))}
                </div>

                {/* Group Filter Selector */}
                <select
                  value={selectedGroup}
                  onChange={(e) => dispatch(setSelectedGroup(e.target.value))}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-950 rounded-lg border border-slate-900 text-slate-300 outline-hidden hover:border-slate-850 cursor-pointer"
                >
                  <option value="all">{t.allGroups}</option>
                  {allGroupLetters.map((group) => (
                    <option key={group} value={group}>
                      {t.group} {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Filters button */}
              {(searchQuery || filterStatus !== "all" || selectedGroup !== "all") && (
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="text-xs text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-1 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  {t.reset}
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
                            className="bg-slate-900/30 hover:bg-slate-900/60 backdrop-blur-xs border border-slate-900 hover:border-slate-800 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 group shadow-xs hover:shadow-md"
                          >
                            {/* Card Header info */}
                            <div className="flex items-center justify-between text-slate-400 text-xs mb-4 pb-2 border-b border-slate-900/40">
                              <span className="bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900 font-medium">
                                {t.group} {match.group} • {t.matchday} {match.matchday}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded font-semibold text-[10px] tracking-wide uppercase ${
                                  isFinished
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {isFinished ? t.statusFinished : t.statusUpcoming}
                              </span>
                            </div>

                            {/* Teams and Scores row */}
                            <div className="flex items-center justify-between my-2">
                              {/* Home Team */}
                              <div className="flex flex-1 items-center gap-3 min-w-0">
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
                                <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                                  {(language === "fa" ? match.home_team_name_fa : match.home_team_name_en) || match.home_team_label || ""}
                                </span>
                              </div>

                              {/* Match Center: Score / Time */}
                              <div className="px-4 flex flex-col items-center shrink-0">
                                {isFinished ? (
                                  <div className="flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-850 shadow-inner font-mono font-bold text-lg text-emerald-400">
                                    <span>{match.home_score}</span>
                                    <span className="text-slate-600 text-sm font-sans">:</span>
                                    <span>{match.away_score}</span>
                                  </div>
                                ) : (
                                  <div className="text-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
                                    <p className="font-mono text-xs font-bold text-amber-500">
                                      {match.local_date.split(" ")[1]}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Away Team */}
                              <div className="flex flex-1 items-center justify-end gap-3 min-w-0">
                                <span className="font-semibold text-slate-100 truncate text-sm sm:text-base group-hover:text-amber-400 transition-colors">
                                  {(language === "fa" ? match.away_team_name_fa : match.away_team_name_en) || match.away_team_label || ""}
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
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                                <span>
                                  {t.stadium}: #{match.stadium_id}
                                </span>
                              </div>

                              {/* Scorers */}
                              {isFinished &&
                                ((match.home_scorers && match.home_scorers !== "null") ||
                                  (match.away_scorers && match.away_scorers !== "null")) && (
                                  <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-950/80 flex flex-col gap-1 text-[10px]">
                                    <span className="font-semibold text-slate-500 uppercase tracking-wider text-[9px]">
                                      ⚽ {t.scorers}
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
                <p className="text-slate-500 text-sm mb-4">{t.noMatches}</p>
                <button
                  onClick={() => dispatch(resetFilters())}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 transition-colors border border-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  {t.reset}
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
                          {t.group} {groupLetter}
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                          {teams.length} {t.participatingTeams}
                        </span>
                      </div>

                      {/* Teams List */}
                      <div className="p-4 divide-y divide-slate-900/40">
                        {teams.map((team) => (
                          <div
                            key={team._id}
                            onClick={() => {
                              // Trigger filtering of matches list by this specific group
                              dispatch(setSelectedGroup(groupLetter))
                              dispatch(setSearchQuery(language === "fa" ? team.name_fa : team.name_en))
                              dispatch(setActiveTab("matches"))
                            }}
                            className="flex items-center justify-between py-3 px-1 hover:bg-slate-900/50 rounded-xl transition-all cursor-pointer group"
                            title={`Filter matches for ${team.name_en}`}
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
                                {language === "fa" ? team.name_fa : team.name_en}
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
                <p className="text-slate-500 text-sm">{t.noTeams}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="mt-16 py-8 border-t border-slate-900/60 bg-slate-950/40 text-center text-xs text-slate-600">
        <p className="max-w-7xl mx-auto px-4">
          FIFA World Cup 2026 Dashboard • Integrated with worldcup26.ir APIs
        </p>
      </footer>
    </div>
  )
}
