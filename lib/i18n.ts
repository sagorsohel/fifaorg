// i18n Translation Dictionary and Locale Helper
// Supports 30 languages with auto-detection and local timezone formatting.

export type LanguageCode =
  | "en" | "en-us" | "ar" | "az" | "bn" | "cs" | "da" | "de" | "el" | "es"
  | "es-la" | "fr" | "hi" | "hr" | "hu" | "id" | "it" | "nl" | "no" | "pl"
  | "pt" | "pt-pt" | "ro" | "ru" | "sk" | "sl" | "sr" | "sv" | "tr" | "zh"
  | "jp" | "kr" | "vn" | "he" | "th" | "ch"

export interface LanguageConfig {
  code: LanguageCode
  name: string
  dir: "ltr" | "rtl"
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "en", name: "English (UK)", dir: "ltr" },
  { code: "en-us", name: "English (US)", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "az", name: "Azərbaycan", dir: "ltr" },
  { code: "bn", name: "বাংলা", dir: "ltr" },
  { code: "cs", name: "Čeština", dir: "ltr" },
  { code: "da", name: "Dansk", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "el", name: "Ελληνικά", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "es-la", name: "Español (Latinoamérica)", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "hr", name: "Hrvatski", dir: "ltr" },
  { code: "hu", name: "Magyar", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", dir: "ltr" },
  { code: "it", name: "Italiano", dir: "ltr" },
  { code: "nl", name: "Nederlands", dir: "ltr" },
  { code: "no", name: "Bokmål", dir: "ltr" },
  { code: "pl", name: "Polski", dir: "ltr" },
  { code: "pt", name: "Português (Brasil)", dir: "ltr" },
  { code: "pt-pt", name: "Português (Portugal)", dir: "ltr" },
  { code: "ro", name: "Română", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "sk", name: "Slovenčina", dir: "ltr" },
  { code: "sl", name: "Slovenščina", dir: "ltr" },
  { code: "sr", name: "Српски", dir: "ltr" },
  { code: "sv", name: "Svenska", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "jp", name: "日本語", dir: "ltr" },
  { code: "kr", name: "한국어", dir: "ltr" },
  { code: "vn", name: "Tiếng Việt", dir: "ltr" },
  { code: "he", name: "עברית", dir: "rtl" },
  { code: "th", name: "ไทย", dir: "ltr" },
  { code: "ch", name: "Switzerland", dir: "ltr" }
]

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  title: {
    en: "FIFA World Cup 2026", "en-us": "FIFA World Cup 2026", ar: "كأس العالم فيفا 2026",
    az: "FIFA Dünya Kuboku 2026", bn: "ফিফা বিশ্বকাপ ২০২৬", cs: "Mistrovství sveta FIFA 2026",
    da: "FIFA Fodbold-VM 2026", de: "FIFA Fussball-WM 2026", el: "Παγκόσμιο Κύπελλο FIFA 2026",
    es: "Copa Mundial de la FIFA 2026", "es-la": "Copa Mundial de la FIFA 2026", fr: "Coupe du Monde de la FIFA 2026",
    hi: "फीफा विश्व कप 2026", hr: "FIFA Svjetsko prvenstvo 2026.", hu: "FIFA Világbajnokság 2026",
    id: "Piala Dunia FIFA 2026", it: "Coppa del Mondo FIFA 2026", nl: "FIFA Wereldbeker 2026",
    no: "FIFA Fotball-VM 2026", pl: "Mistrzostwa Świata FIFA 2026", pt: "Copa do Mundo FIFA 2026",
    "pt-pt": "Campeonato do Mundo FIFA 2026", ro: "Cupa Mondială FIFA 2026", ru: "Чемпионат мира по футболу 2026",
    sk: "Majstrovstvá sveta FIFA 2026", sl: "Svetovno prvenstvo v nogometu FIFA 2026", sr: "ФИФА Светско првенство 2026",
    sv: "FIFA Fotbolls-VM 2026", tr: "2026 FIFA Dünya Kupası", zh: "2026年FIFA世界杯",
    jp: "FIFAワールドカップ 2026",
    kr: "FIFA 월드컵 2026",
    vn: "FIFA World Cup 2026",
    he: "גביע העולם של פיפ״א 2026",
    th: "ฟีฟ่าเวิลด์คัพ 2026"
  },
  subtitle: {
    en: "Teams & Matches Tracker", "en-us": "Teams & Matches Tracker", ar: "متابعة الفرق والمباريات",
    az: "Komanda və Oyun İzləyicisi", bn: "দল এবং ম্যাচ ট্র্যাকার", cs: "Sledování týmů a zápasů",
    da: "Hold- & Kamp-tracker", de: "Teams & Spiele Tracker", el: "Παρακολούθηση Ομάδων & Αγώνων",
    es: "Seguimiento de Equipos y Partidos", "es-la": "Seguimiento de Equipos y Partidos", fr: "Suivi des Équipes & Matchs",
    hi: "टीम और मैच ट्रैकर", hr: "Praćenje reprezentacija i utakmica", hu: "Csapat és mérkőzés követő",
    id: "Pelacak Tim & Pertandingan", it: "Tracciamento Squadre & Partite", nl: "Teams & Wedstrijden Tracker",
    no: "Lag- & Kamp-tracker", pl: "Śledzenie drużyn i meczów", pt: "Acompanhamento de Equipes e Jogos",
    "pt-pt": "Acompanhamento de Equipas e Jogos", ro: "Urmărire Echipe și Meciuri", ru: "Трекер команд и матчей",
    sk: "Sledovanie tímov a zápasov", sl: "Spremljevalec ekip in tekem", sr: "Праћење репрезентација и утакмица",
    sv: "Lag- & Match-tracker", tr: "Takımlar ve Maçlar Takipçisi", zh: "球队与赛程追踪器",
    jp: "チーム＆マッチトラッカー",
    kr: "팀 및 경기 추적기",
    vn: "Trình theo dõi đội bóng & trận đấu",
    he: "מעקב נבחרות ומשחקים",
    th: "ตัวติดตามทีมและข้อมูลการแข่งขัน"
  },
  match_center: {
    en: "Match Center", "en-us": "Match Center", ar: "مركز المباريات",
    az: "Oyun Mərkəzi", bn: "ম্যাচ সেন্টার", cs: "Centrum zápasů",
    da: "Kampcenter", de: "Spiel-Center", el: "Κέντρο Αγώνα",
    es: "Centro de Partido", "es-la": "Centro de Partido", fr: "Centre de Match",
    hi: "मैच सेंटर", hr: "Centar utakmice", hu: "Mérkőzés központ",
    id: "Pusat Pertandingan", it: "Centro Partite", nl: "Wedstrijdcentrum",
    no: "Kampsenter", pl: "Centrum meczowe", pt: "Centro da Partida",
    "pt-pt": "Centro do Jogo", ro: "Centru Meci", ru: "Матч-центр",
    sk: "Centrum zápasov", sl: "Središče za tekme", sr: "Центар утакмице",
    sv: "Matchcenter", tr: "Maç Merkezi", zh: "赛事中心",
    jp: "マッチセンター",
    kr: "매치 센터",
    vn: "Trung tâm Trận đấu",
    he: "מרכז המשחקים",
    th: "ศูนย์ข้อมูลการแข่งขัน"
  },
  fixtures: {
    en: "Fixtures", "en-us": "Fixtures", ar: "المباريات",
    az: "Oyunlar", bn: "ম্যাচ সূচী", cs: "Zápasy",
    da: "Kampprogram", de: "Spielplan", el: "Πρόγραμμα",
    es: "Calendario", "es-la": "Calendario", fr: "Calendrier",
    hi: "फिक्सचर", hr: "Raspored utakmica", hu: "Mérkőzések",
    id: "Jadwal Pertandingan", it: "Calendario", nl: "Programma",
    no: "Kampprogram", pl: "Terminarz", pt: "Jogos",
    "pt-pt": "Jogos", ro: "Program", ru: "Календарь",
    sk: "Rozpis zápasov", sl: "Spored tekem", sr: "Распоред утакмица",
    sv: "Kampprogram", tr: "Fikstür", zh: "赛程",
    jp: "日程・結果",
    kr: "경기 일정",
    vn: "Lịch thi đấu",
    he: "לוח משחקים",
    th: "โปรแกรมการแข่งขัน"
  },
  matches: {
    en: "Matches", "en-us": "Matches", ar: "المباريات",
    az: "Oyunlar", bn: "ম্যাচসমূহ", cs: "Zápasy",
    da: "Kampe", de: "Spiele", el: "Αγώνες",
    es: "Partidos", "es-la": "Partidos", fr: "Matchs",
    hi: "मैच", hr: "Utakmice", hu: "Mérkőzések",
    id: "Pertandingan", it: "Partite", nl: "Wedstrijden",
    no: "Kamper", pl: "Mecze", pt: "Partidas",
    "pt-pt": "Jogos", ro: "Meciuri", ru: "Матчи",
    sk: "Zápasy", sl: "Tekme", sr: "Утакмице",
    sv: "Matcher", tr: "Maçlar", zh: "比赛",
    jp: "試合",
    kr: "경기",
    vn: "Trận đấu",
    he: "משחקים",
    th: "การแข่งขัน"
  },
  today_matches: {
    en: "Today's Matches", "en-us": "Today's Matches", ar: "مباريات اليوم",
    az: "Bugünkü Oyunlar", bn: "আজকের ম্যাচ", cs: "Dnešní zápasy",
    da: "Dagens kampe", de: "Heutige Spiele", el: "Σημερινοί Αγώνες",
    es: "Partidos de hoy", "es-la": "Partidos de hoy", fr: "Matchs du jour",
    hi: "आज के मैच", hr: "Današnje utakmice", hu: "Mai mérkőzések",
    id: "Pertandingan Hari Ini", it: "Partite di Oggi", nl: "Wedstrijden van Vandaag",
    no: "Dagens kamper", pl: "Dzisiejsze mecze", pt: "Jogos de Hoje",
    "pt-pt": "Jogos de Hoje", ro: "Meciurile de azi", ru: "Матчи сегодня",
    sk: "Dnešné zápasy", sl: "Današnje tekme", sr: "Данашње утакмице",
    sv: "Dagens matcher", tr: "Bugünün Maçları", zh: "今日比赛",
    jp: "今日の試合",
    kr: "오늘의 경기",
    vn: "Trận đấu hôm nay",
    he: "משחקי היום",
    th: "การแข่งขันวันนี้"
  },
  team: {
    en: "Team", "en-us": "Team", ar: "الفريق",
    az: "Komanda", bn: "দল", cs: "Tým",
    da: "Hold", de: "Team", el: "Ομάδα",
    es: "Equipo", "es-la": "Equipo", fr: "Équipe",
    hi: "टीम", hr: "Reprezentacija", hu: "Csapat",
    id: "Tim", it: "Squadra", nl: "Team",
    no: "Lag", pl: "Drużyna", pt: "Equipe",
    "pt-pt": "Equipa", ro: "Echipă", ru: "Команда",
    sk: "Tím", sl: "Ekipa", sr: "Репрезентација",
    sv: "Lag", tr: "Takım", zh: "球队",
    jp: "チーム",
    kr: "팀",
    vn: "Đội",
    he: "נבחרת",
    th: "ทีม"
  },
  teams_groups: {
    en: "Teams & Groups", "en-us": "Teams & Groups", ar: "الفرق والمجموعات",
    az: "Komandalar və Qruplar", bn: "দল এবং গ্রুপ", cs: "Týmy a skupiny",
    da: "Hold & Grupper", de: "Teams & Gruppen", el: "Ομάδες & Όμιλοι",
    es: "Equipos y Grupos", "es-la": "Equipos y Grupos", fr: "Équipes & Groupes",
    hi: "टीमें और समूह", hr: "Skupine i reprezentacije", hu: "Csapatok és csoportok",
    id: "Tim & Grup", it: "Squadre & Gruppi", nl: "Teams & Groepen",
    no: "Lag & Grupper", pl: "Drużyny i grupy", pt: "Equipes e Grupos",
    "pt-pt": "Equipas e Grupos", ro: "Echipe și Grupe", ru: "Команды и группы",
    sk: "Tímy a skupiny", sl: "Ekipe in skupine", sr: "Репрезентације и групе",
    sv: "Lag & Grupper", tr: "Takımlar ve Gruplar", zh: "球队与分组",
    jp: "チーム＆グループ",
    kr: "팀 및 조",
    vn: "Đội bóng & Bảng đấu",
    he: "נבחרות ובתים",
    th: "ทีมและกลุ่ม"
  },
  groups: {
    en: "Groups", "en-us": "Groups", ar: "المجموعات",
    az: "Qruplar", bn: "গ্রুপ", cs: "Skupiny",
    da: "Grupper", de: "Gruppen", el: "Όμιλοι",
    es: "Grupos", "es-la": "Grupos", fr: "Groupes",
    hi: "समूह", hr: "Skupine", hu: "Csoportok",
    id: "Grup", it: "Gruppi", nl: "Groepen",
    no: "Grupper", pl: "Grupy", pt: "Grupos",
    "pt-pt": "Grupos", ro: "Grupe", ru: "Группы",
    sk: "Skupiny", sl: "Skupine", sr: "Групе",
    sv: "Grupper", tr: "Gruplar", zh: "分组",
    jp: "グループ",
    kr: "조별 리그",
    vn: "Bảng đấu",
    he: "בתים",
    th: "กลุ่ม"
  },
  search_placeholder: {
    en: "Search teams, matchdays, groups...", "en-us": "Search teams, matchdays, groups...", ar: "البحث عن الفرق، الأيام، المجموعات...",
    az: "Komandaları, oyun günlərini, qrupları axtar...", bn: "দল, ম্যাচডে, গ্রুপ খুঁজুন...", cs: "Hledat týmy, hrací dny, skupiny...",
    da: "Søg efter hold, spilledage, grupper...", de: "Teams, Spieltage, Gruppen suchen...", el: "Αναζήτηση ομάδων, αγωνιστικών, ομίλων...",
    es: "Buscar equipos, jornadas, grupos...", "es-la": "Buscar equipos, jornadas, grupos...", fr: "Rechercher des équipes, journées, groupes...",
    hi: "टीमें, मैच के दिन, समूह खोजें...", hr: "Pretraži reprezentacije, kola, skupine...", hu: "Csapatok, fordulók, csoportok keresése...",
    id: "Cari tim, hari pertandingan, grup...", it: "Cerca squadre, giornate, gruppi...", nl: "Zoek teams, speeldagen, groepen...",
    no: "Søk etter lag, spilledager, grupper...", pl: "Szukaj drużyn, kolejek, grup...", pt: "Buscar equipes, rodadas, grupos...",
    "pt-pt": "Procurar equipas, jornadas, grupos...", ro: "Caută echipe, etape, grupe...", ru: "Поиск команд, туров, групп...",
    sk: "Hľadať tímy, hracie dni, skupiny...", sl: "Išči ekipe, igralne dni, skupine...", sr: "Претражи репрезентације, кола, групе...",
    sv: "Sök efter lag, spelomgångar, grupper...", tr: "Takımları, maç günlerini, grupları ara...", zh: "搜索球队、比赛日、分组...",
    jp: "チーム、試合日、グループなどを検索...",
    kr: "팀, 경기일, 조 검색...",
    vn: "Tìm kiếm đội bóng, vòng đấu, bảng đấu...",
    he: "חיпуск נבחרות, ימי משחק, בתים...",
    th: "ค้นหาทีม, วันแข่งขัน, กลุ่ม..."
  },
  filter_matches: {
    en: "Filter matches:", "en-us": "Filter matches:", ar: "تصفية المباريات:",
    az: "Oyunları filtrlə:", bn: "ম্যাচ ফিল্টার:", cs: "Filtrovat zápasy:",
    da: "Filtrer kampe:", de: "Spiele filtern:", el: "Φιλτράρισμα αγώνων:",
    es: "Filtrar partidos:", "es-la": "Filtrar partidos:", fr: "Filtrer les matchs :",
    hi: "फ़िल्टर मैच:", hr: "Filtriraj utakmice:", hu: "Mérkőzések szűrése:",
    id: "Filter pertandingan:", it: "Filtra partite:", nl: "Filter wedstrijden:",
    no: "Filtrer kamper:", pl: "Filtruj mecze:", pt: "Filtrar jogos:",
    "pt-pt": "Filtrar jogos:", ro: "Filtrează meciuri:", ru: "Фильтр матчей:",
    sk: "Filtrovať zápasy:", sl: "Filtriraj tekme:", sr: "Филтрирај утакмице:",
    sv: "Filtrera matcher:", tr: "Maçları filtrele:", zh: "赛程 筛选：",
    jp: "試合をフィルター",
    kr: "경기 필터",
    vn: "Lọc trận đấu",
    he: "סינון משחקים",
    th: "กรองการแข่งขัน"
  },
  all_matches: {
    en: "All Matches", "en-us": "All Matches", ar: "كل المباريات",
    az: "Bütün Oyunlar", bn: "সব ম্যাচ", cs: "Všechny zápasy",
    da: "Alle kampe", de: "Alle Spiele", el: "Όλοι οι Αγώνες",
    es: "Todos los partidos", "es-la": "Todos los partidos", fr: "Tous les matchs",
    hi: "सभी मैच", hr: "Sve utakmice", hu: "Összes mérkőzés",
    id: "Semua Pertandingan", it: "Tutte le partite", nl: "Alle Wedstrijden",
    no: "Alle kamper", pl: "Wszystkie mecze", pt: "Todos os Jogos",
    "pt-pt": "Todos os Jogos", ro: "Toate meciurile", ru: "Все матчи",
    sk: "Všetky zápasy", sl: "Vse tekme", sr: "Све утакмице",
    sv: "Alla matcher", tr: "Tüm Maçlar", zh: "全部比赛",
    jp: "すべての試合",
    kr: "모든 경기",
    vn: "Tất cả trận đấu",
    he: "כל המשחקים",
    th: "การแข่งขันทั้งหมด"
  },
  finished: {
    en: "Finished", "en-us": "Finished", ar: "المنتهية",
    az: "Başa Çatdı", bn: "সমাপ্ত", cs: "Ukončeno",
    da: "Afsluttet", de: "Beendet", el: "Ολοκληρώθηκε",
    es: "Finalizado", "es-la": "Finalizado", fr: "Terminés",
    hi: "समाप्त", hr: "Završeno", hu: "Befejezett",
    id: "Selesai", it: "Terminate", nl: "Afgelopen",
    no: "Fullført", pl: "Zakończone", pt: "Encerrados",
    "pt-pt": "Terminados", ro: "Finalizat", ru: "Завершенные",
    sk: "Ukončené", sl: "Končano", sr: "Завршено",
    sv: "Slutspelade", tr: "Bitenler", zh: "已结束",
    jp: "終了",
    kr: "종료됨",
    vn: "Đã kết thúc",
    he: "הסתיים",
    th: "สิ้นสุดแล้ว"
  },
  upcoming: {
    en: "Upcoming", "en-us": "Upcoming", ar: "القادمة",
    az: "Gözlənilən", bn: "আসন্ন", cs: "Nadcházející",
    da: "Kommende", de: "Bevorstehend", el: "Προσεχές",
    es: "Próximos", "es-la": "Próximos", fr: "À venir",
    hi: "आगामी", hr: "Predstojeće", hu: "Közelgő",
    id: "Mendatang", it: "Prossime", nl: "Aankomend",
    no: "Kommende", pl: "Nadchodzące", pt: "Próximos",
    "pt-pt": "Próximos", ro: "Viitoare", ru: "Предстоящие",
    sk: "Nadchádzajúce", sl: "Prihajajoče", sr: "Предстојеће",
    sv: "Kommande", tr: "Gelecekler", zh: "即将进行",
    jp: "予定",
    kr: "예정됨",
    vn: "Sắp diễn ra",
    he: "טרם החל",
    th: "ยังไม่เริ่ม"
  },
  clear_filters: {
    en: "Clear Filters", "en-us": "Clear Filters", ar: "مسح التصفية",
    az: "Filtrləri Təmizlə", bn: "ফিল্টার মুছুন", cs: "Vymazat filtry",
    da: "Ryd filtre", de: "Filter löschen", el: "Καθαρισμός Φίλτρων",
    es: "Limpiar filtros", "es-la": "Limpiar filtros", fr: "Effacer les filtres",
    hi: "फ़िल्टर साफ़ करें", hr: "Očisti filtre", hu: "Szűrők törlése",
    id: "Bersihkan Filter", it: "Azzera filtri", nl: "Filters Wissen",
    no: "Nullstill filtre", pl: "Wyczyść filtry", pt: "Limpar Filtros",
    "pt-pt": "Limpar Filtros", ro: "Șterge filtrele", ru: "Сбросить фильтры",
    sk: "Vymazať filtre", sl: "Počisti filtre", sr: "Очисти филтре",
    sv: "Rensa filter", tr: "Filtreleri Temizle", zh: "清除筛选",
    jp: "フィルターをクリア",
    kr: "필터 초기화",
    vn: "Xóa bộ lọc",
    he: "ניקוי מסננים",
    th: "ล้างตัวกรอง"
  },
  select_group_stage: {
    en: " Knockout Stage:", "en-us": " Knockout Stage:", ar: "اختر المجموعة أو مرحلة خروج المغلوب:",
    az: "Qrupu və ya Pley-off mərhələsini seçin:", bn: "গ্রুপ বা নকআউট পর্ব নির্বাচন করুন:", cs: "Vyberte skupinu nebo vyřazovací fázi:",
    da: "Vælg gruppe- eller knockoutfase:", de: "Gruppe oder K.-o.-Phase wählen:", el: "Επιλέξτε Όμιλο ή Φάση Νοκ-Άουτ:",
    es: "Seleccione Grupo o Fase Eliminatoria:", "es-la": "Seleccione Grupo o Fase Eliminatoria:", fr: "Sélectionnez un Groupe ou une Phase Finale :",
    hi: "समूह या नॉकआउट चरण चुनें:", hr: "Odaberi skupinu ili nokaut fazu:", hu: "Csoport vagy kieséses szakasz választása:",
    id: "Pilih Grup atau Fase Gugur:", it: "Seleziona Gruppo o Fase a Eliminazione Diretta:", nl: "Selecteer Groep of Knock-outfase:",
    no: "Velg gruppe eller sluttspillfase:", pl: "Wybierz grupę lub fazę pucharową:", pt: "Selecione o Grupo ou Fase Eliminatória:",
    "pt-pt": "Selecione o Grupo ou Fase de Eliminação:", ro: "Selectează Grupa sau Faza Eliminatorie:", ru: "Выберите группу или стадию плей-офф:",
    sk: "Vyberte skupinu alebo vyraďovaciu fázu:", sl: "Izberite skupino ali izločilni del:", sr: "Изабери групу или нокаут фазу:",
    sv: "Välj grupp eller slutspelsfas:", tr: "Grup veya Eleme Aşaması Seçin:", zh: "选择分组 or 淘汰赛阶段：",
    jp: "グループステージ選択",
    kr: "조별 리그 선택",
    vn: "Chọn vòng bảng",
    he: "בחר שלב בתים",
    th: "เลือกการแข่งขันรอบแบ่งกลุ่ม"
  },
  reset_groups: {
    en: "Reset to All Groups", "en-us": "Reset to All Groups", ar: "إعادة تعيين إلى كل المجموعات",
    az: "Bütün qruplara qaytar", bn: "সব গ্রুপ রিসেট করুন", cs: "Resetovat na všechny skupiny",
    da: "Nulstil til alle grupper", de: "Auf alle Gruppen zurücksetzen", el: "Επαναφορά σε όλους τους Ομίλους",
    es: "Restablecer a todos los grupos", "es-la": "Restablecer a todos los grupos", fr: "Réinitialiser à tous les groupes",
    hi: "सभी समूहों पर रीसेट करें", hr: "Vrati na sve skupine", hu: "Visszaállítás az összes csoportra",
    id: "Reset ke Semua Grup", it: "Reimposta su tutti i gruppi", nl: "Herstellen naar Alle Groepen",
    no: "Nullstill til alle grupper", pl: "Resetuj do wszystkich grup", pt: "Restaurar todos os grupos",
    "pt-pt": "Repor todas as equipas", ro: "Resetează la toate grupele", ru: "Сбросить на все группы",
    sk: "Resetovať na všetky skupiny", sl: "Ponastavi na vse skupine", sr: "Врати на све групе",
    sv: "Återställ till alla grupper", tr: "Tüm Gruplara Sıfırla", zh: "重置为全部分组",
    jp: "グループをリセット",
    kr: "그룹 초기화",
    vn: "Đặt lại bảng đấu",
    he: "איפוס בתים",
    th: "รีเซ็ตกลุ่ม"
  },
  total_matches: {
    en: "Total Matches", "en-us": "Total Matches", ar: "إجمالي المباريات",
    az: "Ümumi Oyunlar", bn: "মোট ম্যাচ", cs: "Zápasů celkem",
    da: "Kampe i alt", de: "Spiele insgesamt", el: "Σύνολο Αγώνων",
    es: "Total de partidos", "es-la": "Total de partidos", fr: "Total des matchs",
    hi: "कुल मैच", hr: "Ukupno utakmica", hu: "Összes mérkőzés",
    id: "Total Pertandingan", it: "Partite Totali", nl: "Totaal Wedstrijden",
    no: "Kamper totalt", pl: "Meczów łącznie", pt: "Total de Jogos",
    "pt-pt": "Total de Jogos", ro: "Total Meciuri", ru: "Всего матчей",
    sk: "Zápasy celkovo", sl: "Skupaj tekem", sr: "Укупно утакмица",
    sv: "Matcher totalt", tr: "Toplam Maçlar", zh: "总比赛场次",
    jp: "総試合数",
    kr: "총 경기 수",
    vn: "Tổng số trận đấu",
    he: "סה״כ משחקים",
    th: "การแข่งขันทั้งหมด"
  },
  played: {
    en: "Played", "en-us": "Played", ar: "الملعوبة",
    az: "Oynanıldı", bn: "খেলা হয়েছে", cs: "Odehráno",
    da: "Spillet", de: "Gespielt", el: "Διεξήχθησαν",
    es: "Jugados", "es-la": "Jugados", fr: "Joués",
    hi: "खेला गया", hr: "Odigrano", hu: "Lejátszott",
    id: "Dimainkan", it: "Giocate", nl: "Gespeeld",
    no: "Spilt", pl: "Rozegrane", pt: "Jogados",
    "pt-pt": "Jogados", ro: "Jucate", ru: "Сыграно",
    sk: "Odehrané", sl: "Odigrano", sr: "Одиграно",
    sv: "Spelade", tr: "Oynananlar", zh: "已赛",
    jp: "消化済",
    kr: "진행됨",
    vn: "Đã chơi",
    he: "שוחקו",
    th: "แข่งแล้ว"
  },
  teams: {
    en: "Teams", "en-us": "Teams", ar: "الفرق",
    az: "Komandalar", bn: "দলসমূহ", cs: "Týmy",
    da: "Hold", de: "Teams", el: "Ομάδες",
    es: "Equipos", "es-la": "Equipos", fr: "Équipes",
    hi: "टीमें", hr: "Reprezentacije", hu: "Csapatok",
    id: "Tim", it: "Squadre", nl: "Teams",
    no: "Lag", pl: "Drużyny", pt: "Equipes",
    "pt-pt": "Equipas", ro: "Echipe", ru: "Команды",
    sk: "Tímy", sl: "Ekipe", sr: "Репрезентације",
    sv: "Lag", tr: "Takımlar", zh: "球队",
    jp: "チーム",
    kr: "팀",
    vn: "Đội",
    he: "נבחרות",
    th: "ทีม"
  },
  played_matches: {
    en: "Played Matches", "en-us": "Played Matches", ar: "المباريات الملعوبة",
    az: "Oynanılmış Oyunlar", bn: "খেলা হওয়া ম্যাচ", cs: "Odehrané zápasy",
    da: "Spillede kampe", de: "Gespielte Spiele", el: "Αγώνες που Διεξήχθησαν",
    es: "Partidos Jugados", "es-la": "Partidos Jugados", fr: "Matchs joués",
    hi: "खेले गए मैच", hr: "Odigrane utakmice", hu: "Lejátszott mérkőzések",
    id: "Pertandingan Selesai", it: "Partite Giocate", nl: "Gespeelde Wedstrijden",
    no: "Spilte kamper", pl: "Rozegrane mecze", pt: "Jogos Realizados",
    "pt-pt": "Jogos Realizados", ro: "Meciuri Jucate", ru: "Сыгранные матчи",
    sk: "Odehrané zápasy", sl: "Odigrane tekme", sr: "Одигране утакмице",
    sv: "Spelade matcher", tr: "Oynanan Maçlar", zh: "已赛场次",
    jp: "終了した試合",
    kr: "진행된 경기",
    vn: "Trận đấu đã chơi",
    he: "משחקים ששוחקו",
    th: "แมตช์ที่แข่งแล้ว"
  },
  upcoming_matches: {
    en: "Upcoming Matches", "en-us": "Upcoming Matches", ar: "المباريات القادمة",
    az: "Gözlənilən Oyunlar", bn: "আসন্ন ম্যাচ", cs: "Nadcházející zápasy",
    da: "Kommende kampe", de: "Bevorstehende Spiele", el: "Προσεχείς Αγώνες",
    es: "Partidos Próximos", "es-la": "Partidos Próximos", fr: "Matchs à venir",
    hi: "आगामी मैच", hr: "Predstojeće utakmice", hu: "Közelgő mérkőzések",
    id: "Pertandingan Mendatang", it: "Prossime Partite", nl: "Aankomende Wedstrijden",
    no: "Kommende kamper", pl: "Nadchodzące mecze", pt: "Próximos Jogos",
    "pt-pt": "Próximos Jogos", ro: "Meciuri Viitoare", ru: "Предстоящие матчи",
    sk: "Nadchádzajúce zápasy", sl: "Prihajajoče tekme", sr: "Предстојеће утакмице",
    sv: "Kommande matcher", tr: "Gelecek Maçlar", zh: "即将进行比赛",
    jp: "今後の試合",
    kr: "예정된 경기",
    vn: "Trận đấu sắp tới",
    he: "משחקים קרובים",
    th: "แมตช์ที่กำลังจะมาถึง"
  },
  back_dashboard: {
    en: "Back to Dashboard", "en-us": "Back to Dashboard", ar: "العودة إلى اللوحة الرئيسية",
    az: "İdarə Panelinə Qayıt", bn: "ড্যাশবোর্ডে ফিরে যান", cs: "Zpět na nástěnku",
    da: "Tilbage til instrumentbræt", de: "Zurück zum Dashboard", el: "Επιστροφή στο Dashboard",
    es: "Volver al Panel", "es-la": "Volver al Panel", fr: "Retour au Tableau de bord",
    hi: "डैशबोर्ड पर वापस जाएं", hr: "Natrag na nadzornu ploču", hu: "Vissza a műszerfalra",
    id: "Kembali ke Dasbor", it: "Torna alla Dashboard", nl: "Terug naar Dashboard",
    no: "Tilbake til dashboard", pl: "Powrót do pulpitu", pt: "Voltar para o Painel",
    "pt-pt": "Voltar ao Panel", ro: "Înapoi la Panou", ru: "Назад на панель",
    sk: "Späť na nástenku", sl: "Nazaj na nadzorno ploščo", sr: "Назад на контролну таблу",
    sv: "Tillbaka till översikten", tr: "Panoya Geri Dön", zh: "返回控制台",
    jp: "ダッシュボードに戻る",
    kr: "대시보드로 돌아가기",
    vn: "Quay lại bảng điều khiển",
    he: "חזרה ללוח הבקרה",
    th: "กลับไปที่แดชบอร์ด"
  },
  back_timeline: {
    en: "Back to Timeline", "en-us": "Back to Timeline", ar: "العودة إلى الجدول الزمني",
    az: "Zaman Şnurluna Qayıt", bn: "টাইমলাইনে ফিরে যান", cs: "Zpět na časovou osu",
    da: "Tilbage til tidslinje", de: "Zurück zur Timeline", el: "Επιστροφή στο Χρονολόγιο",
    es: "Volver a la línea de tiempo", "es-la": "Volver a la línea de tiempo", fr: "Retour au Fil d'actualité",
    hi: "समय रेखा पर वापस", hr: "Natrag na raspored", hu: "Vissza az idővonalhoz",
    id: "Kembali ke Linimasa", it: "Torna alla Cronologia", nl: "Terug naar Tijdlijn",
    no: "Tilbake til tidslinje", pl: "Powrót do osi czasu", pt: "Voltar para a Linha do Tempo",
    "pt-pt": "Voltar à Linha do Tempo", ro: "Înapoi la Cronologie", ru: "Назад к расписанию",
    sk: "Späť na časovú os", sl: "Nazaj na časovnico", sr: "Назад на распоред",
    sv: "Tillbaka till tidslinjen", tr: "Zaman Çizelgesine Dön", zh: "返回赛程表",
    jp: "タイムラインに戻る",
    kr: "타임라인으로 돌아가기",
    vn: "Quay lại dòng thời gian",
    he: "חזרה לציר הזמן",
    th: "กลับไปที่ไทม์ไลน์"
  },
  stadium: {
    en: "Stadium", "en-us": "Stadium", ar: "الملعب",
    az: "Stadion", bn: "স্টেডিয়াম", cs: "Stadion",
    da: "Stadion", de: "Stadion", el: "Στάδιο",
    es: "Estadio", "es-la": "Estadio", fr: "Stade",
    hi: "स्टेडियम", hr: "Stadion", hu: "Stadion",
    id: "Stadion", it: "Stadio", nl: "Stadion",
    no: "Stadion", pl: "Stadion", pt: "Estádio",
    "pt-pt": "Estádio", ro: "Stadion", ru: "Стадион",
    sk: "Štadión", sl: "Stadion", sr: "Стадион",
    sv: "Stadion", tr: "Stadyum", zh: "体育场",
    jp: "スタジアム",
    kr: "경기장",
    vn: "Sân vận động",
    he: "אצטדיון",
    th: "สนามแข่งขัน"
  },
  goal_scorers: {
    en: "Goal Scorers", "en-us": "Goal Scorers", ar: "مسجلو الأهداف",
    az: "Qol Vuranlar", bn: "গোলদাতা", cs: "Střelci gólů",
    da: "Målscorere", de: "Torschützen", el: "Σκόρερ",
    es: "Goleadores", "es-la": "Goleadores", fr: "Buteurs",
    hi: "गोल करने वाले", hr: "Strijelci", hu: "Gólszerzők",
    id: "Pencetak Gol", it: "Marcatori", nl: "Doelpuntenmakers",
    no: "Målscorere", pl: "Strzelcy bramek", pt: "Goleadores",
    "pt-pt": "Marcadores", ro: "Marcatori", ru: "Авторы голов",
    sk: "Strelci gólov", sl: "Strelci", sr: "Стрелци",
    sv: "Målskyttar", tr: "Golcüler", zh: "进球球员",
    jp: "得点者",
    kr: "득점자",
    vn: "Cầu thủ ghi bàn",
    he: "כובשי השערים",
    th: "ผู้ทำประตู"
  },
  stadium_stats: {
    en: "Stadium Stats", "en-us": "Stadium Stats", ar: "إحصائيات الملعب",
    az: "Stadion Statistikaları", bn: "স্টেডিয়ামের তথ্য", cs: "Statistiky stadionu",
    da: "Stadion-stats", de: "Stadion-Statistiken", el: "Στατιστικά Σταδίου",
    es: "Estadísticas del Estadio", "es-la": "Estadísticas del Estadio", fr: "Infos Stade",
    hi: "स्टेडियम आँकड़े", hr: "Podaci o stadionu", hu: "Stadion statisztikák",
    id: "Statistik Stadion", it: "Statistiche Stadio", nl: "Stadionstatistieken",
    no: "Stadion-statistikk", pl: "Statystyki stadionu", pt: "Estatísticas do Estádio",
    "pt-pt": "Estatísticas do Estádio", ro: "Statistici Stadion", ru: "О стадионе",
    sk: "Štatistiky štadióna", sl: "Statistika stadiona", sr: "Подаци о стадиону",
    sv: "Stadionstatistik", tr: "Stadyum İstatistikleri", zh: "体育场信息",
    jp: "スタジアム統計",
    kr: "경기장 통계",
    vn: "Thống kê sân vận động",
    he: "נתוני האצטדיון",
    th: "สถิติสนามแข่งขัน"
  },
  capacity: {
    en: "Capacity", "en-us": "Capacity", ar: "السعة",
    az: "Tutumu", bn: "ধারণক্ষমতা", cs: "Kapacita",
    da: "Kapacitet", de: "Kapazität", el: "Χωρητικότητα",
    es: "Capacidad", "es-la": "Capacidad", fr: "Capacité",
    hi: "क्षमता", hr: "Kapacitet", hu: "Befogadóképesség",
    id: "Kapasitas", it: "Capacità", nl: "Capaciteit",
    no: "Kapasitet", pl: "Pojemność", pt: "Capacidade",
    "pt-pt": "Capacidade", ro: "Capacitate", ru: "Вместимость",
    sk: "Kapacita", sl: "Kapaciteta", sr: "Капацитет",
    sv: "Kapacitet", tr: "Kapasite", zh: "容纳人数",
    jp: "収容人数",
    kr: "수용 인원",
    vn: "Sức chứa",
    he: "תכולה",
    th: "ความจุสนาม"
  },
  location: {
    en: "Location", "en-us": "Location", ar: "الموقع",
    az: "Yerləşdiyi yer", bn: "অবস্থান", cs: "Lokalita",
    da: "Beliggenhed", de: "Standort", el: "Τοποθεσία",
    es: "Ubicación", "es-la": "Ubicación", fr: "Lieu",
    hi: "स्थान", hr: "Lokacija", hu: "Helyszín",
    id: "Lokasi", it: "Luogo", nl: "Locatie",
    no: "Beliggenhet", pl: "Lokalizacja", pt: "Localização",
    "pt-pt": "Localização", ro: "Locație", ru: "Местоположение",
    sk: "Umiestnenie", sl: "Lokacija", sr: "Локација",
    sv: "Plats", tr: "Konum", zh: "地点",
    jp: "所在地",
    kr: "위치",
    vn: "Địa điểm",
    he: "מיקום",
    th: "สถานที่"
  },
  seats: {
    en: "seats", "en-us": "seats", ar: "مقعد",
    az: "oturacaq", bn: "আসন", cs: "sedadel",
    da: "sæder", de: "Plätze", el: "θέσεις",
    es: "asientos", "es-la": "asientos", fr: "sièges",
    hi: "सीटें", hr: "mjesta", hu: "ülés",
    id: "kursi", it: "posti", nl: "stoelen",
    no: "seter", pl: "miejsc", pt: "assentos",
    "pt-pt": "lugares", ro: "locuri", ru: "мест",
    sk: "sedadiel", sl: "sedišč", sr: "места",
    sv: "platser", tr: "koltuk", zh: "席位",
    jp: "席",
    kr: "석",
    vn: "Chỗ ngồi",
    he: "מושבים",
    th: "ที่นั่ง"
  },
  match_schedule: {
    en: "Match Schedule", "en-us": "Match Schedule", ar: "جدول المباريات",
    az: "Oyun Cədvəli", bn: "ম্যাচের সময়সূচী", cs: "Rozpis zápasů",
    da: "Kampplan", de: "Spielplan", el: "Πρόγραμμα Αγώνα",
    es: "Calendario de Partidos", "es-la": "Calendario de Partidos", fr: "Calendrier du match",
    hi: "मैच अनुसूची", hr: "Raspored utakmice", hu: "Mérkőzés menetrend",
    id: "Jadwal Pertandingan", it: "Programma Partite", nl: "Wedstrijdschema",
    no: "Kampoppsett", pl: "Terminarz meczów", pt: "Calendário do Jogo",
    "pt-pt": "Calendário do Jogo", ro: "Program Meci", ru: "Расписание матча",
    sk: "Rozpis zápasov", sl: "Urnik tekem", sr: "Распоред утакмице",
    sv: "Matchschema", tr: "Maç Takvimi", zh: "比赛日程",
    jp: "試合日程",
    kr: "경기 일정",
    vn: "Lịch thi đấu",
    he: "לוח זמנים למשחק",
    th: "ตารางเวลาการแข่งขัน"
  },
  local_kickoff: {
    en: "Local Kickoff Time", "en-us": "Local Kickoff Time", ar: "وقت الركلة الحرة المحلي",
    az: "Yerli Başlama Vaxtı", bn: "স্থানীয় শুরুর সময়", cs: "Místní čas výkopu",
    da: "Lokal kickoff-tid", de: "Lokale Anstoßzeit", el: "Τοπική Ώρα Έναρξης",
    es: "Hora de Inicio Local", "es-la": "Hora de Inicio Local", fr: "Heure de coup d'envoi locale",
    hi: "स्थानीय किकऑफ समय", hr: "Lokalno vrijeme početka", hu: "Helyi kezdési idő",
    id: "Waktu Mulai Lokal", it: "Orario d'Inizio Locale", nl: "Lokale Aftraptijd",
    no: "Lokal avsparkstid", pl: "Lokalny czas rozpoczęcia", pt: "Hora de Início Local",
    "pt-pt": "Hora de Início Local", ro: "Ora de începere locală", ru: "Местное время начала",
    sk: "Miestny čas výkopu", sl: "Lokalni čas začetka", sr: "Локално време почетка",
    sv: "Lokal avsparkstid", tr: "Yerel Başlama Saati", zh: "当地开球时间",
    jp: "現地のキックオフ時間",
    kr: "현지 킥오프",
    vn: "Giờ bắt đầu địa phương",
    he: "שעת בעיטת הפתיחה המקומית",
    th: "เวลาคิกออฟตามเวลาท้องถิ่น"
  },
  match_statistics: {
    en: "Match Statistics", "en-us": "Match Statistics", ar: "إحصائيات المباراة",
    az: "Oyun Statistikaları", bn: "ম্যাচের পরিসংখ্যান", cs: "Statistiky zápasu",
    da: "Kampstatistik", de: "Spiel-Statistiken", el: "Στατιστικά Αγώνα",
    es: "Estadísticas del Partido", "es-la": "Estadísticas del Partido", fr: "Statistiques du Match",
    hi: "मैच के आँकड़े", hr: "Statistika utakmice", hu: "Mérkőzés statisztikák",
    id: "Statistik Pertandingan", it: "Statistiche della partita", nl: "Wedstrijdstatistieken",
    no: "Kampstatistikk", pl: "Statystyki meczu", pt: "Estatísticas da Partida",
    "pt-pt": "Estatísticas do Jogo", ro: "Statistici Meci", ru: "Статистика матча",
    sk: "Štatistiky zápasu", sl: "Statistika tekme", sr: "Статистика утакмице",
    sv: "Matchstatistik", tr: "Maç İstatistikleri", zh: "比赛数据",
    jp: "試合統計",
    kr: "경기 통계",
    vn: "Thống kê trận đấu",
    he: "סטטיסטיקת המשחק",
    th: "สถิติการแข่งขัน"
  },
  possession: {
    en: "Possession", "en-us": "Possession", ar: "الاستحواذ",
    az: "Topa sahib olma", bn: "পজেশন", cs: "Držení míče",
    da: "Boldbesiddelse", de: "Ballbesitz", el: "Κατοχή Μπάλας",
    es: "Posesión", "es-la": "Posesión", fr: "Possession",
    hi: "कब्ज़ा", hr: "Posjed lopte", hu: "Labdabirtoklás",
    id: "Penguasaan Bola", it: "Possesso Palla", nl: "Balbezit",
    no: "Ballbesittelse", pl: "Posiadanie piłki", pt: "Posse de Bola",
    "pt-pt": "Posse de Bola", ro: "Posesie", ru: "Владение мячом",
    sk: "Držanie lopty", sl: "Posest žoge", sr: "Посед лопте",
    sv: "Bollinnehav", tr: "Topa Sahip Olma", zh: "控球率",
    jp: "ボール支配率",
    kr: "점유율",
    vn: "Kiểm soát bóng",
    he: "החזקת כדור",
    th: "อัตราการครองบอล"
  },
  shots: {
    en: "Shots", "en-us": "Shots", ar: "التسديدات",
    az: "Zərbələr", bn: "শট", cs: "Střely",
    da: "Skud", de: "Schüsse", el: "Σουτ",
    es: "Disparos", "es-la": "Disparos", fr: "Tirs",
    hi: "शॉट्स", hr: "Udarci", hu: "Lövések",
    id: "Tembakan", it: "Tiri", nl: "Schoten",
    no: "Skudd", pl: "Strzały", pt: "Chutes",
    "pt-pt": "Remates", ro: "Șuturi", ru: "Удары",
    sk: "Strely", sl: "Streli", sr: "Ударци",
    sv: "Skott", tr: "Şutlar", zh: "射门",
    jp: "シュート数",
    kr: "슈팅",
    vn: "Cú sút",
    he: "בעיטות",
    th: "โอกาสยิง"
  },
  fouls: {
    en: "Fouls", "en-us": "Fouls", ar: "الأخطاء",
    az: "Qaydalar pozulması", bn: "ফাউল", cs: "Fauly",
    da: "Frispark", de: "Fouls", el: "Φάουλ",
    es: "Faltas", "es-la": "Faltas", fr: "Fautes",
    hi: "फ़ाउल", hr: "Prekršaji", hu: "Szabálytalanság",
    id: "Pelanggaran", it: "Falli", nl: "Overtredingen",
    no: "Frispark", pl: "Faule", pt: "Faltas",
    "pt-pt": "Faltas", ro: "Faulturi", ru: "Фолы",
    sk: "Fauly", sl: "Prekrški", sr: "Прекршаји",
    sv: "Regelbrott", tr: "Fauller", zh: "犯规",
    jp: "ファウル数",
    kr: "파울",
    vn: "Phạm lỗi",
    he: "עבירות",
    th: "ฟาวล์"
  },
  signup_title: {
    en: "Please Sign Up to Watch every match live", "en-us": "Please Sign Up to Watch every match live", ar: "يرجى التسجيل لمشاهدة كل مباراة مباشرة",
    az: "Hər oyunu canlı izləmək üçün qeydiyyatdan keçin", bn: "প্রতিটি ম্যাচ সরাসরি দেখতে সাইন আপ করুন", cs: "Zaregistrujte se pro sledování každého zápasu živě",
    da: "Opret en bruger for at se hver kamp live", de: "Bitte registrieren Sie sich, um jedes Spiel live zu sehen", el: "Εγγραφείτε για να παρακολουθήσετε κάθε αγώνα ζωντανά",
    es: "Regístrese para ver cada partido en vivo", "es-la": "Regístrese para ver cada partido en vivo", fr: "Inscrivez-vous pour regarder chaque match en direct",
    hi: "हर मैच लाइव देखने के लिए साइन अप करें", hr: "Registrirajte se za gledanje svake utakmice uživo", hu: "Regisztráljon minden mérkőzés élő közvetítéséhez",
    id: "Silakan Daftar untuk Menonton Setiap Pertandingan Langsung", it: "Registrati per guardare ogni partita in diretta", nl: "Meld je aan om elke wedstrijd live te bekijken",
    no: "Registrer deg for å se hver kamp live", pl: "Zarejestruj się, aby oglądać każdy mecz na żywo", pt: "Cadastre-se para Assistir a cada Jogo ao Vivo",
    "pt-pt": "Registe-se para Assistir a cada Jogo ao Vivo", ro: "Înregistrează-te pentru a viziona fiecare meci live", ru: "Зарегистрируйтесь, чтобы смотреть каждый матч в эфире",
    sk: "Zaregistrujte sa a sledujte každý zápas naživo", sl: "Registrirajte se za ogled vsake tekme v živo", sr: "Региструјте се за гледање сваке утакмице уживо",
    sv: "Registrera dig för att se varje match live", tr: "Her Maçı Canlı İzlemek İçin Üye Olun", zh: "请注册以观看每场比赛直播",
    jp: "無料アカウント登録でHDライブ配信を視聴可能",
    kr: "HD 라이브 스트림을 보려면 무료 계정을 만드십시오",
    vn: "Tạo tài khoản miễn phí để xem trực tiếp HD",
    he: "צור חשבון בחינם כדי לצפות בשידור חי ב-HD",
    th: "สร้างบัญชีฟรีเพื่อรับชมการถ่ายทอดสดแบบ HD"
  },
  live_stream: {
    en: "FOOTBALL LIVE STREAM", "en-us": "FOOTBALL LIVE STREAM", ar: "بث مباشر لكرة القدم",
    az: "FUTBOL CANLI YAYIMI", bn: "ফুটবল লাইভ স্ট্রিম", cs: "ŽIVÝ PŘENOS FOTBALU",
    da: "LIVE-STREAMING AF FODBOLD", de: "FUSSBALL LIVE-STREAM", el: "ΖΩΝΤΑΝΗ ΜΕΤΑΔΟΣΗ ΠΟΔΟΣΦΑΙΡΟΥ",
    es: "TRANSMISIÓN DE FÚTBOL EN VIVO", "es-la": "TRANSMISIÓN DE FÚTBOL EN VIVO", fr: "MATCH EN DIRECT STREAMING",
    hi: "फुटबॉल लाइव स्ट्रीम", hr: "NOGOMET PRIJENOS UŽIVO", hu: "FOCI ÉLŐ KÖZVETÍTÉS",
    id: "SIARAN LANGSUNG SEPAK BOLA", it: "DIRETTA STREAMING CALCIO", nl: "LIVE VOETBALSTREAM",
    no: "FOTBALL LIVE-STREAM", pl: "TRANSMISJA MECZU NA ŻYWO", pt: "TRANSMISSÃO AO VIVO DE FUTEBOL",
    "pt-pt": "TRANSMISSÃO AO VIVO DE FUTEBOL", ro: "TRANSMISIE LIVE FOTBAL", ru: "ФУТБОЛЬНАЯ ТРАНСЛЯЦИЯ",
    sk: "FUTBAL NAŽIVO STREAM", sl: "NOGOMET PRENOS V ŽIVO", sr: "ФУДБАЛ ПРЕНОС УЖИВО",
    sv: "FOTBOLLS-LIVE-STREAM", tr: "FUTBOL CANLI YAYIN", zh: "足球比赛直播",
    jp: "無料ライブ配信",
    kr: "무료 라이브 스트림",
    vn: "Phát trực tiếp miễn phí",
    he: "שידור חי בחינם",
    th: "สตรีมสดฟรี"
  },
  signup_btn: {
    en: "SIGN UP & WATCH NOW!", "en-us": "SIGN UP & WATCH NOW!", ar: "سجل وشاهد الآن!",
    az: "QEYDİYYATDAN KEÇ VƏ İZLƏ!", bn: "সাইন আপ করুন এবং এখনই দেখুন!", cs: "ZAREGISTRUJTE SE A SLEDUJTE HNED!",
    da: "OPRET BRUGER & SE NU!", de: "JETZT REGISTRIEREN & ANSEHEN!", el: "ΕΓΓΡΑΦΗ & ΠΑΡΑΚΟΛΟΥΘΗΣΗ ΤΩΡΑ!",
    es: "¡REGÍSTRATE Y MIRA AHORA!", "es-la": "¡REGÍSTRATE Y MIRA AHORA!", fr: "S'INSCRIRE & REGARDER MAINTENANT !",
    hi: "साइन अप करें और अभी देखें!", hr: "REGISTRIRAJ SE I GLEDAJ ODMAH!", hu: "REGISZTRÁLJON ÉS NÉZZE MOST!",
    id: "DAFTAR & TONTON SEKARANG!", it: "REGISTRATI & GUARDA ORA!", nl: "MELD JE AAN & BEKIJK NU!",
    no: "REGISTRER DEG & SE NÅ!", pl: "ZAREJESTRUJ SIĘ I OGLĄDAJ!", pt: "CADASTRE-SE E ASSISTA AGORA!",
    "pt-pt": "REGISTE-SE E ASSISTA AGORA!", ro: "ÎNREGISTREAZĂ-TE ȘI VEZI ACUM!", ru: "ЗАПИШИСЬ И СМОТРИ СЕЙЧАС!",
    sk: "ZAREGISTRUJTE SA A SLEDUJTE!", sl: "REGISTRIRAJ SE IN GLEJ ZDAJ!", sr: "РЕГИСТРУЈ СЕ И ГЛЕДАЈ ОДМАХ!",
    sv: "REGISTRERA DIG & SE NU!", tr: "KAYDOL VE ŞİMDİ İZLE!", zh: "立即注册观看！",
    jp: "今すぐ無料登録",
    kr: "지금 무료 계정 등록",
    vn: "Đăng ký tài khoản miễn phí ngay",
    he: "הרשם לחשבון חינם עכשיו",
    th: "สมัครสมาชิกฟรีตอนนี้"
  },
  watch_live: {
    en: "Watch Live", "en-us": "Watch Live", ar: "شاهد مباشرة",
    az: "Canlı İzlə", bn: "সরাসরি দেখুন", cs: "Sledovat Živě",
    da: "Se Live", de: "Live Ansehen", el: "Παρακολουθήστε Ζωντανά",
    es: "Ver en Vivo", "es-la": "Ver en Vivo", fr: "Regarder en Direct",
    hi: "लाइव देखें", hr: "Gledaj Uživo", hu: "Nézd Élőben",
    id: "Tonton Langsung", it: "Guarda in Diretta", nl: "Live Kijken",
    no: "Se Live", pl: "Oglądaj na Żywo", pt: "Assistir ao Vivo",
    "pt-pt": "Assistir ao Vivo", ro: "Vizionează Live", ru: "Смотреть онлайн",
    sk: "Sledovať Naživo", sl: "Glej v Živo", sr: "Гледај уживо",
    sv: "Se Live", tr: "Canlı İzle", zh: "观看直播",
    jp: "ライブ視聴",
    kr: "라이브 시청",
    vn: "Xem trực tiếp",
    he: "צפה בשידור חי",
    th: "รับชมการถ่ายทอดสด"
  },
  adblocker_title: {
    en: "Ad Blocker Detected", "en-us": "Ad Blocker Detected", ar: "تم اكتشاف مانع الإعلانات",
    az: "Reklam Engelleyici Aşkar Edildi", bn: "অ্যাড ব্লকার সনাক্ত করা হয়েছে", cs: "Detekován blokátor reklam",
    da: "Adblocker registreret", de: "Werbeblocker erkannt", el: "Ανιχνεύθηκε Πρόγραμμα Φραγής Διαφημίσεων",
    es: "Bloqueador de anuncios detectado", "es-la": "Bloqueador de anuncios detectado", fr: "Bloqueur de pub détecté",
    hi: "विज्ञापन अवरोधक का पता चला", hr: "Otkriven blokator oglasa", hu: "Hirdetésblokkoló észlelve",
    id: "Pemblokir Iklan Terdeteksi", it: "Rilevato Ad Blocker", nl: "Advertentieblokker Gedetecteerd",
    no: "Annonseblokkering registrert", pl: "Wykryto bloker reklam", pt: "Bloqueador de Anúncios Detectado",
    "pt-pt": "Bloqueador de Anúncios Detetado", ro: "Detector de reclame blocat", ru: "Обнаружен блокировщик рекламы",
    sk: "Detekovaný blokátor reklám", sl: "Zaznan zaviralec oglasov", sr: "Откривен блокатор огласа",
    sv: "Annonsblockerare upptäckt", tr: "Reklam Engelleyici Algılandı", zh: "检测到广告拦截器",
    jp: "広告ブロッカーが検出されました",
    kr: "광고 차단기가 감지되었습니다",
    vn: "Phát hiện trình chặn quảng cáo",
    he: "זוהه חוסם פרסומות",
    th: "ตรวจพบเครื่องมือบล็อกโฆษณา"
  },
  adblocker_text: {
    en: "Unlock all high speed HD streams below", "en-us": "Unlock all high speed HD streams below", ar: "افتح جميع البثوث عالية السرعة HD أدناه",
    az: "Aşağıdakı bütün sürətli HD yayımları açın", bn: "নিচের সব উচ্চ গতির HD স্ট্রিম আনলক করুন", cs: "Odemkněte všechny vysokorychlostní HD přenosy níže",
    da: "Lås op for alle højhastigheds-HD-streams nedenfor", de: "Schalten Sie alle schnellen HD-Streams unten frei", el: "Ξεκλειδώστε όλες τις γρήγορες ροές HD παρακάτω",
    es: "Desbloquee todas las transmisiones HD de alta velocidad a continuación", "es-la": "Desbloquee todas las transmisiones HD de alta velocidad a continuación", fr: "Débloquez tous les streams HD haute vitesse ci-dessous",
    hi: "नीचे सभी उच्च गति वाले एचडी स्ट्रीम अनलॉक करें", hr: "Otključaj sve brze HD prijenose ispod", hu: "Nyissa meg az összes nagy sebességű HD közvetítést alább",
    id: "Buka semua siaran HD berkecepatan tinggi di bawah", it: "Sblocca tutti gli streaming HD ad alta velocità qui sotto", nl: "Ontgrendel alle snelle HD-streams hieronder",
    no: "Lås opp alle høyhastighets HD-streams nedenfor", pl: "Odblokuj wszystkie szybkie strumienie HD poniżej", pt: "Desbloqueie todas as transmissões HD de alta velocidade abaixo",
    "pt-pt": "Desbloqueie todas as transmissões HD de alta velocidade abaixo", ro: "Deblochează toate transmisiunile HD de mare viteză de mai jos", ru: "Разблокируйте все скоростные HD трансляции ниже",
    sk: "Odomknite všetky vysokorýchlostné HD streamy nižšie", sl: "Odkleni vse hitre HD prenose spodaj", sr: "Откључај све брзе ХД преносе испод",
    sv: "Lås upp alla snabba HD-strömmar nedan", tr: "Aşağıdaki tüm yüksek hızlı HD yayınları açın", zh: "解锁下方所有高速高清直播",
    jp: "配信をスムーズに読み込むために、広告ブロッカーを無効にしてください。",
    kr: "스트림을 원활하게 로드하려면 광고 차단기를 비활성화하십시오.",
    vn: "Vui lòng tắt trình chặn quảng cáo để tải luồng mượt mà.",
    he: "אנא נטרל את חוסם הפרסומות כדי לטעון את השידור בצורה חלקה.",
    th: "โปรดปิดการใช้งานเครื่องมือบล็อกโฆษณาเพื่อโหลดสตรีมอย่างราบรื่น"
  },
  unlock_hd: {
    en: "UNLOCK HD", "en-us": "UNLOCK HD", ar: "فتح جودة HD",
    az: "HD AÇ", bn: "HD আনলক", cs: "ODEMKNOUT HD",
    da: "LÅS OP FOR HD", de: "HD FREISCHALTEN", el: "ΞΕΚΛΕΙΔΩΜΑ HD",
    es: "DESBLOQUEAR HD", "es-la": "DESBLOQUEAR HD", fr: "DÉBLOQUER LA HD",
    hi: "एचडी अनलॉक", hr: "OTKLJUČAJ HD", hu: "HD MEGNYITÁSA",
    id: "BUKA HD", it: "SBLOCCA HD", nl: "ONTGRENDEL HD",
    no: "LÅS OPP HD", pl: "ODBLOKUJ HD", pt: "DESBLOQUEAR HD",
    "pt-pt": "DESBLOQUEAR HD", ro: "DEBLOCHEAZĂ HD", ru: "РАЗБЛОКИРОВАТЬ HD",
    sk: "ODOMKNÚŤ HD", sl: "ODKLENI HD", sr: "ОТКЉУЧАЈ ХД",
    sv: "LÅS UPP HD", tr: "HD YAYINI AÇ", zh: "解锁高清",
    jp: "HD画質とリアルタイム実況をアンロック",
    kr: "HD 스트리밍 및 실시간 해설 잠금 해제",
    vn: "Mở khóa luồng HD & Bình luận trực tiếp",
    he: "פתיחת שידור HD ופרשנות בזמן אמת",
    th: "ปลดล็อกสตรีม HD และผู้บรรยายสด"
  },
  feature_1: {
    en: "High Quality Streaming", "en-us": "High Quality Streaming", ar: "بث بجودة عالية",
    az: "Yüksək Keyfiyyətli Yayım", bn: "উচ্চ মানের স্ট্রিম", cs: "Streamování ve vysoké kvalitě",
    da: "Streaming i høj kvalitet", de: "Streaming in hoher Qualität", el: "Ροή Υψηλής Ποιότητας",
    es: "Transmisión de alta calidad", "es-la": "Transmisión de alta calidad", fr: "Streaming haute qualité",
    hi: "उच्च गुणवत्ता स्ट्रीमिंग", hr: "Prijenos visoke kvalitete", hu: "Jó minőségű közvetítés",
    id: "Streaming Kualitas Tinggi", it: "Streaming ad alta qualità", nl: "Hoge Kwaliteit Streaming",
    no: "Strømming av høy kvalitet", pl: "Transmisja wysokiej jakości", pt: "Streaming de Alta Qualidade",
    "pt-pt": "Streaming de Alta Qualidade", ro: "Transmisie de înaltă calitate", ru: "Высокое качество трансляции",
    sk: "Vysokokvalitný stream", sl: "Visokokakovosten prenos", sr: "Пренос високе квалитете",
    sv: "Streaming av hög kvalitet", tr: "Yüksek Kaliteli Yayın", zh: "高质量视频流",
    jp: "バッファリングなしの超高速1080p画質",
    kr: "버퍼링이 없는 초고속 1080p 스트리밍",
    vn: "Luồng 1080p cực nhanh không giật lag",
    he: "שידור 1080p מהיר במיוחד ללא השהיות",
    th: "สตรีมมิ่ง 1080p ความเร็วสูงพิเศษไม่มีสะดุด"
  },
  feature_2: {
    en: "Watch Without Limits", "en-us": "Watch Without Limits", ar: "مشاهدة بدون حدود",
    az: "Limit olmadan İzlə", bn: "সীমাহীন দেখার সুবিধা", cs: "Sledujte bez limitů",
    da: "Se uden grænser", de: "Grenzenlos zusehen", el: "Παρακολούθηση Χωρίς Όρια",
    es: "Vea sin límites", "es-la": "Vea sin límites", fr: "Regarder sans limites",
    hi: "बिना सीमा के देखें", hr: "Gledaj bez ograničenja", hu: "Nézd határok nélkül",
    id: "Tonton Tanpa Batasan", it: "Guarda senza limiti", nl: "Kijk Zonder Limieten",
    no: "Se uten grenser", pl: "Oglądaj bez limitów", pt: "Assista Sem Limites",
    "pt-pt": "Assista Sem Limites", ro: "Vizionează fără limite", ru: "Смотри без ограничений",
    sk: "Sledujte bez limitov", sl: "Glej brez omejitev", sr: "Гледај без ограничења",
    sv: "Se utan begränsningar", tr: "Sınırsız İzleme", zh: "无限制观看",
    jp: "英語・ローカル言語のライブ解説付き",
    kr: "영어 및 지역 언어 라이브 해설",
    vn: "Bình luận trực tiếp bằng tiếng Anh & Ngôn ngữ địa phương",
    he: "פרשנות חיה באנגלית ובשפות מקומיות",
    th: "คำบรรยายสดภาษาอังกฤษและภาษาท้องถิ่น"
  },
  feature_3: {
    en: "No Ads, 100% Free Access", "en-us": "No Ads, 100% Free Access", ar: "بدون إعلانات، دخول مجاني 100%",
    az: "Reklamsız, 100% Pulsuz Giriş", bn: "কোন বিজ্ঞাপন নেই, ১০০% ফ্রি এক্সেস", cs: "Bez reklam, 100% bezplatný přístup",
    da: "Ingen reklamer, 100% gratis adgang", de: "Keine Werbung, 100% kostenlos", el: "Χωρίς Διαφημίσεις, 100% Δωρεάν Πρόσβαση",
    es: "Sin anuncios, acceso 100% gratuito", "es-la": "Sin anuncios, acceso 100% gratuito", fr: "Sans pub, accès 100% gratuit",
    hi: "कोई विज्ञापन नहीं, 100% मुफ्त पहुंच", hr: "Bez reklama, 100% besplatan pristup", hu: "Nincsenek hirdetések, 100% ingyenes hozzáférés",
    id: "Tanpa Iklan, Akses 100% Gratis", it: "Nessuna pubblicità, acesso 105% gratuito", nl: "Geen Advertenties, 100% Gratis Toegang",
    no: "Ingen reklame, 100% gratis tilgang", pl: "Bez reklam, dostęp w 100% darmowy", pt: "Sem Anúncios, Acesso 100% Grátis",
    "pt-pt": "Sem Anúncios, Acesso 100% Grátis", ro: "Fără reclame, acces 100% gratuit", ru: "Без рекламы, 100% бесплатный доступ",
    sk: "Bez reklám, 100% bezplatný prístup", sl: "Brez oglasov, 100-odstotno brezplačen dostop", sr: "Без реклама, 100% бесплатан приступ",
    sv: "Inga annonser, 100 % gratis tillgång", tr: "Reklamsız, %100 Ücretsiz Erişim", zh: "无广告，100%免费访问",
    jp: "PC、スマートフォン、タブレット、スマートTVに対応",
    kr: "PC, 모바일, 태블릿 및 스마트 TV 지원",
    vn: "Hỗ trợ PC, di động, máy tính bảng & Smart TV",
    he: "תמיכה במחשב, נייד, טאבלט וטלוויזיה חכמה",
    th: "รองรับพีซี, มือถือ, แท็บเล็ต และสมาร์ททีวี"
  },
  feature_4: {
    en: "Watch on any device", "en-us": "Watch on any device", ar: "شاهد على أي جهاز",
    az: "İstənilən cihazda izlə", bn: "যেকোনো ডিভাইসে দেখুন", cs: "Sledujte na jakémkoli zařízení",
    da: "Se på enhver enhed", de: "Auf jedem Gerät ansehen", el: "Παρακολουθήστε σε οποιαδήποτε συσκευή",
    es: "Vea en cualquier dispositivo", "es-la": "Vea en cualquier dispositivo", fr: "Regarder sur n'importe quel appareil",
    hi: "किसी भी डिवाइस पर देखें", hr: "Gledaj na bilo kojem uređaju", hu: "Nézd bármilyen eszközön",
    id: "Tonton di perangkat mana saja", it: "Guarda su qualsiasi dispositivo", nl: "Kijk op elk apparaat",
    no: "Se på hvilken som helst enhet", pl: "Oglądaj na dowolnym urządzeniu", pt: "Assista em qualquer dispositivo",
    "pt-pt": "Assista em qualquer dispositivo", ro: "Vizionează pe orice dispozitiv", ru: "Смотри на любом устройстве",
    sk: "Sledujte na akomkoľvek zariadení", sl: "Glej na katerikoli napravi", sr: "Гледај на било ком уређају",
    sv: "Se på valfri enhet", tr: "İstediğiniz cihazdan izleyin", zh: "在任何设备上观看",
    jp: "完全に無料の生涯アクセス",
    kr: "평생 100% 무료 액세스",
    vn: "Truy cập trọn đời miễn phí 100%",
    he: "גישה לכל החיים 100% בחינם",
    th: "เข้าใช้งานฟรี 100% ตลอดชีพ"
  },
  already_account: {
    en: "Already Have Account?", "en-us": "Already Have Account?", ar: "هل لديك حساب بالفعل؟",
    az: "Artıq hesabınız var?", bn: "ইতিমধ্যে একাউন্ট আছে?", cs: "Máte již účet?",
    da: "Har du allerede en bruger?", de: "Haben Sie bereits ein Konto?", el: "Έχετε ήδη λογαριασμό;",
    es: "¿Ya tiene una cuenta?", "es-la": "¿Ya tiene una cuenta?", fr: "Vous avez déjà un compte ?",
    hi: "पहले से ही खाता है?", hr: "Već imate račun?", hu: "Már van fiókja?",
    id: "Sudah Punya Akun?", it: "Hai già un account?", nl: "Heb je al een account?",
    no: "Har du allerede konto?", pl: "Masz już konto?", pt: "Já tem uma conta?",
    "pt-pt": "Já tem uma conta?", ro: "Ai deja cont?", ru: "Уже есть аккаунт?",
    sk: "Už máte účet?", sl: "Že imate račun?", sr: "Већ imate nalog?",
    sv: "Har du redan ett konto?", tr: "Zaten üye misiniz?", zh: "已有账号？",
    jp: "すでにアカウントをお持ちですか？",
    kr: "이미 계정이 있으신가요?",
    vn: "Đã có tài khoản?",
    he: "כבר יש לך חשבון?",
    th: "มีบัญชีอยู่แล้ว?"
  },
  login: {
    en: "Login", "en-us": "Login", ar: "تسجيل الدخول",
    az: "Daxil ol", bn: "লগইন", cs: "Přihlásit se",
    da: "Log ind", de: "Einloggen", el: "Σύνδεση",
    es: "Iniciar sesión", "es-la": "Iniciar sesión", fr: "Connexion",
    hi: "लॉगिन", hr: "Prijava", hu: "Bejelentkezés",
    id: "Masuk", it: "Accedi", nl: "Inloggen",
    no: "Logg inn", pl: "Zaloguj się", pt: "Entrar",
    "pt-pt": "Iniciar Sessão", ro: "Autentificare", ru: "Войти",
    sk: "Prihlásiť sa", sl: "Prijava", sr: "Пријава",
    sv: "Logga in", tr: "Giriş Yap", zh: "登录",
    jp: "ログイン",
    kr: "로그인",
    vn: "Đăng nhập",
    he: "התחבר",
    th: "เข้าสู่ระบบ"
  },
  loading: {
    en: "Loading details...", "en-us": "Loading details...", ar: "جاري التحميل...",
    az: "Məlumatlar yüklənir...", bn: "লোড হচ্ছে...", cs: "Načítání podrobností...",
    da: "Indlæser detaljer...", de: "Details werden geladen...", el: "Φόρτωση λεπτομερειών...",
    es: "Cargando detalles...", "es-la": "Cargando detalles...", fr: "Chargement...",
    hi: "विवरण लोड हो रहा है...", hr: "Učitavanje detalja...", hu: "Részletek betöltése...",
    id: "Memuat detail...", it: "Caricamento dettagli...", nl: "Details laden...",
    no: "Laster detaljer...", pl: "Ładowanie szczegółów...", pt: "Carregando detalhes...",
    "pt-pt": "A carregar detalhes...", ro: "Se încarcă detaliile...", ru: "Загрузка...",
    sk: "Načítavanie podrobností...", sl: "Nalaganje podrobnosti...", sr: "Учитавање...",
    sv: "Läs in detaljer...", tr: "Detaylar yükleniyor...", zh: "加载中...",
    jp: "読み込み中...",
    kr: "로딩 중...",
    vn: "Đang tải...",
    he: "טוען...",
    th: "กำลังโหลด..."
  },
  not_found: {
    en: "Match not found", "en-us": "Match not found", ar: "المباراة غير موجودة",
    az: "Oyun tapılmadı", bn: "ম্যাচ পাওয়া যায়নি", cs: "Zápas nebyl nalezen",
    da: "Kampen blev ikke fundet", de: "Spiel nicht gefunden", el: "Ο αγώνας δεν βρέθηκε",
    es: "Partido no encontrado", "es-la": "Partido no encontrado", fr: "Match non trouvé",
    hi: "मैच नहीं मिला", hr: "Utakmica nije pronađena", hu: "Mérkőzés nem található",
    id: "Pertandingan tidak ditemukan", it: "Partita non trovata", nl: "Wedstrijd niet gevonden",
    no: "Kampen ble ikke funnet", pl: "Mecz nie znaleziony", pt: "Jogo não encontrado",
    "pt-pt": "Jogo não encontrado", ro: "Meciul nu a fost găsit", ru: "Матч не найден",
    sk: "Zápas nebol nájdený", sl: "Tekma ni bila najdena", sr: "Утакмица није пронађена",
    sv: "Matchen kunde inte hittas", tr: "Maç bulunamadı", zh: "未找到比赛",
    jp: "ページが見つかりません",
    kr: "페이지를 찾을 수 없습니다",
    vn: "Không tìm thấy trang",
    he: "הדף לא נמצא",
    th: "ไม่พบหน้าเว็บ"
  },
  return_dashboard: {
    en: "Return to Dashboard", "en-us": "Return to Dashboard", ar: "العودة للوحة الرئيسية",
    az: "İdarə Panelinə Qayıt", bn: "ড্যাশবোর্ডে ফিরে যান", cs: "Zpět na nástěnku",
    da: "Vend tilbage til instrumentbræt", de: "Zurück zum Dashboard", el: "Επιστροφή στο Dashboard",
    es: "Volver al Panel", "es-la": "Volver al Panel", fr: "Retour au Tableau de bord",
    hi: "डैशボード पर लौटें", hr: "Vrati se na nadzornu ploču", hu: "Vissza a főoldalra",
    id: "Kembali ke Dasbor", it: "Torna alla Dashboard", nl: "Terug naar Dashboard",
    no: "Gå tilbake til dashboard", pl: "Powrót do pulpitu", pt: "Voltar para o Painel",
    "pt-pt": "Voltar ao Painel", ro: "Înapoi la Panou", ru: "Вернуться на панель",
    sk: "Späť na nástenku", sl: "Vrni se na nadzorno ploščo", sr: "Врати се на контролну таблу",
    sv: "Gå tillbaka till översikten", tr: "Panoya Dön", zh: "返回控制台",
    jp: "ダッシュボードに戻る",
    kr: "대시보드로 돌아가기",
    vn: "Quay lại bảng điều khiển",
    he: "חזרה ללוח הבקרה",
    th: "กลับไปที่แดชบอร์ด"
  },
  select_lang: {
    en: "Select Language", "en-us": "Select Language", ar: "اختر اللغة",
    az: "Dili Seçin", bn: "ভাষা নির্বাচন করুন", cs: "Vyberte jazyk",
    da: "Vælg sprog", de: "Sprache wählen", el: "Επιλογή Γλώσσας",
    es: "Seleccionar idioma", "es-la": "Seleccionar idioma", fr: "Choisir la langue",
    hi: "भाषा चुनें", hr: "Odaberi jezik", hu: "Nyelv választása",
    id: "Pilih Bahasa", it: "Seleziona lingua", nl: "Selecteer Taal",
    no: "Velg språk", pl: "Wybierz język", pt: "Selecionar Idioma",
    "pt-pt": "Selecionar Idioma", ro: "Selectează limba", ru: "Выбрать язык",
    sk: "Vybrať jazyk", sl: "Izberite jezik", sr: "Изабери језик",
    sv: "Välj språk", tr: "Dil Seçin", zh: "选择语言",
    jp: "言語を選択",
    kr: "언어 선택",
    vn: "Chọn ngôn ngữ",
    he: "בחר שפה",
    th: "เลือกภาษา"
  },
  round_32: {
    en: "Round of 32", "en-us": "Round of 32", ar: "دور الـ 32", az: "Son 32 turu", bn: "রাউন্ড অব ৩২", cs: "Šestnáctifinále", da: "16-delsfinaler", de: "Sechzehntelfinale", el: "Φάση των 32", es: "Dieciseisavos de final", "es-la": "Dieciseisavos de final", fr: "Seizièmes de finale", hi: "32 का दौर", hr: "Šesnaestina finala", hu: "Legjobb 32", id: "Babak 32 Besar", it: "Sedicesimi di finale", nl: "Zestiende finales", no: "16-delsfinaler", pl: "1/16 finału", pt: "Dezesseis-avos de final", "pt-pt": "Dezasseis-avos de final", ro: "Șaisprezecimi de finală", ru: "1/16 финала", sk: "Šestnásťfinále", sl: "Šestnajstina finala", sr: "Шеснаестина финала", sv: "Sextondelsfinal", tr: "Son 32 Turu", zh: "1/16决赛",
    jp: "ラウンド32",
    kr: "32강전",
    vn: "Vòng 32 đội",
    he: "סיבוב ה-32",
    th: "รอบ 32 ทีม"
  },
  round_16: {
    en: "Round of 16", "en-us": "Round of 16", ar: "دور الـ 16", az: "Son 16 turu", bn: "রাউন্ড অব ১৬", cs: "Osmifinále", da: "Ottendedelsfinaler", de: "Achtelfinale", el: "Φάση των 16", es: "Octavos de final", "es-la": "Octavos de final", fr: "Huitièmes de finale", hi: "16 का दौर", hr: "Osmina finala", hu: "Nyolcaddöntő", id: "Babak 16 Besar", it: "Ottavi di finale", nl: "Achtste finales", no: "Åttendedelsfinaler", pl: "1/8 finału", pt: "Oitavas de final", "pt-pt": "Oitavas de final", ro: "Optimi de finală", ru: "1/8 финала", sk: "Osemfinále", sl: "Osmina finala", sr: "Осмина финала", sv: "Åttondelsfinal", tr: "Son 16 Turu", zh: "1/8决赛",
    jp: "ラウンド16",
    kr: "16강전",
    vn: "Vòng 16 đội",
    he: "שמינית הגמר",
    th: "รอบ 16 ทีม"
  },
  quarter_finals: {
    en: "Quarter Finals", "en-us": "Quarter Finals", ar: "ربع النهائي", az: "Dörddəbir final", bn: "কোয়ার্টার ফাইনাল", cs: "Čtvrtfinále", da: "Kvartfinaler", de: "Viertelfinale", el: "Προημιτελικοί", es: "Cuartos de final", "es-la": "Cuartos de final", fr: "Quarts de finale", hi: "क्वार्टर फाइनल", hr: "Četvrtfinale", hu: "Negyeddöntő", id: "Perempat Final", it: "Quarti di finale", nl: "Kwartfinales", no: "Kvartfinaler", pl: "Ćwierćfinały", pt: "Quartas de final", "pt-pt": "Quartos de final", ro: "Sferturi de finală", ru: "Четвертьфиналы", sk: "Štvrťfinále", sl: "Četrtfinale", sr: "Четвртфинале", sv: "Kvartsfinal", tr: "Çeyrek Finaller", zh: "1/4决赛",
    jp: "準々決勝",
    kr: "8강전",
    vn: "Tứ kết",
    he: "רבע הגמר",
    th: "รอบก่อนรองชนะเลิศ"
  },
  semi_finals: {
    en: "Semi Finals", "en-us": "Semi Finals", ar: "نصف النهائي", az: "Yarımfinal", bn: "সেমিফাইনাল", cs: "Semifinále", da: "Semifinaler", de: "Halbfinale", el: "Ημιτελικοί", es: "Semifinales", "es-la": "Semifinales", fr: "Demi-finales", hi: "সেমিফাইনাল", hr: "Polufinale", hu: "Elődöntő", id: "Semifinal", it: "Semifinali", nl: "Halve finales", no: "Semifinaler", pl: "Półfinały", pt: "Semifinais", "pt-pt": "Meias-finais", ro: "Semifinale", ru: "Полуфиналы", sk: "Semifinále", sl: "Polfinale", sr: "Полуфинале", sv: "Semifinal", tr: "Yarı Finaller", zh: "半决赛",
    jp: "準決勝",
    kr: "4강전",
    vn: "Bán kết",
    he: "חצי הגמר",
    th: "รอบรองชนะเลิศ"
  },
  third_place: {
    en: "3rd Place", "en-us": "3rd Place", ar: "المركز الثالث", az: "Üçüncü yer", bn: "তৃতীয় স্থান", cs: "O 3. místo", da: "Bronzekamp", de: "Spiel um Platz 3", el: "Μικρός Τελικός", es: "Tercer puesto", "es-la": "Tercer puesto", fr: "Match 3e place", hi: "तीसरा स्थान", hr: "Za 3. mjesto", hu: "Bronzmérkőzés", id: "Perebutan Tempat Ketiga", it: "Finale 3° posto", nl: "Troostfinale", no: "Bronsefinale", pl: "Mecz o 3. miejsce", pt: "Disputa do 3º lugar", "pt-pt": "Jogo do 3º lugar", ro: "Finala mică", ru: "Матч за 3-е место", sk: "O 3. miesto", sl: "Za 3. mesto", sr: "За 3. место", sv: "Bronsmatch", tr: "Üçüncülük Maçı", zh: "三四名决赛",
    jp: "3位決定戦",
    kr: "3위 결정전",
    vn: "Tranh hạng ba",
    he: "המשחק על המקום השלישי",
    th: "นัดชิงอันดับสาม"
  },
  final: {
    en: "Final", "en-us": "Final", ar: "النهائي", az: "Final", bn: "ফাইনাল", cs: "Finále", da: "Finale", de: "Finale", el: "Τελικός", es: "Final", "es-la": "Final", fr: "Finale", hi: "फाइनल", hr: "Finale", hu: "Döntő", id: "Final", it: "Finale", nl: "Finale", no: "Finale", pl: "Finał", pt: "Final", "pt-pt": "Final", ro: "Finală", ru: "Финал", sk: "Finále", sl: "Finale", sr: "Финале", sv: "Final", tr: "Final", zh: "决赛",
    jp: "決勝",
    kr: "결승전",
    vn: "Chung kết",
    he: "הגמר",
    th: "นัดชิงชนะเลิศ"
  },
  group: {
    en: "Group", "en-us": "Group", ar: "المجموعة", az: "Qrup", bn: "গ্রুপ", cs: "Skupina", da: "Gruppe", de: "Gruppe", el: "Όμιλος", es: "Grupo", "es-la": "Grupo", fr: "Groupe", hi: "समूह", hr: "Skupina", hu: "Csoport", id: "Grup", it: "Gruppo", nl: "Groep", no: "Gruppe", pl: "Grupa", pt: "Grupo", "pt-pt": "Grupo", ro: "Grupa", ru: "Группа", sk: "Skupina", sl: "Skupina", sr: "Група", sv: "Grupp", tr: "Grup", zh: "分组",
    jp: "グループ",
    kr: "조",
    vn: "Bảng",
    he: "בית",
    th: "กลุ่ม"
  },
  matchday: {
    en: "Matchday", "en-us": "Matchday", ar: "يوم المباراة", az: "Oyun günü", bn: "ম্যাচডে", cs: "Hrací den", da: "Spilledag", de: "Spieltag", el: "Αγωνιστική", es: "Jornada", "es-la": "Jornada", fr: "Journée", hi: "मैच का दिन", hr: "Kolo", hu: "Forduló", id: "Hari Pertandingan", it: "Giornata", nl: "Speeldag", no: "Spilledag", pl: "Kolejka", pt: "Rodada", "pt-pt": "Jornada", ro: "Etapă", ru: "Игровой день", sk: "Hrací deň", sl: "Igralni dan", sr: "Коло", sv: "Spelomgång", tr: "Maç Günü", zh: "比赛日",
    jp: "マッチデイ",
    kr: "경기일",
    vn: "Ngày thi đấu",
    he: "יום משחק",
    th: "วันแข่งขัน"
  },
  no_upcoming_matches: {
    en: "No upcoming matches scheduled.", "en-us": "No upcoming matches scheduled.", ar: "لا توجد مباريات قادمة مجدولة.", az: "Planlaşdırılmış növbəti oyun yoxdur.", bn: "কোন আসন্ন ম্যাচ নির্ধারিত নেই।", cs: "Nejsou naplánovány žádné nadcházející zápasy.", da: "Ingen kommende kampe planlagt.", de: "Keine kommenden Spiele geplant.", el: "Δεν υπάρχουν προγραμματισμένοι προσεχείς αγώνες.", es: "No hay partidos próximos programados.", "es-la": "No hay partidos próximos programados.", fr: "Aucun match à venir programmé.", hi: "कोई आगामी मैच निर्धारित नहीं है।", hr: "Nema zakazanih predstojećih utakmica.", hu: "Nincsenek közelgő mérkőzések.", id: "Tidak ada pertandingan mendatang yang dijadwalkan.", it: "Nessuna partita in programma.", nl: "Geen aankomende wedstrijden gepland.", no: "Ingen kommende kamper planlagt.", pl: "Brak zaplanowanych nadchodzących meczów.", pt: "Nenhum jogo próximo programado.", "pt-pt": "Nenhum jogo próximo programado.", ro: "Nu există meciuri programate.", ru: "Нет запланированных предстоящих матчей.", sk: "Nie sú naplánované žiadne nadchádzajúce zápasy.", sl: "Ni načrtovanih prihodnjih tekem.", sr: "Нема заказаних предстојећих утакмица.", sv: "Inga kommande matcher schemalagda.", tr: "Planlanmış gelecek maç yok.", zh: "没有计划中的即将进行的比赛。",
    jp: "予定されている試合はありません",
    kr: "예정된 경기가 없습니다",
    vn: "Không có trận đấu sắp tới",
    he: "אין משחקים קרובים",
    th: "ไม่มีการแข่งขันที่กำลังจะมาถึง"
  },
  no_played_matches: {
    en: "No played matches recorded.", "en-us": "No played matches recorded.", ar: "لم تسجل مباريات ملعوبة.", az: "Qeydə alınmış oyun yoxdur.", bn: "কোন খেলার রেকর্ড নেই।", cs: "Nebyly zaznamenány žádné odehrané zápasy.", da: "Ingen spillede kampe registreret.", de: "Keine gespielten Spiele aufgezeichnet.", el: "Δεν έχουν καταγραφεί διεξαχθέντες αγώνες.", es: "No se registran partidos jugados.", "es-la": "No se registran partidos jugados.", fr: "Aucun match joué enregistré.", hi: "कोई खेले गए मैच रिकॉर्ड नहीं किए गए।", hr: "Nema zabilježenih odigranih utakmica.", hu: "Nincsenek lejátszott mérkőzések.", id: "Tidak ada catatan pertandingan yang dimainkan.", it: "Nessuna partita giocata registrata.", nl: "Geen gespeelde wedstrijden geregistreerd.", no: "Ingen spilte kamper registrert.", pl: "Brak rozegranych meczów.", pt: "Nenhum jogo realizado registrado.", "pt-pt": "Nenhum jogo realizado registado.", ro: "Nu există meciuri jucate înregistrate.", ru: "Нет записей о сыгранных матчах.", sk: "Neboli zaznamenané žiadne odohrané zápasy.", sl: "Ni zabeleženih odigranih tekem.", sr: "Нема забележених одиграних утакмица.", sv: "Inga spelade matcher registrerade.", tr: "Kaydedilmiş oynanmış maç yok.", zh: "没有已赛场次记录।",
    jp: "終了した試合はありません",
    kr: "진행된 경기가 없습니다",
    vn: "Không có trận đấu đã chơi",
    he: "אין משหקים ששוחקו",
    th: "ไม่มีการแข่งขันที่เล่นไปแล้ว"
  },
  no_matches: {
    en: "No matches found matching your filters.", "en-us": "No matches found matching your filters.", ar: "لم يتم العثور على مباريات تطابق التصفية.", az: "Filtrinizə uyğun oyun tapılmadı.", bn: "কোন ম্যাচ পাওয়া যায়নি।", cs: "Nebyly nalezeny žádné zápasy odpovídající vašim filtrům.", da: "Ingen kampe fundet, der matcher dine filtre.", de: "Keine Spiele gefunden, die Ihren Filtern entsprechen.", el: "Δεν βρέθηκαν αγώνες που να ταιριάζουν με τα φίλτρα σας.", es: "No se encontraron partidos que coincidan con sus filtros.", "es-la": "No se encontraron partidos que coincidan con sus filtros.", fr: "Aucun match trouvé correspondant à vos filtres.", hi: "आपके फ़िल्टर से मेल खाने वाले कोई मैच नहीं मिले।", hr: "Nije pronađena nijedna utakmica koja odgovara vašim filtrima.", hu: "Nem található a szűrésnek megfelelő mérkőzés.", id: "Tidak ada pertandingan yang cocok dengan filter Anda.", it: "Nessuna partita corrisponde ai filtri selezionati.", nl: "Geen wedstrijden gevonden die aan de filters voldoen.", no: "Ingen kamper funnet som passer til filtrene.", pl: "Nie znaleziono meczów pasujących do filtrów.", pt: "Nenhum jogo encontrado correspondente aos seus filtros.", "pt-pt": "Nenhum jogo encontrado correspondente aos seus filtros.", ro: "Nu s-au găsit meciuri care să corespundă filtrelor tale.", ru: "Матчей с такими фильтрами не найдено.", sk: "Neboli nájdené žiadne zápasy zodvedajúce vašim filtrom.", sl: "Ni tekem, ki bi ustrezale vašim filtrom.", sr: "Није пронађена ниједна утакмица која одговара вашим филтрима.", sv: "Inga matcher hittades som matchar dina filter.", tr: "Filtrelerinize uygun maç bulunamadı.", zh: "未找到符合筛选条件的比赛。",
    jp: "一致する試合はありません",
    kr: "일치하는 경기가 없습니다",
    vn: "Không tìm thấy trận đấu",
    he: "לא נמצאו משחקים",
    th: "ไม่พบการแข่งขัน"
  },
  no_teams: {
    en: "No teams found.", "en-us": "No teams found.", ar: "لم يتم العثور على فرق.", az: "Komanda tapılmadı.", bn: "কোন দল পাওয়া যায়নি।", cs: "Nebyly nalezeny žádné týmy.", da: "Ingen hold fundet.", de: "Keine teams gefunden.", el: "Δεν βρέθηκαν ομάδες.", es: "No se encontraron equipos.", "es-la": "No se encontraron equipos.", fr: "Aucune équipe trouvée.", hi: "कोई टीम नहीं मिली।", hr: "Nisu pronađene reprezentacije.", hu: "Nem találhatók csapatok.", id: "Tidak ada tim yang ditemukan.", it: "Nessuna squadra trovata.", nl: "Geen teams gevonden.", no: "Ingen lag funnet.", pl: "Nie znaleziono drużyn.", pt: "Nenhuma equipe encontrada.", "pt-pt": "Nenhuma equipa encontrada.", ro: "Nu s-au găsit echipe.", ru: "Команд не найдено.", sk: "Neboli nájdené žiadne tímy.", sl: "Ni najdenih ekip.", sr: "Нису пронађене репрезентације.", sv: "Inga lag hittades.", tr: "Takım bulunamadı.", zh: "未找到球队।",
    jp: "チームが見つかりません",
    kr: "팀이 없습니다",
    vn: "Không có đội bóng",
    he: "לא נמצאו נבחרות",
    th: "ไม่พบทีม"
  },
  about_the_match: {
    en: "About the match",
    "en-us": "About the match",
    ar: "حول المباراة",
    az: "Matç haqqında",
    bn: "ম্যাচ সম্পর্কে",
    cs: "O zápasu",
    da: "Om kampen",
    de: "Über das Spiel",
    el: "Σχετικά με τον αγώνα",
    es: "Sobre el partido",
    "es-la": "Sobre el partido",
    fr: "À propos du match",
    hi: "मैच के बारे में",
    hr: "O utakmici",
    hu: "A mérkőzésről",
    id: "Tentang pertandingan",
    it: "Sul match",
    nl: "Over de wedstrijd",
    no: "Om kampen",
    pl: "O meczu",
    pt: "Sobre a partida",
    "pt-pt": "Sobre a partida",
    ro: "Despre meci",
    ru: "О матче",
    sk: "O zápase",
    sl: "O tekmi",
    sr: "O utakmici",
    sv: "Om matchen",
    tr: "Maç hakkında",
    zh: "关于比赛",
    jp: "試合について",
    kr: "경기에 대하여",
    vn: "Thông tin trận đấu",
    he: "על המשחק",
    th: "เกี่ยวกับการแข่งขัน"
  },
  head_to_head_text: {
    en: "{homeName} is going head to head with {awayName} starting on {date} at {time} UTC at {venue}. The match is a part of the FIFA World Cup, Group {group}.",
    "en-us": "{homeName} is going head to head with {awayName} starting on {date} at {time} UTC at {venue}. The match is a part of the FIFA World Cup, Group {group}.",
    ar: "سيواجه {homeName} نظيره {awayName} وجهاً لوجه بدءاً من {date} في تمام الساعة {time} بالتوقيت العالمي المنسق في {venue}. وتأتي هذه المباراة كجزء من بطولة كأس العالم، المجموعة {group}.",
    az: "{homeName} və {awayName} {date} tarixində, saat {time} UTC-də {venue} stadionunda qarşı-qarşıya gəlir. Oyun FIFA Dünya Kubokunun, Qrup {group} mərhələsinin bir hissəsidir.",
    bn: "{homeName} বনাম {awayName} এর ম্যাচটি {date} তারিখ {time} UTC থেকে {venue} স্টেডিয়ামে অনুষ্ঠিত হবে। ম্যাচটি ফিফা বিশ্বকাপ, গ্রুপ {group} এর অংশ।",
    cs: "{homeName} se utká s {awayName} dne {date} v {time} UTC na stadionu {venue}. Zápas je součástí Mistrovství světa FIFA, skupina {group}.",
    da: "{homeName} står ansigt til ansigt med {awayName} den {date} kl. {time} UTC på {venue}. Kampen er en del af FIFA VM, Gruppe {group}.",
    de: "{homeName} tritt am {date} um {time} UTC im Stadion {venue} gegen {awayName} an. Das Spiel ist Teil der FIFA-Weltmeisterschaft, Gruppe {group}.",
    el: "{homeName} αντιμετωπίζει την {awayName} στις {date} στις {time} UTC στο {venue}. Ο αγώνας είναι μέρος του Παγκοσμίου Κυπέλλου FIFA, Όμιλος {group}.",
    es: "{homeName} se enfrentará a {awayName} el {date} a las {time} UTC en {venue}. El partido es parte de la Copa Mundial de la FIFA, Grupo {group}.",
    "es-la": "{homeName} se enfrentará a {awayName} el {date} a las {time} UTC en {venue}. El partido es parte de la Copa Mundial de la FIFA, Grupo {group}.",
    fr: "{homeName} affrontera {awayName} le {date} à {time} UTC au stade {venue}. Ce match fait partie de la Coupe du Monde de la FIFA, Groupe {group}.",
    hi: "{homeName} का मुकाबला {awayName} से {date} को {time} UTC पर {venue} में शुरू होगा। यह मैच फीफा विश्व कप, ग्रुप {group} का हिस्सा है।",
    hr: "{homeName} i {awayName} sastaju se {date} u {time} UTC na stadionu {venue}. Utakmica je dio FIFA Svjetskog prvenstva, skupina {group}.",
    hu: "{homeName} és {awayName} összecsapása {date}-án/én {time} UTC-kor kezdődik a {venue} stadionban. A mérkőzés a FIFA-világbajnokság {group} csoportjának része.",
    id: "{homeName} akan berhadapan dengan {awayName} mulai tanggal {date} pukul {time} UTC di {venue}. Pertandingan ini merupakan bagian dari Piala Dunia FIFA, Grup {group}.",
    it: "{homeName} sfiderà {awayName} il {date} alle {time} UTC al {venue}. Il match fa parte della Coppa del Mondo FIFA, Gruppo {group}.",
    nl: "{homeName} speelt tegen {awayName} op {date} om {time} UTC in {venue}. De wedstrijd maakt deel uit van de FIFA Wereldbeker, Groep {group}.",
    no: "{homeName} møter {awayName} den {date} kl. {time} UTC på {venue}. Kampen er en del av FIFA VM, Gruppe {group}.",
    pl: "{homeName} zmierzy się z {awayName} dnia {date} o godzinie {time} UTC na stadionie {venue}. Mecz jest częścią Mistrzostw Świata FIFA, Grupa {group}.",
    pt: "{homeName} enfrentará {awayName} em {date} às {time} UTC no {venue}. A partida faz parte da Copa do Mundo FIFA, Grupo {group}.",
    "pt-pt": "{homeName} enfrentará {awayName} em {date} às {time} UTC no {venue}. A partida faz parte da Copa do Mundo FIFA, Grupo {group}.",
    ro: "{homeName} se va confrunta cu {awayName} pe {date} la ora {time} UTC pe stadionul {venue}. Meciul face parte din Cupa Mondială FIFA, Grupa {group}.",
    ru: "{homeName} встретится с {awayName} {date} в {time} UTC на стадионе {venue}. Матч проходит в рамках Чемпионата мира по футболу, Группа {group}.",
    sk: "{homeName} sa stretne s {awayName} dňa {date} o {time} UTC na štadióne {venue}. Zápas je súčasťou Majstrovstiev sveta FIFA, skupina {group}.",
    sl: "{homeName} se bo pomeril z {awayName} dne {date} ob {time} UTC na stadionu {venue}. Tekma je del svetovnega prvenstva v nogometu FIFA, skupina {group}.",
    sr: "{homeName} и {awayName} састају се {date} у {time} UTC на стадиону {venue}. Утакмица је део ФИФА Светског првенства, група {group}.",
    sv: "{homeName} ställs mot {awayName} den {date} kl. {time} UTC på {venue}. Matchen är en del av FIFA VM, Grupp {group}.",
    tr: "{homeName} ile {awayName}, {date} tarihinde saat {time} UTC'de {venue} stadyumunda karşı karşıya geliyor. Bu maç, FIFA Dünya Kupası Grup {group} mücadelesidir.",
    zh: "{homeName} 将于 {date} {time} UTC 在 {venue} 体育场与 {awayName} 进行对决。本场比赛是 2026 FIFA 世界杯 {group} 组的一部分。",
    jp: "{homeName}は{date}の{time} UTCに{venue}で{awayName}と対戦します。この試合はFIFAワールドカップのグループ{group}の一部です。",
    kr: "{homeName}은(는) {date} {time} UTC에 {venue}에서 {awayName}와(과) 맞대결을 펼칩니다. 이 경기는 FIFA 월드컵 그룹 {group}의 일부입니다.",
    vn: "{homeName} sẽ đối đầu với {awayName} bắt đầu vào lúc {time} UTC ngày {date} tại {venue}. Trận đấu là một phần của FIFA World Cup, Bảng {group}.",
    he: "נבחרות {homeName} ו-{awayName} ייפגשו ראש בראש ב-{date} בשעה {time} UTC באצטדיון {venue}. המשחק הוא חלק מגביע העולם של פיפ\"א, בית {group}.",
    th: "{homeName} จะพบกับ {awayName} เริ่มแข่งขันในวันที่ {date} เวลา {time} UTC ณ สนาม {venue} การแข่งขันนี้เป็นส่วนหนึ่งของฟีฟ่าเวิลด์คัพ กลุ่ม {group}"
  },
  h2h_results_intro: {
    en: "On FIFAonScreen you can find all previous {homeName} vs {awayName} results sorted by their H2H matches. FIFAonScreen also provides the best way to follow the live score of this game with various sports features. Therefore, you can:",
    "en-us": "On FIFAonScreen you can find all previous {homeName} vs {awayName} results sorted by their H2H matches. FIFAonScreen also provides the best way to follow the live score of this game with various sports features. Therefore, you can:",
    ar: "على FIFAonScreen يمكنك العثور على جميع نتائج المواجهات السابقة بين {homeName} و {awayName} مرتبة حسب مبارياتها الثنائية. كما يوفر FIFAonScreen أفضل طريقة لمتابعة النتيجة المباشرة لهذه المباراة مع العديد من الميزات الرياضية. لذلك، يمكنك:",
    az: "FIFAonScreen-də H2H oyunlarına görə sıralanmış bütün əvvəlki {homeName} və {awayName} nəticələrini tapa bilərsiniz. FIFAonScreen həmçinin müxtəlif idman xüsusiyyətləri ilə bu oyunun canlı hesabını izləmək üçün ən yaxşı yolu təqdim edir. Beləliklə, siz:",
    bn: "FIFAonScreen-এ আপনি আগের সমস্ত {homeName} বনাম {awayName} ফলাফল এবং তাদের মুখোমুখি (H2H) ম্যাচের তালিকা পাবেন। এছাড়াও FIFAonScreen বিভিন্ন আকর্ষণীয় ফিচারের সাথে এই খেলার লাইভ স্কোর অনুসরণ করার সেরা উপায় সরবরাহ করে। অতএব, আপনি করতে পারেন:",
    cs: "Na FIFAonScreen najdete všechny předchozí výsledky {homeName} vs {awayName} seřazené podle jejich vzájemných zápasů. FIFAonScreen také poskytuje nejlepší způsob, jak sledovat živé skóre tohoto zápasu s různými sportovními funkcemi. Můžete tedy:",
    da: "På FIFAonScreen kan du finde alle tidligere {homeName} vs {awayName} resultater sorteret efter deres H2H kampe. FIFAonScreen giver også den bedste måde at følge livescore for denne kamp med forskellige sportsfunktioner. Derfor kan du:",
    de: "Auf FIFAonScreen finden Sie alle bisherigen Ergebnisse von {homeName} gegen {awayName}, sortiert nach ihren H2H-Spielen. FIFAonScreen bietet auch die beste Möglichkeit, den Live-Spielstand dieses Spiels mit verschiedenen Sportfunktionen zu verfolgen. Daher können Sie:",
    el: "Στο FIFAonScreen μπορείτε να βρείτε όλα τα προηγούμενα αποτελέσματα {homeName} εναντίον {awayName} ταξινομημένα με βάση τους μεταξύ τους αγώνες. Το FIFAonScreen παρέχει επίσης τον καλύτερο τρόπο για να παρακολουθήσετε το ζωντανό σκορ αυτού του αγώνα με διάφορα αθλητικά χαρακτηριστικά. Επομένως, μπορείτε να:",
    es: "En FIFAonScreen puedes encontrar todos los resultados anteriores de {homeName} vs {awayName} ordenados por sus partidos cara a cara. FIFAonScreen también ofrece la mejor manera de seguir el resultado en vivo de este partido con varias funciones deportivas. Por lo tanto, puedes:",
    "es-la": "En FIFAonScreen puedes encontrar todos los resultados anteriores de {homeName} vs {awayName} ordenados por sus partidos cara a cara. FIFAonScreen también ofrece la mejor manera de seguir el resultado en vivo de este partido con varias funciones deportivas. Por lo tanto, puedes:",
    fr: "Sur FIFAonScreen, vous pouvez trouver tous les résultats précédents de {homeName} vs {awayName} classés par leurs confrontations directes. FIFAonScreen offre également le meilleur moyen de suivre le score en direct de ce match grâce à diverses fonctionnalités sportives. Ainsi, vous pouvez :",
    hi: "FIFAonScreen पर আপনি আগের সমস্ত {homeName} বনাম {awayName} ফলাফল এবং তাদের H2H ম্যাচের তালিকা পাবেন। এছাড়াও FIFAonScreen এই খেলার লাইভ স্কোর অনুসরণ করার সেরা উপায় সরবরাহ করে। অতএব, আপনি করতে পারেন:",
    hr: "Na FIFAonScreen-u možete pronaći sve prethodne rezultate utakmica {homeName} vs {awayName} razvrstane prema njihovim H2H susretima. FIFAonScreen također pruža najbolji način za praćenje rezultata uživo ove utakmice s raznim sportskim značajkama. Stoga možete:",
    hu: "A FIFAonScreen oldalon megtalálhatja az összes korábbi {homeName} vs {awayName} eredményt az egymás elleni mérkőzések alapján. A FIFAonScreen emellett a legjobb módot kínálja a mérkőzés élő állásának követésére különböző sportfunkciókkal. Ezért Ön képes:",
    id: "Di FIFAonScreen Anda dapat menemukan semua hasil {homeName} vs {awayName} sebelumnya yang diurutkan berdasarkan pertandingan H2H mereka. FIFAonScreen juga menyediakan cara terbaik untuk mengikuti skor langsung pertandingan ini dengan berbagai fitur olahraga. Oleh karena itu, Anda dapat:",
    it: "Su FIFAonScreen puoi trovare tutti i risultati precedenti di {homeName} vs {awayName} ordinati in base ai loro testa a testa. FIFAonScreen fornisce anche il modo migliore per seguire il punteggio in diretta di questa partita con varie funzioni sportive. Di conseguenza, puoi:",
    nl: "Op FIFAonScreen vindt u alle eerdere resultaten van {homeName} tegen {awayName} gesorteerd op hun H2H-wedstrijden. FIFAonScreen biedt ook de beste manier om de livescore van deze wedstrijd te volgen met verschillende sportfuncties. Daarom kunt u:",
    no: "På FIFAonScreen kan du finne alle tidligere {homeName} vs {awayName}-resultater sortert etter deres H2H-kamper. FIFAonScreen gir også den beste måten å følge livescore på denne kampen med ulike sportsfunksjoner. Derfor kan du:",
    pl: "Na FIFAonScreen znajdziesz wszystkie poprzednie wyniki {homeName} vs {awayName} posortowane według ich meczów bezpośrednich H2H. FIFAonScreen zapewnia również najlepszy sposób śledzenia wyników na żywo z tego meczu z różnymi funkcjami sportowymi. Dzięki temu możesz:",
    pt: "No FIFAonScreen você pode encontrar todos os resultados anteriores de {homeName} vs {awayName} ordenados por seus confrontos diretos. O FIFAonScreen também oferece a melhor maneira de acompanhar o placar ao vivo deste jogo com vários recursos esportivos. Portanto, você pode:",
    "pt-pt": "No FIFAonScreen você pode encontrar todos os resultados anteriores de {homeName} vs {awayName} ordenados por seus confrontos diretos. O FIFAonScreen também oferece a melhor maneira de acompanhar o placar ao vivo deste jogo com vários recursos esportivos. Portanto, você pode:",
    ro: "Pe FIFAonScreen puteți găsi toate rezultatele anterioare ale meciurilor {homeName} vs {awayName} sortate după meciurile H2H. De asemenea, FIFAonScreen oferă cea mai bună modalitate de a urmări scorul live al acestui joc cu diverse caracteristici sportive. Prin urmare, puteți:",
    ru: "На FIFAonScreen вы можете найти все предыдущие результаты встреч {homeName} против {awayName}, отсортированные по их очным матчам. FIFAonScreen также предоставляет лучший способ следить за ходом матча с помощью различных спортивных функций. Таким образом, вы можете:",
    sk: "Na FIFAonScreen nájdete všetky predchádzajúce výsledky {homeName} vs {awayName} zoradené podľa ich vzájomných zápasov. FIFAonScreen tiež poskytuje najlepší spôsob, ako sledovať živé skóre tohto zápasu s rôznymi športovými funkciami. Môžete teda:",
    sl: "Na FIFAonScreen najdete vse prejšnje rezultate tekem med ekipama {homeName} in {awayName}, razvrščene po njihovih medsebojnih tekmah. FIFAonScreen ponuja tudi najboljši način za spremljanje rezultatov te tekme v živo z različnimi športnimi funkcijami. Zato lahko:",
    sr: "На FIFAonScreen-у можете пронаћи све претходне резултате утакмица {homeName} vs {awayName} разврстане према њиховим Х2Х сусретима. FIFAonScreen такође пружа најбољи начин за праћење резултата уживо ове утакмице са разним спортским карактеристикама. Стога можете:",
    sv: "På FIFAonScreen kan du hitta alla tidigare resultat för {homeName} vs {awayName} sorterade efter deras inbördes möten. FIFAonScreen ger också det bästa sättet att följa livescore för denna match med olika sportfunktioner. Därför kan du:",
    tr: "FIFAonScreen'de, H2H maçlarına göre sıralanmış tüm geçmiş {homeName} vs {awayName} sonuçlarını bulabilirsiniz. FIFAonScreen ayrıca çeşitli spor özellikleriyle bu maçın canlı skorunu takip etmeniz için en iyi yolu sunar. Bu sayede şunları yapabilirsiniz:",
    zh: "在 FIFAonScreen 上，您可以找到按历史交锋记录排序的 {homeName} 对阵 {awayName} 的所有历史交锋结果。FIFAonScreen 还提供多种体育功能，是关注本场比赛实时比分的最佳方式。因此，您可以：",
    jp: "FIFAonScreenでは、過去の対戦による{homeName}対{awayName}のすべての結果をH2Hマッチごとに並べて確認できます。また、FIFAonScreenは様々なスポーツ機能を使ってこの試合のライブスコアを追うための最適な方法を提供しています。したがって、次のことが可能です：",
    kr: "FIFAonScreen에서는 H2H 매치로 정렬된 {homeName} 대 {awayName}의 모든 이전 경기 결과를 확인할 수 있습니다. 또한 FIFAonScreen은 다양한 스포츠 기능과 함께 이 경기의 라이브 스코어를 팔로우할 수 있는 가장 좋은 방법을 제공합니다. 따라서 다음과 같은 서비스를 이용할 수 있습니다:",
    vn: "Trên FIFAonScreen, bạn có thể tìm thấy tất cả kết quả đối đầu trước đây giữa {homeName} và {awayName} được sắp xếp theo các trận đấu H2H của họ. FIFAonScreen cũng cung cấp cách tốt nhất để theo dõi tỷ số trực tiếp của trận đấu này với nhiều tính năng thể thao khác nhau. Do đó, bạn có thể:",
    he: "ב-FIFAonScreen תוכל למצוא את כל התוצאות הקודמות של {homeName} נגד {awayName} ממוינות לפי משחקי ראש בראש שלהם. FIFAonScreen מספק גם את הדרך הטובה ביותר לעקוב אחר התוצאה החיה של המשחק הזה עם תכונות ספורט שונות. לכן, אתה יכול:",
    th: "บน FIFAonScreen คุณสามารถค้นหาผลการแข่งขันย้อนหลังทั้งหมดระหว่าง {homeName} กับ {awayName} ที่จัดเรียงตามการพบกันของพวกเขา (H2H) นอกจากนี้ FIFAonScreen ยังเป็นช่องทางที่ดีที่สุดในการติดตามผลการแข่งขันสดของเกมนี้พร้อมฟีเจอร์กีฬาที่หลากหลาย ดังนั้นคุณสามารถ:"
  },
  h2h_feature_1: {
    en: "Find out who scored in a live match",
    "en-us": "Find out who scored in a live match",
    ar: "معرفة من سجل في مباراة مباشرة",
    az: "Canlı oyunda kimin qol vurduğunu öyrənin",
    bn: "লাইভ ম্যাচে কে গোল করেছে তা জানতে পারেন",
    cs: "Zjistěte, kdo skóroval v živém zápase",
    da: "Find ud af, hvem der scorede i en live kamp",
    de: "Finden Sie heraus, wer in einem Live-Spiel getroffen hat",
    el: "Μάθετε ποιος σκόραρε σε έναν ζωντανό αγώνα",
    es: "Descubre quién marcó en un partido en vivo",
    "es-la": "Descubre quién marcó en un partido en vivo",
    fr: "Découvrir qui a marqué dans un match en direct",
    hi: "लाइव मैच में किसने गोल किया, यह जानें",
    hr: "Saznajte tko je zabio gol u utakmici uživo",
    hu: "Tudja meg, ki szerzett gólt az élő mérkőzésen",
    id: "Cari tahu siapa yang mencetak gol dalam pertandingan langsung",
    it: "Scopri chi ha segnato in una partita in diretta",
    nl: "Ontdek wie er gescoord heeft in een live wedstrijd",
    no: "Finn ut hvem som scoret i en live kamp",
    pl: "Dowiedz się, kto strzelił gola w meczu na żywo",
    pt: "Descubra quem marcou em uma partida ao vivo",
    "pt-pt": "Descubra quem marcou em uma partida ao vivo",
    ro: "Aflați cine a marcat într-un meci live",
    ru: "Узнайте, кто забил гол в прямом эфире",
    sk: "Zistite, kto skóroval v živom zápase",
    sl: "Ugotovite, kdo je dosegel gol na tekmi v živo",
    sr: "Сазнајте ко је постигао гол у утакмици уживо",
    sv: "Ta reda på vem som gjorde mål i en livematch",
    tr: "Canlı maçta kimin gol attığını öğrenin",
    zh: "了解谁 في 实时比赛中进球",
    jp: "対戦結果統計と勝率",
    kr: "이전 경기 기록 및 통계 데이터",
    vn: "Lịch sử đối đầu & Số liệu thống kê",
    he: "נתונים סטטיסטיים של מפגשים קודמים",
    th: "ประวัติการพบกันและข้อมูลสถิติ"
  },
  h2h_feature_2: {
    en: "Get real-time information on which team is dominating the match using the Attack Momentum",
    "en-us": "Get real-time information on which team is dominating the match using the Attack Momentum",
    ar: "الحصول على معلومات في الوقت الفعلي حول الفريق المسيطر على المباراة باستخدام زخم الهجوم",
    az: "Zərf Momentumundan istifadə edərək hansı komandanın oyunda üstünlük təşkil etdiyi barədə real vaxt məlumatı əldə edin",
    bn: "অ্যাটাক মোমেন্টাম ব্যবহার করে কোন দল ম্যাচে আধিপত্য বিস্তার করছে তা রিয়েল-টাইমে জানতে পারেন",
    cs: "Získejte informace v reálném čase o tom, který tým dominuje zápasu, pomocí funkce Attack Momentum",
    da: "Få realtidsinformation om, hvilket hold der dominerer kampen, ved hjælp af Attack Momentum",
    de: "Erhalten Sie mit dem Attack Momentum Echtzeit-Informationen darüber, welches Team das Spiel dominiert",
    el: "Λάβετε πληροφορίες σε πραγματικό χρόνο για το ποια ομάδα κυριαρχεί στον αγώνα χρησιμοποιώντας το Attack Momentum",
    es: "Obtén información en tiempo real sobre qué equipo está dominando el partido usando el Attack Momentum",
    "es-la": "Obtén información en tiempo real sobre qué equipo está dominando el partido usando el Attack Momentum",
    fr: "Obtenir des informations en temps réel sur l'équipe qui domine le match grâce à l'Attack Momentum",
    hi: "अटैक मोमेंटम का उपयोग करके वास्तविक समय में जानकारी प्राप्त करें कि कौन सी टीम मैच पर हावी है",
    hr: "Dobijte informacije u stvarnom vremenu o tome koja momčad dominira utakmicom koristeći Attack Momentum",
    hu: "Valós idejű információkat kaphat arról, melyik csapat uralja a mérkőzést az Attack Momentum segítségével",
    id: "Dapatkan informasi waktu nyata tentang tim mana yang mendominasi pertandingan menggunakan Momentum Serangan",
    it: "Ottieni informazioni in tempo reale su quale squadra sta dominando la partita utilizzando l'Attack Momentum",
    nl: "Ontvang realtime informatie over welk team de wedstrijd domineert met behulp van het Attack Momentum",
    no: "Få sanntidsinformasjon om hvilket lag som dominerer kampen ved hjelp av Attack Momentum",
    pl: "Uzyskaj informacje w czasie rzeczywistym o tym, która drużyna dominuje w meczu, korzystając z Attack Momentum",
    pt: "Obtenha informações em tempo real sobre qual time está dominando a partida usando o Attack Momentum",
    "pt-pt": "Obtenha informações em tempo real sobre qual time está dominando a partida usando o Attack Momentum",
    ro: "Obțineți informații în timp real despre echipa care domină meciul folosind Attack Momentum",
    ru: "Получайте информацию в реальном времени о том, какая команда доминирует в матче, используя шкалу давления (Attack Momentum)",
    sk: "Získajte informácie v reálnom čase o tom, ktorý tím dominuje zápasu, pomocou funkcie Attack Momentum",
    sl: "Prejmite informacije v realnem času o tem, katera ekipa prevladuje na tekmi, s pomočjo funkcije Attack Momentum",
    sr: "Добијте информације у реалном времену о томе који тим доминира утакмицом користећи Attack Momentum",
    sv: "Få realtidsinformation om vilket lag som dominerar matchen med hjälp av Attack Momentum",
    tr: "Hücum Momentumu (Attack Momentum) özelliğini kullanarak hangi takımın maçı domine ettiği hakkında gerçek zamanlı bilgi edinin",
    zh: "利用进攻势头 (Attack Momentum) 获取哪支球队主导比赛的的实时信息",
    jp: "最新のゴール得点率と守備力",
    kr: "최근 득점 형태 및 수비 능력",
    vn: "Phong độ ghi bàn & Phòng ngự gần đây",
    he: "מגמות הבקעה וחוזק הגנתי לאחרונה",
    th: "สถิติการทำประตูและเกมรับล่าสุด"
  },
  h2h_feature_3: {
    en: "Track all home and away games for each team in the FIFA World Cup, Group {group}",
    "en-us": "Track all home and away games for each team in the FIFA World Cup, Group {group}",
    ar: "تتبع جميع المباريات داخل الأرض وخارجها لكل فريق في كأس العالم، المجموعة {group}",
    az: "FIFA Dünya Kubokunda hər bir komandanın Qrup {group}-dakı bütün ev və səfər oyunlarını izləyin",
    bn: "ফিফা বিশ্বকাপ, গ্রুপ {group}-এর প্রতিটি দলের সমস্ত হোম এবং অ্যাওয়ে গেম ট্র্যাক করতে পারেন",
    cs: "Sledujte všechny domácí a venkovní zápasy každého týmu na Mistrovství světa FIFA ve skupině {group}",
    da: "Følg alle hjemme- og udekampe for hvert hold i FIFA VM, Gruppe {group}",
    de: "Verfolgen Sie alle Heim- und Auswärtsspiele jedes Teams bei der FIFA-Weltmeisterschaft in der Gruppe {group}",
    el: "Παρακολουθήστε όλους τους εντός και εκτός έδρας αγώνες για κάθε ομάδα στο Παγκόσμιο Κύπελλο FIFA, Όμιλος {group}",
    es: "Sigue todos los partidos de local y visitante de cada equipo en la Copa Mundial de la FIFA, Grupo {group}",
    "es-la": "Sigue todos los partidos de local y visitante de cada equipo en la Copa Mundial de la FIFA, Grupo {group}",
    fr: "Suivre tous les matchs à domicile et à l'extérieur de chaque équipe de la Coupe du Monde de la FIFA, Groupe {group}",
    hi: "फीफा विश्व कप, ग्रुप {group} में प्रत्येक टीम के लिए सभी घरेलू और बाहरी मैचों को ट्रैक करें",
    hr: "Pratite sve domaće i gostujuće utakmice za svaku momčad na FIFA Svjetskom prvenstvu, skupina {group}",
    hu: "Kövesse nyomon a FIFA-világbajnokság {group} csoportjában szereplő csapatok összes hazai és idegenbeli mérkőzését",
    id: "Lacak semua pertandingan kandang dan tandang untuk setiap tim di Piala Dunia FIFA, Grup {group}",
    it: "Segui tutte le partite in casa e in trasferta di ciascuna squadra nella Coppa del Mondo FIFA, Gruppo {group}",
    nl: "Volg alle thuis- en uitwedstrijden voor elk team in de FIFA Wereldbeker, Groep {group}",
    no: "Følg alle hjemme- og bortekamper for hvert lag i FIFA VM, Gruppe {group}",
    pl: "Śledź wszystkie mecze domowe i wyjazdowe każdej drużyny na Mistrzostwach Świata FIFA, Grupa {group}",
    pt: "Acompanhe todos os jogos em casa e fora de cada seleção na Copa do Mundo FIFA, Grupo {group}",
    "pt-pt": "Acompanhe todos os jogos em casa e fora de cada seleção na Copa do Mundo FIFA, Grupo {group}",
    ro: "Urmăriți toate meciurile de acasă și din deplasare pentru fiecare echipă de la Cupa Mondială FIFA, Grupa {group}",
    ru: "Отслеживайте все домашние и выездные матчи каждой команды в рамках Чемпионата мира по футболу, Группа {group}",
    sk: "Sledujte všetky domáce a vonkajšie zápasy každého tímu na Majstrovstvách sveta FIFA v skupine {group}",
    sl: "Spremljajte vse tekme doma in v gosteh za vsako ekipo na svetovnem prvenstvu v nogometu FIFA, skupina {group}",
    sr: "Пратите све домаће и гостујуће утакмице за сваки тим на ФИФА Светском првенству, група {group}",
    sv: "Följ alla hemma- och bortamatcher för varje lag i FIFA VM, Grupp {group}",
    tr: "FIFA Dünya Kupası Grup {group}'taki her takımın tüm iç saha ve dış saha maçlarını takip edin",
    zh: "追踪每支球队在 2026 FIFA 世界杯 {group} 组中的所有主客场比赛",
    jp: "キープレーヤーの負傷情報と出場予定",
    kr: "주요 선수 부상 정보 및 라인업 가능성",
    vn: "Tình hình chấn thương & Đội hình dự kiến",
    he: "עדכוני פציעות שחקני מפתח והרכבים משוערים",
    th: "รายงานการบาดเจ็บของนักเตะคีย์แมนและรายชื่อตัวจริง"
  },
  h2h_feature_4: {
    en: "Check out how FIFAonScreen community votes on which team is more likely to win this match.",
    "en-us": "Check out how FIFAonScreen community votes on which team is more likely to win this match.",
    ar: "الاطلاع على تصويت مجتمع FIFAonScreen حول الفريق الأكثر احتمالاً للفوز بهذه المباراة.",
    az: "FIFAonScreen icmasının bu oyunda hansı komandanın qalib gəlmə ehtimalının daha yüksək olduğuna necə səs verdiyini yoxlayın.",
    bn: "FIFAonScreen কমিউনিটি কোন দলের জেতার সম্ভাবনা বেশি তা নিয়ে কীভাবে ভোট দিচ্ছে তা দেখতে পারেন।",
    cs: "Podívejte se, jak komunita FIFAonScreen hlasuje o tom, který tým má větší šanci na vítězství v tomto zápase.",
    da: "Se, hvordan FIFAonScreen-fællesskabet stemmer om, hvilket hold der mest sandsynligt vinder denne kamp.",
    de: "Sehen Sie sich an, wie die FIFAonScreen-Community darüber abstimmt, welches Team dieses Spiel am ehesten gewinnt.",
    el: "Δείτε πώς ψηφίζει η κοινότητα του FIFAonScreen για το ποια ομάδα είναι πιο πιθανό να κερδίσει αυτόν τον αγώνα.",
    es: "Mira cómo vota la comunidad de FIFAonScreen sobre qué equipo tiene más probabilidades de ganar este partido.",
    "es-la": "Mira cómo vota la comunidad de FIFAonScreen sobre qué equipo tiene más probabilidades de ganar este partido.",
    fr: "Voir comment la communauté FIFAonScreen vote pour l'équipe la plus susceptible de gagner ce match.",
    hi: "FIFAonScreen कम्युनिटी किस टीम के जीतने की संभावना अधिक है, इस पर कैसे वोट कर रही है, यह देखें।",
    hr: "Provjerite kako zajednica FIFAonScreen glasa o tome koja momčad ima veće šanse za pobjedu u ovoj utakmici.",
    hu: "Nézze meg, hogyan szavaz a FIFAonScreen közösség arról, hogy melyik csapatnak van nagyobb esélye a győzelemre.",
    id: "Lihat bagaimana komunitas FIFAonScreen memilih tim mana yang lebih berpeluang memenangkan pertandingan ini.",
    it: "Scopri come vota la community di FIFAonScreen su quale squadra ha maggiori probabilità di vincere questa partita.",
    nl: "Bekijk hoe de FIFAonScreen-community stemt op welk team de meeste kans heeft om deze wedstrijd te winnen.",
    no: "Sjekk hvordan FIFAonScreen-fellesskapet stemmer på hvilket lag som har størst sjanse til å vinne denne kampen.",
    pl: "Sprawdź, jak społeczność FIFAonScreen głosuje na to, która drużyna ma większe szanse na wygraną w tym meczu.",
    pt: "Veja como a comunidade FIFAonScreen está votando em qual seleção tem mais chances de vencer este confronto.",
    "pt-pt": "Veja como a comunidade FIFAonScreen está votando em qual seleção tem mais chances de vencer este confronto.",
    ro: "Vedeți cum votează comunitatea FIFAonScreen cu privire al echipa care are mai multe șanse să câștige acest meci.",
    ru: "Узнайте, как сообщество FIFAonScreen голосует за команду, у которой больше шансов победить в этом матче.",
    sk: "Pozrite sa, ako komunita FIFAonScreen hlasuje o tom, ktorý tím má väčšiu šancu na víťazstvo v tomto zápase.",
    sl: "Preverite, kako skupnost FIFAonScreen glasuje o tem, katera ekipa ima večje možnosti za zmago na tej tekmi.",
    sr: "Проверите како заједница FIFAonScreen гласа о томе који тим има веће шансе за победу у овој утакмици.",
    sv: "Kolla in hur FIFAonScreen-communityn röstar om vilket lag som är mest troligt att vinna matchen.",
    tr: "FIFAonScreen topluluğunun bu maçı hangi takımın kazanma olasılığının daha yüksek olduğuna dair nasıl oy verdiğini inceleyin.",
    zh: "查看 FIFAonScreen 社区对哪支球队更有可能赢得本场比赛的投票结果",
    jp: "公式AIアルゴリズムによる勝敗予測",
    kr: "공식 AI 알고리즘 승률 시뮬레이션",
    vn: "Thuật toán dự đoán tỷ lệ thắng AI chính thức",
    he: "אלגוריתם AI רשמי לחיזוי סיכויי ניצחון",
    th: "การคำนวณโอกาสชนะด้วย AI อัลกอริทึมอย่างเป็นทางการ"
  },
  h2h_prediction_odds: {
    en: "All of these features can help you decide on {homeName} vs. {awayName} game prediction. Even though FIFAonScreen doesn't offer direct betting, it provides the best odds and shows you which sites offer live betting. Live U-TV odds are viewable on FIFAonScreen's Football live score section.",
    "en-us": "All of these features can help you decide on {homeName} vs. {awayName} game prediction. Even though FIFAonScreen doesn't offer direct betting, it provides the best odds and shows you which sites offer live betting. Live U-TV odds are viewable on FIFAonScreen's Football live score section.",
    ar: "كل هذه الميزات يمكن أن تساعدك في اتخاذ قرارك بشأن توقع مباراة {homeName} ضد {awayName}. وعلى الرغم من أن FIFAonScreen لا يقدم خدمات المراهنة المباشرة، إلا أنه يوفر أفضل الاحتمالات ويعرض لك المواقع التي تقدم المراهنة المباشرة. احتمالات Live U-TV متاحة للمشاهدة في قسم النتائج المباشرة لكرة القدم في FIFAonScreen.",
    az: "Bütün bu xüsusiyyətlər {homeName} vs. {awayName} oyunu haqqında təxmin etməyinizə kömək edə bilər. FIFAonScreen birbaşa mərc təklif etməsə də, ən yaxşı əmsalları təqdim edir və hansı saytların canlı mərc təklif etdiyini göstərir. Canlı U-TV əmsallarını FIFAonScreen-in Futbol canlı hesabı bölməsində görmək olar.",
    bn: "এই সমস্ত ফিচার আপনাকে {homeName} বনাম {awayName} ম্যাচের অনুমান করতে সাহায্য করতে পারে। যদিও FIFAonScreen সরাসরি বাজির সুযোগ দেয় না, তবুও এটি সেরা অডস সরবরাহ করে এবং কোন সাইটগুলি লাইভ বাজি অফার করে তা দেখায়। লাইভ U-TV অডস FIFAonScreen-এর ফুটবল লাইভ স্কোর সেকশনে দেখা যাবে।",
    cs: "Všechny tyto funkce vám mohou pomoci rozhodnout o předpovědi zápasu {homeName} vs. {awayName}. I když FIFAonScreen nenabízí přímé sázení, poskytuje nejlepší kurzy a ukazuje vám, které weby nabízejí živé sázení. Živé kurzy U-TV si můžete prohlédnout v sekci živých fotbalových výsledků na FIFAonScreen.",
    da: "Alle disse funktioner kan hjælpe dig med at beslutte dig for {homeName} vs. {awayName} spilforudsigelse. Selvom FIFAonScreen ikke tilbyder direkte væddemål, giver det de bedste odds og viser dig, hvilke sider der tilbyder live betting. Live U-TV-odds kan ses på FIFAonScreens fodbold-livescoresektion.",
    de: "All diese Funktionen können Ihnen bei der Spielvorhersage für {homeName} gegen {awayName} helfen. Obwohl FIFAonScreen keine direkten Wetten anbietet, liefert es die besten Quoten und zeigt Ihnen, welche Seiten Live-Wetten anbieten. Live-U-TV-Quoten können im Bereich für Live-Fußballspielstände auf FIFAonScreen eingesehen werden.",
    el: "Όλα αυτά τα χαρακτηριστικά μπορούν να σας βοηθήσουν να αποφασίσετε για την πρόβλεψη του αγώνα {homeName} εναντίον {awayName}. Παρόλο που το FIFAonScreen δεν προσφέρει απευθείας στοίχημα, παρέχει τις καλύτερες αποδόσεις και σας δείχνει ποιες ιστοσελίδες προσφέρουν ζωντανό στοίχημα. Οι αποδόσεις Live U-TV είναι ορατές στην ενότητα ζωντανών σκορ ποδοσφαίρου του FIFAonScreen.",
    es: "Todas estas características pueden ayudarte a decidir sobre el pronóstico del partido entre {homeName} y {awayName}. Aunque FIFAonScreen no ofrece apuestas directas, proporciona las mejores cuotas y te muestra qué sitios ofrecen apuestas en vivo. Las cuotas en vivo de U-TV se pueden ver en la sección de resultados en vivo de fútbol de FIFAonScreen.",
    "es-la": "Todas estas características pueden ayudarte a decidir sobre el pronóstico del partido entre {homeName} y {awayName}. Aunque FIFAonScreen no ofrece apuestas directas, proporciona las mejores cuotas y te muestra qué sitios ofrecen apuestas en vivo. Las cuotas en vivo de U-TV se pueden ver en la sección de resultados en vivo de fútbol de FIFAonScreen.",
    fr: "Toutes ces fonctionnalités peuvent vous aider à faire vos pronostics pour le match {homeName} vs {awayName}. Bien que FIFAonScreen ne propose pas de paris directs, il fournit les meilleures cotes et affiche les sites proposant des paris en direct. Les cotes en direct U-TV sont consultables dans la section des scores en direct sur FIFAonScreen.",
    hi: "ये सभी सुविधाएं आपको {homeName} बनाम {awayName} मैच की भविष्यवाणी करने में मदद कर सकती हैं। यद्यपि FIFAonScreen प्रत्यक्ष सट्टेबाजी की पेशकश नहीं करता है, यह सर्वोत्तम ऑड्स प्रदान करता है और दिखाता है कि कौन सी साइटें लाइव सट्टेबाजी की पेशकश करती हैं। लाइव U-TV ऑड्स FIFAonScreen के फुटबॉल लाइव स्कोर अनुभाग में देखे जा सकते हैं।",
    hr: "Sve ove značajke mogu vam pomoći da odlučite o predviđanju utakmice {homeName} vs. {awayName}. Iako FIFAonScreen ne nudi izravno klađenje, pruža najbolje koeficijente i pokazuje vam koje stranice nude klađenje uživo. Live U-TV koeficijenti mogu se vidjeti u odjeljku nogometnih rezultata uživo na FIFAonScreen-u.",
    hu: "Mindezek a funkciók segíthetnek dönteni a {homeName} vs. {awayName} mérkőzés tippjével kapcsolatban. Bár a FIFAonScreen nem kínál közvetlen fogadást, a legjobb szorzókat nyújtja, és megmutatja, mely oldalak kínálnak élő fogadást. Az élő U-TV szorzók megtekinthetők a FIFAonScreen labdarúgás élő eredmények szekciójában.",
    id: "Semua fitur ini dapat membantu Anda menentukan prediksi pertandingan {homeName} vs. {awayName}. Meskipun FIFAonScreen tidak menawarkan taruhan langsung, ini memberikan peluang terbaik dan menunjukkan kepada Anda situs mana yang menawarkan taruhan langsung. Peluang Live U-TV dapat dilihat di bagian skor langsung Sepak Bola FIFAonScreen.",
    it: "Tutte queste caratteristiche possono aiutarti a decidere la tua previsione sulla partita {homeName} vs. {awayName}. Sebbene FIFAonScreen no offra scommesse dirette, fornisce le migliori quote e ti mostra quali siti offrono scommesse in diretta. Le quote Live U-TV sono visibili nella sezione dei risultati in diretta sul calcio di FIFAonScreen.",
    nl: "Al deze functies kunnen u helpen bij de voorspelling van de wedstrijd {homeName} tegen {awayName}. Hoewel FIFAonScreen geen directe weddenschappen aanbiedt, biedt het de beste odds en laat het zien welke sites live weddenschappen aanbieden. Live U-TV-odds zijn te bekijken in de live voetbalscore-sectie van FIFAonScreen.",
    no: "Alle disse funksjonene kan hjelpe deg med å bestemme tippespillet for {homeName} vs. {awayName}. Selv om FIFAonScreen ikke tilbyr direkte tipping, gir det de beste oddsene og viser deg hvilke sider som tilbyr live tipping. Live U-TV-odds er synlige i livescore-delen på FIFAonScreen.",
    pl: "Wszystkie te funkcje mogą pomóc w podjęciu decyzji o typie na mecz {homeName} vs. {awayName}. Chociaż FIFAonScreen nie oferuje bezpośrednich zakładów, zapewnia najlepsze kursy i pokazuje, które strony oferują zakłady na żywo. Kursy na żywo U-TV można przeglądać w sekcji wyników piłkarskich na żywo w serwisie FIFAonScreen.",
    pt: "Todos esses recursos podem ajudá-lo a decidir sobre o palpite para {homeName} vs. {awayName}. Embora o FIFAonScreen não ofereça apostas diretas, ele fornece as melhores cotações e mostra quais sites oferecem apostas ao vivo. As probabilidades Live U-TV são visualizáveis na seção de placar ao vivo de futebol do FIFAonScreen.",
    "pt-pt": "Todos esses recursos podem ajudá-lo a decidir sobre o palpite para {homeName} vs. {awayName}. Embora o FIFAonScreen não ofereça apostas diretas, ele fornece as melhores cotações e mostra quais sites oferecem apostas ao vivo. As probabilidades Live U-TV são visualizáveis na seção de placar ao vivo de futebol do FIFAonScreen.",
    ro: "Toate aceste caracteristici vă pot ajuta să decideți cu privire la pronosticul meciului {homeName} vs. {awayName}. Deși FIFAonScreen nu oferă pariuri directe, oferă cele mai bune cote și vă arată care site-uri oferă pariuri live. Cotele Live U-TV pot fi vizualizate în secțiunea de scoruri live de fotbal de pe FIFAonScreen.",
    ru: "Все эти функции помогут вам определиться с прогнозом на матч {homeName} против {awayName}. Хотя FIFAonScreen не предлагает прямых ставок, он предоставляет лучшие коэффициенты и показывает, какие сайты предлагают ставки в реальном времени. Коэффициенты в режиме реального времени (Live U-TV) можно посмотреть в разделе футбольных результатов на FIFAonScreen.",
    sk: "Všetky tieto funkcie vám môžu pomôcť rozhodnúť o predpovedi zápasu {homeName} vs. {awayName}. Aj keď FIFAonScreen neponúka priame stávkovanie, poskytuje najlepšie kurzy a ukazuje vám, ktoré weby ponúkajú živé stávkovanie. Živé kurzy U-TV si môžete pozrieť v sekcii živých futbalových výsledkov na FIFAonScreen.",
    sl: "Vse te funkcije vam lahko pomagajo pri napovedi izida tekme med ekipama {homeName} in {awayName}. Čeprav FIFAonScreen ne ponuja neposrednih stav, ponuja najboljše kvote in prikazuje, katera mesta ponujajo stave v živo. Kvote U-TV v živo si lahko ogledate v razdelku z rezultati tekem v živo na strani FIFAonScreen.",
    sr: "Све ове карактеристике могу вам помоћи да одлучите о предвиђању утакмице {homeName} vs. {awayName}. Иако FIFAonScreen не нуди директно клађење, пружа најбоље квоте и показује вам који сајтови нуде клађење уживо. Ливе У-ТВ квоте могу се видети у одељку фудбалских резултата уживо на FIFAonScreen-у.",
    sv: "Alla dessa funktioner kan hjälpa dig att göra en speltippning för {homeName} vs. {awayName}. Även om FIFAonScreen inte erbjuder direkt betting så ger det de bästa oddsen och visar dig vilka sajter som erbjuder live betting. Live U-TV-odds kan ses på FIFAonScreens fotboll-livescoreavdelning.",
    tr: "Tüm bu özellikler, {homeName} vs. {awayName} maçı tahminine karar vermenize yardımcı olabilir. FIFAonScreen doğrudan bahis sunmasa da en iyi oranları sağlar ve hangi sitelerin canlı bahis sunduğunu gösterir. Canlı U-TV oranları, FIFAonScreen'in futbol canlı skor bölümünden görüntülenebilir.",
    zh: "所有这些功能都有助于您做出对 {homeName} 对阵 {awayName} 比赛的预测。虽然 FIFAonScreen 不提供直接投注，但它提供了最佳赔率，并向您显示哪些网站提供实时投注。实时 U-TV 赔率可在 FIFAonScreen 的足球实时比分板块中查看。",
    jp: "これらの機能はすべて、{homeName}対{awayName}の試合予測を決めるのに役立ちます。FIFAonScreenは直接の賭けは提供していませんが、最高のオッズを提供し、どのサイトがライブベットを提供しているかを示します。ライブU-TVオッズはFIFAonScreenのサッカーライブスコアセクションで閲覧可能です。",
    kr: "이 모든 기능은 {homeName} 대 {awayName} 경기 결과 예측에 도움을 줄 수 있습니다. FIFAonScreen은 직접적인 베팅을 제공하지 않지만, 최고의 배당률을 제공하고 라이브 베팅을 제공하는 사이트를 보여줍니다. 라이브 U-TV 배당률은 FIFAonScreen의 축구 라이브 스코어 섹션에서 확인하실 수 있습니다.",
    vn: "Tất cả các tính năng này có thể giúp bạn đưa ra dự đoán về trận đấu giữa {homeName} và {awayName}. Mặc dù FIFAonScreen không cung cấp dịch vụ cá cược trực tiếp, nhưng nó cung cấp tỷ lệ cược tốt nhất và hiển thị cho bạn các trang web cung cấp cá cược trực tiếp. Tỷ lệ cược U-TV trực tiếp có thể xem trên phần tỷ số bóng đá trực tiếp của FIFAonScreen.",
    he: "כל התכונות הלلو יכולות לעזור לך להחליט על תחזית המשחק בין {homeName} ל-{awayName}. למרות ש-FIFAonScreen אינו מציע הימורים ישירים, הוא מספק את היחס הטוב ביותר ומציע לך באילו אתרים ניתן להמר בשידור חי. יחסי הימורים חיים של U-TV זמינים לצפייה במדור תוצאות הכדורגל החיות של FIFAonScreen.",
    th: "ฟีเจอร์ทั้งหมดเหล่านี้สามารถช่วยคุณในการตัดสินใจทำนายผลการแข่งขันระหว่าง {homeName} กับ {awayName} แม้ว่า FIFAonScreen จะไม่ได้เสนอการเดิมพันโดยตรง แต่เราก็ให้อัตราต่อรองที่ดีที่สุดและแสดงความเห็นว่าเว็บไซต์ใดบ้างที่มีการเดิมพันสด อัตราต่อรองสด U-TV สามารถดูได้ที่เซกชันผลบอลสดของ FIFAonScreen"
  },
  where_to_watch: {
    en: "Where to watch {homeName} vs. {awayName}? Under TV Channels section you can find the list of all channels that broadcast {homeName} – {awayName} live match.",
    "en-us": "Where to watch {homeName} vs. {awayName}? Under TV Channels section you can find the list of all channels that broadcast {homeName} – {awayName} live match.",
    ar: "أين يمكن مشاهدة مباراة {homeName} ضد {awayName}؟ ضمن قسم القنوات التلفزيونية يمكنك العثور على قائمة بجميع القنوات التي تبث مباراة {homeName} – {awayName} مباشرة.",
    az: "{homeName} və {awayName} oyununa harada baxmaq olar? TV Kanalları bölməsində {homeName} – {awayName} oyununu canlı yayımlayan bütün kanalların siyahısını tapa bilərsiniz.",
    bn: "{homeName} বনাম {awayName} ম্যাচটি কোথায় দেখবেন? টিভি চ্যানেল সেকশনের অধীনে আপনি এমন সমস্ত চ্যানেলের তালিকা পেতে পারেন যা {homeName} – {awayName} লাইভ ম্যাচ সম্প্রচার করে।",
    cs: "Kde sledovat {homeName} vs. {awayName}? V sekci TV kanály najdete seznam všech kanálů, které vysílají živý zápas {homeName} – {awayName}.",
    da: "Hvor kan man se {homeName} vs. {awayName}? Under TV-kanaler kan du finde listen over alle kanaler, der sender {homeName} – {awayName} live kamp.",
    de: "Wo kann man {homeName} gegen {awayName} sehen? Im Bereich Fernsehkanäle finden Sie die Liste aller Kanäle, die das Live-Spiel {homeName} – {awayName} übertragen.",
    el: "Πού να παρακολουθήσετε το {homeName} εναντίον {awayName}; Στην ενότητα Τηλεοπτικά Κανάλια μπορείτε να βρείτε τη λίστα με όλα τα κανάλια που μεταδίδουν ζωντανά τον αγώνα {homeName} – {awayName}.",
    es: "¿Dónde ver {homeName} vs. {awayName}? En la sección de canales de televisión puedes encontrar la lista de todos los canales que transmiten el partido en vivo entre {homeName} y {awayName}.",
    "es-la": "¿Dónde ver {homeName} vs. {awayName}? En la sección de canales de televisión puedes encontrar la lista de todos los canales que transmiten el partido en vivo entre {homeName} y {awayName}.",
    fr: "Où regarder {homeName} vs {awayName} ? Dans la section Chaînes TV, vous trouverez la liste de toutes les chaînes diffusant le match en direct {homeName} – {awayName}.",
    hi: "{homeName} बनाम {awayName} कहां देखें? टीवी चैनल अनुभाग के तहत आप उन सभी चैनलों की सूची पा सकते हैं जो {homeName} – {awayName} लाइव मैच प्रसारित करते हैं।",
    hr: "Gdje gledati {homeName} protiv {awayName}? U odjeljku TV kanali možete pronaći popis svih kanala koji prenose utakmicu {homeName} – {awayName} uživo.",
    hu: "Hol nézhető a {homeName} vs. {awayName}? A TV-csatornák szekcióban megtalálható azon csatornák listája, amelyek élőben közvetítik a {homeName} – {awayName} mérkőzést.",
    id: "Di mana menonton {homeName} vs. {awayName}? Di bawah bagian Saluran TV Anda dapat menemukan daftar semua saluran yang menyiarkan pertandingan langsung {homeName} – {awayName}.",
    it: "Dove guardare {homeName} vs. {awayName}? Sotto la sezione Canali TV puoi trovare l'elenco di tutti i canali che trasmettono in diretta la partita {homeName} – {awayName}.",
    nl: "Waar kunt u {homeName} tegen {awayName} bekijken? In de sectie TV-kanalen vindt u de lijst met alle kanalen die de wedstrijd {homeName} – {awayName} live uitzenden.",
    no: "Hvor kan man se {homeName} møter {awayName}? Under TV-kanaler finner du listen over alle kanaler som sender {homeName} – {awayName} live kamp.",
    pl: "Gdzie oglądać mecz {homeName} vs. {awayName}? W sekcji Kanały telewizyjne znajdziesz listę wszystkich kanałów transmitujących mecz {homeName} – {awayName} na żywo.",
    pt: "Onde assistir a {homeName} vs. {awayName}? Na seção de canais de TV você encontra a lista de todos os canais que transmitem o jogo ao vivo de {homeName} – {awayName}.",
    "pt-pt": "Onde assistir a {homeName} vs. {awayName}? Na seção de canais de TV você encontra a lista de todos os canais que transmitem o jogo ao vivo de {homeName} – {awayName}.",
    ro: "Unde se poate viziona {homeName} vs. {awayName}? În secțiunea Canale TV puteți găsi lista tuturor canalelor care transmit în direct meciul {homeName} – {awayName}.",
    ru: "Где смотреть матч {homeName} против {awayName}? В разделе «ТВ-каналы» вы можете найти список всех каналов, транслирующих матч {homeName} – {awayName} в прямом эфире.",
    sk: "Kde sledovať {homeName} vs. {awayName}? V sekcii TV kanály nájdete zoznam všetkých kanálov, ktoré vysielajú živý zápas {homeName} – {awayName}.",
    sl: "Kje gledati tekmo med {homeName} in {awayName}? V razdelku TV kanali lahko najdete seznam vseh kanalov, ki prenašajo tekmo {homeName} – {awayName} v živo.",
    sr: "Где гледати {homeName} против {awayName}? У одељку ТВ канали можете пронаћи листу свих канала који преносе утакмицу {homeName} – {awayName} уживо.",
    sv: "Var kan man se {homeName} vs. {awayName}? Under TV-kanaler hittar du listan över alla kanaler som sänder {homeName} – {awayName} livematch.",
    tr: "{homeName} vs. {awayName} maçı nereden izlenir? TV Kanalları bölümünün altında {homeName} – {awayName} canlı maçını yayınlayan tüm kanalların listesini bulabilirsiniz.",
    zh: "在哪里观看 {homeName} 对阵 {awayName} 的比赛？在“电视频道”板块下，您可以找到广播 {homeName} – {awayName} 实时比赛的所有频道列表。",
    jp: "{homeName}対{awayName}はどこで視聴できますか？テレビチャンネルのセクションでは、{homeName}対{awayName}のライブ配信を放送するすべてのチャンネルのリストが表示されます。",
    kr: "{homeName} 대 {awayName} 경기는 어디서 볼 수 있나요? TV 채널 섹션에서 {homeName} – {awayName} 라이브 경기를 중계하는 모든 채널 목록을 확인하실 수 있습니다.",
    vn: "Xem {homeName} vs. {awayName} ở đâu? Trong phần Kênh TV, bạn có thể tìm thấy danh sách tất cả các kênh phát sóng trực tiếp trận đấu {homeName} – {awayName}.",
    he: "איפה לצפות ב-{homeName} נגד {awayName}? תחת מדור ערוצי הטלוויזיה תוكل למצוא את רשימת כל הערוצים המשדרים את המשחק החי בין {homeName} ל-{awayName}.",
    th: "รับชม {homeName} vs. {awayName} ได้ที่ไหน? ภายใต้เซกชันช่องทีวี คุณสามารถค้นหารายชื่อช่องทั้งหมดที่ถ่ายทอดสดการแข่งขันระหว่าง {homeName} – {awayName} ได้"
  },
  event_details: {
    en: "Event details",
    "en-us": "Event details",
    ar: "تفاصيل الحدث",
    az: "Hadisə təfərrüatları",
    bn: "ইভেন্টের বিবরণ",
    cs: "Podrobnosti o události",
    da: "Begivenhedsdetaljer",
    de: "Eventdetails",
    el: "Λεπτομέρειες εκδήλωσης",
    es: "Detalles del evento",
    "es-la": "Detalles del evento",
    fr: "Détails de l'événement",
    hi: "इवेंट का विवरण",
    hr: "Pojedinosti o događaju",
    hu: "Esemény részletei",
    id: "Detail acara",
    it: "Dettagli dell'evento",
    nl: "Details van het evenement",
    no: "Begivenhetsdetaljer",
    pl: "Szczegóły wydarzenia",
    pt: "Detalhes do evento",
    "pt-pt": "Detalhes do evento",
    ro: "Detalii eveniment",
    ru: "Детали матча",
    sk: "Podrobnosti o udalosti",
    sl: "Podrobnosti o dogodku",
    sr: "Детаљи о догађају",
    sv: "Händelsedetaljer",
    tr: "Etkinlik detayları",
    zh: "活动详情",
    jp: "イベント詳細",
    kr: "이벤트 상세 정보",
    vn: "Chi tiết sự kiện",
    he: "פרטי האירוע",
    th: "รายละเอียดงาน"
  },
  event_name: {
    en: "NAME",
    "en-us": "NAME",
    ar: "الاسم",
    az: "AD",
    bn: "নাম",
    cs: "NÁZEV",
    da: "NAVN",
    de: "NAME",
    el: "ΟΝΟΜΑ",
    es: "NOMBRE",
    "es-la": "NOMBRE",
    fr: "NOM",
    hi: "नाम",
    hr: "NAZIV",
    hu: "NÉV",
    id: "NAMA",
    it: "NOME",
    nl: "NAAM",
    no: "NAVN",
    pl: "NAZWA",
    pt: "NOME",
    "pt-pt": "NOME",
    ro: "NUME",
    ru: "НАЗВАНИЕ",
    sk: "NÁZOV",
    sl: "IME",
    sr: "НАЗИВ",
    sv: "NAMN",
    tr: "AD",
    zh: "名称",
    jp: "イベント名",
    kr: "이벤트 이름",
    vn: "Tên sự kiện",
    he: "שם האירוע",
    th: "ชื่อกิจกรรม"
  },
  event_date: {
    en: "DATE",
    "en-us": "DATE",
    ar: "التاريخ",
    az: "TARİX",
    bn: "তারিখ",
    cs: "DATUM",
    da: "DATO",
    de: "DATUM",
    el: "ΗΜΕΡΟΜΗΝΙΑ",
    es: "FECHA",
    "es-la": "FECHA",
    fr: "DATE",
    hi: "तिथि",
    hr: "DATUM",
    hu: "DÁTUM",
    id: "TANGGAL",
    it: "DATA",
    nl: "DATUM",
    no: "DATO",
    pl: "DATA",
    pt: "DATA",
    "pt-pt": "DATA",
    ro: "DATĂ",
    ru: "ДАТА",
    sk: "DÁTUM",
    sl: "DATUM",
    sr: "ДАТУМ",
    sv: "DATUM",
    tr: "TARİH",
    zh: "日期",
    jp: "日付",
    kr: "날짜",
    vn: "Ngày",
    he: "תאריך",
    th: "วันที่"
  },
  event_time: {
    en: "TIME",
    "en-us": "TIME",
    ar: "الوقت",
    az: "SAAT",
    bn: "সময়",
    cs: "ČAS",
    da: "TID",
    de: "UHRZEIT",
    el: "ΩΡΑ",
    es: "HORA",
    "es-la": "HORA",
    fr: "HEURE",
    hi: "समय",
    hr: "VRIJEME",
    hu: "IDŐPONT",
    id: "WAKTU",
    it: "ORA",
    nl: "TIJD",
    no: "TID",
    pl: "GODZINA",
    pt: "HORA",
    "pt-pt": "HORA",
    ro: "ORĂ",
    ru: "ВРЕМЯ",
    sk: "ČAS",
    sl: "ČAS",
    sr: "ВРЕМЕ",
    sv: "TID",
    tr: "SAAT",
    zh: "时间",
    jp: "時間",
    kr: "시간",
    vn: "Thời gian",
    he: "שעה",
    th: "เวลา"
  },
  event_venue: {
    en: "VENUE",
    "en-us": "VENUE",
    ar: "الملعب",
    az: "STADİON",
    bn: "ভেন্যু",
    cs: "MÍSTO KONÁNÍ",
    da: "STADION",
    de: "STADION",
    el: "ΓΗΠΕΔΟ",
    es: "SEDE",
    "es-la": "SEDE",
    fr: "LIEU",
    hi: "स्थान",
    hr: "STADION",
    hu: "HELYSZÍN",
    id: "STADION",
    it: "SEDE",
    nl: "STADION",
    no: "STADION",
    pl: "STADION",
    pt: "SEDE",
    "pt-pt": "SEDE",
    ro: "LOCAȚIE",
    ru: "МЕСТО ПРОВЕДЕНИЯ",
    sk: "MIESTO KONANIA",
    sl: "PRIZORIŠČE",
    sr: "СТАДИОН",
    sv: "ARENA",
    tr: "STADYUM",
    zh: "场地",
    jp: "会場",
    kr: "장소",
    vn: "Địa điểm",
    he: "מיקום",
    th: "สถานที่จัดงาน"
  },
  match_disclaimer: {
    en: "Enjoy every FIFA World Cup Match Live Online for FREE, TV Coverage, Replays, Highlights from Anywhere at Anytime. Optimized for PC, Mac, iPad, iPhone, Android, PS4, Xbox One, and Smart TVs.",
    "en-us": "Enjoy every FIFA World Cup Match Live Online for FREE, TV Coverage, Replays, Highlights from Anywhere at Anytime. Optimized for PC, Mac, iPad, iPhone, Android, PS4, Xbox One, and Smart TVs.",
    ar: "استمتع بكل مباراة من مباريات كأس العالم بث مباشر عبر الإنترنت مجاناً، تغطية تلفزيونية، إعادات، وملخصات من أي مكان وفي أي وقت. محسن للكمبيوتر الشخصي، الماك، الآيباد، الآيفون، الأندرويد، بلاي ستيشن 4، إكس بوكس ون، وأجهزة التلفزيون الذكية.",
    az: "Hər bir FIFA Dünya Kuboku oyununu istənilən yerdə, istənilən vaxt PULSUZ olaraq onlayn canlı, TV yayımı, təkrar və xülasələrini izləyin. PC, Mac, iPad, iPhone, Android, PS4, Xbox One və Smart TV-lər üçün optimallaşdırılmışdır.",
    bn: "যেকোনো জায়গা থেকে যেকোনো সময় বিনামূল্যে অনলাইনে প্রতিটি ফিফা বিশ্বকাপ ম্যাচের লাইভ, টিভি কভারেজ, রিপ্লে এবং হাইলাইটস উপভোগ করুন। পিসি, ম্যাক, আইপ্যাড, আইফোন, অ্যান্ড্রয়েড, পিএস৪, এক্সবক্স ওয়ান এবং স্মার্ট টিভির জন্য অপ্টিমাইজড।",
    cs: "Užijte si každý zápas Mistrovství světa FIFA živě online zdarma, televizní přenosy, záznamy, sestřihy odkudkoli a kdykoli. Optimalizováno pro PC, Mac, iPad, iPhone, Android, PS4, Xbox One a Smart TV.",
    da: "Nyd hver FIFA VM-kamp live online GRATIS, tv-dækning, genudsendelser, højdepunkter hvor som helst og når som helst. Optimeret til pc, Mac, iPad, iPhone, Android, PS4, Xbox One og Smart TV.",
    de: "Genießen Sie jedes Spiel der FIFA-Weltmeisterschaft kostenlos online im Live-Stream, TV-Übertragungen, Wiederholungen und Highlights von überall und zu jeder Zeit. Optimiert für PC, Mac, iPad, iPhone, Android, PS4, Xbox One und Smart-TVs.",
    el: "Απολαύστε κάθε αγώνα του Παγκοσμίου Κυπέλλου FIFA ζωντανά στο διαδίκτυο ΔΩΡΕΑΝ, τηλεοπτική κάλυψη, επαναλήψεις, στιγμιότυπα από οπουδήποτε και οποτεδήποτε. Βελτιστοποιημένο για PC, Mac, iPad, iPhone, Android, PS4, Xbox One και Smart TV.",
    es: "Disfruta de todos los partidos de la Copa Mundial de la FIFA en vivo online GRATIS, cobertura de TV, repeticiones y resúmenes desde cualquier lugar y en cualquier momento. Optimizado para PC, Mac, iPad, iPhone, Android, PS4, Xbox One y Smart TV.",
    "es-la": "Disfruta de todos los partidos de la Copa Mundial de la FIFA en vivo online GRATIS, cobertura de TV, repeticiones y resúmenes desde cualquier lugar y en cualquier momento. Optimizado para PC, Mac, iPad, iPhone, Android, PS4, Xbox One y Smart TV.",
    fr: "Profitez de chaque match de la Coupe du Monde de la FIFA en direct en ligne GRATUITEMENT, couverture TV, rediffusions, résumés partout et à tout moment. Optimisé pour PC, Mac, iPad, iPhone, Android, PS4, Xbox One et Smart TV.",
    hi: "फीफा विश्व कप के हर मैच का मुफ्त में लाइव ऑनलाइन आनंद लें, टीवी कवरेज, रिप्ले, हाइलाइट्स कहीं भी, कभी भी देखें। पीसी, मैक, आईपैड, आईफोन, एंड्रॉइड, पीएस4, एक्सबॉक्स वन और स्मार्ट टीवी के लिए अनुकूलित।",
    hr: "Uživajte u svakoj utakmici FIFA Svjetskog prvenstva uživo online BESPLATNO, TV prijenosu, reprizama, sažecima s bilo kojeg mjesta u bilo koje vrijeme. Optimizirano za PC, Mac, iPad, iPhone, Android, PS4, Xbox One i Smart TV.",
    hu: "Élvezze a FIFA-világbajnokság minden mérkőzését élőben online INGYEN, tévéközvetítéseket, ismétléseket, összefoglalókat bárhonnan, bármikor. PC-re, Mac-re, iPad-re, iPhone-ra, Androidra, PS4-re, Xbox One-ra és Smart TV-kre optimalizálva.",
    id: "Nikmati setiap pertandingan Piala Dunia FIFA langsung online secara GRATIS, liputan TV, siaran ulang, sorotan dari mana saja dan kapan saja. Dioptimalkan untuk PC, Mac, iPad, iPhone, Android, PS4, Xbox One, dan Smart TV.",
    it: "Goditi ogni partita della Coppa del Mondo FIFA in diretta online GRATIS, copertura TV, repliche, sintesi da qualsiasi luogo e in qualsiasi momento. Ottimizzato per PC, Mac, iPad, iPhone, Android, PS4, Xbox One e Smart TV.",
    nl: "Geniet GRATIS van elke FIFA Wereldbeker wedstrijd live online, tv-verslaggeving, herhalingen, hoogtepunten van overal en altijd. Geoptimaliseerd voor pc, Mac, iPad, iPhone, Android, PS4, Xbox One en Smart TV's.",
    no: "Nyt hver FIFA VM-kamp live online GRATIS, TV-dekning, repriser, høydepunkter fra hvor som helst når som helst. Optimalisert for PC, Mac, iPad, iPhone, Android, PS4, Xbox One og Smart-TV.",
    pl: "Ciesz się każdym meczem Mistrzostw Świata FIFA na żywo online za DARMO, transmisjami telewizyjnymi, powtórkami, skrótami z dowolnego miejsca w dowolnym czasie. Zoptymalizowano pod kątem komputerów PC, Mac, iPadów, iPhone'ów, systemów Android, konsol PS4, Xbox One i Smart TV.",
    pt: "Aproveite todas as partidas da Copa Mundo FIFA ao vivo online GRATUITAMENTE, cobertura de TV, replays e melhores momentos de qualquer lugar e a qualquer hora. Otimizado para PC, Mac, iPad, iPhone, Android, PS4, Xbox One e Smart TVs.",
    "pt-pt": "Aproveite todas as partidas da Copa Mundo FIFA ao vivo online GRATUITAMENTE, cobertura de TV, replays e melhores momentos de qualquer lugar e a qualquer hora. Otimizado para PC, Mac, iPad, iPhone, Android, PS4, Xbox One e Smart TVs.",
    ro: "Bucurați-vă de fiecare meci de la Cupa Mondială FIFA live online GRATUIT, acoperire TV, reluări, rezumate de oriunde, oricând. Optimizat pentru PC, Mac, iPad, iPhone, Android, PS4, Xbox One și Smart TV.",
    ru: "Наслаждайтесь каждым матчем Чемпионата мира по футболу в прямом эфире онлайн БЕСПЛАТНО: ТВ-трансляции, повторы, лучшие моменты из любого места и в любое время. Оптимизировано для ПК, Mac, iPad, iPhone, Android, PS4, Xbox One и Smart TV.",
    sk: "Užite si každý zápas Majstrovstiev sveta FIFA naživo online zadarmo, televízne prenosy, záznamy, zostrihy odkiaľkoľvek a kedykoľvek. Optimalizované pre PC, Mac, iPad, iPhone, Android, PS4, Xbox One a Smart TV.",
    sl: "Uživajte v vsaki tekmi svetovnega prvenstva v nogometu FIFA v živo na spletu BREZPLAČNO, s televizijskimi prenosi, ponovitvami, vrhunci od koder koli in kadar koli. Optimizirano za PC, Mac, iPad, iPhone, Android, PS4, Xbox One in pametne televizorje.",
    sr: "Уживајте у свакој утакмици ФИФА Светског првенства уживо онлајн БЕСПЛАТНО, ТВ преносу, репризама, сажецима са било ког места у било које време. Оптимизовано за ПЦ, Мац, иПад, иПхоне, Андроид, ПС4, Ксбок Оне и Смарт ТВ.",
    sv: "Njut av varje FIFA VM-match live online GRATIS, tv-bevakning, repriser, höjdpunkter från var som helst när som helst. Optimerad för PC, Mac, iPad, iPhone, Android, PS4, Xbox One och Smart-TV.",
    tr: "Her FIFA Dünya Kupası maçını canlı olarak çevrimiçi ÜCRETSİZ izleyin; TV yayınları, tekrarlar ve özetler her an her yerde yanınızda. PC, Mac, iPad, iPhone, Android, PS4, Xbox One ve Akıllı TV'ler için optimize edilmiştir.",
    zh: "随时随地免费在线观看每一场 2026 FIFA 世界杯直播、电视转播、重播和集锦。针对 PC、Mac、iPad、iPhone、Android、PS4、Xbox One 和智能电视进行了优化。",
    jp: "FIFAワールドカップの全試合を、いつでもどこでも無料のオンラインライブ配信、テレビ放送、録画、ハイライトでお楽しみいただけます。PC、Mac、iPad、iPhone、Android、PS4、Xbox One、スマートTV向けに最適化されています。",
    kr: "언제 어디서나 무료 온라인 라이브 스트리밍, TV 중계, 다시보기, 하이라이트로 FIFA 월드컵의 모든 경기를 즐기세요. PC, Mac, iPad, iPhone, Android, PS4, Xbox One, 스마트 TV에 최적화되어 있습니다.",
    vn: "Thưởng thức miễn phí mọi trận đấu FIFA World Cup phát trực tiếp trực tuyến, truyền hình, phát lại, highlights mọi lúc mọi nơi. Tối ưu hóa cho PC, Mac, iPad, iPhone, Android, PS4, Xbox One và Smart TV.",
    he: "תיהנו מכל משחק של גביע העולם של פיפ״א בשידור חי אונליין בחינם, שידורי טלוויזיה, תקצירים ושחזורים מכל מקום ובכל זמן. מותאם למחשבים, מק, אייפד, אייפון, אנדרואיד, פלייסטיישν, אקסבוקס וטלוויזיות חכמות.",
    th: "รับชมการถ่ายทอดสด การรายงานข่าวทางทีวี ย้อนหลัง และไฮไลท์ฟุตบอลโลกฟรีออนไลน์ได้ทุกที่ทุกเวลา รองรับการใช้งานทั้งบนพีซี, แมค, ไอแพด, ไอโฟน, แอนดรอยด์, PS4, Xbox One และสมาร์ททีวี"
  }
};

