const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'cyber_shield_detective.html'), 'utf8');
const regex = /"image":\s*"([^"]+)"/g;
let match;
let count = 0;
let missing = 0;

while ((match = regex.exec(html)) !== null) {
    count++;
    const imgPath = match[1];
    const fullPath = path.join(__dirname, '..', imgPath);
    const exists = fs.existsSync(fullPath);
    console.log(`Case image ${count}: ${imgPath} -> ${exists ? 'OK' : 'MISSING'}`);
    if (!exists) missing++;
}

console.log(`\nTotal: ${count} images checked, ${missing} missing.`);
if (missing === 0) {
    console.log('ALL IMAGES EXIST AND VERIFIED SUCCESSFULLY!');
} else {
    console.error('ERROR: Some image files are still missing!');
    process.exit(1);
}
