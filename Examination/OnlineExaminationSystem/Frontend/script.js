// Global Configuration
const API_BASE = 'http://127.0.0.1:8000';

// Initialize and Setup page on Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  setupNavbar();
  routePageLogic();
});

// --- TOAST SYSTEM ---
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = 'toast'; // Reset
  toast.classList.add(type, 'active');
  
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4000);
}

// --- THEME MANAGEMENT ---
function initTheme() {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;
  
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// --- AUTHENTICATION & NAVBAR CONTROL ---
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

function setupNavbar() {
  const user = getCurrentUser();
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const studentDash = document.getElementById('student-dash-nav');
  const adminDash = document.getElementById('admin-dash-nav');
  
  // Show dashboards based on role
  if (user) {
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = user.full_name || 'User';
    
    if (user.role === 'admin') {
      if (adminDash) adminDash.style.display = 'block';
    } else {
      if (studentDash) studentDash.style.display = 'block';
    }
  } else {
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    if (studentDash) studentDash.style.display = 'none';
    if (adminDash) adminDash.style.display = 'none';
  }
  
  // Setup logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('activeExamState'); // Clean ongoing exam
      showToast('Logged out successfully.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
}

// --- DYNAMIC PAGE ROUTING ---
function routePageLogic() {
  const path = window.location.pathname;
  const page = path.substring(path.lastIndexOf('/') + 1);
  
  if (page === 'index.html' || page === '') {
    initLandingPage();
  } else if (page === 'login.html') {
    initLoginPage();
  } else if (page === 'register.html') {
    initRegisterPage();
  } else if (page === 'exams.html') {
    initExamsCataloguePage();
  } else if (page === 'exam.html') {
    initActiveExamPage();
  } else if (page === 'results.html') {
    initResultsPage();
  } else if (page === 'student_dashboard.html') {
    initStudentDashboardPage();
  } else if (page === 'admin_dashboard.html') {
    initAdminDashboardPage();
  }
}

// --- 1. LANDING PAGE ---
async function initLandingPage() {
  const container = document.getElementById('featured-exams-list');
  if (!container) return;
  
  try {
    const res = await fetch(`${API_BASE}/exams/`);
    if (!res.ok) throw new Error('Failed to retrieve exams');
    const exams = await res.json();
    
    if (exams.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 2rem;">No examinations are currently scheduled.</div>`;
      return;
    }
    
    // Take top 3 for featured
    const featured = exams.slice(0, 3);
    container.innerHTML = featured.map(exam => `
      <div class="card">
        <div class="card-header">
          <span class="subject-badge">${escapeHTML(exam.subject)}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHTML(exam.exam_date)}</span>
        </div>
        <h3 class="card-title">${escapeHTML(exam.exam_title)}</h3>
        <div class="card-meta">
          <div class="meta-item">⏱️ <span>${exam.duration} Min</span></div>
          <div class="meta-item">🎯 <span>${exam.total_marks} Marks</span></div>
        </div>
        <button class="btn btn-primary card-action" onclick="attemptExam('${escapeURIComponent(exam.exam_title)}')">Start Assessment</button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error(error);
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--error); padding: 2rem;">Failed to load featured examinations. Ensure the backend server is running.</div>`;
  }
}

// Global hook to launch exam from index/exams cards
function attemptExam(examTitleEsced) {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please login as a student to participate in examinations.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }
  if (user.role === 'admin') {
    showToast('Administrators cannot sit for student examinations.', 'error');
    return;
  }
  window.location.href = `exam.html?title=${examTitleEsced}`;
}

// --- 2. LOGIN PAGE ---
function initLoginPage() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = user.role === 'admin' ? 'admin_dashboard.html' : 'student_dashboard.html';
    return;
  }
  
  const studentTab = document.getElementById('student-tab');
  const adminTab = document.getElementById('admin-tab');
  const roleInput = document.getElementById('login-role');
  const loginTitle = document.getElementById('login-title');
  const loginSubtitle = document.getElementById('login-subtitle');
  const redirectDiv = document.getElementById('register-redirect');
  const loginForm = document.getElementById('login-form');
  
  if (!loginForm) return;
  
  studentTab.addEventListener('click', () => {
    studentTab.classList.add('active');
    adminTab.classList.remove('active');
    roleInput.value = 'student';
    loginTitle.textContent = 'Student Login';
    loginSubtitle.textContent = 'Access your personal dashboard and examinations';
    if (redirectDiv) redirectDiv.style.display = 'block';
  });
  
  adminTab.addEventListener('click', () => {
    adminTab.classList.add('active');
    studentTab.classList.remove('active');
    roleInput.value = 'admin';
    loginTitle.textContent = 'Administrator Login';
    loginSubtitle.textContent = 'Control portal configurations, questions & evaluate results';
    if (redirectDiv) redirectDiv.style.display = 'none';
  });
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const role = roleInput.value;
    
    try {
      const res = await fetch(`${API_BASE}/students/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      const resData = await res.json();
      if (!res.ok) {
        showToast(resData.error || 'Authentication failed', 'error');
        return;
      }
      
      showToast('Logged in successfully!');
      localStorage.setItem('currentUser', JSON.stringify({
        student_id: resData.user.student_id || null,
        full_name: resData.user.full_name,
        email: resData.user.email,
        college: resData.user.college || null,
        role: resData.role
      }));
      
      setTimeout(() => {
        window.location.href = resData.role === 'admin' ? 'admin_dashboard.html' : 'student_dashboard.html';
      }, 1000);
      
    } catch (err) {
      console.error(err);
      showToast('Connection to login server failed.', 'error');
    }
  });
}

// --- 3. REGISTER PAGE ---
function initRegisterPage() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = user.role === 'admin' ? 'admin_dashboard.html' : 'student_dashboard.html';
    return;
  }
  
  const form = document.getElementById('register-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const student_id = document.getElementById('reg-id').value ? parseInt(document.getElementById('reg-id').value) : null;
    const full_name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    const password = document.getElementById('reg-password').value;
    
    const payload = { full_name, email, phone, college, password };
    if (student_id) payload.student_id = student_id;
    
    try {
      const res = await fetch(`${API_BASE}/students/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Registration failed', 'error');
        return;
      }
      
      showToast('Registration successful! Please login.');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500);
      
    } catch (err) {
      console.error(err);
      showToast('Failed to connect to registration backend.', 'error');
    }
  });
}

