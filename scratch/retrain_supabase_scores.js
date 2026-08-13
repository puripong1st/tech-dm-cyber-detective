const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const APPLY = process.argv.includes('--apply');
const MIN_SCORE = 10;
const OUT_PATH = path.join(__dirname, 'retrain_score_audit.json');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
const adminSupabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

const CASE_RULES = {
  1: {
    legal: [['มาตรา 5', 'เข้าถึงระบบ', 'แอบเข้า', 'ไม่ได้รับอนุญาต', 'รหัสผ่านคนอื่น', 'เข้ารหัสผ่านคนอื่น']],
    remedy: [['เปลี่ยนรหัส', 'logout', 'ล็อกเอาต์', 'ออกจากระบบ', 'แจ้งครู', 'ผู้ปกครอง', 'เจ้าของบัญชี']],
    security: [['2fa', 'otp', 'ล็อกสองชั้น', 'ยืนยันตัวตน', 'ตั้งรหัส', 'รหัสผ่านยาก', 'ไม่บอกรหัส', 'ล็อกหน้าจอ']]
  },
  2: {
    legal: [['มาตรา 6', 'เปิดเผย', 'เผยแพร่', 'แจกรหัส', 'ปล่อยรหัส', 'แชร์รหัส', 'แอบถ่ายรหัส']],
    remedy: [['เปลี่ยนรหัส', 'ลบโพสต์', 'ลบข้อความ', 'discord', 'แจ้งแอดมิน', 'แจ้งครู', 'ลบรูป', 'ตัดเซสชัน']],
    security: [['รหัสผ่านซับซ้อน', 'รหัสผ่านยาก', 'ไม่จดรหัส', 'ไม่แปะรหัส', 'ไม่ถ่ายรูปรหัส', 'ไม่ส่งต่อรหัส', 'password manager']]
  },
  3: {
    legal: [['มาตรา 7', 'เข้าถึงข้อมูล', 'ข้อมูลส่วนตัว', 'แอบดู', 'คุ้ยไฟล์', 'ดูดไฟล์', 'ไดอารี่', 'เปิดไฟล์คนอื่น']],
    remedy: [['ลบไฟล์', 'ลบโพสต์', 'ลบแชท', 'ลบรูป', 'เปลี่ยนรหัส', 'แจ้งครู', 'แจ้งแอดมิน', 'แจ้งตำรวจ']],
    security: [['face id', 'touch id', 'สแกนหน้า', 'สแกนนิ้ว', 'เข้ารหัส', 'encryption', 'ล็อกโฟลเดอร์', 'private', 'ตั้งค่าส่วนตัว']]
  },
  4: {
    legal: [['มาตรา 8', 'ดักรับ', 'ดักจับ', 'ดักข้อมูล', 'wifi ปลอม', 'wi-fi ปลอม', 'สัญญาณปลอม']],
    remedy: [['ตัด wifi', 'ปิด wifi', 'หยุดทำธุรกรรม', 'อายัดบัตร', 'แจ้งธนาคาร', 'แจ้งตำรวจ', 'เปลี่ยนรหัส', 'ตัดการเชื่อมต่อ']],
    security: [['ssl', 'https', 'vpn', 'เข้ารหัส', 'ไม่ใช้ wifi สาธารณะ', 'ไม่เข้าwi-fi', 'ไม่เข้า wi-fi', 'ไม่ควรเข้าwi-fi', 'ไม่ควรเข้า wi-fi', 'หลีกเลี่ยง wifi', 'หลีกเลี่ยง wi-fi', 'wifi ไม่มีแหล่งที่มา', 'wi-fi ไม่มีแหล่งที่มา']]
  },
  5: {
    legal: [['มาตรา 9', 'ทำลาย', 'ลบไฟล์', 'แก้ไข', 'เปลี่ยนแปลงข้อมูล', 'ข้อมูลเสียหาย']],
    remedy: [['version history', 'ประวัติเวอร์ชัน', 'กู้คืน', 'restore', 'ถังขยะ', 'recycle bin', 'กู้ข้อมูล', 'กู้ไฟล์']],
    security: [['read-only', 'อ่านอย่างเดียว', 'จำกัดสิทธิ์', 'เฉพาะฉันแก้ไข', 'ไม่ให้คนนอกแก้ไข', 'permission', 'backup', 'สำรองข้อมูล']]
  },
  6: {
    legal: [['มาตรา 10', 'ขัดขวาง', 'รบกวน', 'ระบบล่ม', 'เซิร์ฟเวอร์ล่ม', 'ddos', 'ยิงเว็บ', 'ยิงระบบ']],
    remedy: [['บล็อก ip', 'block ip', 'แจ้งไอที', 'รีสตาร์ท', 'ตัดการเชื่อมต่อ', 'ปิดระบบ', 'เช็คที่อยู่ต้นเหตุ', 'ตรวจสอบต้นเหตุ', 'สลับเซิร์ฟเวอร์']],
    security: [['firewall', 'ไฟร์วอลล์', 'ddos protection', 'cloudflare', 'waf', 'rate limit', 'ตรวจสอบปริมาณการใช้งาน', 'เฝ้าระวังปริมาณ', 'ระบบป้องกัน ddos', 'ป้องกันอัตโนมัติ']]
  },
  7: {
    legal: [['มาตรา 11', 'วรรคหนึ่ง', 'สแปม', 'ปกปิดแหล่งที่มา', 'ปลอมแปลง', 'อีเมลขยะ']],
    remedy: [['spam', 'junk', 'เมลขยะ', 'รายงาน', 'report', 'แบน', 'บล็อกผู้ส่ง', 'แจ้งแอดมิน']],
    security: [['anti-spam', 'กรองเมล', 'filter', 'spf', 'dkim', 'dmarc', 'ตรวจสอบผู้ส่ง', 'กรองสแปม']]
  },
  8: {
    legal: [['มาตรา 11', 'วรรคสอง', 'ยกเลิก', 'unsubscribe', 'รบกวน', 'เดือดร้อนรำคาญ', 'สแปมรัว']],
    remedy: [['แคป', 'หลักฐาน', 'ร้องเรียน', 'แจ้งแพลตฟอร์ม', 'บล็อก', 'report', 'กสทช', 'แจ้งหน่วยงาน']],
    security: [['ไม่แปะเบอร์', 'ไม่แปะเมล', 'ปิดแจ้งเตือน', 'anti-spam', 'บล็อกสแปม', 'บล็อกข้อความ', 'email alias', 'privacy']]
  },
  9: {
    legal: [['มาตรา 14(1)', '14(1)', '14 (1)', 'ข้อมูลเท็จ', 'หลอกลวง', 'ฟิชชิ่ง', 'phishing', 'เว็บปลอม', 'จำคุกไม่เกิน5ปี', '100000']],
    remedy: [['ระงับบัญชี', 'กู้คืน', 'เปลี่ยนรหัส', 'เตือนเพื่อน', 'แจ้งตำรวจ', 'แจ้งแอดมิน', 'ปิดกั้นเว็บไซต์', 'หยุดการติดต่อ']],
    security: [['ตรวจ url', 'ตรวจสอบ url', 'เว็บทางการ', 'แอปทางการ', 'official', 'ไม่กดลิงก์', 'ไม่กรอกข้อมูล', 'ลิงก์ปลอม', 'ตรวจสอบก่อนเข้า', '2fa']]
  },
  10: {
    legal: [['มาตรา 14(2)', '14(2)', '14 (2)', 'ข่าวปลอม', 'fake news', 'ข้อมูลเท็จ', 'ตื่นตระหนก', 'หลอกลวง']],
    remedy: [['ลบโพสต์', 'ลบข่าวปลอม', 'แก้ข่าว', 'ชี้แจง', 'ขอโทษ', 'แจ้งตำรวจ', 'แจ้งครู', 'แจ้งแอดมิน', 'ประกาศแจ้ง']],
    security: [['เช็กก่อนแชร์', 'เช็คก่อนแชร์', 'ตรวจสอบข้อมูล', 'ตรวจสอบข่าว', 'แหล่งข่าวน่าเชื่อถือ', 'ไม่เชื่อข่าว', 'ไม่เผยแพร่', 'ไม่แชร์ข่าวปลอม', 'ข่าวที่ไม่มีการยืนยัน']]
  },
  11: {
    legal: [['มาตรา 14(4)', '14(4)', '14 (4)', 'ลามก', 'อนาจาร', 'คลิปโป๊', '18+', 'ภาพลามก']],
    remedy: [['ลบคลิป', 'ลบวิดีโอ', 'ลบภาพ', 'แอดมินลบ', 'บล็อก', 'report', 'รายงาน', 'แจ้งครู', 'แจ้งตำรวจ']],
    security: [['safesearch', 'safe search', 'content filter', 'ตัวกรอง', 'กรองเนื้อหา', 'moderation', 'กฎกลุ่ม', 'จำกัดสิทธิ์การโพสต์', 'ผู้ดูแลกลุ่ม']]
  },
  12: {
    legal: [['มาตรา 16', 'ตัดต่อ', 'ดัดแปลง', 'เสียชื่อเสียง', 'ดูหมิ่น', 'อับอาย', 'cyberbullying', 'ประจาน', '200000']],
    remedy: [['แคป', 'หลักฐาน', 'แจ้งลบ', 'report', 'แจ้งครู', 'แจ้งผู้ปกครอง', 'แจ้งตำรวจ', 'ลบโพสต์', 'รายงานโพสต์']],
    security: [['private account', 'ล็อกโปรไฟล์', 'ตั้งค่าส่วนตัว', 'จำกัดแท็ก', 'จำกัดผู้เข้าชม', 'ไม่แชร์รูปสาธารณะ', 'ปิดดาวน์โหลด', 'ปิดกั้นเนื้อหา']]
  }
};

