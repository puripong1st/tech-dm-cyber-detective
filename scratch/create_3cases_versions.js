const fs = require('fs');
const path = require('path');

// 1. Generate cyber_shield_detective_3.html
let detectiveSrc = fs.readFileSync(path.join(__dirname, '../cyber_shield_detective.html'), 'utf8');

// Replacements for detective
let det3 = detectiveSrc
    // Title & Meta
    .replace(
        '<title>Cyber Shield Detective: ปฏิบัติการสายสืบพิทักษ์ไซเบอร์ | เกมการเรียนรู้กฎหมายคอมพิวเตอร์ & PDPA (ม.2 - ม.3)</title>',
        '<title>Cyber Shield Detective (3 คดี): ปฏิบัติการสายสืบพิทักษ์ไซเบอร์ | เกมการเรียนรู้กฎหมายคอมพิวเตอร์ & PDPA</title>'
    )
    .replace(
        '<span\n                            class="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-mono font-bold">v4.5\n                            AI</span>',
        '<span\n                            class="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/40 font-mono font-bold">v4.5\n                            AI (3 คดี)</span>'
    )
    // Navbar Progress & Score
    .replace(
        '<span>คดีที่ <b id="label-current-case" class="text-pink-300">1</b> / 6</span>',
        '<span>คดีที่ <b id="label-current-case" class="text-pink-300">1</b> / 3</span>'
    )
    .replace(
        '<span>คะแนน: <b id="label-total-score" class="text-yellow-300 text-sm font-bold">0</b> / 180</span>',
        '<span>คะแนน: <b id="label-total-score" class="text-yellow-300 text-sm font-bold">0</b> / 90</span>'
    )
    // Certificate Modal
    .replace(
        'ขอแสดงความยินดีกับทีมสายสืบเยาวชนในการไขคดีทั้ง 6\n                    คดีได้อย่างยอดเยี่ยม',
        'ขอแสดงความยินดีกับทีมสายสืบเยาวชนในการไขคดีทั้ง 3\n                    คดีได้อย่างยอดเยี่ยม'
    )
    .replace(
        '<span id="cert-total-score">0</span> / 180',
        '<span id="cert-total-score">0</span> / 90'
    )
    .replace(
        '<b>กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</b> ครบทั้ง 6 คดี',
        '<b>กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA)</b> ครบทั้ง 3 คดี'
    )
    .replace(
        '<span class="text-lg font-black text-amber-600 font-mono" id="print-cert-score">180 / 180</span>',
        '<span class="text-lg font-black text-amber-600 font-mono" id="print-cert-score">90 / 90</span>'
    )
    // JS Logic
    .replace(
        "const SAVE_KEY = 'CYBER_SHIELD_ONEPAGE_SESSION';",
        "const SAVE_KEY = 'CYBER_SHIELD_3CASES_SESSION';"
    )
    .replace(
        "const sessionCases = shuffled.slice(0, 6);",
        "const sessionCases = shuffled.slice(0, 3);"
    )
    .replace(
        "btnLabel.textContent = `➡️ สู่คดีถัดไป (คดีที่ ${GAME_STATE.currentCaseIndex + 2} / 6)`;",
        "btnLabel.textContent = `➡️ สู่คดีถัดไป (คดีที่ ${GAME_STATE.currentCaseIndex + 2} / 3)`;"
    )
    .replace(
        "showToast(`เริ่มสืบคดีที่ ${GAME_STATE.currentCaseIndex + 1} / 6`, 'fa-solid fa-folder-open text-cyan-400');",
        "showToast(`เริ่มสืบคดีที่ ${GAME_STATE.currentCaseIndex + 1} / 3`, 'fa-solid fa-folder-open text-cyan-400');"
    )
    .replace(
        "document.getElementById('print-cert-score').textContent = `${GAME_STATE.totalScore || 0} / 180`;",
        "document.getElementById('print-cert-score').textContent = `${GAME_STATE.totalScore || 0} / 90`;"
    )
    // Supabase table & API sync
    .replace(
        "const res = await fetch('/api/save-case-score', {",
        "const res = await fetch('/api/save-case-score-3', {"
    )
    .replace(
        "body: JSON.stringify({",
        "body: JSON.stringify({\n                            mode: '3',\n                            table: 'game_scores_3',"
    )
    .replace(
        "await sb.from('game_scores').insert([{",
        "await sb.from('game_scores_3').insert([{"
    )
    .replace(
        "const cacheRaw = localStorage.getItem('CYBER_DETECTIVE_SCORES_CACHE');",
        "const cacheRaw = localStorage.getItem('CYBER_DETECTIVE_3CASES_SCORES_CACHE');"
    )
    .replace(
        "localStorage.setItem('CYBER_DETECTIVE_SCORES_CACHE', JSON.stringify(cacheList));",
        "localStorage.setItem('CYBER_DETECTIVE_3CASES_SCORES_CACHE', JSON.stringify(cacheList));"
    )
    .replace(
        "const bc = new BroadcastChannel('cyber_detective_live');",
        "const bc = new BroadcastChannel('cyber_detective_3_live');"
    );

