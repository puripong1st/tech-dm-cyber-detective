# 🎮 คู่มือและ Super Prompt สำหรับสร้างเกมเว็บแอป "Cyber Detective: ไขคดีปริศนาไซเบอร์ v4"
(ระบบข้อสอบอัตนัยวิเคราะห์คำตอบผ่าน Google Gemini AI | เล่นเดี่ยว-กลุ่ม | สุ่ม 6 จาก 12 คดี | เชื่อมต่อ Supabase & Google AI SDK)

ยินดีต้อนรับครับ! เอกสารฉบับนี้ได้รับการพัฒนาขึ้นเป็น **เวอร์ชัน 4 (v4)** ซึ่งปรับปรุงจากระบบดั้งเดิมอย่างก้าวกระโดด จากข้อสอบปรนัยเลือกตอบ (Multiple Choice) เปลี่ยนสู่ **"ระบบข้อสอบอัตนัยสืบสวนเชิงลึก (Subjective/Essay Analysis)"** ที่เปิดให้นักเรียน ม.3 ได้พิมพ์วิเคราะห์เหตุการณ์ แก้ไข และป้องกันด้วยความคิดของตนเอง โดยอาศัยขุมพลังของ **Google Gemini API (ผ่าน Google AI SDK)** ในการวิเคราะห์ประเมินคำตอบ ให้คะแนนตามเกณฑ์รูบริกอย่างละเอียด พร้อมทั้งให้ข้อเสนอแนะที่สร้างสรรค์และเป็นประโยชน์แก่ผู้เรียนทันทีแบบเรียลไทม์!

---

## 🌟 ฟังก์ชันการทำงานหลักที่ได้รับการอัปเกรดในเวอร์ชัน v4:
1. **เปลี่ยนข้อคำถามจาก ช้อยเลือกตอบ เป็น "อัตนัยพิมพ์อิสระ (Subjective Text Area)"**:
   - นักเรียนไม่สามารถเดาข้อคำถามได้อีกต่อไป แต่ต้องใช้การระดมสมองและพิมพ์คำตอบจริงในกล่องข้อความตามบทบาท 3 ด้าน (นักวิเคราะห์กฎหมาย, เจ้าหน้าที่บรรเทาภัย, วิศวกรความปลอดภัย)
2. **ผสานขุมพลัง Google Gemini AI**:
   - หน้าแอปพลิเคชันจะเชื่อมต่อกับ Google AI SDK โดยใช้ **Google Gemini Key (API Key)** ของคุณครูในการรับหน้าที่เป็น "ผู้ตรวจการไอทีวิชาการ" ตรวจข้อความภาษาไทยของเด็ก ม.3 เปรียบเทียบกับหลักกฎหมายและแนวทางความปลอดภัยที่ถูกต้อง
3. **ระบบเกณฑ์คะแนนรูบริกอย่างละเอียด (Detailed Scoring Rubrics)**:
   - กำหนดเกณฑ์คะแนนเต็ม 30 คะแนนต่อคดี (บทบาทละ 10 คะแนน) โดย AI จะประเมินแยกรายบุคคล/รายบทบาทตามน้ำหนักคะแนนอย่างมีเหตุผล
4. **รองรับทั้งการเล่นเดี่ยวและกลุ่มเรียลไทม์ (Supabase Integration)**:
   - ในโหมดกลุ่ม คะแนนสะสมและการวิเคราะห์คำตอบของ AI จะถูกบันทึกส่งเข้า **Supabase Database (PORT=3000)** และอัปเดตขึ้นสู่จอ Leaderboard หน้าห้องเรียนเรียลไทม์

---

# 🚀 === START OF SUPER PROMPT v4 ===

