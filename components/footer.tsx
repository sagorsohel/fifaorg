"use client"

import { useAppSelector } from "@/lib/store"

export function Footer() {
  const lang = useAppSelector((state) => state.ui.language)

  return (
    <footer suppressHydrationWarning className="mb-24 sm:mb-0 mt-16 bg-slate-950 border-t border-slate-900 text-slate-400 relative z-10 font-sans">
      {/* Bottom Bar Section */}
      <div suppressHydrationWarning className="border-t border-slate-900 bg-slate-950 py-6">
        <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-4 text-[10px] tracking-wider font-bold">
          {/* Copyright */}
          <div suppressHydrationWarning className="text-slate-500 text-center md:text-right">
            Copyright ©2026 WC26 on Screen. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
