const fs = require('fs');

const path = 'lib/i18n.ts';
let content = fs.readFileSync(path, 'utf8');

// Normalize line endings to LF for consistent matching
content = content.replace(/\r\n/g, '\n');

// 1. Update LanguageCode type definition
const originalType = `export type LanguageCode =
  | "en" | "en-us" | "ar" | "az" | "bn" | "cs" | "da" | "de" | "el" | "es"
  | "es-la" | "fr" | "hi" | "hr" | "hu" | "id" | "it" | "nl" | "no" | "pl"
  | "pt" | "pt-pt" | "ro" | "ru" | "sk" | "sl" | "sr" | "sv" | "tr" | "zh"`;

const updatedType = `export type LanguageCode =
  | "en" | "en-us" | "ar" | "az" | "bn" | "cs" | "da" | "de" | "el" | "es"
  | "es-la" | "fr" | "hi" | "hr" | "hu" | "id" | "it" | "nl" | "no" | "pl"
  | "pt" | "pt-pt" | "ro" | "ru" | "sk" | "sl" | "sr" | "sv" | "tr" | "zh"
  | "ja" | "ko" | "vi" | "he" | "th"`;

if (content.includes(originalType)) {
  content = content.replace(originalType, updatedType);
  console.log("Updated LanguageCode type definition");
} else {
  console.log("Warning: original LanguageCode type definition not found match");
}

// 2. Add to LANGUAGES list
const originalLanguagesEnd = `  { code: "zh", name: "中文", dir: "ltr" }\n]`;
const updatedLanguagesEnd = `  { code: "zh", name: "中文", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "vi", name: "Tiếng Việt", dir: "ltr" },
  { code: "he", name: "עברית", dir: "rtl" },
  { code: "th", name: "ไทย", dir: "ltr" }
]`;

if (content.includes(originalLanguagesEnd)) {
  content = content.replace(originalLanguagesEnd, updatedLanguagesEnd);
  console.log("Updated LANGUAGES list");
} else {
  // Let's do a fallback replace if zh name changes or list ending is slightly different
  const fallbackRegex = /\{\s*code:\s*"zh",\s*name:\s*"中文",\s*dir:\s*"ltr"\s*\}\n\]/;
  if (content.match(fallbackRegex)) {
    content = content.replace(fallbackRegex, updatedLanguagesEnd);
    console.log("Updated LANGUAGES list (fallback match)");
  } else {
    console.log("Warning: original LANGUAGES list end not found match");
  }
}

// 3. Add to getTimezoneLanguage()
const originalTzCode = `      if (tzLower.includes("berlin") || tzLower.includes("busingen") || tzLower.includes("germany")) return "de" // Germany`;
const updatedTzCode = `      if (tzLower.includes("berlin") || tzLower.includes("busingen") || tzLower.includes("germany")) return "de" // Germany
      if (tzLower.includes("tokyo") || tzLower.includes("japan")) return "ja"
      if (tzLower.includes("seoul") || tzLower.includes("korea")) return "ko"
      if (tzLower.includes("saigon") || tzLower.includes("hanoi") || tzLower.includes("vietnam")) return "vi"
      if (tzLower.includes("jerusalem") || tzLower.includes("tel_aviv") || tzLower.includes("israel")) return "he"
      if (tzLower.includes("bangkok") || tzLower.includes("thai")) return "th"
      if (tzLower.includes("zurich") || tzLower.includes("geneva") || tzLower.includes("switzerland")) return "de"`;

if (content.includes(originalTzCode)) {
  content = content.replace(originalTzCode, updatedTzCode);
  console.log("Updated getTimezoneLanguage()");
} else {
  console.log("Warning: original getTimezoneLanguage code not found match");
}

// 4. Add to COUNTRY_TO_LANG
const originalCountryEnd = `  CN: "zh", TW: "zh", HK: "zh", SG: "zh"\n}`;
const updatedCountryEnd = `  CN: "zh", TW: "zh", HK: "zh", SG: "zh",
  JP: "ja", KR: "ko", VN: "vi", IL: "he", TH: "th", CH: "de"
}`;

