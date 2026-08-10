const http = require('http');

const payload = JSON.stringify({
    playerId: 'TestTeam_M3_5',
    teamName: 'สายสืบ ม.3/5',
    caseId: 1,
    caseTitle: 'แอบส่องระบบไอดีเกมของเพื่อน',
    role: 'legal',
    answer: 'การแอบดูรหัสผ่านแล้วล็อกอินเข้าไอดีเกมของเพื่อน มีความผิดตาม พ.ร.บ.คอมพิวเตอร์ มาตรา 5 โทษจำคุกไม่เกิน 6 เดือน ปรับไม่เกิน 10,000 บาท'
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
        console.log('✅ /api/evaluate-role status:', res.statusCode);
        console.log('Response:', JSON.parse(data));
    });
});

req.write(payload);
req.end();