// Helper: Translate a key string based on active language
export function translate(key: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[key]
  if (!dict) return key
  const resolvedLang = lang === "ch" ? "de" : lang
  return dict[resolvedLang] || dict["en"]
}

export function getTimezoneLanguage(): LanguageCode | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timeZone) {
      const tzLower = timeZone.toLowerCase()
      if (tzLower.includes("dhaka") || tzLower.includes("kolkata") || tzLower.includes("calcutta")) return "bn"
      if (tzLower.includes("sao_paulo") || tzLower.includes("brazil") || tzLower.includes("rio") || tzLower.includes("manaus") || tzLower.includes("recife") || tzLower.includes("fortaleza")) return "pt"
      if (tzLower.includes("lisbon") || tzLower.includes("portugal") || tzLower.includes("madeira") || tzLower.includes("azores")) return "pt-pt"
      if (tzLower.includes("madrid") || tzLower.includes("spain") || tzLower.includes("canary") || tzLower.includes("balearic")) return "es"
      if (["buenos_aires", "santiago", "bogota", "lima", "mexico", "caracas", "quito", "guayaquil", "montevideo", "asuncion", "la_paz", "panama", "costa_rica", "san_jose", "honduras", "tegucigalpa", "el_salvador", "guatemala", "nicaragua", "managua"].some(city => tzLower.includes(city))) return "es-la"
      if (tzLower.includes("paris") || tzLower.includes("france") || tzLower.includes("monaco")) return "fr"
      if (tzLower.includes("rome") || tzLower.includes("italy") || tzLower.includes("san_marino") || tzLower.includes("vatican")) return "it"
      if (tzLower.includes("amsterdam") || tzLower.includes("netherlands") || tzLower.includes("brussels") || tzLower.includes("belgium") || tzLower.includes("suriname")) return "nl"
      if (tzLower.includes("berlin") || tzLower.includes("germany") || tzLower.includes("vienna") || tzLower.includes("austria") || tzLower.includes("liechtenstein")) return "de"
      if (tzLower.includes("tehran")) return "ar" // Iran (using RTL layout)
      if (["riyadh", "cairo", "baghdad", "dubai", "kuwait", "qatar", "doha", "muscat", "bahrain", "amman", "beirut", "damascus", "khartoum", "tripoli", "tunis", "algiers", "casablanca"].some(city => tzLower.includes(city))) return "ar"
      if (tzLower.includes("baku")) return "az"
      if (tzLower.includes("istanbul")) return "tr"
      if (tzLower.includes("shanghai") || tzLower.includes("urumqi") || tzLower.includes("hong_kong") || tzLower.includes("taipei") || tzLower.includes("beijing") || tzLower.includes("china")) return "zh"
      if (tzLower.includes("tokyo") || tzLower.includes("japan")) return "jp"
      if (tzLower.includes("seoul") || tzLower.includes("korea")) return "kr"
      if (tzLower.includes("saigon") || tzLower.includes("hanoi") || tzLower.includes("vietnam")) return "vn"
      if (tzLower.includes("jerusalem") || tzLower.includes("tel_aviv") || tzLower.includes("israel")) return "he"
      if (tzLower.includes("bangkok") || tzLower.includes("thai")) return "th"
      if (tzLower.includes("zurich") || tzLower.includes("geneva") || tzLower.includes("switzerland")) return "ch"
    }
  } catch (e) {}
  return null
}