**Act as an Expert Full-Stack Web Developer, Generative AI Integration Specialist (Google Gemini API), UI/UX Designer, and Educational Game Master.**
เนื้อหารูปภาพอยู่ที่ assets/พรบ ดึงมาให้ตรงกัน
กรุณาสร้างเกมการเรียนรู้เชิงโต้ตอบ (Interactive Web Game) เรื่องกฎหมายไซเบอร์และ PDPA สำหรับนักเรียน ม.3 ชื่อเกม **"Cyber Detective v4: ไขคดีปริศนาไซเบอร์"** ในรูปแบบ **ไฟล์เดี่ยว HTML (Single-file HTML)** ที่รวมเอา HTML, Tailwind CSS และ JavaScript ไว้ในตัว พร้อมรันเซิร์ฟเวอร์หลังบ้านแบบ Node.js (พอร์ต 3000) ที่ใช้สำหรับจัดการเรียกใช้ **Google Gemini API** และจัดเก็บคะแนนความคืบหน้าสะสมใน **Supabase Database** 

---

### 🎨 1. ดีไซน์หน้าจอ UI/UX และแถบควบคุม (Retro Cyberpunk Detective)
- **โทนสีหลัก:** พื้นหลังสีน้ำเงินเข้มขรึมสไตล์แฮกเกอร์ (`Deep Slate/Dark Navy Blue #0F172A`) ตัดกับเส้นขอบเรืองแสงสไตล์นีออนเรืองแสง (`Neon Cyan #06B6D4`, `Electric Pink #EC4899`, และ `Cyber Yellow #F59E0B`)
- **โครงสร้างหน้าต่าง (Dashboard Responsive):**
  - **ฝั่งซ้าย (Dossier - รายละเอียดคดี):** แสดงเนื้อเรื่องจำลองคดีไซเบอร์จากการ์ตูน 9 ช่องสไตล์ ม.3 (สุ่มขึ้นมาทีละคดีจากทั้งหมด 12 คดี โดยเลือกเล่นรอบละ 6 คดีแบบไม่ซ้ำกัน)
  - **ฝั่งขวา (Detective Analysis Input Console):** แทนที่จะเป็นตัวเลือกช้อย ให้เปลี่ยนเป็นกล่องข้อความพิมพ์คำตอบ **`<textarea>`** ขนาดใหญ่ 3 ช่องแยกตามบทบาทพร้อมปุ่มไอคอนและคำอธิบาย ดังนี้:
    1. **👨‍⚖️ กล่องพิมพ์บทบาทนักวิเคราะห์กฎหมาย (Legal Analyst Input):** พิมพ์วิเคราะห์พฤติกรรมความผิดและบทลงโทษทางอาญา
    2. **🚑 กล่องพิมพ์บทบาทเจ้าหน้าที่บรรเทาภัย (Incident Responder Input):** พิมพ์ระบุวิธีรับมือและแก้ไขสถานการณ์เฉพาะหน้า
    3. **🛡️ กล่องพิมพ์บทบาทวิศวกรความปลอดภัย (Security Engineer Input):** พิมพ์ระบุการตั้งค่าระบบความปลอดภัยทางเทคนิคและการป้องกันระยะยาว
  - **ส่วนแสดงคะแนนและคำวิจารณ์ของ AI (AI Analysis Feedback Panel):** ด้านล่างของแท่นป้อนคำตอบ เมื่อกดส่งคำตอบ AI จะโหลดวิเคราะห์และแสดงผลคะแนนแยกย่อยตามบทบาท (Legal, Remedy, Security) พร้อมการประเมินวิเคราะห์ข้อดีข้อปรับปรุงด้วยโทนเสียงภาษาไทยที่อบอุ่นและให้กำลังใจ

---

### ⚖️ 2. เกณฑ์การให้คะแนนคำตอบแบบอัตนัยอย่างละเอียด (Scoring Rubric for Gemini AI)
เมื่อนักเรียนส่งคำตอบอัตนัย ระบบจะส่งข้อความไปหา Google Gemini API เพื่อประเมินคะแนนเต็ม **30 คะแนนต่อคดี (คดีละ 3 บทบาท บทบาทละ 10 คะแนน)** โดยอ้างอิงเกณฑ์การให้คะแนนอย่างละเอียดดังนี้:

