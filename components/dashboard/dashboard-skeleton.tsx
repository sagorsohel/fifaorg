"use client"

import { Calendar, Trophy, Clock, Users } from "lucide-react"

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Tournament Statistics Cards Skeleton */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, color: "text-cyan-500/30 bg-cyan-500/5" },
          { icon: Trophy, color: "text-emerald-500/30 bg-emerald-500/5" },
          { icon: Clock, color: "text-sky-500/30 bg-sky-500/5" },
          { icon: Users, color: "text-indigo-500/30 bg-indigo-500/5" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 flex items-center justify-between shadow-xs"
          >
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded w-20"></div>
              <div className="h-6 bg-slate-800 rounded w-10"></div>
            </div>
            <div className={`p-3 rounded-xl ${item.color}`}>
              <item.icon className="w-6 h-6 opacity-30" />
            </div>
          </div>
        ))}
      </section>

      {/* Search, Tab switcher & Filter bar skeleton */}
      <section className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-slate-950/20 p-3 rounded-2xl border border-slate-900/60 shadow-inner">
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-900 shrink-0 w-full lg:w-auto gap-1">
          <div className="h-9 bg-slate-900 rounded-lg w-28"></div>
          <div className="h-9 bg-slate-900 rounded-lg w-32"></div>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1 justify-start lg:justify-end w-full lg:w-auto">
          <div className="h-8 bg-slate-950 border border-slate-900 rounded-lg w-32"></div>
          <div className="h-8 bg-slate-950 border border-slate-900 rounded-lg w-36"></div>
          <div className="h-8 bg-slate-950 rounded-lg w-28 sm:w-32"></div>
        </div>
      </section>

      {/* Grouped matches list skeleton */}
      <div className="space-y-10">
        {[1, 2].map((dateIdx) => (
          <div key={dateIdx} className="space-y-4">
            {/* Date Heading Placeholder */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-900/60"></div>
              <div className="h-7 bg-slate-900 rounded-full border border-slate-900 w-48"></div>
              <div className="h-px flex-1 bg-slate-900/60"></div>
            </div>

            {/* Matches grid inside border box */}
            <div className="sm:p-6 p-2 rounded-3xl bg-slate-950/20 border border-slate-900/60 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[1, 2].map((matchIdx) => (
                  <div
                    key={matchIdx}
                    className="bg-slate-900/30 border border-slate-900/60 rounded-2xl p-5 flex flex-col justify-between min-h-[170px]"
                  >
                    {/* Header line */}
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900/40">
                      <div className="h-4 bg-slate-800 rounded w-24"></div>
                      <div className="h-4 bg-slate-800 rounded w-16"></div>
                    </div>

                    {/* Main Team rows */}
                    <div className="flex justify-between items-center my-4 gap-4">
                      {/* Home */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-9 h-6 bg-slate-800 rounded"></div>
                        <div className="h-4 bg-slate-800 rounded w-16 sm:w-24"></div>
                      </div>
                      {/* Mid Time button placeholder */}
                      <div className="h-8 bg-slate-850 rounded-full w-20"></div>
                      {/* Away */}
                      <div className="flex items-center justify-end gap-3 flex-1">
                        <div className="h-4 bg-slate-800 rounded w-16 sm:w-24"></div>
                        <div className="w-9 h-6 bg-slate-800 rounded"></div>
                      </div>
                    </div>

                    {/* Footer line */}
                    <div className="pt-2 border-t border-slate-900/40">
                      <div className="h-3.5 bg-slate-800 rounded w-48"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