// Auto-detect browser/user locale and map to our 30 supported languages
export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined" || !navigator) {
    return "en"
  }

  // 1. Check LocalStorage first for manual user selection persistence (only if manual flag is true)
  try {
    const isManual = window.localStorage.getItem("worldcup2026_lang_manual") === "true"
    if (isManual) {
      const savedLang = window.localStorage.getItem("worldcup2026_lang") as LanguageCode | null
      if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
        return savedLang
      }
    }
  } catch (e) {}

  // 2. Check timezone for specific regions
  const tzLang = getTimezoneLanguage()
  if (tzLang) return tzLang

  return "en"
}

// Map ISO 3166-1 alpha-2 country codes to our 30 supported languages
export const COUNTRY_TO_LANG: Record<string, LanguageCode> = {
  // English US / Canada
  US: "en-us", CA: "en-us",
  // English UK / Global
  GB: "en", IE: "en", ZA: "en", AU: "en", NZ: "en",
  // Arabic
  AE: "ar", SA: "ar", QA: "ar", OM: "ar", KW: "ar", BH: "ar", EG: "ar", JO: "ar", LB: "ar", SY: "ar", IQ: "ar", YE: "ar", LY: "ar", MA: "ar", DZ: "ar", TN: "ar", SD: "ar", PS: "ar",
  // Azerbaijani
  AZ: "az",
  // Bengali
  BD: "bn",
  // Czech
  CZ: "cs",
  // Danish
  DK: "da",
  // German
  DE: "de", AT: "de", LI: "de",
  // Greek
  GR: "el", CY: "el",
  // Spanish Spain
  ES: "es",
  // Spanish Latin America
  MX: "es-la", AR: "es-la", CL: "es-la", CO: "es-la", PE: "es-la", VE: "es-la", EC: "es-la", GT: "es-la", HN: "es-la", NI: "es-la", CR: "es-la", PA: "es-la", UY: "es-la", PY: "es-la", BO: "es-la", SV: "es-la", DO: "es-la", PR: "es-la", CU: "es-la",
  // French
  FR: "fr", MC: "fr",
  // Hindi
  IN: "hi",
  // Croatian
  HR: "hr",
  // Hungarian
  HU: "hu",
  // Indonesian
  ID: "id",
  // Italian
  IT: "it", SM: "it", VA: "it",
  // Dutch
  NL: "nl", BE: "nl", SR: "nl",
  // Norwegian
  NO: "no",
  // Polish
  PL: "pl",
  // Portuguese Brazil
  BR: "pt",
  // Portuguese Portugal / Lusophone
  PT: "pt-pt", AO: "pt-pt", MZ: "pt-pt", CV: "pt-pt", GW: "pt-pt", ST: "pt-pt", TL: "pt-pt",
  // Romanian
  RO: "ro", MD: "ro",
  // Russian
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru", TJ: "ru", UZ: "ru",
  // Slovak
  SK: "sk",
  // Slovenian
  SI: "sl",
  // Serbian
  RS: "sr", ME: "sr", BA: "sr",
  // Swedish
  SE: "sv",
  // Turkish
  TR: "tr",
  // Chinese
  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  JP: "jp", KR: "kr", VN: "vn", IL: "he", TH: "th", CH: "ch"
}

