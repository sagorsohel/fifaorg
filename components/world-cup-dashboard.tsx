"use client"

import { useMemo, useState, useEffect } from "react"
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
  useGetStadiumsQuery,
  Game,
  Team,
  Stadium,
} from "@/lib/services/apiSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import {
  setSelectedTeamId,
  setLanguage,
} from "@/lib/features/uiSlice"
import { Trophy, RefreshCw, XCircle } from "lucide-react"

import {
  LanguageCode,
  LANGUAGES,
  translate,
  parseStadiumLocalDate,
} from "@/lib/i18n"

// Import sub-components
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton"
import StatsSection from "@/components/dashboard/stats-section"
import FilterSection from "@/components/dashboard/filter-section"
import MatchesView from "@/components/dashboard/matches-view"
import TeamsView from "@/components/dashboard/teams-view"
import TeamDetailView from "@/components/dashboard/team-detail-view"

// Localized Date formatter helper for grouped headings
function formatLocalDateOnly(date: Date, lang: LanguageCode): string {
  try {
    let locale = "en-GB"
    if (lang === "en-us") locale = "en-US"
    else if (lang === "pt") locale = "pt-BR"
    else if (lang === "es-la") locale = "es-419"
    else locale = lang

    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return date.toDateString()
  }
}

export default function WorldCupDashboard() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [adsConfig, setAdsConfig] = useState<{
    header_ads?: string
    hero_ads?: string
    hero2_ads?: string
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

  useEffect(() => {
    document.title = "World Cup 2026 Dashboard"
  }, [])

  // Selectors from Redux UI State
  const lang = useAppSelector((state) => state.ui.language)
  const searchQuery = useAppSelector((state) => state.ui.searchQuery)
  const filterStatus = useAppSelector((state) => state.ui.filterStatus)
  const activeTab = useAppSelector((state) => state.ui.activeTab)
  const selectedGroup = useAppSelector((state) => state.ui.selectedGroup)
  const selectedTeamId = useAppSelector((state) => state.ui.selectedTeamId)

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

  // Create a fast lookup map for team names from teams data
  const teamNamesMap = useMemo(() => {
    const map: Record<string, Team> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((team) => {
        map[team.id] = team
      })
    }
    return map
  }, [teamsData])

  // Create a fast lookup map for stadiums
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

  // Selected team lookup & match filtering
  const selectedTeam = useMemo(() => {
    if (!selectedTeamId || !teamsData?.teams) return null
    return teamsData.teams.find((t) => t.id === selectedTeamId || t._id === selectedTeamId)
  }, [selectedTeamId, teamsData])

  // Process and group matches for the dashboard matches timeline
  const processedGames = useMemo(() => {
    if (!gamesData?.games) return []

    let filtered = [...gamesData.games]

    // Apply Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((game) => {
        const homeTeam = teamNamesMap[game.home_team_id]
        const awayTeam = teamNamesMap[game.away_team_id]

        const matchTeam = (team: Team | undefined, label: string | undefined, dbNameEn: string | undefined) => {
          if (label && label.toLowerCase().includes(query)) return true
          if (dbNameEn && dbNameEn.toLowerCase().includes(query)) return true
          if (!team) return false

          if (team.name_en && team.name_en.toLowerCase().includes(query)) return true
          if (team.name_fa && team.name_fa.toLowerCase().includes(query)) return true
          if (team.fifa_code && team.fifa_code.toLowerCase().includes(query)) return true

          if (team.translations) {
            try {
              const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
              if (parsed && typeof parsed === "object") {
                return Object.values(parsed).some((val) =>
                  typeof val === "string" && val.toLowerCase().includes(query)
                )
              }
            } catch { }
          }
          return false
        }

        return (
          matchTeam(homeTeam, game.home_team_label, game.home_team_name_en) ||
          matchTeam(awayTeam, game.away_team_label, game.away_team_name_en) ||
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
      return parseStadiumLocalDate(a.local_date, a.stadium_id).getTime() - parseStadiumLocalDate(b.local_date, b.stadium_id).getTime()
    })
  }, [gamesData, searchQuery, filterStatus, selectedGroup, teamNamesMap])

  // Group games by date for display
  const gamesGroupedByDate = useMemo(() => {
    const groups: Record<string, Game[]> = {}

    processedGames.forEach((game) => {
      const parsed = parseStadiumLocalDate(game.local_date, game.stadium_id)
      const dateKey = formatLocalDateOnly(parsed, lang)

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(game)
    })

    return Object.entries(groups).map(([date, matches]) => ({
      date,
      matches,
    }))
  }, [processedGames, lang])

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
      <>
        {/* Background Glows */}
        <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardSkeleton />
        </main>
      </>
    )
  }

  // Handle Error State
  if (isTeamsError || isGamesError || isStadiumsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-955 text-white p-3 sm:p-6">
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

  return (
    <>
      {/* Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <main className="sm:max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 sm:pb-8">

        {selectedTeam ? (
          <TeamDetailView
            selectedTeam={selectedTeam}
            allMatches={gamesData?.games || []}
            flagMap={flagMap}
            teamNamesMap={teamNamesMap}
            stadiumNameGetter={getStadiumName}
          />
        ) : (
          <>
            {/* Tournament Statistics Cards */}
            <StatsSection
              stats={stats}
              teamsCount={teamsData?.teams?.length || 48}
              lang={lang}
            />

            {/* Search, Main Tab Switcher & Filters */}
            <FilterSection />

            {/* MATCHES VIEW */}
            {activeTab === "matches" && (
              <MatchesView
                gamesGroupedByDate={gamesGroupedByDate}
                flagMap={flagMap}
                teamNamesMap={teamNamesMap}
                stadiumsMap={stadiumsMap}
                adsConfig={adsConfig}
              />
            )}

            {/* TEAMS & GROUPS VIEW */}
            {activeTab === "teams" && (
              <TeamsView teamsGroupedByGroup={teamsGroupedByGroup} />
            )}
          </>
        )}
      </main>
    </>
  )
}
