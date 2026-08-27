# Design direction spec — PDPA Assignment Board vNext

## สาระของโจทย์

งานนี้ไม่ใช่การทำ landing page ใหม่ แต่เป็นการยกระดับเครื่องมือสร้างใบงาน PDPA ที่ใช้งานได้อยู่แล้วให้รู้สึกเหมือน “design editor” มากขึ้น โดยยังคงเอกลักษณ์ Cyber Shield Detective และใบงาน A4 แนวนอนไว้ จุดอ่อนของหน้าปัจจุบันคือ control panel กินพื้นที่เกือบครึ่งจอ, เครื่องมือถูกจัดเหมือนแบบฟอร์มยาว, canvas เป็นผู้ตามแทนที่จะเป็นพระเอก, คำสั่งที่เกี่ยวกับ object กระจายอยู่หลายที่ และผู้ใช้ยังไม่เห็นโครงสร้าง layer/history/page state ชัดเจน ความตั้งใจของ redesign คือเปลี่ยนความรู้สึกจาก “กรอกฟอร์มแล้วดูตัวอย่างด้านขวา” เป็น “เลือกเครื่องมือแล้วออกแบบบน canvas โดยตรง”

## กลุ่มผู้ใช้และสถานการณ์

ผู้ใช้หลักคือนักเรียนชั้นมัธยมศึกษาปีที่ 3 ที่อาจไม่เคยใช้โปรแกรมกราฟิกระดับมืออาชีพ แต่คุ้นกับ Canva หรือเครื่องมือสร้างคอนเทนต์ทั่วไป ผู้ใช้รองคือครูที่ต้องการให้งานทุกชิ้นมีข้อมูลนักเรียนครบ อ่านง่าย พิมพ์ได้ และตรวจได้เร็ว สถานการณ์ใช้งานหลักคือโน้ตบุ๊กในห้องเรียน 1280×720 ถึง 1440×900; ต้องจัด desktop workspace ให้ดีเป็นอันดับแรก และเตรียม responsive fallback ที่พอแก้เนื้อหาบนจอแคบได้โดยไม่บังคับให้ทำ freeform layout บนมือถือ

## Output ของรอบ “ทิศทาง”

- แต่ละทิศทางเป็น HTML/CSS/JS ไฟล์เดียวที่เปิดได้จาก local server
- ออกแบบที่ viewport มาตรฐาน 1440×900 แต่ต้องไม่พังที่ 1280×720
- แสดง full editor shell หนึ่งหน้าจอพร้อม central A4 canvas, tool navigation, asset/content panel, contextual controls และสถานะ export/save
- ใช้เนื้อหาจริงจากไฟล์เดิม ไม่ใช้ Lorem ipsum
- ต้นแบบต้องมี interaction อย่างน้อย: เปลี่ยน tool/panel ได้, เลือก object บน canvas แล้ว context toolbar/inspector เปลี่ยน, ปุ่ม zoom ทำงาน และมีการสลับ layer/pages หรือ equivalent อย่างน้อยหนึ่งอย่าง
- ต้นแบบรอบนี้ไม่แก้ `pdpa_assignment_board.html` และไม่ต้องทำทุกฟังก์ชันจริง; จุดประสงค์คือให้ผู้ใช้เลือก visual/interaction direction ก่อน

## เนื้อหาที่ต้องปรากฏเหมือนกันทั้ง 3 แบบ

- ชื่อผลิตภัณฑ์: “PDPA Case Board” พร้อมคำอธิบาย “กระดานวิเคราะห์คดี · ม.3”
- ผู้ใช้ตัวอย่าง: “ด.ช. นักเรียน ทดสอบ · ม.3/1 · เลขที่ 1”
- เครื่องมือหลัก: เนื้อหา, ข้อความ, องค์ประกอบ, อัปโหลด, สไตล์ และวาด/ไฮไลต์
- แผงเนื้อหาตัวอย่างต้องมีภาพหลักฐาน/ลิงก์, สรุปข่าว และ 3 คำถาม Q1–Q3
- canvas A4 แนวนอนต้องเห็นหัวแฟ้มคดี, กรอบ evidence, สรุปเหตุการณ์ และการ์ด Q1–Q3
- คำสั่งหลัก: undo, redo, บันทึกอัตโนมัติ, preview/fit, zoom, ส่งออก PDF
- object controls: duplicate, lock, group, position/layer, delete; ใน prototype แสดงเป็น contextual controls ได้

## Information architecture เป้าหมาย

วาง canvas เป็นพื้นที่หลัก 55–70% ของ viewport. แถบเครื่องมือหลักควรเป็น rail แคบ 64–84 px หรือ navigation ที่ไม่บังคับให้แผงเนื้อหากว้างตลอดเวลา. เมื่อเลือกเครื่องมือให้เปิด secondary panel ราว 280–340 px ซึ่งพับได้. top bar ทำหน้าที่จัดการไฟล์และ global actions; contextual toolbar อยู่ใกล้ canvas หรือเหนือ canvas; bottom bar ใช้ zoom, page/layer view และสถานะ save. สามารถมี inspector ด้านขวาแบบเปิดตามบริบทได้ แต่ต้องไม่บีบ canvas มากเกินไป. ลำดับการมองต้องเป็น Canvas → selected object → available actions → library/content—not the other way around.

