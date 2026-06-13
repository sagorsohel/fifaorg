import { Metadata } from "next"
import WorldCupDashboard from "@/components/world-cup-dashboard"
import { getLanguageFromServer } from "@/lib/i18n-server"

const METADATA_TRANSLATIONS: Record<string, Record<string, string>> = {
  title: {
    en: "LIVE | FIFA WC26 on Screen",
    "en-us": "LIVE | FIFA WC26 on Screen",
    ar: "بث مباشر | فيفا كأس العالم 2026",
    az: "CANLI | FIFA WC26 on Screen",
    bn: "লাইভ | FIFA WC26 on Screen",
    cs: "ŽIVĚ | FIFA WC26 on Screen",
    da: "LIVE | FIFA WC26 on Screen",
    de: "LIVE | FIFA WC26 on Screen",
    el: "ΖΩΝΤΑΝΑ | FIFA WC26 on Screen",
    es: "EN VIVO | FIFA WC26 on Screen",
    "es-la": "EN VIVO | FIFA WC26 on Screen",
    fr: "EN DIRECT | FIFA WC26 on Screen",
    hi: "लाइव | FIFA WC26 on Screen",
    hr: "UŽIVO | FIFA WC26 on Screen",
    hu: "ÉLŐ | FIFA WC26 on Screen",
    id: "LANGSUNG | FIFA WC26 on Screen",
    it: "IN DIRETTA | FIFA WC26 on Screen",
    nl: "LIVE | FIFA WC26 on Screen",
    no: "LIVE | FIFA WC26 on Screen",
    pl: "NA ŻYWO | FIFA WC26 on Screen",
    pt: "AO VIVO | FIFA WC26 on Screen",
    "pt-pt": "AO VIVO | FIFA WC26 on Screen",
    ro: "LIVE | FIFA WC26 on Screen",
    ru: "ПРЯМОЙ ЭФИР | FIFA WC26 на экране",
    sk: "NAŽIVO | FIFA WC26 on Screen",
    sl: "V ŽIVO | FIFA WC26 on Screen",
    sr: "УЖИВО | FIFA WC26 on Screen",
    sv: "LIVE | FIFA WC26 on Screen",
    tr: "CANLI | FIFA WC26 on Screen",
    zh: "直播 | FIFA WC26 on Screen"
  },
  description: {
    en: "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
    "en-us": "World Cup 2026 Live Scores, Results and Fixtures. Don't miss a single match. Stream all 104 matches live on FIFAonScreen.",
    ar: "النتائج المباشرة وجدول مباريات كأس العالم 2026. لا تفوت أي مباراة. شاهد البث المباشر لجميع الـ 104 مباراة على FIFAonScreen.",
    az: "2026 FIFA Dünya Kuboku Canlı Hesablar, Nəticələr və Fikstürlər. Heç bir oyunu qaçırmayın. Bütün 104 oyunu canlı olaraq FIFAonScreen-də izləyin.",
    bn: "২০২৬ ফিফা বিশ্বকাপ লাইভ স্কোর, ফলাফল এবং ফিক্সচার। একটি ম্যাচও মিস করবেন না। FIFAonScreen-এ সরাসরি সব ১০৪টি ম্যাচ দেখুন।",
    cs: "Mistrovství světa ve fotbale 2026 živé výsledky a rozpisy zápasů. Nenechte si ujít ani jeden zápas. Sledujte všech 104 zápasů živě na FIFAonScreen.",
    da: "FIFA VM 2026 live scores, resultater og kampprogrammer. Gå ikke glip af en eneste kamp. Stream alle 104 kampe live på FIFAonScreen.",
    de: "FIFA Fussball-WM 2026 Live-Spielstände, Ergebnisse und Spielpläne. Verpassen Sie kein einziges Spiel. Streamen Sie alle 104 Spiele live auf FIFAonScreen.",
    el: "Παγκόσμιο Κύπελλο FIFA 2026 Ζωντανά Σκορ, Αποτελέσματα & Πρόγραμμα. Μη χάσετε ούτε έναν αγώνα. Μεταδώστε και τους 104 αγώνες ζωντανά στο FIFAonScreen.",
    es: "Resultados en vivo, marcadores y calendario de la Copa Mundial de la FIFA 2026. No se pierda ningún partido. Transmita los 104 partidos en vivo en FIFAonScreen.",
    "es-la": "Resultados en vivo, marcadores y calendario de la Copa Mundial de la FIFA 2026. No se pierda ningún partido. Transmita los 104 partidos en vivo en FIFAonScreen.",
    fr: "Scores en direct, résultats et calendrier de la Coupe du Monde de la FIFA 2026. Ne manquez aucun match. Regardez les 104 matchs en direct sur FIFAonScreen.",
    hi: "2026 फीफा विश्व कप लाइव स्कोर, परिणाम & फिक्सचर। एक भी मैच न चूकें। FIFAonScreen पर सभी 104 मैच लाइव देखें।",
    hr: "FIFA Svjetsko prvenstvo 2026. rezultati uživo, raspored i rezultati. Ne propustite niti jednu utakmicu. Pratite sve 104 utakmice uživo na FIFAonScreen.",
    hu: "2026-os FIFA Világbajnokság élő eredmények, menetrend és meccsek. Ne hagyjon ki egyetlen mérkőzést sem. Nézze mind a 104 meccset élőben a FIFAonScreen-en.",
    id: "Skor Langsung, Hasil, dan Jadwal Piala Dunia FIFA 2026. Jangan lewatkan satu pertandingan pun. Saksikan ke-104 pertandingan langsung di FIFAonScreen.",
    it: "Risultati in diretta, punteggi e calendario della Coppa del Mondo FIFA 2026. Non perderti nemmeno una partita. Segui tutti i 104 incontri in diretta su FIFAonScreen.",
    nl: "FIFA Wereldbeker 2026 Live scores, uitslagen en speelschema's. Mis geen enkele wedstrijd. Stream alle 104 wedstrijden live op FIFAonScreen.",
    no: "FIFA Fotball-VM 2026 livescorer, resultater og kampoppsett. Gå ikke glipp av en eneste kamp. Stream alle 104 kamper live på FIFAonScreen.",
    pl: "Mistrzostwa Świata FIFA 2026 wyniki na żywo, terminarz i rezultaty. Nie przegap żadnego meczu. Oglądaj wszystkie 104 mecze na żywo na FIFAonScreen.",
    pt: "Placares ao vivo, resultados e tabela da Copa do Mundo FIFA 2026. Não perca nenhum jogo. Assista a todas as 104 partidas ao vivo no FIFAonScreen.",
    "pt-pt": "Placares ao vivo, resultados e tabela da Copa do Mundo FIFA 2026. Não perca nenhum jogo. Assista a todas as 104 partidas ao vivo no FIFAonScreen.",
    ro: "Cupa Mondială FIFA 2026 Scoruri live, rezultate și program. Nu ratați niciun meci. Urmăriți toate cele 104 meciuri în direct pe FIFAonScreen.",
    ru: "Чемпионат мира по футболу 2026 результаты в реальном времени, расписание и матчи. Не пропустите ни одной игры. Смотрите все 104 матча в прямом эфире на FIFAonScreen.",
    sk: "Majstrovstvá sveta FIFA 2026 výsledky naživo, výsledky a program. Nenechajte si ujsť ani jeden zápas. Sledujte všetkých 104 zápasov naživo na FIFAonScreen.",
    sl: "Svetovno prvenstvo v nogometu FIFA 2026 rezultati v živo, rezultati in razporedi. Ne zamudite nobene tekme. Spremljajte vseh 104 tekem v živo na FIFAonScreen.",
    sr: "ФИФА Светско првенство 2026 резултати уживо, распоред и резултати. Не пропустите ни једну утакмицу. Пратите све 104 утакмице уживо на FIFAonScreen.",
    sv: "FIFA Fotbolls-VM 2026 liveresultat, resultat och spelscheman. Missa inte en enda match. Streama alla 104 matcher live på FIFAonScreen.",
    tr: "2026 FIFA Dünya Kupası Canlı Skorları, Sonuçlar ve Fikstürler. Tek bir maçı bile kaçırmayın. 104 maçın tamamını FIFAonScreen'de canlı izleyin.",
    zh: "2026年FIFA世界杯比分直播、赛程和结果。不要错过 any 一场比赛。在 FIFAonScreen 在线观看全部104场比赛直播。"
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageFromServer()
  const title = METADATA_TRANSLATIONS.title[lang] || METADATA_TRANSLATIONS.title["en"]
  const description = METADATA_TRANSLATIONS.description[lang] || METADATA_TRANSLATIONS.description["en"]

  const siteUrl = "https://fifaonscreen.com"
  const imageUrl = `${siteUrl}/logo.png`

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
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
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default function Page() {
  return <WorldCupDashboard />
}
