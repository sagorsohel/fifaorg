import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from "@/components/providers"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { cn } from "@/lib/utils";

import { headers } from "next/headers"
import { db, ensureTablesExist } from "@/lib/db"
import { ads } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

const siteUrl = "https://fifaonscreen.org"
const imageUrl = `${siteUrl}/logo.png`

export const metadata: Metadata = {
  title: "LIVE | FIFA WC26 on Screen",
  description: "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "LIVE | FIFA WC26 on Screen",
    description: "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
    url: siteUrl,
    siteName: "FIFAonScreen",
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 512,
        height: 512,
        alt: "FIFA WC26 on Screen Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIVE | FIFA WC26 on Screen",
    description: "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
    images: [imageUrl],
  }
}

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

async function getAds() {
  try {
    // Calling headers() forces Next.js to treat the root layout as dynamic,
    // avoiding running database queries during next build static generation.
    await headers()
    await ensureTablesExist()

    const adsData = await db.select().from(ads).where(eq(ads.id, "global")).then(r => r[0])
    return {
      headerAds: adsData?.header_ads || "",
      modalAds: adsData?.modal_ads || ""
    }
  } catch (err) {
    console.error("Failed to fetch ads from DB directly:", err)
    return { headerAds: "", modalAds: "" }
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

function getNonScriptHtml(html: string) {
  return html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi, "").trim()
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get("x-url") || ""
  const isManage = pathname.startsWith("/manage")

  const isMatchPage = pathname.includes("/match/")

  const { headerAds, modalAds } = isManage ? { headerAds: "", modalAds: "" } : await getAds()

  const headerScripts = parseScriptTags(headerAds)
  const headerNonScriptHtml = getNonScriptHtml(headerAds)

  const bodyEndScripts = parseScriptTags(modalAds)
  const bodyEndNonScriptHtml = getNonScriptHtml(modalAds)

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
                key={`head-scr-${idx}`}
                src={s.src}
                async={s.async}
                defer={s.defer}
              />
            )
          }
          if (s.content) {
            return (
              <script
                key={`head-scr-inline-${idx}`}
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
            <LayoutWrapper>
              {!isMatchPage && headerNonScriptHtml && (
                <div dangerouslySetInnerHTML={{ __html: headerNonScriptHtml }} />
              )}
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </Providers>
        {bodyEndNonScriptHtml && (
          <div dangerouslySetInnerHTML={{ __html: bodyEndNonScriptHtml }} />
        )}
        {bodyEndScripts.map((s, idx) => {
          if (s.src) {
            return (
              <script
                key={`body-end-scr-${idx}`}
                src={s.src}
                async={s.async}
                defer={s.defer}
              />
            )
          }
          if (s.content) {
            return (
              <script
                key={`body-end-scr-inline-${idx}`}
                dangerouslySetInnerHTML={{ __html: s.content }}
              />
            )
          }
          return null
        })}
      </body></html>
  )
}


