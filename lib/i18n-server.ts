import { headers, cookies } from "next/headers"
import { LanguageCode, LANGUAGES } from "./i18n"

export async function getPreferredLanguage(): Promise<LanguageCode> {
  try {
    const headersList = await headers()
    const acceptLang = headersList.get("accept-language")
    if (!acceptLang) return "en"
    
    const parsedLangs = acceptLang.split(",")
    for (const rawLang of parsedLangs) {
      const cleanLang = rawLang.split(";")[0].trim().toLowerCase()
      const exactMatch = LANGUAGES.find(l => l.code === cleanLang)
      if (exactMatch) return exactMatch.code

      const baseCode = cleanLang.split("-")[0] as LanguageCode
      const baseMatch = LANGUAGES.find(l => l.code === baseCode)
      if (baseMatch) {
        if (baseCode === "pt") {
          if (cleanLang.includes("pt-pt")) return "pt-pt"
          return "pt"
        }
        if (baseCode === "es") {
          if (["es-ar", "es-cl", "es-co", "es-cr", "es-do", "es-ec", "es-gt", "es-hn", "es-mx", "es-ni", "es-pa", "es-pe", "es-pr", "es-py", "es-sv", "es-uy", "es-ve", "es-419"].some(loc => cleanLang.includes(loc))) {
            return "es-la"
          }
          return "es"
        }
        return baseCode
      }
    }
  } catch (err) {
    console.error("Failed to parse accept-language header:", err)
  }
  return "en"
}

export async function getLanguageFromServer(): Promise<LanguageCode> {
  try {
    const headersList = await headers()
    const headerLang = headersList.get("x-next-lang")
    if (headerLang && LANGUAGES.some(l => l.code === headerLang)) {
      return headerLang as LanguageCode
    }
  } catch (e) {
    console.error("Failed to read x-next-lang header on server:", e)
  }

  try {
    const cookieList = await cookies()
    const cookieLang = cookieList.get("worldcup2026_lang")?.value
    if (cookieLang && LANGUAGES.some(l => l.code === cookieLang)) {
      return cookieLang as LanguageCode
    }
  } catch (e) {
    console.error("Failed to read lang cookie on server:", e)
  }
  return getPreferredLanguage()
}

export function getLocalizedTeamName(team: any, fallback: string, activeLang: LanguageCode): string {
  if (!team) return fallback
  if (team.translations) {
    try {
      const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
      if (parsed && parsed[activeLang]) return parsed[activeLang]
    } catch { }
  }
  if (activeLang === "ar" && team.name_fa) return team.name_fa
  return team.name_en || fallback
}
