require('dotenv').config();

const CASE_REFERENCES = {
    "1": {
        "title": "แอบส่องระบบไอดีเกมของเพื่อน",
        "law": "พ.ร.บ. คอมพิวเตอร์ มาตรา 5 (แอบเข้าถึงระบบคอมพิวเตอร์ผู้อื่นโดยมิชอบ)",
        "penalty": "จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ",
        "remedy": "สั่ง Log out ออกจากระบบทุกเครื่องทันที และรีบเปลี่ยนรหัสผ่านใหม่",
        "prevention": "เปิดใช้งานระบบยืนยันตัวตน 2 ชั้น (2FA / OTP) และล็อกหน้าจอทุกครั้ง"
    }
};

async function testRoleEvaluation(role, studentAnswer) {
    const rawKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
    const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash'];
    const ref = CASE_REFERENCES["1"];

    let roleTitle = role === 'legal' ? 'นักกฎหมาย (Legal Analyst)' : role === 'remedy' ? 'ผู้ระงับเหตุ (Incident Responder)' : 'วิศวกรความปลอดภัย (Security Engineer)';
    let standardRef = role === 'legal' ? `${ref.law} (อัตราโทษ: ${ref.penalty})` : role === 'remedy' ? ref.remedy : ref.prevention;

    const systemPrompt = `You are "พี่สายสืบไซเบอร์ใจดี" for Thai Grade 9 (ม.3) students aged 14-15.
Evaluate this student answer strictly in JSON:
{
  "score": <integer from 0 to 10>,
  "feedback": "<short encouraging feedback in Thai without spoilers>"
}
Case: ${ref.title}
Official Reference for this role: ${standardRef}`;

    const userPrompt = `บทบาท: ${roleTitle}
คำตอบนักเรียน: "${studentAnswer}"`;

    const start = Date.now();
    const startKeyIdx = Math.floor(Math.random() * rawKeys.length);

    for (let k = 0; k < rawKeys.length; k++) {
        const apiKey = rawKeys[(startKeyIdx + k) % rawKeys.length];

        for (const model of candidateModels) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                        generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const parsed = JSON.parse(rawText);
                    const latency = Date.now() - start;
                    return {
                        success: true,
                        role,
                        score: parsed.score,
                        feedback: parsed.feedback,
                        model_used: model,
                        key_prefix: apiKey.substring(0, 10) + '...',
                        latency: `${latency}ms`
                    };
                }
            } catch (err) {}
        }
    }
    return { success: false, role };
}

async function main() {
    console.log('=== เริ่มทดสอบการตรวจประเมินผลอัตนัย 3 บทบาทจริง ===\n');

    const testAnswers = [
        { role: 'legal', answer: 'ผิด พ.ร.บ.คอมพิวเตอร์ มาตรา 5 แอบเข้าระบบผู้อื่น โทษจำคุกไม่เกิน 6 เดือน ปรับไม่เกิน 1 หมื่นบาท' },
        { role: 'remedy', answer: 'รีบกดออกจากระบบทุกเครื่อง แคปรูปหลักฐานไว้ แล้วบอกครูให้ช่วย' },
        { role: 'security', answer: 'เปิดระบบยืนยันตัวตนสองชั้น 2FA และตั้งรหัสผ่านยากๆ ไม่ให้เพื่อนเห็น' }
    ];

    for (const item of testAnswers) {
        console.log(`กำลังตรวจ [บทบาท: ${item.role}]...`);
        const res = await testRoleEvaluation(item.role, item.answer);
        console.log(`-> ผลคะแนน: ${res.score}/10 | Feedback: "${res.feedback}"`);
        console.log(`   (ใช้โมเดล: ${res.model_used}, คีย์: ${res.key_prefix}, เวลา: ${res.latency})\n`);
    }
}

main();