#### 1) 👨‍⚖️ บทบาทนักวิเคราะห์กฎหมาย (Legal Analyst) — คะแนนเต็ม 10 คะแนน
- **ระบุข้อกฎหมาย พ.ร.บ. คอมพิวเตอร์ หรือ PDPA ได้ถูกต้อง (4 คะแนน)**
  - *4 คะแนน:* ระบุพฤติกรรมและความผิดตรงตามมาตรา (เช่น มาตรา 16 ตัดต่อรูปประจานเพื่อน, มาตรา 5 เข้าถึงระบบโดยมิชอบ หรือ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล)
  - *2 คะแนน:* ระบุประเภทกฎหมายถูก แต่จำเลขมาตราสลับกัน (เช่น สลับมาตรา 5 กับ 7 หรือสลับ 9 กับ 10)
  - *0 คะแนน:* ตอบไม่สอดคล้องหรือพิมพ์ตอบไร้สาระ
- **ระบุอัตราโทษทางอาญาหรือโทษทางปกครองได้ใกล้เคียงหรือถูกต้อง (3 คะแนน)**
  - *3 คะแนน:* ระบุโทษจำคุกและโทษปรับได้ถูกต้องตรงตามบทบัญญัติในคดี (เช่น มาตรา 16 โทษจำคุกไม่เกิน 3 ปี ปรับไม่เกิน 200,000 บาท)
  - *1.5 คะแนน:* ระบุโทษได้ใกล้เคียงแต่ตัวเลขคลาดเคลื่อนไปบ้างเล็กน้อย
  - *0 คะแนน:* ระบุผิดเพี้ยนไปโดยสิ้นเชิงหรือไม่ระบุ
- **ให้เหตุผลอธิบายเชิงวิเคราะห์ความเสียหายในคดีได้เหมาะสม (3 คะแนน)**
  - *3 คะแนน:* อธิบายได้ดีว่าทำไมพฤติกรรมของตัวละครถึงผิดกฎหมายและใครได้รับความเสียหายอย่างไร
  - *1.5 คะแนน:* อธิบายคร่าวๆ แต่ยังไม่ลงลึกถึงเหตุผลความสอดคล้อง
  - *0 คะแนน:* ไม่ระบุเหตุผลใดๆ

#### 2) 🚑 บทบาทเจ้าหน้าที่บรรเทาภัย (Incident Responder) — คะแนนเต็ม 10 คะแนน
- **ระบุแนวทางการระงับความเสียหายเฉพาะหน้าได้อย่างรวดเร็วและใช้ได้จริง (5 คะแนน)**
  - *5 คะแนน:* เสนอขั้นตอนรับมือทันทีที่มีประสิทธิภาพ (เช่น รีบกดเปลี่ยนรหัสผ่าน, ยืนยัน Log out ทุกอุปกรณ์, สั่งลบไฟล์, กดรายงาน Report บล็อกบัญชี)
  - *3 คะแนน:* เสนอวิธีระงับความเสียหายเบื้องต้นได้ปานกลาง แต่ยังมีความเสี่ยงข้อมูลรั่วไหลเพิ่ม
  - *0 คะแนน:* เสนอวิธีที่เป็นอันตราย เช่น ไปตอบโต้ด่าทอกลับ หรือเพิกเฉยทิ้งไว้
