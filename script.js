const introScreen = document.getElementById('introScreen');
const gameScreen = document.getElementById('gameScreen');
const endingScreen = document.getElementById('endingScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const storyBubble = document.getElementById('storyBubble');
const scoreChip = document.getElementById('scoreChip');
const missionChip = document.getElementById('missionChip');
const timerFill = document.getElementById('timerFill');
const desk = document.getElementById('desk');
const completionPanel = document.getElementById('completionPanel');
const checklist = document.getElementById('checklist');
const searchingLine = document.getElementById('searchingLine');
const foundLine = document.getElementById('foundLine');
const openDocumentButton = document.getElementById('openDocumentButton');
const letterScene = document.getElementById('letterScene');
const letterText = document.getElementById('letterText');
const endingEyebrow = document.getElementById('endingEyebrow');
const endingTitle = document.getElementById('endingTitle');
const endingCopy = document.getElementById('endingCopy');
const endingSignature = document.getElementById('endingSignature');
const endingNames = document.getElementById('endingNames');
const endingCard = endingScreen.querySelector('.ending-card');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const thankYouCopy = 'Dokumen terakhir itu ternyata bukan berkas pajak. Isinya sederhana: ucapan terima kasih untuk KP Kak Clara dan Tutor Kak Dhiyaa karena membuat praktikum semester ini terasa lebih ringan, lebih ramah, dan lebih menyenangkan.';
const letterBody = `Terima kasih sudah membimbing kami
selama Praktikum Komputerisasi Pajak
semester ini.

Terima kasih atas waktu,
kesabaran,
dan ilmu yang sudah Kakak berikan.

Semoga semua kebaikan yang Kakak
berikan kembali kepada Kakak
dalam bentuk kebahagiaan,
kesehatan,
dan kesuksesan.

Semoga langkah Kakak
selalu dimudahkan.

Sampai jumpa
di lain kesempatan.

Terima kasih banyak.

\u2014 Adhitama`;
const roundConfigs = [
  { target: 4, objectCount: 8, seconds: 24 },
  { target: 5, objectCount: 12, seconds: 27 },
  { target: 6, objectCount: 16, seconds: 30 }
];

const documents = [
  'NPWP',
  'Faktur Pajak',
  'Bukti Potong',
  'Invoice',
  'SPT',
  'Dokumen Pajak',
  'Laporan Pajak',
  'Berkas Arsip'
];

const distractions = [
  'Kucing',
  'Burger',
  'Kopi',
  'Headphone',
  'Stick Game',
  'HP',
  'Pizza',
  'Donat',
  'Bebek Karet',
  'Tanaman',
  'Kaus Kaki',
  'Mie Instan',
  'Catatan Kuliah',
  'Kotak Susu',
  'Pisang',
  'Boneka',
  'Daftar Belanja',
  'Kamera',
  'Mouse Komputer',
  'Keyboard',
  'Boba',
  'Kue',
  'Sikat Gigi',
  'Tas',
  'Paket'
];

const wrongMessages = [
  'Bukan yang ini.',
  'Kayaknya ini bekal makan.',
  'Dokumen dulu, ngemil belakangan.',
  'Itu bukan berkas pajak.',
  'Masih belum ketemu.',
  'Fokus dulu ya.'
];

const checkedDocuments = [
  'NPWP',
  'Faktur Pajak',
  'Bukti Potong',
  'Arsip'
];

const iconAliases = {
  'Stick Game': 'Controller',
  HP: 'HP',
  Headphone: 'Headphone',
  Donat: 'Donat',
  'Bebek Karet': 'Bebek Karet',
  'Kaus Kaki': 'Kaus Kaki',
  'Mie Instan': 'Mie Instan',
  'Catatan Kuliah': 'Notebook',
  'Kotak Susu': 'Kotak Susu',
  Pisang: 'Pisang',
  Boneka: 'Boneka',
  'Daftar Belanja': 'Notebook',
  Kamera: 'Kamera',
  'Mouse Komputer': 'Mouse',
  Boba: 'Boba',
  Kue: 'Kue',
  'Sikat Gigi': 'Sikat Gigi',
  Tas: 'Tas',
  Paket: 'Paket'
};

const deskPositions = [
  { x: 16, y: 25, rotate: -7 },
  { x: 38, y: 24, rotate: 4 },
  { x: 63, y: 24, rotate: -3 },
  { x: 84, y: 27, rotate: 6 },
  { x: 23, y: 45, rotate: 5 },
  { x: 49, y: 45, rotate: -5 },
  { x: 74, y: 46, rotate: 3 },
  { x: 16, y: 65, rotate: 6 },
  { x: 35, y: 66, rotate: -4 },
  { x: 59, y: 66, rotate: 5 },
  { x: 84, y: 67, rotate: -6 },
  { x: 25, y: 82, rotate: -3 },
  { x: 47, y: 82, rotate: 4 },
  { x: 68, y: 82, rotate: -5 },
  { x: 86, y: 83, rotate: 3 },
  { x: 16, y: 83, rotate: -4 }
];

let animationFrameId = null;
let typewriterId = null;
let lastTimestamp = 0;
let gameState = null;
let bubbleTimer = 0;
let restartMode = 'intro';

function showScreen(screen) {
  [introScreen, gameScreen, endingScreen].forEach((element) => {
    element.classList.toggle('active', element === screen);
  });
}

function updateBubble(text, duration = 1.8) {
  bubbleTimer = duration;
  storyBubble.textContent = text;
  storyBubble.classList.add('show');
}

function hideBubble() {
  bubbleTimer = 0;
  storyBubble.classList.remove('show');
}

function resetNarrativeOverlays() {
  completionPanel.hidden = true;
  letterScene.hidden = true;
  letterScene.classList.remove('opened');
  checklist.textContent = '';
  searchingLine.hidden = false;
  foundLine.hidden = false;
  openDocumentButton.hidden = false;
  letterText.textContent = '';
}

function svgIcon(kind, label) {
  if (kind === 'document') {
    return `
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 6h17l7 7v29H12z" fill="#fff8df"/>
        <path d="M29 6v8h7" fill="#d9fff1"/>
        <path d="M12 6h17l7 7v29H12zM29 6v8h7" fill="none" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/>
        <path d="M17 22h14M17 28h14M17 34h10" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>
        <rect x="16" y="11" width="10" height="6" rx="2" fill="#67f2c4"/>
      </svg>
    `;
  }

  const iconKey = iconAliases[label] || label;
  const icons = {
    Burger: '<path d="M12 24c2-8 22-8 24 0z" fill="#ffcb68"/><path d="M10 28h28" stroke="#17213a" stroke-width="4" stroke-linecap="round"/><path d="M13 34h22c-2 5-20 5-22 0z" fill="#e58b4a"/>',
    Kopi: '<path d="M14 18h19v14a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8z" fill="#fff8df" stroke="#17213a" stroke-width="3"/><path d="M33 22h3a5 5 0 0 1 0 10h-3" fill="none" stroke="#17213a" stroke-width="3"/><path d="M18 10v4M25 9v4" stroke="#67f2c4" stroke-width="3" stroke-linecap="round"/>',
    Controller: '<path d="M12 22c3-6 21-6 24 0l3 10c2 7-6 9-10 3H19c-4 6-12 4-10-3z" fill="#e7e3ff" stroke="#17213a" stroke-width="3"/><path d="M18 27h8M22 23v8M31 26h.1M35 30h.1" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    Headphone: '<path d="M13 27a11 11 0 0 1 22 0" fill="none" stroke="#17213a" stroke-width="4"/><rect x="9" y="26" width="8" height="12" rx="3" fill="#8f7dff"/><rect x="31" y="26" width="8" height="12" rx="3" fill="#8f7dff"/>',
    Pizza: '<path d="M14 9l23 10-18 20z" fill="#ffcb68" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><circle cx="23" cy="22" r="2.5" fill="#d94d4d"/><circle cx="28" cy="28" r="2.5" fill="#d94d4d"/><path d="M15 9c7 5 15 8 22 10" stroke="#e58b4a" stroke-width="4" stroke-linecap="round"/>',
    Kucing: '<path d="M14 18l4-7 5 5h2l5-5 4 7v16a9 9 0 0 1-9 9h-2a9 9 0 0 1-9-9z" fill="#f4efe3" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M20 27h.1M28 27h.1M22 33h4" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    Bola: '<circle cx="24" cy="24" r="17" fill="#f7fffb" stroke="#17213a" stroke-width="3"/><path d="M24 10v28M10 24h28M15 14c7 6 12 14 18 20M33 14c-7 6-12 14-18 20" stroke="#17213a" stroke-width="2"/>',
    Keyboard: '<rect x="8" y="16" width="32" height="18" rx="4" fill="#d9e2ff" stroke="#17213a" stroke-width="3"/><path d="M14 22h2M21 22h2M28 22h2M35 22h2M14 29h16" stroke="#17213a" stroke-width="2" stroke-linecap="round"/>',
    Mouse: '<rect x="15" y="9" width="18" height="31" rx="9" fill="#d9e2ff" stroke="#17213a" stroke-width="3"/><path d="M24 10v9M24 23v4" stroke="#17213a" stroke-width="2" stroke-linecap="round"/>',
    Notebook: '<rect x="12" y="8" width="25" height="33" rx="3" fill="#fff8df" stroke="#17213a" stroke-width="3"/><path d="M18 8v33M23 17h8M23 24h8M23 31h6" stroke="#17213a" stroke-width="2" stroke-linecap="round"/>',
    Tanaman: '<path d="M18 38h12l3-14H15z" fill="#ffcb68" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M24 24c-9-3-9-12 0-10 9-2 9 7 0 10z" fill="#67f2c4" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/>',
    Donat: '<circle cx="24" cy="24" r="15" fill="#e58bba" stroke="#17213a" stroke-width="3"/><circle cx="24" cy="24" r="6" fill="#f4efe3" stroke="#17213a" stroke-width="3"/><path d="M16 20h3M28 17h3M29 30h3" stroke="#fff8df" stroke-width="2" stroke-linecap="round"/>',
    'Bebek Karet': '<path d="M15 30c1-8 11-10 17-4l5-4c2 4 0 9-5 10H15z" fill="#ffcb68" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><circle cx="22" cy="20" r="8" fill="#ffcb68" stroke="#17213a" stroke-width="3"/><path d="M28 20h8l-6 4" fill="#e58b4a" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M21 18h.1" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    'Kaus Kaki': '<path d="M17 8h13v20c0 7-4 11-11 11h-7v-8h7c2 0 3-1 3-3V8z" fill="#d9e2ff" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M18 15h11" stroke="#8f7dff" stroke-width="3"/>',
    'Mie Instan': '<rect x="10" y="20" width="28" height="15" rx="5" fill="#fff8df" stroke="#17213a" stroke-width="3"/><path d="M15 20c2-6 16-6 18 0M17 27h14" stroke="#e58b4a" stroke-width="3" stroke-linecap="round"/><path d="M32 10l-5 12" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    'Kotak Susu': '<path d="M14 17l5-9h15v31H14z" fill="#f7fffb" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M19 8l5 9h10M19 25h10" stroke="#67f2c4" stroke-width="3" stroke-linecap="round"/>',
    Pisang: '<path d="M14 15c6 16 17 19 24 10-8 16-24 11-28-7z" fill="#ffcb68" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/>',
    Boneka: '<circle cx="24" cy="17" r="8" fill="#f4b66f" stroke="#17213a" stroke-width="3"/><path d="M15 31c2-9 16-9 18 0v8H15z" fill="#e7e3ff" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M21 16h.1M27 16h.1M21 22h6" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    Kamera: '<rect x="9" y="17" width="30" height="20" rx="5" fill="#d9e2ff" stroke="#17213a" stroke-width="3"/><circle cx="24" cy="27" r="6" fill="#67f2c4" stroke="#17213a" stroke-width="3"/><path d="M15 17l3-5h8l3 5" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/>',
    Boba: '<path d="M15 15h18l-3 27H18z" fill="#f2d899" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M18 24h12" stroke="#8f7dff" stroke-width="3"/><circle cx="21" cy="34" r="2" fill="#17213a"/><circle cx="27" cy="35" r="2" fill="#17213a"/><path d="M29 7l-3 10" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    Kue: '<path d="M12 22h24v16H12z" fill="#fff8df" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M12 27h24" stroke="#e58bba" stroke-width="4"/><path d="M20 14v8M28 14v8" stroke="#ffcb68" stroke-width="3" stroke-linecap="round"/>',
    'Sikat Gigi': '<path d="M13 31l21-21 4 4-21 21z" fill="#d9e2ff" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M29 9l6-4M32 12l6-4" stroke="#67f2c4" stroke-width="3" stroke-linecap="round"/>',
    Tas: '<path d="M12 19h24v20H12z" fill="#8f7dff" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M18 19c0-9 12-9 12 0" fill="none" stroke="#17213a" stroke-width="3"/>',
    Paket: '<path d="M10 16h28v24H10z" fill="#f2d899" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M10 16l14 10 14-10M24 26v14" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/>',
    HP: '<rect x="15" y="7" width="18" height="34" rx="5" fill="#d9e2ff" stroke="#17213a" stroke-width="3"/><path d="M21 35h6" stroke="#17213a" stroke-width="3" stroke-linecap="round"/>',
    'Pesawat Kertas': '<path d="M8 13l32 10-16 4-7 9z" fill="#f7fffb" stroke="#17213a" stroke-width="3" stroke-linejoin="round"/><path d="M40 23L17 36l5-12z" fill="#d9e2ff" stroke="#17213a" stroke-width="2" stroke-linejoin="round"/>'
  };

  return `<svg viewBox="0 0 48 48" aria-hidden="true">${icons[iconKey] || icons.Notebook}</svg>`;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function buildRoundObjects(config) {
  const correctLabels = shuffle(documents).slice(0, config.target);
  const wrongLabels = shuffle(distractions).slice(0, config.objectCount - config.target);
  const items = [
    ...correctLabels.map((label) => ({ label, type: 'document', found: false })),
    ...wrongLabels.map((label) => ({ label, type: 'distraction', found: false }))
  ];

  return shuffle(items).map((item, index) => ({
    ...item,
    ...deskPositions[index],
    size: index % 3 === 0 ? 82 : 74
  }));
}

function renderDesk() {
  desk.textContent = '';

  gameState.objects.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = `desk-object ${item.type}${item.found ? ' found' : ''}`;
    button.type = 'button';
    button.disabled = item.found;
    button.dataset.index = String(index);
    button.style.setProperty('--x', `${item.x}%`);
    button.style.setProperty('--y', `${item.y}%`);
    button.style.setProperty('--rotate', `${item.rotate}deg`);
    button.style.setProperty('--size', `${item.size}px`);
    button.setAttribute('aria-label', `${item.label}${item.type === 'document' ? ', dokumen pajak' : ', bukan dokumen pajak'}`);
    button.innerHTML = `${svgIcon(item.type, item.label)}<span class="object-label">${item.label}</span>`;
    desk.appendChild(button);
  });
}

