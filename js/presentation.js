let currentSlide = 0;
const totalSlides = 8;
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

const dotsContainer = document.getElementById('dots-container');
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

function updateSlideView() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const hpBar = document.getElementById('hp-bar');
    const stageText = document.getElementById('stage-text');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

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
    hpBar.style.width = `${progressPercent}%`;
    stageText.textContent = `STAGE ${currentSlide + 1} / ${totalSlides}`;

    prevBtn.disabled = currentSlide === 0;
    if (currentSlide === totalSlides - 1) {
        nextBtn.innerHTML = `COMPLETE <i class="fa-solid fa-flag-checkered"></i>`;
    } else {
        nextBtn.innerHTML = `NEXT (ต่อไป) <i class="fa-solid fa-chevron-right"></i>`;
    }
}

function nextSlide() {
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
    if (index >= 0 && index < totalSlides && index !== currentSlide) {
        const dir = index > currentSlide ? 'next' : 'prev';
        currentSlide = index;
        playSound(dir);
        updateSlideView();
    }
}

document.addEventListener('keydown', (e) => {
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