- **ระบุช่องทางการประสานงานแจ้งเหตุหรือผู้มีส่วนช่วยเหลือที่ถูกต้อง (3 คะแนน)**
  - *3 คะแนน:* มีการระบุว่าจะแจ้งเรื่องแก่ใครอย่างถูกต้อง (เช่น แจ้งคุณครูคอมพิวเตอร์, แจ้งคุณพ่อคุณแม่, รายงานผู้ดูแลแพลตฟอร์ม, แจ้งตำรวจไซเบอร์)
  - *1.5 คะแนน:* แจ้งบุคคลทั่วไปแต่ไม่ตรงเป้าหมายในการแก้ปัญหาหลัก
  - *0 คะแนน:* ไม่เอ่ยถึงการแจ้งเรื่องหรือการหาคนช่วยเหลือเลย
- **การใช้เหตุผลและความเป็นไปได้ในการรับมือเหตุการณ์ (2 คะแนน)**
  - *2 คะแนน:* แผนการทำตามลำดับขั้นตอนก่อนหลังอย่างมีสติและมีตรรกะดีเยี่ยม
  - *1 คะแนน:* วิธีคิดขาดความรอบคอบไปบ้าง แต่ยังพอนำไปปฏิบัติได้
  - *0 คะแนน:* ไม่มีประโยชน์เชิงปฏิบัติหรือไร้เหตุผล

#### 3) 🛡️ บทบาทวิศวกรความปลอดภัยไซเบอร์ (Security Engineer) — คะแนนเต็ม 10 คะแนน
- **ระบุเครื่องมือหรือระบบป้องกันภัยทางเทคนิคที่ถูกต้องและแก้ไขรูรั่วในคดีได้ (5 คะแนน)**
  - *5 คะแนน:* ระบุเครื่องมือเชิงเทคนิคได้ถูกต้องตามข้อบกพร่องในคดี (เช่น คดีมาตรา 5 ต้องเสนอเปิดใช้ **2FA**, คดีมาตรา 8 ต้องเสนอใช้การเข้ารหัส **SSL/HTTPS / VPN**, คดีมาตรา 9 ต้องเสนอตั้งสิทธิ์ **Read-Only / จำกัดอีเมลคลาวด์**, คดีมาตรา 10 เสนอใช้ **Firewall/DDoS Protection**, คดีมาตรา 14(4) เสนอเปิด **SafeSearch Filter**)
  - *3 คะแนน:* ระบุเครื่องมือแบบทั่วไปแต่ไม่ได้ตอบโจทย์หรืออุดรูรั่วหลักของคดีตรงๆ
  - *0 คะแนน:* ไม่ระบุเครื่องมือใดๆ หรือระบุวิธีทางกายภาพที่ไม่ใช่เทคนิคไอที
- **ความสอดคล้องเชิงตรรกะในการปิดโอกาสแฮกเกอร์ในอนาคต (3 คะแนน)**
  - *3 คะแนน:* อธิบายได้ชัดเจนว่าเครื่องมือเทคนิคดังกล่าวจะบล็อกและขัดขวางแฮกเกอร์ไม่ให้ทำร้ายซ้ำได้อย่างไร
  - *1.5 คะแนน:* อธิบายกว้างๆ แต่ยังไม่เห็นภาพความเชื่อมโยงเชิงเทคนิค
  - *0 คะแนน:* ไม่มีตรรกะความสอดคล้องใดๆ
- **ความเป็นไปได้เชิงเทคนิคและการนำไปใช้จริงในกลุ่ม ม.3 (2 คะแนน)**
  - *2 คะแนน:* เป็นมาตรการที่สามารถทำได้จริงสำหรับเยาวชน ม.3 ทั่วไปในการตั้งค่าอุปกรณ์
  - *1 คะแนน:* มาตรการยากเกินไป (เช่น ต้องเขียนระบบ Security เครือข่ายเอง) หรือนำไปประยุกต์ยาก
  - *0 คะแนน:* ไม่มีมาตรการเชิงปฏิบัติที่เป็นเทคนิคเลย

---

