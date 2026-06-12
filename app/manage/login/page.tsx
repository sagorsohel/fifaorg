"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trophy, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    try {
      const isAuth = localStorage.getItem("worldcup2026_admin_auth")
      if (isAuth === "true") {
        router.push("/manage/dashboard")
      }
    } catch (e) { }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate standard latency
    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "sohoj@sohoj") {
        try {
          localStorage.setItem("worldcup2026_admin_auth", "true")
          router.push("/manage/dashboard")
        } catch (err) {
          setError("Failed to save session state.")
        }
      } else {
        setError("Invalid email or password.")
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-linear-to-b from-slate-900/80 to-slate-955/80 border border-slate-900 rounded-3xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Subtle glow border */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-transparent via-cyan-500 to-transparent"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/15">
            <Trophy className="w-7 h-7 text-slate-950" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-linear-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              FIFA World Cup 2026
            </h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mt-1 font-bold">Admin Management Login</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs tracking-wider transition-all shadow-lg shadow-cyan-500/10 active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
            ) : (
              "SIGN IN TO MANAGEMENT"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
