function getPrefixAbbrev(p) {
    if (!p) return '';
    if (p === 'เด็กชาย') return 'ด.ช.';
    if (p === 'เด็กหญิง') return 'ด.ญ.';
    if (p === 'นางสาว') return 'น.ส.';
    return p;
}

function exportStudentPDF() {
    const originalTitle = document.title;
    const prefixAbbrev = getPrefixAbbrev(state.prefix);
    const roomClean = (state.room || '').replace('/', '-');
    const namePart = `${prefixAbbrev}${state.firstname} ${state.lastname}`.trim();
    const pdfFilename = `${namePart} เลขที่ ${state.no} ${roomClean}`.trim();
    
    document.title = pdfFilename || originalTitle;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 1200);
}
const DEFAULT_SUPABASE_URL = "https://xbwlzqtvmjwucoqkyvhj.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2x6cXR2bWp3dWNvcWt5dmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NjE3NDEsImV4cCI6MjEwMDAzNzc0MX0.nbIkBfvTZBxBSxxYik3o3gAqlXI8ITGMvof3wvJxA7c";

let supabaseClient = null;

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

/* Web Audio API Cyber Ambient Sound Synth */
class SoundEngine {
    constructor() { 
        this.ctx = null; 
        this.muted = false; 
        this.musicOn = false;
        this.ambientNodes = null;
    }
    init() { 
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
    }
    playTone(freq, type, duration, delay = 0, volume = 0.12) {
        if (this.muted || !this.ctx) return;
        setTimeout(() => {
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(volume, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(); osc.stop(this.ctx.currentTime + duration);
            } catch(e) {}
        }, delay);
    }
    playType() { this.init(); this.playTone(700 + Math.random() * 300, 'square', 0.03, 0, 0.04); }
    playScan() { 
        if (this.muted) return;
        this.init(); 
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(300, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + 0.25);
        } catch(e) {}
    }
    playGavel() { 
        this.init(); 
        this.playTone(110, 'sine', 0.3, 0, 0.25); 
        this.playTone(70, 'triangle', 0.4, 40, 0.3); 
    }
    playOk() { this.init(); this.playTone(523, 'sine', 0.1); this.playTone(659, 'sine', 0.15, 80); }
    playFail() { this.init(); this.playTone(220, 'triangle', 0.25); }
    playWin() { this.init(); this.playTone(523, 'triangle', 0.1, 0); this.playTone(659, 'triangle', 0.1, 100); this.playTone(783, 'triangle', 0.2, 200); }

    startAmbient() {
        if (this.muted || !this.musicOn || this.ambientNodes) return;
        this.init();
        try {
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            const gain = this.ctx.createGain();

            osc1.type = 'sine'; osc1.frequency.value = 110; // A2 note
            osc2.type = 'triangle'; osc2.frequency.value = 164.81; // E3 note

            filter.type = 'lowpass';
            filter.frequency.value = 350;

            gain.gain.setValueAtTime(0.025, this.ctx.currentTime);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc1.start();
            osc2.start();
            this.ambientNodes = { osc1, osc2, gain };
        } catch(e) {}
    }
    stopAmbient() {
        if (this.ambientNodes) {
            try {
                this.ambientNodes.osc1.stop();
                this.ambientNodes.osc2.stop();
            } catch(e) {}
            this.ambientNodes = null;
        }
    }
    toggleMusic() {
        this.musicOn = !this.musicOn;
        if (!this.musicOn) this.stopAmbient();
        else this.startAmbient();
        return this.musicOn;
    }
}

const sound = new SoundEngine();

