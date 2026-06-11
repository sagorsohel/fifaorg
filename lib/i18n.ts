// i18n Translation Dictionary and Locale Helper
// Supports 30 languages with auto-detection and local timezone formatting.

export type LanguageCode =
  | "en" | "en-us" | "ar" | "az" | "bn" | "cs" | "da" | "de" | "el" | "es"
  | "es-la" | "fr" | "hi" | "hr" | "hu" | "id" | "it" | "nl" | "no" | "pl"
  | "pt" | "pt-pt" | "ro" | "ru" | "sk" | "sl" | "sr" | "sv" | "tr" | "zh"

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
  { code: "zh", name: "中文", dir: "ltr" }
]

export const TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
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
    sv: "FIFA Fotbolls-VM 2026", tr: "2026 FIFA Dünya Kupası", zh: "2026年FIFA世界杯"
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
    sv: "Lag- & Match-tracker", tr: "Takımlar ve Maçlar Takipçisi", zh: "球队与赛程追踪器"
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
    sv: "Matchcenter", tr: "Maç Merkezi", zh: "赛事中心"
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
    sv: "Matcher", tr: "Maçlar", zh: "比赛"
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
    sv: "Lag & Grupper", tr: "Takımlar ve Gruplar", zh: "球队与分组"
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
    sv: "Sök efter lag, spelomgångar, grupper...", tr: "Takımları, maç günlerini, grupları ara...", zh: "搜索球队、比赛日、分组..."
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
    sv: "Filtrera matcher:", tr: "Maçları filtrele:", zh: "赛程 筛选："
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
    sv: "Alla matcher", tr: "Tüm Maçlar", zh: "全部比赛"
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
    sv: "Slutspelade", tr: "Bitenler", zh: "已结束"
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
    sv: "Kommande", tr: "Gelecekler", zh: "即将进行"
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
    sv: "Rensa filter", tr: "Filtreleri Temizle", zh: "清除筛选"
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
    sv: "Välj grupp eller slutspelsfas:", tr: "Grup veya Eleme Aşaması Seçin:", zh: "选择分组 or 淘汰赛阶段："
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
    sv: "Återställ till alla grupper", tr: "Tüm Gruplara Sıfırla", zh: "重置为全部分组"
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
    sv: "Matcher totalt", tr: "Toplam Maçlar", zh: "总比赛场次"
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
    sv: "Spelade", tr: "Oynananlar", zh: "已赛"
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
    sv: "Lag", tr: "Takımlar", zh: "球队"
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
    sv: "Spelade matcher", tr: "Oynanan Maçlar", zh: "已赛场次"
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
    sv: "Kommande matcher", tr: "Gelecek Maçlar", zh: "即将进行比赛"
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
    sv: "Tillbaka till översikten", tr: "Panoya Geri Dön", zh: "返回控制台"
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
    sv: "Tillbaka till tidslinjen", tr: "Zaman Çizelgesine Dön", zh: "返回赛程表"
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
    sv: "Stadion", tr: "Stadyum", zh: "体育场"
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
    sv: "Målskyttar", tr: "Golcüler", zh: "进球球员"
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
    sv: "Stadionstatistik", tr: "Stadyum İstatistikleri", zh: "体育场信息"
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
    sv: "Kapacitet", tr: "Kapasite", zh: "容纳人数"
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
    sv: "Plats", tr: "Konum", zh: "地点"
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
    sv: "platser", tr: "koltuk", zh: "席位"
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
    sv: "Matchschema", tr: "Maç Takvimi", zh: "比赛日程"
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
    sv: "Lokal avsparkstid", tr: "Yerel Başlama Saati", zh: "当地开球时间"
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
    sv: "Matchstatistik", tr: "Maç İstatistikleri", zh: "比赛数据"
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
    sv: "Bollinnehav", tr: "Topa Sahip Olma", zh: "控球率"
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
    sv: "Skott", tr: "Şutlar", zh: "射门"
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
    sv: "Regelbrott", tr: "Fauller", zh: "犯规"
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
    sv: "Registrera dig för att se varje match live", tr: "Her Maçı Canlı İzlemek İçin Üye Olun", zh: "请注册以观看每场比赛直播"
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
    sv: "FOTBOLLS-LIVE-STREAM", tr: "FUTBOL CANLI YAYIN", zh: "足球比赛直播"
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
    sv: "REGISTRERA DIG & SE NU!", tr: "KAYDOL VE ŞİMDİ İZLE!", zh: "立即注册观看！"
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
    sv: "Se Live", tr: "Canlı İzle", zh: "观看直播"
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
    sv: "Annonsblockerare upptäckt", tr: "Reklam Engelleyici Algılandı", zh: "检测到广告拦截器"
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
    sv: "Lås upp alla snabba HD-strömmar nedan", tr: "Aşağıdaki tüm yüksek hızlı HD yayınları açın", zh: "解锁下方所有高速高清直播"
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
    sv: "LÅS UPP HD", tr: "HD YAYINI AÇ", zh: "解锁高清"
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
    sv: "Streaming av hög kvalitet", tr: "Yüksek Kaliteli Yayın", zh: "高质量视频流"
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
    sv: "Se utan begränsningar", tr: "Sınırsız İzleme", zh: "无限制观看"
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
    sv: "Inga annonser, 100 % gratis tillgång", tr: "Reklamsız, %100 Ücretsiz Erişim", zh: "无广告，100%免费访问"
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
    sv: "Se på valfri enhet", tr: "İstediğiniz cihazdan izleyin", zh: "在任何设备上观看"
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
    sv: "Har du redan ett konto?", tr: "Zaten üye misiniz?", zh: "已有账号？"
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
    sv: "Logga in", tr: "Giriş Yap", zh: "登录"
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
    sv: "Läs in detaljer...", tr: "Detaylar yükleniyor...", zh: "加载中..."
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
    sv: "Matchen kunde inte hittas", tr: "Maç bulunamadı", zh: "未找到比赛"
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
    sv: "Gå tillbaka till översikten", tr: "Panoya Dön", zh: "返回控制台"
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
    sv: "Välj språk", tr: "Dil Seçin", zh: "选择语言"
  },
  round_32: {
    en: "Round of 32", "en-us": "Round of 32", ar: "دور الـ 32", az: "Son 32 turu", bn: "রাউন্ড অব ৩২", cs: "Šestnáctifinále", da: "16-delsfinaler", de: "Sechzehntelfinale", el: "Φάση των 32", es: "Dieciseisavos de final", "es-la": "Dieciseisavos de final", fr: "Seizièmes de finale", hi: "32 का दौर", hr: "Šesnaestina finala", hu: "Legjobb 32", id: "Babak 32 Besar", it: "Sedicesimi di finale", nl: "Zestiende finales", no: "16-delsfinaler", pl: "1/16 finału", pt: "Dezesseis-avos de final", "pt-pt": "Dezasseis-avos de final", ro: "Șaisprezecimi de finală", ru: "1/16 финала", sk: "Šestnásťfinále", sl: "Šestnajstina finala", sr: "Шеснаестина финала", sv: "Sextondelsfinal", tr: "Son 32 Turu", zh: "1/16决赛"
  },
  round_16: {
    en: "Round of 16", "en-us": "Round of 16", ar: "دور الـ 16", az: "Son 16 turu", bn: "রাউন্ড অব ১৬", cs: "Osmifinále", da: "Ottendedelsfinaler", de: "Achtelfinale", el: "Φάση των 16", es: "Octavos de final", "es-la": "Octavos de final", fr: "Huitièmes de finale", hi: "16 का दौर", hr: "Osmina finala", hu: "Nyolcaddöntő", id: "Babak 16 Besar", it: "Ottavi di finale", nl: "Achtste finales", no: "Åttendedelsfinaler", pl: "1/8 finału", pt: "Oitavas de final", "pt-pt": "Oitavas de final", ro: "Optimi de finală", ru: "1/8 финала", sk: "Osemfinále", sl: "Osmina finala", sr: "Осмина финала", sv: "Åttondelsfinal", tr: "Son 16 Turu", zh: "1/8决赛"
  },
  quarter_finals: {
    en: "Quarter Finals", "en-us": "Quarter Finals", ar: "ربع النهائي", az: "Dörddəbir final", bn: "কোয়ার্টার ফাইনাল", cs: "Čtvrtfinále", da: "Kvartfinaler", de: "Viertelfinale", el: "Προημιτελικοί", es: "Cuartos de final", "es-la": "Cuartos de final", fr: "Quarts de finale", hi: "क्वार्टर फाइनल", hr: "Četvrtfinale", hu: "Negyeddöntő", id: "Perempat Final", it: "Quarti di finale", nl: "Kwartfinales", no: "Kvartfinaler", pl: "Ćwierćfinały", pt: "Quartas de final", "pt-pt": "Quartos de final", ro: "Sferturi de finală", ru: "Четвертьфиналы", sk: "Štvrťfinále", sl: "Četrtfinale", sr: "Четвртфинале", sv: "Kvartsfinal", tr: "Çeyrek Finaller", zh: "1/4决赛"
  },
  semi_finals: {
    en: "Semi Finals", "en-us": "Semi Finals", ar: "نصف النهائي", az: "Yarımfinal", bn: "সেমিফাইনাল", cs: "Semifinále", da: "Semifinaler", de: "Halbfinale", el: "Ημιτελικοί", es: "Semifinales", "es-la": "Semifinales", fr: "Demi-finales", hi: "সেमीफाइनल", hr: "Polufinale", hu: "Elődöntő", id: "Semifinal", it: "Semifinali", nl: "Halve finales", no: "Semifinaler", pl: "Półfinały", pt: "Semifinais", "pt-pt": "Meias-finais", ro: "Semifinale", ru: "Полуфиналы", sk: "Semifinále", sl: "Polfinale", sr: "Полуфинале", sv: "Semifinal", tr: "Yarı Finaller", zh: "半决赛"
  },
  third_place: {
    en: "3rd Place", "en-us": "3rd Place", ar: "المركز الثالث", az: "Üçüncü yer", bn: "তৃতীয় স্থান", cs: "O 3. místo", da: "Bronzekamp", de: "Spiel um Platz 3", el: "Μικρός Τελικός", es: "Tercer puesto", "es-la": "Tercer puesto", fr: "Match 3e place", hi: "तीसरा स्थान", hr: "Za 3. mjesto", hu: "Bronzmérkőzés", id: "Perebutan Tempat Ketiga", it: "Finale 3° posto", nl: "Troostfinale", no: "Bronsefinale", pl: "Mecz o 3. miejsce", pt: "Disputa do 3º lugar", "pt-pt": "Jogo do 3º lugar", ro: "Finala mică", ru: "Матч за 3-е место", sk: "O 3. miesto", sl: "Za 3. mesto", sr: "За 3. место", sv: "Bronsmatch", tr: "Üçüncülük Maçı", zh: "三四名决赛"
  },
  final: {
    en: "Final", "en-us": "Final", ar: "النهائي", az: "Final", bn: "ফাইনাল", cs: "Finále", da: "Finale", de: "Finale", el: "Τελικός", es: "Final", "es-la": "Final", fr: "Finale", hi: "फाइनल", hr: "Finale", hu: "Döntő", id: "Final", it: "Finale", nl: "Finale", no: "Finale", pl: "Finał", pt: "Final", "pt-pt": "Final", ro: "Finală", ru: "Финал", sk: "Finále", sl: "Finale", sr: "Финале", sv: "Final", tr: "Final", zh: "决赛"
  },
  group: {
    en: "Group", "en-us": "Group", ar: "المجموعة", az: "Qrup", bn: "গ্রুপ", cs: "Skupina", da: "Gruppe", de: "Gruppe", el: "Όμιλος", es: "Grupo", "es-la": "Grupo", fr: "Groupe", hi: "समूह", hr: "Skupina", hu: "Csoport", id: "Grup", it: "Gruppo", nl: "Groep", no: "Gruppe", pl: "Grupa", pt: "Grupo", "pt-pt": "Grupo", ro: "Grupa", ru: "Группа", sk: "Skupina", sl: "Skupina", sr: "Група", sv: "Grupp", tr: "Grup", zh: "分组"
  },
  matchday: {
    en: "Matchday", "en-us": "Matchday", ar: "يوم المباراة", az: "Oyun günü", bn: "ম্যাচডে", cs: "Hrací den", da: "Spilledag", de: "Spieltag", el: "Αγωνιστική", es: "Jornada", "es-la": "Jornada", fr: "Journée", hi: "मैच का दिन", hr: "Kolo", hu: "Forduló", id: "Hari Pertandingan", it: "Giornata", nl: "Speeldag", no: "Spilledag", pl: "Kolejka", pt: "Rodada", "pt-pt": "Jornada", ro: "Etapă", ru: "Игровой день", sk: "Hrací deň", sl: "Igralni dan", sr: "Коло", sv: "Spelomgång", tr: "Maç Günü", zh: "比赛日"
  },
  no_upcoming_matches: {
    en: "No upcoming matches scheduled.", "en-us": "No upcoming matches scheduled.", ar: "لا توجد مباريات قادمة مجدولة.", az: "Planlaşdırılmış növbəti oyun yoxdur.", bn: "কোন আসন্ন ম্যাচ নির্ধারিত নেই।", cs: "Nejsou naplánovány žádné nadcházející zápasy.", da: "Ingen kommende kampe planlagt.", de: "Keine kommenden Spiele geplant.", el: "Δεν υπάρχουν προγραμματισμένοι προσεχείς αγώνες.", es: "No hay partidos próximos programados.", "es-la": "No hay partidos próximos programados.", fr: "Aucun match à venir programmé.", hi: "कोई आगामी मैच निर्धारित नहीं है।", hr: "Nema zakazanih predstojećih utakmica.", hu: "Nincsenek közelgő mérkőzések.", id: "Tidak ada pertandingan mendatang yang dijadwalkan.", it: "Nessuna partita in programma.", nl: "Geen aankomende wedstrijden gepland.", no: "Ingen kommende kamper planlagt.", pl: "Brak zaplanowanych nadchodzących meczów.", pt: "Nenhum jogo próximo programado.", "pt-pt": "Nenhum jogo próximo programado.", ro: "Nu există meciuri programate.", ru: "Нет запланированных предстоящих матчей.", sk: "Nie sú naplánované žiadne nadchádzajúce zápasy.", sl: "Ni načrtovanih prihodnjih tekem.", sr: "Нема заказаних предстојећих утакмица.", sv: "Inga kommande matcher schemalagda.", tr: "Planlanmış gelecek maç yok.", zh: "没有计划中的即将进行的比赛。"
  },
  no_played_matches: {
    en: "No played matches recorded.", "en-us": "No played matches recorded.", ar: "لم تسجل مباريات ملعوبة.", az: "Qeydə alınmış oyun yoxdur.", bn: "কোন খেলার রেকর্ড নেই।", cs: "Nebyly zaznamenány žádné odehrané zápasy.", da: "Ingen spillede kampe registreret.", de: "Keine gespielten Spiele aufgezeichnet.", el: "Δεν έχουν καταγραφεί διεξαχθέντες αγώνες.", es: "No se registran partidos jugados.", "es-la": "No se registran partidos jugados.", fr: "Aucun match joué enregistré.", hi: "कोई खेले गए मैच रिकॉर्ड नहीं किए गए।", hr: "Nema zabilježenih odigranih utakmica.", hu: "Nincsenek lejátszott mérkőzések.", id: "Tidak ada catatan pertandingan yang dimainkan.", it: "Nessuna partita giocata registrata.", nl: "Geen gespeelde wedstrijden geregistreerd.", no: "Ingen spilte kamper registrert.", pl: "Brak rozegranych meczów.", pt: "Nenhum jogo realizado registrado.", "pt-pt": "Nenhum jogo realizado registado.", ro: "Nu există meciuri jucate înregistrate.", ru: "Нет записей о сыгранных матчах.", sk: "Neboli zaznamenané žiadne odohrané zápasy.", sl: "Ni zabeleženih odigranih tekem.", sr: "Нема забележених одиграних утакмица.", sv: "Inga spelade matcher registrerade.", tr: "Kaydedilmiş oynanmış maç yok.", zh: "没有已赛场次记录।"
  },
  no_matches: {
    en: "No matches found matching your filters.", "en-us": "No matches found matching your filters.", ar: "لم يتم العثور على مباريات تطابق التصفية.", az: "Filtrinizə uyğun oyun tapılmadı.", bn: "কোন ম্যাচ পাওয়া যায়নি।", cs: "Nebyly nalezeny žádné zápasy odpovídající vašim filtrům.", da: "Ingen kampe fundet, der matcher dine filtre.", de: "Keine Spiele gefunden, die Ihren Filtern entsprechen.", el: "Δεν βρέθηκαν αγώνες που να ταιριάζουν με τα φίλτρα σας.", es: "No se encontraron partidos que coincidan con sus filtros.", "es-la": "No se encontraron partidos que coincidan con sus filtros.", fr: "Aucun match trouvé correspondant à vos filtres.", hi: "आपके फ़िल्टर से मेल खाने वाले कोई मैच नहीं मिले।", hr: "Nije pronađena nijedna utakmica koja odgovara vašim filtrima.", hu: "Nem található a szűrésnek megfelelő mérkőzés.", id: "Tidak ada pertandingan yang cocok dengan filter Anda.", it: "Nessuna partita corrisponde ai filtri selezionati.", nl: "Geen wedstrijden gevonden die aan de filters voldoen.", no: "Ingen kamper funnet som passer til filtrene.", pl: "Nie znaleziono meczów pasujących do filtrów.", pt: "Nenhum jogo encontrado correspondente aos seus filtros.", "pt-pt": "Nenhum jogo encontrado correspondente aos seus filtros.", ro: "Nu s-au găsit meciuri care să corespundă filtrelor tale.", ru: "Матчей с такими фильтрами не найдено.", sk: "Neboli nájdené žiadne zápasy zodvedajúce vašim filtrom.", sl: "Ni tekem, ki bi ustrezale vašim filtrom.", sr: "Није пронађена ниједна утакмица која одговара вашим филтрима.", sv: "Inga matcher hittades som matchar dina filter.", tr: "Filtrelerinize uygun maç bulunamadı.", zh: "未找到符合筛选条件的比赛。"
  },
  no_teams: {
    en: "No teams found.", "en-us": "No teams found.", ar: "لم يتم العثور على فرق.", az: "Komanda tapılmadı.", bn: "কোন দল পাওয়া যায়নি।", cs: "Nebyly nalezeny žádné týmy.", da: "Ingen hold fundet.", de: "Keine teams gefunden.", el: "Δεν βρέθηκαν ομάδες.", es: "No se encontraron equipos.", "es-la": "No se encontraron equipos.", fr: "Aucune équipe trouvée.", hi: "कोई टीम नहीं मिली।", hr: "Nisu pronađene reprezentacije.", hu: "Nem találhatók csapatok.", id: "Tidak ada tim yang ditemukan.", it: "Nessuna squadra trovata.", nl: "Geen teams gevonden.", no: "Ingen lag funnet.", pl: "Nie znaleziono drużyn.", pt: "Nenhuma equipe encontrada.", "pt-pt": "Nenhuma equipa encontrada.", ro: "Nu s-au găsit echipe.", ru: "Команд не найдено.", sk: "Neboli nájdené žiadne tímy.", sl: "Ni najdenih ekip.", sr: "Нису пронађене репрезентације.", sv: "Inga lag hittades.", tr: "Takım bulunamadı.", zh: "未找到球队。"
  }
}

