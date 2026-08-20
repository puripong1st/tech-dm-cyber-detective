const fs = require('fs');
const path = require('path');

const imageMap = {
    'assets/evidence/case_ev_8f3a9b21.jpg': 'assets/chibi_comics/sec_5.png',
    'assets/evidence/case_ev_4e7c1d89.jpg': 'assets/chibi_comics/sec_6.png',
    'assets/evidence/case_ev_9a2b5f34.jpg': 'assets/chibi_comics/sec_7.png',
    'assets/evidence/case_ev_1c8e7b54.jpg': 'assets/chibi_comics/sec_8.png',
    'assets/evidence/case_ev_6a92f03d.jpg': 'assets/chibi_comics/sec_9.png',
    'assets/evidence/case_ev_3f81e6ac.jpg': 'assets/chibi_comics/sec_10.png',
    'assets/evidence/case_ev_e920d57b.jpg': 'assets/chibi_comics/sec_11_1.png',
    'assets/evidence/case_ev_7c3a812f.jpg': 'assets/chibi_comics/sec_11_2.png',
    'assets/evidence/case_ev_5b04c9e8.jpg': 'assets/chibi_comics/sec_14_1.png',
    'assets/evidence/case_ev_a1f9e832.jpg': 'assets/chibi_comics/sec_14_2.png',
    'assets/evidence/case_ev_2e6d9a41.jpg': 'assets/chibi_comics/sec_14_4.png',
    'assets/evidence/case_ev_4d9f1e8a.jpg': 'assets/chibi_comics/sec_16.png'
};

function updateFileImages(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const [oldPath, newPath] of Object.entries(imageMap)) {
        content = content.replaceAll(oldPath, newPath);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated images in ${filePath}`);
}

updateFileImages(path.join(__dirname, '../cyber_shield_teacher_3.html'));
updateFileImages(path.join(__dirname, '../cyber_shield_teacher.html'));
updateFileImages(path.join(__dirname, '../cyber_shield_detective_3.html'));
updateFileImages(path.join(__dirname, '../cyber_shield_detective.html'));