function updateHud() {
  const config = roundConfigs[gameState.roundIndex];
  missionChip.textContent = `Meja ${gameState.roundIndex + 1}/3`;
  scoreChip.textContent = `Dokumen ditemukan: ${gameState.found}/${config.target}`;
  timerFill.style.transform = `scaleX(${Math.max(0, gameState.timeLeft / config.seconds)})`;
}

function startRound(roundIndex) {
  const config = roundConfigs[roundIndex];
  gameState = {
    phase: 'playing',
    roundIndex,
    found: 0,
    timeLeft: config.seconds,
    objects: buildRoundObjects(config)
  };

  renderDesk();
  updateHud();
  if (roundIndex === 0) {
    updateBubble('Cari semua dokumen pajak yang diminta.');
  } else if (roundIndex === 1) {
    updateBubble('Meja kedua. Pelan-pelan, dokumennya masih di sekitar sini.');
  } else {
    updateBubble('Masih ada satu dokumen terakhir...');
  }
}

function startGame() {
  clearTimeout(typewriterId);
  cancelAnimationFrame(animationFrameId);
  lastTimestamp = 0;
  showScreen(gameScreen);
  endingCard.classList.remove('is-typing');
  resetNarrativeOverlays();
  startRound(0);
  animationFrameId = requestAnimationFrame(tick);
}

