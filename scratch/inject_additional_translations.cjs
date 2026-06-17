const fs = require('fs');

// 1. Update MEMBERSHIP_TRANSLATIONS in components/navbar.tsx
function updateNavbar() {
  const path = 'components/navbar.tsx';
  let content = fs.readFileSync(path, 'utf8');
  content = content.replace(/\r\n/g, '\n');

  const blockRegex = /(const MEMBERSHIP_TRANSLATIONS: Record<string, string> = \{[\s\S]*?)(?:\n\})/;
  const match = content.match(blockRegex);
  if (match) {
    let original = match[1];
    let newLines = '';
    if (!original.includes('ja:')) newLines += `,\n  ja: "メンバーシップ"`;
    if (!original.includes('ko:')) newLines += `,\n  ko: "멤버십"`;
    if (!original.includes('vi:')) newLines += `,\n  vi: "Hội viên"`;
    if (!original.includes('he:')) newLines += `,\n  he: "חברות"`;
    if (!original.includes('th:')) newLines += `,\n  th: "สมาชิกภาพ"`;
    
    content = content.replace(match[0], original + newLines + '\n}');
    fs.writeFileSync(path, content, 'utf8');
    console.log("Updated components/navbar.tsx successfully!");
  } else {
    console.log("Could not find MEMBERSHIP_TRANSLATIONS in components/navbar.tsx");
  }
}

updateNavbar();
