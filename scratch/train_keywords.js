const fs = require('fs');
const path = require('path');

const targetServer = path.join(__dirname, '..', 'server.js');
const targetSync = path.join(__dirname, 'sync_keywords_and_scoring.js');

let serverContent = fs.readFileSync(targetServer, 'utf8');

// Regex to find CASE_REFERENCES object
const caseRefsMatch = serverContent.match(/const CASE_REFERENCES = (\{[\s\S]*?\n\});\n\n\/\/ Helper function/);

if (!caseRefsMatch) {
    console.error("Could not find CASE_REFERENCES in server.js");
    process.exit(1);
}

let caseRefs = JSON.parse(caseRefsMatch[1]);

// Add new keywords based on supabase analysis
const newKeywords = {
    1: { remedy: ["แจ้งตำรวจ", "ให้ผู้ปกครอง", "แอดมิน"], security: ["ปิดหน้าจอ", "รหัสที่ซับซ้อน", "พาสเวิร์ดปลอดภัย"] },
    2: { remedy: ["บอกครู", "แจ้งตำรวจ", "ผู้ปกครอง"], security: ["ไม่แปะกระดาษ", "ทิ้งกระดาษ", "ไม่ให้ผู้อื่นเห็น"] },
    3: { remedy: ["บอกครู", "แจ้งความ", "บังคับให้ลบไฟล์", "แจ้งตำรวจ"], security: ["ปิดหน้าจอ", "ตั้งรหัส2ชั้น", "รหัสผ่านที่ซับซ้อน"] },
    5: { remedy: ["กู้ไฟล์", "กู้ข้อมูล", "แจ้งความ", "บอกครู"], security: ["กำหนสิทธิ์การเข้าถึง", "เฉพาะฉันแก้ไขได้"] },
    6: { remedy: ["แจ้งเจ้าหน้าที่ตำรวจ", "ให้เจ้าหน้าที่ดำเนินการ", "สืบหาข้อมูล"], security: ["ตรวจสอบข้อมูลให้ชัดเจน", "สืบหาข้อมูล", "ติดตั้งระบบป้องกัน"] },
    7: { remedy: ["ปัดทิ้ง", "ไม่ต้องกดเข้าลิ้งค์", "บล็อก", "บล็อค"], security: ["ปัดหน้าจอทิ้ง", "อัปเดตระบบให้เป็นปัจจุบัน"] },
    8: { remedy: ["เเจ้งหน่วยงานที่เกี่ยวข้อง", "ปิดเเจ้งเตือน", "บล็อคลิงค์"], security: ["ปิดเเจ้งเตือน", "บล็อคลิงค์", "anti spam", "ปิดกั้นข้อความ"] },
    9: { remedy: ["แจ้งผู้ดูแลเกม", "ระงับความเสียหาย", "แจ้งตำรวจ", "ค้นหาแหล่งข้อมูล"], security: ["ตรวจสอบเวปให้ดี", "ไม่กดเข้าเว็บไวส์มั่วๆ", "ไม่กดลิงก์", "ห้ามใช้เเค่รหัสผ่าน"] },
    10: { remedy: ["ตรวจสอบข้อเท้จจริง", "ไม่เผยแพร่ข่าวเฟคนิว", "ลบโพส"], security: ["เช็คก่อนแชร์", "ตรวจสอบข้อมุลจากแหล่งข่าว", "ไม่กดแชร์"] },
    11: { remedy: ["แจ้งความกับตำรวจ", "ลบคลิป", "ลบโพส"], security: ["มีวิจารณญาณ", "ตั้งค่าไม่ให้ส่ง", "จำกัดคนดู"] },
    12: { remedy: ["แจ้งครู", "แจ้งพ่อแม่", "กดรายงานโพสต์"], security: ["ล็อกโปรไฟล์", "จำกัดผู้เข้าชม", "ปิดฟังก์ชันการดาวน์โหลดรูปภาพ", "ปิดกั้นเนื้อหา"] }
};