// --- 4. EXAMS CATALOGUE ---
async function initExamsCataloguePage() {
  const container = document.getElementById('exams-container');
  const searchInput = document.getElementById('exam-search');
  if (!container) return;
  
  let allExams = [];
  
  async function fetchAndRender() {
    try {
      const res = await fetch(`${API_BASE}/exams/`);
      if (!res.ok) throw new Error('API fetch error');
      allExams = await res.json();
      renderExams(allExams);
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--error); padding: 3rem;">Failed to load examinations. Check database connection.</div>`;
    }
  }
  
  function renderExams(list) {
    if (list.length === 0) {
      container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 3rem;">No examinations match the criteria.</div>`;
      return;
    }
    
    container.innerHTML = list.map(exam => `
      <div class="card">
        <div class="card-header">
          <span class="subject-badge">${escapeHTML(exam.subject)}</span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">📅 ${escapeHTML(exam.exam_date)}</span>
        </div>
        <h3 class="card-title">${escapeHTML(exam.exam_title)}</h3>
        <div class="card-meta">
          <div class="meta-item">⏱️ Duration: <strong>${exam.duration} Min</strong></div>
          <div class="meta-item">🎯 Marks: <strong>${exam.total_marks}</strong></div>
        </div>
        <button class="btn btn-primary card-action" onclick="attemptExam('${escapeURIComponent(exam.exam_title)}')">Start Exam</button>
      </div>
    `).join('');
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allExams.filter(exam => 
        exam.exam_title.toLowerCase().includes(query) || 
        exam.subject.toLowerCase().includes(query)
      );
      renderExams(filtered);
    });
  }
  
  await fetchAndRender();
}

// --- 5. ACTIVE EXAMINATION SYSTEM ---
let examQuestions = [];
let activeQIndex = 0;
let answeredQuestions = {}; // question_id -> option_char
let examDurationSec = 0;
let examTimerInterval = null;
let currentExamTitle = '';

async function initActiveExamPage() {
  // Authentication check
  const user = getCurrentUser();
  if (!user || user.role === 'admin') {
    showToast('Unauthorized access. Access restricted to students.', 'error');
    window.location.href = 'login.html';
    return;
  }
  
  const urlParams = new URLSearchParams(window.location.search);
  const examTitle = urlParams.get('title');
  if (!examTitle) {
    showToast('No exam title specified.', 'error');
    window.location.href = 'exams.html';
    return;
  }
  
  currentExamTitle = decodeURIComponent(examTitle);
  document.getElementById('exam-title-display').textContent = currentExamTitle;
  
  // Set up elements
  const prevBtn = document.getElementById('prev-question-btn');
  const nextBtn = document.getElementById('next-question-btn');
  const submitBtn = document.getElementById('submit-exam-btn');
  const cancelSubmit = document.getElementById('cancel-submit-btn');
  const confirmSubmit = document.getElementById('confirm-submit-btn');
  const closeSubmit = document.getElementById('close-submit-modal-btn');
  
  // Action Handlers
  if (prevBtn) prevBtn.addEventListener('click', navigatePrev);
  if (nextBtn) nextBtn.addEventListener('click', navigateNext);
  
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      // Check for unanswered questions warning
      const warn = document.getElementById('unanswered-warning');
      const totalQs = examQuestions.length;
      const ansQs = Object.keys(answeredQuestions).length;
      
      if (warn) {
        warn.style.display = ansQs < totalQs ? 'block' : 'none';
      }
      openModal('submit-confirm-modal');
    });
  }
  
  if (cancelSubmit) cancelSubmit.addEventListener('click', () => closeModal('submit-confirm-modal'));
  if (closeSubmit) closeSubmit.addEventListener('click', () => closeModal('submit-confirm-modal'));
  if (confirmSubmit) confirmSubmit.addEventListener('click', async () => {
    closeModal('submit-confirm-modal');
    await submitActiveExam();
  });
  
  // Retrieve exam details and questions
  try {
    // 1. Fetch Exam Meta to get duration
    const examsRes = await fetch(`${API_BASE}/exams/`);
    const exams = await examsRes.json();
    const matchedExam = exams.find(e => e.exam_title === currentExamTitle);
    
    if (!matchedExam) {
      showToast('Exam could not be located in database.', 'error');
      window.location.href = 'exams.html';
      return;
    }
    
    examDurationSec = matchedExam.duration * 60;
    
    // 2. Fetch Questions
    const questionsRes = await fetch(`${API_BASE}/questions/?exam_title=${encodeURIComponent(currentExamTitle)}`);
    examQuestions = await questionsRes.json();
    
    if (examQuestions.length === 0) {
      document.getElementById('active-question-text').innerHTML = `
        <span style="color: var(--error);">No questions are mapped for this exam in the database. Contact the portal administrator.</span>
      `;
      return;
    }
    
    // Bonus Feature: Shuffled Question Sequence
    shuffleArray(examQuestions);
    
    // Setup timer persistence so refresh does not restart
    const stateKey = `exam_state_${user.email}_${matchedExam.exam_id}`;
    let savedState = localStorage.getItem(stateKey);
    let startTimestamp = Date.now();
    
    if (savedState) {
      const parsed = JSON.parse(savedState);
      startTimestamp = parsed.startTimestamp;
      answeredQuestions = parsed.answeredQuestions || {};
      activeQIndex = parsed.activeQIndex || 0;
    } else {
      localStorage.setItem(stateKey, JSON.stringify({
        startTimestamp,
        answeredQuestions,
        activeQIndex
      }));
    }
    
    // Calculate remaining seconds
    const elapsedSec = Math.floor((Date.now() - startTimestamp) / 1000);
    let remainingSec = examDurationSec - elapsedSec;
    
    if (remainingSec <= 0) {
      showToast('This exam session time limit has already expired.', 'error');
      // Remove cached state
      localStorage.removeItem(stateKey);
      window.location.href = 'exams.html';
      return;
    }
    
    startExamTimer(remainingSec, stateKey);
    renderQuestion();
    renderPalette();
    
  } catch (err) {
    console.error(err);
    showToast('Failed to load active exam configurations.', 'error');
  }
}