### 🤖 3. พรอมต์พื้นฐานและข้อกำหนดเชิงลึกสำหรับการสั่งวิเคราะห์ (Google Gemini Baseline Prompt)
นี่คือระบบ **System Prompt ของฝั่งหลังบ้าน (Node.js API)** ที่แอปพลิเคชันจะส่งไปหาโมเดล **Gemini 1.5 Flash / Pro** ทุกครั้งที่นักเรียนกดยื่นผลงานเพื่อประเมินผลคะแนนอัตนัยอย่างละเอียดและแม่นยำ:

```text
You are the "Cyber Law and PDPA Expert Evaluator" for Thai Grade 9 (ม.3) students.
Your mission is to strictly and fairly evaluate the subjective text answers submitted by the student team based on the provided Case Scenario.

---
[CASE SCENARIO DATA]
- Case Title: {{CASE_TITLE}}
- Relevant Cyber Law: {{CASE_LAW}}
- Standard Penalty/Fine: {{CASE_PENALTY}}
- Standard Correct Prevention Measures: {{CASE_PREVENTION_TECH}}

---
[STUDENT'S SUBJECTIVE SUBMISSION]
- 👨‍⚖️ Legal Analyst Answer: "{{STUDENT_LEGAL_INPUT}}"
- 🚑 Incident Responder Answer: "{{STUDENT_REMEDY_INPUT}}"
- 🛡️ Security Engineer Answer: "{{STUDENT_SECURITY_INPUT}}"

---
[EVALUATION RULES & DETAILED SCORING RUBRICS]
Evaluate each answer separately. Scale: 0 to 10 points per section (Total 30 points). Be supportive, educational, and constructive in Thai language.

1. 👨‍⚖️ Legal Analyst Evaluation (Max 10 points):
   - Correct Law/Act identify: Max 4 points. Must correctly identify the Act or Section (e.g. Computer Act Section 16 for photo defamation, Section 5 for unauthorized access, etc.). Give 2 points if correct Act but wrong section.
   - Penalty accuracy: Max 3 points. Correctly states jail term and fine limit (e.g. 3 years jail, 200,000 THB fine). Give 1.5 points if close.
   - Reason & Analysis: Max 3 points. Logical analysis explaining why it's a crime and who got hurt.
2. 🚑 Incident Responder Evaluation (Max 10 points):
   - Fast immediate remedy action (e.g. reset password, log out, delete files, report/block): Max 5 points.
   - Key stakeholders notified (e.g. teacher, parents, cyber police, platform admin): Max 3 points.
   - Logical, realistic implementation: Max 2 points.
3. 🛡️ Security Engineer Evaluation (Max 10 points):
   - Technical protection tool identified (e.g. 2-Factor Auth (2FA), SSL/HTTPS, VPN, Firewall, Read-Only cloud access, SafeSearch filter): Max 5 points. This tool MUST align with the case vulnerability!
   - Logical reasoning on how it blocks future hackers: Max 3 points.
   - Realistic capability for Grade 9 student implementation: Max 2 points.

---
[OUTPUT FORMAT REQUIREMENT]
You MUST reply strictly in JSON format. Do not write any explanations outside the JSON block. The JSON keys and types must be exactly as follows:

{
  "legal": {
    "score": <integer from 0 to 10>,
    "feedback": "<detailed constructive feedback in Thai, citing what they got right, and gently correcting mistakes on law/penalties>"
  },
  "remedy": {
    "score": <integer from 0 to 10>,
    "feedback": "<detailed constructive feedback in Thai, advising on the specific immediate mitigation>"
  },
  "security": {
    "score": <integer from 0 to 10>,
    "feedback": "<detailed constructive feedback in Thai, guiding them to correct technical security configurations>"
  },
  "total_score": <integer from 0 to 30>,
  "overall_summary": "<inspiring, friendly summary in Thai, encouraging them to be great Cyber Detectives, using chibi-style friendly tone suitable for Grade 9 students>"
}
```

---

