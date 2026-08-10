<div align="center">
  <img src="favicon.png" alt="Cyber Shield Detective Logo" width="128" />
  <br/>
  <h1>🛡️ Cyber Shield Detective Platform</h1>
  <h3>แพลตฟอร์มเกมการเรียนรู้กฎหมายคอมพิวเตอร์ & PDPA สำหรับนักเรียน ม.3</h3>
  <p>ประเมินผลอัตนัยด้วย Google Gemini AI | ตรวจคะแนนเรียลไทม์ผ่าน Supabase | ระบบป้องกันโกงครบวงจร</p>

[![Platform](https://img.shields.io/badge/Platform-พ.ร.บ.คอมพิวเตอร์_&_PDPA-0284c7?style=for-the-badge&logo=shield)](cyber_shield_detective.html)
[![AI Engine](https://img.shields.io/badge/AI-Google_Gemini_API-ea4335?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Database](https://img.shields.io/badge/DB-Supabase_Realtime-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel_|_GitHub_Pages-000?style=for-the-badge&logo=vercel)](vercel.json)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](package.json)
</div>

---

## 📌 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [แผนผังไฟล์ทั้งหมด (Sitemap)](#️-แผนผังไฟล์ทั้งหมด-sitemap)
- [เกมหลัก: Cyber Shield Detective (อัตนัย + AI)](#-เกมหลัก-cyber-shield-detective-อัตนัย--ai)
  - [กติกาการเล่น](#กติกาการเล่น)
  - [ระบบ 3 บทบาท (3 Forensic Dimensions)](#ระบบ-3-บทบาท-3-forensic-dimensions)
  - [ระบบให้คะแนน (Scoring System)](#ระบบให้คะแนน-scoring-system)
  - [ระบบป้องกันโกง (Anti-Cheat)](#ระบบป้องกันโกง-anti-cheat)
  - [ใบเกียรติบัตร (Certificate)](#ใบเกียรติบัตร-certificate)
- [เกม v3: Cyber Detective (ปรนัย)](#-เกม-v3-cyber-detective-ปรนัย)
- [แดชบอร์ดครูผู้สอน](#-แดชบอร์ดครูผู้สอน)
- [แฟ้ม 12 คดีหลักฐานการ์ตูน 9 ช่อง](#-แฟ้ม-12-คดีหลักฐานการ์ตูน-9-ช่อง)
- [สถาปัตยกรรมโค้ด (Code Architecture)](#-สถาปัตยกรรมโค้ด-code-architecture)
- [ติดตั้ง Supabase Database](#-ติดตั้ง-supabase-database)
- [ตั้งค่า Environment Variables](#️-ตั้งค่า-environment-variables)
- [วิธีรันในเครื่อง (Local Setup)](#-วิธีรันในเครื่อง-local-setup)
- [Deploy ขึ้น Vercel / GitHub Pages](#-deploy-ขึ้น-vercel--github-pages)

---

## 🎯 ภาพรวมโปรเจกต์

**Cyber Shield Detective Platform** คือแพลตฟอร์มเว็บแอปพลิเคชันเพื่อการเรียนรู้เรื่อง **พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์** และ **PDPA** ออกแบบสำหรับนักเรียนชั้น ม.3 ประกอบด้วย:

| ส่วนประกอบ | คำอธิบาย |
|:---|:---|
| 🎮 **เกมหลัก (Shield Detective)** | เกมสืบคดีอัตนัย 3 บทบาท ตรวจด้วย Google Gemini AI |
| 🕹️ **เกม v3 (Detective)** | เกมสืบคดีปรนัย (เลือกตอบ) 30 คดี |
| 👩‍🏫 **แดชบอร์ดครู (Shield)** | ตรวจคะแนนเรียลไทม์ กรองห้อง ส่งออก PDF |
| 📊 **แดชบอร์ดครู (v3)** | ตรวจคะแนนเกม v3 ส่งออก PDF |
| 📖 **สไลด์บทเรียน** | สรุปเนื้อหา พ.ร.บ.คอมพิวเตอร์ มาตราสำคัญ |
| 📂 **คลังคดี & เฉลย** | ข้อมูลอ้างอิง 12 คดี + ระบบปลดล็อกเฉลยสำหรับครู |

---

## 🗺️ แผนผังไฟล์ทั้งหมด (Sitemap)

| URL Path | ไฟล์ | คำอธิบาย |
|:---|:---|:---|
| `/` | `index.html` | 🏠 ศูนย์รวมสื่อ — หน้าหลักเลือกเข้าเกม/แดชบอร์ด |
| `/shield_detective` | `cyber_shield_detective.html` | 🎮 เกมหลัก: สืบคดีอัตนัย 3 บทบาท + AI + Anti-Cheat |
| `/shield_teacher` | `cyber_shield_teacher.html` | 👩‍🏫 แดชบอร์ดครู: ตรวจคะแนนเกมหลัก Realtime |
| `/detective` | `cyber_detective.html` | 🕹️ เกม v3: สืบคดีปรนัย (เลือกตอบ) |
| `/teacher_dashboard` | `teacher_dashboard.html` | 📊 แดชบอร์ดครู v3: ตรวจคะแนนเกม v3 |
| `/presentation` | `presentation.html` | 📖 สไลด์บทเรียน พ.ร.บ.คอมพิวเตอร์ |
| `/cases` | `cases_reference.html` | 📂 คลังข้อมูลอ้างอิง 12 คดี + เฉลย |

### โครงสร้างโฟลเดอร์

```
📁 cyber-law-game-app/
├── 📄 index.html                     # หน้าหลัก Hub
├── 📄 cyber_shield_detective.html    # เกมหลัก (อัตนัย AI)
├── 📄 cyber_shield_teacher.html      # แดชบอร์ดครูเกมหลัก
├── 📄 cyber_detective.html           # เกม v3 (ปรนัย)
├── 📄 teacher_dashboard.html         # แดชบอร์ดครู v3
├── 📄 presentation.html              # สไลด์บทเรียน
├── 📄 cases_reference.html           # คลังคดี & เฉลย
├── 📄 cases_data.js                  # ข้อมูล 30 คดีสำหรับเกม v3
├── 📄 server.js                      # Express.js Backend + Gemini AI
├── 📄 vercel.json                    # Vercel Deployment Config
├── 📄 package.json                   # Node.js Dependencies
├── 📁 assets/
│   ├── 📁 evidence/                  # ภาพการ์ตูน 9 ช่อง (12 คดี)
│   │   ├── case_ev_8f3a9b21.png      # คดี 1
│   │   ├── case_ev_4e7c1d89.png      # คดี 2
│   │   ├── ...                       # คดี 3-12
│   │   └── case_ev_4d9f1e8a.png      # คดี 12
│   └── 📁 comic/                     # ภาพการ์ตูนสำหรับเกม v3
├── 📁 css/
│   ├── index.css                     # สไตล์หน้า Hub
│   ├── teacher_dashboard.css         # สไตล์แดชบอร์ดครู v3
│   └── ...
├── 📁 js/                            # JavaScript Modules
└── 📄 .env                           # Environment Variables (ไม่รวมใน Git)
```

---

## 🎮 เกมหลัก: Cyber Shield Detective (อัตนัย + AI)

### กติกาการเล่น

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        GAME FLOW OVERVIEW                              │
│                                                                        │
│  1. ลงทะเบียนทีม        →  2. รับ 6 คดีสุ่ม       →  3. วิเคราะห์    │
│  - ตั้งชื่อกลุ่ม           - สุ่มจากคลัง 12 คดี      - ทำทีละคดี      │
│  - เลือกห้อง ม.3/1-15     - ดูการ์ตูน 9 ช่อง         - ทีละบทบาท     │
│  - เพิ่มสมาชิก 1-10 คน    - อ่านคำร้องทุกข์          - ส่งทีละบท     │
│                                                                        │
│  4. AI ตรวจคะแนน      ←  5. บันทึก Supabase     ←  6. ใบเกียรติบัตร  │
│  - Gemini AI / Heuristic   - Realtime Database       - สรุปคะแนน     │
│  - 10 คะแนน/บทบาท         - ครูดูคะแนนสด            - พิมพ์ PDF      │
└─────────────────────────────────────────────────────────────────────────┘
```

**ขั้นตอนโดยละเอียด:**

1. **ลงทะเบียนทีม** — ตั้งชื่อกลุ่มสายสืบ, เลือกห้องเรียน (ม.3/1 - ม.3/15), เพิ่มสมาชิก 1-10 คน (ระบุเลขที่, คำนำหน้า, ชื่อ-นามสกุล)
2. **รับมอบหมายคดี** — ระบบสุ่ม 6 คดีจากคลัง 12 คดี แต่ละคดีมีการ์ตูน 9 ช่อง + คำร้องทุกข์
3. **ทำทีละคดี ทีละบทบาท** — เลือกคดีใดก่อนก็ได้ แต่ละคดีต้องทำ 3 บทบาทตามลำดับ:
   - บทบาทที่ 1: กฎหมาย → พิมพ์คำตอบ → **กดส่งตรวจ** → ได้คะแนนทันที
   - บทบาทที่ 2: บรรเทาภัย → พิมพ์คำตอบ → **กดส่งตรวจ** → ได้คะแนนทันที
   - บทบาทที่ 3: ความปลอดภัย → พิมพ์คำตอบ → **กดส่งตรวจ** → ได้คะแนนทันที
4. **ดูผลประเมิน** — AI ให้คะแนน + ฟีดแบ็กเชิงแนวคิด (ไม่บอกเฉลยตรงๆ)
5. **ส่งซ้ำไม่ได้** — เมื่อส่งครบ 3 บทบาทของคดีนั้นแล้ว จะไม่สามารถแก้ไขหรือส่งซ้ำได้อีก
6. **ใบเกียรติบัตร** — เมื่อทำครบ 6 คดี สามารถดูสรุปคะแนนรวมและพิมพ์ใบเกียรติบัตรเป็น PDF

### ระบบ 3 บทบาท (3 Forensic Dimensions)

| บทบาท | ไอคอน | คะแนน | เกณฑ์การให้คะแนน |
|:---|:---:|:---:|:---|
| **นักวิเคราะห์กฎหมาย** | 👨‍⚖️ | 10 | ระบุฐานความผิด (พ.ร.บ.คอมพิวเตอร์/PDPA) + อัตราโทษจำคุก/ปรับ |
| **เจ้าหน้าที่บรรเทาภัย** | 🚑 | 10 | ระบุขั้นตอนระงับเหตุเฉพาะหน้า + แจ้งผู้เกี่ยวข้อง |
| **วิศวกรความปลอดภัย** | 🛡️ | 10 | เสนอเครื่องมือ/มาตรการทางเทคนิคเพื่อป้องกันระยะยาว |

**คะแนนเต็มต่อคดี = 30 คะแนน** (3 บทบาท × 10 คะแนน)
**คะแนนเต็มรวม = 180 คะแนน** (6 คดี × 30 คะแนน)

### ระบบให้คะแนน (Scoring System)

ระบบให้คะแนนมี 2 โหมด ขึ้นอยู่กับว่ามี Gemini API Key หรือไม่:

#### โหมดที่ 1: Google Gemini AI (เมื่อมี API Key)
- AI อ่านคำตอบนักเรียนและเปรียบเทียบกับฐานข้อมูลคำตอบมาตรฐาน
- ให้คะแนน 0-10 พร้อมฟีดแบ็กเชิงแนวคิด
- **ไม่บอกเฉลยตรงๆ** — AI จะชี้แนะทิศทางให้นักเรียนคิดต่อเอง

#### โหมดที่ 2: Heuristic Engine (Offline / ไม่มี API Key)
ใช้ระบบ Keyword Matching + Scoring Rubric ตรวจคำตอบ:

**บทบาทกฎหมาย (Legal):**
| เงื่อนไข | คะแนนที่ได้ |
|:---|:---:|
| ระบุมาตราถูกต้อง (ตรงกับ keyword เฉพาะคดี) | +5 |
| ระบุคำทั่วไปเกี่ยวกับกฎหมาย (เช่น "พ.ร.บ.", "มาตรา") | +3 |
| ระบุโทษจำคุก/ปรับถูกต้อง (ตรงกับ keyword) | +3 |
| ระบุคำทั่วไปเกี่ยวกับโทษ (เช่น "จำคุก", "ปรับ", "บาท") | +2 |
| ระบุทั้งมาตราและโทษถูกต้อง (Bonus) | +2 |
| คำตอบมีความยาวเพียงพอ (≥20 ตัวอักษร) | +1-2 |

**บทบาทบรรเทาภัย (Remedy):**
| เงื่อนไข | คะแนนที่ได้ |
|:---|:---:|
| ระบุวิธีระงับเหตุตรงประเด็น (ตรงกับ keyword) | +5 |
| ระบุคำทั่วไปเกี่ยวกับการรับมือ (เช่น "ลบ", "แจ้ง", "บล็อก") | +3 |
| ระบุผู้เกี่ยวข้อง (ครู/ผู้ปกครอง/ตำรวจ/แอดมิน/ธนาคาร ฯลฯ) | +3 |
| ระบุคำทั่วไปเกี่ยวกับการขอความช่วยเหลือ | +2 |
| ทั้ง Action + Stakeholder (Bonus) | +2 |

**บทบาทความปลอดภัย (Security):**
| เงื่อนไข | คะแนนที่ได้ |
|:---|:---:|
| ระบุเครื่องมือเทคนิคถูกต้อง (เช่น "2FA", "Firewall", "VPN") | +5 |
| ระบุแนวคิดทั่วไปเกี่ยวกับการป้องกัน | +3 |
| อธิบายวิธีใช้เครื่องมือ (Bonus) | +3 |
| ระบุเครื่องมือแต่ไม่อธิบาย | +2 |
| คำตอบยาวเพียงพอ (Bonus) | +1-2 |

**ระบบตรวจจับข้อความมั่ว (Anti-Gibberish):**
- กดแป้นพิมพ์มั่ว (asdfgh, ฟกหกด) → **0 คะแนน**
- ตัวอักษรซ้ำ 5+ ตัว (aaaaa, กกกกก) → **0 คะแนน**
- คำตอบเลี่ยง (ไม่รู้, ขี้เกียจ, 5555) → **0 คะแนน**
- ข้อความสั้นเกินไป (<10 ตัวอักษร) → **0 คะแนน**

### ระบบป้องกันโกง (Anti-Cheat)

| มาตรการ | รายละเอียด |
|:---|:---|
| **ชื่อไฟล์ภาพ Hashed** | ภาพหลักฐานใช้ชื่อแฮชสุ่ม (เช่น `case_ev_8f3a9b21.png`) ไม่ระบุมาตรา |
| **ปิด DevTools** | บล็อก F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S |
| **ปิดคลิกขวา** | Right-Click Context Menu ถูกปิด + Toast Alert |
| **ล้าง Console** | ตรวจจับ DevTools เปิด → ล้าง Console อัตโนมัติ |
| **Zero-Spoiler** | ไม่มีเลขมาตราในหลักฐาน, ไทม์ไลน์, หรือ UI ใดๆ |
| **AI No-Spoiler** | Gemini AI ชี้แนะแนวคิด ไม่บอกคำตอบ |
| **ส่งซ้ำไม่ได้** | เมื่อส่งครบ 3 บทบาทแล้ว ล็อกไม่ให้แก้ไข |

### ใบเกียรติบัตร (Certificate)

เมื่อทำครบ 6 คดี ระบบจะแสดงใบเกียรติบัตรที่มี:
- ชื่อกลุ่มสายสืบ + รายชื่อสมาชิก
- คะแนนรวมทั้ง 6 คดี (เต็ม 180)
- ระดับฝีมือ: Cyber Master / Senior Detective / นักสืบฝึกหัด
- รองรับ `window.print()` สำหรับพิมพ์เป็น PDF กระดาษ A4

---

## 🕹️ เกม v3: Cyber Detective (ปรนัย)

เกมเวอร์ชันเดิมที่ใช้ระบบเลือกตอบ (Multiple Choice):
- **30 คดีจำลอง** พร้อมภาพการ์ตูนประกอบ
- วิเคราะห์หลักฐาน → ไต่สวนผู้สงสัย → เลือกฐานความผิด
- ตรวจคำตอบทันทีแบบอัตโนมัติ
- ข้อมูลคดีทั้งหมดอยู่ในไฟล์ `cases_data.js`

---

## 👩‍🏫 แดชบอร์ดครูผู้สอน

### แดชบอร์ดเกมหลัก (cyber_shield_teacher.html)
- 🔐 ล็อกด้วยรหัสผ่านครู (Passcode)
- 📊 ตารางคะแนนเรียลไทม์ผ่าน Supabase — จัดกลุ่มตามชื่อทีม
- 🔍 กรองตามห้อง (ม.3/1 - ม.3/15) + ค้นหาชื่อ
- 📋 โหมดแสดงรายชื่อสมาชิก (เลขที่ / ชื่อ)
- 📖 แฟ้มเฉลยเกณฑ์ 12 คดี (ระบบปลดล็อก)
- 🖨️ ส่งออก PDF รายงานเกรด (A4)

### แดชบอร์ดเกม v3 (teacher_dashboard.html)
- 📊 ตารางคะแนนเกม v3 (ปรนัย)
- 🖨️ ส่งออก PDF สำหรับพิมพ์

---

## 📚 แฟ้ม 12 คดีหลักฐานการ์ตูน 9 ช่อง

| # | ชื่อคดี | มาตรา | อัตราโทษ |
|:---:|:---|:---|:---|
| 1 | แอบส่องระบบไอดีเกมของเพื่อน | ม.5 เข้าถึงระบบโดยมิชอบ | จำคุก ≤6 เดือน / ปรับ ≤10,000 บาท |
| 2 | แจกรหัสผ่านระบบใน Discord | ม.6 เปิดเผยมาตรการป้องกัน | จำคุก ≤1 ปี / ปรับ ≤20,000 บาท |
| 3 | แอบคุ้ยไฟล์ไดอารี่แชทลับส่วนตัว | ม.7 เข้าถึงข้อมูลโดยมิชอบ | จำคุก ≤2 ปี / ปรับ ≤40,000 บาท |
| 4 | ดักจับข้อมูลธุรกรรมเติมเกมกลางทาง | ม.8 ดักรับข้อมูลระหว่างการส่ง | จำคุก ≤3 ปี / ปรับ ≤60,000 บาท |
| 5 | มือบอนแอบลบไฟล์โครงงานวิทย์เพื่อน | ม.9 ทำลาย/แก้ไขข้อมูลโดยมิชอบ | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 6 | ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบ | ม.10 รบกวน/ขัดขวางระบบ | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 7 | ส่งอีเมลสแปมขายของปลอมตัวตน | ม.11 วรรค 1 ส่งสแปมปกปิดตัวตน | ปรับ ≤100,000 บาท |
| 8 | บอทสแปมรัวๆ ปิดปุ่มยกเลิก | ม.11 วรรค 2 ส่งสแปมไม่ให้ยกเลิก | ปรับ ≤200,000 บาท |
| 9 | สร้างเว็บฟิชชิ่งหลอกสกินเกมฟรี | ม.14(1) ข้อมูลเท็จหลอกลวง | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 10 | โพสต์ข่าวลวงภัยพิบัติจนคนแตกตื่น | ม.14(2) ข้อมูลเท็จสร้างตื่นตระหนก | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 11 | โพสต์ภาพ/คลิปลามกลงสาธารณะ | ม.14(4) ข้อมูลลามกอนาจาร | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 12 | ตัดต่อหน้าเพื่อนประจานในโซเชียล | ม.16 ภาพตัดต่อทำให้เสียชื่อเสียง | จำคุก ≤3 ปี / ปรับ ≤200,000 บาท |

> 📝 **หมายเหตุ:** ชื่อไฟล์ภาพหลักฐานถูกเข้ารหัสเป็น Hash เพื่อป้องกันนักเรียนแอบดูมาตราจากชื่อไฟล์

---

## 🏗️ สถาปัตยกรรมโค้ด (Code Architecture)

### Frontend (Client-side)

| ไฟล์ | หน้าที่ |
|:---|:---|
| `cyber_shield_detective.html` | **SPA เกมหลัก** — มี `ALL_12_CASES` object เก็บข้อมูลคดี + keywords, UI state management, ระบบ role switching, lightbox ซูมภาพ, certificate generation, anti-cheat shield |
| `cyber_shield_teacher.html` | **แดชบอร์ดครู** — เชื่อมต่อ Supabase Realtime, ตาราง scoreboard จัดกลุ่มตามทีม, กรองห้อง, export PDF |
| `cyber_detective.html` | **เกม v3** — เกมเลือกตอบ ใช้ข้อมูลจาก `cases_data.js` |
| `teacher_dashboard.html` | **แดชบอร์ดครู v3** — สรุปคะแนนเกม v3 |
| `presentation.html` | **สไลด์บทเรียน** — เนื้อหาบรรยาย พ.ร.บ.คอมพิวเตอร์ |
| `cases_reference.html` | **คลังคดี** — ข้อมูลอ้างอิง + เฉลยล็อกด้วย passcode |
| `index.html` | **Hub** — หน้าหลักเลือกเข้าเว็บย่อย |

### Backend (server.js — Express.js)

| ส่วน | หน้าที่ |
|:---|:---|
| `CASE_REFERENCES` | ฐานข้อมูล 12 คดี: คำตอบมาตรฐาน + keywords 4 หมวด (law, penalty, remedy, security) |
| `isGibberishOrNonsense()` | ตรวจจับข้อความมั่ว/สแปม/คำตอบเลี่ยง |
| `evaluateLocally()` | **Heuristic Engine** — ตรวจคำตอบด้วย keyword matching + scoring rubric |
| `POST /api/evaluate-case` | Endpoint หลัก — เรียก Gemini AI ก่อน, fallback เป็น Heuristic ถ้าไม่มี key |
| `POST /api/verify-passcode` | ตรวจ passcode ครู |
| `POST /api/test-gemini-key` | ทดสอบ Gemini API Key |
| `GET /api/config` | ส่ง public config (Supabase URL/Key) ให้ frontend |

### Scoring Pipeline

```
คำตอบนักเรียน
    │
    ▼
┌─────────────────┐     API Key มี?     ┌──────────────────┐
│ isGibberish()   │ ──── ใช่ ────────►  │ Google Gemini AI │
│ ตรวจข้อความมั่ว  │                     │ ตรวจ + ให้ฟีดแบ็ก │
└─────────────────┘                     └──────────────────┘
    │ ไม่ใช่                                    │
    ▼                                           ▼
┌─────────────────┐                     ┌──────────────────┐
│ evaluateLocally │ ◄── ไม่มี Key ────  │ บันทึก Supabase  │
│ Keyword Match   │                     │ Realtime Database│
│ + Scoring Rubric│                     └──────────────────┘
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ ส่งคะแนน + ฟีดแบ็ก │
│ กลับให้ Frontend   │
└─────────────────┘
```

### Keywords Database

แต่ละคดีมี keywords 4 หมวด ใช้สำหรับ Heuristic Scoring:

| หมวด | ตัวอย่าง (คดี 1) | ใช้ประเมิน |
|:---|:---|:---|
| `keywords_law` | มาตรา 5, แอบเข้า, เข้าถึงระบบ, มิชอบ | ฐานความผิด |
| `keywords_penalty` | 6 เดือน, 10,000, ทั้งจำทั้งปรับ | อัตราโทษ |
| `keywords_remedy` | เปลี่ยนรหัส, ล็อกเอาต์, แจ้งครู | วิธีระงับเหตุ |
| `keywords_security` | 2FA, OTP, ล็อกหน้าจอ, ยืนยันตัวตน | เครื่องมือป้องกัน |

> Keywords ถูกจัดเก็บทั้งใน `cyber_shield_detective.html` (client) และ `server.js` (backend) เพื่อรองรับทั้งโหมด Online และ Offline

---

## ⚡ ติดตั้ง Supabase Database

สร้างตาราง `game_scores` ใน **Supabase SQL Editor**:

```sql
-- 1. สร้างตาราง
CREATE TABLE IF NOT EXISTS public.game_scores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    player_id TEXT,
    team_name TEXT NOT NULL DEFAULT 'นักสืบเยาวชน',
    members_info TEXT,
    case_id INTEGER,
    case_title TEXT,
    legal_score NUMERIC DEFAULT 0,
    remedy_score NUMERIC DEFAULT 0,
    security_score NUMERIC DEFAULT 0,
    total_score NUMERIC DEFAULT 0,
    student_answers JSONB,
    ai_feedback JSONB
);

-- 2. เปิด Row Level Security
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;

-- 3. กำหนดสิทธิ์ Anonymous Read & Insert
CREATE POLICY "Allow anonymous select" ON public.game_scores FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.game_scores FOR INSERT WITH CHECK (true);

-- 4. เปิด Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_scores;
```

---

## ⚙️ ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
PORT=3000
NODE_ENV=development

# Google Gemini API Key (สำหรับประเมินผลอัตนัย)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Realtime Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# รหัสผ่านสำหรับแผงควบคุมครูผู้สอน
TEACHER_PASSCODE=your_secure_teacher_passcode
```

| ตัวแปร | จำเป็น | คำอธิบาย |
|:---|:---:|:---|
| `GEMINI_API_KEY` | ❌ | ไม่มีก็เล่นได้ — fallback เป็น Heuristic Engine |
| `SUPABASE_URL` | ❌ | ไม่มีก็เล่นได้ — ไม่บันทึกคะแนนลง DB |
| `SUPABASE_ANON_KEY` | ❌ | ใช้คู่กับ SUPABASE_URL |
| `TEACHER_PASSCODE` | ❌ | ค่า default: `admin123` หรือ `teacher123` |

---

## 🚀 วิธีรันในเครื่อง (Local Setup)

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/puripong1st/tech-dm-cyber-detective.git
cd tech-dm-cyber-detective

# 2. ติดตั้ง Dependencies
npm install

# 3. สร้างไฟล์ .env (ดูตัวอย่างจาก .env.example)
cp .env.example .env

# 4. รันเซิร์ฟเวอร์
npm start

# 5. เปิดเบราว์เซอร์
# หน้าหลัก:      http://localhost:3000
# เกมหลัก:       http://localhost:3000/shield_detective
# แดชบอร์ดครู:   http://localhost:3000/shield_teacher
# เกม v3:        http://localhost:3000/detective
# แดชบอร์ด v3:   http://localhost:3000/teacher_dashboard
```

---

## 🌐 Deploy ขึ้น Vercel / GitHub Pages

### Vercel (แนะนำ — รองรับ Gemini AI เต็มรูปแบบ)
1. เชื่อม GitHub Repo กับ Vercel
2. ตั้ง Environment Variables ใน Vercel Dashboard:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `TEACHER_PASSCODE`
3. Deploy — ระบบจะใช้ `vercel.json` ที่มีอยู่แล้ว

### GitHub Pages (Static Mode)
- เข้าเล่นได้ที่ `https://<username>.github.io/<repo>/cyber_shield_detective.html`
- ระบบ Gemini AI ไม่ทำงาน (ไม่มี backend) → ใช้ Heuristic Engine แทน
- นักเรียนสามารถกรอก Gemini API Key ของตัวเอง (Client-side) ได้

---

<div align="center">
  <sub>พัฒนาขึ้นเพื่อสนับสนุนการเรียนการสอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ) ระดับชั้น ม.3</sub>
  <br/>
  <sub>© 2026 Cyber Law Detective & Teacher Platform. All rights reserved.</sub>
</div>
