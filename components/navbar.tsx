"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Trophy, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setLanguage } from "@/lib/features/uiSlice"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { LANGUAGES, translate } from "@/lib/i18n"
import { useGetGamesQuery, getGameSlug } from "@/lib/services/apiSlice"

const MEMBERSHIP_TRANSLATIONS: Record<string, string> = {
  en: "Membership",
  "en-us": "Membership",
  ar: "العضوية",
  az: "Üzvlük",
  bn: "সদস্যপদ",
  cs: "Členství",
  da: "Medlemskab",
  de: "Mitgliedschaft",
  el: "Συνδρομή",
  es: "Membresía",
  "es-la": "Membresía",
  fr: "Adhésion",
  hi: "सदस्यता",
  hr: "Članstvo",
  hu: "Tagság",
  id: "Keanggotaan",
  it: "Iscrizione",
  nl: "Lidmaatschap",
  no: "Medlemskap",
  pl: "Członkostwo",
  pt: "Associação",
  "pt-pt": "Adesão",
  ro: "Abonament",
  ru: "Членство",
  sk: "Členstvo",
  sl: "Članstvo",
  sr: "Чланство",
  sv: "Medlemskap",
  tr: "Üyelik",
  zh: "会员"
}

function AdScriptContainer({ scriptHtml, className }: { scriptHtml?: string; className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!scriptHtml || !mounted) return null

  // Attempt to parse width and height from the ad configuration (e.g. from atOptions)
  const widthMatch = scriptHtml.match(/'width'\s*:\s*(\d+)/) || scriptHtml.match(/"width"\s*:\s*(\d+)/)
  const heightMatch = scriptHtml.match(/'height'\s*:\s*(\d+)/) || scriptHtml.match(/"height"\s*:\s*(\d+)/)

  const width = widthMatch ? parseInt(widthMatch[1], 10) : 320
  const height = heightMatch ? parseInt(heightMatch[1], 10) : 50

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: transparent;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${scriptHtml}
      </body>
    </html>
  `

  return (
    <div className={`${className} flex justify-center items-center overflow-hidden`}>
      <iframe
        srcDoc={iframeSrcDoc}
        width={width}
        height={height}
        style={{ border: "none", overflow: "hidden", background: "transparent" }}
        scrolling="no"
        title="Ad Space"
      />
    </div>
  )
}

export function Navbar() {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((state) => state.ui.language)
  const pathname = usePathname()
  const { data: gamesData } = useGetGamesQuery()
  const [adsConfig, setAdsConfig] = useState<{
    hero_ads?: string
  } | null>(null)

  useEffect(() => {
    fetch("/api/manage/ads")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.ads) {
          setAdsConfig(data.ads)
        }
      })
      .catch(() => { })
  }, [])

  const referralLink = (() => {
    const defaultLink = "https://lightsalmon-hummingbird-478538.hostingersite.com/register"
    if (!pathname) return defaultLink

    const matchMatch = pathname.match(/^\/match\/([^/]+)/)
    if (matchMatch && gamesData?.games) {
      const slug = matchMatch[1]
      const game = gamesData.games.find(
        (g) => g._id === slug || g.id === slug || g.slug === slug || getGameSlug(g) === slug
      )
      if (game && game.referral_link) {
        return game.referral_link
      }
    }
    return defaultLink
  })()

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-955/80 backdrop-blur-md border-b border-slate-900 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer select-none shrink-0">
            <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15 group-hover:scale-[1.03] transition-transform duration-300 shrink-0 overflow-hidden">
              <Image
                src="/logo.png"
                alt="FIFA WC26 on Screen Logo"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-xl font-extrabold tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all duration-300 whitespace-nowrap">
                FIFA WC26 on Screen
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:block">Stream World Cup 2026 Live Scores, Results and Fixtures.</p>
            </div>
          </Link>

          {/* Action Filters / Language Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Member Button */}
            <a
              href={referralLink}

              rel="noopener noreferrer"
              className="bg-linear-to-r from-cyan-500 to-emerald-500 text-gray-200 font-bold hover:brightness-110 shadow-md px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-1 sm:gap-1.5 select-none shrink-0"
            >
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{MEMBERSHIP_TRANSLATIONS[lang] || MEMBERSHIP_TRANSLATIONS["en"]}</span>
            </a>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-2 z-50">
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-slate-900 border border-slate-800 text-[9px] sm:text-xs font-bold text-slate-200 px-2 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl hover:border-cyan-500/30 focus:outline-hidden transition-all cursor-pointer shadow-xs flex items-center gap-1 sm:gap-1.5 capitalize shrink-0">
                  <span className="hidden sm:inline">{LANGUAGES.find((l) => l.code === lang)?.name || "Language"}</span>
                  <span className="sm:hidden">{lang === "en" || lang === "en-us" ? "EN" : lang.toUpperCase()}</span>
                  <span className="text-[8px] sm:text-[10px] text-slate-500">▼</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border border-slate-800 text-slate-200 rounded-xl min-w-[120px] shadow-xl p-1 z-50">
                  {LANGUAGES.map((l) => (
                    <DropdownMenuItem
                      key={l.code}
                      onClick={() => {
                        dispatch(setLanguage(l.code))
                        try {
                          localStorage.setItem("worldcup2026_lang", l.code)
                        } catch { }
                      }}
                      className={`cursor-pointer px-3 py-2 text-xs rounded-lg transition-all focus:bg-cyan-500/15 focus:text-cyan-400 font-bold ${lang === l.code ? "bg-cyan-500/10 text-cyan-400" : "text-slate-300"
                        }`}
                    >
                      {l.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      {adsConfig?.hero_ads && (
        <div className="w-full flex justify-center py-2 bg-slate-955/50 border-b border-slate-900/40 relative z-30">
          <AdScriptContainer scriptHtml={adsConfig.hero_ads} className="max-w-7xl mx-auto w-full flex justify-center" />
        </div>
      )}
    </>
  )
}
