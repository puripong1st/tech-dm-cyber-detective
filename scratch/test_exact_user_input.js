const http = require('http');

// Restart server first
const payload = JSON.stringify({
    playerId: 'TestUser',
    teamName: 'ทดสอบ',
    caseId: 1,
    caseTitle: 'แอบส่องระบบไอดีเกมของเพื่อน',
    role: 'legal',
    answer: 'พ.ร.บ. คอมพิวเตอร์ มาตรา 5 (แอบเข้าถึงระบบคอมพิวเตอร์ผู้อื่นโดยมิชอบ)\nอัตราโทษ: จำคุกไม่เกิน 6 เดือน หรือปรับไม่เกิน 10,000 บาท หรือทั้งจำทั้งปรับ'
});

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/api/evaluate-role',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
    }
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Result:', JSON.parse(data));
    });
});

req.write(payload);
req.end();
