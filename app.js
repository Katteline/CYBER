// CyberSecure Prep Web App
// Author: OpenAI ChatGPT

/* ====================================================
   Data definitions
   ==================================================== */

const lectures = [
  {
    id: 1,
    title: 'Introduction to Cybersecurity',
    content: `
Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money; or interrupting normal business processes.

Key sub-disciplines include:
• Information security
• Network security
• Application security
• Operational security
• Disaster recovery and business continuity
• End-user education
`,
    quiz: [
      {
        q: 'Which of the following best describes cybersecurity?',
        options: [
          'The practice of protecting hardware only',
          'A discipline focused solely on cryptography',
          'Protecting systems, networks, and programs from digital attacks',
          'Monitoring employee productivity',
        ],
        answer: 2,
      },
      {
        q: 'Which area of cybersecurity focuses on restoring operations after an incident?',
        options: [
          'Application security',
          'Disaster recovery and business continuity',
          'Network security',
          'Information security',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    title: 'Network Security Basics',
    content: `
Network security involves the policies, processes and practices adopted to prevent, detect and monitor unauthorized access, misuse, modification or denial of a computer network and network-accessible resources.

Common controls:
• Firewalls
• Intrusion Detection Systems (IDS)
• Virtual Private Networks (VPN)
• Network Access Control (NAC)
`,
    quiz: [
      {
        q: 'Which device acts as a barrier between trusted and untrusted networks?',
        options: ['Firewall', 'Switch', 'Router', 'Load balancer'],
        answer: 0,
      },
      {
        q: 'IDS stands for…',
        options: [
          'Internet Detection Software',
          'Intrusion Detection System',
          'Internal Defense System',
          'Integrated Data Service',
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 3,
    title: 'Fundamentals of Cryptography',
    content: `
Cryptography is the study of secure communication techniques that allow only the sender and intended recipient of a message to view its contents.

Important concepts:
• Symmetric vs asymmetric encryption
• Hash functions
• Digital signatures
• Public Key Infrastructure (PKI)
`,
    quiz: [
      {
        q: 'Which encryption method uses the same key for encryption and decryption?',
        options: [
          'Asymmetric encryption',
          'Hashing',
          'Symmetric encryption',
          'Digital signatures',
        ],
        answer: 2,
      },
      {
        q: 'What property do hash functions provide?',
        options: [
          'Two-way transformation',
          'One-way transformation',
          'Encryption with a public key',
          'Compression of data for storage',
        ],
        answer: 1,
      },
    ],
  },
];

/* ====================================================
   Persistence helpers (localStorage)
   ==================================================== */

const STORAGE_KEY = 'cybersecure_progress_v1';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (err) {
    console.error('Failed to parse progress from storage', err);
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let progress = loadProgress();

/* ====================================================
   Utility functions
   ==================================================== */

function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2).toLowerCase(), v);
    } else el.setAttribute(k, v);
  });
  children.forEach((child) => {
    if (typeof child === 'string') el.appendChild(document.createTextNode(child));
    else if (child) el.appendChild(child);
  });
  return el;
}

function percentage(num, total) {
  return total === 0 ? 0 : Math.round((num / total) * 100);
}

/* ====================================================
   Routing
   ==================================================== */

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  $('#year').textContent = new Date().getFullYear();
  if (!location.hash) location.hash = '#home';
  router();
});

function router() {
  const hash = location.hash.slice(1); // remove #
  const [route, param] = hash.split('-');

  switch (route) {
    case 'home':
    case '':
      renderHome();
      break;
    case 'lecture':
      renderLecture(parseInt(param, 10));
      break;
    case 'quiz':
      renderQuiz(parseInt(param, 10));
      break;
    case 'results':
      renderResults();
      break;
    case 'achievements':
      renderAchievements();
      break;
    default:
      renderNotFound();
  }
}

/* ====================================================
   View renderers
   ==================================================== */

const app = $('#app');

function clearApp() {
  app.innerHTML = '';
}

