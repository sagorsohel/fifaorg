"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import {
  Search,
  Edit3,
  X,
  Upload,
  Plus,
  ChevronLeft,
  Users,
  Trash2,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

import {
  useGetTeamsQuery,
  useGetPlayersQuery,
  useSyncSquadMutation,
  useSavePlayerMutation,
  useDeletePlayerMutation,
  Team,
  Player
} from "@/lib/services/apiSlice"
import { getImageUrl } from "@/lib/utils"

export default function ManageTeamsPage() {
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
  const { data: teamsData, isLoading: isTeamsLoading, refetch: refetchTeams } = useGetTeamsQuery(undefined)
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

  // Computed teams list
  const filteredTeams = useMemo(() => {
    if (!teamsData?.teams) return []
    return teamsData.teams.filter((t) => {
      const searchStr = `${t.name_en} ${t.name_fa || ""} ${t.fifa_code} ${t.groups || ""}`.toLowerCase()
      return searchStr.includes(teamSearchQuery.toLowerCase())
    })
  }, [teamsData, teamSearchQuery])

  return (
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
                  <Image src={getImageUrl(selectedTeamForSquad.flag)} alt="" fill className="object-cover" unoptimized />
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
              className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 font-sans ${syncSquadMessage.type === "success"
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
                        <img src={getImageUrl(player.picture_url)} alt="" className="w-full h-full object-cover font-sans" />
                      ) : (
                        <span className="text-xs font-black text-slate-600">{player.name.substring(0, 2).toUpperCase()}</span>
                      )}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/photo:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                        <Upload className="w-4 h-4 text-cyan-405" />
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
                            <Image src={getImageUrl(team.flag)} alt="" fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-10 h-7 bg-slate-900 rounded shrink-0 flex items-center justify-center text-xs">🏴</div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-slate-202 text-xs truncate">{team.name_en}</h4>
                          <p className="text-[9px] text-slate-550 font-semibold truncate font-sans">{team.name_fa || "-"}</p>
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
                    className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${playerSaveMessage.type === "success"
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
