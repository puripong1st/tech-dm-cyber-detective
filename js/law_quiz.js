(() => {
  const STORAGE_KEY = 'law-quiz-active-attempt-v1';
  const state = { attempt: null, questions: [], answers: {}, result: null };
  const $ = id => document.getElementById(id);
  const safe = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));
  const bloomLabel = { understand: 'ความเข้าใจ', apply: 'ประยุกต์ใช้', analyze: 'วิเคราะห์' };

  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.remove('hidden'); setTimeout(() => el.classList.add('hidden'), 5000); }
  function save() { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  function clearSaved() { sessionStorage.removeItem(STORAGE_KEY); }
  function studentName(attempt) { return `${attempt.prefix}${attempt.first_name} ${attempt.last_name} · เลขที่ ${attempt.student_no} · ${attempt.room}`; }

  function renderRooms() {
    $('room').insertAdjacentHTML('beforeend', Array.from({ length: 15 }, (_, i) => `<option value="ม.3/${i + 1}">ม.3/${i + 1}</option>`).join(''));
  }
  function renderQuiz() {
    $('register-view').classList.add('hidden'); $('result-view').classList.add('hidden'); $('quiz-view').classList.remove('hidden');
    $('student-label').textContent = studentName(state.attempt);
    $('quiz-form').innerHTML = state.questions.map((q, index) => `<article class="question-card"><div class="question-meta"><span class="badge ${q.bloom}">${safe(bloomLabel[q.bloom])}</span><span>${safe(q.topic)} · ข้อ ${index + 1}</span></div><h3 class="question-title">${safe(q.question)}</h3><div class="options">${q.options.map((option, optionIndex) => { const key = String.fromCharCode(65 + optionIndex); return `<label class="option"><input type="radio" name="question-${safe(q.id)}" value="${key}" ${state.answers[q.id] === key ? 'checked' : ''}><span><span class="option-key">${key}.</span> ${safe(option)}</span></label>`; }).join('')}</div></article>`).join('');
    $('quiz-form').onchange = event => { if (event.target.matches('input[type=radio]')) { state.answers[event.target.name.replace('question-', '')] = event.target.value; save(); updateProgress(); } };
    updateProgress(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function updateProgress() { const done = Object.keys(state.answers).length; $('progress-text').textContent = `${done} / 10`; $('progress-bar').style.width = `${done * 10}%`; }
  function renderResult() {
    const report = state.result; const attempt = report;
    $('register-view').classList.add('hidden'); $('quiz-view').classList.add('hidden'); $('result-view').classList.remove('hidden');
    $('result-student').textContent = studentName(attempt); $('result-score').textContent = attempt.score;
    const counts = { understand: 0, apply: 0, analyze: 0 }; const totals = { understand: 0, apply: 0, analyze: 0 };
    attempt.results.forEach(result => { totals[result.bloom] += 1; if (result.isCorrect) counts[result.bloom] += 1; });
    $('result-summary').innerHTML = Object.keys(counts).map(key => `<div><b>${counts[key]} / ${totals[key]}</b><span>${bloomLabel[key]}</span></div>`).join('');
    $('result-list').innerHTML = attempt.results.map((result, index) => { const choiceText = result.selectedOption ? result.options[result.selectedOption.charCodeAt(0) - 65] : 'ไม่ได้ตอบ'; const correctText = result.options[result.correctOption.charCodeAt(0) - 65]; return `<article class="result-item ${result.isCorrect ? 'correct' : 'wrong'}"><h3>ข้อ ${index + 1}. ${safe(result.question)} ${result.isCorrect ? '✓' : '✕'}</h3><div class="answer-row"><span>คำตอบของคุณ: <b>${safe(result.selectedOption || '–')}. ${safe(choiceText)}</b></span><span>คำตอบที่ถูก: <b>${safe(result.correctOption)}. ${safe(correctText)}</b></span></div><p class="explanation">${safe(result.explanation)}</p></article>`; }).join('');
    clearSaved(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $('register-form').addEventListener('submit', async event => {
    event.preventDefault();
    const button = event.submitter; button.disabled = true; button.textContent = 'กำลังสร้างข้อสอบ…';
    try {
      const response = await fetch('/api/law-quiz/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prefix: $('prefix').value, firstName: $('first-name').value, lastName: $('last-name').value, studentNo: $('student-no').value, room: $('room').value }) });
      const payload = await response.json(); if (!response.ok || !payload.success) throw new Error(payload.message || 'ไม่สามารถเริ่มแบบทดสอบได้');
      state.attempt = payload.attempt; state.questions = payload.questions; state.answers = {}; state.result = null; save(); renderQuiz();
    } catch (error) { toast(error.message); } finally { button.disabled = false; button.innerHTML = 'เริ่มทำแบบทดสอบ <span>→</span>'; }
  });

  $('submit-quiz').addEventListener('click', async () => {
    if (Object.keys(state.answers).length < state.questions.length) return toast('กรุณาตอบคำถามให้ครบทั้ง 10 ข้อก่อนส่ง');
    if (!confirm('ยืนยันส่งคำตอบ? เมื่อส่งแล้วจะไม่สามารถแก้ไขได้')) return;
    const button = $('submit-quiz'); button.disabled = true; button.textContent = 'กำลังตรวจคำตอบ…';
    try {
      const response = await fetch('/api/law-quiz/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ attemptId: state.attempt.id, answers: state.answers }) });
      const payload = await response.json(); if (!response.ok || !payload.success) throw new Error(payload.message || 'ส่งคำตอบไม่สำเร็จ');
      state.result = payload.attempt; renderResult();
    } catch (error) { toast(error.message); button.disabled = false; button.textContent = 'ส่งคำตอบและดูคะแนน'; }
  });

  renderRooms();
  try { const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY)); if (saved?.attempt && Array.isArray(saved.questions)) { Object.assign(state, saved); renderQuiz(); } } catch (_) { clearSaved(); }
})();
