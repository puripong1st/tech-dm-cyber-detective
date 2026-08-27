/**
 * Law Quiz Reference & Solution Bank Script
 * คลังข้อสอบ 30 ข้อ และเฉลยละเอียด พ.ร.บ.คอมพิวเตอร์ 2560
 */
(() => {
    const $ = id => document.getElementById(id);
    let isUnlocked = false;
    const revealedSet = new Set();
    let currentBloom = 'all';
    let currentTopic = 'all';
    let searchQuery = '';

    const bloomLabels = {
        understand: { th: 'เข้าใจ (Understand)', class: 'understand', icon: 'fa-solid fa-lightbulb' },
        apply: { th: 'ประยุกต์ใช้ (Apply)', class: 'apply', icon: 'fa-solid fa-wrench' },
        analyze: { th: 'วิเคราะห์ (Analyze)', class: 'analyze', icon: 'fa-solid fa-microscope' }
    };

    function init() {
        checkAuth();
        setupEvents();
        populateTopicFilter();
        render();
    }

    function checkAuth() {
        const teacherAuth = sessionStorage.getItem('teacher_authenticated');
        const quizPasscode = sessionStorage.getItem('law-quiz-teacher-passcode');
        if (teacherAuth === 'true' || quizPasscode) {
            isUnlocked = true;
        }
        updateAuthUI();
    }

    function updateAuthUI() {
        const badge = $('status-badge');
        const icon = $('status-icon');
        const text = $('status-text');
        const btn = $('btn-toggle-auth');
        const btnIcon = $('btn-icon');
        const btnText = $('btn-text');

        if (isUnlocked) {
            badge.className = 'lock-badge badge-unlocked';
            icon.className = 'fa-solid fa-lock-open';
            text.textContent = 'สถานะเฉลย: ปลดล็อกแล้ว (แสดงเฉลยฉบับครูผู้สอน)';

            btn.className = 'btn-auth-toggle btn-auth-lock';
            btnIcon.className = 'fa-solid fa-eye-slash';
            btnText.textContent = '🔒 ซ่อนเฉลยทั้งหมด';
        } else {
            badge.className = 'lock-badge badge-locked';
            icon.className = 'fa-solid fa-lock';
            text.textContent = 'สถานะเฉลย: ล็อกอยู่ (ซ่อนเฉลยสำหรับนักเรียนฝึกทำ)';

            btn.className = 'btn-auth-toggle btn-auth-unlock';
            btnIcon.className = 'fa-solid fa-key';
            btnText.textContent = '🔑 ปลดล็อกเฉลย (สำหรับครูผู้สอน)';
        }
    }

    function populateTopicFilter() {
        const questions = window.LAW_QUIZ_QUESTIONS || [];
        const topics = new Set();
        questions.forEach(q => {
            if (q.topic) {
                // Group by main article or category if needed
                const cleanTopic = q.topic.startsWith('มาตรา') ? q.topic.split('(')[0].trim() : q.topic;
                topics.add(cleanTopic);
            }
        });

        const select = $('filter-topic');
        if (select) {
            Array.from(topics).sort().forEach(topic => {
                const opt = document.createElement('option');
                opt.value = topic;
                opt.textContent = topic;
                select.appendChild(opt);
            });
        }
    }

    function setupEvents() {
        // Toggle Lock Auth
        $('btn-toggle-auth').onclick = () => {
            if (isUnlocked) {
                isUnlocked = false;
                revealedSet.clear();
                updateAuthUI();
                render();
            } else {
                openAuthModal();
            }
        };

        // Modal Controls
        $('btn-close-modal').onclick = closeAuthModal;
        $('btn-submit-passcode').onclick = verifyPasscode;
        $('input-passcode').onkeydown = e => { if (e.key === 'Enter') verifyPasscode(); };

        // Search Input
        $('input-search').oninput = e => {
            searchQuery = e.target.value.trim().toLowerCase();
            render();
        };

        // Bloom Pills
        document.querySelectorAll('.pill-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentBloom = btn.dataset.bloom;
                render();
            };
        });

        // Topic Select
        $('filter-topic').onchange = e => {
            currentTopic = e.target.value;
            render();
        };

        // Reveal / Hide All
        $('btn-show-all').onclick = () => {
            const questions = window.LAW_QUIZ_QUESTIONS || [];
            questions.forEach(q => revealedSet.add(q.id));
            render();
        };

        $('btn-hide-all').onclick = () => {
            revealedSet.clear();
            if (isUnlocked) {
                isUnlocked = false;
                updateAuthUI();
            }
            render();
        };

        // Print PDF
        $('btn-print').onclick = () => {
            // Reveal all when printing for complete answer sheet
            const questions = window.LAW_QUIZ_QUESTIONS || [];
            questions.forEach(q => revealedSet.add(q.id));
            render();
            setTimeout(() => window.print(), 100);
        };
    }

    function openAuthModal() {
        $('modal-auth').style.display = 'flex';
        $('input-passcode').value = '';
        $('input-passcode').focus();
    }

    function closeAuthModal() {
        $('modal-auth').style.display = 'none';
    }

    async function verifyPasscode() {
        const val = $('input-passcode').value.trim();
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
            sessionStorage.setItem('law-quiz-teacher-passcode', val);
            isUnlocked = true;
            closeAuthModal();
            updateAuthUI();
            render();
        } else {
            alert('รหัสผ่านครูผู้สอนไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง');
        }
    }

    function getFilteredQuestions() {
        const questions = window.LAW_QUIZ_QUESTIONS || [];
        return questions.filter(q => {
            // Bloom filter
            if (currentBloom !== 'all' && q.bloom !== currentBloom) return false;

            // Topic filter
            if (currentTopic !== 'all') {
                if (!q.topic.includes(currentTopic)) return false;
            }

            // Search query filter
            if (searchQuery) {
                const searchCorpus = [
                    q.id,
                    q.question,
                    q.topic,
                    q.explanation,
                    ...(q.options || [])
                ].join(' ').toLowerCase();

                if (!searchCorpus.includes(searchQuery)) return false;
            }

            return true;
        });
    }

    function renderStats() {
        const questions = window.LAW_QUIZ_QUESTIONS || [];
        const understandCount = questions.filter(q => q.bloom === 'understand').length;
        const applyCount = questions.filter(q => q.bloom === 'apply').length;
        const analyzeCount = questions.filter(q => q.bloom === 'analyze').length;

        $('stat-total').textContent = questions.length;
        $('stat-understand').textContent = understandCount;
        $('stat-apply').textContent = applyCount;
        $('stat-analyze').textContent = analyzeCount;
    }

    function render() {
        renderStats();
        const container = $('questions-container');
        const list = getFilteredQuestions();
        const total = (window.LAW_QUIZ_QUESTIONS || []).length;

        $('stat-count').textContent = `แสดง ${list.length} จาก ${total} ข้อ`;

        if (!list.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-magnifying-glass" style="font-size: 2.5rem; margin-bottom: 12px; color: #64748b;"></i>
                    <h3>ไม่พบข้อสอบตามเงื่อนไขที่เลือก</h3>
                    <p>ลองเปลี่ยนคำค้นหาหรือรีเซ็ตตัวกรองระดับ Bloom / มาตรา</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map((q, idx) => {
            const isRevealed = isUnlocked || revealedSet.has(q.id);
            const bloomInfo = bloomLabels[q.bloom] || { th: q.bloom, class: '', icon: '' };
            const correctLetter = q.answer; // 'A', 'B', etc.
            const correctIndex = correctLetter ? correctLetter.charCodeAt(0) - 65 : 0;

            const optionsMarkup = (q.options || []).map((opt, optIdx) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isCorrect = (optIdx === correctIndex);
                const isOptionHighlighted = isRevealed && isCorrect;

                return `
                    <div class="option-item ${isOptionHighlighted ? 'correct-answer' : ''}">
                        <span class="option-key">${letter}</span>
                        <span class="option-text">${escapeHtml(opt)}</span>
                        ${isOptionHighlighted ? '<span class="correct-tag"><i class="fa-solid fa-check"></i> คำตอบที่ถูกต้อง</span>' : ''}
                    </div>
                `;
            }).join('');

            const explanationMarkup = isRevealed ? `
                <div class="explanation-box">
                    <div class="explanation-head">
                        <i class="fa-solid fa-scale-balanced"></i>
                        <span>เฉลยคำตอบ: ข้อ ${correctLetter} · ${escapeHtml(q.topic || '')}</span>
                    </div>
                    <p class="explanation-text">${escapeHtml(q.explanation || '')}</p>
                </div>
            ` : `
                <div class="locked-mask" data-id="${q.id}">
                    <i class="fa-solid fa-lock"></i>
                    <span>คลิกเพื่อดูเฉลยและคำอธิบายข้อนี้</span>
                </div>
            `;

            return `
                <article class="question-card" id="q-${q.id}">
                    <div class="card-top">
                        <div class="meta-badges">
                            <span class="badge-num">ข้อ ${idx + 1}</span>
                            <span class="badge-topic">[${q.id}]</span>
                            <span class="badge-bloom ${bloomInfo.class}">
                                <i class="${bloomInfo.icon}"></i> ${bloomInfo.th}
                            </span>
                            <span class="badge-topic">${escapeHtml(q.topic || '')}</span>
                            ${q.sourceCases && q.sourceCases.length ? `<span class="badge-topic">คดีที่ ${q.sourceCases.join(', ')}</span>` : ''}
                        </div>
                        <button class="btn-card-toggle" data-id="${q.id}">
                            <i class="fa-solid ${isRevealed ? 'fa-eye-slash' : 'fa-eye'}"></i>
                            <span>${isRevealed ? 'ซ่อนเฉลย' : 'ดูเฉลยข้อนี้'}</span>
                        </button>
                    </div>

                    <h3 class="question-text">${escapeHtml(q.question)}</h3>

                    <div class="options-grid">
                        ${optionsMarkup}
                    </div>

                    ${explanationMarkup}
                </article>
            `;
        }).join('');

        // Attach Card Action Events
        document.querySelectorAll('.btn-card-toggle').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                if (isUnlocked || revealedSet.has(id)) {
                    revealedSet.delete(id);
                    if (isUnlocked) {
                        // If fully unlocked, toggling hides just this one by locking mode with all others revealed
                        isUnlocked = false;
                        (window.LAW_QUIZ_QUESTIONS || []).forEach(item => {
                            if (item.id !== id) revealedSet.add(item.id);
                        });
                        updateAuthUI();
                    }
                } else {
                    revealedSet.add(id);
                }
                render();
            };
        });

        document.querySelectorAll('.locked-mask').forEach(mask => {
            mask.onclick = () => {
                const id = mask.dataset.id;
                revealedSet.add(id);
                render();
            };
        });
    }

    function escapeHtml(str) {
        return String(str ?? '').replace(/[&<>'"]/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[char]));
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