/* Fisher-Yates Array Shuffler */
function shuffleArray(arr) {
    if (!arr || !Array.isArray(arr)) return [];
    const shuffled = JSON.parse(JSON.stringify(arr));
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/* Random Detective Codename List */
const RANDOM_ALIASES = [
    "Agent Neon", "สายสืบสายฟ้า", "เงาไซเบอร์", "จอมโจรคิด", "นักสืบโฮล์มส์", 
    "ผู้พิทักษ์ PDPA", "จ่าเฉยไซเบอร์", "สายสืบฟีนิกซ์", "จิ้งจอกราตรี", "ผู้ดูแลระบบดิจิทัล"
];

/* Game State */
let state = {
    alias: localStorage.getItem('detective_alias') || 'Agent X',
    prefix: localStorage.getItem('detective_prefix') || 'เด็กชาย',
    firstname: localStorage.getItem('detective_fname') || '',
    lastname: localStorage.getItem('detective_lname') || '',
    room: localStorage.getItem('detective_room') || 'ม.3/1',
    no: localStorage.getItem('detective_no') || '',
    gender: 'ชาย',

    totalSeconds: 0,
    caseSeconds: 0,

    playCount: parseInt(localStorage.getItem('detective_play_count') || '1'),
    bestScore: parseInt(localStorage.getItem('detective_best_score') || '0'),
    currentScore: 0,

    sessionQueue: [],
    currentQueueIdx: 0,
    currentCase: null,
    currentStep: 1,
    foundClues: new Set(),
    failedClues: new Set(),
    selectedLaw: null,
    selectedPenalty: null,
    solvedCaseIds: new Set(JSON.parse(localStorage.getItem('detective_solved_cases') || localStorage.getItem('detective_solved_ids') || '[]')),
    currentRoundSolved: new Set(),
    pendingClueIdx: null
};

let timerInterval = null;

/* DOM Elements */
const modalRegister = document.getElementById('modal-register');
const modalResult = document.getElementById('modal-case-result');
const modalReport = document.getElementById('modal-report');
const modalMiniGame = document.getElementById('modal-minigame');
const toastBanner = document.getElementById('toast');

const elHeaderStudent = document.getElementById('header-student-name');
const elHeaderScore = document.getElementById('header-score');
const elHeaderTimer = document.getElementById('header-timer');

const elSideTag = document.getElementById('side-case-tag');
const elSideTitle = document.getElementById('side-case-title');
const elSideBrief = document.getElementById('side-case-brief');
const elSideClueCount = document.getElementById('side-clue-count');
const elSideCluesList = document.getElementById('side-clues-list');

const elScanContainer = document.getElementById('scan-buttons-container');
const elLawChoices = document.getElementById('law-choices-container');
const elPenaltyChoices = document.getElementById('penalty-choices-container');

/* Safe Toast Generator */
function showToast(msg) {
    document.getElementById('toast-text').textContent = msg;
    toastBanner.classList.add('show');
    setTimeout(() => toastBanner.classList.remove('show'), 2400);
}

/* Calculate Gender */
function computeGender(p) {
    return (p === 'เด็กชาย' || p === 'นาย') ? 'ชาย' : 'หญิง';
}

/* AUTO-SAVE SESSION STATE TO LOCAL STORAGE */
function saveSessionState() {
    if (!state.firstname || !state.lastname) return;
    const saveData = {
        alias: state.alias,
        prefix: state.prefix,
        firstname: state.firstname,
        lastname: state.lastname,
        room: state.room,
        no: state.no,
        totalSeconds: state.totalSeconds,
        caseSeconds: state.caseSeconds,
        currentScore: state.currentScore,
        sessionQueue: state.sessionQueue,
        currentQueueIdx: state.currentQueueIdx,
        foundClues: Array.from(state.foundClues),
        failedClues: Array.from(state.failedClues),
        currentRoundSolved: Array.from(state.currentRoundSolved),
        selectedLaw: state.selectedLaw,
        selectedPenalty: state.selectedPenalty,
        currentStep: state.currentStep,
        timestamp: new Date().getTime()
    };
    localStorage.setItem('detective_active_session', JSON.stringify(saveData));
}

/* TRY RESTORE SAVED SESSION STATE (F5 / REOPEN) */
function tryRestoreSession() {
    try {
        const raw = localStorage.getItem('detective_active_session');
        if (!raw) return false;
        const saved = JSON.parse(raw);
        if (!saved || !saved.sessionQueue || saved.sessionQueue.length === 0) return false;

        state.alias = saved.alias || state.alias;
        state.prefix = saved.prefix || state.prefix;
        state.firstname = saved.firstname || state.firstname;
        state.lastname = saved.lastname || state.lastname;
        state.room = saved.room || state.room;
        state.no = saved.no || state.no;
        state.gender = computeGender(state.prefix);

        state.totalSeconds = saved.totalSeconds || 0;
        state.caseSeconds = saved.caseSeconds || 0;
        state.currentScore = saved.currentScore || 0;

        state.sessionQueue = saved.sessionQueue;
        state.currentQueueIdx = saved.currentQueueIdx || 0;
        state.foundClues = new Set(saved.foundClues || []);
        state.failedClues = new Set(saved.failedClues || []);
        state.currentRoundSolved = new Set(saved.currentRoundSolved || []);
        state.selectedLaw = saved.selectedLaw || null;
        state.selectedPenalty = saved.selectedPenalty || null;
        state.currentStep = saved.currentStep || 1;

        return true;
    } catch(e) {
        return false;
    }
}

/* CLEAR SESSION STATE ON ROUND COMPLETE */
function clearSessionState() {
    localStorage.removeItem('detective_active_session');
}

/* Listen for F5 / Tab Close */
window.addEventListener('beforeunload', () => {
    saveSessionState();
});

/* Timer Counter with Auto-Save */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (state.isCompleted || (modalReport && modalReport.classList.contains('active'))) {
            return;
        }
        state.totalSeconds++;
        state.caseSeconds++;
        const m = String(Math.floor(state.totalSeconds / 60)).padStart(2, '0');
        const s = String(state.totalSeconds % 60).padStart(2, '0');
        elHeaderTimer.textContent = `${m}:${s}`;
        
        saveSessionState();

        if (state.totalSeconds % 5 === 0) {
            syncToSupabase("กำลังทำคดี");
        }
    }, 1000);
}

/* Supabase Telemetry Sync */
async function syncToSupabase(statusText = "กำลังทำคดี") {
    if (!state.firstname || !state.lastname || !state.no) return;
    const studentKey = `${state.room}_${state.no}_${state.firstname}_${state.lastname}`;
    const payload = {
        id: studentKey,
        student_key: studentKey,
        alias: state.alias,
        prefix: state.prefix,
        gender: computeGender(state.prefix),
        firstname: state.firstname,
        lastname: state.lastname,
        room: state.room,
        no: parseInt(state.no) || 0,
        best_score: Math.max(state.bestScore, state.currentScore),
        current_score: state.currentScore,
        play_count: state.playCount,
        total_seconds: state.totalSeconds,
        status: statusText,
        updated_at: new Date().toISOString()
    };

    try {
        const bc = new BroadcastChannel('cyber_detective_live');
        bc.postMessage(payload);
    } catch(e) {}

    localStorage.setItem('student_live_payload', JSON.stringify(payload));

    if (supabaseClient) {
        try {
            await supabaseClient.from('student_scores').upsert(payload, { onConflict: 'id' });
        } catch(err) {}
    }
}

/* Random Alias Generator Button */
document.getElementById('btn-gen-alias').addEventListener('click', () => {
    sound.playScan();
    const r = RANDOM_ALIASES[Math.floor(Math.random() * RANDOM_ALIASES.length)];
    document.getElementById('input-alias').value = r;
});

