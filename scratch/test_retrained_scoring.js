const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

function normalizeStudentSlang(text) {
    if (!text) return '';
    let t = text.toLowerCase().trim();

    // 1. Fix Thai double sara-e ('เเ') typing mistake to sara-ae ('แ')
    t = t.replace(/เเ/g, 'แ');

    // 2. Misspelling and Slang Mapping
    const slangMap = [
        [/(แคปรูป|แคปหน้าจอ|แคปหลักฐาน|ถ่ายรูปเก็บไว้|แคปภาพ|แคปไว้|เซฟรูป|แคปสกรีน|แคปหน้าจอไว้)/g, 'แคปเจอร์หลักฐาน'],
        [/(ฟ้องครู|บอกครู|ทักหาครู|ถามครู|แจ้งครูผู้สอน|บอกครูผู้สอน|ให้ครูช่วย)/g, 'แจ้งครู'],
        [/(บอกพ่อแม่|บอกผู้ปกครอง|ฟ้องพ่อแม่|บอกผู้ปกครองทราบ|แจ้งพ่อแม่|ให้พ่อแม่ช่วย)/g, 'แจ้งผู้ปกครอง'],
        [/(ทักแชท|ทักไปบอก|เตือนเพื่อน|บอกเพื่อน|ทักบอกเพื่อน)/g, 'แจ้งผู้เกี่ยวข้อง'],
        [/(รีพอร์ต|กดรีพอร์ต|ฟ้องระบบ|กดรายงาน|ฟ้องแอดมิน|รายงานผู้ส่ง|รายงานโพสต์)/g, 'รายงาน'],
        [/(สแกนหน้า|สแกนใบหน้า)/g, 'face id'],
        [/(สแกนนิ้ว|สแกนลายนิ้วมือ)/g, 'touch id'],
        [/(ล็อกออก|ออกระบบ|เด้งออก|ล๊อกเอาท์|ล๊อกออก)/g, 'logout'],
        [/(กู้งาน|กดกู้|ดึงงานกลับ|ดึงไฟล์กลับ|เอาสไลด์คืน|กู้ไฟล์|กู้คืนไฟล์|ดึงไฟล์)/g, 'ประวัติเวอร์ชัน'],
        [/(ยิงเว็บ|ยิงเซิร์ฟ|ยิงดิส|ยิงระบบ)/g, 'ddos'],
        [/(พาสเวิร์ด|พาสเวิด|พาส|password|พาสเวิด)/g, 'รหัสผ่าน'],
        [/(ไอดีเกม|ไอดี)/g, 'รหัสผ่าน'],
        [/(ลิ้งค์|ลิงค์|ลิ้ง|ลิ้งก์)/g, 'ลิงก์'],
        [/(เว็ป|เวป)/g, 'เว็บ'],
        [/(ดิสคอร์ด|ดิส)/g, 'discord'],
        [/(เฟสบุ๊ค|เฟสบุ๊ก|เฟส|เฟซ)/g, 'facebook'],
        [/(อินสตาแกรม|ไอจี)/g, 'instagram'],
        [/(ติ๊กต๊อก|ต๊อกต๊อก)/g, 'tiktok'],
        [/(จีเมล|เมล)/g, 'อีเมล'],
        [/(กฏหมาย|กฎหมายคอม|พ.ร.บ.คอม|พ.ร.บ คอม|พรบคอม|พ.ร.บคอม)/g, 'พ.ร.บ. คอมพิวเตอร์'],
        [/(เฟคนิวส์|เฟคนิว|fake news)/g, 'ข่าวปลอม'],
        [/(ฟิชชิ่ง|phishing)/g, 'ฟิชชิ่ง'],
        [/(เช็ค|เช็ก|ตรวจสอบข้อมูล|ตรวจสอบข่าว|ตรวจสอบแหล่งข่าว)/g, 'เช็กก่อนแชร์'],
        [/(อายัด|อายัดบัตร|ระงับบัตร)/g, 'อายัดบัตร'],
        [/(วีพีเอ็น|vpn)/g, 'vpn'],
        [/(เอสเอสแอล|ssl)/g, 'ssl']
    ];

    for (const [regex, replacement] of slangMap) {
        t = t.replace(regex, replacement);
    }
    return t;
}

