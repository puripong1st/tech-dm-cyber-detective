# 🛡️ ศูนย์รวมสื่อการเรียนรู้ & ระบบสืบคดีกฎหมายคอมพิวเตอร์ (Cyber Law Detective & Teacher Platform)

![Cyber Detective Hub Banner](https://img.shields.io/badge/Platform-Cyber%20Law%20%26%20PDPA-38bdf8?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/Status-Production%20Ready-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)
![Audio Engine](https://img.shields.io/badge/Audio-Web%20Audio%20Synth-a855f7?style=for-the-badge)

ระบบสื่อการเรียนรู้แบบมีปฏิสัมพันธ์ (Interactive Cyber Law & PDPA Learning Platform) และเกมสืบคดีจำลองอาชญากรรมทางเทคโนโลยี สำหรับนักเรียนระดับชั้นมัธยมศึกษาปีที่ 3 พร้อมระบบแดชบอร์ดติดตามผลคะแนนแบบเรียลไทม์สำหรับครูผู้สอน

---

## 📌 สารบัญ (Table of Contents)
- [ภาพรวมระบบ (Overview)](#-ภาพรวมระบบ-overview)
- [ฟีเจอร์เด่นและระบบที่ยกระดับใหม่ (Key Features & Recent Enhancements)](#-ฟีเจอร์เด่นและระบบที่ยกระดับใหม่-key-features--recent-enhancements)
- [โครงสร้างเว็บแอปพลิเคชัน & Clean URLs](#-โครงสร้างเว็บแอปพลิเคชัน--clean-urls)
- [ระบบการคิดคะแนน & กฎเกณฑ์เกม (Scoring Mechanics)](#-ระบบการคิดคะแนน--กฎเกณฑ์เกม-scoring-mechanics)
- [ระบบความปลอดภัย & การป้องกันสุ่มตอบ (Security & Anti-Spam Protections)](#-ระบบความปลอดภัย--การป้องกันสุ่มตอบ-security--anti-spam-protections)
- [สถาปัตยกรรมเทคโนโลยี (Tech Stack)](#-สถาปัตยกรรมเทคโนโลยี-tech-stack)
- [โครงสร้างโฟลเดอร์ & ไฟล์ในโปรเจกต์ (Project Directory)](#-โครงสร้างโฟลเดอร์--ไฟล์ในโปรเจกต์-project-directory)
- [ขั้นตอนการติดตั้งและรันโปรเจกต์ (Local Installation)](#-ขั้นตอนการติดตั้งและรันโปรเจกต์-local-installation)
- [การ Deploy ขึ้น Vercel (Deployment Guide)](#-การ-deploy-ขึ้น-vercel-deployment-guide)
- [การรับรองและการทดสอบระบบ (Automated System Testing)](#-การรับรองและการทดสอบระบบ-automated-system-testing)

---

## 🛡️ ภาพรวมระบบ (Overview)

แพลตฟอร์มนี้พัฒนาขึ้นเพื่อยกระดับการตระหนักรู้ด้าน **พ.ร.บ. ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์** และ **พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล (PDPA)** โดยนำเสนอในรูปแบบเกมจำลองบทบาทสายสืบดิจิทัล (Cyber Detective) ให้นักเรียนได้วิเคราะห์คำร้องทุกข์ สแกนหลักฐานดิจิทัลด้วยมินิเกมทางนิติวิทยาศาสตร์ และตัดสินฐานความผิดกับบทลงโทษตามกฎหมายจริง

---

## ✨ ฟีเจอร์เด่นและระบบที่ยกระดับใหม่ (Key Features & Recent Enhancements)

### 1. 💡 ระบบการ์ดสรุปเกร็ดความรู้กฎหมาย (Post-Case Knowledge Flashcards)
เมื่อนักเรียนตัดสินคดีถูกต้อง ป๊อปอัปผลคดีจะแสดง **"เกร็ดความรู้กฎหมาย (Cyber Law & PDPA Summary)"** สรุปสาระสำคัญ มาตราข้อหา และบทลงโทษทางกฎหมาย 2-3 บรรทัดทันที เพื่อเน้นย้ำความเข้าใจและตระหนักรู้กฎหมายก่อนเริ่มทำคดีถัดไป

### 2. 🎧 ระบบดนตรีสังเคราะห์ & เสียงเอฟเฟกต์ Cyber Ambient Sound Engine
- **Cyber Ambient Drone Loop**: ระบบสังเคราะห์เสียงดนตรีประกอบธีมไซเบอร์สืบสวนด้วย Web Audio API ไร้ไฟล์เสียงภายนอก ประหยัดแบนด์วิธ และสามารถเปิด/ปิดเสียงดนตรีได้ตลอดเวลาที่ปุ่ม `🎵`
- **Rich Sound Effects (SFX)**: เสียงพิมพ์คีย์บอร์ดหกเหลี่ยมตอนเลือกตัวเลือก, เสียงสแกนคลื่นความถี่บีบอัด, เสียงตัดสินคดีฆ้อนศาล (`Gavel thud sound`), และเสียงแจ้งเตือนความถูกต้อง/ล้มเหลว

### 3. 📱 ระบบ Collapsible Sidebar สำหรับสมาร์ตโฟนและ iPad
ออกแบบอินเทอร์เฟซตามหลัก **Responsive Modern UI**:
- หน้าจอคอมพิวเตอร์: แสดงสมุดโน้ตสายสืบและแผงควบคุม 2 คอลัมน์แบบตรึงหน้าจอ
- หน้าจอสมาร์ตโฟน/แท็บเล็ต: เพิ่มปุ่มไอคอนสมุดโน้ต `📘` บนแถบเมนู เพื่อเปิด/ปิดแถบสมุดโน้ตแบบ Drawer สไลด์ข้างได้สะดวกโดยไม่บดบังพื้นที่ทำคดี

### 4. ⏱️ ระบบ Cooldown ป้องกันการกดเดาสุ่ม (Anti-Spam Guessing Protection)
ตรวจจับหากนักเรียนกดเดาคำตอบผิด **3 ครั้งติดต่อกันในคดีเดียวกัน** ระบบจะทำการล็อกปุ่มตัดสินคดีชั่วคราวเป็นเวลา **5 วินาที** พร้อมแสดงข้อความนับถอยหลัง `(5s)...` เพื่อบังคับให้นักเรียนหยุดคิดและวิเคราะห์เบาะแสในสมุดโน้ตก่อนตอบใหม่

### 5. 🔄 ระบบสุ่มคดีฉลาดไม่ให้ซ้ำ (Smart Deck Rotation Algorithm)
ปรับปรุงอัลกอริทึม `createRandomCaseQueue()` ให้นักเรียนได้ทำคดีใหม่ๆ จนครบทั้ง **30 คดี** ในคลังก่อนที่จะเริ่มวนซ้ำ ป้องกันคดีซ้ำระหว่างรอบการเล่น

### 6. 🖨️ ระบบส่งออกรายงาน PDF พร้อมการตั้งชื่อไฟล์มาตรฐาน
เมื่อนักเรียนทำคดีเสร็จสิ้น ปุ่มพิมพ์ใบบันทึกคะแนนส่งครูจะทำการสร้างไฟล์ PDF โดยตั้งชื่อไฟล์อัตโนมัติในฟอร์แมต:
`{คำนำหน้า}_{ชื่อ}_{นามสกุล}_เลขที่{เลขที่}_{ห้อง}.pdf` (เช่น `เด็กชาย_สมชาย_ใจดี_เลขที่15_ม.3-1.pdf`)

---

## 🚀 โครงสร้างเว็บแอปพลิเคชัน & Clean URLs

ระบบได้รับการออกแบบโครงสร้าง URL แบบ **Clean URLs** (ไม่มีนามสกุล `.html` ลงท้าย) เพื่อความสวยงามและเป็นสัดส่วน:

| Clean URL Path | ชื่อไฟล์เดิม | รายละเอียด & หน้าที่ของโมดูล |
| :--- | :--- | :--- |
| **`/`** | `index.html` | **Cyber Detective Hub**: หน้าหลักศูนย์รวมในการเลือกระบบแอปพลิเคชัน พร้อมโลโก้แบรนด์ |
| **`/detective`** | `cyber_detective.html` | **Cyber Detective Game**: เกมจำลองการสืบคดีสุ่ม 6 คดี (จากคลัง 30 คดี) พร้อมระบบจับเวลา มินิเกมสแกนเบาะแส คิดคะแนน และการ์ด Flashcard |
| **`/teacher`** | `teacher_dashboard.html` | **Teacher Live Dashboard**: แดชบอร์ดสรุปผลคะแนนครูผู้สอนแบบเรียลไทม์ (Supabase Realtime + Auto Refresh) การจัดอันดับ ค้นหา กรองห้องเรียน ซ่อนชื่อจริง และส่งออกรายงาน PDF |
| **`/presentation`** | `presentation.html` | **Cyber Law Presentation**: สไลด์สื่อการเรียนรู้แบบมีปฏิสัมพันธ์ สรุปมาตราสำคัญ ตัวอย่างกรณีศึกษา และแบบทดสอบ |
| **`/cases`** | `cases_reference.html` | **Cases Reference & Answer Key**: คลังข้อสอบรวบรวมแฟ้มคดีทั้ง 30 คดี พร้อมระบบปลดล็อกเฉลยคำตอบฉบับครูผู้สอนด้วย Passcode |

---

## 🎮 ระบบการคิดคะแนน & กฎเกณฑ์เกม (Scoring Mechanics)

ในแต่ละรอบการเล่น เกมจะทำการสุ่มคดีจากคลัง 30 คดี ออกมา **6 คดี** โดยมีคะแนนเต็มสูงสุด **1,080 คะแนนดิบ** (แปลงเป็นคะแนนเก็บเต็ม 10 บนแดชบอร์ดครูผู้สอน):

$$\text{คะแนนเต็มรวมต่อคดี} = \underbrace{100}_{\text{คะแนนตัดสินถูก}} + \underbrace{30}_{\text{โบนัสความไว}} + \underbrace{50}_{\text{สแกนหลักฐาน 2 ชิ้น}} = 180 \text{ คะแนน/คดี}$$

$$\text{คะแนนเต็มรวมทั้งรอบ (6 คดี)} = 6 \times 180 = 1,080 \text{ คะแนนดิบ}$$

### 🎯 รายละเอียดการได้/เสียคะแนน
1. **มินิเกมถอดรหัสหลักฐานดิจิทัล (Forensic Clue Scanning)**:
   - แต่ละคดีมีหลักฐาน 2 ชิ้น
   - ถอดรหัสถูกต้อง: **+25 คะแนน** / ชิ้น (รวม +50 คะแนนต่อคดี)
   - ถอดรหัสล้มเหลว: **-15 คะแนน** และหลักฐานนั้นจะถูกล็อกไม่สามารถสแกนซ้ำได้
2. **การตัดสินข้อหากฎหมายและอัตราบทลงโทษ (Verdict Submission)**:
   - ตัดสินถูกต้องทั้งข้อหาและบทลงโทษ: ได้รับคะแนนฐาน **+100 คะแนน**
   - **โบนัสความไว (Speed Bonus)**:
     - ทำคดีเสร็จภายใน $\le 45$ วินาที: **+30 คะแนน**
     - ทำคดีเสร็จภายใน $\le 90$ วินาที: **+15 คะแนน**
   - ตอบคำตัดสินผิด: หักคะแนนข้อละ **-30 คะแนน** (หักสูงสุด -60 คะแนน/ครั้ง) และเปิดโอกาสให้กลับไปวิเคราะห์และตอบใหม่

---

## 🔐 ระบบความปลอดภัย & การป้องกันสุ่มตอบ (Security & Anti-Spam Protections)

1. **การยืนยันตัวตนครูผู้สอน (Passcode Verification)**:
   - รหัสผ่านครูผู้สอนเริ่มต้น: `admin123` หรือ `teacher123` (หรือกำหนดผ่าน `.env` ในชื่อ `TEACHER_PASSCODE`)
   - ระบบตรวจสอบรหัสผ่านแบบ **Server-side API Verification** ผ่าน `POST /api/verify-passcode` เพื่อป้องกันการรั่วไหลของ Secret String สู่ Client-side
2. **การป้องกันการแอบดูเฉลย (Anti-Cheat & Code Hardening)**:
   - ปรับปรุงการสุ่มตัวเลือกในมินิเกมและตัวเลือกกฎหมายด้วย Fisher-Yates Shuffle
   - ซ่อนข้อมูลการเฉลยใน DOM Element เพื่อป้องกันการกด F12 / Inspect ดูคำตอบ
3. **ระบบล็อกปุ่มป้องกันการเดาสุ่ม (Anti-Spam Guessing Lockout)**:
   - ป้องกันการกดเดาคำตอบแบบรวดเร็วโดยไม่คิด ด้วยระบบ Cooldown 5 วินาที เมื่อตอบผิดติดต่อกัน 3 ครั้ง

---

## 🛠️ สถาปัตยกรรมเทคโนโลยี (Tech Stack)

* **Frontend**:
  * HTML5, Vanilla JavaScript (ES6+ Modular Logic)
  * Vanilla CSS3 (Custom Design Token System, Glassmorphic Glass-UI, Neon Cyberpunk Theme)
  * Web Audio API (Procedural Ambient Sound & SFX Synthesizer)
  * FontAwesome 6 (Icons) & Google Fonts (Kanit & Sarabun)
* **Backend Runtime**:
  * Node.js & Express.js (`server.js`)
  * Vercel Serverless Functions (`@vercel/node`)
* **Database & Real-time Telemetry**:
  * Supabase (PostgreSQL Database + Realtime Postgres Changes Subscription)
  * BroadcastChannel API (Cross-Tab Realtime Messaging)
  * LocalStorage & SessionStorage State Persistence
* **Deployment & Hosting**:
  * Vercel (ด้วยการตั้งค่า `cleanUrls: true` และ `{ "handle": "filesystem" }`)

---

## 📂 โครงสร้างโฟลเดอร์ & ไฟล์ในโปรเจกต์ (Project Directory)

```
.
├── index.html               # [Main Hub] หน้าหลักศูนย์รวมเลือกระบบแอปพลิเคชัน
├── cyber_detective.html     # [Student Game] เกมสืบคดี 30 คดี มินิเกม เสียงดนตรี Ambient และจับเวลา
├── teacher_dashboard.html   # [Teacher Dashboard] แดชบอร์ดสรุปผลคะแนนเรียลไทม์ และ PDF Export
├── presentation.html        # [Lesson Slides] สื่อสไลด์นำเสนอเนื้อหาบทเรียน พ.ร.บ.คอมฯ และ PDPA
├── cases_reference.html     # [Cases Reference] คลังข้อสอบ 30 คดี และระบบเฉลยพร้อมรหัสผ่าน
├── cases_data.js            # [Data Bank] คลังข้อมูลแฟ้มคดีทั้ง 30 คดี ข้อหารายละเอียด บทลงโทษ และ Flashcard
├── server.js                # [Express Server] Node.js Server & Secure API Endpoints
├── vercel.json              # [Vercel Config] การตั้งค่า Clean URLs และ Routing บน Vercel
├── favicon.png              # [Brand Icon] ไอคอนตราโลโก้สายสืบไซเบอร์ขนาด 256x256
├── logo.png                 # [Brand Logo] รูปตราสัญลักษณ์โปรเจกต์ขนาด 256x256
├── package.json             # Node.js dependencies และ scripts
├── .env.example             # ตัวอย่างการตั้งค่า Environment Variables
└── README.md                # คู่มือและอธิบายรายละเอียดระบบฉบับสมบูรณ์
```

---

## 💻 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Local Installation)

### 1. คลองโปรเจกต์ (Clone Repository)
```bash
git clone https://github.com/puripong1st/tech-dm-cyber-detective.git
cd tech-dm-cyber-detective
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Environment Variables (ถ้ามี)
คัดลอกไฟล์ `.env.example` เป็น `.env`
```bash
cp .env.example .env
```
กำหนดค่าต่างๆ ในไฟล์ `.env`:
```env
PORT=3000
SUPABASE_URL=https://your-supabase-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
TEACHER_PASSCODE=admin123
```

### 4. รันเซิร์ฟเวอร์ทดสอบในเครื่อง (Local Server)
```bash
npm start
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`

---

## ☁️ การ Deploy ขึ้น Vercel (Deployment Guide)

โปรเจกต์นี้รองรับการ Deploy บน Vercel โดยตรงผ่าน `vercel.json`:

1. นำโค้ดขึ้น GitHub Repository
2. เข้าไปที่ [Vercel Dashboard](https://vercel.com) แล้วทำการ **Import Project** จาก GitHub
3. ในส่วน **Environment Variables** ให้เพิ่มตัวแปร (ถ้าต้องการ):
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `TEACHER_PASSCODE`
4. กด **Deploy**
5. Vercel จะทำการ Build และให้บริการในรูปแบบ Clean URLs โดยอัตโนมัติ (เช่น `https://your-domain.vercel.app/detective`, `https://your-domain.vercel.app/teacher`)

---

## 🧪 การรับรองและการทดสอบระบบ (Automated System Testing)

ระบบได้รับการทดสอบความถูกต้องผ่านชุดสอบอัตโนมัติ (Automated Gameplay Simulation Test Suite) ด้วย Node.js:
- **Syntax Verification**: ตรวจสอบไวยากรณ์สคริปต์ในไฟล์ HTML ทั้งหมด 0 Error
- **Gameplay Simulation**: จำลองการสืบคดีจริง สแกนหลักฐาน เลือกบทลงโทษ คิดคะแนน ออกรายงาน และเริ่มรอบใหม่ ผ่านการทดสอบ 100%

---

© 2026 Cyber Law Detective & Teacher Platform. Developed for Cyber Law Educational Excellence.
