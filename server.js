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
            "แอบล็อกอิน"
        ],
        "keywords_penalty": [
            "6 เดือน",
            "หกเดือน",
            "10,000",
            "หนึ่งหมื่น",
            "10000",
            "หมื่นบาท",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "logout",
            "log out",
            "ออกจากระบบ",
            "เปลี่ยนรหัส",
            "เปลี่ยนพาส",
            "แจ้งครู",
            "แจ้งผู้ปกครอง",
            "รายงาน"
        ],
        "keywords_security": [
            "2fa",
            "two-factor",
            "otp",
            "ล็อกอิน 2 ชั้น",
            "สองชั้น",
            "ล็อกหน้าจอ",
            "ยืนยันตัวตน"
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
            "ปล่อยรหัส"
        ],
        "keywords_penalty": [
            "1 ปี",
            "หนึ่งปี",
            "20,000",
            "สองหมื่น",
            "20000",
            "หมื่น",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "เปลี่ยนรหัส",
            "ลบข้อความ",
            "แจ้งแอดมิน",
            "discord",
            "ตัดเซสชัน",
            "บล็อก"
        ],
        "keywords_security": [
            "รหัสผ่านซับซ้อน",
            "ตัวพิมพ์ใหญ่",
            "ตัวเลข",
            "สัญลักษณ์",
            "ห้ามจด",
            "password manager",
            "ความลับ"
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
            "ดูดไฟล์"
        ],
        "keywords_penalty": [
            "2 ปี",
            "สองปี",
            "40,000",
            "สี่หมื่น",
            "40000",
            "หมื่น",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "ลบไฟล์",
            "เปลี่ยนรหัส",
            "แจ้งระงับ",
            "แจ้งครู",
            "แจ้งแอดมิน"
        ],
        "keywords_security": [
            "สแกนใบหน้า",
            "ลายนิ้วมือ",
            "face id",
            "biometrics",
            "เข้ารหัส",
            "encryption",
            "ล็อกโฟลเดอร์"
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
            "ดักข้อมูล"
        ],
        "keywords_penalty": [
            "3 ปี",
            "สามปี",
            "60,000",
            "หกหมื่น",
            "60000",
            "หมื่น",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "ตัด wifi",
            "หยุดทำธุรกรรม",
            "อายัดบัตร",
            "แจ้งธนาคาร",
            "แจ้งค่ายเกม",
            "เปลี่ยนพาส"
        ],
        "keywords_security": [
            "ssl",
            "https",
            "vpn",
            "เข้ารหัสข้อมูล",
            "encryption",
            "หลีกเลี่ยง wifi ฟรี",
            "public wifi"
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
            "เสียหาย"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "version history",
            "ประวัติเวอร์ชัน",
            "กู้คืน",
            "restore",
            "ถังขยะ",
            "recycle bin",
            "activity log"
        ],
        "keywords_security": [
            "read-only",
            "อ่านอย่างเดียว",
            "จำกัดสิทธิ์",
            "permission",
            "แชร์เฉพาะอีเมล",
            "backup",
            "สำรองข้อมูล"
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
            "ระบบล่ม"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "บล็อก ip",
            "block ip",
            "สลับเซิร์ฟเวอร์",
            "แจ้งไอที",
            "แจ้งครู",
            "รีสตาร์ท"
        ],
        "keywords_security": [
            "firewall",
            "ไฟร์วอลล์",
            "ddos protection",
            "cloudflare",
            "waf",
            "rate limit",
            "load balancer"
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
            "บล็อกผู้ส่ง"
        ],
        "keywords_security": [
            "anti-spam",
            "กรองเมลขยะ",
            "filter",
            "spf",
            "dkim",
            "dmarc",
            "บล็อกผู้ส่งปลอม"
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
            "ร้องเรียน",
            "แจ้งแพลตฟอร์ม",
            "บล็อก",
            "report"
        ],
        "keywords_security": [
            "ไม่แปะเบอร์",
            "ไม่แปะเมล",
            "บอร์ดสาธารณะ",
            "email alias",
            "ความเป็นส่วนตัว",
            "privacy"
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
            "เว็บปลอม"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "แจ้งค่ายเกม",
            "ระงับบัญชี",
            "กู้คืน",
            "เปลี่ยนรหัส",
            "เตือนเพื่อน"
        ],
        "keywords_security": [
            "ตรวจ url",
            "domain",
            "โดเมน",
            "ลิงก์ปลอม",
            "ไม่คลิกลิงก์",
            "เว็บทางการ",
            "official"
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
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "ลบโพสต์",
            "ลบข่าวปลอม",
            "แถลงแก้ข่าว",
            "โพสต์แก้",
            "ชี้แจง"
        ],
        "keywords_security": [
            "ศูนย์ต่อต้านข่าวปลอม",
            "anti-fake news",
            "เช็กก่อนแชร์",
            "แหล่งข่าวทางการ",
            "verified"
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
            "18+"
        ],
        "keywords_penalty": [
            "5 ปี",
            "ห้าปี",
            "100,000",
            "หนึ่งแสน",
            "100000",
            "แสนบาท",
            "ทั้งจำทั้งปรับ"
        ],
        "keywords_remedy": [
            "ลบคลิป",
            "ลบวิดีโอ",
            "ลบภาพ",
            "แอดมินลบ",
            "บล็อก",
            "report",
            "รายงาน"
        ],
        "keywords_security": [
            "safesearch",
            "safe search",
            "content filter",
            "ตัวกรอง",
            "กรองเนื้อหา",
            "moderation"
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
            "ปรับ"
        ],
        "keywords_remedy": [
            "แคปรูป",
            "แคปหลักฐาน",
            "แจ้งลบ",
            "report",
            "cyberbullying",
            "แจ้งครู",
            "แจ้งผู้ปกครอง"
        ],
        "keywords_security": [
            "private account",
            "ตั้งค่าส่วนตัว",
            "จำกัดแท็ก",
            "ไม่แชร์รูปสาธารณะ",
            "จริยธรรม"
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

    // 1. Legal Scoring
    let legalScore = 0;
    let legalFeedback = '';
    if (isGibberishOrNonsense(legalText)) {
        legalScore = 0;
        legalFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากข้อความไม่ได้ระบุฐานความผิดหรือบทวิเคราะห์ที่สอดคล้องกับพฤติการณ์ในคดี โปรดอ่านรายละเอียดแล้วตอบตามหลักกฎหมาย';
    } else {
        const lLower = legalText.toLowerCase();
        const hasLawMatch = ref.keywords_law.some(k => lLower.includes(k.toLowerCase())) || lLower.includes(ref.law.toLowerCase());
        const hasPenaltyMatch = ref.keywords_penalty.some(k => lLower.includes(k.toLowerCase()));
        const hasPenaltyGeneral = (lLower.includes("คุก") || lLower.includes("จำคุก")) && (lLower.includes("ปรับ") || lLower.includes("บาท"));

        if (hasLawMatch) legalScore += 4;
        else if (lLower.includes("พ.ร.บ") || lLower.includes("มาตรา") || lLower.includes("pdpa") || lLower.includes("กฎหมาย")) legalScore += 2.5;

        if (hasPenaltyMatch) legalScore += 3;
        else if (hasPenaltyGeneral || lLower.includes("คุก") || lLower.includes("ปรับ") || lLower.includes("ปี") || lLower.includes("เดือน") || lLower.includes("บาท")) legalScore += 2;

        if (hasLawMatch && (hasPenaltyMatch || hasPenaltyGeneral)) legalScore += 3;
        else if (hasLawMatch && legalText.length >= 25) legalScore += 2;
        else if (legalText.length >= 20) legalScore += 1;

        legalScore = Math.min(10, Math.max(0, legalScore));
        legalFeedback = legalScore >= 9
            ? 'วิเคราะห์ฐานความผิดทางกฎหมายและระบุอัตราโทษจำคุก/ปรับได้อย่างถูกต้อง แม่นยำ ครบถ้วนสมบูรณ์ตามหลัก พ.ร.บ.คอมพิวเตอร์ / PDPA'
            : hasLawMatch
            ? 'วิเคราะห์ทิศทางฐานความผิดได้ถูกต้องแล้ว และสามารถระบุรายละเอียดอัตราโทษหรือเหตุผลประกอบเพิ่มเติมให้ชัดเจนเพื่อคะแนนเต็ม'
            : 'ฐานความผิดและโทษที่ระบุยังไม่สอดคล้องกับพฤติการณ์ในคดีนี้ ลองพิจารณาว่าเหตุการณ์ในการ์ตูนเป็นการกระทำต่อระบบ ข้อมูล หรือเป็นการเผยแพร่/หลอกลวง เพื่อเลือกมาตราให้ตรงจุดยิ่งขึ้น';
    }

    // 2. Remedy Scoring
    let remedyScore = 0;
    let remedyFeedback = '';
    if (isGibberishOrNonsense(remedyText)) {
        remedyScore = 0;
        remedyFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากไม่ได้ระบุขั้นตอนการระงับเหตุเฉพาะหน้า เมื่อเกิดเหตุไซเบอร์ต้องพิจารณาวิธีตัดวงจรความเสียหายทันที และระบุผู้เกี่ยวข้อง';
    } else {
        const rLower = remedyText.toLowerCase();
        const hasRemedyAction = ref.keywords_remedy.some(k => rLower.includes(k.toLowerCase()));
        const mentionsStakeholder = ["ครู", "ผู้ปกครอง", "พ่อ", "แม่", "ตำรวจ", "แอดมิน", "แพลตฟอร์ม", "ธนาคาร", "ค่ายเกม", "ผู้ดูแล"].some(s => rLower.includes(s));

        if (hasRemedyAction) remedyScore += 4.5;
        else if (rLower.includes("ลบ") || rLower.includes("เปลี่ยน") || rLower.includes("แจ้ง") || rLower.includes("บล็อก") || rLower.includes("กู้") || rLower.includes("หยุด") || rLower.includes("อายัด")) remedyScore += 3;

        if (mentionsStakeholder) remedyScore += 3;
        else if (rLower.includes("บอก") || rLower.includes("ช่วย") || rLower.includes("รายงาน") || rLower.includes("ปรึกษา")) remedyScore += 2;

        if (hasRemedyAction && (mentionsStakeholder || remedyText.length >= 30)) remedyScore += 2.5;
        else if (remedyText.length >= 20) remedyScore += 1;

        remedyScore = Math.min(10, Math.max(0, remedyScore));
        remedyFeedback = remedyScore >= 9
            ? 'ลำดับขั้นตอนการบรรเทาความเสียหายเฉพาะหน้าได้อย่างรวดเร็ว มีสติ และระบุผู้เกี่ยวข้องในการระงับเหตุได้อย่างตรงจุดและปฏิบัติได้จริง'
            : hasRemedyAction
            ? 'มีแนวคิดการหยุดเหตุเฉพาะหน้าได้ดีแล้ว ควรระบุบุคคลหรือผู้ดูแลระบบที่ต้องประสานงานแจ้งเหตุฉุกเฉินเพิ่มเติมเพื่อให้การช่วยเหลือรวดเร็วยิ่งขึ้น'
            : 'แนวทางรับมือยังไม่ตรงกับลักษณะภัยไซเบอร์ในคดีนี้ ควรพิจารณาวิธีตัดวงจรความเสียหายทันที เช่น เปลี่ยนรหัส บล็อกไอพี หรือกู้คืนข้อมูล';
    }

    // 3. Security Scoring
    let securityScore = 0;
    let securityFeedback = '';
    if (isGibberishOrNonsense(securityText)) {
        securityScore = 0;
        securityFeedback = 'ยังไม่สามารถให้คะแนนได้ เนื่องจากยังไม่ได้เสนอแนะระบบหรือเครื่องมือความปลอดภัยทางเทคนิค ลองระบุเครื่องมือเทคโนโลยีที่ช่วยปิดช่องโหว่ระยะยาว';
    } else {
        const sLower = securityText.toLowerCase();
        const hasSecurityTool = ref.keywords_security.some(k => sLower.includes(k.toLowerCase()));

        if (hasSecurityTool) securityScore += 5;
        else if (sLower.includes("รหัส") || sLower.includes("ระบบ") || sLower.includes("ป้องกัน") || sLower.includes("ตั้งค่า") || sLower.includes("ล็อก") || sLower.includes("สิทธิ์") || sLower.includes("กรอง")) securityScore += 3;

        if (hasSecurityTool && (sLower.includes("ทำได้") || sLower.includes("ง่าย") || sLower.includes("ตั้ง") || sLower.includes("เปิด") || sLower.includes("เพื่อ") || sLower.includes("ป้องกัน") || sLower.includes("บล็อก"))) securityScore += 3;
        else if (hasSecurityTool) securityScore += 2;

        if (hasSecurityTool && sLower.length >= 30) securityScore += 2;
        else if (sLower.length >= 20) securityScore += 1;

        securityScore = Math.min(10, Math.max(0, securityScore));
        securityFeedback = securityScore >= 9
            ? 'ข้อเสนอแนะด้านวิศวกรรมความปลอดภัยยอดเยี่ยม! เครื่องมือและมาตรการที่เลือกใช้สามารถปิดช่องโหว่ความเสี่ยงของคดีนี้ในระยะยาวได้อย่างสมบูรณ์แบบ'
            : 'มีแนวคิดการป้องกันที่ดีแล้ว หากระบุชื่อเครื่องมือเทคโนโลยีความปลอดภัยเฉพาะทาง (เช่น 2FA, SSL, Firewall, Read-Only, SafeSearch) จะทำให้มาตรการรัดกุมยิ่งขึ้น';
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
---
[DETAILED SCORING RUBRICS (Max 10 points per role, Total 30 points)]
[FAIR & REASONABLE ACADEMIC SCORING CALIBRATION FOR GRADE 9 (ม.3) STUDENTS]:
- 🏆 FULL 10/10 SCORE: If the student correctly identifies the main law/section/concept (e.g. มาตรา 5 / แอบเข้าถึงระบบ) AND states the standard penalty (e.g. จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท) AND includes the wrongful action/damage, YOU MUST AWARD FULL 10/10 POINTS! Do not deduct points when all requested academic criteria are accurately present.
- 8 to 9 Points: Correct law and penalty with minor wording variation.
- 5 to 7 Points: Partially correct concept or missing penalty details.
- 0 Points: Pure gibberish, trolling, or complete mismatch.

1. 👨‍⚖️ Legal Analyst Evaluation (0 to 10 points):
   - Law/Act identification (Max 4 points): Must correctly name the specific Cyber Law concept/section or PDPA. Give 0 points if wrong or gibberish.
   - Penalty accuracy (Max 3 points): Correctly specifies jail term and fine. Give 0 points if omitted, wrong, or gibberish.
   - Reason & Damage analysis (Max 3 points): Explains who suffered damage and why the behavior is unlawful (Full points if wrongful action is stated).

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
    "feedback": "<educational feedback in Thai explaining why and how the answer is praised or guided, WITHOUT giving away exact section numbers or cheat answers>"
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

// Single-Role Realtime Evaluation Endpoint (ทำทีละบทบาท ตรวจทันที)
app.post('/api/evaluate-role', async (req, res) => {
    const { playerId, teamName, membersInfo, caseId, caseTitle, role, answer, apiKey: clientApiKey } = req.body || {};
    
    if (!caseId || !role || !answer) {
        return res.status(400).json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' });
    }

    const ref = CASE_REFERENCES[caseId] || CASE_REFERENCES[1];
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;

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
                ? 'ยังไม่สามารถให้คะแนนได้ เนื่องจากข้อความไม่ได้วิเคราะห์พฤติการณ์ความผิดทางไซเบอร์ ขอให้นักสืบย้อนกลับไปดูเหตุการณ์ในการ์ตูนแล้วเชื่อมโยงกับฐานความผิดและโทษทางกฎหมายให้ตรงประเด็น'
                : role === 'remedy'
                ? 'ยังไม่สามารถให้คะแนนได้ เนื่องจากไม่ได้ระบุขั้นตอนการระงับเหตุเฉพาะหน้า เมื่อเกิดเหตุฉุกเฉินทางไซเบอร์ต้องพิจารณาวิธีตัดวงจรความเสียหายทันที และระบุผู้มีอำนาจที่จะช่วยระงับเหตุ'
                : 'ยังไม่สามารถให้คะแนนได้ เนื่องจากยังไม่ได้เสนอแนะระบบหรือเครื่องมือความปลอดภัยทางเทคนิค ลองวิเคราะห์ว่าช่องโหว่ความเสี่ยงในคดีนี้เกิดจากจุดใด แล้วเสนอเทคนิคความปลอดภัยเพื่อปิดช่องโหว่ระยะยาว',
            mode: 'gibberish_filter'
        });
    }

    if (!apiKey) {
        const fullLocal = evaluateLocally(caseId, { [role]: answer });
        const resRole = fullLocal[role] || { score: 5, feedback: 'วิเคราะห์ได้ดี' };
        return res.json({ success: true, role, score: resRole.score, feedback: resRole.feedback, mode: 'heuristic' });
    }

    const systemPrompt = `You are the "Cyber Law and PDPA Academic Evaluator" for Thai Grade 9 (ม.3) students.
Evaluate ONE SPECIFIC ROLE: "${roleNameThai}" (Max 10 points).

[FAIR & REASONABLE ACADEMIC SCORING CALIBRATION FOR GRADE 9 STUDENTS]:
- 🏆 FULL 10/10 SCORE: If the student correctly identifies the main law/section/concept (e.g. มาตรา 5 / แอบเข้าถึงระบบ) AND states the standard penalty (e.g. จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท) AND includes the wrongful action/damage, YOU MUST AWARD FULL 10/10 POINTS! Do not deduct points when all requested academic criteria are accurately present.
- 8 to 9 Points: Correct law and penalty with minor wording variation.
- 5 to 7 Points: Partially correct concept or missing penalty details.
- 0 Points: Pure gibberish, trolling, or complete mismatch.

STRICT NO-SPOILER RULE: In your feedback, NEVER state the exact section number or give away the exact answer. Instead, explain conceptually WHY and HOW their answer is praised or missing concepts, without spoon-feeding section numbers.
Case Title: ${caseTitle || ref.title}
Official Reference for this role (CONFIDENTIAL - DO NOT LEAK TO STUDENT): ${standardRef}
Reply STRICTLY in JSON format:
{
  "score": <integer from 0 to 10>,
  "feedback": "<educational feedback in Thai explaining why and how the answer is praised or missing concepts, without spoilers>"
}`;

    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-pro'];
    let aiEvaluation = null;

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: `Student Answer for ${roleNameThai}: "${answer}"` }] }],
                    generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                aiEvaluation = JSON.parse(rawText);
                break;
            }
        } catch (err) {
            console.warn(`Attempt with ${model} failed:`, err.message);
        }
    }

    if (aiEvaluation && typeof aiEvaluation.score === 'number') {
        return res.json({ success: true, role, score: aiEvaluation.score, feedback: aiEvaluation.feedback, mode: 'gemini' });
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

// Helper function to save game score to Supabase & Memory Cache
async function saveToSupabase(record) {
    const row = {
        id: 'rec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
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

    // Save to memory cache (keep last 500 records)
    SERVER_SCORES_CACHE.unshift(row);
    if (SERVER_SCORES_CACHE.length > 500) SERVER_SCORES_CACHE.pop();

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return;
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
        await supabase.from('game_scores').insert([row]);
    } catch (e) {
        console.error('Failed to log score to Supabase:', e.message);
    }
}

// Secure API Endpoint: Leaderboard & Teacher Realtime Telemetry Data
app.get('/api/leaderboard', async (req, res) => {
    let results = [];
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        try {
            const { createClient } = require('@supabase/supabase-js');
            const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
            const { data, error } = await supabase
                .from('game_scores')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(300);
            if (!error && Array.isArray(data) && data.length > 0) {
                results = data;
            }
        } catch (e) {
            console.warn('Supabase query error, fallback to cache:', e.message);
        }
    }

    if (results.length === 0 && SERVER_SCORES_CACHE.length > 0) {
        results = [...SERVER_SCORES_CACHE];
    }

    res.json({ success: true, data: results });
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