/* Fisher-Yates Non-Repeating Smart Deck Rotation Generator */
function createRandomCaseQueue() {
    state.currentRoundSolved.clear();
    let unplayed = window.CASES.filter(c => !state.solvedCaseIds.has(c.id));

    if (unplayed.length < 6) {
        // If fewer than 6 unplayed cases remain, take all remaining unplayed cases and top up from reset pool!
        const remaining = [...unplayed];
        state.solvedCaseIds.clear();
        localStorage.setItem('detective_solved_cases', '[]');
        const fillPool = shuffleArray(window.CASES.filter(c => !remaining.some(r => r.id === c.id)));
        unplayed = [...remaining, ...fillPool];
    }

    const queue = shuffleArray(unplayed).slice(0, 6);

    state.sessionQueue = queue.map(c => ({
        ...c,
        shuffledLawOptions: shuffleArray(c.lawOptions),
        shuffledPenaltyOptions: shuffleArray(c.penaltyOptions)
    }));

    state.currentQueueIdx = 0;
}

/* Init Registration Form Submit */
document.getElementById('btn-start-game').addEventListener('click', () => {
    const alias = document.getElementById('input-alias').value.trim() || 'Agent X';
    const prefix = document.getElementById('input-prefix').value;
    const fname = document.getElementById('input-firstname').value.trim();
    const lname = document.getElementById('input-lastname').value.trim();
    const room = document.getElementById('input-room').value;
    const no = document.getElementById('input-no').value.trim();

    if (!fname || !lname || !no) {
        alert("กรุณากรอกชื่อจริง นามสกุล และ เลขที่ ให้ครบถ้วน!");
        return;
    }

    state.alias = alias;
    state.prefix = prefix;
    state.firstname = fname;
    state.lastname = lname;
    state.room = room;
    state.no = no;
    state.gender = computeGender(prefix);

    localStorage.setItem('detective_alias', alias);
    localStorage.setItem('detective_prefix', prefix);
    localStorage.setItem('detective_fname', fname);
    localStorage.setItem('detective_lname', lname);
    localStorage.setItem('detective_room', room);
    localStorage.setItem('detective_no', no);

    sound.init();
    sound.playOk();
    clearSessionState();
    modalRegister.classList.remove('active');
    updateStudentHeader();
    createRandomCaseQueue();
    startTimer();
    syncToSupabase("กำลังเริ่มทำคดี");
    loadCaseFromQueue(0);
});

// PAGE LOAD: Check if auto-saved session exists!
window.addEventListener('DOMContentLoaded', () => {
    if (state.firstname && state.lastname && state.no) {
        const restored = tryRestoreSession();
        modalRegister.classList.remove('active');
        state.gender = computeGender(state.prefix);
        updateStudentHeader();
        
        if (restored) {
            startTimer();
            restoreCaseState();
            showToast(`💾 โหลดข้อมูลเดิมสำเร็จ! เล่นต่อคดีที่ ${state.currentQueueIdx + 1}/6`);
        } else {
            createRandomCaseQueue();
            startTimer();
            syncToSupabase("กำลังทำคดี");
            loadCaseFromQueue(0);
        }
    }
});

function updateStudentHeader() {
    if (state.firstname && state.lastname) {
        const shortStudent = `${state.prefix}${state.firstname} (${state.room} #${state.no})`;
        elHeaderStudent.innerHTML = `<i class="fa-solid fa-user-ninja" style="color: var(--neon-yellow);"></i> <span><b>${state.alias}</b> (${shortStudent})</span>`;
    } else {
        elHeaderStudent.innerHTML = `<i class="fa-solid fa-user-graduate"></i> <span>ยังไม่ได้ลงทะเบียน</span>`;
    }
    elHeaderScore.textContent = `${state.currentScore} / 1080`;
}

/* Load Case from Random Queue - ALWAYS RESET TO STEP 1! */
function loadCaseFromQueue(qIdx) {
    state.currentQueueIdx = qIdx;
    state.currentCase = state.sessionQueue[qIdx];
    state.foundClues.clear();
    state.failedClues.clear();
    state.selectedLaw = null;
    state.selectedPenalty = null;
    state.caseSeconds = 0;
    state.currentStep = 1;

    restoreCaseState();
}

