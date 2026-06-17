import { Metadata } from "next"
import { db } from "@/lib/db"
import { teams } from "@/lib/db/schema"
import TeamClientPage from "@/components/team-client-page"
import { LanguageCode } from "@/lib/i18n"
import { getLanguageFromServer, getLocalizedTeamName } from "@/lib/i18n-server"
import { getImageUrl } from "@/lib/utils"

const METADATA_TRANSLATIONS: Record<string, Record<string, string>> = {
  title_template: {
    en: "{team} | Live Match, Fixture & Standing",
    "en-us": "{team} | Live Match, Fixture & Standing",
    ar: "{team} | مباراة مباشرة، جدول مباريات وترتيب",
    az: "{team} | Canlı Oyun, Fikstür və Turnir Cədvəli",
    bn: "{team} | লাইভ ম্যাচ, ফিক্সচার এবং পয়েন্ট টেবিল",
    cs: "{team} | Živý zápas, rozpis a tabulka",
    da: "{team} | Live kamp, kampprogram & stilling",
    de: "{team} | Live-Spiel, Spielplan & Tabelle",
    el: "{team} | Ζωντανός Αγώνας, Πρόγραμμα & Βαθμολογία",
    es: "{team} | Partido en vivo, calendario y clasificación",
    "es-la": "{team} | Partido en vivo, calendario y clasificación",
    fr: "{team} | Match en direct, calendrier & classement",
    hi: "{team} | लाइव मैच, फिक्सचर और अंक तालिका",
    hr: "{team} | Utakmica uživo, raspored & poredak",
    hu: "{team} | Élő mérkőzés, menetrend és állás",
    id: "{team} | Pertandingan Langsung, Jadwal & Klasemen",
    it: "{team} | Partita in diretta, calendario & classifica",
    nl: "{team} | Live wedstrijd, speelschema & stand",
    no: "{team} | Live kamp, kampprogram & tabell",
    pl: "{team} | Mecz na żywo, terminarz i tabela",
    pt: "{team} | Jogo ao vivo, tabela & classificação",
    "pt-pt": "{team} | Jogo ao vivo, tabela & classificação",
    ro: "{team} | Meci live, program & clasament",
    ru: "{team} | Прямой эфир, расписание и таблица",
    sk: "{team} | Zápas naživo, rozpis & tabuľka",
    sl: "{team} | Tekma v živo, razpored in lestvica",
    sr: "{team} | Утакмица уживо, распоред & табела",
    sv: "{team} | Livematch, spelschema & tabell",
    tr: "{team} | Canlı Maç, Fikstür & Puan Durumu",
    zh: "{team} | 比赛直播、赛程与积分榜",
    jp: "{team} | ライブ配信、日程、結果、順位表",
    kr: "{team} | 라이브 매치, 일정 및 순위",
    vn: "{team} | Trực tiếp, Lịch thi đấu & Bảng xếp hạng",
    he: "{team} | שידור חי, לוח משחקים וטבלה",
    th: "{team} | สตรีมสด, โปรแกรมการแข่งขัน & ตารางคะแนน",
    ch: "{team} | Live-Spiel, Spielplan & Tabelle"
  },
  desc_template: {
    en: "Stream 2026 FIFA World Cup \"{team}\" match live including scores, standings, and highlights.",
    "en-us": "Stream 2026 FIFA World Cup \"{team}\" match live including scores, standings, and highlights.",
    ar: "شاهد البث المباشر لمباراة \"{team}\" في كأس العالم 2026 مع الأهداف والنتائج والملخصات.",
    az: "Hesablar, turnir cədvəli və ən maraqlı anlar daxil olmaqla, 2026 FIFA Dünya Kubokunun \"{team}\" oyununu canlı izləyin.",
    bn: "স্কোর, পয়েন্ট টেবিল এবং হাইলাইটস সহ ২০২৬ ফিফা বিশ্বকাপের \"{team}\" ম্যাচটি সরাসরি দেখুন।",
    cs: "Sledujte živý přenos zápasu Mistrovství světa FIFA 2026 \"{team}\", včetně výsledků, tabulek a sestřihů.",
    da: "Stream \"{team}\" live fra FIFA VM 2026, inklusiv resultater, stillinger og højdepunkter.",
    de: "Sehen Sie das FIFA WM 2026 Spiel \"{team}\" im Live-Stream mit Toren, Tabellen und Highlights.",
    el: "Παρακολουθήστε ζωντανά τον αγώνα του Παγκοσμίου Κυπέλλου FIFA 2026 \"{team}\" με σκορ, βαθμολογίες και στιγμιότυπα.",
    es: "Siga la transmisión en vivo del partido \"{team}\" de la Copa Mundial de la FIFA 2026, con marcadores, clasificaciones y resúmenes.",
    "es-la": "Siga la transmisión en vivo del partido \"{team}\" de la Copa Mundial de la FIFA 2026, con marcadores, clasificaciones y resúmenes.",
    fr: "Regardez le match de la Coupe du Monde de la FIFA 2026 \"{team}\" en direct avec les scores, le classement et les moments forts.",
    hi: "स्कोर, अंक तालिका और हाइलाइट्स सहित 2026 फीफा विश्व कप का \"{team}\" मैच लाइव स्ट्रीम देखें।",
    hr: "Gledajte uživo utakmicu FIFA Svjetskog prvenstva 2026. \"{team}\", uključujući rezultate, tablice i sažetke.",
    hu: "Nézze élőben a 2026-os FIFA Világbajnokság \"{team}\" mérkőzését eredményekkel, tabellákkal és összefoglalókkal.",
    id: "Saksikan siaran langsung pertandingan Piala Dunia FIFA 2026 \"{team}\" lengkap dengan skor, klasemen, dan sorotan.",
    it: "Segui in diretta streaming la partita della Coppa del Mondo FIFA 2026 \"{team}\", inclusi risultati, classifiche e azioni salienti.",
    nl: "Stream de FIFA Wereldbeker 2026-wedstrijd \"{team}\" live, inclusief scores, standen en hoogtepunten.",
    no: "Stream \"{team}\" live fra FIFA fotball-VM 2026 med resultater, tabeller og höydepunkter.",
    pl: "Oglądaj na żywo mecz Mistrzostw Świata FIFA 2026 \"{team}\", w tym wyniki, tabele i skróty meczów.",
    pt: "Assista ao vivo ao jogo \"{team}\" da Copa do Mundo FIFA 2026, incluindo placares, tabela e melhores momentos.",
    "pt-pt": "Assista ao vivo ao jogo \"{team}\" do Campeonato do Mundo FIFA 2026, incluindo resultados, classificações e resumos.",
    ro: "Urmărește live meciul \"{team}\" de la Cupa Mondială FIFA 2026, inclusiv scoruri, clasamente și rezumat.",
    ru: "Смотрите прямую трансляцию матча Чемпионата мира по футболу 2026 \"{team}\" с результатами, таблицами и обзорами.",
    sk: "Sledujte naživo zápas Majstrovstiev sveta FIFA 2026 \"{team}\" vrátane výsledkov, tabuliek a zostrihov.",
    sl: "Spremljajte prenos tekme Svetovnega prvenstva v nogometu FIFA 2026 \"{team}\" v živo, vključno z rezultati, lestvico in vrhunci.",
    sr: "Гледајте уживо утакмицу ФИФА Светског првенства 2026. \"{team}\", укључујући резултате, табеле и сажетке.",
    sv: "Streama \"{team}\" live från FIFA Fotbolls-VM 2026, inklusive resultat, tabeller och höjdpunkter.",
    tr: "Skorlar, puan durumları ve özetler dahil 2026 FIFA Dünya Kupası \"{team}\" maçını canlı izleyin.",
    zh: "在线观看2026年FIFA世界杯“{team}”比赛直播，包含比分、积分榜和集锦。",
    jp: "2026年FIFAワールドカップの「{team}」の全試合を無料オンラインライブ配信、結果、順位表、見どころからお届け。",
    kr: "2026 FIFA 월드컵 \"{team}\"의 모든 경기를 라이브 스코어, 순위, 하이라이트와 함께 실시간 스트리밍으로 감상하세요.",
    vn: "Xem trực tiếp trận đấu \"{team}\" tại FIFA World Cup 2026 bao gồm tỷ số, bảng xếp hạng và highlights.",
    he: "צפה בשידור חי במשחקי \"{team}\" בגביע העולם 2026 כולל תוצאות, בתים ותקצירים.",
    th: "รับชมการถ่ายทอดสดการแข่งขันของ \"{team}\" ในฟุตบอลโลก 2026 รวมถึงผลคะแนน ตารางคะแนน และไฮไลท์",
    ch: "Sehen Sie das FIFA WM 2026 Spiel \"{team}\" im Live-Stream mit Toren, Tabellen und Highlights."
  },
  not_found: {
    en: "Team Not Found | FIFA WC26 on Screen",
    "en-us": "Team Not Found | FIFA WC26 on Screen",
    ar: "لم يتم العثور على الفريق | فيفا كأس العالم 2026",
    az: "Komanda tapılmadı | FIFA WC26 on Screen",
    bn: "দল পাওয়া যায়নি | FIFA WC26 on Screen",
    cs: "Tým nebyl nalezen | FIFA WC26 on Screen",
    da: "Hold ikke fundet | FIFA WC26 on Screen",
    de: "Team nicht gefunden | FIFA Fussball-WM 2026",
    el: "Η ομάδα δεν βρέθηκε | FIFA WC26 on Screen",
    es: "Equipo no encontrado | Copa Mundial FIFA 2026",
    "es-la": "Equipo no encontrado | Copa Mundial FIFA 2026",
    fr: "Équipe non trouvée | FIFA WC26 on Screen",
    hi: "टीम नहीं मिली | फीफा विश्व कप 2026",
    hr: "Reprezentacija nije pronađena | FIFA WC26 on Screen",
    hu: "A csapat nem található | FIFA WC26 on Screen",
    id: "Tim Tidak Ditemukan | FIFA WC26 on Screen",
    it: "Squadra non trovata | FIFA WC26 on Screen",
    nl: "Team Niet Gevonden | FIFA WC26 on Screen",
    no: "Lag ikke funnet | FIFA WC26 on Screen",
    pl: "Nie znaleziono drużyny | FIFA WC26 on Screen",
    pt: "Seleção Não Encontrada | Copa do Mundo FIFA 2026",
    "pt-pt": "Jogo Não Encontrado | FIFA WC26 on Screen",
    ro: "Echipa nu a fost găsită | FIFA WC26 on Screen",
    ru: "Команда не найдена | FIFA WC26 на экране",
    sk: "Tím nebol nájdený | FIFA WC26 on Screen",
    sl: "Ekipa ni bila najdena | FIFA WC26 on Screen",
    sr: "Reprezentacija није пронађена | FIFA WC26 on Screen",
    sv: "Lag hittades inte | FIFA WC26 on Screen",
    tr: "Takım Bulunamadı | FIFA WC26 on Screen",
    zh: "未找到该球队 | FIFA WC26 on Screen",
    jp: "チームが見つかりません | FIFA WC26を画面で視聴",
    kr: "팀을 찾을 수 없습니다 | FIFA WC26 온 스크린",
    vn: "Không tìm thấy đội bóng | FIFA WC26 trên màn hình",
    he: "הנבחרת לא נמצאה | גביע העולם 2026",
    th: "ไม่พบทีม | FIFA WC26 บนหน้าจอ",
    ch: "Team nicht gefunden | FIFA Fussball-WM 2026"
  }
}

