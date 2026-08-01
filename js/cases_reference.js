let isUnlocked = false;

function checkTeacherAuth() {
    const auth = sessionStorage.getItem('teacher_authenticated');
    if (auth === 'true') {
        isUnlocked = true;
    }
    updateAuthUI();
}

function updateAuthUI() {
    const badge = document.getElementById('status-badge');
    const icon = document.getElementById('status-icon');
    const text = document.getElementById('status-text');
    const btn = document.getElementById('btn-toggle-auth');
    const btnIcon = document.getElementById('btn-icon');
    const btnText = document.getElementById('btn-text');

    if (isUnlocked) {
        badge.className = "lock-badge badge-unlocked";
        icon.className = "fa-solid fa-lock-open";
        text.textContent = "สถานะเฉลย: ปลดล็อกเรียบร้อย (แสดงเฉลยฉบับครูผู้สอน)";

        btn.className = "btn-auth-toggle btn-auth-lock";
        btnIcon.className = "fa-solid fa-eye-slash";
        btnText.textContent = "🔒 ซ่อนเฉลย (สำหรับแสดงผลให้นักเรียนดู)";
    } else {
        badge.className = "lock-badge badge-locked";
        icon.className = "fa-solid fa-lock";
        text.textContent = "สถานะเฉลย: ล็อกอยู่ (ซ่อนเฉลยสำหรับนักเรียน)";

        btn.className = "btn-auth-toggle btn-auth-unlock";
        btnIcon.className = "fa-solid fa-key";
        btnText.textContent = "🔑 ปลดล็อกเฉลย (สำหรับครูผู้สอน)";
    }

    renderCases();
}

// Modal Controls
const modalAuth = document.getElementById('modal-auth');
const inputPasscode = document.getElementById('input-passcode');
const btnSubmit = document.getElementById('btn-submit-passcode');
const btnClose = document.getElementById('btn-close-modal');
const btnToggleAuth = document.getElementById('btn-toggle-auth');

btnToggleAuth.addEventListener('click', () => {
    if (isUnlocked) {
        isUnlocked = false;
        updateAuthUI();
    } else {
        modalAuth.style.display = 'flex';
        inputPasscode.focus();
    }
});

btnClose.addEventListener('click', () => {
    modalAuth.style.display = 'none';
});

btnSubmit.addEventListener('click', verifyPasscode);
inputPasscode.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyPasscode();
});

async function verifyPasscode() {
    const val = inputPasscode.value.trim();
    let validPass = (val === 'admin123' || val === 'teacher123');

    try {
        if (window.location.protocol.startsWith('http')) {
            const res = await fetch('/api/verify-passcode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode: val })
            });
            const data = await res.json();
            if (data && data.success) validPass = true;
        }
    } catch(e) {}

    if (validPass) {
        sessionStorage.setItem('teacher_authenticated', 'true');
        isUnlocked = true;
        modalAuth.style.display = 'none';
        inputPasscode.value = '';
        updateAuthUI();
    } else {
        alert("รหัสผ่านครูผู้สอนไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง");
    }
}