function restoreCaseState() {
    const c = state.sessionQueue[state.currentQueueIdx];
    state.currentCase = c;

    if (!c.shuffledLawOptions) c.shuffledLawOptions = shuffleArray(c.lawOptions);
    if (!c.shuffledPenaltyOptions) c.shuffledPenaltyOptions = shuffleArray(c.penaltyOptions);

    elSideTag.textContent = `คดีสุ่มที่ ${state.currentQueueIdx + 1} / ${state.sessionQueue.length}`;
    elSideTitle.textContent = c.title;
    elSideBrief.textContent = c.brief;

    // Render Scan Buttons with Locked / Scanned States
    elScanContainer.innerHTML = c.clues.map((clue, i) => {
        const isScanned = state.foundClues.has(i);
        const isFailed = state.failedClues.has(i);

        let btnClass = "btn-scan-clue";
        let iconClass = "fa-solid fa-laptop-code";
        let iconStyle = "";
        let statusText = `สแกนหลักฐาน: ${clue.title}`;

        if (isScanned) {
            btnClass += " scanned";
            iconClass = "fa-solid fa-square-check";
            iconStyle = "color: var(--neon-green);";
            statusText = `สแกนสำเร็จ: ${clue.title}`;
        } else if (isFailed) {
            btnClass += " failed-locked";
            iconClass = "fa-solid fa-lock";
            iconStyle = "color: var(--neon-magenta);";
            statusText = `🔒 ถอดรหัสล้มเหลว (ไม่สามารถสแกนได้แล้ว): ${clue.title}`;
        }

        return `
            <button class="${btnClass}" id="scan-btn-${i}" onclick="triggerMiniGame(${i})" ${isScanned || isFailed ? 'disabled' : ''}>
                <span><i class="${iconClass}" style="${iconStyle}"></i> ${statusText}</span>
                <i class="${isScanned ? 'fa-solid fa-check' : (isFailed ? 'fa-solid fa-lock' : 'fa-solid fa-play')}" style="${iconStyle}"></i>
            </button>
        `;
    }).join('');

    // Render RANDOMIZED Law Choice Cards
    elLawChoices.innerHTML = c.shuffledLawOptions.map(l => {
        const isSel = (state.selectedLaw === l.id);
        return `
            <div class="choice-option-card ${isSel ? 'selected' : ''}" id="law-card-${l.id}" onclick="selectLaw('${l.id}')">
                <div class="choice-badge-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                <div class="choice-text-wrap">
                    <div class="choice-law-title">${l.title}</div>
                    <div class="choice-law-summary"><i class="fa-solid fa-file-shield"></i> <span><strong>สาระสำคัญ:</strong> ${l.desc}</span></div>
                </div>
            </div>
        `;
    }).join('');

    // Render RANDOMIZED Penalty Choice Cards
    elPenaltyChoices.innerHTML = c.shuffledPenaltyOptions.map(p => {
        const isSel = (state.selectedPenalty === p.id);
        return `
            <div class="choice-option-card ${isSel ? 'selected' : ''}" id="pen-card-${p.id}" onclick="selectPenalty('${p.id}')">
                <div class="choice-badge-icon" style="color: var(--neon-magenta);"><i class="fa-solid fa-gavel"></i></div>
                <div class="choice-text-wrap">
                    <div class="choice-law-title">${p.title}</div>
                </div>
            </div>
        `;
    }).join('');

    renderNotebook();
    showStep(state.currentStep || 1);
    saveSessionState();
}

function renderNotebook() {
    const c = state.currentCase;
    elSideClueCount.textContent = `${state.foundClues.size}/${c.clues.length}`;

    if (state.foundClues.size === 0) {
        elSideCluesList.innerHTML = `
            <div style="font-size: 0.8rem; color: #94a3b8; font-style: italic; padding: 6px;">
                📌 ยังไม่ได้สแกนหลักฐาน (เล่นมินิเกมสแกนในขั้นตอนที่ 1 เพื่อรับคะแนน +25)
            </div>
        `;
    } else {
        elSideCluesList.innerHTML = Array.from(state.foundClues).map(i => `
            <div class="clue-note-card scanned">
                <div class="clue-note-title"><i class="fa-solid fa-circle-check"></i> ${c.clues[i].title}</div>
                <div>${c.clues[i].note}</div>
            </div>
        `).join('');
    }
}

/* Trigger Forensic Evidence Mini-Game Challenge with Realistic Content Options */
let currentMiniGameOptions = [];

function triggerMiniGame(clueIdx) {
    if (state.foundClues.has(clueIdx)) {
        showToast("🔍 หลักฐานนี้สแกนสำเร็จเรียบร้อยแล้ว!");
        return;
    }
    if (state.failedClues.has(clueIdx)) {
        showToast("🔒 หลักฐานนี้ถอดรหัสล้มเหลว ไม่สามารถสแกนซ้ำได้อีก!");
        return;
    }

    sound.playScan();
    state.pendingClueIdx = clueIdx;
    const clue = state.currentCase.clues[clueIdx];

    document.getElementById('minigame-title').textContent = `🎮 ถอดรหัสหลักฐาน: ${clue.title}`;
    document.getElementById('minigame-desc').innerHTML = `
        วิเคราะห์ไฟล์เบาะแส: <b>"${clue.note}"</b><br>
        คำถาม: เพื่อปลดล็อกสแกนเบาะแสนี้นักสืบต้องระบุข้อสรุปเชิงสืบสวนดิจิทัลที่ถูกต้อง:
    `;

    const options = [
        { 
            correct: true, 
            text: `🔹 <b>ข้อสรุปทางนิติวิทยาศาสตร์ดิจิทัล:</b> ตรวจพบหลักฐานยืนยันพฤติการณ์ "${clue.note}" เป็นการกระทำที่มีเจตนาละเมิดกฎหมายชัดเจน` 
        },
        { 
            correct: false, 
            text: `🔹 <b>ข้อโต้แย้งทางเทคนิค (Technical Defense):</b> อ้างว่าเป็นเพียงพฤติกรรมปกติของระบบ หรือเกิดจากความประมาทเลินเล่อของเหยื่อเอง จึงไม่ใช่ความผิดอาญา` 
        },
        { 
            correct: false, 
            text: `🔹 <b>การตีความข้อบังคับคลาดเคลื่อน (Policy Misconception):</b> อ้างว่าเป็นเพียงข้อพิพาททางแพ่งหรือการผิดข้อตกลงการใช้งาน (Terms of Service) ไม่นับเป็นหลักฐานเอาผิดได้` 
        }
    ];

    currentMiniGameOptions = shuffleArray(options);

    document.getElementById('minigame-choices').innerHTML = currentMiniGameOptions.map((opt, idx) => `
        <button class="choice-option-card" onclick="answerMiniGame(${idx})">
            <div class="choice-badge-icon" style="color: var(--neon-cyan);"><i class="fa-solid fa-microscope"></i></div>
            <div style="text-align: left;">${opt.text}</div>
        </button>
    `).join('');

    modalMiniGame.classList.add('active');
}

