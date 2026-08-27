# Cyber Shield Detective — working brand spec

สกัดจาก `pdpa_assignment_board.html` และไฟล์ใน `assets/` เพื่อใช้ร่วมกันในต้นแบบทั้ง 3 ทิศทาง

## Core assets

- เครื่องหมายหลัก: `../assets/pdpa_icon.png` (มี WebP และ JPG สำรอง)
- ตัวละครที่มีอยู่: `mascot_judge.png`, `mascot_scan.png`, `mascot_win.png`, `mascot_law.png`
- ภาพประกอบที่มีอยู่: `chibi_judge.jpg`, `chibi_law.jpg`, `chibi_scan.jpg`
- ไม่ใช้โลโก้ Canva ในงาน; “เหมือน Canva” หมายถึงความคุ้นเคยของ editor architecture และ interaction เท่านั้น

## Existing color language

- Ink / workspace: `#0b0f19`, `#0f172a`, `#131c2e`
- Primary action: emerald `#22c55e` / `#10b981`
- Supporting accents: cyan `#06b6d4`, blue `#3b82f6`, amber `#eab308`
- Paper themes ที่มีอยู่: cream, pink, blue, white/gray, dossier, cyber
- Q1/Q2/Q3 ใช้ red / amber / emerald เป็น semantic color และต้องคงไว้เพื่อช่วยการสแกนเนื้อหา

## Typography already available

- UI/body: Prompt, Kanit, Sarabun, Bai Jamjuree
- Technical labels: Chakra Petch
- Friendly/handwritten options: Mali, Itim, Charmonman
- ต้นแบบใช้ `Bai Jamjuree` หรือ `Prompt` เป็น UI body และ `Chakra Petch` เฉพาะ case code/technical labels เพื่อไม่ให้ทั้งหน้ากลายเป็นเกมไซเบอร์

## Brand tone and constraints

- กลุ่มผู้ใช้หลักคือนักเรียน ม.3; หน้าตาต้องสนุก แต่ไม่เด็กเกินไปและไม่ทำให้การส่งงานดูไม่เป็นทางการ
- “นักสืบไซเบอร์” เป็น visual motif ได้ แต่ต้องรับใช้การวิเคราะห์คดี ไม่ใช่ใส่ตกแต่งเต็มจอ
- งานพิมพ์ A4 แนวนอน 1123×794 px เป็น output หลักและต้องคงขนาด/ความชัดในการ export
- registration, live sync, local persistence และ PDF export เป็นฟังก์ชันเดิมที่ห้ามหายเมื่อเข้าสู่ full implementation
- icon/sticker ที่เป็น emoji ในของเดิมควรถูกจัดหมวดและลดการใช้ใน shell UI; อนุญาตให้เป็น content sticker บน canvas

