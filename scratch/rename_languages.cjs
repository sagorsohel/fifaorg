const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

const i18nPath = path.join(projectRoot, 'lib', 'i18n.ts');
const navbarPath = path.join(projectRoot, 'components', 'navbar.tsx');
const matchClientPath = path.join(projectRoot, 'components', 'match-client-page.tsx');
const pagePath = path.join(projectRoot, 'app', 'page.tsx');
const teamPagePath = path.join(projectRoot, 'app', 'team', '[id]', 'page.tsx');
const matchPagePath = path.join(projectRoot, 'app', 'match', '[slug]', 'page.tsx');
const proxyPath = path.join(projectRoot, 'proxy.ts');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  for (const r of replacements) {
    content = content.replace(r.search, r.replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated: ${filePath}`);
  } else {
    console.log(`No changes made to: ${filePath}`);
  }
}

// 1. Update lib/i18n.ts
console.log("Updating lib/i18n.ts...");
replaceInFile(i18nPath, [
  // LanguageCode union
  { search: /\| "ja" \| "ko" \| "vi"/, replace: '| "jp" | "kr" | "vn"' },
  // LANGUAGES array
  { search: /\{ code: "ja", name: "日本語", dir: "ltr" \}/g, replace: '{ code: "jp", name: "日本語", dir: "ltr" }' },
  { search: /\{ code: "ko", name: "한국어", dir: "ltr" \}/g, replace: '{ code: "kr", name: "한국어", dir: "ltr" }' },
  { search: /\{ code: "vi", name: "Tiếng Việt", dir: "ltr" \}/g, replace: '{ code: "vn", name: "Tiếng Việt", dir: "ltr" }' },
  // getTimezoneLanguage function
  { search: /return "ja"/g, replace: 'return "jp"' },
  { search: /return "ko"/g, replace: 'return "kr"' },
  { search: /return "vi"/g, replace: 'return "vn"' },
  // COUNTRY_TO_LANG map
  { search: /JP: "ja"/g, replace: 'JP: "jp"' },
  { search: /KR: "ko"/g, replace: 'KR: "kr"' },
  { search: /VN: "vi"/g, replace: 'VN: "vn"' },
  // PREFIX_TO_LANG map
  { search: /ja: "ja"/g, replace: 'jp: "jp"' },
  { search: /ko: "ko"/g, replace: 'kr: "kr"' },
  { search: /vi: "vi"/g, replace: 'vn: "vn"' },
  // LANG_TO_PREFIX map
  { search: /ja: "ja"/g, replace: 'jp: "jp"' },
  { search: /ko: "ko"/g, replace: 'kr: "kr"' },
  { search: /vi: "vi"/g, replace: 'vn: "vn"' },
  // Object translation keys (e.g. ja:, ko:, vi: at start of line or space)
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 2. Update components/navbar.tsx
console.log("Updating components/navbar.tsx...");
replaceInFile(navbarPath, [
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 3. Update components/match-client-page.tsx
console.log("Updating components/match-client-page.tsx...");
replaceInFile(matchClientPath, [
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 4. Update app/page.tsx
console.log("Updating app/page.tsx...");
replaceInFile(pagePath, [
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 5. Update app/team/[id]/page.tsx
console.log("Updating app/team/[id]/page.tsx...");
replaceInFile(teamPagePath, [
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 6. Update app/match/[slug]/page.tsx
console.log("Updating app/match/[slug]/page.tsx...");
replaceInFile(matchPagePath, [
  { search: /\bja:/g, replace: 'jp:' },
  { search: /\bko:/g, replace: 'kr:' },
  { search: /\bvi:/g, replace: 'vn:' }
]);

// 7. Update proxy.ts
console.log("Updating proxy.ts...");
replaceInFile(proxyPath, [
  { search: /JP: "ja"/g, replace: 'JP: "jp"' },
  { search: /KR: "ko"/g, replace: 'KR: "kr"' },
  { search: /VN: "vi"/g, replace: 'VN: "vn"' },
  { search: /ja: "ja"/g, replace: 'jp: "jp"' },
  { search: /ko: "ko"/g, replace: 'kr: "kr"' },
  { search: /vi: "vi"/g, replace: 'vn: "vn"' }
]);

console.log("Renaming complete!");