if (content.includes(originalCountryEnd)) {
  content = content.replace(originalCountryEnd, updatedCountryEnd);
  console.log("Updated COUNTRY_TO_LANG mapping");
} else {
  console.log("Warning: original COUNTRY_TO_LANG end not found match");
}

// 5. Add to PREFIX_TO_LANG
const originalPrefixEnd = `  zh: "zh",\n  cn: "zh"\n}`;
const updatedPrefixEnd = `  zh: "zh",
  cn: "zh",
  ja: "ja",
  ko: "ko",
  vi: "vi",
  he: "he",
  il: "he",
  th: "th"
}`;

if (content.includes(originalPrefixEnd)) {
  content = content.replace(originalPrefixEnd, updatedPrefixEnd);
  console.log("Updated PREFIX_TO_LANG mapping");
} else {
  console.log("Warning: original PREFIX_TO_LANG end not found match");
}

// 6. Add to LANG_TO_PREFIX
const originalLangToPrefixEnd = `  tr: "tr",\n  zh: "zh"\n}`;
const updatedLangToPrefixEnd = `  tr: "tr",
  zh: "zh",
  ja: "ja",
  ko: "ko",
  vi: "vi",
  he: "he",
  th: "th"
}`;

if (content.includes(originalLangToPrefixEnd)) {
  content = content.replace(originalLangToPrefixEnd, updatedLangToPrefixEnd);
  console.log("Updated LANG_TO_PREFIX mapping");
} else {
  console.log("Warning: original LANG_TO_PREFIX end not found match");
}