function showFloatingScore(item) {
  const score = document.createElement('span');
  score.className = 'floating-score';
  score.textContent = '+1';
  score.style.setProperty('--x', `${item.x}%`);
  score.style.setProperty('--y', `${item.y}%`);
  desk.appendChild(score);
  window.setTimeout(() => score.remove(), 650);
}

function handleDeskSelection(event) {
  const button = event.target.closest('.desk-object');
  if (!button || !gameState || gameState.phase !== 'playing') return;

  const index = Number(button.dataset.index);
  const item = gameState.objects[index];
  if (!item || item.found) return;

  if (item.type === 'document') {
    item.found = true;
    gameState.found += 1;
    button.classList.add('found');
    button.disabled = true;
    showFloatingScore(item);
    updateHud();

    if (gameState.found >= roundConfigs[gameState.roundIndex].target) {
      completeRound();
    } else {
      updateBubble('Betul. Dokumen itu masuk berkas.');
    }
    return;
  }

  button.classList.remove('wrong');
  button.getBoundingClientRect();
  button.classList.add('wrong');
  updateBubble(wrongMessages[Math.floor(Math.random() * wrongMessages.length)]);
  window.setTimeout(() => button.classList.remove('wrong'), 280);
}

function completeRound() {
  gameState.phase = 'round-complete';
  hideBubble();

  if (gameState.roundIndex < roundConfigs.length - 1) {
    window.setTimeout(() => {
      startRound(gameState.roundIndex + 1);
      lastTimestamp = 0;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(tick);
    }, 760);
    return;
  }

  window.setTimeout(showCompletionPanel, 520);
}