// Shuffle implementation
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startExamTimer(secondsLeft, stateKey) {
  const display = document.getElementById('timer-display');
  const timerBox = document.getElementById('countdown-timer');
  let remaining = secondsLeft;
  
  function updateDisplay() {
    if (remaining <= 0) {
      clearInterval(examTimerInterval);
      display.textContent = '00:00:00';
      if (timerBox) timerBox.classList.add('timer-warn');
      showToast('Time has expired! Submitting answers automatically...', 'error');
      setTimeout(() => {
        submitActiveExam(stateKey);
      }, 1500);
      return;
    }
    
    const h = Math.floor(remaining / 3600).toString().padStart(2, '0');
    const m = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
    const s = (remaining % 60).toString().padStart(2, '0');
    display.textContent = `${h}:${m}:${s}`;
    
    if (remaining < 60) {
      if (timerBox) timerBox.classList.add('timer-warn');
    }
    remaining--;
  }
  
  updateDisplay();
  examTimerInterval = setInterval(updateDisplay, 1000);
}

function renderQuestion() {
  if (examQuestions.length === 0) return;
  const q = examQuestions[activeQIndex];
  
  // Set labels
  document.getElementById('question-index-label').textContent = `Question ${activeQIndex + 1} of ${examQuestions.length}`;
  document.getElementById('question-marks-label').textContent = `Marks: ${q.marks}`;
  
  document.getElementById('active-question-text').textContent = q.question;
  
  const optionsWrapper = document.getElementById('active-options-container');
  optionsWrapper.innerHTML = '';
  
  // Option identifiers
  const opts = [
    { key: 'A', text: q.option_a },
    { key: 'B', text: q.option_b },
    { key: 'C', text: q.option_c },
    { key: 'D', text: q.option_d }
  ];
  
  const selectedOpt = answeredQuestions[q.question_id];
  
  opts.forEach(opt => {
    const isSelected = selectedOpt === opt.key;
    const card = document.createElement('div');
    card.className = `option-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="option-indicator">${opt.key}</div>
      <div class="option-text">${escapeHTML(opt.text)}</div>
    `;
    card.addEventListener('click', () => selectAnswer(q.question_id, opt.key));
    optionsWrapper.appendChild(card);
  });
  
  // Nav buttons
  document.getElementById('prev-question-btn').disabled = activeQIndex === 0;
  
  const nextBtn = document.getElementById('next-question-btn');
  if (activeQIndex === examQuestions.length - 1) {
    nextBtn.textContent = 'Review Submit';
    nextBtn.classList.remove('btn-primary');
    nextBtn.classList.add('btn-danger');
  } else {
    nextBtn.textContent = 'Next';
    nextBtn.classList.remove('btn-danger');
    nextBtn.classList.add('btn-primary');
  }
}

function renderPalette() {
  const grid = document.getElementById('question-palette-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  examQuestions.forEach((q, idx) => {
    const numBtn = document.createElement('div');
    numBtn.className = 'grid-num';
    
    if (idx === activeQIndex) {
      numBtn.classList.add('active');
    } else if (answeredQuestions[q.question_id]) {
      numBtn.classList.add('answered');
    }
    
    numBtn.textContent = idx + 1;
    numBtn.addEventListener('click', () => {
      activeQIndex = idx;
      renderQuestion();
      renderPalette();
    });
    grid.appendChild(numBtn);
  });
}

function selectAnswer(questionId, val) {
  answeredQuestions[questionId] = val;
  
  // Persist current draft answers to localStorage
  const user = getCurrentUser();
  const stateKey = getActiveStateKey();
  if (stateKey) {
    const stateObj = JSON.parse(localStorage.getItem(stateKey));
    if (stateObj) {
      stateObj.answeredQuestions = answeredQuestions;
      stateObj.activeQIndex = activeQIndex;
      localStorage.setItem(stateKey, JSON.stringify(stateObj));
    }
  }
  
  renderQuestion();
  renderPalette();
}

function getActiveStateKey() {
  const user = getCurrentUser();
  // Parse title from query parameter to match init
  const urlParams = new URLSearchParams(window.location.search);
  const examTitle = urlParams.get('title');
  if (!user || !examTitle) return null;
  return `exam_state_${user.email}_${decodeURIComponent(examTitle)}`;
}

function navigatePrev() {
  if (activeQIndex > 0) {
    activeQIndex--;
    renderQuestion();
    renderPalette();
  }
}

function navigateNext() {
  if (activeQIndex < examQuestions.length - 1) {
    activeQIndex++;
    renderQuestion();
    renderPalette();
  } else {
    // Review Submit clicked
    document.getElementById('submit-exam-btn').click();
  }
}

