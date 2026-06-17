const fs = require('fs');
const content = fs.readFileSync('lib/i18n.ts', 'utf8');

// Simple regex parser to find keys under TRANSLATIONS object
const match = content.match(/export const TRANSLATIONS: Record<string, Record<string, string>> = \{([\s\S]*?)\n\};/);
if (match) {
  const inner = match[1];
  const keys = [];
  const keyRegex = /^\s*([a-zA-Z0-9_]+):\s*\{/gm;
  let keyMatch;
  while ((keyMatch = keyRegex.exec(inner)) !== null) {
    keys.push(keyMatch[1]);
  }
  console.log("Found keys:", keys);
  console.log("Count:", keys.length);
} else {
  console.log("TRANSLATIONS object not found");
}