// Render Cases List
function renderCases() {
    const container = document.getElementById('cases-container');
    const searchVal = document.getElementById('input-search').value.trim().toLowerCase();

    if (!window.CASES || window.CASES.length === 0) {
        container.innerHTML = `<div style="color: #94a3b8; text-align: center; grid-column: 1/-1;">ไม่พบข้อมูลคดี</div>`;
        return;
    }

    let filtered = window.CASES.filter(c => {
        if (!searchVal) return true;
        const titleMatch = c.title && c.title.toLowerCase().includes(searchVal);
        const briefMatch = c.brief && c.brief.toLowerCase().includes(searchVal);
        const lawMatch = c.lawOptions && c.lawOptions.some(l => l.title.toLowerCase().includes(searchVal) || (l.desc && l.desc.toLowerCase().includes(searchVal)));
        return titleMatch || briefMatch || lawMatch;
    });

    document.getElementById('stat-count').textContent = `แสดงผล ${filtered.length} / ${window.CASES.length} คดี`;

    container.innerHTML = filtered.map(c => {
        const correctLaw = c.lawOptions ? c.lawOptions.find(l => l.correct) : null;
        const correctPenalty = c.penaltyOptions ? c.penaltyOptions.find(p => p.correct) : null;

        const cluesHtml = (c.clues || []).map(clue => `
            <div class="clue-item">
                <div class="clue-title">${clue.title}</div>
                <div>${clue.note}</div>
            </div>
        `).join('');

        const lawOptionsHtml = (c.lawOptions || []).map(opt => {
            const isCorrect = isUnlocked && opt.correct;
            return `
                <div class="option-item ${isCorrect ? 'option-correct-unlocked' : ''}">
                    <div class="option-title">
                        ${opt.title}
                        ${isCorrect ? '<span class="correct-badge-icon"><i class="fa-solid fa-check"></i> เฉลยถูกต้อง</span>' : ''}
                    </div>
                    <div class="option-desc">${opt.desc || ''}</div>
                </div>
            `;
        }).join('');

        const penaltyOptionsHtml = (c.penaltyOptions || []).map(opt => {
            const isCorrect = isUnlocked && opt.correct;
            return `
                <div class="option-item ${isCorrect ? 'option-correct-unlocked' : ''}">
                    <div class="option-title">
                        ${opt.title}
                        ${isCorrect ? '<span class="correct-badge-icon"><i class="fa-solid fa-check"></i> เฉลยถูกต้อง</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        const teacherAnswerBox = isUnlocked ? `
            <div class="unlocked-answer-box">
                <div class="unlocked-header">
                    <i class="fa-solid fa-graduation-cap"></i> สรุปคำอธิบายและเฉลยฉบับครูผู้สอน
                </div>
                <div style="font-size: 0.88rem; color: #e2e8f0; line-height: 1.5;">
                    <b>ข้อหารายละเอียด:</b> <span style="color: var(--neon-green); font-weight: 700;">${correctLaw ? correctLaw.title + ' - ' + correctLaw.desc : '-'}</span>
                    <br>
                    <b>อัตราโทษทางกฎหมาย:</b> <span style="color: var(--neon-yellow); font-weight: 700;">${correctPenalty ? correctPenalty.title : '-'}</span>
                </div>
            </div>
        ` : `
            <div class="locked-answer-box" onclick="document.getElementById('modal-auth').style.display='flex'">
                <div class="locked-title">
                    <i class="fa-solid fa-lock"></i> เฉลยคำตอบและอัตราโทษทางกฎหมายถูกล็อกอยู่
                </div>
                <div class="locked-subtitle">คลิกที่นี่เพื่อกรอกรหัสผ่านครูผู้สอน และปลดล็อกเฉลยทุกคดี</div>
            </div>
        `;

        return `
            <div class="case-card">
                <div class="case-card-header">
                    <h2 class="case-title">${c.title}</h2>
                    <span class="case-id-badge">คดี #${String(c.id).padStart(2, '0')}</span>
                </div>

                <div class="case-brief-box">
                    <b>📋 คำร้องทุกข์:</b> ${c.brief}
                </div>

                <div class="clues-section">
                    <div class="section-label"><i class="fa-solid fa-magnifying-glass"></i> หลักฐานสืบสวน (Clues)</div>
                    ${cluesHtml}
                </div>

                <div class="options-group">
                    <div class="section-label"><i class="fa-solid fa-gavel"></i> ตัวเลือกข้อหากฎหมาย</div>
                    ${lawOptionsHtml}
                </div>

                <div class="options-group">
                    <div class="section-label"><i class="fa-solid fa-scale-balanced"></i> ตัวเลือกอัตราโทษ</div>
                    ${penaltyOptionsHtml}
                </div>

                ${teacherAnswerBox}
            </div>
        `;
    }).join('');
}

document.getElementById('input-search').addEventListener('input', renderCases);

checkTeacherAuth();