fs.writeFileSync(path.join(__dirname, '../cyber_shield_detective_3.html'), det3, 'utf8');
console.log('✅ Created cyber_shield_detective_3.html successfully!');


// 2. Generate cyber_shield_teacher_3.html
let teacherSrc = fs.readFileSync(path.join(__dirname, '../cyber_shield_teacher.html'), 'utf8');

let tea3 = teacherSrc
    // Title
    .replace(
        '<title>Teacher Command Center | แผงควบคุมครูผู้สอน & สรุปผลคะแนนสด พ.ร.บ.คอมพิวเตอร์ & PDPA</title>',
        '<title>Teacher Command Center (3 คดี) | แผงควบคุมครูผู้สอน & สรุปผลคะแนนสด 3 คดี</title>'
    )
    .replace(
        '<span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">v4.5 AI</span>',
        '<span class="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">3 คดี (90 คะแนน)</span>'
    )
    // Table Headers
    .replace(
        '<th class="p-3 text-right w-28 border-r border-slate-800">⭐ รวม (180)</th>',
        '<th class="p-3 text-right w-28 border-r border-slate-800">⭐ รวม (90)</th>'
    )
    .replace(
        '<th class="p-2 text-right w-24">⭐ รวม (180)</th>',
        '<th class="p-2 text-right w-24">⭐ รวม (90)</th>'
    )
    // Average score stat
    .replace(
        "document.getElementById('stat-avg-score').textContent = `${avg} / 180`;",
        "document.getElementById('stat-avg-score').textContent = `${avg} / 90`;"
    )
    // Group case badge
    .replace(
        '<i class="fa-solid fa-folder-open"></i> ${row.caseCount} / 6 คดี',
        '<i class="fa-solid fa-folder-open"></i> ${row.caseCount} / 3 คดี'
    )
    // PDF Chunk Size & Case Index
    .replace(
        "const chunkSize = 6;",
        "const chunkSize = 3;"
    )
    .replace(
        "คดีที่ ${globalCaseIdx}/6",
        "คดีที่ ${globalCaseIdx}/3"
    )
    .replace(
        "The case grid is compact enough for 6 cases on A4.",
        "The case grid is compact enough for 3 cases on A4."
    )
    // Supabase Channel & API fetch
    .replace(
        "const res = await fetch('/api/leaderboard');",
        "const res = await fetch('/api/leaderboard-3');"
    )
    .replace(
        "localStorage.setItem('CYBER_DETECTIVE_SCORES_CACHE', JSON.stringify(scores));",
        "localStorage.setItem('CYBER_DETECTIVE_3CASES_SCORES_CACHE', JSON.stringify(scores));"
    )
    .replace(
        "const localRaw = localStorage.getItem('CYBER_DETECTIVE_SCORES_CACHE');",
        "const localRaw = localStorage.getItem('CYBER_DETECTIVE_3CASES_SCORES_CACHE');"
    )
    .replace(
        "localStorage.removeItem('CYBER_DETECTIVE_SCORES_CACHE');",
        "localStorage.removeItem('CYBER_DETECTIVE_3CASES_SCORES_CACHE');"
    )
    .replace(
        "const bc = new BroadcastChannel('cyber_detective_live');",
        "const bc = new BroadcastChannel('cyber_detective_3_live');"
    )
    .replace(
        ".channel('public:game_scores')",
        ".channel('public:game_scores_3')"
    )
    .replace(
        "{ event: '*', schema: 'public', table: 'game_scores' }",
        "{ event: '*', schema: 'public', table: 'game_scores_3' }"
    )
    // Teacher override update endpoint
    .replace(
        "body: JSON.stringify({",
        "body: JSON.stringify({\n                        mode: '3',\n                        table: 'game_scores_3',"
    );

fs.writeFileSync(path.join(__dirname, '../cyber_shield_teacher_3.html'), tea3, 'utf8');
console.log('✅ Created cyber_shield_teacher_3.html successfully!');