const EXPECTED_SECTIONS = {
  1: ['5'],
  2: ['6'],
  3: ['7'],
  4: ['8'],
  5: ['9'],
  6: ['10'],
  7: ['11'],
  8: ['11'],
  9: ['14(1)', '14 (1)'],
  10: ['14(2)', '14 (2)'],
  11: ['14(4)', '14 (4)'],
  12: ['16']
};

const WRONG_TOPIC = [
  { caseId: 6, terms: ['ddos', 'ยิงระบบ', 'เซิร์ฟเวอร์ล่ม'] },
  { caseId: 9, terms: ['phishing', 'ฟิชชิ่ง', 'เว็บปลอม', 'แจกสกิน', 'แจกเพชร'] },
  { caseId: 10, terms: ['ข่าวปลอม', 'fake news', 'ตื่นตระหนก'] },
  { caseId: 11, terms: ['ลามก', 'อนาจาร', 'คลิปโป๊', 'safesearch'] },
  { caseId: 12, terms: ['ตัดต่อ', 'ดัดแปลงภาพ', 'บูลลี่', 'cyberbullying', 'ประจาน'] }
];

function cleanText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[เเ]/g, 'แ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isNonsense(value) {
  const text = cleanText(value);
  if (text.length < 8) return true;
  if (/([^\d\s,.-])\1{4,}/.test(text)) return true;
  if (/(asdf|sdfg|dfgh|qwer|zxcv|ีาัดีาพะ|ิดทส่พ้|ีีะัีะ)/i.test(text)) return true;
  const compact = text.replace(/\s+/g, '');
  return compact.length >= 16 && new Set(compact).size <= 6;
}

