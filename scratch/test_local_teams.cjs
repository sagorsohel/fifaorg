const { getLocalizedTeamName } = require('../lib/i18n.ts');

const mockTeam = {
  name_en: "Mexico",
  translations: JSON.stringify({
    "en": "Mexico",
    "en-us": "Mexico",
    "ar": "المكسيك",
    "az": "Meksika",
    "bn": "মেক্সিকো",
    "cs": "Mexiko",
    "da": "Mexico",
    "de": "Mexiko",
    "el": "Μεξικό",
    "es": "México",
    "es-la": "México",
    "fr": "Mexique",
    "hi": "मेक्सिको",
    "hr": "Meksiko",
    "hu": "Mexikó",
    "id": "Meksiko",
    "it": "Messico",
    "nl": "Mexico",
    "no": "Mexico",
    "pl": "Meksyk",
    "pt": "México",
    "pt-pt": "México",
    "ro": "Mexic",
    "ru": "Мексика",
    "sk": "Mexiko",
    "sl": "Mehika",
    "sr": "Мексико",
    "sv": "Mexiko",
    "tr": "Meksika",
    "zh": "墨西哥",
    "jp": "メキシコ",
    "kr": "멕시코",
    "vn": "Mexico",
    "he": "מקסיקו",
    "th": "เม็กซิโก"
  })
};

const langs = ["zh", "jp", "kr", "vn", "he", "th", "ch"];

console.log("Team name translations for Mexico:");
for (const lang of langs) {
  const result = getLocalizedTeamName(mockTeam, "Mexico", lang);
  console.log(`- ${lang}: ${result}`);
}
