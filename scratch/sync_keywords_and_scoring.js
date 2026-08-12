const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'cyber_shield_detective.html');
const targetServer = path.join(__dirname, '..', 'server.js');

const CASES_WITH_KEYWORDS = [
    {
        id: 1,
        section: "มาตรา 5",
        image: "assets/evidence/case_ev_8f3a9b21.png",
        title: "แอบส่องระบบไอดีเกมของเพื่อน",
        brief: "แชมป์แอบจำรหัสผ่านแท็บเล็ตของป๊อปตอนที่ป๊อปลุกไปเข้าห้องน้ำ แชมป์แอบเอาแท็บเล็ตมาปลดล็อกแล้วส่องดูคลังไอเทมสุดแรร์ในเกมออนไลน์",
        phases: [
            "ช่อง 1-3: แชมป์แอบดูป๊อปจิ้มรหัสผ่านล็อกอินแท็บเล็ต พอป๊อปลุกไปห้องน้ำ แชมป์แอบนำแท็บเล็ตมาลากนิ้วปลดล็อกเข้าระบบสำเร็จ",
            "ช่อง 4-6: แชมป์แอบเปิดส่องดูคลังอาวุธและไอเทมเกมของป๊อป ป๊อปกลับมาเจอคาหนังคาเขาจึงพาไปพบคุณครูเพื่อรายงานพฤติกรรม",
            "ช่อง 7-9: ตำรวจไซเบอร์ตักเตือนและชี้แจงความผิดทางกฎหมาย ทั้งสองปรับความเข้าใจกัน และป๊อปเปิดใช้ระบบล็อกอิน 2 ชั้น (2FA) ส่ง OTP ยืนยันตัวตน"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 5 (แอบเข้าถึงระบบคอมพิวเตอร์ผู้อื่นโดยมิชอบ)",
        standard_penalty: "จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "สั่ง Log out ออกจากระบบทุกเครื่องทันที และรีบเปลี่ยนรหัสผ่านใหม่",
        standard_prevention: "เปิดใช้งานระบบยืนยันตัวตน 2 ชั้น (2FA / OTP) และล็อกหน้าจอทุกครั้ง",
        keywords_law: ["มาตรา 5", "5", "เข้าระบบ", "มิชอบ", "แอบเข้า", "เข้าถึงระบบ", "แอบส่อง", "แอบล็อกอิน"],
        keywords_penalty: ["6 เดือน", "หกเดือน", "10,000", "หนึ่งหมื่น", "10000", "หมื่นบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["logout", "log out", "ออกจากระบบ", "เปลี่ยนรหัส", "เปลี่ยนพาส", "แจ้งครู", "แจ้งผู้ปกครอง", "รายงาน"],
        keywords_security: ["2fa", "two-factor", "otp", "ล็อกอิน 2 ชั้น", "สองชั้น", "ล็อกหน้าจอ", "ยืนยันตัวตน"]
    },
    {
        id: 2,
        section: "มาตรา 6",
        image: "assets/evidence/case_ev_4e7c1d89.png",
        title: "แจกรหัสผ่านระบบในกลุ่ม Discord",
        brief: "ทอยแอบถ่ายรูปกระดาษโน้ตรหัสผ่านเซิร์ฟเวอร์ข้อสอบที่โต๊ะครู แล้วส่งให้บีดู บีอยากได้ยอดไลก์จึงนำรูปภาพรหัสผ่านไปโพสต์แจกในกลุ่ม Discord",
        phases: [
            "ช่อง 1-3: ทอยพบกระดาษโน้ตรหัสผ่านแปะหลังจอคอมครูห้องสมุด จึงแอบถ่ายรูปส่งต่อให้บีดูในแชทลับ",
            "ช่อง 4-6: บีนำภาพรหัสผ่านไปโพสต์แจกในกลุ่ม Discord สาธารณะ ส่งผลให้ระบบสอบมีไอพีแปลกปลอมล็อกอินเข้ามารัวๆ จนระบบเตือนภัย",
            "ช่อง 7-9: ครูและตำรวจตามสืบประวัติแชทจนพบตัวผู้ปล่อยรหัส ดำเนินการตามขั้นตอนกฎหมาย และคุณครูนำสอนการตั้งรหัสผ่านที่ซับซ้อน ปลอดภัยกว่า"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 6 (เปิดเผยมาตรการป้องกันการเข้าถึงระบบโดยมิชอบ)",
        standard_penalty: "จำคุกไม่เกิน 1 ปี หรือปรับไม่เกิน 20,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "รีบเปลี่ยนรหัสผ่านระบบทันที และลบข้อความที่โพสต์แจกใน Discord",
        standard_prevention: "ตั้งรหัสผ่านซับซ้อน (ตัวพิมพ์ใหญ่+เล็ก+เลข+สัญลักษณ์) และไม่จดรหัสผ่านทิ้งไว้",
        keywords_law: ["มาตรา 6", "6", "เปิดเผย", "มาตรการป้องกัน", "แจกรหัส", "เผยแพร่รหัส", "ปล่อยรหัส"],
        keywords_penalty: ["1 ปี", "หนึ่งปี", "20,000", "สองหมื่น", "20000", "หมื่น", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["เปลี่ยนรหัส", "ลบข้อความ", "แจ้งแอดมิน", "discord", "ตัดเซสชัน", "บล็อก"],
        keywords_security: ["รหัสผ่านซับซ้อน", "ตัวพิมพ์ใหญ่", "ตัวเลข", "สัญลักษณ์", "ห้ามจด", "password manager", "ความลับ"]
    },
    {
        id: 3,
        section: "มาตรา 7",
        image: "assets/evidence/case_ev_9a2b5f34.png",
        title: "แอบคุ้ยไฟล์ไดอารี่แชทลับส่วนตัว",
        brief: "นักเรียนแอบเปิดโฟลเดอร์ส่วนตัวของเพื่อนที่ล็อกรหัสผ่านไว้ แล้วแอบดูดไฟล์ไดอารี่และรูปถ่ายลับเอาไปเผยแพร่นินทาในกลุ่มเพื่อน",
        phases: [
            "ช่อง 1-3: สบโอกาสแอบเข้าเครื่องคอมที่เพื่อนตั้งล็อกโฟลเดอร์ไว้ แอบถอดรหัสผ่านเพื่อเข้าถึงไฟล์ข้อมูลส่วนตัว",
            "ช่อง 4-6: แอบดาวน์โหลดไฟล์ไดอารี่และแชทส่วนตัวส่งต่อไปนินทาในกลุ่มเพื่อน ทำให้เจ้าของข้อมูลได้รับความอับอายและเสียหาย",
            "ช่อง 7-9: ฝ่ายไอทีตรวจพบประวัติการเข้าถึงไฟล์ ชี้แจงบทลงโทษทางกฎหมายต่อการละเมิดข้อมูลส่วนตัว และแนะนำการเข้ารหัสไฟล์ (Encryption) และการล็อกด้วย Face ID"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 7 (เข้าถึงข้อมูลคอมพิวเตอร์ของผู้อื่นโดยมิชอบ)",
        standard_penalty: "จำคุกไม่เกิน 2 ปี หรือปรับไม่เกิน 40,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "ลบไฟล์ที่รั่วไหล และเปลี่ยนรหัสผ่านพื้นที่จัดเก็บคลาวด์ทันที",
        standard_prevention: "ตั้งรหัสล็อกโฟลเดอร์ด้วยสแกนใบหน้า/ลายนิ้วมือ (Face ID) และเข้ารหัสไฟล์ (Encryption)",
        keywords_law: ["มาตรา 7", "7", "เข้าถึงข้อมูล", "ข้อมูลคอมพิวเตอร์", "ไดอารี่", "คุ้ยไฟล์", "ดูดไฟล์"],
        keywords_penalty: ["2 ปี", "สองปี", "40,000", "สี่หมื่น", "40000", "หมื่น", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบไฟล์", "เปลี่ยนรหัส", "แจ้งระงับ", "แจ้งครู", "แจ้งแอดมิน"],
        keywords_security: ["สแกนใบหน้า", "ลายนิ้วมือ", "face id", "biometrics", "เข้ารหัส", "encryption", "ล็อกโฟลเดอร์"]
    },
    {
        id: 4,
        section: "มาตรา 8",
        image: "assets/evidence/case_ev_1c8e7b54.png",
        title: "ดักจับข้อมูลธุรกรรมเติมเกมกลางทาง",
        brief: "มีผู้ไม่หวังดีปล่อยสัญญาณ Wi-Fi ฟรีปลอมในโรงอาหาร เพื่อดักจับข้อมูลบัตรเติมเงินและรหัสผ่านธุรกรรมของเพื่อนที่กำลังเติมเกมออนไลน์",
        phases: [
            "ช่อง 1-3: แฮกเกอร์เปิด Free Wi-Fi ปลอมดักเหยื่อที่หลงเข้ามาเชื่อมต่อเพื่อทำรายการเติมเงินเกมออนไลน์",
            "ช่อง 4-6: ดักจับข้อมูลหมายเลขบัตรและรหัสผ่านระหว่างทาง เงินในบัญชีเหยื่อถูกดูดออกไปทันที",
            "ช่อง 7-9: เจ้าหน้าที่ตำรวจไซเบอร์แกะรอยสัญญาณจับกุมผู้ปล่อยสัญญาณดักข้อมูล ดำเนินคดีตามกฎหมาย และแนะนำให้ใช้งานเครือข่ายที่มีการเข้ารหัส SSL/HTTPS / VPN"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 8 (ดักรับข้อมูลคอมพิวเตอร์ของผู้อื่นที่อยู่ระหว่างการส่งโดยมิชอบ)",
        standard_penalty: "จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 60,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "ตัดการเชื่อมต่อ Wi-Fi ทันที และรีบแจ้งอายัดบัตรกับธนาคารและค่ายเกม",
        standard_prevention: "ใช้เครือข่ายที่มีการเข้ารหัส SSL / HTTPS / VPN และหลีกเลี่ยงการทำธุรกรรมบน Free Wi-Fi สาธารณะ",
        keywords_law: ["มาตรา 8", "8", "ดักรับ", "ดักจับ", "ระหว่างการส่ง", "ข้อมูลคอมพิวเตอร์", "ดักข้อมูล"],
        keywords_penalty: ["3 ปี", "สามปี", "60,000", "หกหมื่น", "60000", "หมื่น", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ตัด wifi", "หยุดทำธุรกรรม", "อายัดบัตร", "แจ้งธนาคาร", "แจ้งค่ายเกม", "เปลี่ยนพาส"],
        keywords_security: ["ssl", "https", "vpn", "เข้ารหัสข้อมูล", "encryption", "หลีกเลี่ยง wifi ฟรี", "public wifi"]
    },
    {
        id: 5,
        section: "มาตรา 9",
        image: "assets/evidence/case_ev_6a92f03d.png",
        title: "มือบอนแอบลบไฟล์โครงงานวิทย์เพื่อน",
        brief: "นักเรียนอิจฉากลุ่มเพื่อนที่ทำสไลด์โครงงานวิทย์สวยงาม จึงแอบเข้าไปใน Cloud Shared Drive แล้วกดลบไฟล์งานและแก้ไขเนื้อหาจนเสียหายทั้งหมด",
        phases: [
            "ช่อง 1-3: อาศัยจังหวะที่ได้รับสิทธิ์แชร์ไฟล์ แอบเปิดเข้าไปในโฟลเดอร์โครงงานวิทยาศาสตร์ของเพื่อนกลุ่มอื่น",
            "ช่อง 4-6: มือบอนกดสั่งลบไฟล์สไลด์และแก้ไขข้อมูลจนเสียหาย เพื่อนๆ ในกลุ่มร้องไห้ตกใจเพราะใกล้ถึงเวลาส่งงาน",
            "ช่อง 7-9: ครูไอทีตรวจสอบประวัติแก้ไข (Version History) และกู้คืนไฟล์ได้สำเร็จ ผู้กระทำผิดโดนดำเนินการทางวินัยและกฎหมาย พร้อมสอนการตั้งสิทธิ์ Read-Only"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 9 (ทำให้เสียหาย ทำลาย แก้ไข เปลี่ยนแปลงข้อมูลคอมพิวเตอร์ผู้อื่นโดยมิชอบ)",
        standard_penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "ใช้ปุ่มประวัติเวอร์ชัน (Version History) กู้คืนไฟล์ทันที และตรวจสอบ Audit Log",
        standard_prevention: "ตั้งค่าสิทธิ์ไฟล์เป็น 'อ่านได้อย่างเดียว (Read-Only)' และจำกัดการแชร์เฉพาะอีเมลที่จำเป็น",
        keywords_law: ["มาตรา 9", "9", "ทำลาย", "แก้ไข", "ลบไฟล์", "เปลี่ยนแปลงข้อมูล", "เสียหาย"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["version history", "ประวัติเวอร์ชัน", "กู้คืน", "restore", "ถังขยะ", "recycle bin", "activity log"],
        keywords_security: ["read-only", "อ่านอย่างเดียว", "จำกัดสิทธิ์", "permission", "แชร์เฉพาะอีเมล", "backup", "สำรองข้อมูล"]
    },
    {
        id: 6,
        section: "มาตรา 10",
        image: "assets/evidence/case_ev_3f81e6ac.png",
        title: "ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบโรงเรียน",
        brief: "นักเรียนไม่อยากสอบเก็บคะแนน จึงใช้โปรแกรมยิงทราฟฟิกขยะ (DDoS) ถล่มเว็บไซต์ระบบสอบออนไลน์ของโรงเรียนจนเซิร์ฟเวอร์ล่ม ใช้งานไม่ได้",
        phases: [
            "ช่อง 1-3: นักเรียนสั่งรันบอทโปรแกรมส่งคำขอปลอมจำนวนมหาศาลไปยังเซิร์ฟเวอร์เว็บสอบของโรงเรียน",
            "ช่อง 4-6: เซิร์ฟเวอร์ทำงานหนักจนร้อนจัดและระบบล่ม เว็บขึ้น Error นักเรียนทั้งโรงเรียนไม่สามารถสอบได้",
            "ช่อง 7-9: แอดมินบล็อกไอพีผู้โจมตีและสืบพบตัวผู้ปล่อยบอท ดำเนินการตามกฎหมาย และติดตั้งระบบป้องกัน Firewall / DDoS Protection"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 10 (รบกวน ขัดขวาง ทำให้ระบบคอมพิวเตอร์ผู้อื่นทำงานไม่ได้ตามปกติ)",
        standard_penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "บล็อก IP Address ขยะ สลับเส้นทางเซิร์ฟเวอร์สำรอง และแจ้งฝ่ายไอที",
        standard_prevention: "ติดตั้งไฟร์วอลล์ (Firewall) และใช้ระบบป้องกัน DDoS Protection (เช่น Cloudflare / Rate Limiting)",
        keywords_law: ["มาตรา 10", "10", "ขัดขวาง", "รบกวน", "ระงับการทำงาน", "พังระบบ", "ddos", "ระบบล่ม"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["บล็อก ip", "block ip", "สลับเซิร์ฟเวอร์", "แจ้งไอที", "แจ้งครู", "รีสตาร์ท"],
        keywords_security: ["firewall", "ไฟร์วอลล์", "ddos protection", "cloudflare", "waf", "rate limit", "load balancer"]
    },
    {
        id: 7,
        section: "มาตรา 11 วรรคหนึ่ง",
        image: "assets/evidence/case_ev_e920d57b.png",
        title: "ส่งอีเมลสแปมขายของปลอมตัวตน",
        brief: "ผู้ค้ายิงอีเมลขยะขายสินค้าและโฆษณาชวนเชื่อไปยังกล่องข้อความของนักเรียนนับพันคน โดยปลอมแปลงชื่อผู้ส่งและปกปิดแหล่งที่มาที่แท้จริง",
        phases: [
            "ช่อง 1-3: พ่อค้าออนไลน์ส่งอีเมลโฆษณาหว่านไปยังกล่องจดหมายเด็กนักเรียน โดยปิดบังชื่อจริงและไอพี",
            "ช่อง 4-6: กล่องจดหมายนักเรียนเต็มไปด้วยสแปม รบกวนเวลาเรียนและเสี่ยงติดมัลแวร์",
            "ช่อง 7-9: ฝ่ายไอทีตั้งค่าระบบกรองสแปม บล็อกโดเมนปลอม และแนะนำการตั้งค่า Anti-Spam Filter"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคหนึ่ง (ส่งข้อมูลคอมพิวเตอร์หรืออีเมลโดยปกปิดหรือปลอมแปลงแหล่งที่มา)",
        standard_penalty: "ปรับไม่เกิน 100,000 บาท",
        standard_remedy: "ทำเครื่องหมายเป็นสแปม (Mark as Spam) และรายงานผู้ให้บริการอีเมล",
        standard_prevention: "ติดตั้งระบบกรองอีเมลขยะ (Anti-Spam Filter) และตรวจสอบ SPF/DKIM Record",
        keywords_law: ["มาตรา 11", "11", "วรรคหนึ่ง", "สแปม", "ปกปิดแหล่งที่มา", "ปลอมแปลง", "อีเมลขยะ"],
        keywords_penalty: ["100,000", "หนึ่งแสน", "100000", "ปรับไม่เกิน 1 แสน", "ปรับ"],
        keywords_remedy: ["spam", "junk", "เมลขยะ", "รายงาน", "report", "แบน", "บล็อกผู้ส่ง"],
        keywords_security: ["anti-spam", "กรองเมลขยะ", "filter", "spf", "dkim", "dmarc", "บล็อกผู้ส่งปลอม"]
    },
    {
        id: 8,
        section: "มาตรา 11 วรรคสอง",
        image: "assets/evidence/case_ev_b2c5d810.png",
        title: "บอทสแปมรัวๆ ปิดปุ่มยกเลิกรับข่าวสาร",
        brief: "ระบบบอทยิงข้อความโฆษณารัวๆ เข้ามือถือนักเรียนตลอดทั้งวัน โดยจงใจไม่ใส่ปุ่ม Unsubscribe หรือช่องทางยกเลิกรับข่าวสาร",
        phases: [
            "ช่อง 1-3: ข้อความแจ้งเตือนโฆษณาเด้งรัวๆ ทุกชั่วโมง นักเรียนกดหาปุ่มยกเลิกแต่ไม่พบ",
            "ช่อง 4-6: สร้างความเดือดร้อนรำคาญ แบตเตอรี่มือถือหมดไวและรบกวนการใช้ชีวิตประจำวัน",
            "ช่อง 7-9: ร้องเรียนไปยัง กสทช. และผู้ให้บริการเครือข่ายบล็อกผู้ส่ง พร้อมแนะนำการใช้ Email Alias"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 11 วรรคสอง (ส่งข้อมูลหรือจดหมายอิเล็กทรอนิกส์รบกวน โดยไม่เปิดโอกาสให้บอกเลิกได้โดยง่าย)",
        standard_penalty: "ปรับไม่เกิน 200,000 บาท",
        standard_remedy: "แคปหลักฐานข้อความ ร้องเรียนผู้ให้บริการเครือข่าย และบล็อกเบอร์/ผู้ส่ง",
        standard_prevention: "ไม่กรอกเบอร์โทรหรืออีเมลในเว็บที่ไม่น่าเชื่อถือ และใช้ระบบ Email Alias",
        keywords_law: ["มาตรา 11", "11", "วรรคสอง", "ไม่เปิดโอกาส", "ยกเลิก", "unsubscribe", "รบกวน", "เดือดร้อนรำคาญ"],
        keywords_penalty: ["200,000", "สองแสน", "200000", "ปรับไม่เกิน 2 แสน", "ปรับ"],
        keywords_remedy: ["แคปรูป", "ร้องเรียน", "แจ้งแพลตฟอร์ม", "บล็อก", "report"],
        keywords_security: ["ไม่แปะเบอร์", "ไม่แปะเมล", "บอร์ดสาธารณะ", "email alias", "ความเป็นส่วนตัว", "privacy"]
    },
    {
        id: 9,
        section: "มาตรา 14(1)",
        image: "assets/evidence/case_ev_7f1e4a9c.png",
        title: "สร้างเว็บฟิชชิ่งหลอกสกินเกมฟรี",
        brief: "คนร้ายสร้างหน้าเว็บล็อกอินปลอมที่หน้าตาเหมือนเว็บเกมดัง อ้างแจกสกินปืนและเพชรฟรี เพื่อหลอกเอาไอดีและรหัสผ่านของเหยื่อ",
        phases: [
            "ช่อง 1-3: คนร้ายแชร์ลิงก์เว็บปลอมในกลุ่มเกม อ้างว่าแจกเพชรฟรี ให้กดล็อกอินรับสิทธิ์",
            "ช่อง 4-6: เหยื่อหลงเชื่อกรอกไอดีและรหัสผ่าน ไอดีเกมถูกขโมยและไอเทมโดนโอนออกหมด",
            "ช่อง 7-9: แจ้งทีมงานเกมกู้คืนไอดี ตำรวจแกะรอยดำเนินคดี และสอนการสังเกต URL เว็บทางการ"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(1) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลปลอมหรือข้อมูลเท็จ หลอกลวงประชาชน)",
        standard_penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "รีบแจ้งทีมงานค่ายเกมเพื่อระงับและกู้คืนบัญชี และเตือนเพื่อนไม่ให้หลงเชื่อ",
        standard_prevention: "ตรวจสอบ URL และชื่อโดเมนให้ถูกต้องทุกครั้ง และไม่หลงเชื่อลิงก์แจกของฟรี",
        keywords_law: ["มาตรา 14(1)", "14 (1)", "14(1)", "14", "ข้อมูลเท็จ", "หลอกลวง", "ฟิชชิ่ง", "phishing", "เว็บปลอม"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["แจ้งค่ายเกม", "ระงับบัญชี", "กู้คืน", "เปลี่ยนรหัส", "เตือนเพื่อน"],
        keywords_security: ["ตรวจ url", "domain", "โดเมน", "ลิงก์ปลอม", "ไม่คลิกลิงก์", "เว็บทางการ", "official"]
    },
    {
        id: 10,
        section: "มาตรา 14(2)",
        image: "assets/evidence/case_ev_5d9c2e71.png",
        title: "โพสต์ข่าวลวงภัยพิบัติจนคนแตกตื่นวิ่งวุ่น",
        brief: "นักเรียนคึกคะนองกุเรื่องข่าวปลอมโพสต์ลง TikTok ว่า 'พรุ่งนี้น้ำท่วมเมือง 3 เมตร เขื่อนแตกแล้ว!' จนชาวบ้านแตกตื่นแย่งกันซื้อของกักตุนวุ่นวาย",
        phases: [
            "ช่อง 1-3: นักเรียนแต่งข้อความข่าวปลอมเรื่องภัยพิบัติเขื่อนแตกแล้วโพสต์ลงโซเชียลมีเดียเพื่อหายอดวิว",
            "ช่อง 4-6: ข่าวถูกแชร์ต่ออย่างรวดเร็ว ชาวบ้านแตกตื่นแห่ไปกักตุนสินค้าจนเกิดความโกลาหลทั่วเมือง",
            "ช่อง 7-9: เจ้าหน้าที่ตรวจสอบข้อเท็จจริง จับกุมผู้โพสต์ดำเนินคดี และประชาสัมพันธ์ให้เช็กก่อนแชร์"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(2) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลเท็จ ก่อให้เกิดความตระหนกตกใจแก่ประชาชน)",
        standard_penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "ลบโพสต์ข่าวปลอมทันที และโพสต์ชี้แจงความจริงพร้อมอ้างอิงแหล่งข่าวทางการ",
        standard_prevention: "ตรวจสอบข้อมูลกับศูนย์ต่อต้านข่าวปลอม (Anti-Fake News Center) หรือหน่วยงานรัฐก่อนแชร์",
        keywords_law: ["มาตรา 14(2)", "14 (2)", "14(2)", "14", "ตื่นตระหนก", "ข่าวปลอม", "fake news", "ข้อมูลเท็จ", "ตระหนกตกใจ"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบโพสต์", "ลบข่าวปลอม", "แถลงแก้ข่าว", "โพสต์แก้", "ชี้แจง"],
        keywords_security: ["ศูนย์ต่อต้านข่าวปลอม", "anti-fake news", "เช็กก่อนแชร์", "แหล่งข่าวทางการ", "verified"]
    },
    {
        id: 11,
        section: "มาตรา 14(4)",
        image: "assets/evidence/case_ev_a3f8c1d5.png",
        title: "โพสต์ภาพ/คลิปโป๊ลงคอมพิวเตอร์สาธารณะ",
        brief: "วัยรุ่นนำภาพและคลิปลามกอนาจารไปโพสต์ลงในกลุ่มเฟซบุ๊กสาธารณะและส่งต่อในดิสคอร์ดโรงเรียนที่มีคนทั่วไปเข้าถึงได้",
        phases: [
            "ช่อง 1-3: ผู้ใช้แชร์ภาพและคลิปลามกอนาจารลงในพื้นที่สาธารณะของโรงเรียน",
            "ช่อง 4-6: สมาชิกในกลุ่มพบเห็นและได้รับผลกระทบทางจิตใจ มีการส่งต่อจนแพร่กระจาย",
            "ช่อง 7-9: แอดมินลบเนื้อหา บล็อกบัญชีผู้โพสต์ และตำรวจไซเบอร์เข้าตรวจสอบดำเนินคดีตามกฎหมาย"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 14(4) (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งข้อมูลคอมพิวเตอร์ใดๆ ที่มีลักษณะอันลามก)",
        standard_penalty: "จำคุกไม่เกิน 5 ปี หรือปรับไม่เกิน 100,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "แอดมินลบภาพและคลิปออกจากระบบทันที บล็อกผู้ส่ง และรายงานแพลตฟอร์ม",
        standard_prevention: "เปิดใช้งานระบบ SafeSearch และตัวกรองเนื้อหาลามกอัตโนมัติ (Content Filtering)",
        keywords_law: ["มาตรา 14(4)", "14 (4)", "14(4)", "14", "ลามก", "อนาจาร", "คลิปโป๊", "18+"],
        keywords_penalty: ["5 ปี", "ห้าปี", "100,000", "หนึ่งแสน", "100000", "แสนบาท", "ทั้งจำทั้งปรับ"],
        keywords_remedy: ["ลบคลิป", "ลบวิดีโอ", "ลบภาพ", "แอดมินลบ", "บล็อก", "report", "รายงาน"],
        keywords_security: ["safesearch", "safe search", "content filter", "ตัวกรอง", "กรองเนื้อหา", "moderation"]
    },
    {
        id: 12,
        section: "มาตรา 16",
        image: "assets/evidence/case_ev_c4e7a2b9.png",
        title: "ตัดต่อหน้าเพื่อนใส่เอเลี่ยนประจานในโซเชียล",
        brief: "นักเรียนแกล้งเพื่อนโดยนำรูปหน้าเพื่อนไปตัดต่อใส่ร่างเอเลี่ยนน่าเกลียดน่ากลัว แล้วโพสต์ประจานลงใน Instagram พร้อมแคปชั่นล้อเลียนทำให้อับอาย",
        phases: [
            "ช่อง 1-3: แอบเซฟรูปหน้าเพื่อนแล้วใช้แอปตัดต่อใส่ร่างเอเลี่ยนน่าเกลียด",
            "ช่อง 4-6: โพสต์ลง Instagram สาธารณะ มีคนเข้ามากดขำและแชร์ต่อ เพื่อนที่โดนแกล้งร้องไห้เสียใจและอับอาย",
            "ช่อง 7-9: ครูและผู้ปกครองเข้าตักเตือน แจ้งลบโพสต์ และให้ผู้กระทำผิดขอโทษ พร้อมให้ความรู้เรื่อง Cyberbullying"
        ],
        standard_law: "พ.ร.บ. คอมพิวเตอร์ มาตรา 16 (นำเข้าสู่ระบบคอมพิวเตอร์ซึ่งภาพตัดต่อ ดัดแปลง ทำให้ผู้อื่นเสียชื่อเสียง ถูกดูหมิ่น อับอาย)",
        standard_penalty: "จำคุกไม่เกิน 3 ปี หรือปรับไม่เกิน 200,000 บาท หรือทั้งจำทั้งปรับ",
        standard_remedy: "แคปหลักฐานภาพและลิงก์ แจ้งแพลตฟอร์มลบภาพ และแจ้งคุณครู/ผู้ปกครอง",
        standard_prevention: "ตั้งค่าบัญชีเป็นส่วนตัว (Private Account) และไม่ยินยอมให้ผู้อื่นนำรูปไปใช้",
        keywords_law: ["มาตรา 16", "16", "ตัดต่อ", "ดัดแปลง", "เสียชื่อเสียง", "ดูหมิ่น", "อับอาย", "cyberbullying", "ประจาน"],
        keywords_penalty: ["3 ปี", "สามปี", "200,000", "สองแสน", "200000", "แสนบาท", "ปรับ"],
        keywords_remedy: ["แคปรูป", "แคปหลักฐาน", "แจ้งลบ", "report", "cyberbullying", "แจ้งครู", "แจ้งผู้ปกครอง"],
        keywords_security: ["private account", "ตั้งค่าส่วนตัว", "จำกัดแท็ก", "ไม่แชร์รูปสาธารณะ", "จริยธรรม"]
    }
];

console.log('Synchronizing ALL_12_CASES across frontend and backend...');

// Update HTML
let html = fs.readFileSync(targetHtml, 'utf8');
const casesJson = JSON.stringify(CASES_WITH_KEYWORDS, null, 8);
html = html.replace(/const ALL_12_CASES = \[[\s\S]*?\];/, `const ALL_12_CASES = ${casesJson};`);

// Update local single role evaluation in HTML
const newLocalEvalFn = `        // --- Robust Local Single Role Evaluation Fallback ---
        function localSingleRoleEvaluation(caseItem, roleKey, answer) {
            const clean = answer.trim().toLowerCase();
            
            // Gibberish check
            const evasive = /^(ไม่รู้|ไม่ทราบ|ไม่บอก|มั่ว|กวน|ขี้เกียจ|ไม่มี|ไม่แน่ใจ|ไม่รู้อะไรเลย|ช่างมัน|ไม่ตอบ|5555|asdf|ฟกห)/i;
            if (clean.length < 15 || evasive.test(clean)) {
                return {
                    role: roleKey,
                    score: 0,
                    feedback: roleKey === 'legal'
                        ? 'ยังไม่สามารถให้คะแนนได้ เนื่องจากข้อความไม่ได้ระบุฐานความผิดหรือบทวิเคราะห์ที่สอดคล้องกับพฤติการณ์ในคดี โปรดอ่านรายละเอียดแล้วตอบตามหลักกฎหมาย'
                        : roleKey === 'remedy'
                        ? 'ยังไม่สามารถให้คะแนนได้ เนื่องจากไม่ได้ระบุขั้นตอนการระงับเหตุเฉพาะหน้า เมื่อเกิดเหตุไซเบอร์ต้องพิจารณาวิธีตัดวงจรความเสียหายทันที และระบุผู้เกี่ยวข้อง'
                        : 'ยังไม่สามารถให้คะแนนได้ เนื่องจากยังไม่ได้เสนอแนะระบบหรือเครื่องมือความปลอดภัยทางเทคนิค ลองระบุเครื่องมือเทคโนโลยีที่ช่วยปิดช่องโหว่ระยะยาว'
                };
            }

            let score = 0;
            let feedback = '';

            if (roleKey === 'legal') {
                const hasLaw = (caseItem.keywords_law || []).some(k => clean.includes(k.toLowerCase())) || 
                                (caseItem.section && clean.includes(caseItem.section.toLowerCase())) ||
                                (caseItem.standard_law && clean.includes(caseItem.standard_law.toLowerCase()));
                
                const hasPenaltySpecific = (caseItem.keywords_penalty || []).some(k => clean.includes(k.toLowerCase()));
                const hasPenaltyGeneral = (clean.includes("คุก") || clean.includes("จำคุก")) && (clean.includes("ปรับ") || clean.includes("บาท"));

                if (hasLaw) {
                    score += 4;
                } else if (clean.includes("พ.ร.บ") || clean.includes("มาตรา") || clean.includes("pdpa") || clean.includes("กฎหมาย")) {
                    score += 2.5;
                }

                if (hasPenaltySpecific) {
                    score += 3;
                } else if (hasPenaltyGeneral || clean.includes("คุก") || clean.includes("ปรับ") || clean.includes("ปี") || clean.includes("เดือน") || clean.includes("บาท")) {
                    score += 2;
                }

                if (hasLaw && (hasPenaltySpecific || hasPenaltyGeneral)) {
                    score += 3; // Completeness bonus
                } else if (hasLaw && clean.length >= 25) {
                    score += 2;
                } else if (clean.length >= 20) {
                    score += 1;
                }

                score = Math.min(10, Math.max(0, score));

                if (score >= 9) {
                    feedback = 'วิเคราะห์ฐานความผิดทางกฎหมายและระบุอัตราโทษจำคุก/ปรับได้อย่างถูกต้อง แม่นยำ ครบถ้วนสมบูรณ์ตามหลัก พ.ร.บ.คอมพิวเตอร์ / PDPA';
                } else if (score >= 6) {
                    feedback = hasLaw 
                        ? 'วิเคราะห์ทิศทางฐานความผิดได้ถูกต้องแล้ว และสามารถระบุรายละเอียดอัตราโทษหรือเหตุผลประกอบเพิ่มเติมให้ชัดเจนเพื่อคะแนนเต็ม'
                        : 'ระบุอัตราโทษได้น่าสนใจ แต่ควรระบุมาตราหรือฐานความผิดตาม พ.ร.บ.คอมพิวเตอร์ / PDPA ให้ตรงประเด็นของคดี';
                } else {
                    feedback = 'ฐานความผิดและโทษที่ระบุยังไม่สอดคล้องกับพฤติการณ์ในคดีนี้ ลองพิจารณาว่าเหตุการณ์ในการ์ตูนเป็นการกระทำต่อระบบ ข้อมูล หรือเป็นการเผยแพร่/หลอกลวง เพื่อเลือกมาตราให้ตรงจุดยิ่งขึ้น';
                }

            } else if (roleKey === 'remedy') {
                const hasRemedyAction = (caseItem.keywords_remedy || []).some(k => clean.includes(k.toLowerCase()));
                const hasStakeholder = ["ครู", "ผู้ปกครอง", "พ่อ", "แม่", "ตำรวจ", "แอดมิน", "แพลตฟอร์ม", "ธนาคาร", "ค่ายเกม", "ผู้ดูแล"].some(s => clean.includes(s));

                if (hasRemedyAction) {
                    score += 4.5;
                } else if (clean.includes("ลบ") || clean.includes("เปลี่ยน") || clean.includes("แจ้ง") || clean.includes("บล็อก") || clean.includes("กู้") || clean.includes("หยุด") || clean.includes("อายัด")) {
                    score += 3;
                }

                if (hasStakeholder) {
                    score += 3;
                } else if (clean.includes("บอก") || clean.includes("ช่วย") || clean.includes("รายงาน") || clean.includes("ปรึกษา")) {
                    score += 2;
                }

                if (hasRemedyAction && (hasStakeholder || clean.length >= 30)) {
                    score += 2.5;
                } else if (clean.length >= 20) {
                    score += 1;
                }

                score = Math.min(10, Math.max(0, score));

                if (score >= 9) {
                    feedback = 'ลำดับขั้นตอนการบรรเทาความเสียหายเฉพาะหน้าได้อย่างรวดเร็ว มีสติ และระบุผู้เกี่ยวข้องในการระงับเหตุได้อย่างตรงจุดและปฏิบัติได้จริง';
                } else if (score >= 6) {
                    feedback = hasRemedyAction
                        ? 'มีแนวคิดการหยุดเหตุเฉพาะหน้าได้ดีแล้ว ควรระบุบุคคลหรือผู้ดูแลระบบที่ต้องประสานงานแจ้งเหตุฉุกเฉินเพิ่มเติมเพื่อให้การช่วยเหลือรวดเร็วยิ่งขึ้น'
                        : 'ระบุผู้รับแจ้งเหตุได้ดี แต่ควรเพิ่มขั้นตอนการระงับความเสียหายทางเทคนิคเฉพาะหน้าด้วย';
                } else {
                    feedback = 'แนวทางรับมือยังไม่ตรงกับลักษณะภัยไซเบอร์ในคดีนี้ ควรพิจารณาวิธีตัดวงจรความเสียหายทันที เช่น เปลี่ยนรหัส บล็อกไอพี หรือกู้คืนข้อมูล';
                }

            } else { // Security Engineer
                const hasSecurityTool = (caseItem.keywords_security || []).some(k => clean.includes(k.toLowerCase()));

                if (hasSecurityTool) {
                    score += 5;
                } else if (clean.includes("รหัส") || clean.includes("ระบบ") || clean.includes("ป้องกัน") || clean.includes("ตั้งค่า") || clean.includes("ล็อก") || clean.includes("สิทธิ์") || clean.includes("กรอง")) {
                    score += 3;
                }

                if (hasSecurityTool && (clean.includes("ทำได้") || clean.includes("ง่าย") || clean.includes("ตั้ง") || clean.includes("เปิด") || clean.includes("เพื่อ") || clean.includes("ป้องกัน") || clean.includes("บล็อก"))) {
                    score += 3;
                } else if (hasSecurityTool) {
                    score += 2;
                }

                if (hasSecurityTool && clean.length >= 30) {
                    score += 2;
                } else if (clean.length >= 20) {
                    score += 1;
                }

                score = Math.min(10, Math.max(0, score));

                if (score >= 8) {
                    feedback = 'ข้อเสนอแนะแนวทางปฏิบัติหรือเครื่องมือป้องกันความปลอดภัยตรงกับคดีนี้ได้อย่างสมบูรณ์แบบ!';
                } else if (score >= 6) {
                    feedback = 'ตอบแนวทางป้องกันตรงคดีแล้ว แนะนำให้ระบุวิธีหรือเครื่องมือป้องกันประจำคดีนี้เพิ่มเติมเพื่อให้ได้คะแนนสูงขึ้น';
                } else {
                    feedback = 'มาตรการป้องกันที่เสนอยังไม่ตรงกับช่องโหว่ความเสี่ยงของคดีนี้ ลองวิเคราะห์จุดผิดพลาดแล้วเสนอแนวทางป้องกันที่เหมาะสม';
                }
            }

            return { role: roleKey, score, feedback, mode: 'local_heuristic' };
        }`;

html = html.replace(/\/\/ --- Local Single Role Evaluation Fallback ---[\s\S]*?return \{ role: roleKey, score, feedback, mode: 'local_heuristic' \};\s*\}/, newLocalEvalFn);
fs.writeFileSync(targetHtml, html, 'utf8');

// Update Server
let server = fs.readFileSync(targetServer, 'utf8');
const serverCasesObj = {};
CASES_WITH_KEYWORDS.forEach(c => {
    serverCasesObj[c.id] = {
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
server = server.replace(/const CASE_REFERENCES = \{[\s\S]*?\n\};/, `const CASE_REFERENCES = ${JSON.stringify(serverCasesObj, null, 4)};`);

// Also update evaluateLocally in server.js
const serverEvalLocallyFn = `function evaluateLocally(caseId, studentAnswers) {
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
}`;

server = server.replace(/function evaluateLocally\(caseId, studentAnswers\) \{[\s\S]*?mode: "heuristic"\s*\};\s*\}/, serverEvalLocallyFn);
fs.writeFileSync(targetServer, server, 'utf8');

console.log('Successfully synchronized cases and updated scoring engine to guarantee 10/10 for complete answers!');
