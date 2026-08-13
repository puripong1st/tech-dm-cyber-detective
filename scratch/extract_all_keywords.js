const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function extractAll() {
    const { data: scores, error } = await supabase.from('game_scores').select('*');
    if (error) {
        console.error(error);
        return;
    }

    const report = {};

    scores.forEach(row => {
        const cId = row.case_id || 'unknown';
        if (!report[cId]) {
            report[cId] = {
                title: row.case_title,
                total: 0,
                legalAnswers: [],
                remedyAnswers: [],
                securityAnswers: []
            };
        }
        report[cId].total++;
        if (row.student_answers?.legal) report[cId].legalAnswers.push({ text: row.student_answers.legal, score: row.legal_score, feedback: row.ai_feedback?.legal });
        if (row.student_answers?.remedy) report[cId].remedyAnswers.push({ text: row.student_answers.remedy, score: row.remedy_score, feedback: row.ai_feedback?.remedy });
        if (row.student_answers?.security) report[cId].securityAnswers.push({ text: row.student_answers.security, score: row.security_score, feedback: row.ai_feedback?.security });
    });

    console.log(JSON.stringify(report, null, 2));
}

extractAll();
