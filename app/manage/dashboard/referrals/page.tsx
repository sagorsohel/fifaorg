"use client"

import { useState, useEffect } from "react"
import {
  Link as LinkIcon,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function ReferralLinksPage() {
  const [membershipRefLink, setMembershipRefLink] = useState("")
  const [signinRefLink, setSigninRefLink] = useState("")
  const [heroAds, setHeroAds] = useState("")
  const [hero2Ads, setHero2Ads] = useState("")
  const [modalAds, setModalAds] = useState("")
  const [headerAds, setHeaderAds] = useState("")

  const [referralsSaving, setReferralsSaving] = useState(false)
  const [referralsMessage, setReferralsMessage] = useState({ text: "", type: "success" })

  // Fetch referrals and existing ads on load
  useEffect(() => {
    fetch("/api/manage/ads")
      .then(res => res.json())
      .then(data => {
        if (data && data.ads) {
          setMembershipRefLink(data.ads.membership_ref_link || "")
          setSigninRefLink(data.ads.signin_ref_link || "")
          setHeroAds(data.ads.hero_ads || "")
          setHero2Ads(data.ads.hero2_ads || "")
          setModalAds(data.ads.modal_ads || "")
          setHeaderAds(data.ads.header_ads || "")
        }
      })
      .catch(() => { })
  }, [])

  const handleSaveReferrals = async (e: React.FormEvent) => {
    e.preventDefault()
    setReferralsSaving(true)
    setReferralsMessage({ text: "", type: "success" })

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
        setReferralsMessage({ text: "Referral links saved successfully!", type: "success" })
      } else {
        setReferralsMessage({ text: "Failed to save referral links.", type: "error" })
      }
    } catch (err: any) {
      setReferralsMessage({ text: err.message || "Network error.", type: "error" })
    } finally {
      setReferralsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in font-sans">
      {/* Header */}
      <div className="bg-slate-905/20 border border-slate-905 p-6 rounded-2xl shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <LinkIcon className="w-5 h-5 text-slate-955" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-100">Global Referral Links Configuration</h3>
            <p className="text-xs text-slate-505 font-medium">Configure global signup and membership redirection URLs.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveReferrals} className="bg-[#050b14] border border-slate-900 rounded-3xl p-6 space-y-6 shadow-xl">
        {referralsMessage.text && (
          <div
            className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
              referralsMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {referralsMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{referralsMessage.text}</span>
          </div>
        )}

        {/* Membership Referral Link */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
            Membership Referral Link
          </label>
          <input
            type="url"
            value={membershipRefLink}
            onChange={(e) => setMembershipRefLink(e.target.value)}
            placeholder="https://affiliate.example.com/membership"
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <p className="text-[9px] text-slate-550 leading-relaxed">
            This link is used by the "Member/Membership" button in the header navbar. If left empty, it will fall back to the match-specific referral link or the default signup URL.
          </p>
        </div>

        {/* Sign In Referral Link */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5 font-mono">
            Sign In Referral Link
          </label>
          <input
            type="url"
            value={signinRefLink}
            onChange={(e) => setSigninRefLink(e.target.value)}
            placeholder="https://affiliate.example.com/register"
            className="w-full bg-slate-950 border border-slate-900 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <p className="text-[9px] text-slate-550 leading-relaxed">
            This link is used for player box sign-in prompts and stream unlock modals. If left empty, it will fall back to the match-specific referral link or the default signup URL.
          </p>
        </div>

        {/* Save button */}
        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-end">
          <button
            type="submit"
            disabled={referralsSaving}
            className="px-6 py-3 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-955 font-extrabold rounded-xl text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {referralsSaving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
