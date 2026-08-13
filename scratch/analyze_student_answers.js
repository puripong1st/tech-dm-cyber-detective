const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function analyze() {
    const { data: scores, error } = await supabase.from('game_scores').select('*');
    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`=== ANALYZING ${scores.length} RECORDS ===\n`);

    const caseMap = {};

    scores.forEach(row => {
        const cId = row.case_id || 'unknown';
        if (!caseMap[cId]) {
            caseMap[cId] = {
                title: row.case_title,
                count: 0,
                lowScores: [],
                allAnswers: []
            };
        }
        caseMap[cId].count++;
        caseMap[cId].allAnswers.push({
            team: row.team_name,
            total_score: row.total_score,
            answers: row.student_answers,
            scores: {
                legal: row.legal_score,
                remedy: row.remedy_score,
                security: row.security_score
            },
            feedback: row.ai_feedback
        });

        if (row.legal_score < 10 || row.remedy_score < 10 || row.security_score < 10) {
            caseMap[cId].lowScores.push({
                team: row.team_name,
                answers: row.student_answers,
                scores: {
                    legal: row.legal_score,
                    remedy: row.remedy_score,
                    security: row.security_score
                },
                feedback: row.ai_feedback
            });
        }
    });

    for (const [cId, cData] of Object.entries(caseMap)) {
        console.log(`\n========================================`);
        console.log(`CASE ${cId}: ${cData.title} (Total Submissions: ${cData.count})`);
        console.log(`========================================`);
        
        console.log(`\n--- LOW SCORE SUBMISSIONS (< 10 per section) ---`);
        cData.lowScores.forEach((item, idx) => {
            console.log(`\n[${idx + 1}] Team: ${item.team} | Scores: Legal=${item.scores.legal}, Remedy=${item.scores.remedy}, Sec=${item.scores.security}`);
            console.log(`  Legal Answer: "${item.answers?.legal || ''}"`);
            console.log(`  Remedy Answer: "${item.answers?.remedy || ''}"`);
            console.log(`  Security Answer: "${item.answers?.security || ''}"`);
        });
    }
}

analyze();