function renderHome() {
  clearApp();
  app.appendChild(createEl('h2', {}, ['Available Lectures']));
  lectures.forEach((lec) => {
    const lecProgress = progress[lec.id] || {};
    const completed = typeof lecProgress.score === 'number';
    const scorePercent = completed ? lecProgress.score : 0;

    const card = createEl('div', { class: 'card' }, [
      createEl('div', { class: 'card-title' }, [lec.title]),
      createEl('p', {}, [completed ? `Quiz Score: ${scorePercent}%` : 'Not attempted yet']),
      (() => {
        const bar = createEl('div', { class: 'progress-bar' }, [
          createEl('div', {
            class: 'progress',
            style: `width: ${scorePercent}%;`,
          }),
        ]);
        return bar;
      })(),
      createEl('button', {
        class: 'button button-primary mt-1',
        onClick: () => (location.hash = `#lecture-${lec.id}`),
      }, ['Start'] ),
    ]);

    app.appendChild(card);
  });
}

function renderLecture(id) {
  const lec = lectures.find((l) => l.id === id);
  if (!lec) return renderNotFound();

  clearApp();
  app.appendChild(createEl('h2', {}, [lec.title]));
  lec.content.split('\n').forEach((line) => {
    if (line.trim() === '') return;
    app.appendChild(createEl('p', { class: 'mt-1' }, [line]));
  });
  app.appendChild(
    createEl(
      'button',
      {
        class: 'button button-primary mt-2',
        onClick: () => (location.hash = `#quiz-${lec.id}`),
      },
      ['Take Quiz']
    )
  );
}

