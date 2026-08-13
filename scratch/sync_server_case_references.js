const fs = require('fs');
const path = require('path');

const targetHtml = path.join(__dirname, '..', 'cyber_shield_detective.html');
const targetServer = path.join(__dirname, '..', 'server.js');

const htmlContent = fs.readFileSync(targetHtml, 'utf8');

// Extract ALL_12_CASES JSON array from HTML
const match = htmlContent.match(/const ALL_12_CASES = (\[[\s\S]*?\]);/);
if (!match) {
    console.error('Could not find ALL_12_CASES in HTML');
    process.exit(1);
}

const ALL_12_CASES = JSON.parse(match[1]);

const caseReferencesObj = {};

ALL_12_CASES.forEach(c => {
    caseReferencesObj[String(c.id)] = {
        title: c.title,
        law: c.standard_law,
        penalty: c.standard_penalty,
        remedy: c.standard_remedy,
        prevention: c.standard_prevention,
        keywords_law: c.keywords_law,
        keywords_penalty: c.keywords_penalty,
        keywords_remedy: c.keywords_remedy,
        keywords_security: c.keywords_security
    };
});

let serverContent = fs.readFileSync(targetServer, 'utf8');

const newCaseReferencesCode = `// Case Reference Database for AI Grounding (12 Cases)
const CASE_REFERENCES = ${JSON.stringify(caseReferencesObj, null, 4)};`;

serverContent = serverContent.replace(/\/\/ Case Reference Database for AI Grounding \(12 Cases\)[\s\S]*?const CASE_REFERENCES = \{[\s\S]*?\n\};/, newCaseReferencesCode);

fs.writeFileSync(targetServer, serverContent, 'utf8');
console.log('Successfully updated CASE_REFERENCES in server.js from retrained dataset!');
