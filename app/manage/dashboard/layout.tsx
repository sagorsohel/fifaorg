"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Trophy,
  LogOut,
  Calendar,
  Users,
  SlidersHorizontal,
  Link as LinkIcon,
  ChevronRight
} from "lucide-react"

import {
  useGetTeamsQuery,
  useGetGamesQuery
} from "@/lib/services/apiSlice"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  // Auth gate check
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

  // Get active view based on pathname
  const activeView = useMemo(() => {
    if (pathname.startsWith("/manage/dashboard/teams")) return "teams"
    if (pathname.startsWith("/manage/dashboard/ads")) return "ads"
    if (pathname.startsWith("/manage/dashboard/referrals")) return "referrals"
    return "matches" // default fallback
  }, [pathname])

  // API Queries for the Stats Banner
  const { data: teamsData } = useGetTeamsQuery(undefined, { skip: !authorized })
  const { data: gamesData } = useGetGamesQuery(undefined, { skip: !authorized })

  // Compute stats
  const stats = useMemo(() => {
    if (!gamesData?.games) return { total: 0, customized: 0, teams: 0 }
    const total = gamesData.games.length
    const customized = gamesData.games.filter((g) => g.referral_link || g.modal_image || g.bg_image).length
    const teamsCount = teamsData?.teams?.length || 0
    return {
      total,
      customized,
      teams: teamsCount
    }
  }, [gamesData, teamsData])

  const handleLogout = () => {
    try {
      localStorage.removeItem("worldcup2026_admin_auth")
      router.push("/manage/login")
    } catch (e) {}
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-955 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-cyan-500 border-l-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex font-sans">
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
            <Link
              href="/manage/dashboard"
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === "matches"
                  ? "bg-slate-900/60 border border-slate-800/80 text-cyan-450 shadow-xs"
                  : "text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                <span>Manage Matches</span>
              </div>
              {activeView === "matches" && <ChevronRight className="w-3.5 h-3.5" />}
            </Link>

            <Link
              href="/manage/dashboard/teams"
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
            </Link>

            <Link
              href="/manage/dashboard/ads"
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
            </Link>

            <Link
              href="/manage/dashboard/referrals"
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
            </Link>
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
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>Matches: {stats.total}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>Customized: {stats.customized}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>Teams: {stats.teams}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
