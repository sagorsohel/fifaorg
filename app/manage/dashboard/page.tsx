"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Trophy,
  LogOut,
  MapPin,
  Calendar,
  Search,
  SlidersHorizontal,
  Edit3,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Users,
  Upload,
  ChevronRight,
  Info
} from "lucide-react"

import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  getGameSlug,
  Game,
  Team
} from "@/lib/services/apiSlice"

import { parseStadiumLocalDate } from "@/lib/i18n"

// Localized Date formatter helper for date grouped headings
function formatLocalDateOnly(date: Date): string {
  try {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (e) {
    return date.toDateString()
  }
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  
  // Navigation State
  const [activeView, setActiveView] = useState<"matches" | "teams">("matches")

  // Edit Modal State
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [referralLink, setReferralLink] = useState("")
  const [modalImage, setModalImage] = useState("")
  const [bgImage, setBgImage] = useState("")
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState({ text: "", type: "success" })

  // Matches Search/Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "customized" | "standard">("all")

  // Teams Search State
  const [teamSearchQuery, setTeamSearchQuery] = useState("")

  // Authentication check
  useEffect(() => {
    try {
      const isAuth = localStorage.getItem("worldcup2026_admin_auth")
      if (isAuth !== "true") {
        router.push("/manage/login")
      } else {
        setAuthorized(true)
      }
    } catch (e) {
      router.push("/manage/login")
    }
  }, [router])

  // Queries
  const { data: teamsData, isLoading: isTeamsLoading, refetch: refetchTeams } = useGetTeamsQuery(undefined, { skip: !authorized })
  const { data: gamesData, isLoading: isGamesLoading, refetch: refetchGames } = useGetGamesQuery(undefined, { skip: !authorized })
  const { data: stadiumsData, isLoading: isStadiumsLoading, refetch: refetchStadiums } = useGetStadiumsQuery(undefined, { skip: !authorized })

  // Lookup Maps
  const teamMap = useMemo(() => {
    const map: Record<string, Team> = {}
    if (teamsData?.teams) {
      teamsData.teams.forEach((t) => {
        map[t.id] = t
        map[t._id] = t
        map[t.name_en.toLowerCase()] = t
      })
    }
    return map
  }, [teamsData])

  const stadiumMap = useMemo(() => {
    const map: Record<string, any> = {}
    if (stadiumsData?.stadiums) {
      stadiumsData.stadiums.forEach((s) => {
        map[s.id] = s
      })
    }
    return map
  }, [stadiumsData])

  // Computed matches lists
  const filteredMatches = useMemo(() => {
    if (!gamesData?.games) return []
    return gamesData.games.filter((g) => {
      // 1. Search Query Match
      const homeTeam = teamMap[g.home_team_id]
      const awayTeam = teamMap[g.away_team_id]
      const homeName = homeTeam?.name_en || g.home_team_name_en || g.home_team_label || ""
      const awayName = awayTeam?.name_en || g.away_team_name_en || g.away_team_label || ""
      const stadium = stadiumMap[g.stadium_id]
      const stadiumName = stadium?.name_en || ""
      const searchStr = `${homeName} ${awayName} ${stadiumName} ${g.group} ${g.matchday} ${g.slug || ""}`.toLowerCase()
      
      const matchesSearch = searchStr.includes(searchQuery.toLowerCase())

      // 2. Custom Filter Type Match
      const isCustomized = !!(g.referral_link || g.modal_image || g.bg_image)
      if (filterType === "customized") {
        return matchesSearch && isCustomized
      }
      if (filterType === "standard") {
        return matchesSearch && !isCustomized
      }
      return matchesSearch
    })
  }, [gamesData, searchQuery, filterType, teamMap, stadiumMap])

  // Grouped matches list date-wise (mimicking home page)
  const gamesGroupedByDate = useMemo(() => {
    if (!filteredMatches) return []
    
    // Sort games chronologically
    const sorted = [...filteredMatches].sort((a, b) => {
      const da = parseStadiumLocalDate(a.local_date, a.stadium_id).getTime()
      const db = parseStadiumLocalDate(b.local_date, b.stadium_id).getTime()
      return da - db
    })

    const groups: Record<string, Game[]> = {}
    sorted.forEach((game) => {
      const parsed = parseStadiumLocalDate(game.local_date, game.stadium_id)
      const dateKey = formatLocalDateOnly(parsed)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(game)
    })

    return Object.entries(groups).map(([date, matches]) => ({
      date,
      matches,
    }))
  }, [filteredMatches])

  // Computed teams list
  const filteredTeams = useMemo(() => {
    if (!teamsData?.teams) return []
    return teamsData.teams.filter((t) => {
      const searchStr = `${t.name_en} ${t.name_fa || ""} ${t.fifa_code} ${t.groups || ""}`.toLowerCase()
      return searchStr.includes(teamSearchQuery.toLowerCase())
    })
  }, [teamsData, teamSearchQuery])

  // Stats counters
  const stats = useMemo(() => {
    if (!gamesData?.games) return { total: 0, customized: 0, pending: 0, teams: 0 }
    const total = gamesData.games.length
    const customized = gamesData.games.filter((g) => g.referral_link || g.modal_image || g.bg_image).length
    const teamsCount = teamsData?.teams?.length || 0
    return {
      total,
      customized,
      pending: total - customized,
      teams: teamsCount
    }
  }, [gamesData, teamsData])

  const handleLogout = () => {
    try {
      localStorage.removeItem("worldcup2026_admin_auth")
      router.push("/manage/login")
    } catch (e) {}
  }

  // Open edit Modal
  const openEditModal = (game: Game) => {
    setEditingGame(game)
    setReferralLink(game.referral_link || "")
    setModalImage(game.modal_image || "")
    setBgImage(game.bg_image || "")
    setSaveMessage({ text: "", type: "success" })
  }

  // Handle local file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "modal" | "bg") => {
    const file = e.target.files?.[0]
    if (!file) return

    setSaving(true)
    setSaveMessage({ text: "", type: "success" })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/manage/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (target === "modal") {
          setModalImage(data.url)
        } else {
          setBgImage(data.url)
        }
        setSaveMessage({ text: "Image uploaded successfully!", type: "success" })
      } else {
        setSaveMessage({ text: data.error || "Failed to upload image.", type: "error" })
      }
    } catch (err: any) {
      setSaveMessage({ text: err.message || "Network error during upload.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  // Save Settings
  const saveGameSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGame) return

    setSaving(true)
    setSaveMessage({ text: "", type: "success" })

    try {
      const response = await fetch("/api/manage/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingGame.id,
          referral_link: referralLink,
          modal_image: modalImage,
          bg_image: bgImage,
        }),
      })

      const result = await response.json()
      if (response.ok && result.success) {
        setSaveMessage({ text: "Custom configuration saved successfully!", type: "success" })
        refetchGames()
        setTimeout(() => {
          setEditingGame(null)
        }, 1000)
      } else {
        setSaveMessage({ text: result.error || "Failed to save settings.", type: "error" })
      }
    } catch (err: any) {
      setSaveMessage({ text: err.message || "A network error occurred.", type: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Background decoration */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-955 border-r border-slate-900 flex flex-col justify-between shrink-0 relative z-30">
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="p-6 border-b border-slate-900/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Trophy className="w-4 h-4 text-slate-955" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                World Cup 2026
              </h2>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveView("matches")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "matches"
                  ? "bg-slate-900/60 border border-slate-800/80 text-cyan-455 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Manage Matches</span>
              </div>
              {activeView === "matches" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveView("teams")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "teams"
                  ? "bg-slate-900/60 border border-slate-800/80 text-cyan-455 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Manage Teams</span>
              </div>
              {activeView === "teams" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-900/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 text-xs font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT PANEL */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto relative z-10">
        {/* Top Info Banner bar */}
        <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Active view /</span>
            <span className="text-xs font-bold text-cyan-400 capitalize">{activeView}</span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-mono font-bold text-slate-450 uppercase tracking-wider bg-slate-905/30 border border-slate-905 px-4.5 py-1.5 rounded-full">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500"></span>Matches: {stats.total}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Customized: {stats.customized}</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>Teams: {stats.teams}</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1">
          {/* VIEW 1: MATCHES LISTING */}
          {activeView === "matches" && (
            <div className="space-y-6">
              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-905/20 border border-slate-955 p-4 rounded-2xl shadow-xs">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-555" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search teams, stadiums, group..."
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-medium transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:block" />
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-900 flex items-center gap-1 w-full sm:w-auto">
                    {(["all", "customized", "standard"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                          filterType === type
                            ? "bg-slate-900 border border-slate-800 text-cyan-400 font-black shadow-xs"
                            : "text-slate-500 hover:text-slate-350"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loading spinner */}
              {isGamesLoading && (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Loading games...</span>
                </div>
              )}

              {/* Matches Grouped Date-wise Grid */}
              {!isGamesLoading && (
                <div className="space-y-8">
                  {gamesGroupedByDate.length === 0 ? (
                    <div className="py-20 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                      <span>🤷‍♂️</span>
                      <span className="font-bold uppercase tracking-wider">No matches match current filter settings.</span>
                    </div>
                  ) : (
                    gamesGroupedByDate.map(({ date, matches }) => (
                      <div key={date} className="space-y-4">
                        {/* Timeline Date Heading */}
                        <div className="flex items-center gap-3.5">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400/90 font-mono">
                            {date}
                          </h3>
                          <div className="h-[1px] bg-slate-900 flex-1"></div>
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                          {matches.map((match) => {
                            const homeTeam = teamMap[match.home_team_id]
                            const awayTeam = teamMap[match.away_team_id]
                            const homeFlag = homeTeam?.flag || ""
                            const awayFlag = awayTeam?.flag || ""
                            const homeName = homeTeam?.name_en || match.home_team_name_en || match.home_team_label || "TBD"
                            const awayName = awayTeam?.name_en || match.away_team_name_en || match.away_team_label || "TBD"
                            const stadium = stadiumMap[match.stadium_id]
                            const stadiumName = stadium ? `${stadium.name_en}, ${stadium.city_en}` : `Stadium ID: #${match.stadium_id}`
                            const hasCustom = !!(match.referral_link || match.modal_image || match.bg_image)

                            return (
                              <div
                                key={match.id}
                                className={`p-5 rounded-2xl border bg-slate-905/20 hover:bg-slate-905/30 transition-all shadow-xs flex flex-col justify-between gap-5 relative group ${
                                  hasCustom ? "border-cyan-500/20 shadow-lg shadow-cyan-500/5" : "border-slate-905"
                                }`}
                              >
                                {/* Customized tag badge */}
                                {hasCustom && (
                                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[8px] font-black tracking-widest uppercase font-mono">
                                    <span>CUSTOM</span>
                                  </div>
                                )}

                                {/* Match Group info */}
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                  <span>Group {match.group} • Matchday {match.matchday}</span>
                                </div>

                                {/* Scoreboard Line */}
                                <div className="flex items-center justify-between gap-4">
                                  {/* Home Team */}
                                  <div className="flex items-center gap-3 min-w-0 flex-1 justify-start">
                                    {homeFlag ? (
                                      <div className="relative w-8 h-5 overflow-hidden rounded border border-slate-900 shadow-xs shrink-0">
                                        <Image src={homeFlag} alt="" fill className="object-cover" unoptimized />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-5 bg-slate-900 rounded shrink-0 flex items-center justify-center text-xs">🏴</div>
                                    )}
                                    <span className="font-extrabold text-slate-200 text-xs sm:text-sm truncate">{homeName}</span>
                                  </div>

                                  {/* Score */}
                                  <div className="px-3 shrink-0">
                                    {match.finished.toUpperCase() === "TRUE" ? (
                                      <span className="font-mono font-extrabold text-slate-450 bg-slate-950 border border-slate-900 px-3 py-0.5 rounded text-xs">
                                        {match.home_score} : {match.away_score}
                                      </span>
                                    ) : (
                                      <span className="font-mono text-[8px] font-bold text-cyan-500 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                        Upcoming
                                      </span>
                                    )}
                                  </div>

                                  {/* Away Team */}
                                  <div className="flex items-center gap-3 min-w-0 flex-1 justify-end">
                                    <span className="font-extrabold text-slate-200 text-xs sm:text-sm truncate text-right">{awayName}</span>
                                    {awayFlag ? (
                                      <div className="relative w-8 h-5 overflow-hidden rounded border border-slate-900 shadow-xs shrink-0">
                                        <Image src={awayFlag} alt="" fill className="object-cover" unoptimized />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-5 bg-slate-900 rounded shrink-0 flex items-center justify-center text-xs">🏴</div>
                                    )}
                                  </div>
                                </div>

                                {/* Footer details */}
                                <div className="border-t border-slate-900/60 pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-[10px] text-slate-400">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                    <span className="font-medium truncate">{stadiumName}</span>
                                  </div>

                                  <button
                                    onClick={() => openEditModal(match)}
                                    className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Customize Settings</span>
                                  </button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: TEAMS GRID */}
          {activeView === "teams" && (
            <div className="space-y-6">
              {/* Search Toolbar */}
              <div className="flex items-center justify-between gap-4 bg-slate-905/20 border border-slate-955 p-4 rounded-2xl shadow-xs">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-555" />
                  <input
                    type="text"
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    placeholder="Search teams by name, code or group..."
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-medium transition-all"
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider hidden sm:block">
                  Total listed teams: {filteredTeams.length}
                </div>
              </div>

              {/* Loading spinner */}
              {isTeamsLoading && (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Loading teams...</span>
                </div>
              )}

              {/* Teams Responsive Grid */}
              {!isTeamsLoading && (
                <>
                  {filteredTeams.length === 0 ? (
                    <div className="py-20 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                      <span>🏴</span>
                      <span className="font-bold uppercase tracking-wider">No teams found matching search terms.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredTeams.map((team) => (
                        <div
                          key={team.id}
                          className="p-4 bg-slate-905/20 border border-slate-905 hover:bg-slate-905/30 transition-all rounded-2xl shadow-xs flex flex-col gap-3 relative overflow-hidden"
                        >
                          {/* Flag and basic details header */}
                          <div className="flex items-center gap-3">
                            {team.flag ? (
                              <div className="relative w-10 h-7 rounded border border-slate-900/60 overflow-hidden shrink-0">
                                <Image src={team.flag} alt="" fill className="object-cover" unoptimized />
                              </div>
                            ) : (
                              <div className="w-10 h-7 bg-slate-900 rounded shrink-0 flex items-center justify-center text-xs">🏴</div>
                            )}
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-slate-200 text-xs truncate">{team.name_en}</h4>
                              <p className="text-[9px] text-slate-500 font-semibold truncate font-sans">{team.name_fa || "-"}</p>
                            </div>
                          </div>

                          {/* Grid info row */}
                          <div className="border-t border-slate-900/40 pt-3 flex justify-between text-[9px] font-bold text-slate-450 uppercase tracking-wide font-mono">
                            <div>
                              <span className="text-slate-500 block text-[8px] tracking-wider mb-0.5">FIFA Code</span>
                              <span className="text-cyan-400">{team.fifa_code || team.id.toUpperCase().substring(0, 3)}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[8px] tracking-wider mb-0.5">Group</span>
                              <span className="text-emerald-450">Group {team.groups || "-"}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[8px] tracking-wider mb-0.5">ISO Code</span>
                              <span className="text-slate-300">{team.iso2 || "-"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EDIT SETTINGS MODAL */}
      {editingGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => setEditingGame(null)}
            className="absolute inset-0 bg-slate-955/80 backdrop-blur-md transition-opacity duration-300"
          ></div>

          {/* Modal Container */}
          <div className="bg-[#050b14] border border-slate-900 rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl z-10 animate-fade-in">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-900/60 bg-slate-955/40">
              <div className="flex items-center gap-2 text-cyan-400">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase text-slate-100 font-mono">
                  Custom Match Settings
                </span>
              </div>
              <button
                onClick={() => setEditingGame(null)}
                className="p-1 rounded-md text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={saveGameSettings}>
              <div className="p-6 space-y-5 h-auto max-h-[70vh] overflow-y-auto">
                {/* Match Info Banner */}
                <div className="bg-[#081324] border border-slate-900/60 p-4 rounded-2xl flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-200">
                      {teamMap[editingGame.home_team_id]?.name_en || editingGame.home_team_name_en || "Home"}
                    </span>
                    <span className="text-slate-500">vs</span>
                    <span className="font-black text-slate-200">
                      {teamMap[editingGame.away_team_id]?.name_en || editingGame.away_team_name_en || "Away"}
                    </span>
                  </div>
                  <span className="bg-slate-955 px-2.5 py-0.5 rounded border border-slate-900 text-[9px] uppercase tracking-wider text-slate-400 font-mono font-bold">
                    ID: #{editingGame.id}
                  </span>
                </div>

                {/* Save Feedback Alerts */}
                {saveMessage.text && (
                  <div
                    className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
                      saveMessage.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {saveMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{saveMessage.text}</span>
                  </div>
                )}

                {/* Field 1: Referral Link */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-500" />
                    Custom Referral Link (Action Button URL)
                  </label>
                  <input
                    type="url"
                    value={referralLink}
                    onChange={(e) => setReferralLink(e.target.value)}
                    placeholder="https://affiliate.example.com/register?match=123"
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-medium transition-all"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed">
                    User redirects to this URL when clicking "SIGN UP & WATCH NOW!" or "UNLOCK HD" inside the watch-stream modal.
                  </p>
                </div>

                {/* Field 2: Modal Image Upload / URL Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                    Custom Modal Banner Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <label className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-xs font-extrabold rounded-xl cursor-pointer text-cyan-400 shrink-0 text-center flex items-center justify-center gap-1.5 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "modal")}
                      />
                    </label>
                    <input
                      type="text"
                      value={modalImage}
                      onChange={(e) => setModalImage(e.target.value)}
                      placeholder="Or paste an image URL..."
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-medium transition-all"
                    />
                  </div>

                  {/* Preview Banner */}
                  {modalImage && (
                    <div className="mt-2.5 relative aspect-video w-full max-w-[280px] rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 shadow-inner group/preview">
                      <img src={modalImage} alt="Modal Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setModalImage("")}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-550 leading-relaxed">
                    This image replaces the standard text contents of the Watch Stream signup modal, displayed as a focal promotional banner.
                  </p>
                </div>

                {/* Field 3: Bg Image Upload / URL Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-500" />
                    Custom Video Backdrop Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <label className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-xs font-extrabold rounded-xl cursor-pointer text-cyan-400 shrink-0 text-center flex items-center justify-center gap-1.5 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, "bg")}
                      />
                    </label>
                    <input
                      type="text"
                      value={bgImage}
                      onChange={(e) => setBgImage(e.target.value)}
                      placeholder="Or paste an image URL..."
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-medium transition-all"
                    />
                  </div>

                  {/* Preview Backdrop */}
                  {bgImage && (
                    <div className="mt-2.5 relative aspect-video w-full max-w-[280px] rounded-2xl overflow-hidden border border-slate-900 bg-slate-950 shadow-inner group/preview">
                      <img src={bgImage} alt="Video Backdrop Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBgImage("")}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black/90 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-550 leading-relaxed">
                    Replaces the default blurred split-flag background behind the golden play button inside the Video Player container.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4.5 bg-slate-955/40 border-t border-slate-900/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingGame(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-900 hover:bg-slate-900 text-xs font-bold text-slate-400 hover:text-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Configuration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
