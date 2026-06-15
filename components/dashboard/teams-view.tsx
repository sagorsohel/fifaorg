"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Team } from "@/lib/services/apiSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedTeamId } from "@/lib/features/uiSlice"
import { translate } from "@/lib/i18n"
import { getImageUrl } from "@/lib/utils"

interface TeamsViewProps {
  teamsGroupedByGroup: Record<string, Team[]>
}

export default function TeamsView({ teamsGroupedByGroup }: TeamsViewProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const lang = useAppSelector((state) => state.ui.language)

  const allGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

  const getTeamName = (team: Team) => {
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

  const getTeamCode = (team: Team) => {
    if (!team) return "TBD"
    return team.fifa_code || team.id.toUpperCase().substring(0, 3)
  }

  return (
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
                    {translate("group", lang)} {groupLetter}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-955 px-2 py-0.5 rounded border border-slate-900">
                    {teams.length} {translate("teams", lang)}
                  </span>
                </div>

                {/* Standings Table */}
                <div className="p-2 overflow-x-auto select-none">
                  <table className="w-full text-left border-collapse text-[10px] sm:text-[11px] font-sans">
                    <thead>
                      <tr className="border-b border-slate-900/60 text-slate-500 font-bold uppercase tracking-wider text-[8px] sm:text-[9px]">
                        <th className="py-2 px-1 text-center w-6 sm:w-8">#</th>
                        <th className="py-2 px-1.5">{translate("team", lang)}</th>
                        <th className="py-2 px-1 text-center w-6 sm:w-8" title="Matches Played">MP</th>
                        <th className="py-2 px-1 text-center w-6 sm:w-8" title="Wins">W</th>
                        <th className="py-2 px-1 text-center w-6 sm:w-8" title="Draws">D</th>
                        <th className="py-2 px-1 text-center w-6 sm:w-8" title="Losses">L</th>
                        <th className="py-2 px-1 text-center w-8 sm:w-10" title="Goal Difference">GD</th>
                        <th className="py-2 px-1 text-center w-8 sm:w-10 font-black text-emerald-400" title="Points">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900/30">
                      {teams.map((team, index) => {
                        const position = index + 1
                        return (
                          <tr
                            key={team._id}
                            onClick={() => {
                              dispatch(setSelectedTeamId(team.id))
                              const slug = team.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
                              router.push(`/team/${slug}`)
                            }}
                            className="hover:bg-slate-900/40 transition-all cursor-pointer group/row"
                            title={getTeamName(team)}
                          >
                            <td className="py-2.5 px-1 text-center font-mono text-slate-505 font-bold">
                              {position}
                            </td>
                            <td className="py-2.5 px-1.5">
                              <div className="flex items-center gap-1.5 sm:gap-2 font-semibold text-slate-200 group-hover/row:text-emerald-400 transition-colors">
                                {team.flag ? (
                                  <div className="relative w-5 h-3.5 overflow-hidden rounded-[3px] border border-slate-900 shrink-0">
                                    <Image
                                      src={getImageUrl(team.flag)}
                                      alt=""
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                ) : (
                                  <span className="text-xs">🏴</span>
                                )}
                                <span className="truncate max-w-[60px] sm:max-w-[120px]">
                                  <span className="sm:hidden">{getTeamCode(team)}</span>
                                  <span className="hidden sm:inline">{getTeamName(team)}</span>
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-400">{team.mp || 0}</td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-400">{team.w || 0}</td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-400">{team.d || 0}</td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-400">{team.l || 0}</td>
                            <td className="py-2.5 px-1 text-center font-mono text-slate-400 font-bold">
                              {Number(team.gd || 0) > 0 ? `+${team.gd}` : team.gd || 0}
                            </td>
                            <td className="py-2.5 px-1 text-center font-mono font-extrabold text-slate-100 group-hover/row:text-emerald-400 transition-colors bg-emerald-500/5">
                              {team.pts || 0}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/10 rounded-2xl border border-slate-900/40">
          <p className="text-slate-505 text-sm">{translate("no_teams", lang)}</p>
        </div>
      )}
    </div>
  )
}