// Helper: Translate a key string based on active language
export function translate(key: string, lang: LanguageCode): string {
  const dict = TRANSLATIONS[key]
  if (!dict) return key
  return dict[lang] || dict["en"]
}

// Auto-detect browser/user locale and map to our 30 supported languages
export function detectBrowserLanguage(): LanguageCode {
  if (typeof window === "undefined" || !navigator) {
    return "en"
  }

  // 1. Check LocalStorage first for manual user selection persistence
  try {
    const savedLang = window.localStorage.getItem("worldcup2026_lang") as LanguageCode | null
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      return savedLang
    }
  } catch (e) {}

  // 2. Check timezone for specific regions (like Bangladesh -> bn, Iran -> ar/fa, etc.)
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timeZone) {
      const tzLower = timeZone.toLowerCase()
      if (tzLower.includes("dhaka")) return "bn" // Bangladesh
      if (tzLower.includes("tehran")) return "ar" // Iran (RTL Arabic alphabet layout)
      if (tzLower.includes("baku")) return "az" // Azerbaijan
      if (tzLower.includes("istanbul")) return "tr" // Turkey
      if (tzLower.includes("kolkata") || tzLower.includes("calcutta")) return "bn" // West Bengal (Bengali)
      if (tzLower.includes("shanghai") || tzLower.includes("urumqi")) return "zh" // China
    }
  } catch (e) {}

  // 3. Get preferred languages list
  const browserLangs = navigator.languages || [navigator.language || "en"]
  
  for (const rawLang of browserLangs) {
    const cleanLang = rawLang.toLowerCase()
    
    // Exact match
    const exactMatch = LANGUAGES.find(l => l.code === cleanLang)
    if (exactMatch) return exactMatch.code

    // Base language match (e.g. "en-GB" -> "en")
    const baseCode = cleanLang.split("-")[0] as LanguageCode
    const baseMatch = LANGUAGES.find(l => l.code === baseCode)
    if (baseMatch) {
      // Differentiate Portuguese
      if (baseCode === "pt") {
        if (cleanLang.includes("pt-pt")) return "pt-pt"
        return "pt" // default to pt-BR
      }
      // Differentiate Spanish
      if (baseCode === "es") {
        // Latin America locales
        if (["es-ar", "es-cl", "es-co", "es-cr", "es-do", "es-ec", "es-gt", "es-hn", "es-mx", "es-ni", "es-pa", "es-pe", "es-pr", "es-py", "es-sv", "es-uy", "es-ve", "es-419"].some(loc => cleanLang.includes(loc))) {
          return "es-la"
        }
        return "es" // Spain
      }
      return baseCode
    }
  }

  return "en"
}