export function mapCountryToLanguage(countryCode: string): LanguageCode {
  return COUNTRY_TO_LANG[countryCode.toUpperCase()] || "en"
}

export const PREFIX_TO_LANG: Record<string, LanguageCode> = {
  en: "en",
  us: "en-us",
  ar: "ar",
  az: "az",
  bn: "bn",
  cs: "cs",
  da: "da",
  de: "de",
  el: "el",
  es: "es",
  "es-la": "es-la",
  la: "es-la",
  fr: "fr",
  hi: "hi",
  in: "hi",
  hr: "hr",
  hu: "hu",
  id: "id",
  it: "it",
  nl: "nl",
  no: "no",
  pl: "pl",
  pt: "pt",
  br: "pt",
  "pt-pt": "pt-pt",
  ro: "ro",
  ru: "ru",
  sk: "sk",
  sl: "sl",
  sr: "sr",
  sv: "sv",
  tr: "tr",
  zh: "zh",
  cn: "zh",
  jp: "jp",
  kr: "kr",
  vn: "vn",
  he: "he",
  il: "he",
  th: "th",
  ch: "ch"
}

export const LANG_TO_PREFIX: Record<LanguageCode, string> = {
  en: "en",
  "en-us": "us",
  ar: "ar",
  az: "az",
  bn: "bn",
  cs: "cs",
  da: "da",
  de: "de",
  el: "el",
  es: "es",
  "es-la": "la",
  fr: "fr",
  hi: "in",
  hr: "hr",
  hu: "hu",
  id: "id",
  it: "it",
  nl: "nl",
  no: "no",
  pl: "pl",
  pt: "pt",
  "pt-pt": "pt-pt",
  ro: "ro",
  ru: "ru",
  sk: "sk",
  sl: "sl",
  sr: "sr",
  sv: "sv",
  tr: "tr",
  zh: "zh",
  jp: "jp",
  kr: "kr",
  vn: "vn",
  he: "he",
  th: "th",
  ch: "ch"
}