## Visual motif ที่มาจากเนื้อหา

visual motif คือ “case evidence system”: หมายเลขหลักฐาน, rule line ที่โยงความสัมพันธ์, sealed file tab, verification mark และ semantic stages “พบเหตุ → หยุดความเสียหาย → ป้องกันระยะยาว”. ใช้ motif เหล่านี้เป็นโครงสร้าง ไม่ใช่ตกแต่งแบบการ์ตูนสุ่ม. สีแดง/อำพัน/เขียวของ Q1–Q3 สื่อสถานะและต้องใช้อย่างมีระบบ. พื้น canvas ต้องอ่านเป็นกระดาษจริง ส่วน editor chrome อาจสว่างหรือมืดได้ตามทิศทาง.

## Functional priorities สำหรับ full implementation หลังเลือกทิศทาง

P0: redo/undo แบบรวมทุกการแก้ไข, layer panel จริง, multi-select/group/lock, keyboard shortcuts, ruler/guides/snap, fit/zoom ที่นุ่ม, autosave state ชัดเจน, restore draft, export PNG + PDF และ accessibility hit target ≥44 px สำหรับคำสั่งสำคัญ. P1: template presets, property inspector, search/filter element library, duplicate page/version history, comments/teacher review mode และ “check before submit” ที่เตือนเมื่อยังไม่มีรูป/ลิงก์/คำตอบ. P2: free crop/background remove ไม่จำเป็นในงานนี้; collaboration real-time และ AI generation ไม่ควรทำก่อน core editor reliability.

## Requirement update: friendly free decoration + PNG-first export

ผู้ใช้ย้ำว่าต้องการให้การตกแต่ง “อิสระ ทำง่าย และเฟรนด์ลี่” ดังนั้นทุกทิศทางต้องลดความรู้สึกเป็นฟอร์ม, ทำให้การเพิ่ม text/note/sticker/shape เห็นผลบน canvas ทันที, มีคำอธิบายสั้นที่ไม่ใช้ศัพท์นักออกแบบเกินจำเป็น และแสดง contextual actions ใกล้วัตถุที่เลือก. Export หลักต้องเป็น “บันทึก PNG คมชัด” โดยจับเฉพาะใบงาน A4 ไม่ติด editor chrome ที่ขนาด 3508×2480 px (A4 แนวนอน 300 DPI); PDF เก็บเป็นตัวเลือกรอง. ปุ่ม PNG ต้องมองเห็นง่ายและอธิบายผลลัพธ์ตรง ๆ ว่าเหมาะสำหรับส่งงานหรือพิมพ์ A4.

## Tone, readability, and constraints

หน้าต้องให้ความรู้สึก “มืออาชีพแต่ชวนลอง” มากกว่า “hacker dashboard”. UI body ใช้ Bai Jamjuree/Prompt 14–16 px; label ไม่ต่ำกว่า 12 px; canvas print text อาจเล็กตามเอกสารแต่ preview ต้อง zoom ได้. หลีกเลี่ยง purple-pink AI gradient, card ทุกอย่างเป็น rounded rectangle, decorative emoji ใน editor shell และ glow ที่ไม่มีหน้าที่. ใช้ radius ไม่เกิน 10–14 px โดยมีทั้งพื้นที่คมและพื้นที่อ่อนเพื่อสร้างลำดับ. ไม่สร้างสถิติหรือข้อมูลคดีเทียมเพิ่มเติม. asset ทั้งหมดใช้ของในโปรเจกต์เดิม.

## Three-direction separation

ทั้งสามแบบต้องต่างกันที่ layout skeleton อย่างน้อยหนึ่งแกน: ตำแหน่ง navigation, วิธีเปิด secondary panel, ตำแหน่ง contextual controls และการจัด layers/pages. แบบหนึ่งควรใกล้ design editor มาตรฐานที่สุด, แบบหนึ่งควรทดลองกับโลก “ภารกิจนักสืบ” อย่างกล้าหาญ, และอีกแบบควรทำให้ใบงานเป็น craft/editorial object ที่มีบุคลิก. ห้ามทำสามแบบโดยใช้ layout เดียวแล้วเปลี่ยนสี.

## Form derivation answers

- บทบาทของหน้า: editor workspace ไม่ใช่ hero/marketing page
- ระยะผู้ชม: 1 เมตรบนจอโน้ตบุ๊ก; hit target และ text ต้องอ่านได้ที่ 1280×720
- อุณหภูมิ: เชื่อถือได้ 60% + สนุก 25% + ตึงเครียดแบบคดี 15%
- ความจุ: หนึ่ง viewport ต้องเห็น canvas, global actions, primary tools และหนึ่ง active panel; เนื้อหาเชิงลึก scroll ใน panel เท่านั้น
- ที่มาของ form: โครงสร้างมาจาก “แฟ้มหลักฐาน” และ “โต๊ะทำงานนักออกแบบ” ไม่ใช่ dashboard template
