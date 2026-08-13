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

let syncContent = fs.readFileSync(targetSync, 'utf8');
const syncMatch = syncContent.match(/const CASES_WITH_KEYWORDS = (\[[\s\S]*?\]);\n\nconsole\.log/);

if (!syncMatch) {
    console.error("Could not find CASES_WITH_KEYWORDS");
    process.exit(1);
}

// Evaluate the array
let casesArray;
eval("casesArray = " + syncMatch[1]);

// Update keywords
casesArray.forEach(c => {
    const id = c.id.toString();
    if (caseRefs[id]) {
        c.keywords_law = caseRefs[id].keywords_law;
        c.keywords_penalty = caseRefs[id].keywords_penalty;
        c.keywords_remedy = caseRefs[id].keywords_remedy;
        c.keywords_security = caseRefs[id].keywords_security;
    }
});

const newCasesStr = JSON.stringify(casesArray, null, 4).replace(/"([^"]+)":/g, '$1:');
syncContent = syncContent.replace(syncMatch[1], newCasesStr);

fs.writeFileSync(targetSync, syncContent, 'utf8');
console.log("Updated sync_keywords_and_scoring.js");
