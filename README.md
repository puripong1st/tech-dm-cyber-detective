<div align="center">
  <img src="favicon.png" alt="Cyber Shield Detective Logo" width="128" />
  <br/>
  <h1>🛡️ Cyber Shield Detective Platform</h1>
  <h3>สื่อและเกมการเรียนรู้กฎหมายคอมพิวเตอร์ (พ.ร.บ. คอมพิวเตอร์ 2560) & PDPA สำหรับนักเรียน ม.2 และ ม.3</h3>
  <p><b>ระบบประเมินผลอัตนัยด้วย Google Gemini AI | สไลด์บทเรียนอินเทอร์แอคทีฟ 12 มาตรา | ระบบแปลงภาษาวัยรุ่น Slang Normalizer | ตรวจคะแนนเรียลไทม์ผ่าน Supabase</b></p>

[![Platform](https://img.shields.io/badge/Platform-พ.ร.บ.คอมพิวเตอร์_&_PDPA-0284c7?style=for-the-badge&logo=shield)](cyber_shield_detective.html)
[![Slides](https://img.shields.io/badge/Slides-สไลด์บทเรียน_12_มาตรา-8b5cf6?style=for-the-badge&logo=slideshare)](presentation.html)
[![AI Engine](https://img.shields.io/badge/AI-Google_Gemini_API-ea4335?style=for-the-badge&logo=google)](https://aistudio.google.com)
[![Database](https://img.shields.io/badge/DB-Supabase_Realtime-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel_|_GitHub_Pages-000?style=for-the-badge&logo=vercel)](vercel.json)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](package.json)

<br/>

[🏠 หน้าหลัก (Hub)](index.html) • [🎮 เกมสืบคดี AI (Shield Detective)](cyber_shield_detective.html) • [📖 สไลด์บทเรียน 12 มาตรา (Slides)](presentation.html) • [👩‍🏫 แดชบอร์ดครู (Teacher Command)](cyber_shield_teacher.html) • [📂 คลัง 12 คดี & เฉลย (Case Bank)](cases_reference.html)

</div>

---

## AI Scoring, Teacher Override, and Retrain Loop

This project uses a layered scoring system for `cyber_shield_detective`:

1. **Gemini AI evaluator** checks each answer against the selected case, role, and rubric.
2. **Local rubric guardrails in `server.js`** normalize wording, reject nonsense answers, detect wrong-role or wrong-case answers, and keep scores consistent at 0, 5, 8, or 10.
3. **Retrained student-answer memory in `scratch/retrain_supabase_scores.js`** audits real answers already submitted to Supabase and recognizes valid Thai phrasing, short answers, typos, and near-match answers that should receive credit.
4. **Teacher override in `cyber_shield_teacher`** lets a teacher edit Legal, Remedy, and Security scores per case and write a comment. The override is saved in `game_scores` and `ai_feedback.teacher_override`.

Teacher overrides are authoritative. If AI gives a wrong score, the teacher can correct it from the teacher dashboard, and the leaderboard will use the corrected score.

### Teacher Score Editing

- Frontend: `cyber_shield_teacher.html`
- API: `POST /api/teacher/update-case-score`
- Required server env: `SUPABASE_SERVICE_ROLE_KEY`
- Auth check: `TEACHER_PASSCODE`
- Database fields updated: `legal_score`, `remedy_score`, `security_score`, `total_score`, `ai_feedback.teacher_override`

The service role key must stay server-only. Do not place `SUPABASE_SERVICE_ROLE_KEY` in browser JavaScript.

### AI Quality Process

Run an audit before changing production scores:

```bash
node scratch/retrain_supabase_scores.js
```

Apply reviewed improvements only after checking the audit output:

```bash
node scratch/retrain_supabase_scores.js --apply
```

The current AI approach is stronger than the older version because it no longer relies only on a single model response. It combines Gemini, deterministic rubric rules, real student-answer patterns from Supabase, nonsense detection, wrong-case detection, and manual teacher correction.

---

## 📌 สารบัญ

- [ภาพรวมโปรเจกต์](#-ภาพรวมโปรเจกต์)
- [แผนผังไฟล์ทั้งหมด (Sitemap)](#️-แผนผังไฟล์ทั้งหมด-sitemap)
- [ระบบแปลงภาษาวัยรุ่น (Slang Normalizer Engine)](#-ระบบแปลงภาษาวัยรุ่น-slang-normalizer-engine)
- [เกณฑ์การให้คะแนน 4 ระดับ (4-Tier Scoring Engine)](#-เกณฑ์การให้คะแนน-4-ระดับ-4-tier-scoring-engine)
- [ระบบป้องกันคำตอบผิดคดี (Cross-Case Topic Mismatch Enforcement)](#-ระบบป้องกันคำตอบผิดคดี-cross-case-topic-mismatch-enforcement)
- [เกมหลัก: Cyber Shield Detective (อัตนัย 3 บทบาท)](#-เกมหลัก-cyber-shield-detective-อัตนัย-3-บทบาท)
- [แผงควบคุมครูผู้สอน (Teacher Dashboard & Answer Bank)](#-แผงควบคุมครูผู้สอน-teacher-dashboard--answer-bank)
- [แฟ้ม 12 คดีหลักฐานการ์ตูน 9 ช่อง](#-แฟ้ม-12-คดีหลักฐานการ์ตูน-9-ช่อง)
- [ระบบป้องกันโกง (Anti-Cheat Shield)](#-ระบบป้องกันโกง-anti-cheat-shield)
- [สถาปัตยกรรมโค้ด (Code Architecture)](#-สถาปัตยกรรมโค้ด-code-architecture)
- [การติดตั้ง Supabase Database](#-การติดตั้ง-supabase-database)
- [การตั้งค่า Environment Variables](#️-การตั้งค่า-environment-variables)
- [วิธีรันในเครื่อง (Local Setup)](#-วิธีรันในเครื่อง-local-setup)
- [Deploy ขึ้น Vercel / GitHub Pages](#-deploy-ขึ้น-vercel--github-pages)
- [คลังคำค้นหา & การจัดหมวดหมู่ SEO (Search & Discovery Index)](#-คลังคำค้นหา--การจัดหมวดหมู่-seo-search--discovery-index)

---

## 🎯 ภาพรวมโปรเจกต์

**Cyber Shield Detective Platform** คือแพลตฟอร์มเว็บแอปพลิเคชันเพื่อการเรียนรู้เรื่อง **พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์** และ **PDPA** ออกแบบมาเฉพาะสำหรับนักเรียนระดับชั้น ม.2 และ ม.3 (อายุ 14 - 15 ปี) โดยผสมผสานเทคโนโลยี AI และ Heuristic Evaluation เข้ากับการเล่นเกมสืบคดีการ์ตูน 9 ช่อง

| ส่วนประกอบ | คำอธิบาย |
|:---|:---|
| 🎮 **เกมหลัก (Shield Detective)** | เกมสืบคดีอัตนัย 3 บทบาท ตรวจด้วย Gemini AI / Local Engine + Slang Normalizer |
| 👩‍🏫 **แดชบอร์ดครู (Shield Teacher)** | ตรวจคะแนนเรียลไทม์ จัดกลุ่มตามทีม คลังตัวอย่างคำตอบเด็ก ม.2-ม.3 และ Export PDF |
| 🕹️ **เกม v3 (Detective)** | เกมสืบคดีปรนัย (เลือกตอบ) 30 คดี |
| 📊 **แดชบอร์ดครู (v3)** | ตรวจคะแนนเกม v3 ปรนัย ส่งออก PDF |
| 📖 **สไลด์บทเรียน** | สรุปเนื้อหา พ.ร.บ.คอมพิวเตอร์ มาตราสำคัญสำหรับชั้นเรียน |
| 📂 **คลังคดี & เฉลย** | ข้อมูลอ้างอิง 12 คดี + ระบบปลดล็อกเฉลยสำหรับครูผู้สอน |

---

## 🗺️ แผนผังไฟล์ทั้งหมด (Sitemap)

| URL Path | ไฟล์ | คำอธิบาย |
|:---|:---|:---|
| `/` | `index.html` | 🏠 หน้าหลักเลือกเข้าสู่ระบบ/เกม/แดชบอร์ด |
| `/shield_detective` | `cyber_shield_detective.html` | 🎮 เกมหลัก: สืบคดีอัตนัย 3 บทบาท + AI + Anti-Cheat |
| `/shield_teacher` | `cyber_shield_teacher.html` | 👩‍🏫 แดชบอร์ดครู: Realtime Scoreboard + คลังตัวอย่างคำตอบเด็ก |
| `/detective` | `cyber_detective.html` | 🕹️ เกม v3: สืบคดีปรนัย (เลือกตอบ 30 คดี) |
| `/teacher_dashboard` | `teacher_dashboard.html` | 📊 แดชบอร์ดครู v3: ตรวจคะแนนเกม v3 |
| `/presentation` | `presentation.html` | 📖 สไลด์บทเรียน พ.ร.บ.คอมพิวเตอร์ |
| `/cases` | `cases_reference.html` | 📂 คลังข้อมูลอ้างอิง 12 คดี + เฉลยล็อกด้วย Passcode |

---

## 🚀 ระบบแปลงภาษาวัยรุ่น (Slang Normalizer Engine)

เนื่องจากนักเรียน ม.2 และ ม.3 (อายุ 14 - 15 ปี) มักพิมพ์คำตอบด้วยภาษาพูด ภาษาวัยรุ่น หรือคำย่อ แพลตฟอร์มจึงมี **Slang Normalizer Engine** ทำหน้าที่แปลงคำสแลงให้กลายเป็นคำศัพท์มาตรฐานก่อนส่งประเมินผล:

```
คำตอบนักเรียน (ภาษาพูดเด็ก) ──► [ Slang Normalizer ] ──► คำศัพท์มาตรฐาน ──► [ AI / Heuristic Evaluator ]
"แคปรูปไว้ แล้วทักแชทฟ้องครูเปิดดูลิ้งในดิส"                  "แคปเจอร์หลักฐานไว้ แล้วแจ้งผู้เกี่ยวข้อง..."      คะแนน: 10 / 10 (สมบูรณ์แบบ)
```

### ตารางพจนานุกรมคำสแลงที่รองรับ

| หมวดคำ | คำพูด/คำสแลงเด็ก ม.2 - ม.3 | คำศัพท์มาตรฐานที่แปลงแล้ว |
|:---|:---|:---|
| **การเก็บหลักฐาน** | `แคป`, `แคปรูป`, `แคปหน้าจอ`, `แคปหลักฐาน`, `ถ่ายรูปเก็บไว้`, `เซฟรูป` | **แคปเจอร์หลักฐาน** |
| **การแจ้งผู้เกี่ยวข้อง** | `ฟ้องครู`, `บอกครู`, `ทักหาครู`, `ถามครู`, `แจ้งครูผู้สอน` | **แจ้งครู** |
| **การแจ้งผู้ปกครอง** | `บอกพ่อแม่`, `บอกผู้ปกครอง`, `ฟ้องพ่อแม่`, `แจ้งพ่อแม่` | **แจ้งผู้ปกครอง** |
| **การทักแชทแจ้งเพื่อน** | `ทักแชท`, `ทักไปบอก`, `เตือนเพื่อน`, `บอกเพื่อน` | **แจ้งผู้เกี่ยวข้อง** |
| **การรายงานระบบ** | `รีพอร์ต`, `กดรีพอร์ต`, `ฟ้องระบบ`, `กดรายงาน`, `ฟ้องแอดมิน` | **รายงาน / Report** |
| **ยืนยันตัวตนชีวภาพ** | `สแกนหน้า`, `สแกนใบหน้า` / `สแกนนิ้ว`, `สแกนลายนิ้วมือ` | **Face ID / Touch ID** |
| **ออกจากระบบ/กู้คืน** | `ล็อกออก`, `ออกระบบ` / `กู้งาน`, `กดกู้`, `ดึงงานกลับ` | **Logout / Version History** |
| **ศัพท์ไอที & แพลตฟอร์ม** | `พาส`, `พาสเวิร์ด`, `ไอดี` ➔ **รหัสผ่าน** \| `ลิ้ง`, `ลิงค์`, `ลิ้งค์` ➔ **ลิงก์/URL**<br>`ดิส`, `ดิสคอร์ด` ➔ **Discord** \| `เฟส`, `เฟซ` ➔ **Facebook**<br>`ไอจี` ➔ **Instagram** \| `ต๊อกต๊อก` ➔ **TikTok** \| `ยิงเว็บ` ➔ **DDoS** |

---

## 🏆 เกณฑ์การให้คะแนน 4 ระดับ (4-Tier Scoring Engine)

ระบบใช้เกณฑ์การประเมิน 4 ระดับที่สอดคล้องกัน 100% ทั้งในโหมด **Google Gemini AI** และ **Heuristic Engine** เพื่อมอบแรงจูงใจและคะแนนที่เป็นธรรมแก่นักเรียน:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      4-TIER SCORING RUBRIC OVERVIEW                     │
│                                                                        │
│ 🟢 10 คะแนน (สมบูรณ์แบบ):  ตรงคดี + ครบถ้วนหลักการ + รายละเอียดบทบาท  │
│ 🔵  8 คะแนน (ดีมาก):       ตรงคดี + มีหลักการถูก (ขาดรายละเอียดเล็กน้อย)│
│ 🟡  5 คะแนน (พอใช้):       ตรงคดี + ตอบแนวคิดกว้างๆ (ขาดชื่อมาตรา/เครื่องมือ)│
│ 🔴  0 คะแนน (ปรับตก):      ผิดคดี / สลับบทบาท / พิมพ์ตัวอักษรไร้สาระ  │
└─────────────────────────────────────────────────────────────────────────┘
```

### เกณฑ์การประเมินแต่ละบทบาท (เต็ม 10 คะแนน / บทบาท)

| บทบาท | 🟢 10 คะแนน (สมบูรณ์แบบ) | 🔵 8 คะแนน (ดีมาก) | 🟡 5 คะแนน (พอใช้) | 🔴 0 คะแนน (ปรับตก) |
|:---|:---|:---|:---|:---|
| 👨‍⚖️ **นักวิเคราะห์กฎหมาย** | ระบุฐานความผิด/มาตรา **และ** บทลงโทษ (คุก/ปรับ) ตรงคดีครบถ้วน | ระบุฐานความผิด/มาตราถูกต้อง แต่ลืมระบุอัตราโทษ | ตอบตรงคดีแต่มองภาพรวมกว้างๆ ไม่ระบุเลขมาตรา | ผิดคดี (เช่น ตอบ ม.16 ในคดี DDoS), สลับบทบาท, มั่ว |
| 🚑 **ผู้ระงับเหตุเฉพาะหน้า** | ระบุขั้นตอนระงับเหตุเฉพาะหน้า **และ/หรือ** ระบุผู้รับแจ้งตรงคดี | ระบุขั้นตอนระงับเหตุถูกต้อง แต่อาจขาดรายละเอียดการแจ้งช่วยเหลือ | มีแนวคิดหยุดเหตุตรงคดี แต่เป็นแนวทางทั่วไปไม่อธิบายวิธีเฉพาะทาง | เอามาตรากฎหมายมาตอบ, ผิดคดี, มั่ว |
| 🛡️ **วิศวกรความปลอดภัย** | เสนอ **แนวทางปฏิบัติ** (เช่น ตรวจสอบเว็บ/ลิงก์ก่อนให้ข้อมูล) **หรือ** **เครื่องมือทางเทคนิค** (เช่น 2FA, SSL, Firewall) ที่ตรงกับคดี | เสนอแนวทางปฏิบัติหรือเครื่องมือที่ตรงคดี แต่ยังอธิบายรายละเอียดไม่ครบถ้วน | ตอบแนวทางป้องกันกว้างๆ ไม่ตรงจุดเปราะบางหลักของคดี | ผิดคดี (เช่น เอาวิธีแจ้งลบรูปบูลลี่มาตอบคดี DDoS), สลับบทบาท, มั่ว |

---

## 🛡️ ระบบป้องกันคำตอบผิดคดี (Cross-Case Topic Mismatch Enforcement)

เพื่อป้องกันนักเรียนคัดลอกคำตอบจากคดีอื่นมาวางส่ง ระบบมี **3-Tier Cross-Case Validation Engine** ตรวจสอบข้ามคดีครบทั้ง 12 คดี:
- **ตรวจจับเลขมาตราข้ามคดี:** เช่น นำคำตอบมาตรา 16 (ตัดต่อรูป) ไปส่งในคดี DDoS ➔ ได้ **0 / 10** ทันที
- **ตรวจจับคีย์เวิร์ดโดเมนข้ามคดี:** เช่น นำคำตอบเรื่องการแจ้งลบรูปภาพไปส่งในคดีโดนยิงเว็บล่ม ➔ ได้ **0 / 10** ทันที
- **คำเตือนทางการศึกษา:** ระบบจะแสดงข้อความแจ้งเตือนชัดเจน เช่น *"คำตอบไม่ตรงกับคดี! ข้อความที่คุณระบุเป็นการแจ้งลบรูปบูลลี่ ไม่ตรงกับระบบป้องกันเซิร์ฟเวอร์สอบล่มจากการยิง DDoS"*

---

## 🎮 เกมหลัก: Cyber Shield Detective (อัตนัย 3 บทบาท)

### กติกาและขั้นตอนการเล่น

1. **ลงทะเบียนทีม:** ตั้งชื่อกลุ่มสายสืบ, เลือกห้องเรียน (ม.3/1 - ม.3/12), เพิ่มสมาชิก 1-10 คน (เลขที่, คำนำหน้า, ชื่อ-นามสกุล)
2. **รับสุ่ม 6 คดี:** ระบบสุ่ม 6 คดีจากคลัง 12 คดี แต่ละคดีมีการ์ตูน 9 ช่อง + คำร้องทุกข์
3. **วิเคราะห์ 3 บทบาท:** ทำทีละบทบาทตามลำดับ (กฎหมาย ➔ บรรเทาภัย ➔ ความปลอดภัย) พิมพ์คำตอบแล้วกดส่งประเมินผล
4. **ล็อกการแก้ไข:** เมื่อส่งครบ 3 บทบาทของคดีนั้นแล้ว จะล็อกทันทีเพื่อป้องกันการแก้ไข
5. **ใบเกียรติบัตร:** เมื่อทำครบ 6 คดี สามารถสรุปคะแนนรวม (เต็ม 180) และพิมพ์ใบเกียรติบัตร PDF

---

## 👩‍🏫 แผงควบคุมครูผู้สอน (Teacher Dashboard & Answer Bank)

### 1. แดชบอร์ดตรวจคะแนนสดเรียลไทม์ (`cyber_shield_teacher.html`)
- 🔐 **Passcode Protection:** ป้องกันด้วยรหัสผ่านครูผู้สอน
- 📊 **Realtime Scoreboard:** จัดกลุ่มคะแนนตามชื่อทีม (1 ทีม = 1 แถว) รวมคะแนนเต็ม 180 คะแนน
- 🔍 **Filter & Search:** กรองรายห้อง (ม.3/1 - ม.3/12) และค้นหาตามชื่อสมาชิก/ชื่อทีม
- 📋 **Detailed Roster Mode:** สลับโหมดดูเลขที่ คำนำหน้า และชื่อ-นามสกุลของสมาชิกทุกคนในทีม
- 🖨️ **PDF Export:** พิมพ์รายงานสรุปเกรดจัดรูปแบบ A4

### 2. คลังตัวอย่างคำตอบเด็ก ม.2-ม.3 (Grade 8-9 Answer Bank Tab 🎓)
แท็บใหม่ในหน้าแดชบอร์ดครู รวบรวมตัวอย่างคำตอบภาษาพูดเด็กวัยรุ่น ม.2 และ ม.3 ที่ผ่านการประเมิน **10/10 (คะแนนเต็ม)** และ **5/10 (คะแนนปานกลาง)** ครบทั้ง 12 คดี เพื่อให้คุณครูใช้เป็นเฉลยและเกณฑ์อ้างอิงในการสอน

---

## 📚 แฟ้ม 12 คดีหลักฐานการ์ตูน 9 ช่อง

| # | ชื่อคดี | มาตราความผิด | อัตราโทษสูงสุด |
|:---:|:---|:---|:---|
| 1 | แอบส่องระบบไอดีเกมของเพื่อน | ม.5 เข้าถึงระบบคอมพิวเตอร์โดยมิชอบ | จำคุก ≤6 เดือน / ปรับ ≤10,000 บาท |
| 2 | แจกรหัสผ่านระบบใน Discord | ม.6 เปิดเผยมาตรการป้องกันรหัสผ่าน | จำคุก ≤1 ปี / ปรับ ≤20,000 บาท |
| 3 | แอบคุ้ยไฟล์ไดอารี่แชทลับส่วนตัว | ม.7 เข้าถึงข้อมูลคอมพิวเตอร์โดยมิชอบ | จำคุก ≤2 ปี / ปรับ ≤40,000 บาท |
| 4 | ดักจับข้อมูลธุรกรรมเติมเกมกลางทาง | ม.8 ดักรับข้อมูลคอมพิวเตอร์ระหว่างส่ง | จำคุก ≤3 ปี / ปรับ ≤60,000 บาท |
| 5 | มือบอนแอบลบไฟล์โครงงานวิทย์เพื่อน | ม.9 ทำลาย/แก้ไข/ดัดแปลงข้อมูลผู้อื่น | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 6 | ยิง DDoS พังเซิร์ฟเวอร์เว็บสอบ | ม.10 รบกวน/ขัดขวางการทำงานของระบบ | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 7 | ส่งอีเมลสแปมขายของปลอมตัวตน | ม.11 วรรค 1 ส่งสแปมปกปิดแหล่งที่มา | ปรับ ≤100,000 บาท |
| 8 | บอทสแปมรัวๆ ปิดปุ่มยกเลิก | ม.11 วรรค 2 ส่งสแปมไม่เปิดโอกาสให้ยกเลิก | ปรับ ≤200,000 บาท |
| 9 | สร้างเว็บฟิชชิ่งหลอกสกินเกมฟรี | ม.14(1) นำเข้าข้อมูลเท็จ/หลอกลวง | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 10 | โพสต์ข่าวลวงภัยพิบัติจนคนแตกตื่น | ม.14(2) ข้อมูลเท็จสร้างความตื่นตระหนก | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 11 | โพสต์ภาพ/คลิปลามกลงสาธารณะ | ม.14(4) นำเข้าข้อมูลลามกอนาจาร | จำคุก ≤5 ปี / ปรับ ≤100,000 บาท |
| 12 | ตัดต่อหน้าเพื่อนประจานในโซเชียล | ม.16 ภาพตัดต่อทำให้ผู้อื่นเสียชื่อเสียง | จำคุก ≤3 ปี / ปรับ ≤200,000 บาท |

---

## 🛡️ ระบบป้องกันโกง (Anti-Cheat Shield)

| มาตรการ | รายละเอียดเทคนิค |
|:---|:---|
| **ชื่อไฟล์ภาพ Hashed** | ภาพหลักฐานใช้ชื่อแฮชสุ่ม (เช่น `case_ev_8f3a9b21.png`) ไม่สปอยล์มาตรา |
| **ปิด DevTools & คลิกขวา** | บล็อก F12, Ctrl+Shift+I/J/C, Ctrl+U, Ctrl+S และ Right-Click Context Menu |
| **Console Auto-Clear** | ตรวจจับการเปิด DevTools ➔ ล้างหน้าจอ Console อัตโนมัติ |
| **Zero-Spoiler UI** | ไม่มีเลขมาตราปะหน้าในภาพหลักฐาน ไทม์ไลน์ หรือ UI ส่วนใดๆ |
| **Submission Lock** | เมื่อส่งครบ 3 บทบาทแล้ว จะล็อกปุ่มส่งทันทีเพื่อป้องกันการแก้ไข |

---

## 🏗️ สถาปัตยกรรมโค้ด (Code Architecture)

```
คำตอบนักเรียน
    │
    ▼
┌───────────────────────┐
│ normalizeStudentSlang │ ──► แปลงสแลงเด็ก ม.2-ม.3 ➔ คำมาตรฐาน
└───────────────────────┘
    │
    ▼
┌───────────────────────┐     มี Gemini API Key?     ┌────────────────────────┐
│ isGibberishOrNonsense │ ──────── ใช่ ────────────► │ Google Gemini AI Engine│
└───────────────────────┘                            │ ระบบประเมิน 10/8/5/0   │
    │ ไม่ใช่                                          └────────────────────────┘
    ▼                                                            │
┌───────────────────────┐                                        ▼
│ evaluateLocally()     │ ◄────── ไม่มี Key ─────────── ┌────────────────────────┐
│ Heuristic Engine 4-Tier│                               │ บันทึก Supabase        │
└───────────────────────┘                               │ Realtime Database      │
    │                                                    └────────────────────────┘
    ▼
┌───────────────────────┐
│ แสดงผลคะแนน + ฟีดแบ็ก  │
└───────────────────────┘
```

---

## ⚡ การติดตั้ง Supabase Database

สร้างตาราง `game_scores` ใน **Supabase SQL Editor**:

```sql
-- 1. สร้างตารางรองรับคะแนนเกมหลัก
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

-- 2. เปิดใช้งาน Row Level Security & Policies
ALTER TABLE public.game_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous select" ON public.game_scores FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON public.game_scores FOR INSERT WITH CHECK (true);

-- 3. เปิด Realtime Replication
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_scores;
```

---

## ⚙️ การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ในโฟลเดอร์หลักของโปรเจกต์:

```env
PORT=3000
NODE_ENV=development

# Google Gemini API Key (สำหรับประเมินผลอัตนัย)
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Realtime Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# รหัสผ่านสำหรับแผงควบคุมครูผู้สอน
TEACHER_PASSCODE=your_secure_teacher_passcode
```

---

## 🚀 วิธีรันในเครื่อง (Local Setup)

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/puripong1st/tech-dm-cyber-detective.git
cd tech-dm-cyber-detective

# 2. ติดตั้ง Dependencies
npm install

# 3. สร้างไฟล์ .env
cp .env.example .env

# 4. รันเซิร์ฟเวอร์
npm start

# 5. เข้าใช้งานทางเบราว์เซอร์
# หน้าหลัก:      http://localhost:3000
# เกมหลัก:       http://localhost:3000/shield_detective
# แดชบอร์ดครู:   http://localhost:3000/shield_teacher
```

---

## 🌐 Deploy ขึ้น Vercel / GitHub Pages

### Deploy ขึ้น Vercel (แนะนำ — รองรับ Gemini AI เต็มรูปแบบ)
1. เชื่อมต่อ GitHub Repository กับ Vercel Project
2. กำหนดค่า Environment Variables ใน Vercel Dashboard:
   - `GEMINI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TEACHER_PASSCODE`
3. กด Deploy — ระบบจะรันผ่าน `vercel.json` โดยอัตโนมัติ

---

## 🔍 คลังคำค้นหา & การจัดหมวดหมู่ SEO (Search & Discovery Index)

โปรเจกต์นี้ได้รับการปรับแต่งโครงสร้างเนื้อหาและการค้นหา (SEO, Semantic Markup & Metadata) เพื่อให้ครูผู้สอน นักเรียน และผู้สนใจสามารถค้นพบบทเรียน เกมจำลอง และสไลด์การสอนได้ง่ายผ่าน Google, Bing, และ GitHub Search:

### 🏷️ GitHub Repository Topics (แนะนำสำหรับใส่ในหน้า Settings ของ GitHub)
```text
thai-cyber-law, computer-crime-act-2017, pdpa-thailand, cybersecurity-education, educational-game, interactive-slides, gemini-ai, supabase-realtime, thai-education, grade-9-computing-science, digital-citizenship, gamified-learning
```

### 📚 ความสอดคล้องกับหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน
- **กลุ่มสาระการเรียนรู้:** วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ)
- **ระดับชั้น:** มัธยมศึกษาปีที่ 2 และ มัธยมศึกษาปีที่ 3 (อายุ 14 - 15 ปี)
- **มาตรฐานการเรียนรู้:** มาตรฐาน ว 4.2 เข้าใจและใช้แนวคิดเชิงคำนวณในการแก้ปัญหาที่พบในชีวิตจริงอย่างเป็นขั้นตอนและเป็นระบบ ใช้เทคโนโลยีสารสนเทศและการสื่อสารในการเรียนรู้ การทำงาน และการแก้ปัญหาได้อย่างมีประสิทธิภาพ รู้เท่าทัน และมีจริยธรรม
- **ตัวชี้วัดสำคัญ:**
  - ใช้เทคโนโลยีสารสนเทศอย่างปลอดภัย มีความรับผิดชอบ สร้างและแสดงสิทธิในการเผยแพร่ผลงาน
  - รู้เท่าทันสื่อ ข่าวปลอม (Fake News) และการคุ้มครองข้อมูลส่วนบุคคล (PDPA)
  - เข้าใจข้อกฎหมายเกี่ยวกับคอมพิวเตอร์และบทลงโทษตาม พ.ร.บ.ว่าด้วยการกระทำความผิดเกี่ยวกับคอมพิวเตอร์ พ.ศ. 2560 (ฉบับที่ 2)

### 📖 สรุปสาระสำคัญ 12 มาตราตาม พ.ร.บ.คอมพิวเตอร์ 2560 ในระบบ
1. **มาตรา 5:** เข้าถึงระบบคอมพิวเตอร์ของผู้อื่นโดยมิชอบ (แอบเข้าไอดี / รหัสผ่าน)
2. **มาตรา 6:** ล่วงรู้มาตรการป้องกันการเข้าถึงและนำไปเปิดเผยโดยมิชอบ
3. **มาตรา 7:** เข้าถึงข้อมูลคอมพิวเตอร์ของผู้อื่นโดยมิชอบ (แอบดูข้อมูลส่วนตัว / แชท)
4. **มาตรา 8:** ดักรับข้อมูลคอมพิวเตอร์ของผู้อื่นโดยมิชอบ (ดักฟัง / ดักจับสัญญาณ Wi-Fi)
5. **มาตรา 9:** แก้ไข ดัดแปลง หรือทำลายข้อมูลคอมพิวเตอร์ของผู้อื่น (ลบงาน / แก้เกรด / ส่งไวรัส)
6. **มาตรา 10:** รบกวน ขัดขวาง หรือระงับระบบคอมพิวเตอร์ของผู้อื่น (ยิง DDoS / ทำให้ระบบล่ม)
7. **มาตรา 11:** ส่งสแปม ข้อมูลคอมพิวเตอร์ หรืออีเมลรบกวนโดยไม่มีทางปฏิเสธ (Spam)
8. **มาตรา 12:** กระทำความผิดต่อระบบความมั่นคง ปลอดภัยสาธารณะ หรือเศรษฐกิจ
9. **มาตรา 13:** จำหน่ายหรือเผยแพร่ชุดคำสั่งเพื่อใช้ในการกระทำผิด (โปรโกง / เครื่องมือแฮก)
10. **มาตรา 14:** นำเข้าข้อมูลอันเป็นเท็จ บิดเบือน ข่าวปลอม ลามกอนาจาร หรือกระทบความมั่นคง
11. **มาตรา 15:** ผู้ให้บริการยินยอมหรือรู้เห็นเป็นใจให้เกิดการกระทำผิดตามมาตรา 14
12. **มาตรา 16:** ตัดต่อ เติม หรือดัดแปลงภาพของผู้อื่นที่ทำให้เสื่อมเสียชื่อเสียง ถูกดูหมิ่นเกลียดชัง

### 🔑 คำสำคัญสำหรับการค้นหา (High-Intent Search Keywords)
- **ภาษาไทย:** กฎหมายคอมพิวเตอร์, พ.ร.บ. คอมพิวเตอร์ 2560, พรบคอม 12 มาตรา, พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล, PDPA ม.3, สื่อการสอนวิทยาการคำนวณ ม.2 ม.3, สไลด์บทเรียน พ.ร.บ.คอมพิวเตอร์, เกมสืบคดีกฎหมายคอม, Cyber Shield Detective, ระบบประเมินผล AI ตรวจข้อสอบ, ข้อสอบกฎหมายคอมพิวเตอร์ 12 คดีพร้อมเฉลย, แดชบอร์ดครูวิทยาการคำนวณ
- **English:** Thai Computer Crime Act B.E. 2560 (2017), PDPA Thailand, Cyber Law Educational Game, Interactive Presentation Slides, Generative AI Answer Evaluator, Gemini AI Education, Cyber Safety Grade 9 Thailand, Digital Citizenship Learning Platform

---

<div align="center">
  <sub>พัฒนาขึ้นเพื่อสนับสนุนการเรียนการสอนกลุ่มสาระการเรียนรู้วิทยาศาสตร์และเทคโนโลยี (วิทยาการคำนวณ) ระดับชั้น ม.2 และ ม.3</sub>
  <br/>
  <sub>© 2026 Cyber Law Detective & Teacher Platform. All rights reserved.</sub>
</div>

