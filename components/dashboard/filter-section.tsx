"use client"

import { useRef, useEffect, useState } from "react"
import { Search, Calendar, Users, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import {
  setSearchQuery,
  setFilterStatus,
  setActiveTab,
  setSelectedGroup,
  resetFilters,
} from "@/lib/features/uiSlice"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { translate } from "@/lib/i18n"

export default function FilterSection() {
  const dispatch = useAppDispatch()

  const lang = useAppSelector((state) => state.ui.language)
  const searchQuery = useAppSelector((state) => state.ui.searchQuery)
  const filterStatus = useAppSelector((state) => state.ui.filterStatus)
  const activeTab = useAppSelector((state) => state.ui.activeTab)
  const selectedGroup = useAppSelector((state) => state.ui.selectedGroup)

  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (el) {
      const canScrollLeft = el.scrollLeft > 2
      const canScrollRight = el.scrollLeft < el.scrollWidth - el.clientWidth - 2
      setShowLeftArrow(canScrollLeft)
      setShowRightArrow(canScrollRight)
    }
  }

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      checkScroll()
      el.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
      return () => {
        el.removeEventListener("scroll", checkScroll)
        window.removeEventListener("resize", checkScroll)
      }
    }
  }, [activeTab])

  useEffect(() => {
    checkScroll()
  }, [selectedGroup, activeTab])

  const stages = [
    { id: "all", label: translate("all_matches", lang) },
    { id: "R32", label: translate("round_32", lang) },
    { id: "R16", label: translate("round_16", lang) },
    { id: "QF", label: translate("quarter_finals", lang) },
    { id: "SF", label: translate("semi_finals", lang) },
    { id: "3RD", label: translate("third_place", lang) },
    { id: "FINAL", label: translate("final", lang) },
  ]

  return (
    <section className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3 bg-slate-955/20 p-3 rounded-2xl border border-slate-900/60 shadow-inner">
      {/* Left Side: Tabs */}
      <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-900 shrink-0 w-full lg:w-auto">
        <button
          onClick={() => dispatch(setActiveTab("matches"))}
          className={`flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "matches"
            ? "bg-linear-to-r from-cyan-500 to-cyan-600 text-slate-950 shadow-md font-bold"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          {translate("matches", lang)}
        </button>
        <button
          onClick={() => dispatch(setActiveTab("teams"))}
          className={`flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 py-2 lg:px-6 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${activeTab === "teams"
            ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md font-bold"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
          {translate("teams_groups", lang)}
        </button>
      </div>

      {/* Right Side: Unified Filters and Search */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 flex-1 justify-start lg:justify-end w-full lg:w-auto">
        {activeTab === "matches" && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="hidden sm:inline-flex text-xs text-slate-400 items-center gap-1 shrink-0 font-sans">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
              {translate("filter_matches", lang)}
            </span>

            {/* Status Selector Dropdown */}
            <div className="flex z-20 flex-1 sm:flex-none">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 px-3 py-2 sm:py-1.5 rounded-lg hover:border-cyan-500/30 focus:outline-hidden transition-all cursor-pointer shadow-xs flex items-center justify-between sm:justify-start gap-1.5 capitalize">
                  <span>
                    {filterStatus === "all"
                      ? translate("all_matches", lang)
                      : filterStatus === "finished"
                        ? translate("finished", lang)
                        : translate("upcoming", lang)}
                  </span>
                  <span className="text-[10px] text-slate-500">▼</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl min-w-[120px] shadow-xl p-1 z-50">
                  {(["all", "finished", "upcoming"] as const).map((status) => (
                    <DropdownMenuItem
                      key={status}
                      onClick={() => dispatch(setFilterStatus(status))}
                      className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${filterStatus === status ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300"
                        }`}
                    >
                      {status === "all"
                        ? translate("all_matches", lang)
                        : status === "finished"
                          ? translate("finished", lang)
                          : translate("upcoming", lang)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <span className="hidden sm:inline-flex text-xs text-slate-400 font-bold uppercase tracking-wider items-center gap-1 ml-1 shrink-0 font-sans">
              {translate("select_group_stage", lang)}
            </span>

            {/* Stage Selector (Desktop Dropdown) */}
            <div className="hidden sm:flex z-20 flex-1 sm:flex-none animate-fade-in">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full sm:w-auto bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 px-3 py-2 sm:py-1.5 rounded-lg hover:border-cyan-500/30 focus:outline-hidden transition-all cursor-pointer shadow-xs flex items-center justify-between sm:justify-start gap-1.5 capitalize">
                  <span className="truncate max-w-[110px] sm:max-w-none">
                    {stages.find((s) => s.id === selectedGroup)?.label || translate("all_matches", lang)}
                  </span>
                  <span className="text-[10px] text-slate-500">▼</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl min-w-[200px] max-h-[300px] overflow-y-auto shadow-xl p-1 z-50 font-sans">
                  {stages.map((stage) => {
                    const isSelected = selectedGroup === stage.id
                    return (
                      <DropdownMenuItem
                        key={stage.id}
                        onClick={() => dispatch(setSelectedGroup(stage.id))}
                        className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${isSelected ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300"
                          }`}
                      >
                        {stage.label}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stage Selector (Mobile Scrollable list) */}
            <div className="relative flex sm:hidden w-full items-center">
              {showLeftArrow && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    scrollRef.current?.scrollBy({ left: -120, behavior: "smooth" })
                  }}
                  className="absolute left-0 z-10 p-1.5 rounded-full bg-slate-950/95 border border-slate-800 shadow-md text-cyan-400 focus:outline-hidden hover:bg-slate-900 active:scale-90 transition-transform cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              )}

              <div
                ref={scrollRef}
                onScroll={checkScroll}
                className="flex overflow-x-auto flex-nowrap w-full gap-1.5 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
              >
                {stages.map((stage) => {
                  const isSelected = selectedGroup === stage.id
                  return (
                    <button
                      key={stage.id}
                      onClick={() => dispatch(setSelectedGroup(stage.id))}
                      className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border shrink-0 ${isSelected
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-xs"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      {stage.label}
                    </button>
                  )
                })}
              </div>

              {showRightArrow && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" })
                  }}
                  className="absolute right-0 z-10 p-1.5 rounded-full bg-slate-950/95 border border-slate-800 shadow-md text-cyan-400 focus:outline-hidden hover:bg-slate-900 active:scale-90 transition-transform cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reset Filters button */}
            {(searchQuery || filterStatus !== "all" || selectedGroup !== "all") && (
              <button
                onClick={() => dispatch(resetFilters())}
                className="text-xs text-cyan-500 hover:text-cyan-400 font-semibold flex items-center gap-1 bg-cyan-500/5 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/30 transition-all cursor-pointer shrink-0 font-sans"
              >
                {translate("clear_filters", lang)}
              </button>
            )}
          </div>
        )}

        {/* Search Box */}
        <div className="relative w-full sm:w-28 shrink-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder={translate("search_placeholder", lang)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-950 rounded-lg border border-slate-900 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 text-xs outline-hidden transition-all placeholder:text-slate-500 h-8"
          />
        </div>
      </div>
    </section>
  )
}
