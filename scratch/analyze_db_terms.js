const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function run() {
    const { data: rows, error } = await supabase.from('game_scores').select('*');
    if (error) {
        console.error(error);
        return;
    }

    const caseData = {};
    for (let i = 1; i <= 12; i++) {
        caseData[i] = { legal: [], remedy: [], security: [] };
    }

    rows.forEach(row => {
        const cId = row.case_id || 1;
        if (!caseData[cId]) caseData[cId] = { legal: [], remedy: [], security: [] };
        
        const ans = row.student_answers || {};
        if (ans.legal) caseData[cId].legal.push({ text: ans.legal, score: row.legal_score });
        if (ans.remedy) caseData[cId].remedy.push({ text: ans.remedy, score: row.remedy_score });
        if (ans.security) caseData[cId].security.push({ text: ans.security, score: row.security_score });
    });

    console.log("=== ALL UNIQUE STUDENT PHRASES AND SCORES BY CASE ===");
    for (let i = 1; i <= 12; i++) {
        console.log(`\n=================== CASE ${i} ===================`);
        console.log(`-- LEGAL ANSWERS (${caseData[i].legal.length}) --`);
        caseData[i].legal.forEach(item => {
            console.log(`  Score: ${item.score} | "${item.text}"`);
        });

        console.log(`-- REMEDY ANSWERS (${caseData[i].remedy.length}) --`);
        caseData[i].remedy.forEach(item => {
            console.log(`  Score: ${item.score} | "${item.text}"`);
        });

        console.log(`-- SECURITY ANSWERS (${caseData[i].security.length}) --`);
        caseData[i].security.forEach(item => {
            console.log(`  Score: ${item.score} | "${item.text}"`);
        });
    }
}

run();