function showCompletionPanel() {
  hideBubble();
  desk.textContent = '';
  timerFill.style.transform = 'scaleX(1)';
  completionPanel.hidden = false;
  checklist.textContent = '';
  searchingLine.hidden = true;
  foundLine.hidden = true;
  openDocumentButton.hidden = true;

  checkedDocuments.forEach((item, index) => {
    window.setTimeout(() => {
      const row = document.createElement('div');
      row.className = 'check-item';
      row.textContent = `\u2713 ${item}`;
      checklist.appendChild(row);
    }, 260 * index);
  });

  window.setTimeout(() => {
    searchingLine.hidden = false;
  }, 260 * checkedDocuments.length + 260);

  window.setTimeout(() => {
    foundLine.hidden = false;
    openDocumentButton.hidden = false;
  }, 260 * checkedDocuments.length + 900);
}

function openLastDocument() {
  completionPanel.hidden = true;
  letterScene.hidden = false;
  letterText.textContent = '';
  window.setTimeout(() => {
    letterScene.classList.add('opened');
    typeLetterText(letterBody);
  }, 260);
}

function retryGameplay() {
  clearTimeout(typewriterId);
  endingCard.classList.remove('is-typing');
  showScreen(gameScreen);
  resetNarrativeOverlays();
  startRound(0);
  lastTimestamp = 0;
  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(tick);
}