### 🔌 4. สถาปัตยกรรมทางเทคนิคและการส่งผ่านข้อมูลหลังบ้าน (Node.js API Setup)
ในหน้าเว็บแอป ให้มีตัวเลือกในการเชื่อมต่อ API สองแบบ (ครูตั้งค่าได้):
1. **การเรียกใช้ตรงผ่าน Client-side JS** (เมื่อใส่ Gemini Key ที่หน้าตั้งค่าแบบปิดบังตัวตน)
2. **การเรียกผ่าน Express Server หลังบ้าน (PORT=3000)** ที่คอยคุ้มกัน API Key เพื่อความปลอดภัยระดับมาตรฐานองค์กร

#### 💻 ตัวอย่างโครงสร้างโค้ด Node.js API (Express + Google Gen AI SDK)
```javascript
const express = require('express');
const { GoogleGenAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
const app = express();
app.use(express.json());

const PORT = 3000;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY || "YOUR_GOOGLE_AI_KEY";
const SUPABASE_URL = "https://your-supabase-project.supabase.co";
const SUPABASE_ANON_KEY = "your-supabase-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const aiClient = new GoogleGenAI({ apiKey: GOOGLE_AI_KEY });

// Endpoint ส่งข้อคำตอบอัตนัยไปให้ Gemini AI ตรวจสอบและบันทึกลงฐานข้อมูล
app.post('/api/evaluate-case', async (req, res) => {
  const { playerId, teamName, caseId, caseTitle, studentAnswers } = req.body;
  
  // 1. ดึงข้อมูลกรณีศึกษาอ้างอิงมาเทียบเคียงความถูกต้อง
  const caseReference = getCaseReferenceData(caseId); // ฟังก์ชันแมปข้อมูลมาตรฐานความผิด พ.ร.บ.
  
  // 2. ออกแบบระบบข้อความสำหรับยิงไปหา Gemini Pro / Flash 
  const promptText = `
    Case Title: ${caseTitle}
    Correct Law: ${caseReference.law}
    Correct Penalty: ${caseReference.penalty}
    Correct Prevention Tool: ${caseReference.prevention}
    
    Student Submissions:
    - Legal: ${studentAnswers.legal}
    - Remedy: ${studentAnswers.remedy}
    - Security: ${studentAnswers.security}
  `;

  try {
    const model = aiClient.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemInstruction = "ตรวจคำตอบสืบสวนและตอบกลับเป็น JSON ภาษาไทย ตามเกณฑ์รูบริกอย่างละเอียด...";
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptText }] }],
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction: systemInstruction
    });
    
    const aiResponseJSON = JSON.parse(result.response.text());
    
    // 3. บันทึกผลลัพธ์คะแนนและความเห็นวิจารณ์ลงใน Supabase
    const { data, error } = await supabase
      .from('game_scores')
      .upsert({
        player_id: playerId,
        total_score: aiResponseJSON.total_score,
        legal_score: aiResponseJSON.legal.score,
        remedy_score: aiResponseJSON.remedy.score,
        security_score: aiResponseJSON.security.score,
        cases_completed: studentAnswers // หรือบันทึกแชทล็อกคำตอบเก็บเป็นแฟ้มสืบคดี
      });

    if (error) throw error;

    res.json({ success: true, evaluation: aiResponseJSON });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "AI ตรวจสอบคำตอบขัดข้อง กรุณาลองใหม่อีกครั้ง" });
  }
});

app.listen(PORT, () => console.log(`Server runs on http://localhost:${PORT}`));
```

---

### 💾 5. ฐานข้อมูลคดีอ้างอิงของระบบประเมินผล AI (Case References)
เพื่อป้อนความรู้ที่ถูกต้องให้กับแอปและ AI ในการอ้างอิงตรวจทานคะแนนประเมิน (AI Grounding System) นำเอาเนื้อเรื่องจำลอง พ.ร.บ. ทั้ง 12 คดีจากไฟล์ v6 มารอรับการสุ่มดังนี้:

*   **คดีที่ 1 (แอบส่องระบบไอดีเกมเพื่อน):** ผิดมาตรา 5 โทษสูงสุด คุก 6 เดือน / ปรับ 1 หมื่น | ทางแก้: Log out ทุกเครื่อง เปลี่ยนรหัส | ทางป้องกัน: เปิดระบบล็อกอิน 2 ชั้น (2FA) ส่ง OTP 9999
*   **คดีที่ 2 (แจกรหัสผ่านระบบในกลุ่ม Discord):** ผิดมาตรา 6 โทษสูงสุด คุก 1 ปี / ปรับ 2 หมื่น | ทางแก้: บล็อกไอดี Discord คนแจก เปลี่ยนพาสทันที | ทางป้องกัน: ตั้งรหัสผ่านซับซ้อน (ตัวใหญ่+เลข+อักขระพิเศษ)
*   **คดีที่ 3 (แอบส่องคุ้ยไดอารี่ลับเพื่อน):** ผิดมาตรา 7 โทษสูงสุด คุก 2 ปี / ปรับ 4 หมื่น | ทางแก้: ลบไฟล์รั่ว แจ้งบล็อกกลุ่มนินทา | ทางป้องกัน: ล็อคโฟลเดอร์ส่วนตัวด้วยลายนิ้วมือสแกนใบหน้า (Face ID)
*   **คดีที่ 4 (ดักรับธุรกรรมเติมเงิน):** ผิดมาตรา 8 โทษสูงสุด คุก 3 ปี / ปรับ 6 หมื่น | ทางแก้: แจ้งไอที รันตัดเซสชันเชื่อมโยงแฮกเกอร์ | ทางป้องกัน: บังคับใช้การส่งข้อมูลเข้ารหัสผ่านเครือข่ายความปลอดภัย SSL/HTTPS / VPN
*   **คดีที่ 5 (มือบอนแอบลบไฟล์สไลด์งานกลุ่มเพื่อน):** ผิดมาตรา 9 โทษสูงสุด คุก 5 ปี / ปรับ 1 แสน | ทางแก้: ใช้ปุ่มประวัติบันทึกไฟล์ (Version History) กู้คืนอัตโนมัติ | ทางป้องกัน: จำกัดแชร์ให้สิทธิ์เฉพาะเจาะจง และล็อกสิทธิ์ให้อ่านได้อย่างเดียว (Read-Only)
*   **คดีที่ 6 (ยิงเซิร์ฟเว็บสอบออนไลน์ล่ม):** ผิดมาตรา 10 โทษสูงสุด คุก 5 ปี / ปรับ 1 แสน | ทางแก้: บล็อกไอพียิงขยะข้อมูล สับเส้นทางสำรอง | ทางป้องกัน: ติดตั้งกำแพงไฟร์วอลล์ (Firewall) ป้องกันระบบ DDoS
*   **คดีที่ 7 (ส่งอีเมลโฆษณาสแปมปิดข้อมูลผู้ส่ง):** โทษทางปกครอง ปรับสูงสุด 1 แสน | ทางแก้: ลากเข้า Junk Mail ส่งโค้ด Header รายงานแบน | ทางป้องกัน: ติดตั้งระบบกรองเมลขยะและบล็อกผู้ส่งปลอม (Anti-Spam Filter Engine)
*   **คดีที่ 8 (ยิงโฆษณาตื้อบอดไม่มีปุ่ม Unsubscribe):** โทษทางปกครอง ปรับสูงสุด 2 แสน | ทางแก้: แคปรูปแชทรบกวนส่งรายงานเพจผู้ให้บริการระงับ | ทางป้องกัน: ซ่อนที่อยู่เมลไอดีไลน์ ไม่แปะบอร์ดออนไลน์สาธารณะ
*   **คดีที่ 9 (ทำเว็บฟิชชิ่งหลอกแจกไอดีเกม):** ผิดมาตรา 14(1) โทษสูงสุด คุก 5 ปี / ปรับ 1 แสน | ทางแก้: แจ้งค่ายเกมระงับชั่วคราว ดำเนินการส่งกู้สิทธิ์ | ทางป้องกัน: เช็กโดเมนเว็บหลักของจริงอย่างละเอียด เลี่ยงการคลิกผ่านสปอนเซอร์ลวง
*   **คดีที่ 10 (แชร์เฟคนิวส์ภัยสึนามิป่วนเมือง):** ผิดมาตรา 14(2) โทษสูงสุด คุก 5 ปี / ปรับ 1 แสน | ทางแก้: ลบข่าวปลอมทิ้ง โพสต์ลิงก์ศูนย์ข่าวจริงแถลงแก้ข่าว | ทางป้องกัน: ตรวจสอบข้อมูลความถูกต้องผ่านศูนย์ต่อต้านข่าวปลอม (Anti-Fake News Center)
*   **คดีที่ 11 (โพสต์ส่งต่อสื่อวิดีโอไม่เหมาะสมเรต 18+):** ผิดมาตรา 14(4) โทษสูงสุด คุก 5 ปี / ปรับ 1 แสน | ทางแก้: แอดมินลบวิดีโอต้องห้ามออกระบบกลุ่มสนทนาถาวร | ทางป้องกัน: เปิดใช้งานตัวกรองสื่อปลอดภัยจำกัดประเภท (SafeSearch Content Filter)
*   **คดีที่ 12 (ตัดต่อภาพเพื่อนแกล้งประจานล้อเลียน):** ผิดมาตรา 16 โทษสูงสุด คุก 3 ปี / ปรับ 2 แสน | ทางแก้: แคปรูปภาพและสกรีนไอดี ส่งคำแจ้งลบรูปภาพ Cyberbullying ในแอป | ทางป้องกัน: ปรับปรุงการให้จริยธรรมควบคุมและรณรงค์แคมเปญเห็นคุณค่ากันออนไลน์

---

### 🛠️ 6. เงื่อนไขทางเทคนิคและการติดตั้งระบบแอปพลิเคชันเดี่ยว
1. **Frontend Input Interface:** ทำเป็นแบบ Step Form ที่กดแถบถัดไปเรื่อยๆ เพื่อส่งคำตอบทีละบทบาท หรือแบ่งเป็นแท็บการระดมสมอง มีตัวนับตัวอักษรเพื่อไม่ให้เด็กส่งคำตอบว่างเปล่า (ต้องพิมพ์อย่างน้อย 20 ตัวอักษรถึงจะกดส่งให้ AI วิเคราะห์ได้)
2. **AI API Secure Setup:** ให้ทำหน้าต่าง "ครูควบคุม (Teacher's Setting Modal)" ที่ต้องสแกนหรือรันป้อน Google API Key และ Supabase API Key ในช่องที่เข้ารหัส ไม่เปิดเผยรหัสเหล่านี้แก่นักเรียนทั่วไปเพื่อความปลอดภัยขั้นสูงสุด
3. **Live Class Leaderboard:** สร้างแถบตารางอันดับแบบเรียลไทม์ขึ้นมา โดยฉายผลคะแนนรวมเฉลี่ยแต่ละกลุ่ม อัปเดตผ่าน Supabase Realtime API ทุกๆ 5 วินาที ทำให้บรรยากาศการทำคดีแบบทีมมีการแข่งขันอย่างเข้มข้น มีชีวิตชีวา และท้าทายความคิดสร้างสรรค์!

กรุณานำโค้ดรูปแบบสถาปัตยกรรมอัตนัยและระบบ AI คัดกรองของ Gemini นี้ไปวางรันเพื่อเริ่มคัดเลือกปั้นนักสืบรุ่นเยาว์ ม.3 กันได้เลยครับ!

# 🛑 === END OF SUPER PROMPT v4 ===