// 7. Core translations dictionary mapping
const newTranslations = {
  title: {
    ja: "FIFAワールドカップ 2026", ko: "FIFA 월드컵 2026", vi: "FIFA World Cup 2026", he: "גביע העולם של פיפ״א 2026", th: "ฟีฟ่าเวิลด์คัพ 2026"
  },
  subtitle: {
    ja: "チーム＆マッチトラッカー", ko: "팀 및 경기 추적기", vi: "Trình theo dõi đội bóng & trận đấu", he: "מעקב נבחרות ומשחקים", th: "ตัวติดตามทีมและข้อมูลการแข่งขัน"
  },
  match_center: {
    ja: "マッチセンター", ko: "매치 센터", vi: "Trung tâm Trận đấu", he: "מרכז המשחקים", th: "ศูนย์ข้อมูลการแข่งขัน"
  },
  fixtures: {
    ja: "日程・結果", ko: "경기 일정", vi: "Lịch thi đấu", he: "לוח משחקים", th: "โปรแกรมการแข่งขัน"
  },
  matches: {
    ja: "試合", ko: "경기", vi: "Trận đấu", he: "משחקים", th: "การแข่งขัน"
  },
  today_matches: {
    ja: "今日の試合", ko: "오늘의 경기", vi: "Trận đấu hôm nay", he: "משחקי היום", th: "การแข่งขันวันนี้"
  },
  team: {
    ja: "チーム", ko: "팀", vi: "Đội", he: "נבחרת", th: "ทีม"
  },
  teams_groups: {
    ja: "チーム＆グループ", ko: "팀 및 조", vi: "Đội bóng & Bảng đấu", he: "נבחרות ובתים", th: "ทีมและกลุ่ม"
  },
  groups: {
    ja: "グループ", ko: "조", vi: "Bảng đấu", he: "בתים", th: "กลุ่ม"
  },
  search_placeholder: {
    ja: "チーム、試合日、グループなどを検索...", ko: "팀, 경기일, 조 검색...", vi: "Tìm kiếm đội bóng, vòng đấu, bảng đấu...", he: "חיפוש נבחרות, ימי משחק, בתים...", th: "ค้นหาทีม, วันแข่งขัน, กลุ่ม..."
  },
  filter_matches: {
    ja: "試合をフィルター", ko: "경기 필터", vi: "Lọc trận đấu", he: "סינון משחקים", th: "กรองการแข่งขัน"
  },
  all_matches: {
    ja: "すべての試合", ko: "모든 경기", vi: "Tất cả trận đấu", he: "כל המשחקים", th: "การแข่งขันทั้งหมด"
  },
  finished: {
    ja: "終了", ko: "종료됨", vi: "Đã kết thúc", he: "הסתיים", th: "สิ้นสุดแล้ว"
  },
  upcoming: {
    ja: "予定", ko: "예정됨", vi: "Sắp diễn ra", he: "טרם החל", th: "ยังไม่เริ่ม"
  },
  clear_filters: {
    ja: "フィルターをクリア", ko: "フィルターをクリア", vi: "Xóa bộ lọc", he: "ניקוי מסננים", th: "ล้างตัวกรอง"
  },
  select_group_stage: {
    ja: "グループステージ選択", ko: "조별 리그 선택", vi: "Chọn vòng bảng", he: "בחר שלב בתים", th: "เลือกการแข่งขันรอบแบ่งกลุ่ม"
  },
  reset_groups: {
    ja: "グループをリセット", ko: "그룹 초기화", vi: "Đặt lại bảng đấu", he: "איפוס בתים", th: "รีเซ็ตกลุ่ม"
  },
  total_matches: {
    ja: "総試合数", ko: "총 경기 수", vi: "Tổng số trận đấu", he: "סה״כ משחקים", th: "การแข่งขันทั้งหมด"
  },
  played: {
    ja: "消化済", ko: "진행됨", vi: "Đã chơi", he: "שוחקו", th: "แข่งแล้ว"
  },
  teams: {
    ja: "チーム", ko: "팀", vi: "Đội", he: "נבחרות", th: "ทีม"
  },
  played_matches: {
    ja: "終了した試合", ko: "진행된 경기", vi: "Trận đấu đã chơi", he: "משחקים ששוחקו", th: "แมตช์ที่แข่งแล้ว"
  },
  upcoming_matches: {
    ja: "今後の試合", ko: "예정된 경기", vi: "Trận đấu sắp tới", he: "משחקים קروבים", th: "แมตช์ที่กำลังจะมาถึง"
  },
  back_dashboard: {
    ja: "ダッシュボードに戻る", ko: "대시보드로 돌아가기", vi: "Quay lại bảng điều khiển", he: "חזרה ללוח הבקרה", th: "กลับไปที่แดชบอร์ด"
  },
  back_timeline: {
    ja: "タイムラインに戻る", ko: "타임라인으로 돌아가기", vi: "Quay lại dòng thời gian", he: "חזרה לציר הזמן", th: "กลับไปที่ไทม์ไลน์"
  },
  stadium: {
    ja: "スタジアム", ko: "경기장", vi: "Sân vận động", he: "אצטדיון", th: "สนามแข่งขัน"
  },
  goal_scorers: {
    ja: "得点者", ko: "득점자", vi: "Cầu thủ ghi bàn", he: "כובשי השערים", th: "ผู้ทำประตู"
  },
  stadium_stats: {
    ja: "スタジアム統計", ko: "경기장 통계", vi: "Thống kê sân vận động", he: "נתוני האצטדיון", th: "สถิติสนามแข่งขัน"
  },
  capacity: {
    ja: "収容人数", ko: "수용 인원", vi: "Sức chứa", he: "תכולה", th: "ความจุสนาม"
  },
  location: {
    ja: "所在地", ko: "위치", vi: "Địa điểm", he: "מיקום", th: "สถานที่"
  },
  seats: {
    ja: "席", ko: "석", vi: "Chỗ ngồi", he: "מושבים", th: "ที่นั่ง"
  },
  match_schedule: {
    ja: "試合日程", ko: "경기 일정", vi: "Lịch thi đấu", he: "לוח זமנים למשחק", th: "ตารางเวลาการแข่งขัน"
  },
  local_kickoff: {
    ja: "現地のキックオフ時間", ko: "현지 킥오프", vi: "Giờ bắt đầu địa phương", he: "שעת בעיטת הפתיחה המקומית", th: "เวลาคิกออฟตามเวลาท้องถิ่น"
  },
  match_statistics: {
    ja: "試合統計", ko: "경기 통계", vi: "Thống kê trận đấu", he: "סטטיסטיקת המשחק", th: "สถิติการแข่งขัน"
  },
  possession: {
    ja: "ボール支配率", ko: "점유율", vi: "Kiểm soát bóng", he: "החזקת כדור", th: "อัตราการครองบอล"
  },
  shots: {
    ja: "シュート数", ko: "슈팅", vi: "Cú sút", he: "בעיטות", th: "โอกาสยิง"
  },
  fouls: {
    ja: "ファウル数", ko: "파울", vi: "Phạm lỗi", he: "עבירות", th: "ฟาวล์"
  },
  signup_title: {
    ja: "無料アカウント登録でHDライブ配信を視聴可能", ko: "HD 라이브 스트림을 보려면 무료 계정을 만드십시오", vi: "Tạo tài khoản miễn phí để xem trực tiếp HD", he: "צור חשבון בחינם כדי לצפות בשידור חי ב-HD", th: "สร้างบัญชีฟรีเพื่อรับชมการถ่ายทอดสดแบบ HD"
  },
  live_stream: {
    ja: "無料ライブ配信", ko: "무료 라이브 스트림", vi: "Phát trực tiếp miễn phí", he: "שידור חי בחינם", th: "สตรีมสดฟรี"
  },
  signup_btn: {
    ja: "今すぐ無料登録", ko: "지금 무료 계정 등록", vi: "Đăng ký tài khoản miễn phí ngay", he: "הרשם לחשבון חינם עכשיו", th: "สมัครสมาชิกฟรีตอนนี้"
  },
  watch_live: {
    ja: "ライブ視聴", ko: "로그인하여 시청", vi: "Xem trực tiếp", he: "צפה בשידור חי", th: "รับชมการถ่ายทอดสด"
  },
  adblocker_title: {
    ja: "広告ブロッカーが検出されました", ko: "광고 차단기가 감지되었습니다", vi: "Phát hiện trình chặn quảng cáo", he: "זוהה חוסם פרסומות", th: "ตรวจพบเครื่องมือบล็อกโฆษณา"
  },
  adblocker_text: {
    ja: "配信をスムーズに読み込むために、広告ブロッカーを無効にしてください。", ko: "스트림을 원활하게 로드하려면 광고 차단기를 비활성화하십시오.", vi: "Vui lòng tắt trình chặn quảng cáo để tải luồng mượt mà.", he: "אנא נטרל את חוסם הפרסומות כדי לטעण את השידור בצורה חלקה.", th: "โปรดปิดการใช้งานเครื่องมือบล็อกโฆษณาเพื่อโหลดสตรีมอย่างราบรื่น"
  },
  unlock_hd: {
    ja: "HD画質とリアルタイム実況をアンロック", ko: "HD 스트리밍 및 실시간 해설 잠금 해제", vi: "Mở khóa luồng HD & Bình luận trực tiếp", he: "פתיחת שידור HD ופרשנות בזמן אמת", th: "ปลดล็อกสตรีม HD และผู้บรรยายสด"
  },
  feature_1: {
    ja: "バッファリングなしの超高速1080p画質", ko: "버퍼링이 없는 초고속 1080p 스트리밍", vi: "Luồng 1080p cực nhanh không giật lag", he: "שידור 1080p מהיר במיוחד ללא השהיות", th: "สตรีมมิ่ง 1080p ความเร็วสูงพิเศษไม่มีสะดุด"
  },
  feature_2: {
    ja: "英語・ローカル言語のライブ解説付き", ko: "영어 및 지역 언어 라이브 해설", vi: "Bình luận trực tiếp bằng tiếng Anh & Ngôn ngữ địa phương", he: "פרשנות חיה באנגלית ובשפות מקומיות", th: "คำบรรยายสดภาษาอังกฤษและภาษาท้องถิ่น"
  },
  feature_3: {
    ja: "PC、スマートフォン、タブレット、スマートTVに対応", ko: "PC, 모바일, 태블릿 및 스마트 TV 지원", vi: "Hỗ trợ PC, di động, máy tính bảng & Smart TV", he: "תמיכה במחשב, נייד, טאבלט וטלוויזיה חכמה", th: "รองรับพีซี, มือถือ, แท็บเล็ต และสมาร์ททีวี"
  },
  feature_4: {
    ja: "完全に無料の生涯アクセス", ko: "평생 100% 무료 액세스", vi: "Truy cập trọn đời miễn phí 100%", he: "גישה לכל החיים 100% בחינם", th: "เข้าใช้งานฟรี 100% ตลอดชีพ"
  },
  already_account: {
    ja: "すでにアカウントをお持ちですか？", ko: "이미 계정이 있으신가요?", vi: "Đã có tài khoản?", he: "כבר יש לך חשבון?", th: "มีบัญชีอยู่แล้ว?"
  },
  login: {
    ja: "ログイン", ko: "로그인", vi: "Đăng nhập", he: "התחבר", th: "เข้าสู่ระบบ"
  },
  loading: {
    ja: "読み込み中...", ko: "로딩 중...", vi: "Đang tải...", he: "טוען...", th: "กำลังโหลด..."
  },
  not_found: {
    ja: "ページが見つかりません", ko: "페이지를 찾을 수 없습니다", vi: "Không tìm thấy trang", he: "הדף לא נמצא", th: "ไม่พบหน้าเว็บ"
  },
  return_dashboard: {
    ja: "ダッシュボードに戻る", ko: "대시보드로 돌아가기", vi: "Quay lại bảng điều khiển", he: "חזרה ללוח הבקרה", th: "กลับไปที่แดชบอร์ด"
  },
  select_lang: {
    ja: "言語を選択", ko: "언어 선택", vi: "Chọn ngôn ngữ", he: "בחר שפה", th: "เลือกภาษา"
  },
  round_32: {
    ja: "ラウンド32", ko: "32강전", vi: "Vòng 32 đội", he: "סיבוב ה-32", th: "รอบ 32 ทีม"
  },
  round_16: {
    ja: "ラウンド16", ko: "16강전", vi: "Vòng 16 đội", he: "שמינית הגמר", th: "รอบ 16 ทีม"
  },
  quarter_finals: {
    ja: "準々決勝", ko: "8강전", vi: "Tứ kết", he: "רבע הגמר", th: "รอบก่อนรองชนะเลิศ"
  },
  semi_finals: {
    ja: "準決勝", ko: "4강전", vi: "Bán kết", he: "חצי הגמר", th: "รอบรองชนะเลิศ"
  },
  third_place: {
    ja: "3位決定戦", ko: "3위 결정전", vi: "Tranh hạng ba", he: "המשחק על המקום השלישי", th: "นัดชิงอันดับสาม"
  },
  final: {
    ja: "決勝", ko: "결승전", vi: "Chung kết", he: "הגמר", th: "นัดชิงชนะเลิศ"
  },
  group: {
    ja: "グループ", ko: "조", vi: "Bảng", he: "בית", th: "กลุ่ม"
  },
  matchday: {
    ja: "マッチデイ", ko: "경기일", vi: "Ngày thi đấu", he: "יום משחק", th: "วันแข่งขัน"
  },
  no_upcoming_matches: {
    ja: "予定されている試合はありません", ko: "예정된 경기가 없습니다", vi: "Không có trận đấu sắp tới", he: "אין משחקים קרובים", th: "ไม่มีการแข่งขันที่กำลังจะมาถึง"
  },
  no_played_matches: {
    ja: "終了した試合はありません", ko: "진행된 경기가 없습니다", vi: "Không có trận đấu đã chơi", he: "אין משחקים ששוחקו", th: "ไม่มีการแข่งขันที่เล่นไปแล้ว"
  },
  no_matches: {
    ja: "一致する試合はありません", ko: "일치하는 경기가 없습니다", vi: "Không tìm thấy trận đấu", he: "לא נמצאו משחקים", th: "ไม่พบการแข่งขัน"
  },
  no_teams: {
    ja: "チームが見つかりません", ko: "チームがありません", vi: "Không có đội bóng", he: "לא נמצאו נבחרות", th: "ไม่พบทีม"
  },
  about_the_match: {
    ja: "試合について", ko: "경기에 대하여", vi: "Thông tin trận đấu", he: "על המשחק", th: "เกี่ยวกับการแข่งขัน"
  },
  head_to_head_text: {
    ja: "対戦成績と予測", ko: "상대 전적 및 예측", vi: "Lịch sử đối đầu & Dự đoán", he: "ראש בראש ותחזית", th: "สถิติการพบกันและการทำนายผล"
  },
  h2h_results_intro: {
    ja: "過去の対戦における勝利と最近の調子の比較。", ko: "이전 맞대결 기록 및 최근 전적 비교.", vi: "So sánh lịch sử đối đầu và phong độ gần đây.", he: "השוואת ניצחונות בעבר וכושר נוכחי.", th: "เปรียบเทียบประวัติการเจอกันและฟอร์มล่าสุด"
  },
  h2h_feature_1: {
    ja: "対戦結果統計と勝率", ko: "이전 경기 기록 및 통계 데이터", vi: "Lịch sử đối đầu & Số liệu thống kê", he: "נתונים סטטיסטיים של מפגשים קודמים", th: "ประวัติการพบกันและข้อมูลสถิติ"
  },
  h2h_feature_2: {
    ja: "最新のゴール得点率と守備力", ko: "최근 득점 형태 및 수비 능력", vi: "Phong độ ghi bàn & Phòng ngự gần đây", he: "מגמות הבקעה וחוזק הגנתי לאחרונה", th: "สถิติการทำประตูและเกมรับล่าสุด"
  },
  h2h_feature_3: {
    ja: "キープレーヤーの負傷情報と出場予定", ko: "주요 선수 부상 정보 및 라인업 가능성", vi: "Tình hình chấn thương & Đội hình dự kiến", he: "עדכוני פציעות שחקני מפתח והרכבים משוערים", th: "รายงานการบาดเจ็บของนักเตะคีย์แมนและรายชื่อตัวจริง"
  },
  h2h_feature_4: {
    ja: "公式AIアルゴリズムによる勝敗予測", ko: "공식 AI 알고리즘 승률 시뮬레이션", vi: "Thuật toán dự đoán tỷ lệ thắng AI chính thức", he: "אלгוריתם AI רשמי לחיזוי סיכויי ניצחון", th: "การคำนวณโอกาสชนะด้วย AI อัลกอริทึมอย่างเป็นทางการ"
  },
  h2h_prediction_odds: {
    ja: "勝敗予測確率", ko: "예측 확률", vi: "Tỷ lệ dự đoán", he: "סיכויי תחזית", th: "โอกาสการชนะตามคำทำนาย"
  },
  where_to_watch: {
    ja: "視聴方法", ko: "시청 방법", vi: "Xem ở đâu", he: "איפה לצפות", th: "ช่องทางการรับชม"
  },
  event_details: {
    ja: "イベント詳細", ko: "이벤트 상세 정보", vi: "Chi tiết sự kiện", he: "פרטי האירוע", th: "รายละเอียดงาน"
  },
  event_name: {
    ja: "イベント名", ko: "이벤트 이름", vi: "Tên sự kiện", he: "שם האירוע", th: "ชื่อกิจกรรม"
  },
  event_date: {
    ja: "日付", ko: "날짜", vi: "Ngày", he: "תאריך", th: "วันที่"
  },
  event_time: {
    ja: "時間", ko: "시간", vi: "Thời gian", he: "שעה", th: "เวลา"
  },
  event_venue: {
    ja: "会場", ko: "장소", vi: "Địa điểm", he: "מיקום", th: "สถานที่จัดงาน"
  },
  match_disclaimer: {
    ja: "FIFAワールドカップの全試合を、いつでもどこでも無料のオンラインライブ配信、テレビ放送、録画、ハイライトでお楽しみいただけます。PC、Mac、iPad、iPhone、Android、PS4、Xbox One、スマートTV向けに最適化されています。", ko: "언제 어디서나 무료 온라인 라이브 스트리밍, TV 중계, 다시보기, 하이라이트로 FIFA 월드컵의 모든 경기를 즐기세요. PC, Mac, iPad, iPhone, Android, PS4, Xbox One, 스마트 TV에 최적화되어 있습니다.", vi: "Thưởng thức miễn phí mọi trận đấu FIFA World Cup phát trực tiếp trực tuyến, truyền hình, phát lại, highlights mọi lúc mọi nơi. Tối ưu hóa cho PC, Mac, iPad, iPhone, Android, PS4, Xbox One và Smart TV.", he: "תיהנו מכל משחק של גביע העולם של פיפ״א בשידור חי אונליין בחינם, שידורי טלוויזיה, תקצירים ושחזורים מכל מקום ובכל זמן. מותאם למחשבים, מק, אייפד, אייפון, אנדרואיד, פלייסטיישן, אקסבוקס וטלוויזיות חכמות.", th: "รับชมการถ่ายทอดสด การรายงานข่าวทางทีวี ย้อนหลัง และไฮไลท์ฟุตบอลโลกฟรีออนไลน์ได้ทุกที่ทุกเวลา รองรับการใช้งานทั้งบนพีซี, แมค, ไอแพด, ไอโฟน, แอนดรอยด์, PS4, Xbox One และสมาร์ททีวี"
  }
};