async function submitActiveExam(stateKeyInput = null) {
  clearInterval(examTimerInterval);
  const user = getCurrentUser();
  const stateKey = stateKeyInput || getActiveStateKey();
  
  // Format answers: "Q301:def,Q302:list" -> key is the actual answer text (or option indicator text)
  // Let's format exactly as specified: "Q301:correct_ans,..."
  // Wait, correct format for payload in DB schema:
  // "Q1:def,Q2:list,Q3:tuple" (corresponds to sequential indices and selected option values)
  // Let's create an answer string mapping sequential question numbers to selected options
  let submittedAnswersParts = [];
  
  examQuestions.forEach((q, index) => {
    const selOptionKey = answeredQuestions[q.question_id];
    let selText = '';
    if (selOptionKey === 'A') selText = q.option_a;
    else if (selOptionKey === 'B') selText = q.option_b;
    else if (selOptionKey === 'C') selText = q.option_c;
    else if (selOptionKey === 'D') selText = q.option_d;
    
    // If no option was selected, record blank
    if (!selOptionKey) selText = 'No Answer';
    
    submittedAnswersParts.push(`Q${index + 1}:${selText}`);
  });
  
  const answersString = submittedAnswersParts.join(',');
  
  const payload = {
    student_name: user.full_name,
    exam_title: currentExamTitle,
    submitted_answers: answersString,
    submitted_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  
  try {
    const res = await fetch(`${API_BASE}/submissions/add/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const resData = await res.json();
    if (!res.ok) {
      showToast(resData.error || 'Submission failed.', 'error');
      return;
    }
    
    // Clear persistence keys
    if (stateKey) localStorage.removeItem(stateKey);
    
    showToast('Exam submitted successfully! Redirecting to results...');
    
    // Cache latest result details for display
    localStorage.setItem('latestExamResult', JSON.stringify({
      student_name: user.full_name,
      exam_title: currentExamTitle,
      total_marks: resData.score !== undefined ? Math.round((resData.score / (resData.percentage || 1)) * 100) : 100, // Safe estimate
      obtained_marks: resData.score,
      percentage: resData.percentage,
      result_status: resData.result_status,
      result_id: resData.result_id
    }));
    
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 1500);
    
  } catch (err) {
    console.error(err);
    showToast('Failed to communicate submission. Attempting backup cache...', 'error');
  }
}

// --- 6. RESULTS PAGE ---
function initResultsPage() {
  const resDataStr = localStorage.getItem('latestExamResult');
  if (!resDataStr) {
    showToast('No exam result could be referenced.', 'error');
    window.location.href = 'student_dashboard.html';
    return;
  }
  
  const resData = JSON.parse(resDataStr);
  
  // Set details
  document.getElementById('res-exam-title').textContent = resData.exam_title;
  document.getElementById('res-student-name').textContent = resData.student_name;
  document.getElementById('res-total-marks').textContent = resData.total_marks || 100;
  document.getElementById('res-obtained-marks').textContent = resData.obtained_marks;
  document.getElementById('res-percentage').textContent = `${resData.percentage}%`;
  document.getElementById('res-verification-id').textContent = `EX-${resData.result_id || 'TEMP'}`;
  
  // Configure Circular Progress Gauge
  const circularProgress = document.getElementById('score-circular-progress');
  const progressValue = document.getElementById('score-percentage-value');
  const statusBadge = document.getElementById('score-status-badge');
  
  let percentageValue = resData.percentage || 0;
  progressValue.textContent = `${percentageValue}%`;
  
  // Draw conic gradient representing the score
  const degrees = (percentageValue / 100) * 360;
  circularProgress.style.background = `conic-gradient(var(--primary) ${degrees}deg, var(--bg-secondary) ${degrees}deg)`;
  
  // Status Class configurations
  if (resData.result_status === 'Pass') {
    statusBadge.textContent = 'PASS';
    statusBadge.className = 'result-status-badge pass';
  } else {
    statusBadge.textContent = 'FAIL';
    statusBadge.className = 'result-status-badge fail';
  }
  
  // Button Actions
  document.getElementById('return-dash-btn').addEventListener('click', () => {
    localStorage.removeItem('latestExamResult'); // clean up
    window.location.href = 'student_dashboard.html';
  });
  
  document.getElementById('download-result-pdf-btn').addEventListener('click', () => {
    const cardElement = document.getElementById('result-print-card');
    
    // Configuration for html2pdf
    const options = {
      margin:       0.5,
      filename:     `Score_Report_${resData.student_name.replace(/\s+/g, '_')}_${resData.exam_title.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0f172a' }, // Slate primary bg
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(options).from(cardElement).save();
  });
}

// --- 7. STUDENT DASHBOARD PAGE ---
async function initStudentDashboardPage() {
  const user = getCurrentUser();
  if (!user || user.role === 'admin') {
    window.location.href = 'login.html';
    return;
  }
  
  // Set welcoming string
  document.getElementById('welcome-message').textContent = `Welcome back, ${user.full_name}!`;
  
  try {
    // 1. Fetch available exams to determine Pending count
    const examsRes = await fetch(`${API_BASE}/exams/`);
    const exams = await examsRes.json();
    
    // 2. Fetch results for this student
    const resultsRes = await fetch(`${API_BASE}/results/?student_name=${encodeURIComponent(user.full_name)}`);
    const results = await resultsRes.json();
    
    // Populate stats
    const totalExams = exams.length;
    const completedExams = results.length;
    const pendingExams = totalExams - completedExams;
    
    document.getElementById('stat-registered').textContent = totalExams;
    document.getElementById('stat-completed').textContent = completedExams;
    document.getElementById('stat-pending').textContent = pendingExams < 0 ? 0 : pendingExams;
    
    // Populate table rows
    const resultsBody = document.getElementById('student-results-rows');
    if (results.length === 0) {
      resultsBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-secondary); padding: 2rem;">You have not completed any examinations yet.</td></tr>`;
    } else {
      resultsBody.innerHTML = results.map(res => `
        <tr>
          <td style="font-weight: 600;">${escapeHTML(res.exam_title)}</td>
          <td>${res.obtained_marks} / ${res.total_marks}</td>
          <td>${res.percentage}%</td>
          <td>
            <span class="subject-badge" style="background-color: ${res.result_status === 'Pass' ? 'var(--success-light)' : 'var(--error-light)'}; color: ${res.result_status === 'Pass' ? 'var(--success)' : 'var(--error)'}; border-color: ${res.result_status === 'Pass' ? 'var(--success)' : 'var(--error)'};">
              ${res.result_status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="reviewResult('${escapeURIComponent(JSON.stringify(res))}')">View Details</button>
          </td>
        </tr>
      `).join('');
    }
    
    // Load leaderboard
    initLeaderboard(exams);
    
  } catch (err) {
    console.error(err);
    showToast('Failed to load student dashboard statistics.', 'error');
  }
}

// View details helper on dashboard table
function reviewResult(jsonEsced) {
  const resObj = JSON.parse(decodeURIComponent(jsonEsced));
  localStorage.setItem('latestExamResult', JSON.stringify(resObj));
  window.location.href = 'results.html';
}

// Leaderboard implementation
async function initLeaderboard(examsList) {
  const select = document.getElementById('leaderboard-exam-filter');
  const container = document.getElementById('leaderboard-container');
  if (!select || !container) return;
  
  // Fill dropdown selector with exam titles
  select.innerHTML = '<option value="">All Examinations</option>' + examsList.map(e => `
    <option value="${escapeHTML(e.exam_title)}">${escapeHTML(e.exam_title)}</option>
  `).join('');
  
  async function fetchAndRenderLeaderboard() {
    try {
      const selectedExam = select.value;
      let url = `${API_BASE}/results/`;
      if (selectedExam) {
        url += `?exam_title=${encodeURIComponent(selectedExam)}`;
      }
      
      const res = await fetch(url);
      const results = await res.json();
      
      // Sort results by percentage desc, obtained_marks desc, student_name asc
      results.sort((a, b) => {
        if (b.percentage !== a.percentage) return b.percentage - a.percentage;
        return b.obtained_marks - a.obtained_marks;
      });
      
      // Group by student_name to get their highest score in the filtered exam to avoid duplicates
      const uniqueTopScores = [];
      const seenStudents = new Set();
      
      results.forEach(item => {
        const key = `${item.student_name}_${item.exam_title}`;
        if (!seenStudents.has(key)) {
          seenStudents.add(key);
          uniqueTopScores.push(item);
        }
      });
      
      // Take top 5 entries
      const top5 = uniqueTopScores.slice(0, 5);
      
      if (top5.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); font-size: 0.85rem; padding: 2rem 0;">No test results available.</div>`;
        return;
      }
      
      // Icons for top ranks
      const rankMedals = { 1: '🥇', 2: '🥈', 3: '🥉' };
      
      container.innerHTML = top5.map((item, idx) => {
        const rank = idx + 1;
        const rankDisp = rankMedals[rank] || `${rank}.`;
        return `
          <div class="leaderboard-item">
            <div class="leaderboard-rank">${rankDisp}</div>
            <div class="leaderboard-user">
              <h4>${escapeHTML(item.student_name)}</h4>
              <p>${escapeHTML(item.exam_title)}</p>
            </div>
            <div class="leaderboard-score">${item.percentage}%</div>
          </div>
        `;
      }).join('');
      
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div style="text-align: center; color: var(--error); font-size: 0.85rem; padding: 2rem 0;">Leaderboard fetch failure.</div>`;
    }
  }
  
  select.addEventListener('change', fetchAndRenderLeaderboard);
  await fetchAndRenderLeaderboard();
}

// --- 8. ADMINISTRATOR PORTAL CONTROLLERS ---
let activePanel = 'students';
let examsCacheList = []; // useful for selecting foreign relations in modal questions
let studentsCacheList = [];
let deleteTargetId = null;

function initAdminDashboardPage() {
  // Auth enforcement
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    showToast('Access restricted to administrators.', 'error');
    window.location.href = 'login.html';
    return;
  }
  
  // Set up click handlers for sidebar links
  const menus = [
    { id: 'menu-students', key: 'students', title: 'Students Directory', subtitle: 'Review, update, and manage student registration records' },
    { id: 'menu-exams', key: 'exams', title: 'Examinations Center', subtitle: 'Design exams, set durations, subjects, and view scheduled assessments' },
    { id: 'menu-questions', key: 'questions', title: 'Questions Database', subtitle: 'Add multiple choice questionnaire segments to assessments' },
    { id: 'menu-submissions', key: 'submissions', title: 'Student Submissions', subtitle: 'Inspect student exam paper answer sheets and evaluated grades' },
    { id: 'menu-results', key: 'results', title: 'Grading Records', subtitle: 'Review final score cards, status and manually edit/remove records' }
  ];
  
  menus.forEach(menu => {
    const el = document.getElementById(menu.id);
    if (el) {
      el.addEventListener('click', () => {
        // Toggle active menu class
        menus.forEach(m => document.getElementById(m.id).classList.remove('active'));
        el.classList.add('active');
        
        activePanel = menu.key;
        document.getElementById('admin-panel-title').textContent = menu.title;
        document.getElementById('admin-panel-subtitle').textContent = menu.subtitle;
        
        loadPanelData();
      });
    }
  });
  
  // Register click for Global Add New Button
  const addBtn = document.getElementById('admin-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      openCreateModal();
    });
  }
  
  // Register Form submits
  setupFormSubmits();
  
  // Register Confirm Delete Action
  const deleteBtn = document.getElementById('confirm-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteActiveRecord);
  }
  
  // First load
  loadPanelData();
}

async function loadPanelData() {
  const tHeaders = document.getElementById('admin-table-headers');
  const tRows = document.getElementById('admin-table-rows');
  const statsRow = document.getElementById('admin-stats-row');
  
  tRows.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-secondary); padding: 2.5rem;">Loading active datasets...</td></tr>`;
  
  try {
    // Refresh caches for drop-downs
    const examsRes = await fetch(`${API_BASE}/exams/`);
    examsCacheList = await examsRes.json();
    
    const studentsRes = await fetch(`${API_BASE}/students/`);
    studentsCacheList = await studentsRes.json();
    
    if (activePanel === 'students') {
      const list = studentsCacheList;
      
      // Populate Admin Stats
      statsRow.innerHTML = `
        <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-info"><h3>${list.length}</h3><p>Total Students</p></div></div>
      `;
      
      tHeaders.innerHTML = `
        <th>ID</th>
        <th>Full Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>College</th>
        <th style="width: 150px;">Actions</th>
      `;
      
      if (list.length === 0) {
        tRows.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No students registered.</td></tr>`;
        return;
      }
      
      tRows.innerHTML = list.map(student => `
        <tr>
          <td>${student.student_id}</td>
          <td style="font-weight: 600;">${escapeHTML(student.full_name)}</td>
          <td>${escapeHTML(student.email)}</td>
          <td>${escapeHTML(student.phone)}</td>
          <td>${escapeHTML(student.college)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditStudent('${escapeURIComponent(JSON.stringify(student))}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRecord(${student.student_id})">🗑️</button>
          </td>
        </tr>
      `).join('');
      
    } else if (activePanel === 'exams') {
      const list = examsCacheList;
      
      statsRow.innerHTML = `
        <div class="stat-card"><div class="stat-icon">📝</div><div class="stat-info"><h3>${list.length}</h3><p>Active Exams</p></div></div>
      `;
      
      tHeaders.innerHTML = `
        <th>ID</th>
        <th>Exam Title</th>
        <th>Subject</th>
        <th>Duration (min)</th>
        <th>Total Marks</th>
        <th>Exam Date</th>
        <th style="width: 150px;">Actions</th>
      `;
      
      if (list.length === 0) {
        tRows.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No examinations scheduled.</td></tr>`;
        return;
      }
      
      tRows.innerHTML = list.map(exam => `
        <tr>
          <td>${exam.exam_id}</td>
          <td style="font-weight: 600;">${escapeHTML(exam.exam_title)}</td>
          <td>${escapeHTML(exam.subject)}</td>
          <td>${exam.duration} Min</td>
          <td>${exam.total_marks}</td>
          <td>${escapeHTML(exam.exam_date)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditExam('${escapeURIComponent(JSON.stringify(exam))}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRecord(${exam.exam_id})">🗑️</button>
          </td>
        </tr>
      `).join('');
      
    } else if (activePanel === 'questions') {
      const res = await fetch(`${API_BASE}/questions/`);
      const list = await res.json();
      
      statsRow.innerHTML = `
        <div class="stat-card"><div class="stat-icon">❓</div><div class="stat-info"><h3>${list.length}</h3><p>Stored Questions</p></div></div>
      `;
      
      tHeaders.innerHTML = `
        <th>ID</th>
        <th>Exam Title</th>
        <th>Question Text</th>
        <th>Options (A/B/C/D)</th>
        <th>Answer</th>
        <th>Marks</th>
        <th style="width: 150px;">Actions</th>
      `;
      
      if (list.length === 0) {
        tRows.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No questions currently mapped.</td></tr>`;
        return;
      }
      
      tRows.innerHTML = list.map(q => `
        <tr>
          <td>${q.question_id}</td>
          <td>${escapeHTML(q.exam_title)}</td>
          <td style="max-width: 250px; font-weight: 500;">${escapeHTML(q.question)}</td>
          <td style="font-size: 0.8rem; color: var(--text-secondary);">
            A: ${escapeHTML(q.option_a)}<br>
            B: ${escapeHTML(q.option_b)}<br>
            C: ${escapeHTML(q.option_c)}<br>
            D: ${escapeHTML(q.option_d)}
          </td>
          <td><span class="subject-badge">${escapeHTML(q.correct_answer)}</span></td>
          <td><strong>${q.marks}</strong></td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditQuestion('${escapeURIComponent(JSON.stringify(q))}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRecord(${q.question_id})">🗑️</button>
          </td>
        </tr>
      `).join('');
      
    } else if (activePanel === 'submissions') {
      const res = await fetch(`${API_BASE}/submissions/`);
      const list = await res.json();
      
      statsRow.innerHTML = `
        <div class="stat-card"><div class="stat-icon warning">📥</div><div class="stat-info"><h3>${list.length}</h3><p>Total Attempts</p></div></div>
      `;
      
      tHeaders.innerHTML = `
        <th>ID</th>
        <th>Student Name</th>
        <th>Exam Title</th>
        <th>Answers Sheet</th>
        <th>Score</th>
        <th>Submitted At</th>
        <th style="width: 150px;">Actions</th>
      `;
      
      if (list.length === 0) {
        tRows.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No student answers submitted yet.</td></tr>`;
        return;
      }
      
      tRows.innerHTML = list.map(sub => `
        <tr>
          <td>${sub.submission_id}</td>
          <td style="font-weight: 600;">${escapeHTML(sub.student_name)}</td>
          <td>${escapeHTML(sub.exam_title)}</td>
          <td style="max-width: 200px; font-size: 0.8rem; color: var(--text-secondary); word-break: break-all;">${escapeHTML(sub.submitted_answers)}</td>
          <td><strong>${sub.score}</strong></td>
          <td>${escapeHTML(sub.submitted_at)}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditSubmission('${escapeURIComponent(JSON.stringify(sub))}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRecord(${sub.submission_id})">🗑️</button>
          </td>
        </tr>
      `).join('');
      
    } else if (activePanel === 'results') {
      const res = await fetch(`${API_BASE}/results/`);
      const list = await res.json();
      
      const passes = list.filter(r => r.result_status === 'Pass').length;
      const passRate = list.length > 0 ? Math.round((passes / list.length) * 100) : 0;
      
      statsRow.innerHTML = `
        <div class="stat-card"><div class="stat-icon">🏆</div><div class="stat-info"><h3>${list.length}</h3><p>Total Results</p></div></div>
        <div class="stat-card"><div class="stat-icon success">📈</div><div class="stat-info"><h3>${passRate}%</h3><p>Average Pass Rate</p></div></div>
      `;
      
      tHeaders.innerHTML = `
        <th>ID</th>
        <th>Student Name</th>
        <th>Exam Title</th>
        <th>Total Marks</th>
        <th>Obtained</th>
        <th>Percentage</th>
        <th>Status</th>
        <th style="width: 150px;">Actions</th>
      `;
      
      if (list.length === 0) {
        tRows.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-secondary);">No grades catalogued.</td></tr>`;
        return;
      }
      
      tRows.innerHTML = list.map(r => `
        <tr>
          <td>${r.result_id}</td>
          <td style="font-weight: 600;">${escapeHTML(r.student_name)}</td>
          <td>${escapeHTML(r.exam_title)}</td>
          <td>${r.total_marks}</td>
          <td><strong>${r.obtained_marks}</strong></td>
          <td>${r.percentage}%</td>
          <td>
            <span class="subject-badge" style="background-color: ${r.result_status === 'Pass' ? 'var(--success-light)' : 'var(--error-light)'}; color: ${r.result_status === 'Pass' ? 'var(--success)' : 'var(--error)'}; border-color: ${r.result_status === 'Pass' ? 'var(--success)' : 'var(--error)'};">
              ${r.result_status}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="openEditResult('${escapeURIComponent(JSON.stringify(r))}')">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="confirmDeleteRecord(${r.result_id})">🗑️</button>
          </td>
        </tr>
      `).join('');
    }
    
  } catch (err) {
    console.error(err);
    showToast('Failed to connect to CRUD database interface.', 'error');
  }
}

// Open appropriate Create forms
function openCreateModal() {
  if (activePanel === 'students') {
    document.getElementById('student-mode').value = 'add';
    document.getElementById('modal-student-title').textContent = 'Add New Student';
    document.getElementById('form-student-id').disabled = false;
    document.getElementById('form-student').reset();
    openModal('modal-student');
  } else if (activePanel === 'exams') {
    document.getElementById('exam-mode').value = 'add';
    document.getElementById('modal-exam-title').textContent = 'Add New Examination';
    document.getElementById('form-exam-id').disabled = false;
    document.getElementById('form-exam').reset();
    openModal('modal-exam');
  } else if (activePanel === 'questions') {
    document.getElementById('question-mode').value = 'add';
    document.getElementById('modal-question-title').textContent = 'Add Multiple Choice Question';
    document.getElementById('form-question-id').disabled = false;
    document.getElementById('form-question').reset();
    
    // Bind dropdown options
    const select = document.getElementById('form-question-exam');
    select.innerHTML = examsCacheList.map(e => `
      <option value="${escapeHTML(e.exam_title)}">${escapeHTML(e.exam_title)}</option>
    `).join('');
    
    openModal('modal-question');
  } else if (activePanel === 'submissions') {
    document.getElementById('submission-mode').value = 'add';
    document.getElementById('modal-submission-title').textContent = 'Add Submission Record';
    document.getElementById('form-submission').reset();
    
    // Bind dropdowns
    document.getElementById('form-submission-student').innerHTML = studentsCacheList.map(s => `
      <option value="${escapeHTML(s.full_name)}">${escapeHTML(s.full_name)}</option>
    `).join('');
    
    document.getElementById('form-submission-exam').innerHTML = examsCacheList.map(e => `
      <option value="${escapeHTML(e.exam_title)}">${escapeHTML(e.exam_title)}</option>
    `).join('');
    
    openModal('modal-submission');
  } else if (activePanel === 'results') {
    document.getElementById('result-mode').value = 'add';
    document.getElementById('modal-result-title').textContent = 'Add Evaluation Result';
    document.getElementById('form-result').reset();
    
    // Bind dropdowns
    document.getElementById('form-result-student').innerHTML = studentsCacheList.map(s => `
      <option value="${escapeHTML(s.full_name)}">${escapeHTML(s.full_name)}</option>
    `).join('');
    
    document.getElementById('form-result-exam').innerHTML = examsCacheList.map(e => `
      <option value="${escapeHTML(e.exam_title)}">${escapeHTML(e.exam_title)}</option>
    `).join('');
    
    openModal('modal-result');
  }
}

// Form Populating & Edit Openers
window.openEditStudent = function(studentEsced) {
  const student = JSON.parse(decodeURIComponent(studentEsced));
  document.getElementById('student-mode').value = 'update';
  document.getElementById('modal-student-title').textContent = 'Modify Student Details';
  
  const idInput = document.getElementById('form-student-id');
  idInput.value = student.student_id;
  idInput.disabled = true; // Cannot edit PK
  
  document.getElementById('form-student-name').value = student.full_name;
  document.getElementById('form-student-email').value = student.email;
  document.getElementById('form-student-phone').value = student.phone;
  document.getElementById('form-student-college').value = student.college;
  document.getElementById('form-student-password').value = student.password;
  
  openModal('modal-student');
};

window.openEditExam = function(examEsced) {
  const exam = JSON.parse(decodeURIComponent(examEsced));
  document.getElementById('exam-mode').value = 'update';
  document.getElementById('modal-exam-title').textContent = 'Modify Exam Configs';
  
  const idInput = document.getElementById('form-exam-id');
  idInput.value = exam.exam_id;
  idInput.disabled = true;
  
  document.getElementById('form-exam-title').value = exam.exam_title;
  document.getElementById('form-exam-subject').value = exam.subject;
  document.getElementById('form-exam-duration').value = exam.duration;
  document.getElementById('form-exam-marks').value = exam.total_marks;
  document.getElementById('form-exam-date').value = exam.exam_date;
  
  openModal('modal-exam');
};

window.openEditQuestion = function(qEsced) {
  const q = JSON.parse(decodeURIComponent(qEsced));
  document.getElementById('question-mode').value = 'update';
  document.getElementById('modal-question-title').textContent = 'Modify Question Fields';
  
  const idInput = document.getElementById('form-question-id');
  idInput.value = q.question_id;
  idInput.disabled = true;
  
  const select = document.getElementById('form-question-exam');
  select.innerHTML = examsCacheList.map(e => `
    <option value="${escapeHTML(e.exam_title)}" ${e.exam_title === q.exam_title ? 'selected' : ''}>${escapeHTML(e.exam_title)}</option>
  `).join('');
  
  document.getElementById('form-question-text').value = q.question;
  document.getElementById('form-question-a').value = q.option_a;
  document.getElementById('form-question-b').value = q.option_b;
  document.getElementById('form-question-c').value = q.option_c;
  document.getElementById('form-question-d').value = q.option_d;
  document.getElementById('form-question-correct').value = q.correct_answer.toLowerCase();
  document.getElementById('form-question-marks').value = q.marks;
  
  openModal('modal-question');
};

window.openEditSubmission = function(subEsced) {
  const sub = JSON.parse(decodeURIComponent(subEsced));
  document.getElementById('submission-mode').value = 'update';
  document.getElementById('modal-submission-title').textContent = 'Modify Submission Record';
  
  document.getElementById('form-submission-id').value = sub.submission_id;
  
  document.getElementById('form-submission-student').innerHTML = studentsCacheList.map(s => `
    <option value="${escapeHTML(s.full_name)}" ${s.full_name === sub.student_name ? 'selected' : ''}>${escapeHTML(s.full_name)}</option>
  `).join('');
  
  document.getElementById('form-submission-exam').innerHTML = examsCacheList.map(e => `
    <option value="${escapeHTML(e.exam_title)}" ${e.exam_title === sub.exam_title ? 'selected' : ''}>${escapeHTML(e.exam_title)}</option>
  `).join('');
  
  document.getElementById('form-submission-answers').value = sub.submitted_answers;
  document.getElementById('form-submission-score').value = sub.score;
  document.getElementById('form-submission-time').value = sub.submitted_at;
  
  openModal('modal-submission');
};

window.openEditResult = function(resEsced) {
  const res = JSON.parse(decodeURIComponent(resEsced));
  document.getElementById('result-mode').value = 'update';
  document.getElementById('modal-result-title').textContent = 'Modify Evaluation Result';
  
  document.getElementById('form-result-id').value = res.result_id;
  
  document.getElementById('form-result-student').innerHTML = studentsCacheList.map(s => `
    <option value="${escapeHTML(s.full_name)}" ${s.full_name === res.student_name ? 'selected' : ''}>${escapeHTML(s.full_name)}</option>
  `).join('');
  
  document.getElementById('form-result-exam').innerHTML = examsCacheList.map(e => `
    <option value="${escapeHTML(e.exam_title)}" ${e.exam_title === res.exam_title ? 'selected' : ''}>${escapeHTML(e.exam_title)}</option>
  `).join('');
  
  document.getElementById('form-result-total').value = res.total_marks;
  document.getElementById('form-result-obtained').value = res.obtained_marks;
  document.getElementById('form-result-percentage').value = res.percentage;
  document.getElementById('form-result-status').value = res.result_status;
  
  openModal('modal-result');
};

// Form API submit calls
function setupFormSubmits() {
  // Student Form
  const fStudent = document.getElementById('form-student');
  if (fStudent) {
    fStudent.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('student-mode').value;
      const sId = document.getElementById('form-student-id').value;
      const payload = {
        student_id: parseInt(sId),
        full_name: document.getElementById('form-student-name').value.trim(),
        email: document.getElementById('form-student-email').value.trim(),
        phone: document.getElementById('form-student-phone').value.trim(),
        college: document.getElementById('form-student-college').value.trim(),
        password: document.getElementById('form-student-password').value
      };
      
      let url = `${API_BASE}/students/add/`;
      let method = 'POST';
      
      if (mode === 'update') {
        url = `${API_BASE}/students/update/${sId}/`;
        method = 'PUT';
      }
      
      await handleFormApiCall(url, method, payload, 'modal-student');
    });
  }
  
  // Exam Form
  const fExam = document.getElementById('form-exam');
  if (fExam) {
    fExam.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('exam-mode').value;
      const eId = document.getElementById('form-exam-id').value;
      const payload = {
        exam_id: parseInt(eId),
        exam_title: document.getElementById('form-exam-title').value.trim(),
        subject: document.getElementById('form-exam-subject').value.trim(),
        duration: parseInt(document.getElementById('form-exam-duration').value),
        total_marks: parseInt(document.getElementById('form-exam-marks').value),
        exam_date: document.getElementById('form-exam-date').value
      };
      
      let url = `${API_BASE}/exams/add/`;
      let method = 'POST';
      
      if (mode === 'update') {
        url = `${API_BASE}/exams/update/${eId}/`;
        method = 'PUT';
      }
      
      await handleFormApiCall(url, method, payload, 'modal-exam');
    });
  }
  
  // Question Form
  const fQuestion = document.getElementById('form-question');
  if (fQuestion) {
    fQuestion.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('question-mode').value;
      const qId = document.getElementById('form-question-id').value;
      const payload = {
        question_id: parseInt(qId),
        exam_title: document.getElementById('form-question-exam').value,
        question: document.getElementById('form-question-text').value.trim(),
        option_a: document.getElementById('form-question-a').value.trim(),
        option_b: document.getElementById('form-question-b').value.trim(),
        option_c: document.getElementById('form-question-c').value.trim(),
        option_d: document.getElementById('form-question-d').value.trim(),
        correct_answer: document.getElementById('form-question-correct').value.toUpperCase(),
        marks: parseInt(document.getElementById('form-question-marks').value)
      };
      
      let url = `${API_BASE}/questions/add/`;
      let method = 'POST';
      
      if (mode === 'update') {
        url = `${API_BASE}/questions/update/${qId}/`;
        method = 'PUT';
      }
      
      await handleFormApiCall(url, method, payload, 'modal-question');
    });
  }
  
  // Submission Form
  const fSubmission = document.getElementById('form-submission');
  if (fSubmission) {
    fSubmission.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('submission-mode').value;
      const subId = document.getElementById('form-submission-id').value;
      const payload = {
        student_name: document.getElementById('form-submission-student').value,
        exam_title: document.getElementById('form-submission-exam').value,
        submitted_answers: document.getElementById('form-submission-answers').value.trim(),
        score: parseInt(document.getElementById('form-submission-score').value),
        submitted_at: document.getElementById('form-submission-time').value.trim()
      };
      if (subId) payload.submission_id = parseInt(subId);
      
      let url = `${API_BASE}/submissions/add/`;
      let method = 'POST';
      
      if (mode === 'update') {
        url = `${API_BASE}/submissions/update/${subId}/`;
        method = 'PUT';
      }
      
      await handleFormApiCall(url, method, payload, 'modal-submission');
    });
  }
  
  // Result Form
  const fResult = document.getElementById('form-result');
  if (fResult) {
    fResult.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mode = document.getElementById('result-mode').value;
      const resId = document.getElementById('form-result-id').value;
      const payload = {
        student_name: document.getElementById('form-result-student').value,
        exam_title: document.getElementById('form-result-exam').value,
        total_marks: parseInt(document.getElementById('form-result-total').value),
        obtained_marks: parseInt(document.getElementById('form-result-obtained').value),
        percentage: parseFloat(document.getElementById('form-result-percentage').value),
        result_status: document.getElementById('form-result-status').value
      };
      if (resId) payload.result_id = parseInt(resId);
      
      let url = `${API_BASE}/results/add/`;
      let method = 'POST';
      
      if (mode === 'update') {
        url = `${API_BASE}/results/update/${resId}/`;
        method = 'PUT';
      }
      
      await handleFormApiCall(url, method, payload, 'modal-result');
    });
  }
}

