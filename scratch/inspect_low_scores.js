const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function inspectLowScores() {
    const { data: scores, error } = await supabase.from('game_scores').select('*');
    if (error) return console.error(error);

    console.log("=== DETAILED INSPECTION OF LOW SCORES IN SUPABASE ===");

    scores.forEach((row, idx) => {
        const cId = row.case_id || 1;
        const ans = row.student_answers || {};
        const lScore = row.legal_score ?? 0;
        const rScore = row.remedy_score ?? 0;
        const sScore = row.security_score ?? 0;

        if (lScore < 8 || rScore < 8 || sScore < 8) {
            console.log(`\n[Row ${idx+1}] Team: ${row.team_name} | Case: ${cId} | Scores: L=${lScore}, R=${rScore}, S=${sScore}`);
            if (lScore < 8) console.log(`  Legal (${lScore}): "${ans.legal || ''}"`);
            if (rScore < 8) console.log(`  Remedy (${rScore}): "${ans.remedy || ''}"`);
            if (sScore < 8) console.log(`  Security (${sScore}): "${ans.security || ''}"`);
        }
    });
}

inspectLowScores();
