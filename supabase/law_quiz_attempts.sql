-- ระบบข้อสอบกฎหมายรายบุคคล (รันหนึ่งครั้งใน Supabase SQL Editor)
-- คำตอบและข้อมูลนักเรียนจะถูกอ่าน/เขียนผ่าน server.js ด้วย SUPABASE_SERVICE_ROLE_KEY เท่านั้น

create table if not exists public.law_quiz_attempts (
    id uuid primary key default gen_random_uuid(),
    attempt_code text not null unique,
    prefix text not null,
    first_name text not null,
    last_name text not null,
    student_no integer not null check (student_no between 1 and 99),
    room text not null check (room in ('ม.3/1','ม.3/2','ม.3/3','ม.3/4','ม.3/5','ม.3/6','ม.3/7','ม.3/8','ม.3/9','ม.3/10','ม.3/11','ม.3/12','ม.3/13','ม.3/14','ม.3/15')),
    question_snapshot jsonb not null,
    answers jsonb not null default '{"items": []}'::jsonb,
    bloom_summary jsonb not null default '{"understand": 4, "apply": 3, "analyze": 3}'::jsonb,
    score smallint not null default 0 check (score between 0 and 10),
    total_questions smallint not null default 10 check (total_questions = 10),
    teacher_note text not null default '',
    started_at timestamptz not null default now(),
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists law_quiz_attempts_room_created_idx
    on public.law_quiz_attempts (room, created_at desc);
create index if not exists law_quiz_attempts_completed_idx
    on public.law_quiz_attempts (completed_at desc);

create or replace function public.set_law_quiz_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists law_quiz_attempts_updated_at on public.law_quiz_attempts;
create trigger law_quiz_attempts_updated_at
before update on public.law_quiz_attempts
for each row execute function public.set_law_quiz_updated_at();

alter table public.law_quiz_attempts enable row level security;
-- Do not add anon SELECT/INSERT policies: server.js uses the service-role key,
-- keeping student identity, the answer key, and answer sheets off the public API.
