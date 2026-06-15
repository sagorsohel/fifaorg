import { Metadata } from "next"
import { db } from "@/lib/db"
import { games, teams } from "@/lib/db/schema"
import MatchClientPage from "@/components/match-client-page"
import { LanguageCode, adjustGameStatus } from "@/lib/i18n"
import { getLanguageFromServer, getLocalizedTeamName } from "@/lib/i18n-server"
import { getImageUrl } from "@/lib/utils"

const METADATA_TRANSLATIONS: Record<string, Record<string, string>> = {
  title_template: {
    en: "LIVE: {home} vs {away} Match Stream",
    "en-us": "LIVE: {home} vs {away} Match Stream",
    ar: "بث مباشر: {home} ضد {away}",
    az: "CANLI: {home} vs {away} Oyunu Canlı Yayımı",
    bn: "লাইভ: {home} বনাম {away} ম্যাচের লাইভ স্ট্রিম",
    cs: "ŽIVĚ: {home} vs {away} přenos zápasu",
    da: "LIVE: {home} mod {away} kamp-stream",
    de: "LIVE: {home} gegen {away} Live-Stream",
    el: "ΖΩΝΤΑΝΑ: {home} εναντίον {away} Μετάδοση Αγώνα",
    es: "EN VIVO: Transmisión del partido {home} vs {away}",
    "es-la": "EN VIVO: Transmisión del partido {home} vs {away}",
    fr: "EN DIRECT : Diffusion du match {home} vs {away}",
    hi: "लाइव: {home} बनाम {away} मैच स्ट्रीम",
    hr: "UŽIVO: {home} protiv {away} prijenos utakmice",
    hu: "ÉLŐ: {home} vs {away} mérkőzés közvetítés",
    id: "LANGSUNG: Siaran Pertandingan {home} vs {away}",
    it: "IN DIRETTA: Streaming della partita {home} contro {away}",
    nl: "LIVE: {home} vs {away} wedstrijdstream",
    no: "LIVE: {home} mot {away} kamp-stream",
    pl: "NA ŻYWO: Transmisja meczu {home} vs {away}",
    pt: "AO VIVO: Transmissão de {home} vs {away}",
    "pt-pt": "AO VIVO: Transmissão de {home} vs {away}",
    ro: "LIVE: Transmisie meci {home} vs {away}",
    ru: "ПРЯМОЙ ЭФИР: Трансляция матча {home} против {away}",
    sk: "NAŽIVO: Stream zápasu {home} vs {away}",
    sl: "V ŽIVO: Prenos tekme {home} proti {away}",
    sr: "УЖИВО: {home} против {away} пренос утакмице",
    sv: "LIVE: {home} mot {away} match-stream",
    tr: "CANLI: {home} - {away} Maç Yayını",
    zh: "直播：{home} 对 {away} 比赛直播"
  },
  desc_template: {
    en: "Stream \"{home} vs {away}\" live 2026 FIFA World Cup match including scores, standings, and highlights.",
    "en-us": "Stream \"{home} vs {away}\" live 2026 FIFA World Cup match including scores, standings, and highlights.",
    ar: "شاهد البث المباشر لمباراة \"{home} ضد {away}\" في كأس العالم 2026 مع الأهداف والنتائج والملخصات.",
    az: "Hesablar, turnir cədvəli və ən maraqlı anlar daxil olmaqla, 2026 FIFA Dünya Kubokunun \"{home} - {away}\" oyununu canlı izləyin.",
    bn: "স্কোর, পয়েন্ট টেবিল এবং হাইলাইটস সহ ২০২৬ ফিফা বিশ্বকাপের \"{home} বনাম {away}\" ম্যাচটি সরাসরি দেখুন।",
    cs: "Sledujte živý přenos zápasu Mistrovství světa FIFA 2026 \"{home} vs {away}\", včetně výsledků, tabulek a sestřihů.",
    da: "Stream \"{home} mod {away}\" live fra FIFA VM 2026, inklusiv resultater, stillinger og højdepunkter.",
    de: "Sehen Sie das FIFA WM 2026 Spiel \"{home} gegen {away}\" im Live-Stream mit Toren, Tabellen und Highlights.",
    el: "Παρακολουθήστε ζωντανά τον αγώνα του Παγκοσμίου Κυπέλλου FIFA 2026 \"{home} εναντίον {away}\" με σκορ, βαθμολογίες και στιγμιότυπα.",
    es: "Siga la transmisión en vivo del partido \"{home} vs {away}\" de la Copa Mundial de la FIFA 2026, con marcadores, clasificaciones y resúmenes.",
    "es-la": "Siga la transmisión en vivo del partido \"{home} vs {away}\" de la Copa Mundial de la FIFA 2026, con marcadores, clasificaciones y resúmenes.",
    fr: "Regardez le match de la Coupe du Monde de la FIFA 2026 \"{home} vs {away}\" en direct avec les scores, le classement et les moments forts.",
    hi: "स्कोर, अंक तालिका और हाइलाइट्स सहित 2026 फीफा विश्व कप का \"{home} बनाम {away}\" मैच लाइव स्ट्रीम देखें।",
    hr: "Gledajte uživo utakmicu FIFA Svjetskog prvenstva 2026. \"{home} protiv {away}\", uključujući rezultate, tablice i sažetke.",
    hu: "Nézze élőben a 2026-os FIFA Világbajnokság \"{home} vs {away}\" mérkőzését eredményekkel, tabellákkal és összefoglalókkal.",
    id: "Saksikan siaran langsung pertandingan Piala Dunia FIFA 2026 \"{home} vs {away}\" lengkap dengan skor, klasemen, dan sorotan.",
    it: "Segui in diretta streaming la partita della Coppa del Mondo FIFA 2026 \"{home} contro {away}\", inclusi risultati, classifiche e azioni salienti.",
    nl: "Stream de FIFA Wereldbeker 2026-wedstrijd \"{home} vs {away}\" live, inclusief scores, standen en hoogtepunten.",
    no: "Stream \"{home} mot {away}\" live fra FIFA fotball-VM 2026 med resultater, tabeller og høydepunkter.",
    pl: "Oglądaj na żywo mecz Mistrzostw Świata FIFA 2026 \"{home} vs {away}\", w tym wyniki, tabele i skróty meczów.",
    pt: "Assista ao vivo ao jogo \"{home} vs {away}\" da Copa do Mundo FIFA 2026, incluindo placares, tabela e melhores momentos.",
    "pt-pt": "Assista ao vivo ao jogo \"{home} vs {away}\" do Campeonato do Mundo FIFA 2026, incluindo resultados, classificações e resumos.",
    ro: "Urmărește live meciul \"{home} vs {away}\" de la Cupa Mondială FIFA 2026, inclusiv scoruri, clasamente și rezumat.",
    ru: "Смотрите прямую трансляцию матча Чемпионата мира по футболу 2026 \"{home} против {away}\" с результатами, таблицами и обзорами.",
    sk: "Sledujte naživo zápas Majstrovstiev sveta FIFA 2026 \"{home} vs {away}\" vrátane výsledkov, tabuliek a zostrihov.",
    sl: "Spremljajte prenos tekme Svetovnega prvenstva v nogometu FIFA 2026 \"{home} proti {away}\" v živo, vključno z rezultati, lestvico in vrhunci.",
    sr: "Гледајте уживо утакмицу ФИФА Светског првенства 2026. \"{home} против {away}\", укључујуći rezultate, tabele i sažetke.",
    sv: "Streama \"{home} mot {away}\" live från FIFA Fotbolls-VM 2026, inklusive resultat, tabeller och höjdpunkter.",
    tr: "Skorlar, puan durumları ve özetler dahil 2026 FIFA Dünya Kupası \"{home} - {away}\" maçını canlı izleyin.",
    zh: "在线观看2026年FIFA世界杯“{home} 对 {away}”比赛直播，包含比分、积分榜和集锦。"
  },
  not_found: {
    en: "Match Not Found | FIFA WC26 on Screen",
    "en-us": "Match Not Found | FIFA WC26 on Screen",
    ar: "المباراة غير موجودة | فيفا كأس العالم 2026",
    az: "Oyun tapılmadı | FIFA WC26 on Screen",
    bn: "ম্যাচ পাওয়া যায়নি | FIFA WC26 on Screen",
    cs: "Zápas nebyl nalezen | FIFA WC26 on Screen",
    da: "Kamp ikke fundet | FIFA WC26 on Screen",
    de: "Spiel nicht gefunden | FIFA Fussball-WM 2026",
    el: "Ο αγώνας δεν βρέθηκε | FIFA WC26 on Screen",
    es: "Partido no encontrado | Copa Mundial FIFA 2026",
    "es-la": "Partido no encontrado | Copa Mundial FIFA 2026",
    fr: "Match non trouvé | FIFA WC26 on Screen",
    hi: "मैच नहीं मिला | फीफा विश्व कप 2026",
    hr: "Utakmica nije pronađena | FIFA WC26 on Screen",
    hu: "A mérkőzés nem található | FIFA WC26 on Screen",
    id: "Pertandingan Tidak Ditemukan | FIFA WC26 on Screen",
    it: "Partita non trovata | FIFA WC26 on Screen",
    nl: "Wedstrijd Niet Gevonden | FIFA WC26 on Screen",
    no: "Kamp ikke funnet | FIFA WC26 on Screen",
    pl: "Nie znaleziono meczu | FIFA WC26 on Screen",
    pt: "Partida Não Encontrada | Copa do Mundo FIFA 2026",
    "pt-pt": "Jogo Não Encontrado | FIFA WC26 on Screen",
    ro: "Meciul nu a fost găsit | FIFA WC26 on Screen",
    ru: "Матч не найден | FIFA WC26 на экране",
    sk: "Zápas nebol nájdený | FIFA WC26 on Screen",
    sl: "Tekma ni bila najdena | FIFA WC26 on Screen",
    sr: "Утакмица није пронађена | FIFA WC26 on Screen",
    sv: "Match hittades inte | FIFA WC26 on Screen",
    tr: "Maç Bulunamadı | FIFA WC26 on Screen",
    zh: "未找到该比赛 | FIFA WC26 on Screen"
  }
}



