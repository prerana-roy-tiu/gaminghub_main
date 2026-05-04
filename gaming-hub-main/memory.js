
const SYMBOLS = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', 
    '★', '◆', '●', '▲', '♣', '♠', '♥', '♫', '☀', '☂', '☕', '✿', '⚽', '⚡', 
    '🍀', '🍎', '🍇', '🍉', '🍔', '🐱', '🐶', '🦄', '🚀'
];

const grid = document.getElementById('grid');
const tpl = document.getElementById('card-tpl');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const restartBtn = document.getElementById('restart');
const pairsRange = document.getElementById('pairs');
const pairsLabel = document.getElementById('pairsLabel');
const winDialog = document.getElementById('win');
const summary = document.getElementById('summary');

let firstCard = null;
let lock = false;
let matches = 0;
let moves = 0;
let timer = null, startTime = null;
let totalPairs = parseInt(pairsRange.value, 10);

pairsRange.addEventListener('input', e => {
    totalPairs = parseInt(e.target.value, 10);
    pairsLabel.textContent = totalPairs;
    newGame();
});

restartBtn.addEventListener('click', newGame);

function newGame() {
    stopTimer();
    moves = 0; matches = 0; firstCard = null; lock = false;
    updateMoves(); updateTime(0);
    const set = pickSymbols(totalPairs);
    const deck = shuffle([...set, ...set]);
    renderGrid(deck);
    startTimer();
}

function pickSymbols(n) {
    const pool = [...SYMBOLS];
    if (n > pool.length) n = pool.length;
    return shuffle(pool).slice(0, n);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderGrid(deck) {
    grid.innerHTML = '';
    deck.forEach((symbol, idx) => {
        const node = tpl.content.firstElementChild.cloneNode(true);
        const back = node.querySelector('.back');
        back.textContent = symbol;
        node.dataset.value = symbol;
        node.dataset.index = idx;
        node.addEventListener('click', onFlip);
        node.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                onFlip.call(node); 
            }
            if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                moveFocus(e.key, node);
            }
        });
        grid.appendChild(node);
    });

    [...grid.children].forEach((c, i) => c.tabIndex = i === 0 ? 0 : -1);
    grid.firstElementChild?.focus();
}

function moveFocus(key, current) {
    const nodes = [...grid.children];
    const cols = getComputedStyle(grid).getPropertyValue('--cols');
    const C = parseInt(cols, 10) || 4;
    const i = nodes.indexOf(current);
    let next = i;
    if (key === 'ArrowRight') next = Math.min(i + 1, nodes.length - 1);
    if (key === 'ArrowLeft') next = Math.max(i - 1, 0);
    if (key === 'ArrowDown') next = Math.min(i + C, nodes.length - 1);
    if (key === 'ArrowUp') next = Math.max(i - C, 0);
    nodes.forEach(n => n.tabIndex = -1); 
    nodes[next].tabIndex = 0; 
    nodes[next].focus();
}

function onFlip() {
    if (lock || this.classList.contains('matched')) return;
    const isFlipped = this.dataset.flipped === 'true';
    if (isFlipped) return;

    this.dataset.flipped = 'true';
    this.setAttribute('aria-pressed', 'true');

    if (!firstCard) {
        firstCard = this; 
        return;
    }

    moves++; 
    updateMoves();

    if (firstCard.dataset.value === this.dataset.value) {
        firstCard.classList.add('matched');
        this.classList.add('matched');
        firstCard = null; 
        matches++;
        if (matches === totalPairs) onWin();
    } else {
        lock = true;
        const a = firstCard, b = this;
        setTimeout(() => {
            a.dataset.flipped = 'false'; a.setAttribute('aria-pressed', 'false');
            b.dataset.flipped = 'false'; b.setAttribute('aria-pressed', 'false');
            firstCard = null; lock = false;
        }, 700);
    }
}

function onWin() {
    stopTimer();
    const secs = Math.floor((Date.now() - startTime) / 1000); 
    summary.textContent = `Finished ${ totalPairs } pairs in ${ formatTime(secs) } with ${ moves } moves.`;
    winDialog.showModal();
    winDialog.addEventListener('close', newGame, { once: true });
}

function updateMoves() { 
    movesEl.textContent = `Moves: ${ moves }`; 
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(() => {
    const secs = Math.floor((Date.now() - startTime) / 1000);
    updateTime(secs);
  }, 1000);
}


function stopTimer() {
    clearInterval(timer);
    timer = null;
}


function updateTime(secs) { 
    timeEl.textContent = `Time: ${ formatTime(secs) }`; 
}

function formatTime(secs) {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${ m }:${ s }`;
}

newGame();