async function getTeamByIdOrSlug(id: string) {
  try {
    const allTeams = await db.select().from(teams)
    const target = id.toLowerCase().trim()
    return allTeams.find((t) => {
      const slug = t.name_en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      return (
        t.id.toLowerCase() === target ||
        t._id.toLowerCase() === target ||
        t.fifa_code?.toLowerCase() === target ||
        slug === target
      )
    })
  } catch (error) {
    console.error("Failed to query team from database:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const team = await getTeamByIdOrSlug(resolvedParams.id)
  const lang = await getLanguageFromServer()

  if (!team) {
    const notFoundTitle = METADATA_TRANSLATIONS.not_found[lang] || METADATA_TRANSLATIONS.not_found["en"]
    return {
      title: notFoundTitle,
    }
  }

  const teamName = getLocalizedTeamName(team, team.name_en, lang)
  const titleTemplate = METADATA_TRANSLATIONS.title_template[lang] || METADATA_TRANSLATIONS.title_template["en"]
  const descTemplate = METADATA_TRANSLATIONS.desc_template[lang] || METADATA_TRANSLATIONS.desc_template["en"]

  const title = titleTemplate.replace("{team}", teamName)
  const description = descTemplate.replace("{team}", teamName)
  const siteUrl = "https://fifaonscreen.com"
  const images = team.flag ? [getImageUrl(team.flag)] : [`${siteUrl}/logo.png`]

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

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <TeamClientPage teamId={resolvedParams.id} />
}
