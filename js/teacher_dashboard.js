const DEFAULT_SUPABASE_URL = "https://xbwlzqtvmjwucoqkyvhj.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2x6cXR2bWp3dWNvcWt5dmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjE3NDEsImV4cCI6MjEwMDAzNzc0MX0.nbIkBfvTZBxBSxxYik3o3gAqlXI8ITGMvof3wvJxA7c";

let supabaseClient = null;
let realtimeInterval = null;

function initSupabase() {
    try {
        if (window.supabase) {
            supabaseClient = window.supabase.createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
        }
    } catch(e) {}
}
initSupabase();

async function fetchServerConfig() {
    try {
        if (window.location.protocol.startsWith('http')) {
            const res = await fetch('/api/config');
            const config = await res.json();
            if (config.supabaseUrl && config.supabaseAnonKey && window.supabase) {
                supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
            }
        }
    } catch(e) {}
}
fetchServerConfig();

const studentsMap = new Map();

// Passcode Auth System
const modalAuth = document.getElementById('modal-auth');
const inputPasscode = document.getElementById('auth-passcode');
const btnLogin = document.getElementById('btn-login-passcode');

function checkAuth() {
    const isAuth = sessionStorage.getItem('teacher_authenticated');
    if (isAuth === 'true') {
        modalAuth.style.display = 'none';
        startRealtimeSubscription();
    } else {
        modalAuth.style.display = 'flex';
    }
}

btnLogin.addEventListener('click', async () => {
    const val = inputPasscode.value.trim();
    let valid = (val === 'admin123' || val === 'teacher123');

    try {
        if (window.location.protocol.startsWith('http')) {
            const res = await fetch('/api/verify-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode: val })
            });
            const data = await res.json();
            if (data && data.success) valid = true;
        }
    } catch(e) {}

    if (valid) {
        sessionStorage.setItem('teacher_authenticated', 'true');
        modalAuth.style.display = 'none';
        startRealtimeSubscription();
    } else {
        alert("รหัสผ่านครูผู้สอนไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง");
    }
});

function startRealtimeSubscription() {
    // 1. BroadcastChannel Listener (Same Window / Cross Tabs)
    try {
        const bc = new BroadcastChannel('cyber_detective_live');
        bc.onmessage = (event) => {
            if (event.data && event.data.student_key) {
                studentsMap.set(event.data.student_key, event.data);
                renderTable();
            }
        };
    } catch(e) {}

    // 2. LocalStorage Sync Function & Cross-Tab Storage Event Listener
    const checkLocalStorage = () => {
        try {
            const localData = localStorage.getItem('student_live_payload');
            if (localData) {
                const parsed = JSON.parse(localData);
                if (parsed && parsed.student_key) {
                    studentsMap.set(parsed.student_key, parsed);
                    renderTable();
                }
            }
        } catch(e) {}
    };
    checkLocalStorage();

    window.addEventListener('storage', (e) => {
        if (e.key === 'student_live_payload' && e.newValue) {
            try {
                const parsed = JSON.parse(e.newValue);
                if (parsed && parsed.student_key) {
                    studentsMap.set(parsed.student_key, parsed);
                    renderTable();
                }
            } catch(err) {}
        }
    });

    // 3. Fetch Initial Data from Supabase
    fetchInitialData();

    // 4. Supabase Realtime Subscription
    if (supabaseClient) {
        try {
            supabaseClient
                .channel('public:student_scores')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'student_scores' }, (payload) => {
                    if (payload.new && payload.new.student_key) {
                        studentsMap.set(payload.new.student_key, payload.new);
                        renderTable();
                    } else if (payload.eventType === 'DELETE') {
                        fetchInitialData();
                    }
                })
                .subscribe();
        } catch(e) {}
    }

    // 5. Periodic Realtime Refresh Interval (every 3 seconds)
    if (!realtimeInterval) {
        realtimeInterval = setInterval(() => {
            fetchInitialData();
            checkLocalStorage();
        }, 3000);
    }
}