function hasAny(text, terms) {
  return terms.some(term => text.includes(cleanText(term)));
}

function wrongTopicCase(text, currentCaseId) {
  return WRONG_TOPIC.find(group => group.caseId !== Number(currentCaseId) && hasAny(text, group.terms));
}

function explicitWrongSection(text, caseId) {
  const normalized = text.replace(/\s+/g, '');
  const expected = EXPECTED_SECTIONS[Number(caseId)] || [];
  const sectionMatches = [...normalized.matchAll(/มาตรา(\d+)(?:\((\d)\))?/g)]
    .map(match => match[2] ? `${match[1]}(${match[2]})` : match[1]);
  if (!sectionMatches.length) return null;
  const expectedCompact = expected.map(item => item.replace(/\s+/g, ''));
  return sectionMatches.find(section => {
    if (expectedCompact.includes(section)) return false;
    const base = section.replace(/\(\d\)$/, '');
    return !expectedCompact.includes(base);
  }) || null;
}

function scoreRole(caseId, role, answer) {
  const text = cleanText(answer);
  const rules = CASE_RULES[Number(caseId)];

  if (!rules || isNonsense(text)) {
    return { score: 0, reason: 'nonsense_or_empty' };
  }

  const wrongTopic = wrongTopicCase(text, caseId);
  if (wrongTopic) {
    return { score: 0, reason: `wrong_topic_case_${wrongTopic.caseId}` };
  }

  const caseTerms = rules[role][0];
  const exact = hasAny(text, caseTerms);

  if (role === 'legal') {
    const wrongSection = explicitWrongSection(text, caseId);
    if (wrongSection) return { score: 0, reason: `wrong_law_section_${wrongSection}` };

    const hasPenalty = /(จำคุก|คุก|ปรับ|บาท|ปี|เดือน|10000|20000|40000|60000|100000|200000)/.test(text);
    const hasLawish = /(มาตรา|พ\.ร\.บ|พรบ|กฎหมาย|ความผิด|โดยมิชอบ)/.test(text);
    const legalConceptTerms = caseTerms.filter(term => !/^\d+$/.test(term) && !/(10000|20000|40000|60000|100000|200000|จำคุก|ปรับ)/.test(term));
    const hasCaseLawConcept = hasAny(text, legalConceptTerms);
    if (hasCaseLawConcept && hasPenalty) return { score: 10, reason: 'case_law_and_penalty_match' };
    if (hasCaseLawConcept) return { score: 8, reason: 'case_law_match' };
    if (hasPenalty || hasLawish) return { score: 5, reason: 'partial_legal_answer' };
    return { score: 0, reason: 'not_legal_answer' };
  }

  if (role === 'remedy') {
    const hasNotify = /(แจ้ง|บอก|รายงาน|ครู|ผู้ปกครอง|ตำรวจ|แอดมิน|ไอที|ธนาคาร|หน่วยงาน)/.test(text);
    const hasAction = /(ลบ|บล็อก|ปิด|หยุด|เปลี่ยน|กู้|อายัด|ตัด|แคป|เก็บหลักฐาน|ระงับ|ตรวจสอบ|เช็ค|แจ้ง|บอก|รายงาน)/.test(text);
    if (exact && hasNotify) return { score: 10, reason: 'case_remedy_and_notify_match' };
    if (exact) return { score: 8, reason: 'case_remedy_match' };
    if (hasAction) return { score: 5, reason: 'generic_remedy_action' };
    return { score: 0, reason: 'not_remedy_answer' };
  }

  if (exact) return { score: 10, reason: 'case_security_match' };
  return { score: 0, reason: 'not_security_answer' };
}

