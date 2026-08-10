const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Force Vercel Node File Trace (NFT) to bundle cases_data.js in Lambda package
try { require('./cases_data.js'); } catch(e) {}

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS & JSON Body Parser
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve Static Directories with explicit caching
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: '1d' }));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use(express.static(__dirname));

// Case Reference Database for AI Grounding (12 Cases)
const CASE_REFERENCES = {
    1: {
        title: "แอบส่องระบบไอดีเกมของเพื่อน",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 5 (แอบเข้าถึงระบบคอมพิวเตอร์ผู้อื่นที่มีมาตรการป้องกันโดยมิชอบ)",
        penalty: "จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "สั่ง Log out ออกจากระบบทุกเครื่องทันที, รีบเปลี่ยนรหัสผ่านใหม่, แจ้งครูและผู้ปกครอง",
        prevention: "เปิดใช้งานระบบยืนยันตัวตน 2 ชั้น (2FA / Two-Factor Authentication) ส่งรหัส OTP, ล็อกหน้าจอทุกครั้งที่ลุกจากเครื่อง",
        keywords_law: ["มาตรา 5", "5", "เข้าระบบ", "มิชอบ", "แอบเข้า"],
        keywords_penalty: ["6 เดือน", "10,000", "หนึ่งหมื่น", "10000", "หมื่นบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["logout", "log out", "ออกจากระบบ", "เปลี่ยนรหัส", "เปลี่ยนพาส", "แจ้งครู", "แจ้งผู้ปกครอง", "รายงาน"],
        keywords_security: ["2fa", "two-factor", "otp", "ล็อกอิน 2 ชั้น", "สองชั้น", "ล็อกหน้าจอ", "ยืนยันตัวตน"]
    },
    2: {
        title: "แจกรหัสผ่านระบบในกลุ่ม Discord",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 6 (นำมาตรการป้องกันการเข้าถึงระบบที่ผู้อื่นทำขึ้นไปเปิดเผยโดยมิชอบ)",
        penalty: "จำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "รีบเปลี่ยนรหัสผ่านระบบทันที, ลบข้อความแจกรหัสใน Discord/แจ้งแอดมินลบ, ตัดเซสชันไอพีแปลกปลอม",
        prevention: "ตั้งรหัสผ่านซับซ้อน (ตัวพิมพ์ใหญ่+เล็ก+ตัวเลข+สัญลักษณ์พิเศษ เช่น Pass123!), เก็บพาสเวิร์ดเป็นความลับ ไม่จดทิ้งไว้",
        keywords_law: ["มาตรา 6", "6", "เปิดเผย", "มาตรการป้องกัน", "แจกรหัส", "เผยแพร่รหัส"],
        keywords_penalty: ["1 ปี", "20,000", "สองหมื่น", "20000", "หมื่น", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["เปลี่ยนรหัส", "ลบข้อความ", "แจ้งแอดมิน", "discord", "ตัดเซสชัน", "บล็อก"],
        keywords_security: ["รหัสผ่านซับซ้อน", "ตัวพิมพ์ใหญ่", "ตัวเลข", "สัญลักษณ์", "ห้ามจด", "password manager", "ความลับ"]
    },
    3: {
        title: "แอบคุ้ยไฟล์ไดอารี่แชทลับส่วนตัว",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 7 (เข้าถึงข้อมูลคอมพิวเตอร์ของผู้อื่นที่มีมาตรการป้องกันโดยมิชอบ)",
        penalty: "จำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 40,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "ลบไฟล์ที่รั่วไหล, เปลี่ยนรหัสผ่านคลาวด์/ไดรฟ์, แจ้งผู้ดูแลกลุ่มระงับการเผยแพร่",
        prevention: "ตั้งรหัสล็อกโฟลเดอร์ส่วนตัวด้วยลายนิ้วมือ/สแกนใบหน้า (Face ID / Biometrics), เข้ารหัสไฟล์ (File Encryption)",
        keywords_law: ["มาตรา 7", "7", "เข้าถึงข้อมูล", "ข้อมูลคอมพิวเตอร์", "ไดอารี่"],
        keywords_penalty: ["2 ปี", "40,000", "สี่หมื่น", "40000", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบไฟล์", "เปลี่ยนรหัส", "แจ้งระงับ", "แจ้งครู", "แจ้งแอดมิน"],
        keywords_security: ["สแกนใบหน้า", "ลายนิ้วมือ", "face id", "biometrics", "เข้ารหัส", "encryption", "ล็อกโฟลเดอร์"]
    },
    4: {
        title: "ดักจับข้อมูลธุรกรรมเติมเกมกลางทาง",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 8 (ดักรับข้อมูลคอมพิวเตอร์ของผู้อื่นที่อยู่ระหว่างการส่งโดยมิชอบ)",
        penalty: "จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 60,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "หยุดทำธุรกรรมบนเครือข่ายนั้นทันที, ตัดการเชื่อมต่อ Wi-Fi สาธารณะ, อายัดบัตร/แจ้งธนาคารและค่ายเกม",
        prevention: "บังคับใช้การส่งข้อมูลแบบเข้ารหัส SSL / HTTPS / VPN, หลีกเลี่ยงการทำธุรกรรมบน Public Wi-Fi ที่ไม่มีรหัสผ่าน",
        keywords_law: ["มาตรา 8", "8", "ดักรับ", "ดักจับ", "ระหว่างการส่ง", "ข้อมูลคอมพิวเตอร์"],
        keywords_penalty: ["3 ปี", "60,000", "หกหมื่น", "60000", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ตัด wifi", "หยุดทำธุรกรรม", "อายัดบัตร", "แจ้งธนาคาร", "แจ้งค่ายเกม", "เปลี่ยนพาส"],
        keywords_security: ["ssl", "https", "vpn", "เข้ารหัสข้อมูล", "encryption", "หลีกเลี่ยง wifi ฟรี", "public wifi"]
    },
    5: {
        title: "มือบอนแอบลบไฟล์โครงงานวิทย์เพื่อน",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 9 (ทำให้เสียหาย ทำลาย แก้ไข หรือเปลี่ยนแปลงข้อมูลคอมพิวเตอร์ของผู้อื่นโดยมิชอบ)",
        penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "ใช้ปุ่มประวัติเวอร์ชันไฟล์ (Version History / Cloud Restore) กู้คืนไฟล์ทันที, ตรวจสอบ Activity Log",
        prevention: "กำหนดสิทธิ์การเข้าถึงไฟล์ให้เป็น 'อ่านได้อย่างเดียว (Read-Only)' และจำกัดการแชร์เฉพาะอีเมลสมาชิกในกลุ่ม",
        keywords_law: ["มาตรา 9", "9", "ทำลาย", "แก้ไข", "ลบไฟล์", "เปลี่ยนแปลงข้อมูล"],
        keywords_penalty: ["5 ปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["version history", "ประวัติเวอร์ชัน", "กู้คืน", "restore", "ถังขยะ", "recycle bin", "activity log"],
        keywords_security: ["read-only", "อ่านอย่างเดียว", "จำกัดสิทธิ์", "permission", "แชร์เฉพาะอีเมล", "backup", "สำรองข้อมูล"]
    },
    6: {
        title: "ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบโรงเรียน",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 10 (รบกวน ขัดขวาง หรือทำให้ระบบคอมพิวเตอร์ของผู้อื่นไม่สามารถทำงานตามปกติได้)",
        penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "บล็อก IP Address ที่ยิงทราฟฟิกขยะ, สลับเส้นทางเครือข่ายไปยังเซิร์ฟเวอร์สำรอง, แจ้งฝ่ายไอทีและครูคุมสอบ",
        prevention: "ติดตั้งกำแพงไฟร์วอลล์ (Firewall / WAF), ใช้ระบบป้องกัน DDoS (เช่น Cloudflare DDoS Protection / Rate Limiting)",
        keywords_law: ["มาตรา 10", "10", "ขัดขวาง", "รบกวน", "ระงับการทำงาน", "พังระบบ", "ddos"],
        keywords_penalty: ["5 ปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["บล็อก ip", "block ip", "สลับเซิร์ฟเวอร์", "แจ้งไอที", "แจ้งครู", "รีสตาร์ท"],
        keywords_security: ["firewall", "ไฟร์วอลล์", "ddos protection", "cloudflare", "waf", "rate limit", "load balancer"]
    },
    7: {
        title: "ส่งอีเมลสแปมขายของปลอมตัวตน",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคหนึ่ง (ส่งข้อมูลคอมพิวเตอร์หรืออีเมลโดยปกปิดหรือปลอมแปลงแหล่งที่มา)",
        penalty: "ปรับไม่เกิน 100,000 บาท (โทษปรับทางปกครอง/อาญา)",
        remedy: "ทำเครื่องหมายเป็นเมลขยะ (Mark as Spam/Junk), ดึงโค้ด Header ส่งรายงานผู้ให้บริการอีเมลแบนผู้ส่ง",
        prevention: "ติดตั้งระบบกรองเมลขยะและบล็อกผู้ส่งปลอม (Anti-Spam Filter Engine / SPF / DKIM / DMARC verification)",
        keywords_law: ["มาตรา 11", "11", "วรรคหนึ่ง", "สแปม", "ปกปิดแหล่งที่มา", "ปลอมแปลง"],
        keywords_penalty: ["100,000", "หนึ่งแสน", "100000", "ปรับไม่เกิน 1 แสน", "ปรับ"],
        keywords_remedy: ["spam", "junk", "เมลขยะ", "รายงาน", "report", "แบน", "บล็อกผู้ส่ง"],
        keywords_security: ["anti-spam", "กรองเมลขยะ", "filter", "spf", "dkim", "dmarc", "บล็อกผู้ส่งปลอม"]
    },
    8: {
        title: "บอทสแปมรัวๆ ปิดปุ่มยกเลิกรับข่าวสาร",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคสอง (ส่งข้อมูลหรือจดหมายอิเล็กทรอนิกส์รบกวน โดยไม่เปิดโอกาสให้บอกเลิกได้โดยง่าย)",
        penalty: "ปรับไม่เกิน 200,000 บาท",
        remedy: "แคปรูปหลักฐานข้อความสแปม, ส่งเรื่องร้องเรียนไปยังผู้ให้บริการแพลตฟอร์มระงับบัญชีผู้ส่ง",
        prevention: "ไม่โพสต์อีเมลหรือเบอร์โทรส่วนตัวบนเว็บบอร์ดสาธารณะ, ใช้บริการ Email Alias หรือ Privacy Forwarding",
        keywords_law: ["มาตรา 11", "11", "วรรคสอง", "ไม่เปิดโอกาส", "ยกเลิก", "unsubscribe", "รบกวน"],
        keywords_penalty: ["200,000", "สองแสน", "200000", "ปรับไม่เกิน 2 แสน", "ปรับ"],
        keywords_remedy: ["แคปรูป", "ร้องเรียน", "แจ้งแพลตฟอร์ม", "บล็อก", "report"],
        keywords_security: ["ไม่แปะเบอร์", "ไม่แปะเมล", "บอร์ดสาธารณะ", "email alias", "ความเป็นส่วนตัว", "privacy"]
    },
    9: {
        title: "สร้างเว็บฟิชชิ่งหลอกสกินเกมฟรี",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(1) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลคอมพิวเตอร์ปลอมหรือข้อมูลอันเป็นเท็จหลอกลวงประชาชน)",
        penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "รีบแจ้งค่ายเกมระงับบัญชีชั่วคราว, ดำเนินการยื่นหลักฐานขอกู้คืนสิทธิ์บัญชีเกม, เตือนเพื่อนในกลุ่ม",
        prevention: "ตรวจสอบ URL และ Domain Name เว็บทางการอย่างละเอียด, หลีกเลี่ยงการคลิกลิงก์หลอกลวงจากโพสต์โฆษณา",
        keywords_law: ["มาตรา 14(1)", "14 (1)", "14(1)", "ข้อมูลเท็จ", "หลอกลวง", "ฟิชชิ่ง", "phishing"],
        keywords_penalty: ["5 ปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["แจ้งค่ายเกม", "ระงับบัญชี", "กู้คืน", "เปลี่ยนรหัส", "เตือนเพื่อน"],
        keywords_security: ["ตรวจ url", "domain", "โดเมน", "ลิงก์ปลอม", "ไม่คลิกลิงก์", "เว็บทางการ", "official"]
    },
    10: {
        title: "โพสต์ข่าวลวงภัยพิบัติจนคนแตกตื่นวิ่งวุ่น",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(2) (นำเข้าข้อมูลคอมพิวเตอร์อันเป็นเท็จ ก่อให้เกิดความตื่นตระหนกแก่ประชาชน)",
        penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "ลบโพสต์ข่าวปลอมทิ้งทันที, โพสต์ชี้แจงแก้ไขข้อมูลจริงพร้อมแนบลิงก์ทางการจากศูนย์ข่าว",
        prevention: "ตรวจสอบข้อมูลผ่านศูนย์ต่อต้านข่าวปลอม (Anti-Fake News Center) หรือแหล่งข่าวทางการที่เชื่อถือได้ก่อนแชร์",
        keywords_law: ["มาตรา 14(2)", "14 (2)", "14(2)", "ตื่นตระหนก", "ข่าวปลอม", "fake news", "ข้อมูลเท็จ"],
        keywords_penalty: ["5 ปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบโพสต์", "ลบข่าวปลอม", "แถลงแก้ข่าว", "โพสต์แก้", "ชี้แจง"],
        keywords_security: ["ศูนย์ต่อต้านข่าวปลอม", "anti-fake news", "เช็กก่อนแชร์", "แหล่งข่าวทางการ", "verified"]
    },
    11: {
        title: "โพสต์ภาพ/คลิปโป๊ลงคอมพิวเตอร์สาธารณะ",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(4) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลคอมพิวเตอร์ใดๆ ที่มีลักษณะอันลามก และประชาชนทั่วไปอาจเข้าถึงได้)",
        penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        remedy: "แอดมินลบภาพ/คลิปต้องห้ามออกจากระบบกลุ่มทันที, บล็อกและรายงานบัญชีผู้ส่ง, เก็บ Log ไว้เป็นหลักฐาน",
        prevention: "เปิดใช้งานตัวกรองสื่อปลอดภัย (SafeSearch / Content Moderation AI Filter), ตั้งค่าความเป็นส่วนตัวในกลุ่ม",
        keywords_law: ["มาตรา 14(4)", "14 (4)", "14(4)", "ลามก", "อนาจาร", "คลิปโป๊", "18+"],
        keywords_penalty: ["5 ปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบคลิป", "ลบวิดีโอ", "ลบภาพ", "แอดมินลบ", "บล็อก", "report", "รายงาน"],
        keywords_security: ["safesearch", "safe search", "content filter", "ตัวกรอง", "กรองเนื้อหา", "moderation"]
    },
    12: {
        title: "ตัดต่อหน้าเพื่อนใส่เอเลี่ยนประจานในโซเชียล",
        law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 16 (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งภาพที่เกิดจากการตัดต่อ ดัดแปลง ทำให้ผู้อื่นเสียชื่อเสียง ถูกดูหมิ่น หรืออับอาย)",
        penalty: "จำคุกไม่เกิน 3 ปี และปรับไม่เกิน 200,000 บาท",
        remedy: "แคปเจอร์รูปภาพและ URL หลักฐาน, ส่งคำร้องขอให้แพลตฟอร์มลบภาพ (Report Cyberbullying), แจ้งครูและผู้ปกครอง",
        prevention: "ตั้งค่าความเป็นส่วนตัวบัญชีโซเชียล (Private Account), จำกัดการมองเห็นและแท็กรูปภาพ, ส่งเสริมจริยธรรมออนไลน์",
        keywords_law: ["มาตรา 16", "16", "ตัดต่อ", "ดัดแปลง", "เสียชื่อเสียง", "ดูหมิ่น", "อับอาย"],
        keywords_penalty: ["3 ปี", "200,000", "สองแสน", "200000", "แสนบาท", "และปรับ"],
        keywords_remedy: ["แคปรูป", "แคปหลักฐาน", "แจ้งลบ", "report", "cyberbullying", "แจ้งครู", "แจ้งผู้ปกครอง"],
        keywords_security: ["private account", "ตั้งค่าส่วนตัว", "จำกัดแท็ก", "ไม่แชร์รูปสาธารณะ", "จริยธรรม"]
    }
};

// Helper function to detect gibberish, keyboard mashing, or evasive non-answers
function isGibberishOrNonsense(text) {
    if (!text || typeof text !== 'string') return true;
    const clean = text.trim().toLowerCase();
    if (clean.length < 10) return true;

    // Evasive / troll phrases
    const evasivePatterns = [
        /^(ไม่รู้|ไม่ทราบ|ไม่บอก|มั่ว|กวน|ขี้เกียจ|ไม่มี|ไม่แน่ใจ|ไม่รู้อะไรเลย|ช่างมัน|ไม่ตอบ)/i,
        /^(ไม่รู้พี่|ไม่รู้อะ|ไม่รู้ครับ|ไม่รู้ค่ะ)/i,
        /^(5555+|hahaha+|www+|กวน|บ้า|ตลก)/i
    ];
    for (const p of evasivePatterns) {
        if (p.test(clean)) return true;
    }

    // Keyboard mashing / repeated consonant clusters (Thai & English)
    const mashPatterns = [
        /(ฟกห|กฟห|หฟก|กหฟ|กดห|ดฟก|ผปอ|ปผอ|่าส|าสด|กดฟ)/i,
        /(asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm|qwer|wert|erty|rtyu|tyui|yuio|uiop)/i,
        /(.)\1{4,}/, // Repeated same character 5+ times (e.g. aaaaa, กกกกก)
    ];
    for (const p of mashPatterns) {
        if (p.test(clean)) return true;
    }

    // Unique character diversity check
    const uniqueChars = new Set(clean.replace(/\s+/g, '')).size;
    if (clean.length >= 20 && uniqueChars <= 6) return true;

    return false;
}

// Fallback Heuristic Evaluator for offline / no-key mode
function evaluateLocally(caseId, studentAnswers) {
    const ref = CASE_REFERENCES[caseId] || CASE_REFERENCES[1];
    const legalText = (studentAnswers.legal || '').trim();
    const remedyText = (studentAnswers.remedy || '').trim();
    const securityText = (studentAnswers.security || '').trim();

    const legalIsGibberish = isGibberishOrNonsense(legalText);
    const remedyIsGibberish = isGibberishOrNonsense(remedyText);
    const securityIsGibberish = isGibberishOrNonsense(securityText);

    // 1. Legal Scoring (Max 10)
    let legalScore = 0;
    let legalFeedback = '';
    if (legalIsGibberish) {
        legalScore = 0;
        legalFeedback = `ยังไม่สามารถให้คะแนนได้ เนื่องจากข้อความที่ส่งมาไม่ได้วิเคราะห์พฤติการณ์ความผิดทางไซเบอร์ ขอให้นักสืบย้อนกลับไปดูเหตุการณ์ในการ์ตูนว่า ผู้ก่อเหตุได้ละเมิดสิทธิ ลักลอบเข้าถึง ดักรับ หรือทำลายข้อมูลระบบของผู้อื่นอย่างไร แล้วเชื่อมโยงกับฐานความผิดและโทษทางกฎหมายให้ตรงประเด็น`;
    } else {
        const lLower = legalText.toLowerCase();
        const hasLawMatch = ref.keywords_law.some(k => lLower.includes(k.toLowerCase()));
        const hasPenaltyMatch = ref.keywords_penalty.some(k => lLower.includes(k.toLowerCase()));
        
        if (hasLawMatch) legalScore += 4;
        else if (lLower.includes("พ.ร.บ") || lLower.includes("มาตรา") || lLower.includes("pdpa")) legalScore += 2;
        
        if (hasPenaltyMatch) legalScore += 3;
        else if (lLower.includes("คุก") || lLower.includes("ปรับ") || lLower.includes("ปี") || lLower.includes("บาท")) legalScore += 1.5;
        
        if (hasLawMatch && (legalText.length >= 35)) legalScore += 3;
        else if (hasLawMatch || hasPenaltyMatch) legalScore += 1.5;

        legalScore = Math.min(10, Math.max(0, legalScore));
        legalFeedback = hasLawMatch && hasPenaltyMatch
            ? `วิเคราะห์ฐานความผิดทางกฎหมายและประเมินระดับอัตราโทษได้อย่างแม่นยำ สมเหตุสมผล ครบถ้วนตามพฤติการณ์ของคดี`
            : hasLawMatch
            ? `วิเคราะห์ทิศทางฐานความผิดได้ถูกต้องแล้ว แต่ยังขาดการระบุระดับอัตราโทษ (จำคุก/ปรับ) ที่สะท้อนความร้ายแรงของพฤติการณ์ในคดีนี้ให้ครบถ้วน`
            : `ฐานความผิดที่ระบุยังไม่สอดคล้องกับพฤติการณ์ในคดีนี้ ลองพิจารณาว่าเหตุการณ์นี้เป็นการกระทำต่อตัวระบบ ข้อมูล หรือเป็นการดักรับ/หลอกลวง เพื่อเลือกฐานความผิดให้ตรงจุดยิ่งขึ้น`;
    }

    // 2. Remedy Scoring (Max 10)
    let remedyScore = 0;
    let remedyFeedback = '';
    if (remedyIsGibberish) {
        remedyScore = 0;
        remedyFeedback = `ยังไม่สามารถให้คะแนนได้ เนื่องจากไม่ได้ระบุขั้นตอนการระงับเหตุเฉพาะหน้า เมื่อเกิดเหตุฉุกเฉินทางไซเบอร์ ลำดับแรกต้องพิจารณาวิธีตัดวงจรความเสียหายทันที และระบุผู้มีอำนาจหรือหน่วยงานที่จะเข้ามาระงับเหตุได้จริง`;
    } else {
        const rLower = remedyText.toLowerCase();
        const hasRemedyAction = ref.keywords_remedy.some(k => rLower.includes(k.toLowerCase()));
        const mentionsStakeholder = ["ครู", "ผู้ปกครอง", "พ่อ", "แม่", "ตำรวจ", "แอดมิน", "แพลตฟอร์ม", "ธนาคาร", "ค่ายเกม"].some(s => rLower.includes(s));

        if (hasRemedyAction) remedyScore += 5;
        else if (rLower.includes("ลบ") || rLower.includes("เปลี่ยน") || rLower.includes("แจ้ง") || rLower.includes("บล็อก")) remedyScore += 2.5;

        if (mentionsStakeholder) remedyScore += 3;
        else if (rLower.includes("บอก") || rLower.includes("ช่วย")) remedyScore += 1.5;

        if (hasRemedyAction && remedyText.length >= 35) remedyScore += 2;
        else if (hasRemedyAction || mentionsStakeholder) remedyScore += 1;

        remedyScore = Math.min(10, Math.max(0, remedyScore));
        remedyFeedback = hasRemedyAction
            ? `ลำดับขั้นตอนการบรรเทาความเสียหายเฉพาะหน้าได้อย่างรวดเร็ว มีสติ และระบุผู้เกี่ยวข้องในการระงับเหตุได้อย่างตรงจุด`
            : `มีแนวคิดการหยุดเหตุเฉพาะหน้าได้ดีแล้ว แต่ควรระบุบุคคลหรือผู้ดูแลระบบที่ต้องประสานงานแจ้งเหตุฉุกเฉินเพิ่มเติม เพื่อให้การช่วยเหลือเกิดขึ้นได้อย่างรวดเร็ว`;
    }

    // 3. Security Scoring (Max 10)
    let securityScore = 0;
    let securityFeedback = '';
    if (securityIsGibberish) {
        securityScore = 0;
        securityFeedback = `ยังไม่สามารถให้คะแนนได้ เนื่องจากยังไม่ได้เสนอแนะระบบหรือเครื่องมือความปลอดภัยทางเทคนิค ลองวิเคราะห์ว่าช่องโหว่ความเสี่ยงในคดีนี้เกิดจากจุดใด แล้วเสนอเทคนิคหรือระบบความปลอดภัยที่จะช่วยปิดช่องโหว่นั้นในระยะยาว`;
    } else {
        const sLower = securityText.toLowerCase();
        const hasSecurityTool = ref.keywords_security.some(k => sLower.includes(k.toLowerCase()));
        
        if (hasSecurityTool) securityScore += 5;
        else if (sLower.includes("รหัส") || sLower.includes("ระบบ") || sLower.includes("ป้องกัน") || sLower.includes("ตั้งค่า")) securityScore += 2.5;

        if (hasSecurityTool && sLower.length >= 35) securityScore += 3;
        else if (hasSecurityTool) securityScore += 1.5;

        if (hasSecurityTool && (sLower.includes("ทำได้") || sLower.includes("ง่าย") || sLower.includes("ตั้ง") || sLower.includes("เปิด"))) securityScore += 2;
        else if (hasSecurityTool) securityScore += 1;

        securityScore = Math.min(10, Math.max(0, securityScore));
        securityFeedback = hasSecurityTool
            ? `ข้อเสนอแนะด้านวิศวกรรมความปลอดภัยยอดเยี่ยม! เครื่องมือและมาตรการที่เลือกใช้สามารถปิดช่องโหว่ความเสี่ยงของคดีนี้ได้อย่างสมบูรณ์แบบ`
            : `ข้อเสนอแนะด้านความปลอดภัยสามารถเพิ่มความรัดกุมได้อีก โดยระบุฟังก์ชันหรือเครื่องมือทางเทคโนโลยีที่ใช้ป้องกันช่องโหว่ของเหตุการณ์นี้โดยเฉพาะ`;
    }

    const totalScore = legalScore + remedyScore + securityScore;
    let overallSummary = totalScore >= 24
        ? `สุดยอดผลงานนักสืบไซเบอร์ระดับ Cyber Master! ทีมของคุณมีความรู้ด้านกฎหมาย การรับมือเหตุ และการวางระบบความปลอดภัยอย่างน่าทึ่ง`
        : totalScore >= 15
        ? `ทำผลงานได้ดีระดับ Senior Detective! มีความเข้าใจหลักการเป็นอย่างดี พัฒนาอีกนิดจะกลายเป็นยอดสายสืบมือหนึ่งแน่นอน`
        : totalScore > 0
        ? `ขอเป็นกำลังใจให้นักสืบฝึกหัด! การวิเคราะห์มีจุดเริ่มต้นที่ดี ลองศึกษาพฤติการณ์และเครื่องมือป้องกันเพิ่มเติมเพื่อคะแนนที่สูงขึ้นในคดีถัดไป`
        : `ตรวจพบข้อความที่ไม่สามารถประเมินผลได้ (ข้อความสุ่ม/มั่ว/ไม่ตอบ) โปรดอ่านรายละเอียดคำร้องทุกข์และการ์ตูน 9 ช่อง แล้วพิมพ์วิเคราะห์เนื้อหาจริงเพื่อรับคะแนนสะสม`;

    return {
        legal: { score: legalScore, feedback: legalFeedback },
        remedy: { score: remedyScore, feedback: remedyFeedback },
        security: { score: securityScore, feedback: securityFeedback },
        total_score: totalScore,
        overall_summary: overallSummary,
        mode: "heuristic"
    };
}

// Explicit Static File Route for cases_data.js (Guarantees HTTP 200 on Vercel)
app.get('/cases_data.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(path.join(__dirname, 'cases_data.js'));
});

// Explicit Static Route for Assets (Guarantees HTTP 200 on Vercel)
app.get('/assets/*', (req, res) => {
    const assetPath = path.join(__dirname, req.path);
    res.sendFile(assetPath, (err) => {
        if (err) res.status(404).send('Asset not found');
    });
});

// Secure API Endpoint: Expose Public Supabase Environment Variables to Frontend
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        hasServerGeminiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY)
    });
});