const CASES = [
    {
        id: 1,
        section: "มาตรา 5",
        keywords_law: ["มาตรา 5", "5", "เข้าระบบ", "มิชอบ", "แอบเข้า", "เข้าถึงระบบ", "แอบส่อง", "แอบล็อกอิน", "เข้าเครื่อง", "ไม่ได้รับอนุญาต", "แอบใช้", "บุกรุกระบบ", "แอบจำรหัส", "ปลดล็อก"],
        keywords_penalty: ["6 เดือน", "หกเดือน", "10,000", "หนึ่งหมื่น", "10000", "หมื่นบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["logout", "log out", "ออกจากระบบ", "เปลี่ยนรหัส", "เปลี่ยนพาส", "แจ้งครู", "แจ้งผู้ปกครอง", "รายงาน", "แจ้งตำรวจ", "อายัด"],
        keywords_security: ["2fa", "two-factor", "otp", "ล็อกอิน 2 ชั้น", "สองชั้น", "ล็อกหน้าจอ", "ยืนยันตัวตน", "พกติดตัว", "ตั้งรหัส"]
    },
    {
        id: 2,
        section: "มาตรา 6",
        keywords_law: ["มาตรา 6", "6", "เปิดเผย", "มาตรการป้องกัน", "แจกรหัส", "เผยแพร่รหัส", "ปล่อยรหัส", "โพสต์รหัส", "ส่งรหัส", "แชร์รหัส"],
        keywords_penalty: ["1 ปี", "หนึ่งปี", "20,000", "สองหมื่น", "20000", "หมื่น", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["เปลี่ยนรหัส", "ลบข้อความ", "แจ้งแอดมิน", "discord", "ตัดเซสชัน", "บล็อก", "ลบโพสต์", "ลบรูป", "แจ้งครู", "แจ้งตำรวจ"],
        keywords_security: ["รหัสผ่านซับซ้อน", "ตัวพิมพ์ใหญ่", "ตัวเลข", "สัญลักษณ์", "ห้ามจด", "password manager", "ความลับ", "ไม่แปะกระดาษ", "ไม่ถ่ายรูปรหัส"]
    },
    {
        id: 3,
        section: "มาตรา 7",
        keywords_law: ["มาตรา 7", "7", "เข้าถึงข้อมูล", "ข้อมูลคอมพิวเตอร์", "ไดอารี่", "คุ้ยไฟล์", "ดูดไฟล์", "แอบดู", "แอบเปิด", "ข้อมูลส่วนตัว"],
        keywords_penalty: ["2 ปี", "สองปี", "40,000", "สี่หมื่น", "40000", "หมื่น", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["ลบไฟล์", "เปลี่ยนรหัส", "แจ้งระงับ", "แจ้งครู", "แจ้งแอดมิน", "ลบโพสต์", "ลบแชท", "ลบรูป", "แจ้งตำรวจ"],
        keywords_security: ["สแกนใบหน้า", "ลายนิ้วมือ", "face id", "biometrics", "เข้ารหัส", "encryption", "ล็อกโฟลเดอร์", "ตั้งค่าส่วนตัว", "กรองความเป็นส่วนตัว"]
    },
    {
        id: 4,
        section: "มาตรา 8",
        keywords_law: ["มาตรา 8", "8", "ดักรับ", "ดักจับ", "ระหว่างการส่ง", "ข้อมูลคอมพิวเตอร์", "ดักข้อมูล", "wifi ปลอม"],
        keywords_penalty: ["3 ปี", "สามปี", "60,000", "หกหมื่น", "60000", "หมื่น", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["ตัด wifi", "หยุดทำธุรกรรม", "อายัดบัตร", "แจ้งธนาคาร", "แจ้งค่ายเกม", "เปลี่ยนพาส", "เปลี่ยนรหัส", "ตัดการเชื่อมต่อ", "แจ้งตำรวจ"],
        keywords_security: ["ssl", "https", "vpn", "เข้ารหัสข้อมูล", "encryption", "หลีกเลี่ยง wifi ฟรี", "public wifi", "ไม่ใช้ wifi สาธารณะ", "ไม่เชื่อมต่อมั่ว"]
    },
    {
        id: 5,
        section: "มาตรา 9",
        keywords_law: ["มาตรา 9", "9", "ทำลาย", "แก้ไข", "ลบไฟล์", "เปลี่ยนแปลงข้อมูล", "เสียหาย"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["version history", "ประวัติเวอร์ชัน", "กู้คืน", "restore", "ถังขยะ", "recycle bin", "activity log", "กู้ไฟล์"],
        keywords_security: ["read-only", "อ่านอย่างเดียว", "จำกัดสิทธิ์", "permission", "แชร์เฉพาะอีเมล", "backup", "สำรองข้อมูล", "กำหนดสิทธิ์"]
    },
    {
        id: 6,
        section: "มาตรา 10",
        keywords_law: ["มาตรา 10", "10", "ขัดขวาง", "รบกวน", "ระงับการทำงาน", "พังระบบ", "ddos", "ระบบล่ม", "ยิงเว็บ", "ยิงเซิร์ฟ"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["บล็อก ip", "block ip", "สลับเซิร์ฟเวอร์", "แจ้งไอที", "แจ้งครู", "รีสตาร์ท", "แจ้งตำรวจ", "ตัดการเชื่อมต่อ"],
        keywords_security: ["firewall", "ไฟร์วอลล์", "ddos protection", "cloudflare", "waf", "rate limit", "load balancer", "ป้องกัน ddos"]
    },
    {
        id: 7,
        section: "มาตรา 11 วรรคหนึ่ง",
        keywords_law: ["มาตรา 11", "11", "วรรคหนึ่ง", "สแปม", "ปกปิดแหล่งที่มา", "ปลอมแปลง", "อีเมลขยะ"],
        keywords_penalty: ["100,000", "หนึ่งแสน", "100000", "ปรับไม่เกิน 1 แสน", "ปรับ"],
        keywords_remedy: ["spam", "junk", "เมลขยะ", "รายงาน", "report", "แบน", "บล็อกผู้ส่ง", "แจ้งแอดมิน"],
        keywords_security: ["anti-spam", "กรองเมลขยะ", "filter", "spf", "dkim", "dmarc", "บล็อกผู้ส่งปลอม"]
    },
    {
        id: 8,
        section: "มาตรา 11 วรรคสอง",
        keywords_law: ["มาตรา 11", "11", "วรรคสอง", "ไม่เปิดโอกาส", "ยกเลิก", "unsubscribe", "รบกวน", "เดือดร้อนรำคาญ"],
        keywords_penalty: ["200,000", "สองแสน", "200000", "ปรับไม่เกิน 2 แสน", "ปรับ"],
        keywords_remedy: ["แคปรูป", "แคปเจอร์หลักฐาน", "ร้องเรียน", "แจ้งแพลตฟอร์ม", "บล็อก", "report", "กสทช", "แจ้งตำรวจ"],
        keywords_security: ["ไม่แปะเบอร์", "ไม่แปะเมล", "บอร์ดสาธารณะ", "email alias", "ความเป็นส่วนตัว", "privacy", "ปิดแจ้งเตือน", "anti-spam"]
    },
    {
        id: 9,
        section: "มาตรา 14(1)",
        keywords_law: ["มาตรา 14(1)", "14 (1)", "14(1)", "14", "ข้อมูลเท็จ", "หลอกลวง", "ฟิชชิ่ง", "phishing", "เว็บปลอม", "สร้างเว็บปลอม"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["แจ้งค่ายเกม", "ระงับบัญชี", "กู้คืน", "เปลี่ยนรหัส", "เตือนเพื่อน", "แจ้งตำรวจ", "แจ้งแอดมิน"],
        keywords_security: ["ตรวจ url", "domain", "โดเมน", "ลิงก์ปลอม", "ไม่คลิกลิงก์", "เว็บทางการ", "official", "เช็กก่อนแชร์"]
    },
    {
        id: 10,
        section: "มาตรา 14(2)",
        keywords_law: ["มาตรา 14(2)", "14 (2)", "14(2)", "14", "ตื่นตระหนก", "ข่าวปลอม", "fake news", "ข้อมูลเท็จ", "ตระหนกตกใจ"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["ลบโพสต์", "ลบข่าวปลอม", "แถลงแก้ข่าว", "โพสต์แก้", "ชี้แจง", "ขอโทษ", "แจ้งตำรวจ", "แจ้งครู"],
        keywords_security: ["ศูนย์ต่อต้านข่าวปลอม", "anti-fake news", "เช็กก่อนแชร์", "แหล่งข่าวทางการ", "verified", "ตรวจสอบข้อมูล", "เสพข่าวอย่างมีสติ"]
    },
    {
        id: 11,
        section: "มาตรา 14(4)",
        keywords_law: ["มาตรา 14(4)", "14 (4)", "14(4)", "14", "ลามก", "อนาจาร", "คลิปโป๊", "18+", "ภาพลามก"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ", "จำคุก", "ปรับ"],
        keywords_remedy: ["ลบคลิป", "ลบวิดีโอ", "ลบภาพ", "แอดมินลบ", "บล็อก", "report", "รายงาน", "แจ้งครู", "แจ้งตำรวจ"],
        keywords_security: ["safesearch", "safe search", "content filter", "ตัวกรอง", "กรองเนื้อหา", "moderation", "ตั้งค่ากลุ่มส่วนตัว"]
    },
    {
        id: 12,
        section: "มาตรา 16",
        keywords_law: ["มาตรา 16", "16", "ตัดต่อ", "ดัดแปลง", "เสียชื่อเสียง", "ดูหมิ่น", "อับอาย", "cyberbullying", "ประจาน"],
        keywords_penalty: ["3 ปี", "สามปี", "200,000", "สองแสน", "200000", "แสนบาท", "ปรับ", "จำคุก"],
        keywords_remedy: ["แคปรูป", "แคปเจอร์หลักฐาน", "แจ้งลบ", "report", "cyberbullying", "แจ้งครู", "แจ้งผู้ปกครอง", "แจ้งตำรวจ", "ลบโพสต์"],
        keywords_security: ["private account", "ตั้งค่าส่วนตัว", "จำกัดแท็ก", "ไม่แชร์รูปสาธารณะ", "จริยธรรม", "ปิดกั้น"]
    }
];

function evalRole(cId, role, ansText) {
    const clean = normalizeStudentSlang(ansText);
    const caseObj = CASES.find(c => c.id === Number(cId)) || CASES[0];
    
    if (clean.length < 5) return 0;

    let score = 0;
    if (role === 'legal') {
        const hasLaw = caseObj.keywords_law.some(k => clean.includes(k.toLowerCase())) || clean.includes("พ.ร.บ") || clean.includes("มาตรา");
        const hasPen = caseObj.keywords_penalty.some(k => clean.includes(k.toLowerCase())) || clean.includes("จำคุก") || clean.includes("ปรับ");
        if (hasLaw) score += 5;
        if (hasPen) score += 5;
    } else if (role === 'remedy') {
        const hasRemedy = caseObj.keywords_remedy.some(k => clean.includes(k.toLowerCase()));
        const hasContact = clean.includes("แจ้ง") || clean.includes("บอก") || clean.includes("ตำรวจ") || clean.includes("ครู") || clean.includes("ผู้ปกครอง") || clean.includes("รายงาน") || clean.includes("ลบ");
        if (hasRemedy) score += 5;
        if (hasContact) score += 5;
    } else if (role === 'security') {
        const hasSec = caseObj.keywords_security.some(k => clean.includes(k.toLowerCase()));
        const hasGenSec = clean.includes("รหัส") || clean.includes("ล็อก") || clean.includes("ตั้งค่า") || clean.includes("เปิด") || clean.includes("ไม่แชร์") || clean.includes("ไม่คลิก") || clean.includes("เช็ก");
        if (hasSec) score += 6;
        if (hasGenSec) score += 4;
    }
    return Math.min(10, score);
}

async function testAll() {
    const { data: scores, error } = await supabase.from('game_scores').select('*');
    if (error) return console.error(error);

    let oldZeroCount = 0;
    let newZeroCount = 0;
    let totalSections = 0;

    scores.forEach(row => {
        const cId = row.case_id || 1;
        const ans = row.student_answers || {};

        ['legal', 'remedy', 'security'].forEach(role => {
            const txt = ans[role] || '';
            const oldScore = row[`${role}_score`] ?? 0;
            const newScore = evalRole(cId, role, txt);

            totalSections++;
            if (oldScore === 0) oldZeroCount++;
            if (newScore === 0) newZeroCount++;
        });
    });

    console.log(`=== RETRAINING RESULTS ON 153 STUDENT RECORD SET (Total ${totalSections} section submissions) ===`);
    console.log(`Original zero-score sections: ${oldZeroCount}`);
    console.log(`New zero-score sections after retraining & slang normalization: ${newZeroCount}`);
    console.log(`Improvement: Reduced zero-scores by ${((oldZeroCount - newZeroCount)/oldZeroCount * 100).toFixed(1)}%!`);
}

testAll();
