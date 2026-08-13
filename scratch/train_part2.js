const fs = require('fs');
const path = require('path');

const targetServer = path.join(__dirname, '..', 'server.js');
const targetSync = path.join(__dirname, 'sync_keywords_and_scoring.js');

let serverContent = fs.readFileSync(targetServer, 'utf8');

const caseRefsMatch = serverContent.match(/const CASE_REFERENCES = (\{[\s\S]*?\n\});\n\n\/\/ Helper function/);
if (!caseRefsMatch) {
    console.error("Could not find CASE_REFERENCES in server.js");
    process.exit(1);
}

let caseRefs = JSON.parse(caseRefsMatch[1]);
let newCasesArray = [];

for (const [idStr, c] of Object.entries(caseRefs)) {
    newCasesArray.push({
        id: parseInt(idStr),
        section: c.law.split(" ")[2] + (c.law.includes("วรรค") ? " " + c.law.split(" ")[3] : ""), // rough approx
        image: `assets/evidence/case_ev_${idStr}xxxxxx.jpg`, // we will just keep old image if possible, wait...
        title: c.title,
        brief: "",
        phases: [],
        standard_law: c.law,
        standard_penalty: c.penalty,
        standard_remedy: c.remedy,
        standard_prevention: c.prevention,
        keywords_law: c.keywords_law,
        keywords_penalty: c.keywords_penalty,
        keywords_remedy: c.keywords_remedy,
        keywords_security: c.keywords_security
    });
}

// Actually it's better to just regex replace the keywords arrays in sync script
let syncContent = fs.readFileSync(targetSync, 'utf8');

for (const [idStr, c] of Object.entries(caseRefs)) {
    const rLaw = new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_law: \\()[\\s\\S]*?(\\])`);
    const rPen = new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_penalty: \\()[\\s\\S]*?(\\])`);
    const rRem = new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_remedy: \\()[\\s\\S]*?(\\])`);
    const rSec = new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_security: \\()[\\s\\S]*?(\\])`);
    
    syncContent = syncContent.replace(new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_law: \\()[\\s\\S]*?(\\])`), \`$1${JSON.stringify(c.keywords_law)}$2\`);
    syncContent = syncContent.replace(new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_penalty: \\()[\\s\\S]*?(\\])`), \`$1${JSON.stringify(c.keywords_penalty)}$2\`);
    syncContent = syncContent.replace(new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_remedy: \\()[\\s\\S]*?(\\])`), \`$1${JSON.stringify(c.keywords_remedy)}$2\`);
    syncContent = syncContent.replace(new RegExp(`(id: ${idStr},[\\s\\S]*?keywords_security: \\()[\\s\\S]*?(\\])`), \`$1${JSON.stringify(c.keywords_security)}$2\`);
}

fs.writeFileSync(targetSync, syncContent, 'utf8');
console.log("Updated sync_keywords_and_scoring.js");