// Secure API Endpoint: Verify Teacher Passcode Server-side
app.post('/api/verify-passcode', (req, res) => {
    const { passcode } = req.body || {};
    const validPasscodes = ['admin123', 'teacher123'];
    if (process.env.TEACHER_PASSCODE) {
        validPasscodes.push(process.env.TEACHER_PASSCODE);
    }
    const isValid = passcode && validPasscodes.includes(passcode.trim());
    res.json({ success: isValid });
});

// Secure API Endpoint: Test Gemini API Key
app.post('/api/test-gemini-key', async (req, res) => {
    const apiKey = (req.body && req.body.apiKey) || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
    if (!apiKey) {
        return res.status(400).json({ success: false, message: 'ไม่พบ Gemini API Key กรุณาระบุคีย์' });
    }

    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let lastError = null;

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Ping test. Reply with: OK' }] }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'OK';
                return res.json({ success: true, message: `เชื่อมต่อ Google Gemini API สำเร็จสมบูรณ์! (โมเดล: ${model})`, reply: text.trim(), model });
            } else {
                const errData = await response.json().catch(() => ({}));
                lastError = errData.error?.message || `Status ${response.status}`;
            }
        } catch (err) {
            lastError = err.message;
        }
    }

    res.status(400).json({ success: false, message: 'การเชื่อมต่อผิดพลาด: ' + (lastError || 'ไม่สามารถเรียกใช้งาน Gemini API ได้') });
});

