const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const serverJs = require('../server.js');

// We can extract CASE_REFERENCES or run normalized evaluation logic
async function runAnalysis() {
    const { data: scores, error } = await supabase.from('game_scores').select('*');
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Analyzing ${scores.length} total records from Supabase...`);

    const missingLegalByCase = {};
    const missingRemedyByCase = {};
    const missingSecurityByCase = {};

    scores.forEach((row, idx) => {
        const cId = row.case_id || '1';
        if (!missingLegalByCase[cId]) missingLegalByCase[cId] = [];
        if (!missingRemedyByCase[cId]) missingRemedyByCase[cId] = [];
        if (!missingSecurityByCase[cId]) missingSecurityByCase[cId] = [];

        const ans = row.student_answers || {};
        const legalAns = ans.legal || '';
        const remedyAns = ans.remedy || '';
        const securityAns = ans.security || '';

        const lScore = row.legal_score ?? 0;
        const rScore = row.remedy_score ?? 0;
        const sScore = row.security_score ?? 0;

        if (lScore < 10) {
            missingLegalByCase[cId].push({ team: row.team_name, ans: legalAns, score: lScore, fb: row.ai_feedback?.legal?.feedback });
        }
        if (rScore < 10) {
            missingRemedyByCase[cId].push({ team: row.team_name, ans: remedyAns, score: rScore, fb: row.ai_feedback?.remedy?.feedback });
        }
        if (sScore < 10) {
            missingSecurityByCase[cId].push({ team: row.team_name, ans: securityAns, score: sScore, fb: row.ai_feedback?.security?.feedback });
        }
    });

    console.log("\n================ MISSED / LOW SCORED ANSWERS BY CASE ================");
    for (let i = 1; i <= 12; i++) {
        console.log(`\n--- CASE ${i} ---`);
        console.log(`Legal Low Scores (${(missingLegalByCase[i] || []).length}):`);
        (missingLegalByCase[i] || []).forEach(item => {
            console.log(`  [Score ${item.score}] "${item.ans}" | Feedback: ${item.fb || ''}`);
        });

        console.log(`Remedy Low Scores (${(missingRemedyByCase[i] || []).length}):`);
        (missingRemedyByCase[i] || []).forEach(item => {
            console.log(`  [Score ${item.score}] "${item.ans}" | Feedback: ${item.fb || ''}`);
        });

        console.log(`Security Low Scores (${(missingSecurityByCase[i] || []).length}):`);
        (missingSecurityByCase[i] || []).forEach(item => {
            console.log(`  [Score ${item.score}] "${item.ans}" | Feedback: ${item.fb || ''}`);
        });
    }
}

runAnalysis();
