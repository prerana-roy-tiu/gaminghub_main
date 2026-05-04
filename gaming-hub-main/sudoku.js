const $ = (s, d = document) => d.querySelector(s);
const $$ = (s, d = document) => [...d.querySelectorAll(s)];

const DIFF_MAP = { easy: 36, medium: 46, hard: 54, expert: 60 };

let board = Array.from({ length: 9 }, () => Array(9).fill(0));
let solution = null;
let givenMask = Array.from({ length: 9 }, () => Array(9).fill(false));
let notesMode = false;
let selected = { r: 0, c: 0 };
let timerId = null; let startTime = null;

const boardEl = $('#board');
const timerEl = $('#timer');
const filledEl = $('#filled');

function startTimer() {
    if (timerId) clearInterval(timerId);
    startTime = Date.now();
    timerId = setInterval(() => {
        const s = Math.floor((Date.now() - startTime) / 1000);
        const m = String(Math.floor(s / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${ss}`;
    }, 1000);
}

function countFilled() {
    let n = 0; for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board[r][c]) n++;
    filledEl.textContent = n;
}

function cellId(r, c) { return `cell-${r}-${c}` }

function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const div = document.createElement('div');
            div.className = 'cell';
            div.id = cellId(r, c);
            if (givenMask[r][c]) div.classList.add('given');
            if (r % 3 === 0) div.dataset.btop = true;
            if (c % 3 === 0) div.dataset.bleft = true;
            if (r === 8) div.dataset.bbottom = true;
            if (c === 8) div.dataset.bright = true;

            const val = board[r][c];
            if (val) {
                const span = document.createElement('span');
                span.className = 'value';
                span.textContent = val;
                div.appendChild(span);
            }
            else {
                const ng = document.createElement('div');
                ng.className = 'note-grid';
                for (let n = 1; n <= 9; n++) {
                    const s = document.createElement('div'); s.className = 'note'; s.dataset.n = n; s.textContent = '';
                    ng.appendChild(s);
                }
                div.appendChild(ng);
            }

            div.addEventListener('click', () => selectCell(r, c));
            boardEl.appendChild(div);
        }
    }
    highlightContext();
    countFilled();
}

function selectCell(r, c) {
    selected = { r, c };
    $$('.cell').forEach(el => el.classList.remove('selected'));
    const el = $('#' + cellId(r, c));
    if (el) { el.classList.add('selected'); highlightContext(); }
}

function highlightContext() {
    const { r, c } = selected;
    const val = board[r][c];
    $$('.cell').forEach(el => el.classList.remove('highlight', 'conflict'));

    for (let i = 0; i < 9; i++) {
        $('#' + cellId(r, i))?.classList.add('highlight');
        $('#' + cellId(i, c))?.classList.add('highlight');
    }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let rr = br; rr < br + 3; rr++) for (let cc = bc; cc < bc + 3; cc++) $('#' + cellId(rr, cc))?.classList.add('highlight');


    if (val) {
        for (let i = 0; i < 9; i++) {
            if (i !== c && board[r][i] === val) $('#' + cellId(r, i))?.classList.add('conflict');
            if (i !== r && board[i][c] === val) $('#' + cellId(i, c))?.classList.add('conflict');
        }
        for (let rr = br; rr < br + 3; rr++) for (let cc = bc; cc < bc + 3; cc++) if (!(rr === r && cc === c) && board[rr][cc] === val) $('#' + cellId(rr, cc))?.classList.add('conflict');
    }
    $('#' + cellId(r, c))?.classList.add('selected');
}


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
}

function isSafe(b, r, c, n) {
    for (let i = 0; i < 9; i++) if (b[r][i] === n || b[i][c] === n) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let rr = br; rr < br + 3; rr++) for (let cc = bc; cc < bc + 3; cc++) if (b[rr][cc] === n) return false;
    return true;
}

function solve(b) {
    const find = findEmpty(b);
    if (!find) return b.map(row => row.slice());
    const [r, c] = find;
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of nums) {
        if (isSafe(b, r, c, n)) {
            b[r][c] = n;
            const res = solve(b);
            if (res) return res;
            b[r][c] = 0;
        }
    }
    return null;
}

function solveDeterministic(b) {
    const find = findEmpty(b);
    if (!find) return true;
    const [r, c] = find;
    for (let n = 1; n <= 9; n++) {
        if (isSafe(b, r, c, n)) {
            b[r][c] = n;
            if (solveDeterministic(b)) return true;
            b[r][c] = 0;
        }
    }
    return false;
}

function countSolutions(b, cap = 2) {
    let count = 0;
    function dfs() {
        const pos = findEmpty(b);
        if (!pos) { count++; return; }
        const [r, c] = pos;
        for (let n = 1; n <= 9; n++) {
            if (isSafe(b, r, c, n)) {
                b[r][c] = n; dfs(); if (count >= cap) { b[r][c] = 0; return; } b[r][c] = 0;
            }
        }
    }
    dfs();
    return count;
}

function findEmpty(b) {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (b[r][c] === 0) return [r, c];
    return null;
}

function generateFull() {
    const b = Array.from({ length: 9 }, () => Array(9).fill(0));
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let c = 0; c < 9; c++) b[0][c] = nums[c];
    const solved = solve(b);
    return solved;
}

function makePuzzle(diff) {
    const full = generateFull();
    solution = full.map(r => r.slice());
    const puzzle = full.map(r => r.slice());
    let removals = DIFF_MAP[diff] || 46;
    const cells = shuffle([...Array(81).keys()]);
    for (const idx of cells) {
        if (removals <= 0) break;
        const r = Math.floor(idx / 9), c = idx % 9;
        const backup = puzzle[r][c];
        if (backup === 0) continue;
        puzzle[r][c] = 0;
        const copy = puzzle.map(row => row.slice());
        const sols = countSolutions(copy, 2);
        if (sols !== 1) {
            puzzle[r][c] = backup;
        } else {
            removals--;
        }
    }
    return puzzle;
}


function loadNew(diff) {
    board = makePuzzle(diff);
    givenMask = board.map((row, r) => row.map((v, c) => v !== 0));
    notesMode = false; $('#notesBtn').textContent = 'Notes: Off'; $('#notesBtn').setAttribute('aria-pressed', 'false');
    renderBoard();
    selectCell(0, 0);
    startTimer();
}

function placeNumber(n) {
    const { r, c } = selected; if (givenMask[r][c]) return;
    const cell = $('#' + cellId(r, c));
    if (notesMode && !board[r][c]) {
        const notes = $$('.note', cell);
        const spot = notes[n - 1];
        spot.textContent = spot.textContent ? '' : n;
        return;
    }

    if (board[r][c] === n) { board[r][c] = 0; }
    else { board[r][c] = n; }
    cell.innerHTML = '';
    if (board[r][c]) {
        const span = document.createElement('span'); span.className = 'value'; span.textContent = board[r][c]; cell.appendChild(span); cell.classList.add('pop'); setTimeout(() => cell.classList.remove('pop'), 90);
    } else {
        const ng = document.createElement('div'); ng.className = 'note-grid'; for (let i = 1; i <= 9; i++) { const s = document.createElement('div'); s.className = 'note'; s.dataset.n = i; ng.appendChild(s); } cell.appendChild(ng);
    }
    highlightContext();
    countFilled();
    checkWin();
}

function checkConflicts() {
    let conflicts = 0;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
        const el = $('#' + cellId(r, c));
        el.classList.remove('conflict');
        const v = board[r][c]; if (!v) continue;

        board[r][c] = 0;
        const bad = !isSafe(board, r, c, v);
        if (bad) { el.classList.add('conflict'); conflicts++; }
        board[r][c] = v;
    }
    return conflicts;
}

function giveHint() {
    const empties = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board[r][c] === 0) empties.push([r, c]);
    if (!empties.length) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    board[r][c] = solution[r][c];
    const cell = $('#' + cellId(r, c));
    cell.innerHTML = `<span class="value">${solution[r][c]}</span>`;
    cell.classList.add('pop'); setTimeout(() => cell.classList.remove('pop'), 90);
    selectCell(r, c); countFilled(); checkWin();
}

function solveNow() {
    board = solution.map(r => r.slice());
    renderBoard();
    countFilled();
    checkWin(true);
}

function clearBoard() {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!givenMask[r][c]) board[r][c] = 0;
    renderBoard(); countFilled();
}

function checkWin(force = false) {
    if (!force && countFilled, true) { }
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (board[r][c] !== solution[r][c]) return false;
    if (timerId) clearInterval(timerId);
    setTimeout(() => {
        alert(`Solved! Time: ${timerEl.textContent}`);
    }, 50);
    return true;
}

document.addEventListener('keydown', (e) => {
    const { r, c } = selected;
    if (['ArrowUp', 'KeyW'].includes(e.code)) { selectCell(Math.max(0, r - 1), c); return; }
    if (['ArrowDown', 'KeyS'].includes(e.code)) { selectCell(Math.min(8, r + 1), c); return; }
    if (['ArrowLeft', 'KeyA'].includes(e.code)) { selectCell(r, Math.max(0, c - 1)); return; }
    if (['ArrowRight', 'KeyD'].includes(e.code)) { selectCell(r, Math.min(8, c + 1)); return; }
    if (e.key >= '1' && e.key <= '9') { placeNumber(parseInt(e.key, 10)); }
    if (e.key === '0' || e.key === 'Backspace' || e.key === 'Delete') { placeNumber(board[r][c]); board[r][c] = 0; const cell = $('#' + cellId(r, c)); cell.innerHTML = ''; const ng = document.createElement('div'); ng.className = 'note-grid'; for (let i = 1; i <= 9; i++) { const s = document.createElement('div'); s.className = 'note'; s.dataset.n = i; ng.appendChild(s); } cell.appendChild(ng); highlightContext(); countFilled(); }
    if (e.key === 'n') { notesMode = !notesMode; const b = $('#notesBtn'); b.textContent = `Notes: ${notesMode ? 'On' : 'Off'}`; b.setAttribute('aria-pressed', String(notesMode)); }
});

$('#numpad').innerHTML = Array.from({ length: 9 }, (_, i) => `<button data-n="${i + 1}">${i + 1}</button>`).join('') + `<button id="delBtn">Del</button>`;
$('#numpad').addEventListener('click', (e) => {
    const t = e.target; if (!(t instanceof HTMLElement)) return;
    if (t.dataset.n) { placeNumber(parseInt(t.dataset.n, 10)); }
    if (t.id === 'delBtn') { const { r, c } = selected; if (!givenMask[r][c]) { board[r][c] = 0; const cell = $('#' + cellId(r, c)); cell.innerHTML = ''; const ng = document.createElement('div'); ng.className = 'note-grid'; for (let i = 1; i <= 9; i++) { const s = document.createElement('div'); s.className = 'note'; s.dataset.n = i; ng.appendChild(s); } cell.appendChild(ng); highlightContext(); countFilled(); } }
});

$('#newBtn').addEventListener('click', () => loadNew($('#difficulty').value));
$('#checkBtn').addEventListener('click', () => {
    const n = checkConflicts();
    if (n === 0) alert('No conflicts found. Looks good so far.');
    else alert(`${n} conflicting cell(s) highlighted in red.`);
});
$('#hintBtn').addEventListener('click', giveHint);
$('#solveBtn').addEventListener('click', solveNow);
$('#clearBtn').addEventListener('click', clearBoard);
$('#notesBtn').addEventListener('click', () => {
    notesMode = !notesMode; const b = $('#notesBtn');
    b.textContent = `Notes: ${notesMode ? 'On' : 'Off'}`; b.setAttribute('aria-pressed', String(notesMode));
});


loadNew('medium');