function buildFeedback(role, score, reason) {
  const roleThai = role === 'legal' ? 'กฎหมาย' : role === 'remedy' ? 'ระงับเหตุ' : 'ป้องกัน';
  if (score >= 10) return `คำตอบ${roleThai}ตรงคดีและใช้ภาษานักเรียนได้ชัดเจน ควรได้เต็ม 10`;
  if (score >= 8) return `คำตอบ${roleThai}ตรงประเด็นหลัก แต่ยังขาดส่วนประกอบเล็กน้อย ควรได้ ${score}`;
  if (score >= 5) return `คำตอบ${roleThai}มีแนวคิดเกี่ยวข้องบางส่วน แต่ยังไม่เฉพาะคดี ควรได้ ${score}`;
  return `คง 0 เพราะ ${reason}`;
}

function recomputeRow(row) {
  const answers = row.student_answers || {};
  const updatedFeedback = row.ai_feedback || {};
  let changed = false;

  const roles = ['legal', 'remedy', 'security'];
  const next = {};
  const decisions = {};

  for (const role of roles) {
    const oldScore = Number(row[`${role}_score`] || 0);
    const proposed = scoreRole(row.case_id, role, answers[role]);
    const finalScore = Math.max(oldScore, proposed.score);
    next[`${role}_score`] = finalScore;
    updatedFeedback[role] = {
      ...(updatedFeedback[role] || {}),
      score: finalScore,
      feedback: finalScore > oldScore ? buildFeedback(role, finalScore, proposed.reason) : (updatedFeedback[role]?.feedback || buildFeedback(role, finalScore, proposed.reason)),
      retrain_reason: proposed.reason
    };
    decisions[role] = { oldScore, proposedScore: proposed.score, finalScore, reason: proposed.reason, answer: answers[role] || '' };
    if (finalScore > oldScore) changed = true;
  }

  next.total_score = next.legal_score + next.remedy_score + next.security_score;
  next.ai_feedback = {
    ...updatedFeedback,
    total_score: next.total_score,
    retrained_at: new Date().toISOString(),
    retrained_by: 'scratch/retrain_supabase_scores.js'
  };

  return { changed, next, decisions };
}

