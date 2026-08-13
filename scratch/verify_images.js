const fs = require('fs');
const path = require('path');

function checkFile(filename, regex) {
    const html = fs.readFileSync(path.join(__dirname, '..', filename), 'utf8');
    let match;
    let count = 0;
    let missing = 0;

    console.log(`\n=== Checking ${filename} ===`);
    while ((match = regex.exec(html)) !== null) {
        count++;
        const imgPath = match[1];
        const fullPath = path.join(__dirname, '..', imgPath);
        const exists = fs.existsSync(fullPath);
        console.log(`Case ${count} image: ${imgPath} -> ${exists ? 'OK' : 'MISSING'}`);
        if (!exists) missing++;
    }

    console.log(`Total in ${filename}: ${count} checked, ${missing} missing.`);
    return missing;
}

const m1 = checkFile('cyber_shield_detective.html', /"image":\s*"([^"]+)"/g);
const m2 = checkFile('cyber_shield_teacher.html', /image:\s*"([^"]+)"/g);

if (m1 === 0 && m2 === 0) {
    console.log('\nSUCCESS: ALL IMAGES VERIFIED ON DISK!');
} else {
    console.error('\nFAILURE: Missing images found!');
    process.exit(1);
}