// Parse match date local kickoff string and convert to UTC Date based on Stadium Location offsets
export function parseStadiumLocalDate(localDateStr: string, stadiumId: string): Date {
  try {
    const [datePart, timePart] = localDateStr.split(" ")
    const [month, day, year] = datePart.split("/").map(Number)
    const [hours, minutes] = timePart.split(":").map(Number)

    // Determine UTC offset for the stadium in June/July 2026 (DST offsets)
    let offset = -5 // Default to Central Time (UTC-5)
    
    if (["11", "12", "13", "14", "15", "16"].includes(stadiumId)) {
      offset = -4 // Eastern Time USA/Canada (EDT, UTC-4)
    } else if (["8", "9", "10"].includes(stadiumId)) {
      offset = -5 // Central Time USA (CDT, UTC-5)
    } else if (["1", "2", "3"].includes(stadiumId)) {
      offset = -6 // CST Mexico (UTC-6)
    } else if (["4", "5", "6", "7"].includes(stadiumId)) {
      offset = -7 // Pacific Time USA/Canada (PDT, UTC-7)
    }

    // Return UTC date object
    return new Date(Date.UTC(year, month - 1, day, hours - offset, minutes))
  } catch (e) {
    return new Date(localDateStr)
  }
}

// Format Date object in the user local timezone and locale string
export function formatLocalTime(date: Date, lang: LanguageCode): string {
  try {
    // Standardize browser locale format strings
    let locale = "en-GB"
    if (lang === "en-us") locale = "en-US"
    else if (lang === "pt") locale = "pt-BR"
    else if (lang === "es-la") locale = "es-419"
    else locale = lang

    return date.toLocaleString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
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
