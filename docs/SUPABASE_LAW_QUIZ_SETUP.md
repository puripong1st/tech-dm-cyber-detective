# ตั้งค่าระบบข้อสอบกฎหมายกับ Supabase

1. เปิด **Supabase Dashboard → SQL Editor** แล้วรันไฟล์ `supabase/law_quiz_attempts.sql` ทั้งหมด
2. ใน **Vercel → Project → Settings → Environment Variables** เพิ่มค่าเหล่านี้

   - `SUPABASE_URL` — Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — service_role secret ของโปรเจกต์ Supabase
   - `TEACHER_PASSCODE` — รหัสผ่านสำหรับครู (ควรเปลี่ยนจากค่าเริ่มต้น)

3. Redeploy โปรเจกต์ แล้วเปิด `law_quiz.html` สำหรับนักเรียน และ `law_quiz_teacher.html` สำหรับครู

`SUPABASE_SERVICE_ROLE_KEY` เป็นคีย์ลับ: ใส่เฉพาะ Environment Variables ของ Vercel และห้ามวางใน HTML, JavaScript ฝั่งเบราว์เซอร์ หรือ GitHub. ตารางเปิด RLS ไว้โดยตั้งใจ เพราะเฉพาะ API ใน `server.js` เท่านั้นที่อ่านชื่อ คำตอบ และเฉลยได้.

ระบบสุ่มข้อสอบ 10 ข้อแบบสมดุล: ความเข้าใจ 4 ข้อ, ประยุกต์ใช้ 3 ข้อ และวิเคราะห์ 3 ข้อ จากคลัง 30 ข้อ. เฉลยเก็บไว้บนเซิร์ฟเวอร์และส่งกลับให้นักเรียนเฉพาะหลังส่งคำตอบแล้ว.