function typeLetterText(text) {
  clearTimeout(typewriterId);

  if (prefersReducedMotion.matches) {
    letterText.textContent = text;
    window.setTimeout(() => finishGame(true), 900);
    return;
  }

  let index = 0;

  function step() {
    index += 1;
    letterText.textContent = text.slice(0, index);

    if (index < text.length) {
      const char = text[index - 1];
      const delay = char === '\n' ? 120 : char === '.' || char === ',' ? 90 : 24;
      typewriterId = setTimeout(step, delay);
    } else {
      typewriterId = setTimeout(() => finishGame(true), 1300);
    }
  }

  typewriterId = setTimeout(step, 500);
}

function typeEndingText(text) {
  clearTimeout(typewriterId);

  if (prefersReducedMotion.matches) {
    endingCopy.textContent = text;
    endingCard.classList.remove('is-typing');
    return;
  }

  let index = 0;
  endingCopy.textContent = '';
  endingCard.classList.add('is-typing');

  function step() {
    index += 1;
    endingCopy.textContent = text.slice(0, index);

    if (index < text.length) {
      const char = text[index - 1];
      const delay = char === '.' || char === ':' ? 95 : 22;
      typewriterId = setTimeout(step, delay);
    } else {
      endingCard.classList.remove('is-typing');
    }
  }

  typewriterId = setTimeout(step, 260);
}