async function handleFormApiCall(url, method, payload, modalId) {
  try {
    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) {
      showToast(data.error || 'Failed to save record.', 'error');
      return;
    }
    showToast('Record saved successfully!');
    closeModal(modalId);
    await loadPanelData();
  } catch (err) {
    console.error(err);
    showToast('Connection to database CRUD server failed.', 'error');
  }
}

// Delete routines
window.confirmDeleteRecord = function(id) {
  deleteTargetId = id;
  openModal('modal-delete-confirm');
};

async function deleteActiveRecord() {
  if (!deleteTargetId) return;
  closeModal('modal-delete-confirm');
  
  let url = `${API_BASE}/${activePanel}/delete/${deleteTargetId}/`;
  
  try {
    const res = await fetch(url, { method: 'DELETE' });
    const data = await res.json();
    
    if (!res.ok) {
      showToast(data.error || 'Deletion failed.', 'error');
      return;
    }
    
    showToast('Entry deleted successfully.');
    deleteTargetId = null;
    await loadPanelData();
  } catch (err) {
    console.error(err);
    showToast('Error sending delete request to server.', 'error');
  }
}

// --- GLOBAL HELPER CONTROLS ---
window.openModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
};

window.closeModal = function(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
};

// Escape HTML utility to avoid XSS injections in rendering
function escapeHTML(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