/* Process Mini-Game Answer */
function answerMiniGame(optIndex) {
    modalMiniGame.classList.remove('active');
    const idx = state.pendingClueIdx;
    const opt = currentMiniGameOptions[optIndex];
    const isCorrect = opt ? opt.correct : false;

    if (isCorrect) {
        sound.playOk();
        state.foundClues.add(idx);
        state.currentScore += 25;
        if (state.currentScore > state.bestScore) {
            state.bestScore = state.currentScore;
            localStorage.setItem('detective_best_score', state.bestScore.toString());
        }
        updateStudentHeader();
        showToast("🎉 ถอดรหัสหลักฐานสำเร็จ! ได้รับคะแนน +25 และบันทึกเบาะแสลงสมุดเรียบร้อย");
    } else {
        sound.playFail();
        state.failedClues.add(idx);
        state.currentScore = Math.max(0, state.currentScore - 15);
        updateStudentHeader();
        showToast("💥 ถอดรหัสล้มเหลว! หักคะแนน -15 และหลักฐานนี้ถูกล็อกไม่สามารถสแกนได้แล้ว");
    }

    saveSessionState();
    syncToSupabase("กำลังทำคดี");
    restoreCaseState();
}

/* Dynamic Side Mascot Switcher & Pop Animation */
function updateSideMascot(phase, customMsg = null) {
    const elImg = document.getElementById('side-mascot-img');
    const elWrapper = document.getElementById('mascot-pop-wrapper') || elImg;
    const elBubble = document.getElementById('side-mascot-bubble');
    if (!elImg || !elBubble) return;

    if (elWrapper) {
        elWrapper.classList.remove('phase-pop');
        void elWrapper.offsetWidth; // Trigger reflow for re-animation
        elWrapper.classList.add('phase-pop');
        setTimeout(() => elWrapper.classList.remove('phase-pop'), 500);
    }

    if (phase === 1) {
        elImg.src = '/assets/mascot_scan.png';
        elImg.onerror = function() { if (this.src.indexOf('/assets/') !== -1) this.src = 'assets/mascot_scan.png'; };
        elImg.style.filter = 'drop-shadow(0 0 14px rgba(56, 189, 248, 0.55))';
        elBubble.style.borderColor = 'var(--neon-cyan)';
        elBubble.style.setProperty('--bubble-tail', 'var(--neon-cyan)');
        elBubble.textContent = customMsg || "🔎 ภารกิจขั้นตอนที่ 1: ตรวจสแกนหลักฐานดิจิทัลและบันทึกเบาะแสลงสมุด!";
    } else if (phase === 2) {
        elImg.src = '/assets/mascot_law.png';
        elImg.onerror = function() { if (this.src.indexOf('/assets/') !== -1) this.src = 'assets/mascot_law.png'; };
        elImg.style.filter = 'drop-shadow(0 0 14px rgba(245, 158, 11, 0.55))';
        elBubble.style.borderColor = 'var(--neon-yellow)';
        elBubble.style.setProperty('--bubble-tail', 'var(--neon-yellow)');
        elBubble.textContent = customMsg || "📖 ภารกิจขั้นตอนที่ 2: อ่านคำร้องทุกข์ในสมุดโน้ต แล้วเลือกมาตราความผิดด้วยตนเอง!";
    } else if (phase === 3) {
        elImg.src = '/assets/mascot_judge.png';
        elImg.onerror = function() { if (this.src.indexOf('/assets/') !== -1) this.src = 'assets/mascot_judge.png'; };
        elImg.style.filter = 'drop-shadow(0 0 14px rgba(16, 185, 129, 0.55))';
        elBubble.style.borderColor = 'var(--neon-green)';
        elBubble.style.setProperty('--bubble-tail', 'var(--neon-green)');
        elBubble.textContent = customMsg || "⚖️ ภารกิจขั้นตอนที่ 3: ระบุอัตราบทลงโทษตามกฎหมายให้ถูกต้อง เพื่ออนุมัติออกหมายจับ!";
    } else if (phase === 'win') {
        elImg.src = '/assets/mascot_win.png';
        elImg.onerror = function() { if (this.src.indexOf('/assets/') !== -1) this.src = 'assets/mascot_win.png'; };
        elImg.style.filter = 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.75))';
        elBubble.style.borderColor = 'var(--neon-yellow)';
        elBubble.style.setProperty('--bubble-tail', 'var(--neon-yellow)');
        elBubble.textContent = customMsg || "🏆 ภารกิจสำเร็จ: สำนวนคดีสมบูรณ์! อนุมัติหมายจับและบันทึกคะแนนเรียบร้อย!";
    }
}

/* Step Switcher */
function showStep(stepNum) {
    state.currentStep = stepNum;

    document.getElementById('card-step-1').style.display = stepNum === 1 ? 'flex' : 'none';
    document.getElementById('card-step-2').style.display = stepNum === 2 ? 'flex' : 'none';
    document.getElementById('card-step-3').style.display = stepNum === 3 ? 'flex' : 'none';

    for (let i = 1; i <= 3; i++) {
        const pill = document.getElementById(`pill-step-${i}`);
        if (pill) {
            pill.classList.remove('active', 'completed');
            if (i === stepNum) pill.classList.add('active');
            else if (i < stepNum) pill.classList.add('completed');
        }
    }
    updateSideMascot(stepNum);
    saveSessionState();
}

/* Stepper Pill Direct Navigation */
['pill-step-1', 'pill-step-2', 'pill-step-3'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            const targetStep = idx + 1;
            if (targetStep === 3 && !state.selectedLaw) {
                sound.playFail();
                showToast("⚠️ กรุณากดเลือกข้อกฎหมายในขั้นตอนที่ 2 ก่อน!");
                return;
            }
            sound.playScan();
            showStep(targetStep);
        });
    }
});