export const VALID_PREFIXES = Object.keys(PREFIX_TO_LANG)

export function getPrefixFromLanguage(lang: LanguageCode): string {
  return LANG_TO_PREFIX[lang] || "en"
}

export function getLanguageFromPrefix(prefix: string): LanguageCode {
  return PREFIX_TO_LANG[prefix.toLowerCase()] || "en"
}

// Parse match date local kickoff string and convert to UTC Date based on Stadium Location offsets
export function parseStadiumLocalDate(localDateStr: string, stadiumId: string): Date {
  try {
    const [datePart, timePart] = localDateStr.split(" ")
    const [month, day, year] = datePart.split("/").map(Number)
    const [hours, minutes] = timePart.split(":").map(Number)

    // Determine UTC offset for the stadium in June/July 2026 (DST offsets)
    let offset = -5 // Default to Central Time (UTC-5)
    
    if (["7", "8", "9", "10", "11", "12"].includes(stadiumId)) {
      offset = -4 // Eastern Time USA/Canada (EDT, UTC-4)
    } else if (["4", "5", "6"].includes(stadiumId)) {
      offset = -5 // Central Time USA (CDT, UTC-5)
    } else if (["1", "2", "3"].includes(stadiumId)) {
      offset = -6 // CST Mexico (UTC-6)
    } else if (["13", "14", "15", "16"].includes(stadiumId)) {
      offset = -7 // Pacific Time USA/Canada (PDT, UTC-7)
    }

    // Return UTC date object
    return new Date(Date.UTC(year, month - 1, day, hours - offset, minutes))
  } catch (e) {
    return new Date(localDateStr)
  }
}