// Primary Endpoint: Evaluate Subjective Case Answers via Google Gemini AI
app.post('/api/evaluate-case', async (req, res) => {
    const { playerId, teamName, membersInfo, caseId, caseTitle, studentAnswers, apiKey: clientApiKey } = req.body || {};
    
    if (!caseId || !studentAnswers) {
        return res.status(400).json({ success: false, message: 'ข้อมูลคำตอบหรือคดีไม่ครบถ้วน' });
    }

    const ref = CASE_REFERENCES[caseId] || CASE_REFERENCES[1];
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

    // If no API key is provided, execute Smart Heuristic Evaluator
    if (!apiKey) {
        const heuristicResult = evaluateLocally(caseId, studentAnswers);
        
        // Record to Supabase if configured
        saveToSupabase({
            playerId,
            teamName,
            membersInfo,
            caseId,
            caseTitle: caseTitle || ref.title,
            studentAnswers,
            evaluation: heuristicResult
        });

        return res.json({ success: true, evaluation: heuristicResult, mode: 'heuristic' });
    }

    // Call Google Gemini API with STRICT grading prompt and NO-SPOILER rule
    const systemPrompt = `You are the "Cyber Law and PDPA Strict Academic Evaluator" for Thai Grade 9 (ม.3) students.
Your mission is to strictly, fairly, and accurately evaluate the subjective text answers submitted by the student team based on the provided Case Scenario.

---
[CASE SCENARIO REFERENCE DATA (FOR YOUR EVALUATION ONLY - DO NOT LEAK OR SPOIL TO STUDENTS)]
- Case Title: ${caseTitle || ref.title}
- Relevant Cyber Law: ${ref.law}
- Standard Penalty/Fine: ${ref.penalty}
- Standard Immediate Remedy: ${ref.remedy}
- Standard Correct Prevention Measures: ${ref.prevention}

---
[CRITICAL NO-SPOILER & ZERO-TOLERANCE RULES - READ CAREFULLY]
1. ZERO-SCORE FOR GIBBERISH / KEYBOARD MASHING / TROLLING / "ไม่รู้" / RANDOM TYPING:
   - If an answer consists of keyboard mashing (e.g. "ฟกหฟกห", "asdfasdf", "55555"), sarcasm, trolling, "ไม่รู้", "ไม่ทราบ", "ไม่บอก", "ไม่รู้พี่ไฟก...", repeating useless characters, or random Thai consonants without actual analysis:
     -> YOU MUST SCORE EXACTLY 0 POINTS (ZERO) for that role/section!
     -> DO NOT give pity points. Text length does NOT grant points if the content is meaningless or troll typing!
2. STRICT NO-SPOILER RULE IN ALL FEEDBACK:
   - NEVER SPOIL, state directly, or reveal the exact section number or exact answer (e.g. DO NOT say "ข้อที่ถูกคือ มาตรา 8" or "อัตราโทษที่ถูกต้องคือ..." or "แนวทางที่ถูกต้องคือ...").
   - INSTEAD: Explain HOW and WHY the student's answer is flawed, which concepts they misunderstood, and guide their thinking without giving away the exact section number:
     * For Legal (0 points / wrong): Explain what wrongful behavior occurred in the comic scenario (e.g. unauthorized data interception vs unauthorized access vs data damage vs defamation) and why their answer fails to address the specific violation and penalties, guiding them to rethink the core violation without spoon-feeding the section number.
     * For Remedy (0 points / wrong): Explain the principle of emergency containment, why immediate action is critical to stop damage, and who should be contacted.
     * For Security (0 points / wrong): Explain the root vulnerability in the system/environment and what security engineering principles are needed to prevent recurring exploits.

---
[DETAILED SCORING RUBRICS (Max 10 points per role, Total 30 points)]

1. 👨‍⚖️ Legal Analyst Evaluation (0 to 10 points):
   - Law/Act identification (Max 4 points): Must correctly name the specific Cyber Law concept/section or PDPA. Give 0 points if wrong or gibberish.
   - Penalty accuracy (Max 3 points): Correctly specifies jail term and fine. Give 0 points if omitted, wrong, or gibberish.
   - Reason & Damage analysis (Max 3 points): Explains who suffered damage and why the behavior is unlawful. Give 0 points if missing or gibberish.

2. 🚑 Incident Responder Evaluation (0 to 10 points):
   - Immediate mitigation action (Max 5 points): Concrete steps to stop immediate damage. Give 0 points if gibberish or dangerous advice.
   - Stakeholder notification (Max 3 points): States who to notify (e.g. teacher, parents, cyber police, platform admin, bank). Give 0 points if missing or gibberish.
   - Logical realistic execution (Max 2 points): Step-by-step calm procedure for Grade 9 students.

3. 🛡️ Security Engineer Evaluation (0 to 10 points):
   - Proper technical prevention tool (Max 5 points): Identifies the exact IT security tool matching the case loophole. Give 0 points if no IT tool or gibberish.
   - Anti-hacker reasoning (Max 3 points): Explains how this tool technically stops future exploits.
   - Real-world feasibility for Grade 9 (Max 2 points): Realistic setting accessible to youth.

---
[OUTPUT FORMAT REQUIREMENT]
You MUST reply strictly in JSON format. Do not write any markdown backticks outside the JSON block. Format:
{
  "legal": {
    "score": <integer from 0 to 10>,
    "feedback": "<educational feedback in Thai explaining why and how the answer is flawed or praised, WITHOUT giving away exact section numbers or cheat answers>"
  },
  "remedy": {
    "score": <integer from 0 to 10>,
    "feedback": "<educational feedback in Thai guiding emergency containment concepts without spoilers>"
  },
  "security": {
    "score": <integer from 0 to 10>,
    "feedback": "<educational feedback in Thai guiding security engineering principles without spoilers>"
  },
  "total_score": <integer from 0 to 30>,
  "overall_summary": "<inspiring and constructive summary in Thai suitable for Grade 9 students>"
}`;

    const userPrompt = `Student Submissions for Case "${caseTitle || ref.title}":
- 👨‍⚖️ Legal Analyst Answer: "${studentAnswers.legal || ''}"
- 🚑 Incident Responder Answer: "${studentAnswers.remedy || ''}"
- 🛡️ Security Engineer Answer: "${studentAnswers.security || ''}"`;

    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let aiEvaluation = null;
    let usedModel = null;

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                    generationConfig: {
                        responseMimeType: 'application/json',
                        temperature: 0.1
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                aiEvaluation = JSON.parse(rawText);
                usedModel = model;
                break;
            }
        } catch (err) {
            console.warn(`Attempt with ${model} failed:`, err.message);
        }
    }

    if (aiEvaluation) {
        const total = (Number(aiEvaluation.legal?.score) || 0) + 
                      (Number(aiEvaluation.remedy?.score) || 0) + 
                      (Number(aiEvaluation.security?.score) || 0);
        aiEvaluation.total_score = total;

        saveToSupabase({
            playerId,
            teamName,
            membersInfo,
            caseId,
            caseTitle: caseTitle || ref.title,
            studentAnswers,
            evaluation: aiEvaluation
        });

        return res.json({ success: true, evaluation: aiEvaluation, mode: 'gemini', model: usedModel });
    }

    // Fallback if all Gemini models failed
    const fallbackResult = evaluateLocally(caseId, studentAnswers);
    saveToSupabase({
        playerId,
        teamName,
        membersInfo,
        caseId,
        caseTitle: caseTitle || ref.title,
        studentAnswers,
        evaluation: fallbackResult
    });

    res.json({ success: true, evaluation: fallbackResult, mode: 'fallback_heuristic' });
});