document.getElementById('btn-goto-2').addEventListener('click', () => { sound.playScan(); showStep(2); });
document.getElementById('btn-backto-1').addEventListener('click', () => { sound.playScan(); showStep(1); });
document.getElementById('btn-goto-3').addEventListener('click', () => {
    if (!state.selectedLaw) { sound.playFail(); showToast("⚠️ กรุณากดเลือกข้อกฎหมายในขั้นตอนที่ 2 ก่อน!"); return; }
    sound.playScan(); showStep(3);
});
document.getElementById('btn-backto-2').addEventListener('click', () => { sound.playScan(); showStep(2); });

/* Choice Selectors with Spoiler-Free Procedural Status Logging */
function selectLaw(lawId) {
    sound.playScan();
    state.selectedLaw = lawId;
    document.querySelectorAll('#law-choices-container .choice-option-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById(`law-card-${lawId}`);
    if (el) el.classList.add('selected');

    // Spoiler-Free Investigation Status Log
    updateSideMascot(2, `📌 บันทึกสำนวน: ระบุข้อหาความผิดแล้ว (กดไปขั้นตอนที่ 3 เพื่อเลือกอัตราบทลงโทษ)`);

    saveSessionState();
}

function selectPenalty(penId) {
    sound.playScan();
    state.selectedPenalty = penId;
    document.querySelectorAll('#penalty-choices-container .choice-option-card').forEach(c => c.classList.remove('selected'));
    const el = document.getElementById(`pen-card-${penId}`);
    if (el) el.classList.add('selected');

    // Spoiler-Free Investigation Status Log
    updateSideMascot(3, `⚖️ บันทึกสำนวน: ระบุอัตราบทลงโทษเรียบร้อยแล้ว (พร้อมกดปุ่มออกหมายจับ)`);

    saveSessionState();
}

/* Submit Case Verdict */
document.getElementById('btn-submit-verdict').addEventListener('click', () => {
    if (state.isCompleted) {
        resetToRegistrationScreen();
        return;
    }

    if (!state.selectedPenalty) { sound.playFail(); showToast("⚠️ กรุณากดเลือกอัตราบทลงโทษตามกฎหมายก่อน!"); return; }

    const c = state.currentCase;
    const lawBank = c.shuffledLawOptions || c.lawOptions;
    const penBank = c.shuffledPenaltyOptions || c.penaltyOptions;

    const targetLaw = lawBank.find(l => l.id === state.selectedLaw);
    const targetPen = penBank.find(p => p.id === state.selectedPenalty);

    if (!targetLaw || !targetPen) {
        showToast("⚠️ กรุณากดเลือกข้อกฎหมายและบทลงโทษก่อน!");
        return;
    }

    const isLawCorrect = targetLaw.correct;
    const isPenCorrect = targetPen.correct;
    const isCorrect = isLawCorrect && isPenCorrect;
    const isLastCase = state.currentQueueIdx === state.sessionQueue.length - 1;

    if (isCorrect) {
        sound.playGavel();
        state.consecutiveWrong = 0;
        updateSideMascot('win', 'ปิดคดีสำเร็จ! ออกหมายจับคนร้ายได้ถูกต้อง!');

        let bonusMsg = "+100 คะแนนฐาน";
        let added = 100;

        if (!state.currentRoundSolved.has(c.id)) {
            state.currentRoundSolved.add(c.id);
            state.solvedCaseIds.add(c.id);
            localStorage.setItem('detective_solved_cases', JSON.stringify(Array.from(state.solvedCaseIds)));

            if (state.caseSeconds <= 45) {
                added += 30;
                bonusMsg = "+100 คะแนนฐาน + โบนัสความไวสูงสุด +30";
            } else if (state.caseSeconds <= 90) {
                added += 15;
                bonusMsg = "+100 คะแนนฐาน + โบนัสความไว +15";
            }

            state.currentScore += added;
            if (state.currentScore > state.bestScore) {
                state.bestScore = state.currentScore;
                localStorage.setItem('detective_best_score', state.bestScore.toString());
            }
        }

        updateStudentHeader();
        syncToSupabase("กำลังทำคดี");

        document.getElementById('result-icon').innerHTML = `<img src="/assets/mascot_win.png" onerror="if(this.src.indexOf('/assets/')!==-1)this.src='assets/mascot_win.png';" style="width: 110px; height: auto; filter: drop-shadow(0 0 14px rgba(16, 185, 129, 0.65)); animation: mascotCuteBob 3.6s ease-in-out infinite alternate;" alt="Victory Mascot">`;
        document.getElementById('card-result-border').style.borderColor = "var(--neon-green)";
        document.getElementById('result-title').textContent = "ตัดสินคดีถูกต้องแม่นยำ!";
        document.getElementById('result-title').style.color = "var(--neon-green)";
        document.getElementById('result-desc').textContent = `ยินดีด้วยสายสืบ ${state.alias}! คุณตัดสินคดีได้ถูกต้องในเวลา ${state.caseSeconds} วินาที`;
        document.getElementById('result-points-added').textContent = `${bonusMsg} (รวม +${added} คะแนน!)`;

        // Render Post-Case Knowledge Flashcard
        const flashcardBox = document.getElementById('result-flashcard');
        const flashcardText = document.getElementById('flashcard-text');
        if (flashcardBox && flashcardText) {
            const takeaway = c.takeaway || `<b>${targetLaw.title}</b>: ${targetLaw.desc}<br>⚖️ <b>บทลงโทษตามกฎหมาย</b>: ${targetPen.title}`;
            flashcardText.innerHTML = takeaway;
            flashcardBox.style.display = 'block';
        }

        const btnNext = document.getElementById('btn-next-case');
        if (isLastCase) {
            btnNext.innerHTML = `<i class="fa-solid fa-file-certificate"></i> ดูใบบันทึกคะแนนสรุปผลทั้งหมดส่งครู (ภารกิจสำเร็จ)`;
            btnNext.style.background = "linear-gradient(135deg, var(--neon-green), #059669)";
        } else {
            btnNext.innerHTML = `<i class="fa-solid fa-arrow-right"></i> ทำคดีสุ่มถัดไป (${state.currentQueueIdx + 2}/${state.sessionQueue.length})`;
            btnNext.style.background = "linear-gradient(135deg, var(--neon-cyan), #0284c7)";
        }

        modalResult.classList.add('active');
    } else {
        sound.playFail();
        
        const flashcardBox = document.getElementById('result-flashcard');
        if (flashcardBox) flashcardBox.style.display = 'none';

        let deduction = 0;
        if (!isLawCorrect) deduction += 30;
        if (!isPenCorrect) deduction += 30;

        state.currentScore = Math.max(0, state.currentScore - deduction);

        updateStudentHeader();
        syncToSupabase("กำลังทำคดี");

        document.getElementById('result-icon').innerHTML = `<img src="/assets/mascot_fail.png" onerror="if(this.src.indexOf('/assets/')!==-1)this.src='assets/mascot_fail.png';" style="width: 110px; height: auto; filter: drop-shadow(0 0 14px rgba(244, 63, 94, 0.65)); animation: mascotCuteBob 3.6s ease-in-out infinite alternate;" alt="Sad Crying Mascot">`;
        document.getElementById('card-result-border').style.borderColor = "var(--neon-magenta)";
        document.getElementById('result-title').textContent = "คำพิพากษาไม่ถูกต้อง! (โดนหักคะแนน)";
        document.getElementById('result-title').style.color = "var(--neon-magenta)";
        document.getElementById('result-desc').textContent = "ข้อกฎหมายหรือบทลงโทษที่คุณเลือกยังไม่ถูกต้อง! ลองอ่านโจทย์และวิเคราะห์เบาะแสในสมุดโน้ตใหม่อีกครั้ง";
        document.getElementById('result-points-added').textContent = `💥 โดนหักคะแนน -${deduction} คะแนน! ลองเลือกใหม่อีกครั้ง`;

        // Anti-Spam Guessing Cooldown Check (3 wrong answers -> 5s lock)
        state.consecutiveWrong = (state.consecutiveWrong || 0) + 1;
        if (state.consecutiveWrong >= 3) {
            state.consecutiveWrong = 0;
            startAntiSpamCooldown();
        }

        // Reset choice selections so student can re-select!
        state.selectedLaw = null;
        state.selectedPenalty = null;
        document.querySelectorAll('.choice-option-card').forEach(card => card.classList.remove('selected'));

        const btnNext = document.getElementById('btn-next-case');
        if (isLastCase) {
            btnNext.innerHTML = `<i class="fa-solid fa-file-certificate"></i> ดูใบบันทึกคะแนนสรุปผลทั้งหมดส่งครู`;
            btnNext.style.background = "linear-gradient(135deg, var(--neon-green), #059669)";
        } else {
            btnNext.innerHTML = `<i class="fa-solid fa-arrow-right"></i> ลองตอบคดีนี้ใหม่อีกครั้ง`;
            btnNext.style.background = "linear-gradient(135deg, var(--neon-cyan), #0284c7)";
        }

        modalResult.classList.add('active');
    }

    saveSessionState();
});

/* Anti-Spam Guessing Cooldown Timer */
function startAntiSpamCooldown() {
    const btnSubmit = document.getElementById('btn-submit-verdict');
    if (!btnSubmit || state.isCooldown) return;
    state.isCooldown = true;
    btnSubmit.disabled = true;

    let secLeft = 5;
    btnSubmit.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ล็อกการตอบชั่วคราว (${secLeft}s)...`;
    showToast("⚠️ คุณตอบผิด 3 ครั้งติดกัน! ระบบล็อกการตอบ 5 วินาที เพื่อให้อ่านโจทย์และวิเคราะห์หลักฐาน");

    const cdInterval = setInterval(() => {
        secLeft--;
        if (secLeft > 0) {
            btnSubmit.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ล็อกการตอบชั่วคราว (${secLeft}s)...`;
        } else {
            clearInterval(cdInterval);
            state.isCooldown = false;
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<i class="fa-solid fa-handcuffs"></i> ตัดสินคดี & บันทึกคะแนน!`;
        }
    }, 1000);
}

document.getElementById('btn-next-case').addEventListener('click', () => {
    modalResult.classList.remove('active');

    const c = state.currentCase;
    const lawBank = c.shuffledLawOptions || c.lawOptions;
    const penBank = c.shuffledPenaltyOptions || c.penaltyOptions;
    const targetLaw = lawBank.find(l => l.id === state.selectedLaw);
    const targetPen = penBank.find(p => p.id === state.selectedPenalty);
    const isCorrect = (targetLaw && targetPen && targetLaw.correct && targetPen.correct);

    if (isCorrect) {
        if (state.currentQueueIdx < state.sessionQueue.length - 1) {
            loadCaseFromQueue(state.currentQueueIdx + 1);
        } else {
            state.playCount++;
            localStorage.setItem('detective_play_count', state.playCount.toString());
            clearSessionState();
            syncToSupabase("ส่งคดีเรียบร้อย");
            openReportModal();
        }
    } else {
        showStep(2);
    }
});

/* Report Modal */
document.getElementById('btn-report').addEventListener('click', openReportModal);
document.getElementById('btn-close-report').addEventListener('click', resetToRegistrationScreen);

/* Reset Game & Return to Initial Registration Screen */
function resetToRegistrationScreen() {
    modalReport.classList.remove('active');
    modalResult.classList.remove('active');
    if (timerInterval) clearInterval(timerInterval);
    clearSessionState();

    state.currentScore = 0;
    state.totalSeconds = 0;
    state.caseSeconds = 0;
    state.currentQueueIdx = 0;
    state.foundClues.clear();
    state.failedClues.clear();
    state.currentRoundSolved.clear();
    state.selectedLaw = null;
    state.selectedPenalty = null;
    state.isCompleted = false;
    state.consecutiveWrong = 0;
    state.isCooldown = false;

    elHeaderTimer.textContent = "00:00";
    elHeaderScore.textContent = "0 / 1080";
    document.getElementById('input-firstname').value = '';
    document.getElementById('input-lastname').value = '';
    document.getElementById('input-no').value = '';
    state.firstname = '';
    state.lastname = '';
    state.no = '';
    localStorage.removeItem('detective_fname');
    localStorage.removeItem('detective_lname');
    localStorage.removeItem('detective_no');

    elHeaderTimer.textContent = "00:00";
    elHeaderScore.textContent = "0 / 1080";
    elHeaderStudent.innerHTML = `<i class="fa-solid fa-user-graduate"></i> <span>ยังไม่ได้ลงทะเบียน</span>`;

    modalRegister.classList.add('active');
    showToast("🎮 รีเซ็ตระบบเรียบร้อย กรุณากรอกข้อมูลเพื่อเริ่มทำคดีใหม่");
}

const btnRestartRound = document.getElementById('btn-restart-round');
if (btnRestartRound) {
    btnRestartRound.addEventListener('click', resetToRegistrationScreen);
}

/* Ambient Music Toggle */
document.getElementById('btn-music').addEventListener('click', () => {
    const isOn = sound.toggleMusic();
    document.getElementById('music-icon').className = isOn ? "fa-solid fa-music" : "fa-solid fa-volume-xmark";
    showToast(isOn ? "🎵 เปิดดนตรีประกอบ Cyber Ambient" : "🔇 ปิดดนตรีประกอบ");
});

/* Mobile Collapsible Sidebar Toggle */
const sidePanel = document.getElementById('side-notebook-panel');
const btnToggleSide = document.getElementById('btn-toggle-notebook');
const btnCloseSide = document.getElementById('btn-close-notebook');

if (btnToggleSide && sidePanel) {
    btnToggleSide.addEventListener('click', () => sidePanel.classList.toggle('open'));
}
if (btnCloseSide && sidePanel) {
    btnCloseSide.addEventListener('click', () => sidePanel.classList.remove('open'));
}

function openReportModal() {
    sound.playOk();
    state.isCompleted = true;
    if (timerInterval) clearInterval(timerInterval);
    syncToSupabase("ส่งคดีเรียบร้อย");

    const fullName = `${state.prefix}${state.firstname} ${state.lastname}`;
    const fullClass = `${state.room} เลขที่ ${state.no}`;
    const m = String(Math.floor(state.totalSeconds / 60)).padStart(2, '0');
    const s = String(state.totalSeconds % 60).padStart(2, '0');

    const finalDisplayScore = Math.max(state.bestScore, state.currentScore);

    // Safe DOM element references!
    const elRptAlias = document.getElementById('rpt-alias');
    const elRptGender = document.getElementById('rpt-gender');
    const elRptName = document.getElementById('rpt-name');
    const elRptClass = document.getElementById('rpt-class');
    const elRptTime = document.getElementById('rpt-time');
    const elRptPlaycount = document.getElementById('rpt-playcount');
    const elRptCases = document.getElementById('rpt-cases');
    const elRptScore = document.getElementById('rpt-score');
    const elRptGrade = document.getElementById('rpt-grade');

    if (elRptAlias) elRptAlias.textContent = state.alias || 'Agent X';
    if (elRptGender) elRptGender.textContent = computeGender(state.prefix);
    if (elRptName) elRptName.textContent = fullName;
    if (elRptClass) elRptClass.textContent = fullClass;
    if (elRptTime) elRptTime.textContent = `${m}:${s} นาที`;
    if (elRptPlaycount) elRptPlaycount.textContent = `${state.playCount} รอบ`;
    if (elRptCases) elRptCases.textContent = `${state.currentRoundSolved.size} / 6 คดี`;
    if (elRptScore) elRptScore.textContent = `${finalDisplayScore} / 1080 คะแนน`;

    const pct = (finalDisplayScore / 1080) * 100;
    let grade = "ระดับ A+ (ดีเยี่ยม)";
    if (pct < 50) grade = "ระดับ D (ควรปรับปรุง)";
    else if (pct < 70) grade = "ระดับ C (พอใช้)";
    else if (pct < 85) grade = "ระดับ B (ดี)";

    if (elRptGrade) elRptGrade.textContent = grade;
    modalReport.classList.add('active');
}

/* Surrender & Restart Game Function */
function surrenderAndRestart() {
    if (confirm("คุณต้องการยอมแพ้และเริ่มต้นทำคดีใหม่ใช่หรือไม่?\n\n(คะแนนและเวลาในรอบนี้จะถูกรีเซ็ตใหม่ทั้งหมด เพื่อให้คุณกรอกชื่อ-นามสกุล และเลขที่ใหม่)")) {
        sound.playFail();
        resetToRegistrationScreen();
    }
}

document.getElementById('btn-surrender').addEventListener('click', surrenderAndRestart);

document.getElementById('btn-sound').addEventListener('click', () => {
    sound.muted = !sound.muted;
    document.getElementById('sound-icon').className = sound.muted ? "fa-solid fa-volume-xmark" : "fa-solid fa-volume-high";
});