// Helper to automatically fix wrong "finished" status from external API
// if the current time is before the kickoff time of the game
export function adjustGameStatus(game: any): any {
  if (!game || !game.local_date) return game
  try {
    const kickoff = parseStadiumLocalDate(game.local_date, game.stadium_id)
    const now = new Date()
    if (now.getTime() < kickoff.getTime()) {
      return {
        ...game,
        finished: "FALSE",
        time_elapsed: "notstarted",
        home_score: "0",
        away_score: "0",
      }
    }
  } catch (e) {
    console.error("Error adjusting game status:", e)
  }
  return game
}

// Helper to map and sanitize timezone names, hiding numeric offsets like +6 or GMT+6
export function getTimezoneAbbr(timeZone: string, date: Date): string {
  if (!timeZone) return ""
  
  const knownAbbrs: Record<string, string> = {
    "Asia/Dhaka": "BST",
    "Asia/Kolkata": "IST",
    "Asia/Tokyo": "JST",
    "Europe/Moscow": "MSK",
    "Europe/Volgograd": "MSK",
    "Europe/Kirov": "MSK",
    "Europe/Astrakhan": "MSK",
    "Europe/Saratov": "MSK",
    "Europe/Ulyanovsk": "MSK",
    "Asia/Baku": "AZT",
    "Asia/Tbilisi": "GET",
    "Asia/Yerevan": "AMT",
    "Europe/Samara": "SAMT",
    "Asia/Dubai": "GST",
    "Asia/Karachi": "PKT",
    "Asia/Almaty": "ALMT",
    "Asia/Urumqi": "AST",
    "Asia/Bangkok": "ICT",
    "Asia/Jakarta": "WIB",
    "Asia/Shanghai": "CST",
    "Asia/Hong_Kong": "HKT",
    "Asia/Taipei": "CST",
    "Asia/Seoul": "KST",
    "Asia/Singapore": "SGT",
    "Australia/Perth": "AWST",
    "Australia/Adelaide": "ACST",
    "Australia/Darwin": "ACST",
    "Australia/Sydney": "AEST",
    "Australia/Melbourne": "AEST",
    "Australia/Brisbane": "AEST",
    "Pacific/Auckland": "NZST",
    "Europe/London": "BST",
    "Europe/Dublin": "IST",
    "Europe/Paris": "CEST",
    "Europe/Berlin": "CEST",
    "Europe/Rome": "CEST",
    "Europe/Madrid": "CEST",
    "Europe/Amsterdam": "CEST",
    "Europe/Brussels": "CEST",
    "Europe/Vienna": "CEST",
    "Europe/Warsaw": "CEST",
    "Europe/Prague": "CEST",
    "Europe/Budapest": "CEST",
    "Europe/Belgrade": "CEST",
    "Europe/Zurich": "CEST",
    "Europe/Stockholm": "CEST",
    "Europe/Oslo": "CEST",
    "Europe/Copenhagen": "CEST",
    "Europe/Helsinki": "EEST",
    "Europe/Athens": "EEST",
    "Europe/Bucharest": "EEST",
    "Europe/Kiev": "EEST",
    "Europe/Kyiv": "EEST",
    "Europe/Sofia": "EEST",
    "Europe/Istanbul": "TRT",
    "Asia/Riyadh": "AST",
    "Asia/Baghdad": "AST",
    "Asia/Kuwait": "AST",
    "Asia/Qatar": "AST",
    "Africa/Nairobi": "EAT",
    "Africa/Cairo": "EET",
    "Africa/Johannesburg": "SAST",
    "America/New_York": "EDT",
    "America/Chicago": "CDT",
    "America/Denver": "MDT",
    "America/Phoenix": "MST",
    "America/Los_Angeles": "PDT",
    "America/Anchorage": "AKDT",
    "America/Honolulu": "HST",
    "America/Sao_Paulo": "BRT",
    "America/Argentina/Buenos_Aires": "ART",
    "America/Bogota": "COT",
    "America/Lima": "PET",
    "America/Mexico_City": "CST",
    "UTC": "UTC",
    "GMT": "GMT"
  }

  if (knownAbbrs[timeZone]) {
    return knownAbbrs[timeZone]
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short"
    })
    const parts = formatter.formatToParts(date)
    const tzPart = parts.find(p => p.type === "timeZoneName")
    if (tzPart) {
      const val = tzPart.value.trim()
      // Ignore if it contains numeric digits, + or -
      const hasDigitOrSign = /[\d+\-–—]/.test(val) || /[০১২৩৪৫৬৭৮৯]/.test(val)
      if (!hasDigitOrSign && val.length >= 2 && val.length <= 5) {
        return val.toUpperCase()
      }
    }
  } catch (e) {}

  return ""
}