// Helper function to save game score to Supabase
async function saveToSupabase(record) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return;
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        
        const row = {
            player_id: record.playerId || 'anonymous',
            team_name: record.teamName || 'นักสืบเยาวชน',
            case_id: record.caseId,
            case_title: record.caseTitle,
            legal_score: record.evaluation.legal?.score || 0,
            remedy_score: record.evaluation.remedy?.score || 0,
            security_score: record.evaluation.security?.score || 0,
            total_score: record.evaluation.total_score || 0,
            student_answers: record.studentAnswers,
            ai_feedback: record.evaluation,
            created_at: new Date().toISOString()
        };

        if (record.membersInfo) {
            row.members_info = record.membersInfo;
        }

        await supabase.from('game_scores').insert([row]);
    } catch (e) {
        console.error('Failed to log score to Supabase:', e.message);
    }
}

// Secure API Endpoint: Leaderboard Data
app.get('/api/leaderboard', async (req, res) => {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
        return res.json({ success: true, data: [] });
    }
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('game_scores')
            .select('*')
            .order('total_score', { ascending: false })
            .limit(20);
        if (error) throw error;
        res.json({ success: true, data: data || [] });
    } catch (e) {
        res.json({ success: false, data: [], error: e.message });
    }
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Page Routes (Clean URLs)
app.get('/shield_detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});
app.get('/cyber_shield_detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});

app.get('/detective_v4', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});
app.get('/cyber_detective_v4', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});

app.get('/detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_detective.html'));
});
app.get('/cyber_detective', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_detective.html'));
});

app.get('/defense', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_defense_city.html'));
});

app.get('/survivor', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_survivor_game.html'));
});

app.get('/shield_teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_teacher.html'));
});
app.get('/cyber_shield_teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_teacher.html'));
});
app.get('/teacher_v4', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_teacher.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, 'cyber_shield_teacher.html'));
});
app.get('/teacher_dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'teacher_dashboard.html'));
});

app.get('/presentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'presentation.html'));
});

app.get('/cases', (req, res) => {
    res.sendFile(path.join(__dirname, 'cases_reference.html'));
});
app.get('/cases_reference', (req, res) => {
    res.sendFile(path.join(__dirname, 'cases_reference.html'));
});

// Root Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Default Fallback Route for Single Page Apps & Clean URLs
app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        return res.sendFile(path.join(__dirname, req.path), (err) => {
            if (err) res.status(404).send('File not found');
        });
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen locally (Exported for Vercel Serverless Function)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running cleanly using .env settings at http://localhost:${PORT}`);
    });
}

module.exports = app;
