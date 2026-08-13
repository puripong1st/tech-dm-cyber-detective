require('dotenv').config();

const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash'];

async function testSingleKey(apiKey, index) {
    const masked = apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4);
    
    for (const model of candidateModels) {
        const start = Date.now();
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Ping test. Reply with: OK' }] }]
                })
            });
            const latency = Date.now() - start;

            if (response.ok) {
                const data = await response.json();
                const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
                return { keyIndex: index + 1, key: masked, status: 'VALID (พร้อมใช้งาน)', model, latency: `${latency}ms`, reply };
            } else if (response.status === 429) {
                return { keyIndex: index + 1, key: masked, status: 'RATE_LIMIT_429 (โควตาเต็ม/ติดจำกัด)', model, latency: '-' };
            }
        } catch (e) {
            return { keyIndex: index + 1, key: masked, status: 'ERROR', error: e.message };
        }
    }
    return { keyIndex: index + 1, key: masked, status: 'INVALID_OR_EXHAUSTED', latency: '-' };
}

async function testLiveEvaluation(keys) {
    console.log('\n--- 2. ทดสอบจำลองการตรวจคำตอบจริงผ่าน Gemini AI (Real Case Evaluation) ---');
    const systemPrompt = `You are "พี่สายสืบไซเบอร์ใจดี" for Grade 9 students. Output strictly in JSON format: {"score": 10, "feedback": "ถูกต้องและยอดเยี่ยมมากครับ"}`;
    const userPrompt = `คดีที่ 1: แอบเข้าไอดีเกมเพื่อน
คำตอบนักเรียน: "ผิด พ.ร.บ.คอมพิวเตอร์ มาตรา 5 เข้าถึงระบบโดยมิชอบ โทษจำคุกไม่เกิน 6 เดือน ปรับไม่เกิน 10,000 บาท"`;

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const start = Date.now();

    for (const model of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${randomKey}`;
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
                const latency = Date.now() - start;
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                return { success: true, model, latency: `${latency}ms`, ai_output: JSON.parse(text) };
            }
        } catch (e) {
            // try next
        }
    }
    return { success: false };
}

async function testConcurrentLoad(keys, requestCount = 10) {
    console.log(`\n--- 3. ทดสอบยิงพร้อมกัน ${requestCount} Requests (Multi-Key Concurrent Burst) ---`);

    const promises = Array.from({ length: requestCount }).map(async (_, idx) => {
        const apiKey = keys[idx % keys.length];
        const start = Date.now();
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: 'Score: 10' }] }]
                })
            });
            const latency = Date.now() - start;
            return {
                request_no: idx + 1,
                key_used: apiKey.substring(0, 10) + '...',
                status_code: res.status,
                is_success: res.ok,
                latency: `${latency}ms`
            };
        } catch (e) {
            return { request_no: idx + 1, error: e.message };
        }
    });

    const results = await Promise.all(promises);
    return results;
}

async function run() {
    const rawKeys = (process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);
    console.log(`=======================================================`);
    console.log(`   DIAGNOSTIC TEST: GEMINI API POOL FOR 100 PLAYERS   `);
    console.log(`=======================================================\n`);
    console.log(`จำนวนคีย์ใน .env: ${rawKeys.length} คีย์\n`);
    console.log('--- 1. ตรวจสอบสถานะการเชื่อมต่อทีละคีย์ ---');

    const keyResults = [];
    for (let i = 0; i < rawKeys.length; i++) {
        const res = await testSingleKey(rawKeys[i], i);
        keyResults.push(res);
        console.log(`Key #${res.keyIndex} [${res.key}]: ${res.status} | โมเดล: ${res.model || '-'} | ความเร็ว: ${res.latency}`);
    }

    const validKeys = rawKeys.filter((_, idx) => keyResults[idx]?.status.includes('VALID'));
    console.log(`\nสรุปจำนวนคีย์ที่พร้อมใช้งานทันที: ${validKeys.length} / ${rawKeys.length} คีย์`);

    if (validKeys.length > 0) {
        const evalRes = await testLiveEvaluation(validKeys);
        console.log('ผลการทดสอบตรวจจริง:', JSON.stringify(evalRes, null, 2));

        const loadResults = await testConcurrentLoad(validKeys, 10);
        const successCount = loadResults.filter(r => r.is_success).length;
        console.log(`\nผลการทดสอบ Multi-Key Concurrency: ผ่าน ${successCount} / ${loadResults.length} Requests (${Math.round((successCount/loadResults.length)*100)}%)`);
        console.table(loadResults);
    }
}

run();
