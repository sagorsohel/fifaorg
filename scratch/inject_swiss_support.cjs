const fs = require('fs');

// 1. Update lib/i18n.ts
function updateI18n() {
  const path = 'lib/i18n.ts';
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/\r\n/g, '\n');

  // Add "ch" to LanguageCode type
  content = content.replace(
    '| "ja" | "ko" | "vi" | "he" | "th"',
    '| "ja" | "ko" | "vi" | "he" | "th" | "ch"'
  );

  // Add Switzerland to LANGUAGES array
  content = content.replace(
    '  { code: "th", name: "ไทย", dir: "ltr" }\n]',
    '  { code: "th", name: "ไทย", dir: "ltr" },\n  { code: "ch", name: "Switzerland", dir: "ltr" }\n]'
  );

  // Update getTimezoneLanguage() to return "ch" for Swiss timezones
  content = content.replace(
    'if (tzLower.includes("zurich") || tzLower.includes("geneva") || tzLower.includes("switzerland")) return "de"',
    'if (tzLower.includes("zurich") || tzLower.includes("geneva") || tzLower.includes("switzerland")) return "ch"'
  );

  // Update COUNTRY_TO_LANG mapping: CH -> "ch"
  content = content.replace(
    'IL: "he", TH: "th", CH: "de"',
    'IL: "he", TH: "th", CH: "ch"'
  );

  // Update PREFIX_TO_LANG mapping
  content = content.replace(
    '  th: "th"\n}',
    '  th: "th",\n  ch: "ch"\n}'
  );

  // Update LANG_TO_PREFIX mapping
  content = content.replace(
    '  th: "th"\n}',
    '  th: "th",\n  ch: "ch"\n}'
  );

  // Update translate() function to resolve "ch" to "de"
  const translateOriginal = `export function translate(key: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[key]
  if (!dict) return key
  return dict[lang] || dict["en"]
}`;
  const translateUpdated = `export function translate(key: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[key]
  if (!dict) return key
  const resolvedLang = lang === "ch" ? "de" : lang
  return dict[resolvedLang] || dict["en"]
}`;
  content = content.replace(translateOriginal, translateUpdated);

  // Update getLocalizedTeamName() in lib/i18n.ts
  const teamNameOriginal = `export function getLocalizedTeamName(team: any, fallback: string, activeLang: LanguageCode): string {
  if (!team) return fallback
  if (team.translations) {
    try {
      const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
      if (parsed && parsed[activeLang]) return parsed[activeLang]
    } catch { }
  }
  if (activeLang === "ar" && team.name_fa) return team.name_fa
  return team.name_en || fallback
}`;
  const teamNameUpdated = `export function getLocalizedTeamName(team: any, fallback: string, activeLang: LanguageCode): string {
  if (!team) return fallback
  const resolvedLang = activeLang === "ch" ? "de" : activeLang
  if (team.translations) {
    try {
      const parsed = typeof team.translations === "string" ? JSON.parse(team.translations) : team.translations
      if (parsed && parsed[resolvedLang]) return parsed[resolvedLang]
    } catch { }
  }
  if (resolvedLang === "ar" && team.name_fa) return team.name_fa
  return team.name_en || fallback
}`;
  content = content.replace(teamNameOriginal, teamNameUpdated);

  fs.writeFileSync(path, content, 'utf8');
  console.log("Successfully updated lib/i18n.ts for Swiss support!");
}

// 2. Update stadium translation resolutions in components
function updateStadiumResolutions() {
  const files = [
    'components/world-cup-dashboard.tsx',
    'components/team-client-page.tsx',
    'components/match-client-page.tsx',
    'components/dashboard/matches-view.tsx'
  ];

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\r\n/g, '\n');

    // Pattern to look for stadium translations lookup
    const originalPattern = `if (stadium.translations) {
      try {
        const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
        if (parsed && parsed[lang]) return parsed[lang]
      } catch { }
    }`;

    const updatedPattern = `if (stadium.translations) {
      try {
        const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
        const resolvedLang = lang === "ch" ? "de" : lang
        if (parsed && parsed[resolvedLang]) return parsed[resolvedLang]
      } catch { }
    }`;

    if (content.includes(originalPattern)) {
      content = content.replace(originalPattern, updatedPattern);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated stadium translation resolution in ${file}`);
    } else {
      console.log(`Warning: Could not match stadium resolution pattern in ${file}`);
    }
  }
}

updateI18n();
updateStadiumResolutions();
