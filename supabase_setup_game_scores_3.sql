-- ============================================================================
-- SQL Setup: Cyber Shield Detective (3-Case Version) Database
-- ตารางสำหรับเกมเวอร์ชัน 3 ข้อ แยกออกจากเวอร์ชันหลัก 6 ข้อโดยสิ้นเชิง
-- ============================================================================

-- 1. สร้างตาราง game_scores_3
CREATE TABLE IF NOT EXISTS public.game_scores_3 (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    player_id TEXT,
    team_name TEXT NOT NULL DEFAULT 'นักสืบเยาวชน',
    members_info TEXT,
    case_id INTEGER,
    case_title TEXT,
    legal_score NUMERIC DEFAULT 0,
    remedy_score NUMERIC DEFAULT 0,
    security_score NUMERIC DEFAULT 0,
    total_score NUMERIC DEFAULT 0,
    student_answers JSONB,
    ai_feedback JSONB
);

-- 2. เปิดใช้งาน Row Level Security (RLS)
ALTER TABLE public.game_scores_3 ENABLE ROW LEVEL SECURITY;

-- 3. กำหนด Security Policies สำหรับ Anonymous Users (นักเรียนและครู)
DROP POLICY IF EXISTS "Allow anonymous select on game_scores_3" ON public.game_scores_3;
CREATE POLICY "Allow anonymous select on game_scores_3" 
    ON public.game_scores_3 
    FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert on game_scores_3" ON public.game_scores_3;
CREATE POLICY "Allow anonymous insert on game_scores_3" 
    ON public.game_scores_3 
    FOR INSERT 
    WITH CHECK (true);

-- 4. เปิด Realtime Replication สำหรับให้หน้า Teacher Dashboard อัปเดตคะแนนสด
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_scores_3;

-- 5. สร้าง Index เพื่อเพิ่มความเร็วในการค้นหาและจัดอันดับ
CREATE INDEX IF NOT EXISTS idx_game_scores_3_team ON public.game_scores_3(team_name);
CREATE INDEX IF NOT EXISTS idx_game_scores_3_case ON public.game_scores_3(case_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_3_created_at ON public.game_scores_3(created_at DESC);
