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
  Info,
  Trash2,
  Plus,
  ChevronLeft
} from "lucide-react"

import {
  useGetTeamsQuery,
  useGetGamesQuery,
  useGetStadiumsQuery,
  getGameSlug,
  Game,
  Team,
  Player,
  useGetPlayersQuery,
  useSyncSquadMutation,
  useSavePlayerMutation,
  useDeletePlayerMutation
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
  const [activeView, setActiveView] = useState<"matches" | "teams" | "ads" | "referrals">("matches")

  // Ads Control State
  const [heroAds, setHeroAds] = useState("")
  const [hero2Ads, setHero2Ads] = useState("")
  const [modalAds, setModalAds] = useState("")
  const [headerAds, setHeaderAds] = useState("")
  const [adsSaving, setAdsSaving] = useState(false)
  const [adsMessage, setAdsMessage] = useState({ text: "", type: "success" })

  // Referral links state
  const [membershipRefLink, setMembershipRefLink] = useState("")
  const [signinRefLink, setSigninRefLink] = useState("")
  const [referralsSaving, setReferralsSaving] = useState(false)
  const [referralsMessage, setReferralsMessage] = useState({ text: "", type: "success" })

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

  // Squad Management State
  const [selectedTeamForSquad, setSelectedTeamForSquad] = useState<Team | null>(null)
  const [squadFifaTeamId, setSquadFifaTeamId] = useState("")
  const [isSyncingSquad, setIsSyncingSquad] = useState(false)
  const [syncSquadMessage, setSyncSquadMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // Player Form / Editing States
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [playerFormName, setPlayerFormName] = useState("")
  const [playerFormJersey, setPlayerFormJersey] = useState("")
  const [playerFormPosition, setPlayerFormPosition] = useState("Goalkeeper")
  const [playerFormWeight, setPlayerFormWeight] = useState("")
  const [playerFormHeight, setPlayerFormHeight] = useState("")
  const [playerFormPicture, setPlayerFormPicture] = useState("")
  const [playerFormFifaId, setPlayerFormFifaId] = useState("")
  const [isSavingPlayer, setIsSavingPlayer] = useState(false)
  const [playerSaveMessage, setPlayerSaveMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  // API Queries & Mutations
  const { data: squadData, isLoading: isSquadLoading, refetch: refetchSquad } = useGetPlayersQuery(
    selectedTeamForSquad?.id || "",
    { skip: !selectedTeamForSquad }
  )
  const [syncSquadMutation] = useSyncSquadMutation()
  const [savePlayerMutation] = useSavePlayerMutation()
  const [deletePlayerMutation] = useDeletePlayerMutation()

  // Pre-fill FIFA ID input when a team is selected
  useEffect(() => {
    if (selectedTeamForSquad) {
      setSquadFifaTeamId(selectedTeamForSquad.fifa_team_id || "")
      setSyncSquadMessage(null)
    }
  }, [selectedTeamForSquad])

  // Sync Squad from FIFA API
  const handleSyncSquad = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeamForSquad || !squadFifaTeamId) return

    setIsSyncingSquad(true)
    setSyncSquadMessage(null)

    try {
      const res = await syncSquadMutation({
        fifa_team_id: squadFifaTeamId,
        team_id: selectedTeamForSquad.id
      }).unwrap()

      if (res.success) {
        setSyncSquadMessage({
          text: res.message || `Squad synced successfully! Added ${res.stats.added}, Updated ${res.stats.updated} players.`,
          type: "success"
        })
        refetchSquad()
        refetchTeams()
      } else {
        setSyncSquadMessage({ text: res.error || "Failed to sync squad.", type: "error" })
      }
    } catch (err: any) {
      setSyncSquadMessage({ text: err.data?.error || err.message || "Network error during squad sync.", type: "error" })
    } finally {
      setIsSyncingSquad(false)
    }
  }

  // Open player create/edit modal
  const handleOpenPlayerModal = (player: Player | null) => {
    if (player) {
      setEditingPlayer(player)
      setPlayerFormName(player.name)
      setPlayerFormJersey(player.jersey_num !== null ? player.jersey_num.toString() : "")
      setPlayerFormPosition(player.position || "Goalkeeper")
      setPlayerFormWeight(player.weight !== null ? player.weight.toString() : "")
      setPlayerFormHeight(player.height !== null ? player.height.toString() : "")
      setPlayerFormPicture(player.picture_url || "")
      setPlayerFormFifaId(player.fifa_id || "")
    } else {
      setEditingPlayer({
        id: "",
        team_id: selectedTeamForSquad?.id || "",
        name: "",
        jersey_num: null,
        position: "Goalkeeper",
        weight: null,
        height: null,
        picture_url: "",
        fifa_id: ""
      })
      setPlayerFormName("")
      setPlayerFormJersey("")
      setPlayerFormPosition("Goalkeeper")
      setPlayerFormWeight("")
      setPlayerFormHeight("")
      setPlayerFormPicture("")
      setPlayerFormFifaId("")
    }
    setPlayerSaveMessage(null)
  }

  // Save manual player details (create/edit)
  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPlayer || !selectedTeamForSquad) return

    setIsSavingPlayer(true)
    setPlayerSaveMessage(null)

    try {
      const res = await savePlayerMutation({
        id: editingPlayer.id || undefined,
        team_id: selectedTeamForSquad.id,
        name: playerFormName,
        jersey_num: playerFormJersey ? parseInt(playerFormJersey, 10) : null,
        position: playerFormPosition,
        weight: playerFormWeight ? parseFloat(playerFormWeight) : null,
        height: playerFormHeight ? parseFloat(playerFormHeight) : null,
        picture_url: playerFormPicture || null,
        fifa_id: playerFormFifaId || null,
      }).unwrap()

      if (res.success) {
        setPlayerSaveMessage({ text: res.message || "Player record saved successfully!", type: "success" })
        refetchSquad()
        setTimeout(() => {
          setEditingPlayer(null)
        }, 800)
      } else {
        setPlayerSaveMessage({ text: res.error || "Failed to save player.", type: "error" })
      }
    } catch (err: any) {
      setPlayerSaveMessage({ text: err.data?.error || err.message || "Network error.", type: "error" })
    } finally {
      setIsSavingPlayer(false)
    }
  }

  // Delete squad player
  const handleDeletePlayer = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this player from the squad?")) return

    try {
      const res = await deletePlayerMutation(id).unwrap()
      if (res.success) {
        refetchSquad()
      } else {
        alert(res.error || "Failed to delete player.")
      }
    } catch (err: any) {
      alert(err.message || "Network error deleting player.")
    }
  }

  // Handle uploading player photo directly from the squad list view
  const handlePlayerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, player: Player) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/manage/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        await savePlayerMutation({
          ...player,
          picture_url: data.url
        }).unwrap()
        refetchSquad()
      } else {
        alert(data.error || "Failed to upload image.")
      }
    } catch (err: any) {
      alert(err.message || "Network error uploading image.")
    }
  }

  // Handle uploading player image from inside the edit modal
  const handlePlayerModalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/manage/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setPlayerFormPicture(data.url)
      } else {
        alert(data.error || "Failed to upload image.")
      }
    } catch (err: any) {
      alert(err.message || "Network error uploading image.")
    }
  }

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

  // Fetch Ads settings
  useEffect(() => {
    if (!authorized) return
    fetch("/api/manage/ads")
      .then(res => res.json())
      .then(data => {
        if (data && data.ads) {
          setHeroAds(data.ads.hero_ads || "")
          setHero2Ads(data.ads.hero2_ads || "")
          setModalAds(data.ads.modal_ads || "")
          setHeaderAds(data.ads.header_ads || "")
          setMembershipRefLink(data.ads.membership_ref_link || "")
          setSigninRefLink(data.ads.signin_ref_link || "")
        }
      })
      .catch(() => {})
  }, [authorized])

  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdsSaving(true)
    setAdsMessage({ text: "", type: "success" })

    try {
      const res = await fetch("/api/manage/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_ads: heroAds,
          hero2_ads: hero2Ads,
          modal_ads: modalAds,
          header_ads: headerAds,
          membership_ref_link: membershipRefLink,
          signin_ref_link: signinRefLink
        })
      })
      if (res.ok) {
        setAdsMessage({ text: "Ads configurations saved successfully!", type: "success" })
      } else {
        setAdsMessage({ text: "Failed to save ads configuration.", type: "error" })
      }
    } catch (err: any) {
      setAdsMessage({ text: err.message || "Network error.", type: "error" })
    } finally {
      setAdsSaving(false)
    }
  }

  const handleSaveReferrals = async (e: React.FormEvent) => {
    e.preventDefault()
    setReferralsSaving(true)
    setReferralsMessage({ text: "", type: "success" })

    try {
      const res = await fetch("/api/manage/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hero_ads: heroAds,
          hero2_ads: hero2Ads,
          modal_ads: modalAds,
          header_ads: headerAds,
          membership_ref_link: membershipRefLink,
          signin_ref_link: signinRefLink
        })
      })
      if (res.ok) {
        setReferralsMessage({ text: "Referral links saved successfully!", type: "success" })
      } else {
        setReferralsMessage({ text: "Failed to save referral links.", type: "error" })
      }
    } catch (err: any) {
      setReferralsMessage({ text: err.message || "Network error.", type: "error" })
    } finally {
      setReferralsSaving(false)
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

            <button
              onClick={() => setActiveView("ads")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "ads"
                  ? "bg-slate-900/60 border border-slate-800/80 text-cyan-455 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Ads Control</span>
              </div>
              {activeView === "ads" && <ChevronRight className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setActiveView("referrals")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "referrals"
                  ? "bg-slate-900/60 border border-slate-800/80 text-cyan-455 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4" />
                <span>Referral Links</span>
              </div>
              {activeView === "referrals" && <ChevronRight className="w-3.5 h-3.5" />}
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

                            const isFinished = match.finished.toUpperCase() === "TRUE"
                            const gameDate = parseStadiumLocalDate(match.local_date, match.stadium_id)
                            const hasStarted = Date.now() >= gameDate.getTime()
                            const isLive = !!(match.time_elapsed && match.time_elapsed !== "" && match.time_elapsed !== "null")
                            const shouldShowScore = isFinished || isLive

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
                                  <div className="px-3 shrink-0 flex flex-col items-center gap-1">
                                    {shouldShowScore ? (
                                      <>
                                        <span className="font-mono font-extrabold text-slate-450 bg-slate-950 border border-slate-900 px-3 py-0.5 rounded text-xs">
                                          {match.home_score} : {match.away_score}
                                        </span>
                                        {isLive && match.time_elapsed && (
                                          <span className="text-[8px] font-bold text-red-500 bg-red-500/10 px-1 py-0.2 rounded border border-red-500/20 uppercase tracking-widest font-mono animate-pulse">
                                            {match.time_elapsed}
                                          </span>
                                        )}
                                      </>
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
              {selectedTeamForSquad ? (
                /* SQUAD MANAGER SUB-VIEW */
                <div className="space-y-6 animate-fade-in">
                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedTeamForSquad(null)
                        refetchTeams()
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-colors shadow-xs cursor-pointer text-slate-300 font-sans"
                    >
                      <ChevronLeft className="w-4 h-4 text-cyan-500" />
                      <span>Back to Teams</span>
                    </button>
                    
                    <button
                      onClick={() => handleOpenPlayerModal(null)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-slate-955 text-xs font-black shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all cursor-pointer font-sans"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Player</span>
                    </button>
                  </div>

                  {/* Team details & Sync card */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-slate-900/60 to-slate-955/60 border border-slate-900 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center gap-4 z-10">
                      {selectedTeamForSquad.flag ? (
                        <div className="relative w-20 h-14 overflow-hidden rounded-xl border border-slate-800 shadow-lg shrink-0">
                          <Image src={selectedTeamForSquad.flag} alt="" fill className="object-cover" unoptimized />
                        </div>
                      ) : (
                        <div className="w-20 h-14 bg-slate-900 rounded-xl shrink-0 flex items-center justify-center text-xl">🏴</div>
                      )}
                      <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-slate-100 font-sans">
                          {selectedTeamForSquad.name_en} Squad
                        </h2>
                        <p className="text-xs text-slate-400 mt-1 font-sans">
                          Code: {selectedTeamForSquad.fifa_code} | Group: {selectedTeamForSquad.groups} | Synced FIFA ID: {selectedTeamForSquad.fifa_team_id || "None"}
                        </p>
                      </div>
                    </div>

                    {/* Sync form */}
                    <form onSubmit={handleSyncSquad} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 bg-slate-950/80 border border-slate-900 p-4 rounded-2xl max-w-md w-full shrink-0 font-sans">
                      <div className="flex-1 space-y-1">
                        <label className="text-[9px] uppercase tracking-wider font-bold text-slate-450 block font-mono">FIFA API Team ID</label>
                        <input
                          type="text"
                          value={squadFifaTeamId}
                          onChange={(e) => setSquadFifaTeamId(e.target.value)}
                          placeholder="e.g. 43922 (Argentina)"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSyncingSquad || !squadFifaTeamId}
                        className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-505 disabled:opacity-50 text-slate-955 text-xs font-black rounded-xl cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5 shrink-0 self-end"
                      >
                        {isSyncingSquad ? (
                          <>
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-t-slate-955 border-r-transparent border-b-slate-955 border-l-transparent animate-spin"></div>
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Sync Squad</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>

                  {/* Sync status message */}
                  {syncSquadMessage && (
                    <div
                      className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 font-sans ${
                        syncSquadMessage.type === "success"
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-red-500/10 border-red-500/20 text-red-400"
                      }`}
                    >
                      {syncSquadMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                      <span>{syncSquadMessage.text}</span>
                    </div>
                  )}

                  {/* Squad List */}
                  {isSquadLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 font-sans">
                      <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Loading squad players...</span>
                    </div>
                  ) : !squadData?.players || squadData.players.length === 0 ? (
                    <div className="py-20 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 text-xs font-sans">
                      <span className="text-xl">🤷‍♂️</span>
                      <span className="font-bold uppercase tracking-wider text-slate-400">No players found in this squad.</span>
                      <span className="text-slate-600">Enter a FIFA Team ID and click Sync, or add players manually.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 font-sans">
                      {squadData.players.map((player) => (
                        <div
                          key={player.id}
                          className="p-4 bg-slate-905/20 border border-slate-905 hover:bg-slate-905/30 transition-all rounded-2xl shadow-xs flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Photo and Upload trigger */}
                            <div className="relative w-12 h-12 rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 group/photo cursor-pointer" title="Click to upload custom picture">
                              {player.picture_url ? (
                                <img src={player.picture_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-black text-slate-600">{player.name.substring(0, 2).toUpperCase()}</span>
                              )}
                              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                <Upload className="w-4 h-4 text-cyan-400" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handlePlayerPhotoUpload(e, player)}
                                />
                              </label>
                            </div>

                            {/* Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                {player.jersey_num !== null && (
                                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-mono text-[9px] font-black leading-none">
                                    #{player.jersey_num}
                                  </span>
                                )}
                                <h4 className="font-extrabold text-slate-205 text-xs truncate" title={player.name}>{player.name}</h4>
                              </div>
                              <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">{player.position || "Unknown"}</p>
                              {(player.height || player.weight) && (
                                <p className="text-[9px] font-mono text-slate-550 mt-1 font-bold">
                                  {player.height ? `${player.height} cm` : "-"} / {player.weight ? `${player.weight} kg` : "-"}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleOpenPlayerModal(player)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-cyan-500/30 text-cyan-455 hover:text-cyan-400 transition-colors cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlayer(player.id)}
                              className="p-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-red-500/30 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Player"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* STANDARD TEAMS LISTING */
                <>
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
                                  <h4 className="font-extrabold text-slate-202 text-xs truncate">{team.name_en}</h4>
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

                              {/* Manage Squad button */}
                              <div className="border-t border-slate-900/40 pt-3 flex justify-end">
                                <button
                                  onClick={() => setSelectedTeamForSquad(team)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-900 hover:border-cyan-500/40 text-cyan-455 hover:text-cyan-400 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                                >
                                  <Users className="w-3.5 h-3.5 text-cyan-500" />
                                  <span>Manage Squad</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* VIEW 3: ADS CONTROL */}
          {activeView === "ads" && (
            <div className="space-y-6 max-w-4xl">
              {/* Header */}
              <div className="bg-slate-905/20 border border-slate-905 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                    <SlidersHorizontal className="w-5 h-5 text-slate-955" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-100">Global Ads Configuration</h3>
                    <p className="text-xs text-slate-500 font-medium">Inject advertisement or tracking scripts dynamically into header, hero, or modal spots.</p>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <form onSubmit={handleSaveAds} className="bg-[#050b14] border border-slate-900 rounded-3xl p-6 space-y-6 shadow-xl">
                {adsMessage.text && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                      adsMessage.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {adsMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{adsMessage.text}</span>
                  </div>
                )}

                {/* Header Ads Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Header Ads (Script / HTML Code)
                  </label>
                  <textarea
                    value={headerAds}
                    onChange={(e) => setHeaderAds(e.target.value)}
                    placeholder="<!-- Paste Google AdSense or other header ad scripts here -->"
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This script renders at the very top of the match details and homepage views (header section).
                  </p>
                </div>

                {/* Hero Ads Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Hero Ads (Script / HTML Code)
                  </label>
                  <textarea
                    value={heroAds}
                    onChange={(e) => setHeroAds(e.target.value)}
                    placeholder="<!-- Paste banner script or custom HTML here -->"
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This script renders in the primary hero slot, directly below/above the score banner.
                  </p>
                </div>

                {/* Hero2 Ads Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Hero2 Ads (Script / HTML Code)
                  </label>
                  <textarea
                    value={hero2Ads}
                    onChange={(e) => setHero2Ads(e.target.value)}
                    placeholder="<!-- Paste second banner script or custom HTML here -->"
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This script renders in the secondary hero slot, directly below the first Hero Ads slot.
                  </p>
                </div>

                {/* Modal Ads Input */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Modal / Player Ads (Script / HTML Code)
                  </label>
                  <textarea
                    value={modalAds}
                    onChange={(e) => setModalAds(e.target.value)}
                    placeholder="<!-- Paste modal or player ad scripts here -->"
                    rows={6}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This script is injected inside the Stream Player box inline signup container.
                  </p>
                </div>

                {/* Save button */}
                <div className="pt-2 border-t border-slate-900/60 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={adsSaving}
                    className="px-6 py-3 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 font-sans"
                  >
                    {adsSaving ? "Saving..." : "Save Configuration"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW 4: REFERRAL LINKS CONTROL */}
          {activeView === "referrals" && (
            <div className="space-y-6 max-w-4xl animate-fade-in">
              {/* Header */}
              <div className="bg-slate-905/20 border border-slate-905 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                    <LinkIcon className="w-5 h-5 text-slate-955" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-100">Global Referral Links Configuration</h3>
                    <p className="text-xs text-slate-505 font-medium">Configure global signup and membership redirection URLs.</p>
                  </div>
                </div>
              </div>

              {/* Form Card */}
              <form onSubmit={handleSaveReferrals} className="bg-[#050b14] border border-slate-900 rounded-3xl p-6 space-y-6 shadow-xl">
                {referralsMessage.text && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                      referralsMessage.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    }`}
                  >
                    {referralsMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{referralsMessage.text}</span>
                  </div>
                )}

                {/* Membership Referral Link */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Membership Referral Link
                  </label>
                  <input
                    type="url"
                    value={membershipRefLink}
                    onChange={(e) => setMembershipRefLink(e.target.value)}
                    placeholder="https://affiliate.example.com/membership"
                    className="w-full bg-slate-955 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This link is used by the "Member/Membership" button in the header navbar. If left empty, it will fall back to the match-specific referral link or the default signup URL.
                  </p>
                </div>

                {/* Sign In Referral Link */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                    Sign In Referral Link
                  </label>
                  <input
                    type="url"
                    value={signinRefLink}
                    onChange={(e) => setSigninRefLink(e.target.value)}
                    placeholder="https://affiliate.example.com/register"
                    className="w-full bg-slate-955 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
                  />
                  <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
                    This link is used for player box sign-in prompts and stream unlock modals. If left empty, it will fall back to the match-specific referral link or the default signup URL.
                  </p>
                </div>

                {/* Save button */}
                <div className="pt-2 border-t border-slate-900/60 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={referralsSaving}
                    className="px-6 py-3 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 font-sans"
                  >
                    {referralsSaving ? "Saving..." : "Save Configuration"}
                  </button>
                </div>
              </form>
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

      {/* EDIT PLAYER MODAL */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setEditingPlayer(null)}
            className="absolute inset-0 bg-slate-955/80 backdrop-blur-md transition-opacity duration-300"
          ></div>

          <div className="bg-[#050b14] border border-slate-900 rounded-3xl w-full max-w-md overflow-hidden relative shadow-2xl z-10 animate-fade-in font-sans">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-900/60 bg-slate-955/40">
              <div className="flex items-center gap-2 text-cyan-400">
                <Users className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wider uppercase text-slate-100 font-mono">
                  {editingPlayer.id ? "Edit Player Details" : "Add Squad Player"}
                </span>
              </div>
              <button
                onClick={() => setEditingPlayer(null)}
                className="p-1 rounded-md text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSavePlayer}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {playerSaveMessage && (
                  <div
                    className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                      playerSaveMessage.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-450"
                        : "bg-red-500/10 border-red-500/20 text-red-450"
                    }`}
                  >
                    {playerSaveMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                    <span>{playerSaveMessage.text}</span>
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={playerFormName}
                    onChange={(e) => setPlayerFormName(e.target.value)}
                    placeholder="e.g. Lionel Messi"
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                  />
                </div>

                {/* Grid fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Jersey */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Jersey Number</label>
                    <input
                      type="number"
                      value={playerFormJersey}
                      onChange={(e) => setPlayerFormJersey(e.target.value)}
                      placeholder="10"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Position */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Position</label>
                    <select
                      value={playerFormPosition}
                      onChange={(e) => setPlayerFormPosition(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50 cursor-pointer"
                    >
                      <option value="Goalkeeper">Goalkeeper</option>
                      <option value="Defender">Defender</option>
                      <option value="Midfielder">Midfielder</option>
                      <option value="Forward">Forward</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Height (cm)</label>
                    <input
                      type="number"
                      step="any"
                      value={playerFormHeight}
                      onChange={(e) => setPlayerFormHeight(e.target.value)}
                      placeholder="170"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Weight (kg)</label>
                    <input
                      type="number"
                      step="any"
                      value={playerFormWeight}
                      onChange={(e) => setPlayerFormWeight(e.target.value)}
                      placeholder="72"
                      className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                {/* Picture URL & Upload */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">Player Photo URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={playerFormPicture}
                      onChange={(e) => setPlayerFormPicture(e.target.value)}
                      placeholder="https://image-path.png"
                      className="flex-1 bg-slate-955 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                    />
                    <label className="px-3 py-2 bg-slate-900 border border-slate-800 text-[10px] font-black text-cyan-405 rounded-xl cursor-pointer hover:bg-slate-850 transition-colors flex items-center justify-center gap-1 shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePlayerModalImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* FIFA ID */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block font-mono">FIFA API Player ID</label>
                  <input
                    type="text"
                    value={playerFormFifaId}
                    onChange={(e) => setPlayerFormFifaId(e.target.value)}
                    placeholder="e.g. 229397"
                    className="w-full bg-slate-955 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-hidden focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4.5 bg-slate-955/40 border-t border-slate-900/60 flex items-center justify-end gap-3 font-sans">
                <button
                  type="button"
                  onClick={() => setEditingPlayer(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-900 hover:bg-slate-900 text-xs font-bold text-slate-450 hover:text-slate-300 transition-all cursor-pointer font-sans"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlayer}
                  className="px-5 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 font-sans"
                >
                  {isSavingPlayer ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