// 8. Inject new language values into every key in TRANSLATIONS
for (const [key, val] of Object.entries(newTranslations)) {
  // Pattern to find: keyName: { ... }
  // We want to insert the translations inside this block.
  const regex = new RegExp(`(${key}:\\s*\\{[\\s\\S]*?)(?:\\n\\s*\\})`, 'm');
  const match = content.match(regex);
  if (match) {
    const originalBlock = match[1];
    
    // Check if ja, ko, vi, he, th already exist in this block to avoid duplicates
    let newLines = '';
    if (!originalBlock.includes('ja:')) newLines += `,\n    ja: "${val.ja.replace(/"/g, '\\"')}"`;
    if (!originalBlock.includes('ko:')) newLines += `,\n    ko: "${val.ko.replace(/"/g, '\\"')}"`;
    if (!originalBlock.includes('vi:')) newLines += `,\n    vi: "${val.vi.replace(/"/g, '\\"')}"`;
    if (!originalBlock.includes('he:')) newLines += `,\n    he: "${val.he.replace(/"/g, '\\"')}"`;
    if (!originalBlock.includes('th:')) newLines += `,\n    th: "${val.th.replace(/"/g, '\\"')}"`;

    const replacement = originalBlock + newLines + '\n  }';
    content = content.replace(match[0], replacement);
  } else {
    console.log(`Warning: Key "${key}" not found or failed to parse block`);
  }
}

// Save LF file line endings back
fs.writeFileSync(path, content, 'utf8');
console.log("Successfully updated lib/i18n.ts with new languages and translations!");