function renderQuiz(id) {
  const lec = lectures.find((l) => l.id === id);
  if (!lec) return renderNotFound();

  clearApp();

  let currentQ = 0;
  const selections = Array(lec.quiz.length).fill(null);

  const questionWrapper = createEl('div');
  const nextBtn = createEl('button', { class: 'button button-primary mt-2', disabled: true }, ['Next']);

  nextBtn.addEventListener('click', () => {
    if (currentQ < lec.quiz.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  function renderQuestion() {
    questionWrapper.innerHTML = '';
    const qObj = lec.quiz[currentQ];

    questionWrapper.appendChild(createEl('h3', {}, [`Question ${currentQ + 1}/${lec.quiz.length}`]));
    questionWrapper.appendChild(createEl('p', { class: 'mt-1' }, [qObj.q]));

    const optionsList = createEl('div', { class: 'mt-1' });

    qObj.options.forEach((opt, idx) => {
      const optEl = createEl('div', { class: 'quiz-option mt-1' }, [opt]);

      optEl.addEventListener('click', () => {
        selections[currentQ] = idx;
        // update UI selection state
        [...optionsList.children].forEach((c) => c.classList.remove('selected'));
        optEl.classList.add('selected');
        nextBtn.disabled = false;
      });

      optionsList.appendChild(optEl);
    });

    questionWrapper.appendChild(optionsList);
    nextBtn.textContent = currentQ === lec.quiz.length - 1 ? 'Finish' : 'Next';
    nextBtn.disabled = selections[currentQ] === null;
  }

  function finishQuiz() {
    // calculate score
    let correct = 0;
    const incorrectQs = [];
    lec.quiz.forEach((q, idx) => {
      if (selections[idx] === q.answer) correct++;
      else incorrectQs.push(idx);
    });
    const scorePct = percentage(correct, lec.quiz.length);

    // store progress
    progress[id] = {
      score: scorePct,
      incorrect: incorrectQs,
      selections,
    };
    saveProgress(progress);
    updateAchievements();

    renderResultsSummary(id);
  }

  app.appendChild(questionWrapper);
  app.appendChild(nextBtn);
  renderQuestion();
}

function renderResultsSummary(id) {
  const lec = lectures.find((l) => l.id === id);
  if (!lec) return renderNotFound();

  clearApp();
  const lecProgress = progress[id];
  const score = lecProgress.score;

  app.appendChild(
    createEl('h2', {}, [`${lec.title} – Results`])
  );
  app.appendChild(
    createEl('p', { class: 'mt-1' }, [`Your Score: ${score}%`])
  );

  // List questions with correct/incorrect highlighting
  lec.quiz.forEach((q, idx) => {
    const userSel = lecProgress.incorrect.includes(idx) ? 'incorrect' : 'correct';
    const card = createEl('div', { class: `card mt-1 quiz-option ${userSel}` }, [
      createEl('p', {}, [`Q${idx + 1}: ${q.q}`]),
      createEl('p', { class: 'mt-1' }, [
        `Your answer: ${q.options[lecProgress.selections[idx]] || '–'}`,
      ]),
      createEl('p', {}, [
        `Correct answer: ${q.options[q.answer]}`,
      ]),
    ]);
    app.appendChild(card);
  });

  app.appendChild(
    createEl('button', {
      class: 'button button-primary mt-2',
      onClick: () => (location.hash = '#home'),
    }, ['Back to Home'])
  );
}

function renderResults() {
  clearApp();
  app.appendChild(createEl('h2', {}, ['Results Dashboard']));

  lectures.forEach((lec) => {
    const lecProgress = progress[lec.id];
    if (!lecProgress) return;

    const card = createEl('div', { class: 'card' }, [
      createEl('div', { class: 'card-title' }, [lec.title]),
      createEl('p', {}, [`Score: ${lecProgress.score}%`]),
      createEl('button', {
        class: 'button button-secondary mt-1',
        onClick: () => renderIncorrectReview(lec.id),
      }, ['Review Incorrect Questions'])
    ]);

    app.appendChild(card);
  });

  if (app.childElementCount === 1) {
    app.appendChild(createEl('p', { class: 'mt-1' }, ['No quiz data yet. Complete a lecture to see results.']));
  }
}

function renderIncorrectReview(id) {
  const lec = lectures.find((l) => l.id === id);
  const lecProgress = progress[id];
  if (!lec || !lecProgress) return renderNotFound();

  clearApp();
  app.appendChild(createEl('h2', {}, [`${lec.title} – Review`]));

  lecProgress.incorrect.forEach((idx) => {
    const q = lec.quiz[idx];
    const card = createEl('div', { class: 'card mt-1' }, [
      createEl('p', {}, [`Q${idx + 1}: ${q.q}`]),
      createEl('p', { class: 'mt-1' }, [`Correct answer: ${q.options[q.answer]}`]),
    ]);
    app.appendChild(card);
  });

  if (lecProgress.incorrect.length === 0) {
    app.appendChild(createEl('p', { class: 'mt-1' }, ['Great job! You answered all questions correctly.']));
  }

  app.appendChild(
    createEl('button', {
      class: 'button button-secondary mt-2',
      onClick: () => (location.hash = '#results'),
    }, ['Back to Results'])
  );
}

function renderAchievements() {
  clearApp();
  app.appendChild(createEl('h2', {}, ['Achievements']));

  const achievements = getAchievements();

  achievements.forEach((ach) => {
    const earned = ach.earned;
    const badge = createEl('div', { class: `badge ${earned ? 'badge-earned' : ''}` }, [ach.title]);
    const card = createEl('div', { class: 'card' }, [
      createEl('div', { class: 'card-title' }, [ach.title, badge]),
      createEl('p', { class: 'mt-1' }, [ach.desc]),
    ]);
    app.appendChild(card);
  });
}

function renderNotFound() {
  clearApp();
  app.appendChild(createEl('h2', {}, ['Page Not Found']));
  app.appendChild(
    createEl('button', {
      class: 'button button-primary mt-2',
      onClick: () => (location.hash = '#home'),
    }, ['Go Home'])
  );
}

/* ====================================================
   Gamification – Achievements
   ==================================================== */

function getAchievements() {
  const lectureCount = lectures.length;
  const completedCount = Object.keys(progress).length;
  const perfectScores = Object.values(progress).filter((p) => p.score === 100).length;

  return [
    {
      id: 'first-steps',
      title: 'First Steps',
      desc: 'Complete your first lecture quiz.',
      earned: completedCount >= 1,
    },
    {
      id: 'half-way',
      title: 'Half Way There',
      desc: 'Complete 50% of the available lectures.',
      earned: completedCount >= Math.ceil(lectureCount / 2),
    },
    {
      id: 'all-rounder',
      title: 'All-Rounder',
      desc: 'Complete all lectures.',
      earned: completedCount === lectureCount,
    },
    {
      id: 'perfectionist',
      title: 'Perfectionist',
      desc: 'Achieve 100% on any quiz.',
      earned: perfectScores >= 1,
    },
  ];
}

function updateAchievements() {
  // Achievements are computed dynamically, so no need to store separately.
}