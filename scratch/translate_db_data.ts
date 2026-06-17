import "./load-env"
import * as fs from "fs"
import * as path from "path"
import { teamTranslations, stadiumTranslations } from "../lib/db/translations"
import { performSync } from "../lib/db/sync"
import { LanguageCode } from "../lib/i18n"

// Map internal codes to API codes
const API_LANG_MAP: Record<string, string> = {
  jp: "ja",
  kr: "ko",
  vn: "vi",
  he: "he",
  th: "th",
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function translateText(text: string, targetLangCode: string): Promise<string> {
  const apiLang = API_LANG_MAP[targetLangCode] || targetLangCode
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${apiLang}`
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
      if (res.ok) {
        const data = await res.json()
        if (data && data.responseData && data.responseData.translatedText) {
          const translated = data.responseData.translatedText.trim()
          // Ensure it's not returning an error message
          if (translated && !translated.toLowerCase().includes("limit exceeded")) {
            return translated
          }
        }
      }
    } catch (e) {
      console.warn(`[API] Attempt ${attempt} failed for "${text}" to ${targetLangCode}:`, e)
    }
    await delay(1000 * attempt)
  }
  return ""
}

async function run() {
  console.log("Starting translation process...")

  const targetLangs: LanguageCode[] = ["jp", "kr", "vn", "he", "th"]

  // 1. Translate Teams
  console.log("\n--- TRANSLATING TEAMS ---")
  const teamKeys = Object.keys(teamTranslations)
  let teamCount = 0
  for (const teamName of teamKeys) {
    const translations = teamTranslations[teamName]
    for (const lang of targetLangs) {
      if (!translations[lang]) {
        console.log(`Translating Team "${teamName}" to ${lang}...`)
        const result = await translateText(teamName, lang)
        if (result) {
          translations[lang] = result
          console.log(`-> Translated: "${result}"`)
          teamCount++
          await delay(300) // Small delay to prevent rate limiting
        }
      }
    }
  }
  console.log(`Finished team translations. Updated ${teamCount} entries.`);

  // 2. Translate Stadiums
  console.log("\n--- TRANSLATING STADIUMS ---")
  const stadiumKeys = Object.keys(stadiumTranslations)
  let stadiumCount = 0
  for (const stadiumName of stadiumKeys) {
    const translations = stadiumTranslations[stadiumName]
    for (const lang of targetLangs) {
      if (!translations[lang]) {
        // Translate the full stadium name/city representation
        console.log(`Translating Stadium "${stadiumName}" to ${lang}...`)
        const result = await translateText(stadiumName, lang)
        if (result) {
          translations[lang] = result
          console.log(`-> Translated: "${result}"`)
          stadiumCount++
          await delay(300)
        }
      }
    }
  }
  console.log(`Finished stadium translations. Updated ${stadiumCount} entries.`);

  // 3. Write updated translations back to translations.ts
  const translationsFilePath = path.join(process.cwd(), "lib", "db", "translations.ts")
  console.log(`\nWriting updated translations to ${translationsFilePath}...`)
  
  const fileContent = `import { LanguageCode } from "../i18n"

export const teamTranslations: Record<string, Partial<Record<LanguageCode, string>>> = ${JSON.stringify(teamTranslations, null, 2)}

export const stadiumTranslations: Record<string, Partial<Record<LanguageCode, string>>> = ${JSON.stringify(stadiumTranslations, null, 2)}
`

  fs.writeFileSync(translationsFilePath, fileContent, "utf8")
  console.log("Successfully updated translations.ts file.")

  // 4. Trigger database synchronization
  console.log("\nTriggering database sync to propagate translations...")
  // Env variables loaded at the top of the file
  await performSync()
  console.log("Database sync completed successfully! Translations are now updated.")
  process.exit(0)
}

run().catch((err) => {
  console.error("Translation script failed:", err)
  process.exit(1)
})