// Format Date object in the user local timezone and locale string
export function formatLocalTime(date: Date, lang: LanguageCode, timeZone?: string | null): string {
  try {
    // Standardize browser locale format strings
    let locale = "en-GB"
    if (lang === "en-us") locale = "en-US"
    else if (lang === "pt") locale = "pt-BR"
    else if (lang === "es-la") locale = "es-419"
    else if (lang === "jp") locale = "ja"
    else if (lang === "kr") locale = "ko"
    else if (lang === "vn") locale = "vi"
    else if (lang === "ch") locale = "de-CH"
    else locale = lang

    const dateStr = date.toLocaleString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: timeZone || undefined
    })

    const tzAbbr = timeZone ? getTimezoneAbbr(timeZone, date) : ""
    return tzAbbr ? `${dateStr} ${tzAbbr}` : dateStr
  } catch (e) {
    return date.toString()
  }
}

// Format countdown text based on locale
export function formatCountdownTime(timeLeft: { days: number; hours: number; minutes: number; seconds: number } | null, lang: LanguageCode): string {
  if (!timeLeft) {
    return lang === "ar" ? "مباشر / بدأت" : "LIVE / STARTED"
  }
  
  const dUnit = lang === "ar" ? "يوم" : "d"
  const hUnit = lang === "ar" ? "ساعة" : "h"
  const mUnit = lang === "ar" ? "دقيقة" : "m"
  const sUnit = lang === "ar" ? "ثانية" : "s"
  
  return `${timeLeft.days}${dUnit} : ${timeLeft.hours}${hUnit} : ${timeLeft.minutes}${mUnit} : ${timeLeft.seconds}${sUnit}`
}

