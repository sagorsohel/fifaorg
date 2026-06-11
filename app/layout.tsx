import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { cn } from "@/lib/utils";

import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "LIVE | FIFA WC26 on Screen",
  description: "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
}

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

async function getHeaderAds() {
  try {
    const headersList = await headers()
    const host = headersList.get("host") || "localhost:3000"
    const protocol = host.startsWith("localhost") ? "http" : "https"
    const url = `${protocol}://${host}/api/manage/ads`
    
    const res = await fetch(url)
    const data = await res.json()
    return data?.ads?.header_ads || ""
  } catch (err) {
    console.error("Failed to fetch header ads:", err)
    return ""
  }
}

function parseScriptTags(html: string) {
  const scripts: Array<{ src?: string; content?: string; async?: boolean; defer?: boolean }> = []
  const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi
  let match
  while ((match = scriptRegex.exec(html)) !== null) {
    const attrsStr = match[1]
    const content = match[2].trim()
    const srcMatch = attrsStr.match(/src=["']([^"']+)["']/i)
    const asyncMatch = /\basync\b/i.test(attrsStr)
    const deferMatch = /\bdefer\b/i.test(attrsStr)
    scripts.push({
      src: srcMatch ? srcMatch[1] : undefined,
      content: content || undefined,
      async: asyncMatch,
      defer: deferMatch
    })
  }
  return scripts
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerAdsHtml = await getHeaderAds()
  const headerScripts = parseScriptTags(headerAdsHtml)

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <head>
        {headerScripts.map((s, idx) => {
          if (s.src) {
            return (
              <script
                key={idx}
                src={s.src}
                async={s.async}
                defer={s.defer}
              />
            )
          }
          if (s.content) {
            return (
              <script
                key={idx}
                dangerouslySetInnerHTML={{ __html: s.content }}
              />
            )
          }
          return null
        })}
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
