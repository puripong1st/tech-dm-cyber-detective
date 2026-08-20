let currentSlide = 0;
let soundEnabled = true;

const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
}

function playSound(type) {
    if (!soundEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'next') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'prev') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(660, now);
            osc.frequency.exponentialRampToValueAtTime(330, now + 0.12);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else if (type === 'finish') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(783.99, now + 0.2);
            osc.frequency.setValueAtTime(1046.50, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        }
    } catch (e) {}
}

function getTotalSlides() {
    const slides = document.querySelectorAll('.slide');
    return slides.length || 10;
}

const dotsContainer = document.getElementById('dots-container');
const totalSlidesCount = getTotalSlides();
for (let i = 0; i < totalSlidesCount; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

function loadYouTubeVideo(containerId, videoId, directUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Check if opened locally via file:// protocol
    // YouTube restricts embedded iframes on file:// (Error 153) due to missing domain origin.
    if (window.location.protocol === 'file:') {
        window.open(directUrl, '_blank', 'noopener,noreferrer');
        return;
    }

    // On web server (http://, https://, localhost): inject live iframe with autoplay
    const origin = window.location.origin || 'https://tech-dm-cyber-detective.vercel.app';
    container.innerHTML = `
        <iframe 
            src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(origin)}" 
            title="YouTube Video Player" 
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
}

function toggleLawReveal(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    const isRevealed = card.classList.toggle('revealed');
    const hint = card.querySelector('.reveal-toggle-hint');
    if (hint) {
        if (isRevealed) {
            hint.innerHTML = `<i class="fa-solid fa-unlock"></i> เฉลยแล้ว (คลิกเพื่อซ่อน)`;
            playSound('next');
        } else {
            hint.innerHTML = `<i class="fa-solid fa-lock"></i> คลิกเพื่อเฉลย`;
            playSound('prev');
        }
    }
}

function pauseYouTubeVideos() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
        } catch (e) {}
    });
}

function updateSlideView() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length || 10;
    const dots = document.querySelectorAll('.dot');
    const hpBar = document.getElementById('hp-bar');
    const stageText = document.getElementById('stage-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    pauseYouTubeVideos();

    // Reset interactive blur cards on slide change for fresh quiz session
    document.querySelectorAll('.video-case-card.blur-card').forEach(card => {
        card.classList.remove('revealed');
        const hint = card.querySelector('.reveal-toggle-hint');
        if (hint) {
            hint.innerHTML = `<i class="fa-solid fa-lock"></i> คลิกเพื่อเฉลย`;
        }
    });

    slides.forEach((slide, index) => {
        slide.classList.remove('active', 'exit-left');
        if (index === currentSlide) {
            slide.classList.add('active');
        } else if (index < currentSlide) {
            slide.classList.add('exit-left');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
    if (hpBar) hpBar.style.width = `${progressPercent}%`;
    if (stageText) stageText.textContent = `STAGE ${currentSlide + 1} / ${totalSlides}`;

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) {
        if (currentSlide === totalSlides - 1) {
            nextBtn.innerHTML = `COMPLETE <i class="fa-solid fa-flag-checkered"></i>`;
        } else {
            nextBtn.innerHTML = `NEXT (ต่อไป) <i class="fa-solid fa-chevron-right"></i>`;
        }
    }
}

function nextSlide() {
    const totalSlides = getTotalSlides();
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        playSound('next');
        if (currentSlide === totalSlides - 1) {
            setTimeout(() => playSound('finish'), 200);
        }
        updateSlideView();
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        playSound('prev');
        updateSlideView();
    }
}

function goToSlide(index) {
    const totalSlides = getTotalSlides();
    if (index >= 0 && index < totalSlides && index !== currentSlide) {
        const dir = index > currentSlide ? 'next' : 'prev';
        currentSlide = index;
        playSound(dir);
        updateSlideView();
    }
}

document.addEventListener('keydown', (e) => {
    const lawModal = document.getElementById('law-modal');
    const lightbox = document.getElementById('image-lightbox');
    const quickNavModal = document.getElementById('quick-nav-modal');

    if (e.key === 'Escape') {
        if (lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
            return;
        }
        if (lawModal && lawModal.classList.contains('active')) {
            closeLawModal();
            return;
        }
        if (quickNavModal && quickNavModal.classList.contains('active')) {
            closeQuickNav();
            return;
        }
    }

    // Disable slide arrow navigation if a modal is open
    if ((lawModal && lawModal.classList.contains('active')) || 
        (lightbox && lightbox.classList.contains('active')) ||
        (quickNavModal && quickNavModal.classList.contains('active'))) {
        return;
    }

    if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

const sfxBtn = document.getElementById('sfx-toggle');
sfxBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    sfxBtn.innerHTML = soundEnabled ? `<i class="fa-solid fa-volume-high"></i>` : `<i class="fa-solid fa-volume-xmark"></i>`;
    sfxBtn.style.color = soundEnabled ? 'var(--neon-cyan)' : '#94a3b8';
});

const fullscreenBtn = document.getElementById('fullscreen-toggle');
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// Canvas Particle Background
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
for (let i = 0; i < 35; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Math.random() > 0.5 ? '#38bdf8' : '#f43f5e'
    });
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    requestAnimationFrame(drawBackground);
}

drawBackground();

// ==========================================
// Law Modal & Lightbox Logic
// ==========================================
let activeLaw = null;

const caseNumberMap = {
    'section-5': 1,
    'section-6': 2,
    'section-7': 3,
    'section-8': 4,
    'section-9': 5,
    'section-10': 6,
    'section-11-1': 7,
    'section-11-2': 8,
    'section-14-1': 9,
    'section-14-2': 10,
    'section-14-4': 11,
    'section-16': 12
};

function formatShortPenalty(penalty) {
    if (penalty.includes("6 เดือน")) return "⚖️ โทษ: คุกไม่เกิน 6 เดือน / ปรับ 10,000 บ.";
    if (penalty.includes("1 ปี")) return "⚖️ โทษ: คุกไม่เกิน 1 ปี / ปรับ 20,000 บ.";
    if (penalty.includes("2 ปี")) return "⚖️ โทษ: คุกไม่เกิน 2 ปี / ปรับ 40,000 บ.";
    if (penalty.includes("3 ปี")) return "⚖️ โทษ: คุกไม่เกิน 3 ปี / ปรับ 20,000 บ.";
    if (penalty.includes("200,000")) return "⚖️ โทษ: ปรับปกครองไม่เกิน 200,000 บ.";
    if (penalty.includes("100,000") && penalty.includes("ปกครอง")) return "⚖️ โทษ: ปรับปกครองไม่เกิน 100,000 บ.";
    return "⚖️ โทษ: คุกไม่เกิน 5 ปี / ปรับ 100,000 บ.";
}

function getSanitizedEasyExplain(explain, isRevealed) {
    if (isRevealed) return explain;
    return explain
        .replace(/ผิดกฎหมายมาตรา\s*[\d\(\)]+/g, 'ผิดกฎหมาย')
        .replace(/ผิดมาตรา\s*[\d\(\)]+/g, 'ผิดกฎหมาย')
        .replace(/โดนคุกสูงสุด[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!')
        .replace(/โดนจำคุก[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!')
        .replace(/โทษคุกถึง[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!')
        .replace(/มีโทษจำคุก[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!')
        .replace(/มีโทษปรับ[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!')
        .replace(/โดนปรับอ่วม[^!]*!/g, 'ถือเป็นความผิดกฎหมาย!');
}

function openLawModal(lawId) {
    if (typeof cyberLawData === 'undefined') return;
    const law = cyberLawData.find(item => item.id === lawId);
    if (!law) return;

    activeLaw = law;
    const caseNum = caseNumberMap[law.id] || 1;
    
    // Fill section badge & title
    const modalBadge = document.getElementById('modal-section-badge');
    if (law.isRevealed) {
        modalBadge.textContent = law.section;
    } else {
        modalBadge.textContent = `🔒 คดีที่ ${caseNum}`;
    }
    document.getElementById('modal-title').textContent = law.title;

    const lawTextEl = document.getElementById('modal-law-text');
    if (lawTextEl) lawTextEl.textContent = law.lawText;

    document.getElementById('modal-penalty-text').textContent = law.penalty;
    document.getElementById('modal-easy-explain').textContent = getSanitizedEasyExplain(law.easyExplain, law.isRevealed);
    
    const remediationEl = document.getElementById('modal-remediation-content');
    if (remediationEl) remediationEl.textContent = law.remediation || "กรณีเกิดเหตุให้รีบเปลี่ยนรหัสผ่านและแจ้งเตือนผู้เกี่ยวข้องทันที";

    const preventionEl = document.getElementById('modal-prevention-content');
    if (preventionEl) preventionEl.textContent = law.prevention || "ตั้งรหัสผ่านที่ปลอดภัยและไม่วางเครื่องทิ้งไว้โดยไม่ล็อกหน้าจอ";

    // Fill comic image
    const imgEl = document.getElementById('modal-comic-img');
    if (imgEl) {
        imgEl.src = law.image;
        imgEl.alt = `${law.section}: ${law.title}`;
    }

    const imgLegalEl = document.getElementById('modal-comic-img-legal');
    if (imgLegalEl) {
        imgLegalEl.src = law.image;
        imgLegalEl.alt = `${law.section}: ${law.title}`;
    }

    // Reset legal reveal states inside Tab 2 according to law.isRevealed
    resetLegalRevealState();

    // Reset tab to overview
    switchModalTab('overview');

    // Show modal
    const modal = document.getElementById('law-modal');
    modal.classList.add('active');
    playSound('next');
}

function closeLawModal() {
    const modal = document.getElementById('law-modal');
    modal.classList.remove('active');
    playSound('prev');
}

function resetLegalRevealState() {
    const detailBoxes = document.querySelectorAll('#pane-legal .detail-box');
    if (activeLaw && activeLaw.isRevealed) {
        detailBoxes.forEach(box => box.classList.remove('is-hidden'));
    } else {
        detailBoxes.forEach(box => box.classList.add('is-hidden'));
    }
    updateRevealAllBtnState();
}

function revealDetailBox(boxEl) {
    if (boxEl && boxEl.classList.contains('is-hidden')) {
        boxEl.classList.remove('is-hidden');
        playSound('next');
        updateRevealAllBtnState();
    }
}

function toggleRevealAllLegal() {
    const detailBoxes = document.querySelectorAll('#pane-legal .detail-box');
    const hiddenBoxes = document.querySelectorAll('#pane-legal .detail-box.is-hidden');
    
    if (hiddenBoxes.length > 0) {
        // Reveal all!
        detailBoxes.forEach(box => box.classList.remove('is-hidden'));
        if (activeLaw) {
            activeLaw.isRevealed = true;
            revealLawCardAndHeader(activeLaw);
        }
        playSound('next');
    } else {
        // Hide all!
        detailBoxes.forEach(box => box.classList.add('is-hidden'));
        playSound('prev');
    }
    updateRevealAllBtnState();
}

function revealLawCardAndHeader(law) {
    // 1. Update Modal Header Badge
    const modalBadge = document.getElementById('modal-section-badge');
    if (modalBadge) modalBadge.textContent = law.section;

    // 2. Update Tab 1 Easy Explain to full text
    const easyExplainEl = document.getElementById('modal-easy-explain');
    if (easyExplainEl) easyExplainEl.textContent = law.easyExplain;

    // 3. Update Presentation Card on Slide 3 / Slide 4
    const cardBadge = document.getElementById(`card-badge-${law.id}`);
    if (cardBadge) cardBadge.textContent = law.section;

    const cardPenalty = document.getElementById(`card-penalty-${law.id}`);
    if (cardPenalty) cardPenalty.textContent = formatShortPenalty(law.penalty);

    const cardItem = document.getElementById(`card-${law.id}`);
    if (cardItem) cardItem.classList.add('is-revealed');

    // 4. Trigger Celebration Confetti & Neon Glow Pulse!
    triggerConfettiCelebration();
}

function triggerConfettiCelebration() {
    // 1. Modal pulse glow animation
    const modalCard = document.querySelector('.law-modal-card');
    if (modalCard) {
        modalCard.classList.remove('celebrate-glow');
        void modalCard.offsetWidth; // Force reflow
        modalCard.classList.add('celebrate-glow');
    }

    // 2. Confetti Particle Burst
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#38bdf8', '#facc15', '#f43f5e', '#a855f7', '#34d399', '#fb923c'];
    const particles = [];

    for (let i = 0; i < 45; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 3,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.75) * 18,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 12,
            opacity: 1
        });
    }

    let startTime = Date.now();
    function animate() {
        const elapsed = Date.now() - startTime;
        if (elapsed > 1600) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.45; // gravity
            p.rotation += p.vRot;
            p.opacity = Math.max(0, 1 - elapsed / 1600);

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

function updateRevealAllBtnState() {
    const btn = document.getElementById('reveal-all-legal-btn');
    if (!btn) return;
    const hiddenBoxes = document.querySelectorAll('#pane-legal .detail-box.is-hidden');
    if (hiddenBoxes.length === 0) {
        btn.innerHTML = `<i class="fa-solid fa-eye-slash"></i> ซ่อนเฉลยทั้งหมด`;
        if (activeLaw && !activeLaw.isRevealed) {
            activeLaw.isRevealed = true;
            revealLawCardAndHeader(activeLaw);
        }
    } else {
        btn.innerHTML = `<i class="fa-solid fa-eye"></i> เปิดเฉลยเนื้อหาทั้งหมด`;
    }
}

function switchModalTab(tabName) {
    const tabOverviewBtn = document.getElementById('tab-overview-btn');
    const tabLegalBtn = document.getElementById('tab-legal-btn');
    
    const paneOverview = document.getElementById('pane-overview');
    const paneLegal = document.getElementById('pane-legal');

    // Deactivate all
    [tabOverviewBtn, tabLegalBtn].forEach(b => b && b.classList.remove('active'));
    [paneOverview, paneLegal].forEach(p => p && p.classList.remove('active'));

    if (tabName === 'overview') {
        if (tabOverviewBtn) tabOverviewBtn.classList.add('active');
        if (paneOverview) paneOverview.classList.add('active');
    } else if (tabName === 'legal') {
        if (tabLegalBtn) tabLegalBtn.classList.add('active');
        if (paneLegal) paneLegal.classList.add('active');
    }
}

function triggerLightboxFromModal() {
    if (activeLaw && activeLaw.image) {
        openLightbox(activeLaw.image);
    }
}

function openLightbox(imgSrc) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imgSrc;
    lightbox.classList.add('active');
    playSound('next');
}

function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    lightbox.classList.remove('active');
    playSound('prev');
}

// Quick 12-Law Navigation
function openQuickNav() {
    if (typeof cyberLawData === 'undefined') return;
    const container = document.getElementById('quick-laws-container');
    container.innerHTML = cyberLawData.map(law => `
        <div class="quick-law-card" onclick="closeQuickNav(); openLawModal('${law.id}');">
            <div class="quick-law-num">${law.section}</div>
            <div class="quick-law-title">${law.title}</div>
        </div>
    `).join('');

    const modal = document.getElementById('quick-nav-modal');
    modal.classList.add('active');
    playSound('next');
}

function closeQuickNav() {
    const modal = document.getElementById('quick-nav-modal');
    modal.classList.remove('active');
    playSound('prev');
}

function toggleSound() {
    sfxBtn.click();
}

function toggleFullscreen() {
    fullscreenBtn.click();
}

// Extra presenter shortcuts that do not duplicate slide navigation.
document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleSound();
    } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
    }
});
