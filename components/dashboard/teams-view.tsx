"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Team } from "@/lib/services/apiSlice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setSelectedTeamId } from "@/lib/features/uiSlice"
import { translate } from "@/lib/i18n"

interface TeamsViewProps {
  teamsGroupedByGroup: Record<string, Team[]>
}

export default function TeamsView({ teamsGroupedByGroup }: TeamsViewProps) {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)

  const allGroupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

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

                {/* Teams List */}
                <div className="p-4 divide-y divide-slate-900/40">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      onClick={() => {
                        dispatch(setSelectedTeamId(team.id))
                      }}
                      className="flex items-center justify-between py-3 px-1 hover:bg-slate-900/50 rounded-xl transition-all cursor-pointer group"
                      title={team.name_en}
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
          <p className="text-slate-505 text-sm">{translate("no_teams", lang)}</p>
        </div>
      )}
    </div>
  )
}
