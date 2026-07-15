"use client"

import { useState, useEffect } from "react"
import {
  SlidersHorizontal,
  CheckCircle,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  X
} from "lucide-react"
import { getImageUrl } from "@/lib/utils"

export default function AdsControlPage() {
  const [heroAds, setHeroAds] = useState("")
  const [hero2Ads, setHero2Ads] = useState("")
  const [modalAds, setModalAds] = useState("")
  const [headerAds, setHeaderAds] = useState("")
  const [membershipRefLink, setMembershipRefLink] = useState("")
  const [signinRefLink, setSigninRefLink] = useState("")
  const [globalBg, setGlobalBg] = useState("")
  const [floatingAds, setFloatingAds] = useState("")
  const [floatingAdsStatus, setFloatingAdsStatus] = useState("on")
  
  const [adsSaving, setAdsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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
          setGlobalBg(data.ads.global_bg || "")
          setFloatingAds(data.ads.floating_ads || "")
          setFloatingAdsStatus(data.ads.floating_ads_status || "on")
        }
      })
      .catch(() => { })
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setAdsMessage({ text: "", type: "success" })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/manage/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setGlobalBg(data.url)
        setAdsMessage({ text: "Image uploaded successfully!", type: "success" })
      } else {
        setAdsMessage({ text: data.error || "Failed to upload image.", type: "error" })
      }
    } catch (err: any) {
      setAdsMessage({ text: err.message || "Network error during upload.", type: "error" })
    } finally {
      setUploading(false)
    }
  }

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
          signin_ref_link: safeBtoa(signinRefLink),
          global_bg: safeBtoa(globalBg),
          floating_ads: safeBtoa(floatingAds),
          floating_ads_status: floatingAdsStatus
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

        {/* Floating Mobile Ads Section */}
        <div className="space-y-3 bg-slate-955/20 border border-slate-900/60 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
              Floating Mobile Ads (Script / HTML Code)
            </label>
            
            {/* Status Radio Toggles */}
            <div className="flex items-center gap-4 bg-slate-950 p-1 rounded-xl border border-slate-900 select-none">
              <label className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                floatingAdsStatus === "on" 
                  ? "bg-linear-to-r from-cyan-500 to-emerald-500 text-slate-955 shadow-md shadow-cyan-500/10" 
                  : "text-slate-500 hover:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="floatingAdsStatus"
                  value="on"
                  checked={floatingAdsStatus === "on"}
                  onChange={() => setFloatingAdsStatus("on")}
                  className="hidden"
                />
                Enabled (On)
              </label>
              
              <label className={`flex items-center gap-1.5 px-3 py-1.5 border-slate-800 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                floatingAdsStatus === "off" 
                  ? "bg-red-500/20 border border-red-500/20 text-red-400 shadow-md shadow-red-500/10" 
                  : "text-slate-500 hover:text-slate-300"
              }`}>
                <input
                  type="radio"
                  name="floatingAdsStatus"
                  value="off"
                  checked={floatingAdsStatus === "off"}
                  onChange={() => setFloatingAdsStatus("off")}
                  className="hidden"
                />
                Disabled (Off)
              </label>
            </div>
          </div>
          
          <textarea
            value={floatingAds}
            onChange={(e) => setFloatingAds(e.target.value)}
            placeholder="<!-- Paste floating mobile overlay banner scripts here -->"
            rows={6}
            disabled={floatingAdsStatus === "off"}
            className={`w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all ${
              floatingAdsStatus === "off" ? "opacity-40 cursor-not-allowed" : ""
            }`}
          />
          <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
            This script renders as a floating overlay banner at the bottom of mobile screens. Switch the toggle to completely disable the mobile banner.
          </p>
        </div>

        {/* Global Background Image */}
        <div className="space-y-3 bg-slate-955 border border-slate-900 rounded-2xl p-5 shadow-xs">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-505" />
            Global Background Image
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input
                type="text"
                value={globalBg}
                onChange={(e) => setGlobalBg(e.target.value)}
                placeholder="https://example.com/background.jpg or relative path"
                className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all font-sans"
              />
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-805 border border-slate-800 text-slate-300 rounded-xl cursor-pointer text-xs font-semibold select-none transition-all active:scale-[0.98]">
                  <Upload className="w-3.5 h-3.5 text-cyan-500" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                
                {globalBg && (
                  <button
                    type="button"
                    onClick={() => setGlobalBg("")}
                    className="flex items-center gap-1.5 px-3 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Background
                  </button>
                )}
              </div>
            </div>

            {/* Preview Container */}
            <div className="flex items-center justify-center border-2 border-dashed border-slate-900 rounded-2xl p-4 bg-slate-950/40 relative min-h-[120px] overflow-hidden">
              {globalBg ? (
                <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
                  <img
                    src={getImageUrl(globalBg)}
                    alt="Background Preview"
                    className="max-h-[100px] w-auto object-contain rounded-lg border border-slate-800 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="text-center space-y-1">
                  <ImageIcon className="w-8 h-8 text-slate-705 mx-auto" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">No Background Configured</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-[9px] text-slate-550 leading-relaxed font-sans">
            Configure a global background image to be applied across the entire site (homepage and match detail views). It can be overridden by match-specific backgrounds.
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