async function getGameAndTeamsBySlug(slug: string) {
  try {
    const allGamesRaw = await db.select().from(games)
    const allGames = allGamesRaw.map(adjustGameStatus)
    const allTeams = await db.select().from(teams)

    const teamMap = new Map(allTeams.map((t) => [t.id, t]))

    const matchedGame = allGames.find((g) => {
      if (g._id === slug || g.id === slug || g.slug === slug) {
        return true
      }
      const homeTeam = teamMap.get(g.home_team_id)
      const awayTeam = teamMap.get(g.away_team_id)
      const homeName = homeTeam?.name_en || "tbd"
      const awayName = awayTeam?.name_en || "tbd"
      const homeSlug = homeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const awaySlug = awayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      const computedSlug = `${homeSlug}-vs-${awaySlug}-${g.id || g._id}`
      return computedSlug === slug
    })

    if (!matchedGame) return null

    const homeTeam = teamMap.get(matchedGame.home_team_id)
    const awayTeam = teamMap.get(matchedGame.away_team_id)

    return {
      game: matchedGame,
      homeTeam,
      awayTeam,
    }
  } catch (error) {
    console.error("Failed to query match from database:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const matchInfo = await getGameAndTeamsBySlug(resolvedParams.slug)

  const lang = await getLanguageFromServer()

  if (!matchInfo) {
    const notFoundTitle = METADATA_TRANSLATIONS.not_found[lang] || METADATA_TRANSLATIONS.not_found["en"]
    return {
      title: notFoundTitle,
    }
  }

  const homeName = getLocalizedTeamName(matchInfo.homeTeam, "TBD", lang)
  const awayName = getLocalizedTeamName(matchInfo.awayTeam, "TBD", lang)

  const titleTemplate = METADATA_TRANSLATIONS.title_template[lang] || METADATA_TRANSLATIONS.title_template["en"]
  const descTemplate = METADATA_TRANSLATIONS.desc_template[lang] || METADATA_TRANSLATIONS.desc_template["en"]

  const title = titleTemplate.replace("{home}", homeName).replace("{away}", awayName)
  const description = descTemplate.replace("{home}", homeName).replace("{away}", awayName)
  const siteUrl = "https://fifaonscreen.com"

  let images = [`${siteUrl}/logo.png`]
  if (matchInfo.game.modal_image) {
    const modalImg = getImageUrl(matchInfo.game.modal_image)
    images = [modalImg.startsWith("/") ? `${siteUrl}${modalImg}` : modalImg]
  } else if (matchInfo.homeTeam?.flag) {
    images = [getImageUrl(matchInfo.homeTeam.flag)]
  }

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  }
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  return <MatchClientPage slug={resolvedParams.slug} />
}

