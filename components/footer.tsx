"use client"

import { useAppSelector } from "@/lib/store"

export function Footer() {
  const lang = useAppSelector((state) => state.ui.language)

  return (
    <footer className="mb-24 sm:mb-0 mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 relative z-10 font-sans">
      {/* Top Logos Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* FIFA PARTNERS */}
        <div className="text-center space-y-4">
          <h4 className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">
            FIFA Partners
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {/* Aramco */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="18" fontSize="18" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">aramco</text>
                <circle cx="85" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx="85" cy="12" r="2" fill="currentColor" />
              </svg>
            </div>
            {/* Adidas */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 32 24" className="h-5.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <path d="M0 20 L4 20 L11 8 L7 8 Z M6 20 L10 20 L19 4 L15 4 Z M12 20 L16 20 L27 0 L23 0 Z" />
              </svg>
            </div>
            {/* ADI PREDICT STREET */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-6 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <polygon points="12,2 22,22 2,22" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <circle cx="12" cy="14" r="3" fill="currentColor" />
                <text x="28" y="14" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">ADI</text>
                <text x="28" y="22" fontSize="6.5" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">PREDICTSTREET</text>
              </svg>
            </div>
            {/* Coca Cola */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-7 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="18" fontSize="20" fontWeight="bold" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="-1">Coca-Cola</text>
              </svg>
            </div>
            {/* Hyundai Kia */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-5.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <ellipse cx="20" cy="12" rx="14" ry="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M14 6 L14 18 M26 6 L26 18 M14 12 L26 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="42" y1="4" x2="42" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                <text x="50" y="18" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">KIΛ</text>
              </svg>
            </div>
            {/* Lenovo */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 80 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="18" fontSize="17" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-0.5">Lenovo</text>
              </svg>
            </div>
            {/* Qatar Airways */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-5.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="13" fontSize="11" fontWeight="800" fontFamily="sans-serif" letterSpacing="1.5">QATAR</text>
                <text x="0" y="21" fontSize="7" fontWeight="500" fontFamily="sans-serif" letterSpacing="1.2" opacity="0.8">AIRWAYS</text>
                <path d="M75 2 C72 8 70 14 74 20 C75 22 77 22 80 18 C83 14 85 8 82 2 C80 6 78 6 75 2 Z" fill="currentColor" />
                <path d="M77 2 L70 14 M80 2 L87 14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Visa */}
            <div className="h-6 flex items-center justify-center">
              <svg viewBox="0 0 60 24" className="h-5.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="19" fontSize="22" fontWeight="950" fontFamily="sans-serif" fontStyle="italic" letterSpacing="-1">VISA</text>
              </svg>
            </div>
          </div>
        </div>

        {/* SPONSORS */}
        <div className="text-center space-y-4">
          <h4 className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">
            Sponsors
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {/* Budweiser */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 80 24" className="h-4.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <polygon points="5,4 75,4 65,12 75,20 5,20 15,12" fill="none" stroke="currentColor" strokeWidth="2" />
                <text x="20" y="16" fontSize="9" fontWeight="800" fontFamily="Georgia, serif" letterSpacing="0.5">Budweiser</text>
              </svg>
            </div>
            {/* Bank of America */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 100 24" className="h-4.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <rect x="0" y="4" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" />
                <line x1="8" y1="4" x2="8" y2="20" stroke="currentColor" strokeWidth="1.5" />
                <text x="24" y="15" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">Bank of America</text>
              </svg>
            </div>
            {/* Hisense */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 70 24" className="h-4.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="17" fontSize="15" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-0.2">Hisense</text>
              </svg>
            </div>
            {/* Lay's */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 60 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M2 12 C10 10 14 14 22 12" stroke="currentColor" strokeWidth="3" fill="none" />
                <text x="26" y="16" fontSize="13" fontWeight="900" fontFamily="sans-serif" fontStyle="italic">Lay's</text>
              </svg>
            </div>
            {/* McDonald's */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 32 24" className="h-5.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <path d="M2 22 L2 11 C2 7 5 3 9 3 C12 3 14 6 16 9 C18 6 20 3 23 3 C27 3 30 7 30 11 L30 22" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Mengniu */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 80 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <path d="M5 18 C5 10 12 5 18 10 C15 15 10 18 5 18 Z" fill="currentColor" />
                <text x="24" y="17" fontSize="15" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">蒙牛</text>
              </svg>
            </div>
            {/* Dove */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 60 24" className="h-4.5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <path d="M6 12 C10 10 14 6 18 8 C16 12 12 16 6 12 Z" fill="currentColor" />
                <text x="24" y="17" fontSize="15" fontWeight="bold" fontFamily="Georgia, serif" fontStyle="italic">Dove</text>
              </svg>
            </div>
            {/* Verizon */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 70 24" className="h-4 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <text x="0" y="16" fontSize="15" fontWeight="bold" fontFamily="sans-serif" letterSpacing="-0.5">verizon</text>
                <path d="M58 4 L62 12 L68 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* SUPPORTERS */}
        <div className="text-center space-y-4">
          <h4 className="text-[9px] font-bold tracking-[0.25em] text-slate-500 uppercase">
            Supporters
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70 hover:opacity-100 transition-opacity duration-300">
            {/* Valvoline */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 80 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <polygon points="2,2 14,2 8,14" fill="currentColor" />
                <polygon points="12,2 24,2 18,14" fill="currentColor" opacity="0.6" />
                <text x="28" y="17" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">Valvoline</text>
              </svg>
            </div>
            {/* PIF */}
            <div className="h-5 flex items-center justify-center">
              <svg viewBox="0 0 80 24" className="h-5 w-auto fill-current text-slate-400 hover:text-cyan-400 transition-all duration-300">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6 L12 16 M9 10 L15 10 M10 8 L14 8" stroke="currentColor" strokeWidth="1.5" />
                <text x="26" y="17" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">PIF</text>
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar Section */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-4 text-[10px] tracking-wider font-bold">

          {/* Links */}


          {/* Copyright */}
          <div className="text-slate-500 text-center md:text-right">
            Copyright ©2026 FIFA WC26 on Screen. All rights reserved.
          </div>

        </div>
      </div>
    </footer>
  )
}
