
function normalizeStudentSlang(text) {
    if (!text) return '';
    let t = text.toLowerCase().trim();

    // Fix Thai double sara-e ('เเ') typing mistake to sara-ae ('แ') and sara-oo 'ผู้'
    t = t.replace(/เเ/g, 'แ').replace(/ผู้/g, 'ผู้');

    const slangMap = [
        [/(แคปรูป|แคปหน้าจอ|แคปหลักฐาน|ถ่ายรูปเก็บไว้|แคปภาพ|แคปไว้|เซฟรูป|แคปสกรีน)/g, 'แคปเจอร์หลักฐาน'],
        [/(ฟ้องครู|บอกครู|ทักหาครู|ถามครู|แจ้งครูผู้สอน|บอกครูผู้สอน|ให้ครูช่วย)/g, 'แจ้งครู'],
        [/(บอกพ่อแม่|บอกผู้ปกครอง|ฟ้องพ่อแม่|บอกผู้ปกครองทราบ|แจ้งพ่อแม่|ให้พ่อแม่ช่วย)/g, 'แจ้งผู้ปกครอง'],
        [/(ทักแชท|ทักไปบอก|เตือนเพื่อน|บอกเพื่อน|ทักบอกเพื่อน)/g, 'แจ้งผู้เกี่ยวข้อง'],
        [/(รีพอร์ต|กดรีพอร์ต|ฟ้องระบบ|กดรายงาน|ฟ้องแอดมิน|รายงานผู้ส่ง|รายงานโพสต์)/g, 'รายงาน'],
        [/(สแกนหน้า|สแกนใบหน้า)/g, 'face id'],
        [/(สแกนนิ้ว|สแกนลายนิ้วมือ)/g, 'touch id'],
        [/(ล็อกออก|ออกระบบ|เด้งออก|ล๊อกเอาท์|ล๊อกออก)/g, 'logout'],
        [/(กู้งาน|กดกู้|ดึงงานกลับ|ดึงไฟล์กลับ|เอาสไลด์คืน|กู้ไฟล์|กู้คืนไฟล์|ดึงไฟล์)/g, 'ประวัติเวอร์ชัน'],
        [/(ยิงเว็บ|ยิงเซิร์ฟ|ยิงดิส|ยิงระบบ)/g, 'ddos'],
        [/(พาสเวิร์ด|พาสเวิด|พาส|password)/g, 'รหัสผ่าน'],
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
        [/(เอสเอสแอล|ssl)/g, 'ssl'],
        [/(เฉพาะฉันแก้ไขได้|จำกัดการแก้ไข|ดูได้อย่างเดียว|ไม่ให้คนนอกแก้ไข|ตั้งไม่ให้แก้ไข)/g, 'read-only'],
        [/(เสพข่าวอย่างมีสติ|ดูว่าจริงหรือไม่|เช็กแหล่งข่าว)/g, 'เช็กก่อนแชร์'],
        [/(ล็อกโปรไฟล์|จำกัดผู้เข้าชม|ปิดการดาวน์โหลด)/g, 'private account']
    ];

    for (const [regex, replacement] of slangMap) {
        t = t.replace(regex, replacement);
    }
    return t;
}

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
    "1": {
        "title": "แอบส่องระบบไอดีเกมของเพื่อน",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 5 (แอบเข้าถึงระบบคอมพิวเตอร์ผู้อื่นโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "สั่ง Log out ออกจากระบบทุกเครื่องทันที และรีบเปลี่ยนรหัสผ่านใหม่",
        "prevention": "เปิดใช้งานระบบยืนยันตัวตน 2 ชั้น (2FA / OTP) และล็อกหน้าจอทุกครั้ง",
        "keywords_law": [
            "มาตรา 5",
            "5",
            "เข้าระบบ",
            "มิชอบ",
            "แอบเข้า",
            "เข้าถึงระบบ",
            "แอบส่อง",
            "แอบล็อกอิน",
            "เข้าเครื่อง",
            "ไม่ได้รับอนุญาต",
            "แอบใช้",
            "บุกรุกระบบ",
            "แอบจำรหัส",
            "ปลดล็อก",
            "เข้าถึงคอมพิวเตอร์",
            "แอบเปิด"
        ],
        "keywords_penalty": [
            "6 เดือน",
            "หกเดือน",
            "10,000",
            "หนึ่งหมื่น",
            "10000",
            "หมื่นบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 6"
        ],
        "keywords_remedy": [
            "logout",
            "log out",
            "ออกจากระบบ",
            "เปลี่ยนรหัส",
            "เปลี่ยนพาส",
            "แจ้งครู",
            "แจ้งผู้ปกครอง",
            "รายงาน",
            "แจ้งตำรวจ",
            "ล็อกเอาต์",
            "ล็อกออก",
            "ตัดการเข้าถึง",
            "เปลี่ยน password",
            "reset password",
            "แจ้งเจ้าของ",
            "บอกเจ้าของ",
            "มีสติ"
        ],
        "keywords_security": [
            "2fa",
            "two-factor",
            "otp",
            "ล็อกอิน 2 ชั้น",
            "สองชั้น",
            "2 ชั้น",
            "ล็อกหน้าจอ",
            "ยืนยันตัวตน",
            "พกติดตัว",
            "ตั้งรหัส",
            "ล็อกเครื่อง",
            "pin",
            "รหัสผ่านที่ซับซ้อน",
            "ไม่บอกรหัส",
            "ไม่แชร์รหัส",
            "ไม่วางเครื่องทิ้งไว้"
        ]
    },
    "2": {
        "title": "แจกรหัสผ่านระบบในกลุ่ม Discord",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 6 (เปิดเผยมาตรการป้องกันการเข้าถึงระบบโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "รีบเปลี่ยนรหัสผ่านระบบทันที และลบข้อความที่โพสต์แจกใน Discord",
        "prevention": "ตั้งรหัสผ่านซับซ้อน (ตัวพิมพ์ใหญ่+เล็ก+เลข+สัญลักษณ์) และไม่จดรหัสผ่านทิ้งไว้",
        "keywords_law": [
            "มาตรา 6",
            "6",
            "เปิดเผย",
            "มาตรการป้องกัน",
            "แจกรหัส",
            "เผยแพร่รหัส",
            "ปล่อยรหัส",
            "โพสต์รหัส",
            "ส่งรหัส",
            "แชร์รหัส",
            "แจกพาส",
            "เปิดเผยรหัสผ่าน",
            "เปิดเผยมาตรการ",
            "แอบถ่ายรหัส"
        ],
        "keywords_penalty": [
            "1 ปี",
            "หนึ่งปี",
            "20,000",
            "สองหมื่น",
            "20000",
            "หมื่น",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 1 ปี"
        ],
        "keywords_remedy": [
            "เปลี่ยนรหัส",
            "ลบข้อความ",
            "แจ้งแอดมิน",
            "discord",
            "ตัดเซสชัน",
            "บล็อก",
            "ลบโพสต์",
            "ลบรูป",
            "แจ้งครู",
            "แจ้งตำรวจ",
            "แจ้งเจ้าของระบบ",
            "แจ้งไอที",
            "ลบทันที",
            "ลบออก",
            "ทำลายหลักฐาน"
        ],
        "keywords_security": [
            "รหัสผ่านซับซ้อน",
            "ตัวพิมพ์ใหญ่",
            "ตัวเลข",
            "สัญลักษณ์",
            "ห้ามจด",
            "password manager",
            "ความลับ",
            "ไม่แปะกระดาษ",
            "ไม่แปะรหัส",
            "ไม่ถ่ายรูปรหัส",
            "ตั้งรหัสยาก",
            "เก็บบันทึกรหัส"
        ]
    },
    "3": {
        "title": "แอบคุ้ยไฟล์ไดอารี่แชทลับส่วนตัว",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 7 (เข้าถึงข้อมูลคอมพิวเตอร์ของผู้อื่นโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 40,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "ลบไฟล์ที่รั่วไหล และเปลี่ยนรหัสผ่านพื้นที่จัดเก็บคลาวด์ทันที",
        "prevention": "ตั้งรหัสล็อกโฟลเดอร์ด้วยสแกนใบหน้า/ลายนิ้วมือ (Face ID) และเข้ารหัสไฟล์ (Encryption)",
        "keywords_law": [
            "มาตรา 7",
            "7",
            "เข้าถึงข้อมูล",
            "ข้อมูลคอมพิวเตอร์",
            "ไดอารี่",
            "คุ้ยไฟล์",
            "ดูดไฟล์",
            "แอบดู",
            "แอบเปิด",
            "ข้อมูลส่วนตัว",
            "แอบดาวน์โหลด",
            "แอบคัดลอก",
            "เปิดไฟล์คนอื่น",
            "เข้าถึงไฟล์"
        ],
        "keywords_penalty": [
            "2 ปี",
            "สองปี",
            "40,000",
            "สี่หมื่น",
            "40000",
            "หมื่น",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 2 ปี"
        ],
        "keywords_remedy": [
            "ลบไฟล์",
            "เปลี่ยนรหัส",
            "แจ้งระงับ",
            "แจ้งครู",
            "แจ้งแอดมิน",
            "ลบโพสต์",
            "ลบแชท",
            "ลบรูป",
            "แจ้งตำรวจ",
            "แจ้งผู้ปกครอง",
            "ลบข้อมูล",
            "ลบออก",
            "ตัดการเชื่อมต่อ"
        ],
        "keywords_security": [
            "สแกนใบหน้า",
            "ลายนิ้วมือ",
            "face id",
            "biometrics",
            "เข้ารหัส",
            "encryption",
            "ล็อกโฟลเดอร์",
            "ตั้งค่าส่วนตัว",
            "กรองความเป็นส่วนตัว",
            "ล็อกหน้าจอ",
            "ตั้งรหัสผ่านที่รัดกุม",
            "ล็อกไดอารี่"
        ]
    },
    "4": {
        "title": "ดักจับข้อมูลธุรกรรมเติมเกมกลางทาง",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 8 (ดักรับข้อมูลคอมพิวเตอร์ของผู้อื่นที่อยู่ระหว่างการส่งโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 60,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "ตัดการเชื่อมต่อ Wi-Fi ทันที และรีบแจ้งอายัดบัตรกับธนาคารและค่ายเกม",
        "prevention": "ใช้เครือข่ายที่มีการเข้ารหัส SSL / HTTPS / VPN และหลีกเลี่ยงการทำธุรกรรมบน Free Wi-Fi สาธารณะ",
        "keywords_law": [
            "มาตรา 8",
            "8",
            "ดักรับ",
            "ดักจับ",
            "ระหว่างการส่ง",
            "ข้อมูลคอมพิวเตอร์",
            "ดักข้อมูล",
            "wifi ปลอม",
            "ดักจับข้อมูล"
        ],
        "keywords_penalty": [
            "3 ปี",
            "สามปี",
            "60,000",
            "หกหมื่น",
            "60000",
            "หมื่น",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 3 ปี"
        ],
        "keywords_remedy": [
            "ตัด wifi",
            "หยุดทำธุรกรรม",
            "อายัดบัตร",
            "แจ้งธนาคาร",
            "แจ้งค่ายเกม",
            "เปลี่ยนพาส",
            "เปลี่ยนรหัส",
            "ตัดการเชื่อมต่อ",
            "แจ้งตำรวจ",
            "แจ้งผู้ปกครอง",
            "หยุดเชื่อมต่อ"
        ],
        "keywords_security": [
            "ssl",
            "https",
            "vpn",
            "เข้ารหัสข้อมูล",
            "encryption",
            "หลีกเลี่ยง wifi ฟรี",
            "public wifi",
            "ไม่ใช้ wifi สาธารณะ",
            "ไม่เชื่อมต่อมั่ว",
            "หลีกเลี่ยง wi-fi"
        ]
    },
    "5": {
        "title": "มือบอนแอบลบไฟล์โครงงานวิทย์เพื่อน",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 9 (ทำให้เสียหาย ทำลาย แก้ไข เปลี่ยนแปลงข้อมูลคอมพิวเตอร์ผู้อื่นโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "ใช้ปุ่มประวัติเวอร์ชัน (Version History) กู้คืนไฟล์ทันที และตรวจสอบ Audit Log",
        "prevention": "ตั้งค่าสิทธิ์ไฟล์เป็น 'อ่านได้อย่างเดียว (Read-Only)' และจำกัดการแชร์เฉพาะอีเมลที่จำเป็น",
        "keywords_law": [
            "มาตรา 9",
            "9",
            "ทำลาย",
            "แก้ไข",
            "ลบไฟล์",
            "เปลี่ยนแปลงข้อมูล",
            "เสียหาย",
            "ดึงงาน"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 5 ปี"
        ],
        "keywords_remedy": [
            "version history",
            "ประวัติเวอร์ชัน",
            "กู้คืน",
            "restore",
            "ถังขยะ",
            "recycle bin",
            "activity log",
            "กู้ไฟล์",
            "แจ้งครู",
            "แจ้งตำรวจ",
            "จำกัดสิทธิ์"
        ],
        "keywords_security": [
            "read-only",
            "อ่านอย่างเดียว",
            "จำกัดสิทธิ์",
            "permission",
            "แชร์เฉพาะอีเมล",
            "backup",
            "สำรองข้อมูล",
            "กำหนดสิทธิ์",
            "ดูได้อย่างเดียว",
            "เฉพาะฉันแก้ไขได้",
            "ไม่ให้แก้ไข"
        ]
    },
    "6": {
        "title": "ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบโรงเรียน",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 10 (รบกวน ขัดขวาง ทำให้ระบบคอมพิวเตอร์ผู้อื่นทำงานไม่ได้ตามปกติ)",
        "penalty": "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "บล็อก IP Address ขยะ สลับเส้นทางเซิร์ฟเวอร์สำรอง และแจ้งฝ่ายไอที",
        "prevention": "ติดตั้งไฟร์วอลล์ (Firewall) และใช้ระบบป้องกัน DDoS Protection (เช่น Cloudflare / Rate Limiting)",
        "keywords_law": [
            "มาตรา 10",
            "10",
            "ขัดขวาง",
            "รบกวน",
            "ระงับการทำงาน",
            "พังระบบ",
            "ddos",
            "ระบบล่ม",
            "ยิงเว็บ",
            "ยิงเซิร์ฟ"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 5 ปี"
        ],
        "keywords_remedy": [
            "บล็อก ip",
            "block ip",
            "สลับเซิร์ฟเวอร์",
            "แจ้งไอที",
            "แจ้งครู",
            "รีสตาร์ท",
            "แจ้งตำรวจ",
            "ตัดการเชื่อมต่อ",
            "ระบบป้องกัน ddos",
            "เช็คที่อยู่ต้นเหตุ"
        ],
        "keywords_security": [
            "firewall",
            "ไฟร์วอลล์",
            "ddos protection",
            "cloudflare",
            "waf",
            "rate limit",
            "load balancer",
            "ป้องกัน ddos",
            "ติดตั้งระบบป้องกัน",
            "ระบบป้องกันอัตโนมัติ"
        ]
    },
    "7": {
        "title": "ส่งอีเมลสแปมขายของปลอมตัวตน",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคหนึ่ง (ส่งข้อมูลคอมพิวเตอร์หรืออีเมลโดยปกปิดหรือปลอมแปลงแหล่งที่มา)",
        "penalty": "ปรับไม่เกิน 100,000 บาท",
        "remedy": "ทำเครื่องหมายเป็นสแปม (Mark as Spam) และรายงานผู้ให้บริการอีเมล",
        "prevention": "ติดตั้งระบบกรองอีเมลขยะ (Anti-Spam Filter) และตรวจสอบ SPF/DKIM Record",
        "keywords_law": [
            "มาตรา 11",
            "11",
            "วรรคหนึ่ง",
            "สแปม",
            "ปกปิดแหล่งที่มา",
            "ปลอมแปลง",
            "อีเมลขยะ"
        ],
        "keywords_penalty": [
            "100,000",
            "หนึ่งแสน",
            "100000",
            "ปรับไม่เกิน 1 แสน",
            "ปรับ"
        ],
        "keywords_remedy": [
            "spam",
            "junk",
            "เมลขยะ",
            "รายงาน",
            "report",
            "แบน",
            "บล็อกผู้ส่ง",
            "แจ้งแอดมิน",
            "ปัดทิ้ง"
        ],
        "keywords_security": [
            "anti-spam",
            "กรองเมลขยะ",
            "filter",
            "spf",
            "dkim",
            "dmarc",
            "บล็อกผู้ส่งปลอม",
            "อัปเดตระบบ",
            "คัดกรองอีเมล"
        ]
    },
    "8": {
        "title": "บอทสแปมรัวๆ ปิดปุ่มยกเลิกรับข่าวสาร",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคสอง (ส่งข้อมูลหรือจดหมายอิเล็กทรอนิกส์รบกวน โดยไม่เปิดโอกาสให้บอกเลิกได้โดยง่าย)",
        "penalty": "ปรับไม่เกิน 200,000 บาท",
        "remedy": "แคปหลักฐานข้อความ ร้องเรียนผู้ให้บริการเครือข่าย และบล็อกเบอร์/ผู้ส่ง",
        "prevention": "ไม่กรอกเบอร์โทรหรืออีเมลในเว็บที่ไม่น่าเชื่อถือ และใช้ระบบ Email Alias",
        "keywords_law": [
            "มาตรา 11",
            "11",
            "วรรคสอง",
            "ไม่เปิดโอกาส",
            "ยกเลิก",
            "unsubscribe",
            "รบกวน",
            "เดือดร้อนรำคาญ"
        ],
        "keywords_penalty": [
            "200,000",
            "สองแสน",
            "200000",
            "ปรับไม่เกิน 2 แสน",
            "ปรับ"
        ],
        "keywords_remedy": [
            "แคปรูป",
            "แคปเจอร์หลักฐาน",
            "ร้องเรียน",
            "แจ้งแพลตฟอร์ม",
            "บล็อก",
            "report",
            "กสทช",
            "แจ้งตำรวจ",
            "แจ้งหน่วยงาน"
        ],
        "keywords_security": [
            "ไม่แปะเบอร์",
            "ไม่แปะเมล",
            "บอร์ดสาธารณะ",
            "email alias",
            "ความเป็นส่วนตัว",
            "privacy",
            "ปิดแจ้งเตือน",
            "anti-spam",
            "ปิดกั้นข้อความ"
        ]
    },
    "9": {
        "title": "สร้างเว็บฟิชชิ่งหลอกสกินเกมฟรี",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(1) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลปลอมหรือข้อมูลเท็จ หลอกลวงประชาชน)",
        "penalty": "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "รีบแจ้งทีมงานค่ายเกมเพื่อระงับและกู้คืนบัญชี และเตือนเพื่อนไม่ให้หลงเชื่อ",
        "prevention": "ตรวจสอบ URL และชื่อโดเมนให้ถูกต้องทุกครั้ง และไม่หลงเชื่อลิงก์แจกของฟรี",
        "keywords_law": [
            "มาตรา 14(1)",
            "14 (1)",
            "14(1)",
            "14",
            "ข้อมูลเท็จ",
            "หลอกลวง",
            "ฟิชชิ่ง",
            "phishing",
            "เว็บปลอม",
            "สร้างเว็บปลอม",
            "ลิขสิทธิ์"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 5 ปี"
        ],
        "keywords_remedy": [
            "แจ้งค่ายเกม",
            "ระงับบัญชี",
            "กู้คืน",
            "เปลี่ยนรหัส",
            "เตือนเพื่อน",
            "แจ้งตำรวจ",
            "แจ้งแอดมิน",
            "ระงับความเสียหาย"
        ],
        "keywords_security": [
            "ตรวจ url",
            "domain",
            "โดเมน",
            "ลิงก์ปลอม",
            "ไม่คลิกลิงก์",
            "เว็บทางการ",
            "official",
            "เช็กก่อนแชร์",
            "ผูกบัญชีกับแอป"
        ]
    },
    "10": {
        "title": "โพสต์ข่าวลวงภัยพิบัติจนคนแตกตื่นวิ่งวุ่น",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(2) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลเท็จ ก่อให้เกิดความตระหนกตกใจแก่ประชาชน)",
        "penalty": "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "ลบโพสต์ข่าวปลอมทันที และโพสต์ชี้แจงความจริงพร้อมอ้างอิงแหล่งข่าวทางการ",
        "prevention": "ตรวจสอบข้อมูลกับศูนย์ต่อต้านข่าวปลอม (Anti-Fake News Center) หรือหน่วยงานรัฐก่อนแชร์",
        "keywords_law": [
            "มาตรา 14(2)",
            "14 (2)",
            "14(2)",
            "14",
            "ตื่นตระหนก",
            "ข่าวปลอม",
            "fake news",
            "ข้อมูลเท็จ",
            "ตระหนกตกใจ"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 5 ปี"
        ],
        "keywords_remedy": [
            "ลบโพสต์",
            "ลบข่าวปลอม",
            "แถลงแก้ข่าว",
            "โพสต์แก้",
            "ชี้แจง",
            "ขอโทษ",
            "แจ้งตำรวจ",
            "แจ้งครู",
            "ตรวจสอบแหล่งข่าว",
            "เช็กแหล่งข่าว"
        ],
        "keywords_security": [
            "ศูนย์ต่อต้านข่าวปลอม",
            "anti-fake news",
            "เช็กก่อนแชร์",
            "แหล่งข่าวทางการ",
            "verified",
            "ตรวจสอบข้อมูล",
            "เสพข่าวอย่างมีสติ",
            "เช็กก่อนแชร์"
        ]
    },
    "11": {
        "title": "โพสต์ภาพ/คลิปโป๊ลงคอมพิวเตอร์สาธารณะ",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(4) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลคอมพิวเตอร์ใดๆ ที่มีลักษณะอันลามก)",
        "penalty": "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "แอดมินลบภาพและคลิปออกจากระบบทันที บล็อกผู้ส่ง และรายงานแพลตฟอร์ม",
        "prevention": "เปิดใช้งานระบบ SafeSearch และตัวกรองเนื้อหาลามกอัตโนมัติ (Content Filtering)",
        "keywords_law": [
            "มาตรา 14(4)",
            "14 (4)",
            "14(4)",
            "14",
            "ลามก",
            "อนาจาร",
            "คลิปโป๊",
            "18+",
            "ภาพลามก"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ",
            "จำคุก",
            "ปรับ",
            "ไม่เกิน 5 ปี"
        ],
        "keywords_remedy": [
            "ลบคลิป",
            "ลบวิดีโอ",
            "ลบภาพ",
            "แอดมินลบ",
            "บล็อก",
            "report",
            "รายงาน",
            "แจ้งครู",
            "แจ้งตำรวจ",
            "ยอมรับความผิด"
        ],
        "keywords_security": [
            "safesearch",
            "safe search",
            "content filter",
            "ตัวกรอง",
            "กรองเนื้อหา",
            "moderation",
            "ตั้งค่ากลุ่มส่วนตัว",
            "ไม่ส่งต่อคลิป"
        ]
    },
    "12": {
        "title": "ตัดต่อหน้าเพื่อนใส่เอเลี่ยนประจานในโซเชียล",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 16 (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งภาพตัดต่อ ดัดแปลง ทำให้ผู้อื่นเสียชื่อเสียง ถูกดูหมิ่น อับอาย)",
        "penalty": "จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 200,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "แคปหลักฐานภาพและลิงก์ แจ้งแพลตฟอร์มลบภาพ และแจ้งคุณครู/ผู้ปกครอง",
        "prevention": "ตั้งค่าบัญชีเป็นส่วนตัว (Private Account) และไม่ยินยอมให้ผู้อื่นนำรูปไปใช้",
        "keywords_law": [
            "มาตรา 16",
            "16",
            "ตัดต่อ",
            "ดัดแปลง",
            "เสียชื่อเสียง",
            "ดูหมิ่น",
            "อับอาย",
            "cyberbullying",
            "ประจาน"
        ],
        "keywords_penalty": [
            "3 ปี",
            "สามปี",
            "200,000",
            "สองแสน",
            "200000",
            "แสนบาท",
            "ปรับ",
            "จำคุก",
            "ไม่เกิน 3 ปี"
        ],
        "keywords_remedy": [
            "แคปรูป",
            "แคปเจอร์หลักฐาน",
            "แจ้งลบ",
            "report",
            "cyberbullying",
            "แจ้งครู",
            "แจ้งผู้ปกครอง",
            "แจ้งตำรวจ",
            "ลบโพสต์"
        ],
        "keywords_security": [
            "private account",
            "ตั้งค่าส่วนตัว",
            "จำกัดแท็ก",
            "ไม่แชร์รูปสาธารณะ",
            "จริยธรรม",
            "ปิดกั้น",
            "ล็อกโปรไฟล์",
            "จำกัดผู้เข้าชม",
            "ปิดการดาวน์โหลด"
        ]
    }
};

// Helper function to detect gibberish, keyboard mashing, or evasive non-answers
function isGibberishOrNonsense(text) {
    if (!text || typeof text !== 'string') return true;
    const clean = text.trim().toLowerCase();
    if (clean.length < 10) return true;

    // Evasive / troll phrases
    const evasivePatterns = [
        /^(ไม่รู้|ไม่ทราบ|ไม่บอก|มั่ว|ขี้เกียจ|ไม่มี|ไม่แน่ใจ|ไม่รู้อะไรเลย|ช่างมัน|ไม่ตอบ)/i,
        /^(ไม่รู้พี่|ไม่รู้อะ|ไม่รู้ครับ|ไม่รู้ค่ะ)/i,
        /^(5555+|hahaha+|www+)/i
    ];
    for (const p of evasivePatterns) {
        if (p.test(clean)) return true;
    }

    // Keyboard mashing / repeated consonant clusters (Thai & English)
    const mashPatterns = [
        /(ฟกห|กฟห|หฟก|กหฟ|กดห|ดฟก|ผปอ|ปผอ|่าส|าสด|กดฟ)/i,
        /(asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm|qwer|wert|erty|rtyu|tyui|yuio|uiop)/i,
        /([^\d\s,.-])\1{4,}/, // Repeated non-digit character 5+ times (e.g. aaaaa, กกกกก) - Allows numbers like 200000 or 100000!
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
    const legalText = normalizeStudentSlang(studentAnswers.legal || '');
    const remedyText = normalizeStudentSlang(studentAnswers.remedy || '');
    const securityText = normalizeStudentSlang(studentAnswers.security || '');

    // Helper to validate wrong case section or wrong topic across ALL 12 cases
    const sectionCaseMap = {
        'มาตรา 5': 1, 'มาตรา 6': 2, 'มาตรา 7': 3, 'มาตรา 8': 4,
        'มาตรา 9': 5, 'มาตรา 10': 6, 'มาตรา 11': 7, 'มาตรา 14(1)': 9,
        'มาตรา 14(2)': 10, 'มาตรา 14(4)': 11, 'มาตรา 16': 12
    };

    function checkWrongCaseSection(text, currentCaseId) {
        const lower = (text || '').toLowerCase();
        const cId = Number(currentCaseId);

        // 1. Law Section mismatch
        for (const [sec, targetId] of Object.entries(sectionCaseMap)) {
            if (lower.includes(sec.toLowerCase()) && targetId !== cId) {
                if (sec === 'มาตรา 11' && (cId === 7 || cId === 8)) continue;
                return `คำตอบไม่ตรงกับคดี! ข้อความที่คุณระบุ (${sec}) เป็นกฎหมายของคดีอื่น ไม่ตรงกับพฤติการณ์ในคดีนี้ (${ref.title})`;
            }
        }

        // 2. Specific Topic Domain mismatches across all 12 cases
        if (cId !== 12 && ['ตัดต่อภาพ', 'ดัดแปลงภาพ', 'ภาพตัดต่อ', 'บูลลี่', 'cyberbullying', 'แท็กภาพ', 'ทำให้อับอาย'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องการตัดต่อรูปและบูลลี่ ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 11 && ['คลิปโป๊', 'ภาพลามก', 'อนาจาร', 'สื่อลามก', 'safesearch'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องภาพลามกอนาจาร ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 6 && ['ยิงระบบ', 'ยิงเซิร์ฟเวอร์', 'เซิร์ฟเวอร์ล่ม', 'ddos', 'cloudflare'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องการยิง DDoS ถล่มเซิร์ฟเวอร์ ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 9 && ['phishing', 'ฟิชชิ่ง', 'เว็บปลอม', 'สกินฟรี', 'แจกเพชร'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องเว็บฟิชชิ่งหลอกสกินเกม ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 10 && ['ข่าวปลอม', 'fake news', 'ตื่นตระหนก', 'ข่าวลวง', 'ศูนย์ต่อต้านข่าวปลอม'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องการโพสต์ข่าวปลอมตื่นตระหนก ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 4 && ['wifi สาธารณะ', 'free wifi', 'อายัดบัตร', 'ดักฟังสัญญาณ'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องการดักจับข้อมูลบน Wi-Fi ไม่ตรงกับคดีนี้ (${ref.title})`;
        }
        if (cId !== 5 && ['version history', 'ประวัติเวอร์ชัน', 'กู้ไฟล์โครงงาน'].some(k => lower.includes(k))) {
            return `คำตอบไม่ตรงกับคดี! ข้อความนี้เป็นเรื่องการแอบลบไฟล์โครงงาน ไม่ตรงกับคดีนี้ (${ref.title})`;
        }

        return null;
    }

    // 1. Legal Scoring (10 / 8 / 5 / 0)
    let legalScore = 0;
    let legalFeedback = '';
    if (isGibberishOrNonsense(legalText)) {
        legalScore = 0;
        legalFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากข้อความไม่ได้ระบุฐานความผิดหรือบทวิเคราะห์ที่สอดคล้องกับพฤติการณ์ในคดี';
    } else {
        const lLower = legalText.toLowerCase();
        const wrongSec = checkWrongCaseSection(lLower, caseId);
        const hasLawSection = (lLower.includes('มาตรา') || lLower.includes('พ.ร.บ') || lLower.includes('pdpa') || lLower.includes('กฎหมาย') || lLower.includes('ฐานความผิด'));
        const hasPenalty = (lLower.includes('ปรับ') || lLower.includes('คุก') || lLower.includes('จำคุก') || lLower.includes('บาท') || lLower.includes('ปี') || lLower.includes('เดือน') || lLower.includes('หมื่น') || lLower.includes('แสน'));

        if (wrongSec) {
            legalScore = 0;
            legalFeedback = wrongSec;
        } else if (!hasLawSection && !hasPenalty) {
            legalScore = 0;
            legalFeedback = 'ยังไม่สามารถให้คะแนนได้ ข้อความนี้เป็นวิธีระงับเหตุหรือการตั้งค่าความปลอดภัย ไม่ใช่การวิเคราะห์ฐานความผิดกฎหมายและอัตราโทษประจำคดี';
        } else {
            const hasCaseLawMatch = ref.keywords_law.some(k => lLower.includes(k.toLowerCase())) || lLower.includes(ref.law.toLowerCase());
            if (hasCaseLawMatch && hasPenalty) {
                legalScore = 10;
                legalFeedback = 'วิเคราะห์ฐานความผิดทางกฎหมายและอัตราโทษประจำคดีนี้ได้อย่างถูกต้อง แม่นยำ และครบถ้วนสมบูรณ์แบบ!';
            } else if (hasCaseLawMatch) {
                legalScore = 8;
                legalFeedback = 'วิเคราะห์ฐานความผิดกฎหมายตรงตามคดีได้ดีมาก! หากระบุรายละเอียดอัตราโทษ (จำคุก/ปรับ) เพิ่มอีกนิด จะได้ 10 คะแนนเต็ม';
            } else {
                legalScore = 5;
                legalFeedback = 'วิเคราะห์ทิศทางความผิดตรงคดีแล้ว แนะนำให้ระบุเลขมาตรากฎหมายและอัตราโทษเฉพาะคดีนี้เพิ่มเติมเพื่อให้ได้คะแนนสูงขึ้น';
            }
        }
    }

    // 2. Remedy Scoring (10 / 8 / 5 / 0)
    let remedyScore = 0;
    let remedyFeedback = '';
    if (isGibberishOrNonsense(remedyText)) {
        remedyScore = 0;
        remedyFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากไม่ได้ระบุขั้นตอนการระงับเหตุเฉพาะหน้า เมื่อเกิดเหตุไซเบอร์ต้องพิจารณาวิธีตัดวงจรความเสียหายทันที';
    } else {
        const rLower = remedyText.toLowerCase();
        const wrongSec = checkWrongCaseSection(rLower, caseId);
        const hasAction = ['ลบ','บล็อก','แจ้ง','กู้','หยุด','อายัด','สลับ','ตัด','ปิด','แคป','รายงาน','บอกครู','บอกพ่อแม่','ปรึกษา','ฟ้อง','ประสานงาน','แก้ข่าว'].some(k => rLower.includes(k));
        const hasNotify = ['แจ้งครู','แจ้งผู้ปกครอง','แจ้งแอดมิน','รายงาน','แจ้งตำรวจ','แจ้งไอที','แจ้งแพลตฟอร์ม','แจ้งผู้เกี่ยวข้อง','บอกพ่อแม่','บอกครู'].some(k => rLower.includes(k));
        const mentionsLawOnly = (rLower.includes('มาตรา') || rLower.includes('พ.ร.บ')) && !hasAction;

        if (wrongSec) {
            remedyScore = 0;
            remedyFeedback = wrongSec;
        } else if (mentionsLawOnly || !hasAction) {
            remedyScore = 0;
            remedyFeedback = 'ยังไม่สามารถให้คะแนนได้ ข้อความนี้เป็นการระบุมาตรากฎหมาย ไม่ใช่ขั้นตอนการระงับเหตุเฉพาะหน้าเพื่อหยุดยั้งความเสียหาย';
        } else {
            const hasCaseRemedyMatch = ref.keywords_remedy.some(k => rLower.includes(k.toLowerCase()));
            if (hasCaseRemedyMatch && hasNotify) {
                remedyScore = 10;
                remedyFeedback = 'ลำดับขั้นตอนการบรรเทาความเสียหายเฉพาะหน้าและระบุผู้เกี่ยวข้องของคดีนี้ได้อย่างรวดเร็ว มีสติ และสมบูรณ์แบบ!';
            } else if (hasCaseRemedyMatch) {
                remedyScore = 8;
                remedyFeedback = 'ระบุขั้นตอนหยุดเหตุเฉพาะหน้าตรงคดีได้ดีมาก! หากระบุการแจ้งแอดมิน ครู หรือผู้ปกครองเพิ่มเติม จะได้ 10 คะแนนเต็ม';
            } else {
                remedyScore = 5;
                remedyFeedback = 'มีแนวคิดการหยุดเหตุเฉพาะหน้าตรงคดีแล้ว ควรระบุวิธีระงับเหตุเฉพาะทางและผู้รับแจ้งเพิ่มเติมเพื่อเพิ่มคะแนน';
            }
        }
    }

    // 3. Security Scoring (10 / 8 / 5 / 0)
    let securityScore = 0;
    let securityFeedback = '';
    if (isGibberishOrNonsense(securityText)) {
        securityScore = 0;
        securityFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากยังไม่ได้เสนอแนะระบบหรือเครื่องมือความปลอดภัยทางเทคนิค ลองระบุเครื่องมือเทคโนโลยีหรือแนวทางป้องกันระยะยาว';
    } else {
        const sLower = securityText.toLowerCase();
        const wrongSec = checkWrongCaseSection(sLower, caseId);
        const hasSecToolName = ['2fa','otp','safesearch','cloudflare','firewall','ไฟร์วอลล์','vpn','ssl','https','face id','touch id','private account','anti-spam','rate limit','version history'].some(k => sLower.includes(k));
        const hasSecTool = ['ไม่กด','ไม่คลิก','ลิงก์','ลิงค์','โฆษณา','สมัคร','รหัส','2fa','ป้องกัน','ตั้งค่า','ล็อก','สิทธิ์','กรอง','ความเป็นส่วนตัว','ระวัง','หลีกเลี่ยง','ไม่แชร์','ไม่กรอก','แฮกเกอร์','ระบบ','ความปลอดภัย','ไฟร์วอลล์','firewall','ddos','cloudflare','safesearch','private','ส่วนตัว'].some(k => sLower.includes(k));

        if (wrongSec) {
            securityScore = 0;
            securityFeedback = wrongSec;
        } else if (!hasSecTool) {
            securityScore = 0;
            securityFeedback = 'ยังไม่สามารถให้คะแนนได้ ข้อความนี้ไม่ใช่มาตรการหรือแนวทางป้องกันความเสี่ยงระยะยาว';
        } else {
            const hasCaseSecMatch = ref.keywords_security.some(k => sLower.includes(k.toLowerCase()));
            if (hasCaseSecMatch) {
                securityScore = 10;
                securityFeedback = 'ข้อเสนอแนะแนวทางปฏิบัติหรือเครื่องมือป้องกันความปลอดภัยตรงกับคดีนี้ได้อย่างสมบูรณ์แบบ!';
            } else {
                securityScore = 6;
                securityFeedback = 'ตอบแนวทางป้องกันตรงคดีแล้ว แนะนำให้ระบุวิธีหรือเครื่องมือป้องกันประจำคดีนี้เพิ่มเติมเพื่อให้ได้คะแนนสูงขึ้น';
            }
        }
    }

    const totalScore = legalScore + remedyScore + securityScore;
    let overallSummary = totalScore >= 26
        ? 'สุดยอดผลงานนักสืบไซเบอร์ระดับ Cyber Master! ทีมของคุณมีความรู้ด้านกฎหมาย การรับมือเหตุ และการวางระบบความปลอดภัยอย่างน่าทึ่ง'
        : totalScore >= 18
        ? 'ทำผลงานได้ดีระดับ Senior Detective! มีความเข้าใจหลักการเป็นอย่างดี พัฒนาอีกนิดจะกลายเป็นยอดสายสืบมือหนึ่งแน่นอน'
        : totalScore > 0
        ? 'ขอเป็นกำลังใจให้นักสืบฝึกหัด! การวิเคราะห์มีจุดเริ่มต้นที่ดี ลองศึกษาพฤติการณ์และเครื่องมือป้องกันเพิ่มเติมเพื่อคะแนนที่สูงขึ้นในคดีถัดไป'
        : 'ตรวจพบข้อความที่ไม่สามารถประเมินผลได้ โปรดอ่านรายละเอียดคำร้องทุกข์และการ์ตูน 9 ช่อง แล้วพิมพ์วิเคราะห์เนื้อหาจริงเพื่อรับคะแนนสะสม';

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

// Helper: Multi-Key Load Balancing & Automatic Model Failover for Gemini API
async function callGeminiApiWithMultiKey(systemPrompt, userPrompt, clientApiKey) {
    const rawKeys = [clientApiKey, ...(process.env.GEMINI_API_KEY || '').split(','), ...(process.env.GOOGLE_AI_KEY || '').split(',')];
    const keys = [...new Set(rawKeys.map(k => k ? k.trim() : '').filter(Boolean))];
    
    if (keys.length === 0) return null;

    const candidateModels = ['gemini-flash-latest', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-pro'];
    const startKeyIdx = Math.floor(Math.random() * keys.length);

    for (let k = 0; k < keys.length; k++) {
        const apiKey = keys[(startKeyIdx + k) % keys.length];

        for (const model of candidateModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(rawText);
                    return { evaluation: parsed, model, apiKeyPrefix: apiKey.substring(0, 6) };
                } else if (response.status === 429 || response.status === 503) {
                    console.warn(`[Gemini Rate Limit 429] Key ${apiKey.substring(0, 6)}... busy on ${model}. Switching to next key/model...`);
                    break;
                }
            } catch (err) {
                console.warn(`[Gemini Failover] Key ${apiKey.substring(0, 6)}... on ${model}: ${err.message}`);
            }
        }
    }

    return null;
}

// Primary Endpoint: Evaluate Subjective Case Answers via Google Gemini AI
app.post('/api/evaluate-case', async (req, res) => {
    const { playerId, teamName, membersInfo, caseId, caseTitle, studentAnswers, apiKey: clientApiKey } = req.body || {};
    
    if (!caseId || !studentAnswers) {
        return res.status(400).json({ success: false, message: 'ข้อมูลคำตอบหรือคดีไม่ครบถ้วน' });
    }

    const ref = CASE_REFERENCES[caseId] || CASE_REFERENCES[1];

    const systemPrompt = `You are "พี่สายสืบไซเบอร์ใจดี" (Kind Senior Cyber Detective Coach) for Thai Grade 9 (ม.3) students aged 14-15 who are BEGINNERS LEARNING CYBER LAW FOR THE FIRST TIME.

[PERSONA & TONAL REQUIREMENTS]:
- Write in warm, encouraging, positive, simple Thai suitable for middle school students (ม.3).
- ABSOLUTELY NO enterprise IT jargon, corporate law officer terminology, or complex engineering phrases.

---
[CASE SCENARIO REFERENCE DATA (CONFIDENTIAL - FOR EVALUATION ONLY - DO NOT SPOIL TO STUDENTS)]
- Case Title: ${caseTitle || ref.title}
- Relevant Law & Penalty: ${ref.law} (โทษ: ${ref.penalty})
- Standard Remedy Action: ${ref.remedy}
- Standard Prevention Practice: ${ref.prevention}

---
[STRICT ACCURACY & CASE RELEVANCE POLICY - PREVENT FALSE HIGH SCORES]:
1. CASE RELEVANCE MATCH (MUST MATCH THIS SPECIFIC CASE):
   - You MUST check if the student's answer is relevant to the CURRENT CASE SCENARIO (${caseTitle || ref.title}).
   - Example: If the current case is "DDoS Server Crash" (ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบ) and the student answers about "photo editing / cyberbullying" (ตัดต่อรูป / บูลลี่) or "private account settings" -> YOU MUST AWARD 0 TO 2 POINTS MAXIMUM! Explain clearly in feedback that their answer belongs to a different case (e.g. "คำตอบนี้เป็นการตั้งค่า/ลบรูปบูลลี่ ไม่ตรงกับคดียิง DDoS ถล่มเซิร์ฟเวอร์ล่ม โปรดอ่านคำร้องทุกข์คดีนี้ใหม่ครับ").
   - If the student cites a law section from a DIFFERENT case (e.g. citing มาตรา 16 in a DDoS case which is มาตรา 10) -> AWARD 0 TO 2 POINTS MAXIMUM!

2. ROLE MATCH (MUST MATCH THIS SPECIFIC ROLE):
   - 👨‍⚖️ Legal Analyst (0-10 pts): MUST analyze Law Section / Offense / Penalty for THIS case. If student writes security settings ("ตั้งค่าส่วนตัว") or remedy actions ("แคปรูปแจ้งครู") -> AWARD 0 TO 2 POINTS MAXIMUM!
   - 🚑 Incident Responder (0-10 pts): MUST provide immediate containment actions / stakeholders for THIS case. If student quotes a law section ("พ.ร.บ. มาตรา 16...") or security settings -> AWARD 0 TO 2 POINTS MAXIMUM!
   - 🛡️ Security Engineer (0-10 pts): MUST provide long-term prevention guidelines or tools matching THIS case (e.g. checking websites/URLs, privacy settings, 2FA, Firewall). If student writes cyberbullying report actions -> AWARD 0 TO 2 POINTS MAXIMUM!

3. CONCISE & DIRECT ACCURATE ANSWERS GET FULL 10/10 POINTS:
   - When an answer IS relevant to this case and role, award full 10/10 points even if it is short or written in everyday student language.

---
[OUTPUT FORMAT REQUIREMENT]
You MUST reply strictly in JSON format. Format:
{
  "legal": {
    "score": <integer from 0 to 10>,
    "feedback": "<friendly educational feedback in Thai for Grade 9 students without spoilers>"
  },
  "remedy": {
    "score": <integer from 0 to 10>,
    "feedback": "<friendly educational feedback in Thai for Grade 9 students without spoilers>"
  },
  "security": {
    "score": <integer from 0 to 10>,
    "feedback": "<friendly educational feedback in Thai for Grade 9 students without spoilers>"
  },
  "total_score": <integer from 0 to 30>,
  "overall_summary": "<inspiring and encouraging summary in Thai suitable for Grade 9 students>"
}`;

    const userPrompt = `Student Submissions for Case "${caseTitle || ref.title}":
- 👨‍⚖️ Legal Analyst Answer: "${studentAnswers.legal || ''}"
- 🚑 Incident Responder Answer: "${studentAnswers.remedy || ''}"
- 🛡️ Security Engineer Answer: "${studentAnswers.security || ''}"`;

    const geminiResult = await callGeminiApiWithMultiKey(systemPrompt, userPrompt, clientApiKey);

    if (geminiResult && geminiResult.evaluation) {
        const aiEvaluation = geminiResult.evaluation;
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

        return res.json({ success: true, evaluation: aiEvaluation, mode: 'gemini', model: geminiResult.model });
    }

    // Fallback if all Gemini keys/models failed
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

// Single-Role Realtime Evaluation Endpoint (ทำทีละบทบาท ตรวจทันที)
app.post('/api/evaluate-role', async (req, res) => {
    const { playerId, teamName, membersInfo, caseId, caseTitle, role, answer, apiKey: clientApiKey } = req.body || {};
    
    if (!caseId || !role || !answer) {
        return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
    }

    const ref = CASE_REFERENCES[caseId] || CASE_REFERENCES[1];

    let roleNameThai = role === 'legal' ? '1. นักวิเคราะห์กฎหมาย (Legal Analyst)' : role === 'remedy' ? '2. เจ้าหน้าที่บรรเทาภัย (Incident Responder)' : '3. วิศวกรความปลอดภัย (Security Engineer)';
    let standardRef = role === 'legal' ? `${ref.law} (อัตราโทษ: ${ref.penalty})` : role === 'remedy' ? ref.remedy : ref.prevention;

    // Check gibberish locally
    const gibberish = isGibberishOrNonsense(answer);
    if (gibberish) {
        return res.json({
            success: true,
            role,
            score: 0,
            feedback: role === 'legal'
                ? 'ยังไม่สามารถให้คะแนนได้ ลองย้อนกลับไปดูเหตุการณ์ในการ์ตูน 9 ช่อง แล้วระบุฐานความผิดหรือบทลงโทษทางกฎหมายดูนะครับ'
                : role === 'remedy'
                ? 'ยังไม่สามารถให้คะแนนได้ ลองระบุวิธีรับมือตัดวงจรความเสียหายทันที และบอกผู้ใหญ่หรือแอดมินให้ช่วยระงับเหตุนะครับ'
                : 'ยังไม่สามารถให้คะแนนได้ ลองเสนอแนะวิธีป้องกันตัวเองจากภัยไซเบอร์ง่ายๆ ในชีวิตประจำวันดูนะครับ',
            mode: 'gibberish_filter'
        });
    }

    const systemPrompt = `You are "พี่สายสืบไซเบอร์ใจดี" (Kind Senior Cyber Detective Coach) for Thai Grade 9 (ม.3) students aged 14-15 who are BEGINNERS LEARNING CYBER LAW FOR THE FIRST TIME.

[PERSONA & TONAL REQUIREMENTS]:
- Write in warm, encouraging, positive, simple Thai suitable for middle school students (ม.3).
- ABSOLUTELY NO enterprise IT jargon, corporate law officer terminology, or complex engineering phrases (e.g. NEVER say "ควรระบุมาตรการสร้างความตระหนักรู้เชิงวิศวกรรมความปลอดภัยอันรัดกุม" or "ควรเสนอระบบ Authentication เพื่อจำกัดสิทธิ์ผู้ถือครอง").
- INSTEAD use simple youth concepts (e.g. "สุดยอดเลยน้องๆ! ตอบได้ตรงจุดมาก", "เก่งมาก! รู้จักป้องกันตัวเองไม่ให้โดนหลอก", "ถูกต้องครับ! รู้จักบอกครูและผู้ปกครองเมื่อเกิดเหตุ").

[BEGINNER-FRIENDLY GRADING POLICY FOR GRADE 9 (ม.3) STUDENTS]:
1. CONCISE & DIRECT ANSWERS GET FULL 10/10 POINTS:
   - Grade 9 students write concisely in everyday student language.
   - If an answer is SHORT or BRIEF (e.g. "ไม่กดสมัครโฆษณามั่วๆ หรือไม่กดลิงค์แปลกๆ", "แจ้งครูและแอดมินลบรูป", "ผิดมาตรา 11 ปรับไม่เกิน 200,000 บาท"), BUT it addresses the practical action/concept -> YOU MUST AWARD FULL 10/10 POINTS!
   - NEVER DEDUCT POINTS for short answer length, everyday youth vocabulary, or absence of adult/IT officer jargon!

2. STRICT ROLE SEPARATION FOR BEGINNERS:
   - 👨‍⚖️ Legal Analyst (0-10 pts): Evaluate ONLY law section/concept + penalty. DO NOT ask for IT tools.
   - 🚑 Incident Responder (0-10 pts): Evaluate ONLY immediate action (ลบ, บล็อก, แคปรูป) + who to tell (ครู, ผู้ปกครอง, แอดมิน, ตำรวจ). DO NOT ask for section numbers or IT tools.
   - 🛡️ Security Engineer (0-10 pts): Evaluate practical youth safety guidelines (เช่น ตรวจสอบเว็บ/ลิงก์ก่อนให้ข้อมูล, ไม่กดลิงก์แปลกๆ, ตั้งรหัสยากๆ, ไม่แชร์ข้อมูลส่วนตัว, ล็อกหน้าจอ) OR technical tools (2FA, SSL, SafeSearch, Firewall). Award 10/10 for clear prevention practices even without tool names! DO NOT DEMAND ADULT IT OFFICER JARGON!

3. FRIENDLY, SHORT & ENCOURAGING FEEDBACK (IN THAI):
   - Keep feedback short (1-2 sentences), positive, and encouraging for Grade 9 students.
   - Example 10/10 feedback: "เก่งมากเลยน้องๆ! คิดวิเคราะห์ได้ตรงประเด็นและนำไปใช้ป้องกันตัวเองในชีวิตจริงได้ดีมากครับ"
   - NEVER criticize a Grade 9 student for not writing like an adult IT lawyer or security engineer!

Case Title: ${caseTitle || ref.title}
Official Reference for this role (CONFIDENTIAL - DO NOT SPOIL EXACT ANSWERS): ${standardRef}

Reply STRICTLY in JSON format:
{
  "score": <integer from 0 to 10>,
  "feedback": "<friendly educational feedback in Thai explaining why and how the answer is praised or guided, without spoilers>"
}`;

    const geminiResult = await callGeminiApiWithMultiKey(systemPrompt, `Student Answer for ${roleNameThai}: "${answer}"`, clientApiKey);

    if (geminiResult && geminiResult.evaluation && typeof geminiResult.evaluation.score === 'number') {
        return res.json({ success: true, role, score: geminiResult.evaluation.score, feedback: geminiResult.evaluation.feedback, mode: 'gemini', model: geminiResult.model });
    }

    const fullLocal = evaluateLocally(caseId, { [role]: answer });
    const resRole = fullLocal[role] || { score: 5, feedback: 'วิเคราะห์ได้ดี' };
    return res.json({ success: true, role, score: resRole.score, feedback: resRole.feedback, mode: 'fallback_heuristic' });
});

// Endpoint to Save Complete Case Score to Supabase & Realtime Telemetry
app.post('/api/save-case-score', (req, res) => {
    const { playerId, teamName, membersInfo, caseId, caseTitle, caseScores, studentAnswers } = req.body || {};
    if (caseScores) {
        const legalScore = Number(caseScores.legal?.score || caseScores.legalScore || 0);
        const remedyScore = Number(caseScores.remedy?.score || caseScores.remedyScore || 0);
        const securityScore = Number(caseScores.security?.score || caseScores.securityScore || 0);
        const totalScore = legalScore + remedyScore + securityScore;

        saveToSupabase({
            playerId,
            teamName,
            membersInfo,
            caseId,
            caseTitle,
            studentAnswers: studentAnswers || {},
            evaluation: {
                legal: { score: legalScore, feedback: caseScores.legal?.feedback || caseScores.legalFeedback || '' },
                remedy: { score: remedyScore, feedback: caseScores.remedy?.feedback || caseScores.remedyFeedback || '' },
                security: { score: securityScore, feedback: caseScores.security?.feedback || caseScores.securityFeedback || '' },
                total_score: totalScore
            }
        });
    }
    res.json({ success: true });
});

// In-memory score cache buffer for fast realtime fallback
const SERVER_SCORES_CACHE = [];

// Default Supabase Fallback Credentials
const DEFAULT_SUPABASE_URL = process.env.SUPABASE_URL || 'https://xbwlzqtvmjwucoqkyvhj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2x6cXR2bWp3dWNvcWt5dmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjE3NDEsImV4cCI6MjEwMDAzNzc0MX0.nbIkBfvTZBxBSxxYik3o3gAqlXI8ITGMvof3wvJxA7c';

// Helper function to save game score to Supabase & Memory Cache
async function saveToSupabase(record) {
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

    // Save to memory cache for quick local response
    SERVER_SCORES_CACHE.unshift({ ...row, id: 'rec_' + Date.now() });
    if (SERVER_SCORES_CACHE.length > 500) SERVER_SCORES_CACHE.pop();

    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
        const { data, error } = await supabase.from('game_scores').insert([row]).select();
        if (error) {
            console.error('❌ Supabase Log Score Error:', error.message);
        } else {
            console.log('✅ Supabase Log Score Success! Inserted ID:', data[0]?.id);
        }
    } catch (e) {
        console.error('Failed to log score to Supabase:', e.message);
    }
}

// Helper function to deduplicate scores by team and case ID
function deduplicateScores(rawScores) {
    if (!Array.isArray(rawScores)) return [];
    const teamMap = new Map();
    rawScores.forEach(item => {
        const teamKey = item.team_name || item.player_id || 'นักสืบเยาวชน';
        if (!teamMap.has(teamKey)) teamMap.set(teamKey, new Map());
        const caseKey = item.case_id !== undefined && item.case_id !== null ? `case_${item.case_id}` : (item.case_title || `idx_${Math.random()}`);
        const existing = teamMap.get(teamKey).get(caseKey);
        if (!existing) {
            teamMap.get(teamKey).set(caseKey, item);
        } else {
            const tExisting = existing.created_at ? new Date(existing.created_at).getTime() : 0;
            const tNew = item.created_at ? new Date(item.created_at).getTime() : 0;
            if (tNew >= tExisting) {
                teamMap.get(teamKey).set(caseKey, item);
            }
        }
    });
    const result = [];
    teamMap.forEach(caseMap => {
        caseMap.forEach(item => result.push(item));
    });
    return result;
}

// Secure API Endpoint: Leaderboard & Teacher Realtime Telemetry Data
app.get('/api/leaderboard', async (req, res) => {
    let results = null;
    let queryError = false;

    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
        const { data, error } = await supabase
            .from('game_scores')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(500);
        if (!error && Array.isArray(data)) {
            results = data;
            // If Supabase is empty, clear memory cache buffer as well
            if (data.length === 0) {
                SERVER_SCORES_CACHE.length = 0;
            }
        } else if (error) {
            queryError = true;
        }
    } catch (e) {
        queryError = true;
        console.warn('Supabase query error, fallback to cache:', e.message);
    }

    if (results === null && queryError) {
        results = [...SERVER_SCORES_CACHE];
    } else if (results === null) {
        results = [];
    }

    const cleanResults = deduplicateScores(results);

    res.json({ success: true, data: cleanResults });
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
