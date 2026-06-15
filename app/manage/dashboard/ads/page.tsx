"use client"

import { useState, useEffect } from "react"
import {
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function AdsControlPage() {
  const [heroAds, setHeroAds] = useState("")
  const [hero2Ads, setHero2Ads] = useState("")
  const [modalAds, setModalAds] = useState("")
  const [headerAds, setHeaderAds] = useState("")
  const [membershipRefLink, setMembershipRefLink] = useState("")
  const [signinRefLink, setSigninRefLink] = useState("")
  
  const [adsSaving, setAdsSaving] = useState(false)
  const [adsMessage, setAdsMessage] = useState({ text: "", type: "success" })

  // Fetch Ads settings on load
  useEffect(() => {
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
      .catch(() => { })
  }, [])

  const handleSaveAds = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdsSaving(true)
    setAdsMessage({ text: "", type: "success" })

    const safeBtoa = (str: string) => {
      try {
        return btoa(unescape(encodeURIComponent(str || "")))
      } catch (err) {
        return str || ""
      }
    }

    try {
      const res = await fetch("/api/manage/ads", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-encoded-payload": "base64"
        },
        body: JSON.stringify({
          hero_ads: safeBtoa(heroAds),
          hero2_ads: safeBtoa(hero2Ads),
          modal_ads: safeBtoa(modalAds),
          header_ads: safeBtoa(headerAds),
          membership_ref_link: safeBtoa(membershipRefLink),
          signin_ref_link: safeBtoa(signinRefLink)
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

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-slate-905/20 border border-slate-905 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <SlidersHorizontal className="w-5 h-5 text-slate-955" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">Global Ads Configuration</h3>
            <p className="text-xs text-slate-505 font-medium">Inject advertisement or tracking scripts dynamically into header, hero, or modal spots.</p>
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
            {adsMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
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
          <p className="text-[9px] text-slate-550 leading-relaxed">
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
          <p className="text-[9px] text-slate-550 leading-relaxed">
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
            className="w-full bg-slate-955 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
          />
          <p className="text-[9px] text-slate-550 leading-relaxed">
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
          <p className="text-[9px] text-slate-550 leading-relaxed">
            This script is injected inside the Stream Player box inline signup container.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-end">
          <button
            type="submit"
            disabled={adsSaving}
            className="px-6 py-3 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {adsSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