async function fetchInitialData() {
    if (!supabaseClient) return;
    try {
        const { data, error } = await supabaseClient
            .from('student_scores')
            .select('*');

        if (data && data.length > 0) {
            data.forEach(s => studentsMap.set(s.student_key, s));
            renderTable();
        }
    } catch(e) {}
}

checkAuth();

let isMasked = false;

document.getElementById('btn-toggle-mask').addEventListener('click', () => {
    isMasked = !isMasked;
    const btn = document.getElementById('btn-toggle-mask');
    if (isMasked) {
        btn.innerHTML = `<i class="fa-solid fa-eye"></i> แสดงชื่อจริง-เลขที่`;
        btn.style.borderColor = `var(--neon-yellow)`;
        btn.style.color = `var(--neon-yellow)`;
    } else {
        btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> ซ่อนชื่อจริง-เลขที่`;
        btn.style.borderColor = `var(--neon-cyan)`;
        btn.style.color = `var(--neon-cyan)`;
    }
    renderTable();
});

function renderTable() {
    const tbody = document.getElementById('table-body');
    const roomFilter = document.getElementById('filter-room').value;
    const sortMode = document.getElementById('filter-sort').value;
    const searchFilter = document.getElementById('filter-search').value.trim().toLowerCase();

    let list = Array.from(studentsMap.values());

    if (roomFilter !== 'ALL') {
        list = list.filter(s => s.room === roomFilter);
    }

    if (searchFilter) {
        list = list.filter(s => 
            (s.alias && s.alias.toLowerCase().includes(searchFilter)) ||
            (s.firstname && s.firstname.toLowerCase().includes(searchFilter)) ||
            (s.lastname && s.lastname.toLowerCase().includes(searchFilter))
        );
    }

    // DYNAMIC SORTING LOGIC
    list.sort((a, b) => {
        if (sortMode === 'score-desc') {
            const scoreDiff = (b.best_score || 0) - (a.best_score || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (a.total_seconds || 0) - (b.total_seconds || 0);
        } else if (sortMode === 'score-asc') {
            const scoreDiff = (a.best_score || 0) - (b.best_score || 0);
            if (scoreDiff !== 0) return scoreDiff;
            return (a.total_seconds || 0) - (b.total_seconds || 0);
        } else if (sortMode === 'time-asc') {
            const timeDiff = (a.total_seconds || 0) - (b.total_seconds || 0);
            if (timeDiff !== 0) return timeDiff;
            return (b.best_score || 0) - (a.best_score || 0);
        } else if (sortMode === 'room-no') {
            const roomComp = (a.room || '').localeCompare(b.room || '', 'th');
            if (roomComp !== 0) return roomComp;
            return (parseInt(a.no) || 0) - (parseInt(b.no) || 0);
        } else if (sortMode === 'name-asc') {
            const nameA = `${a.firstname || ''} ${a.lastname || ''}`;
            const nameB = `${b.firstname || ''} ${b.lastname || ''}`;
            return nameA.localeCompare(nameB, 'th');
        }
        return 0;
    });

    document.getElementById('stat-total-students').textContent = `${list.length} คน`;
    const activeNow = list.filter(s => s.status === 'กำลังทำคดี' || s.status === 'กำลังเริ่มทำคดี').length;
    document.getElementById('stat-active-now').textContent = `${activeNow} คน`;

    const avgScore = list.length > 0 ? Math.round(list.reduce((acc, curr) => acc + (curr.best_score || 0), 0) / list.length) : 0;
    document.getElementById('stat-avg-score').textContent = `${avgScore} / 1080`;

    const avgSecs = list.length > 0 ? Math.round(list.reduce((acc, curr) => acc + (curr.total_seconds || 0), 0) / list.length) : 0;
    const am = String(Math.floor(avgSecs / 60)).padStart(2, '0');
    const as = String(avgSecs % 60).padStart(2, '0');
    document.getElementById('stat-avg-time').textContent = `${am}:${as}`;

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; color: #94a3b8; padding: 24px;">
                    ยังไม่มีข้อมูลนักเรียนเข้าทำคดีในขณะนี้...
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map((s, idx) => {
        const secs = s.total_seconds || 0;
        const m = String(Math.floor(secs / 60)).padStart(2, '0');
        const sec = String(secs % 60).padStart(2, '0');
        const gender = s.gender || ((s.prefix === 'เด็กชาย' || s.prefix === 'นาย') ? 'ชาย' : 'หญิง');
        const genderBadge = gender === 'ชาย' ? `<span class="gender-badge-m">👦 ชาย</span>` : `<span class="gender-badge-f">👧 หญิง</span>`;

        let fullName = `${s.prefix || ''}${s.firstname || ''} ${s.lastname || ''}`;
        let fullClass = `${s.room || ''} เลขที่ ${s.no || ''}`;

        if (isMasked) {
            fullName = `${s.prefix || ''}*** ***`;
            fullClass = `${s.room || ''} เลขที่ **`;
        }

        const rawScore = s.best_score || 0;
        const score10 = (Math.min(10, Math.round((rawScore / 1080) * 10 * 100) / 100)).toFixed(2);

        const isDone = (s.status === 'ส่งคดีเรียบร้อย');
        const statusBadge = isDone ? `
            <div class="status-active" style="background: rgba(16, 185, 129, 0.18); border-color: var(--neon-green); color: var(--neon-green);">
                <i class="fa-solid fa-circle-check"></i> <span>ส่งคดีเรียบร้อย</span>
            </div>
        ` : `
            <div class="status-active">
                <div class="pulse-dot" style="width: 8px; height: 8px;"></div>
                <span>${s.status || 'กำลังทำคดี'}</span>
            </div>
        `;

        return `
            <tr>
                <td><b>${idx + 1}</b></td>
                <td style="font-weight: 800; color: var(--neon-yellow);">🕵️ ${s.alias || 'Agent X'}</td>
                <td>${genderBadge}</td>
                <td><b>${fullName}</b> <span style="color: #94a3b8; font-size: 0.82rem;">(${fullClass})</span></td>
                <td><span class="score-highlight">${rawScore}</span> / 1080</td>
                <td class="col-score10" style="font-weight: 800; color: var(--neon-green); font-size: 0.95rem;">${score10} / 10</td>
                <td><b>${s.play_count || 1}</b> รอบ</td>
                <td style="font-weight: 700; color: var(--neon-green);"><i class="fa-regular fa-clock"></i> ${m}:${sec}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// Export Clean PDF Report Button
document.getElementById('btn-export-pdf').addEventListener('click', () => {
    const originalTitle = document.title;
    const roomFilter = document.getElementById('filter-room').value;
    const roomText = roomFilter === 'ALL' ? 'รวมทุกห้องม.3' : roomFilter.replace('/', '-');
    
    document.title = `รายงานสรุปคะแนนเก็บวิชากฎหมายคอมพิวเตอร์_${roomText}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1200);
});

// Reset Data
document.getElementById('btn-reset-data').addEventListener('click', async () => {
    if (confirm("คุณต้องการล้างข้อมูลนักเรียนทั้งหมดในหน้าต่างนี้ใช่หรือไม่?")) {
        studentsMap.clear();
        localStorage.removeItem('student_live_payload');
        if (supabaseClient) {
            try { await supabaseClient.from('student_scores').delete().neq('id', '0'); } catch(e) {}
        }
        renderTable();
    }
});

document.getElementById('filter-room').addEventListener('change', renderTable);
document.getElementById('filter-sort').addEventListener('change', renderTable);
document.getElementById('filter-search').addEventListener('input', renderTable);