function finishGame(didWin) {
  if (gameState) {
    gameState.phase = 'ended';
  }
  cancelAnimationFrame(animationFrameId);
  showScreen(endingScreen);

  if (didWin) {
    endingEyebrow.textContent = 'Misi selesai';
    endingTitle.textContent = 'Ternyata bukan cuma soal berkas.';
    endingSignature.textContent = 'Dari satu mahasiswa, dengan senyum.';
    endingNames.textContent = 'KP Clara \u2022 Tutor Dhiyaa';
    restartButton.textContent = 'Main lagi';
    restartMode = 'intro';
    typeEndingText(thankYouCopy);
  } else {
    endingEyebrow.textContent = 'Waktunya habis.';
    endingTitle.textContent = 'Tidak apa-apa, coba sekali lagi.';
    endingCopy.textContent = 'Mejanya masih rapi, dokumennya juga belum ke mana-mana. Kita ulang dari ronde pertama saja.';
    endingSignature.textContent = 'Santai, misi ini tidak mengejar siapa-siapa.';
    endingNames.textContent = 'Cari Dokumen';
    restartButton.textContent = 'Coba lagi';
    restartMode = 'gameplay';
    endingCard.classList.remove('is-typing');
    clearTimeout(typewriterId);
  }

  restartButton.focus({ preventScroll: true });
}

function updateGame(deltaTime) {
  if (!gameState || gameState.phase !== 'playing') return;

  gameState.timeLeft = Math.max(0, gameState.timeLeft - deltaTime);
  updateHud();

  if (bubbleTimer > 0) {
    bubbleTimer = Math.max(0, bubbleTimer - deltaTime);
    if (bubbleTimer === 0) {
      storyBubble.classList.remove('show');
    }
  }

  if (gameState.timeLeft <= 0) {
    finishGame(false);
  }
}

function tick(timestamp) {
  if (!lastTimestamp) lastTimestamp = timestamp;
  const deltaTime = Math.min((timestamp - lastTimestamp) / 1000, 0.05);
  lastTimestamp = timestamp;

  updateGame(deltaTime);

  if (gameState && gameState.phase === 'playing') {
    animationFrameId = requestAnimationFrame(tick);
  }
}

function returnToIntro() {
  clearTimeout(typewriterId);
  cancelAnimationFrame(animationFrameId);
  gameState = null;
  endingCard.classList.remove('is-typing');
  resetNarrativeOverlays();
  endingCopy.textContent = thankYouCopy;
  restartButton.textContent = 'Main lagi';
  restartMode = 'intro';
  showScreen(introScreen);
  startButton.focus({ preventScroll: true });
}

function handleRestart() {
  if (restartMode === 'gameplay') {
    retryGameplay();
    return;
  }

  returnToIntro();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', handleRestart);
openDocumentButton.addEventListener('click', openLastDocument);
desk.addEventListener('click', handleDeskSelection);

showScreen(introScreen);