export function formatLocalDateOnly(date: Date, lang: LanguageCode, timeZone?: string | null): string {
  try {
    let locale = "en-GB"
    if (lang === "en-us") locale = "en-US"
    else if (lang === "pt") locale = "pt-BR"
    else if (lang === "es-la") locale = "es-419"
    else if (lang === "jp") locale = "ja"
    else if (lang === "kr") locale = "ko"
    else if (lang === "vn") locale = "vi"
    else if (lang === "ch") locale = "de-CH"
    else locale = lang

    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: timeZone || undefined
    })
  } catch {
    return date.toDateString()
  }
}

export function getLocalizedTeamName(team: any, fallback: string, activeLang: LanguageCode): string {
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
}

export function getLocalizedStadiumName(stadium: any, activeLang: LanguageCode): string {
  if (!stadium) return ""
  const resolvedLang = activeLang === "ch" ? "de" : activeLang
  if (stadium.translations) {
    try {
      const parsed = typeof stadium.translations === "string" ? JSON.parse(stadium.translations) : stadium.translations
      if (parsed && parsed[resolvedLang]) return parsed[resolvedLang]
    } catch { }
  }
  if (resolvedLang === "ar" && stadium.name_fa && stadium.city_fa) {
    return `${stadium.name_fa}, ${stadium.city_fa}`
  }
  return `${stadium.name_en}, ${stadium.city_en}`
}