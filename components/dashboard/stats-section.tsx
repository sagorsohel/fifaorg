"use client"

import { Calendar, Trophy, Clock, Users } from "lucide-react"
import { LanguageCode, translate } from "@/lib/i18n"

interface StatsSectionProps {
  stats: {
    total: number
    played: number
    remaining: number
  }
  teamsCount: number
  lang: LanguageCode
}

export default function StatsSection({ stats, teamsCount, lang }: StatsSectionProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
        <div>
          <p className="text-xs text-slate-400 font-medium">{translate("total_matches", lang)}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-100">{stats.total}</h3>
        </div>
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
          <Calendar className="w-6 h-6" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
        <div>
          <p className="text-xs text-slate-400 font-medium">{translate("played", lang)}</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-400">{stats.played}</h3>
        </div>
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
          <Trophy className="w-6 h-6" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
        <div>
          <p className="text-xs text-slate-400 font-medium">{translate("upcoming", lang)}</p>
          <h3 className="text-2xl font-bold mt-1 text-sky-400">{stats.remaining}</h3>
        </div>
        <div className="p-3 bg-sky-500/10 rounded-xl text-sky-500">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs hover:border-slate-800 transition-all duration-300">
        <div>
          <p className="text-xs text-slate-400 font-medium">{translate("teams", lang)}</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-100">{teamsCount}</h3>
        </div>
        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
          <Users className="w-6 h-6" />
        </div>
      </div>
    </section>
  )
}