async function main() {
  const { data: rows, error } = await supabase
    .from('game_scores')
    .select('*')
    .or(`legal_score.lt.${MIN_SCORE},remedy_score.lt.${MIN_SCORE},security_score.lt.${MIN_SCORE}`);

  if (error) throw error;

  const report = [];
  for (const row of rows || []) {
    const result = recomputeRow(row);
    report.push({
      id: row.id,
      team_name: row.team_name,
      case_id: row.case_id,
      old: {
        legal: row.legal_score,
        remedy: row.remedy_score,
        security: row.security_score,
        total: row.total_score
      },
      next: {
        legal: result.next.legal_score,
        remedy: result.next.remedy_score,
        security: result.next.security_score,
        total: result.next.total_score
      },
      changed: result.changed,
      decisions: result.decisions
    });

    if (APPLY && result.changed) {
      const { error: updateError } = await adminSupabase
        .from('game_scores')
        .update(result.next)
        .eq('id', row.id);
      if (updateError) throw updateError;

      const { data: verifyRow, error: verifyError } = await supabase
        .from('game_scores')
        .select('legal_score,remedy_score,security_score,total_score')
        .eq('id', row.id)
        .single();
      if (verifyError) throw verifyError;
      const verified = verifyRow
        && Number(verifyRow.legal_score) === result.next.legal_score
        && Number(verifyRow.remedy_score) === result.next.remedy_score
        && Number(verifyRow.security_score) === result.next.security_score
        && Number(verifyRow.total_score) === result.next.total_score;
      if (!verified) {
        throw new Error(`Supabase update was not applied for game_scores.id=${row.id}. Add SUPABASE_SERVICE_ROLE_KEY to .env or run the SQL updates in Supabase.`);
      }
    }
  }

  fs.writeFileSync(OUT_PATH, JSON.stringify(report, null, 2), 'utf8');

  const changedRows = report.filter(item => item.changed);
  const raisedSections = report.reduce((sum, item) => sum + ['legal', 'remedy', 'security'].filter(role => item.next[role] > item.old[role]).length, 0);
  const keptZero = report.reduce((sum, item) => sum + ['legal', 'remedy', 'security'].filter(role => item.old[role] === 0 && item.next[role] === 0).length, 0);

  if (APPLY && !hasServiceRole) {
    console.warn('Warning: SUPABASE_SERVICE_ROLE_KEY is not set. Supabase RLS may reject updates made with the anon key.');
  }
  console.log(`${APPLY ? 'UPDATED' : 'DRY RUN'} ${changedRows.length} rows, raised ${raisedSections} role scores, kept ${keptZero} zero-score role answers.`);
  console.log(`Audit written to ${OUT_PATH}`);
}

if (require.main === module) {
  main().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  cleanText,
  isNonsense,
  scoreRole,
  recomputeRow,
  CASE_RULES
};