for (const caseId in newKeywords) {
    if (caseRefs[caseId]) {
        if (newKeywords[caseId].law) caseRefs[caseId].keywords_law.push(...newKeywords[caseId].law);
        if (newKeywords[caseId].penalty) caseRefs[caseId].keywords_penalty.push(...newKeywords[caseId].penalty);
        if (newKeywords[caseId].remedy) caseRefs[caseId].keywords_remedy.push(...newKeywords[caseId].remedy);
        if (newKeywords[caseId].security) caseRefs[caseId].keywords_security.push(...newKeywords[caseId].security);

        // Deduplicate
        caseRefs[caseId].keywords_law = [...new Set(caseRefs[caseId].keywords_law)];
        caseRefs[caseId].keywords_penalty = [...new Set(caseRefs[caseId].keywords_penalty)];
        caseRefs[caseId].keywords_remedy = [...new Set(caseRefs[caseId].keywords_remedy)];
        caseRefs[caseId].keywords_security = [...new Set(caseRefs[caseId].keywords_security)];
    }
}

// Convert back to JSON and format
const newCaseRefsStr = JSON.stringify(caseRefs, null, 4);
serverContent = serverContent.replace(caseRefsMatch[1], newCaseRefsStr);

fs.writeFileSync(targetServer, serverContent, 'utf8');
console.log("Updated server.js CASE_REFERENCES");

// Update sync_keywords_and_scoring.js
let syncContent = fs.readFileSync(targetSync, 'utf8');
// CASES_WITH_KEYWORDS is an array
const syncMatch = syncContent.match(/const CASES_WITH_KEYWORDS = (\[[\s\S]*?\]);\n\nconsole\.log/);

if (syncMatch) {
    let syncArr = JSON.parse(syncMatch[1]);
    syncArr.forEach(c => {
        const id = c.id.toString();
        if (newKeywords[id]) {
            if (newKeywords[id].law) c.keywords_law.push(...newKeywords[id].law);
            if (newKeywords[id].penalty) c.keywords_penalty.push(...newKeywords[id].penalty);
            if (newKeywords[id].remedy) c.keywords_remedy.push(...newKeywords[id].remedy);
            if (newKeywords[id].security) c.keywords_security.push(...newKeywords[id].security);

            c.keywords_law = [...new Set(c.keywords_law)];
            c.keywords_penalty = [...new Set(c.keywords_penalty)];
            c.keywords_remedy = [...new Set(c.keywords_remedy)];
            c.keywords_security = [...new Set(c.keywords_security)];
        }
    });

    const newSyncArrStr = JSON.stringify(syncArr, null, 4);
    syncContent = syncContent.replace(syncMatch[1], newSyncArrStr);
    
    // Also add logic to update server.js in sync_keywords_and_scoring.js if it doesn't exist
    if (!syncContent.includes('// Update server.js')) {
        syncContent = syncContent.replace("console.log('Done sync!');", `// Update server.js
let serverContent = fs.readFileSync(targetServer, 'utf8');
const caseRefsMatch = serverContent.match(/const CASE_REFERENCES = (\\{[\\s\\S]*?\\n\\});\\n\\nconst SCORE_THRESHOLDS/);
if (caseRefsMatch) {
    const caseRefsObj = {};
    CASES_WITH_KEYWORDS.forEach(c => {
        caseRefsObj[c.id.toString()] = {
            title: c.title,
            law: c.standard_law,
            penalty: c.standard_penalty,
            remedy: c.standard_remedy,
            prevention: c.standard_prevention,
            keywords_law: c.keywords_law,
            keywords_penalty: c.keywords_penalty,
            keywords_remedy: c.keywords_remedy,
            keywords_security: c.keywords_security
        };
    });
    serverContent = serverContent.replace(caseRefsMatch[1], JSON.stringify(caseRefsObj, null, 4));
    fs.writeFileSync(targetServer, serverContent, 'utf8');
    console.log('Updated server.js CASE_REFERENCES!');
}

console.log('Done sync!');`);
    }

    fs.writeFileSync(targetSync, syncContent, 'utf8');
    console.log("Updated sync_keywords_and_scoring.js CASES_WITH_KEYWORDS");
} else {
    console.log("Could not find CASES_WITH_KEYWORDS in sync script.");
}
