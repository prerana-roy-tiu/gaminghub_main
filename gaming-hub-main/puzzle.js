const size = 3;
const N = size * size;
let tiles = [];
let pos = new Map();
let moveCount = 0;
let timer = 0, timerId = null;
let undoStack = [];
let gameOver = false; 

const board = document.getElementById('board');
const newBtn = document.getElementById('newBtn');
const undoBtn = document.getElementById('undoBtn');
const hintBtn = document.getElementById('hintBtn');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const toast = document.getElementById('toast');

function idx(r, c) { return r * size + c; }
function xy(i) { return [Math.floor(i / size), i % size]; }

function render() {
  board.innerHTML = '';
  for (let i = 0; i < N; i++) {
    const val = tiles[i];
    const div = document.createElement('div');
    div.className = 'tile';
    if (val === 0) {
      div.classList.add('empty');
    } else {
      div.textContent = val;
      div.dataset.val = val;
      div.addEventListener('click', () => tryMove(i));
    }
    board.appendChild(div);
  }
}

function tryMove(i) {
  if (gameOver) return; 
  const empty = pos.get(0);
  if (isNeighbor(i, empty)) {
    undoStack.push(tiles.slice());
    swap(i, empty);
    moveCount++;
    updateStats();
    render();
    if (isSolved()) {
      toastMsg("You solved it!");
      stopTimer();
      gameOver = true; 
    }
  }
}

function swap(i, j) {
  const t = tiles[i];
  tiles[i] = tiles[j];
  tiles[j] = t;
  pos.set(tiles[i], i);
  pos.set(tiles[j], j);
}

function isNeighbor(i, j) {
  const [ri, ci] = xy(i);
  const [rj, cj] = xy(j);
  return (Math.abs(ri - rj) + Math.abs(ci - cj)) === 1;
}

function isSolved() {
  for (let i = 0; i < N - 1; i++) if (tiles[i] !== i + 1) return false;
  return tiles[N - 1] === 0;
}

function shuffle() {
  tiles = Array.from({ length: N }, (_, i) => i);
  do {
    for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable(tiles) || isSolved());
  pos.clear();
  tiles.forEach((v, i) => pos.set(v, i));
}

function isSolvable(arr) {
  let inv = 0;
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
    if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
  }
  return inv % 2 === 0; 
}

function updateStats() {
  movesEl.textContent = "Moves: " + moveCount;
}

function startTimer() {
  timer = 0;
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => {
    timer++;
    timeEl.textContent = "Time: " + timer + "s";
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
}

function newGame() {
  shuffle();
  render();
  moveCount = 0;
  updateStats();
  timeEl.textContent = "Time: 0s";
  undoStack = [];
  gameOver = false; 
  startTimer();
}

function undo() {
  if (gameOver) return; 
  if (undoStack.length > 0) {
    tiles = undoStack.pop();
    pos.clear();
    tiles.forEach((v, i) => pos.set(v, i));
    moveCount = Math.max(0, moveCount - 1);
    updateStats();
    render();
  }
}

function manhattan(state) {
  let d = 0;
  for (let i = 0; i < N; i++) {
    const v = state[i];
    if (v === 0) continue;
    const [r, c] = xy(i);
    const [tr, tc] = xy(v - 1);
    d += Math.abs(r - tr) + Math.abs(c - tc);
  }
  return d;
}

function isSolvedArray(state) {
  for (let i = 0; i < N - 1; i++) if (state[i] !== i + 1) return false;
  return state[N - 1] === 0;
}

function solveOneStep() {
  const start = tiles.slice();
  const startEmpty = pos.get(0);
  const frontier = [{ state: start, empty: startEmpty, g: 0, path: [] }];
  const visited = new Set([start.join(',')]);
  while (frontier.length) {
    frontier.sort((a, b) => (a.g + manhattan(a.state)) - (b.g + manhattan(b.state)));
    const node = frontier.shift();
    if (isSolvedArray(node.state)) return node.path[0] || null;
    const [r, c] = xy(node.empty);
    const ns = [];
    if (r > 0) ns.push(idx(r - 1, c));
    if (r < size - 1) ns.push(idx(r + 1, c));
    if (c > 0) ns.push(idx(r, c - 1));
    if (c < size - 1) ns.push(idx(r, c + 1));
    for (const ni of ns) {
      const newState = node.state.slice();
      const v = newState[ni];
      newState[node.empty] = v;
      newState[ni] = 0;
      const key = newState.join(',');
      if (!visited.has(key)) {
        visited.add(key);
        frontier.push({
          state: newState,
          empty: ni,
          g: node.g + 1,
          path: node.path.concat(v)
        });
      }
    }
  }
  return null;
}

function showHint() {
  if (gameOver) return; 
  const move = solveOneStep();
  if (move == null) {
    toastMsg("No hint found");
    return;
  }
  document.querySelectorAll('.tile').forEach(t => t.classList.remove('movable'));
  const el = document.querySelector(`[data-val="${move}"]`);
  if (el) {
    el.classList.add('movable');
    toastMsg(`Hint: move tile ${move}`);
  }
}

function toastMsg(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}


newBtn.addEventListener('click', newGame);
undoBtn.addEventListener('click', undo);
hintBtn.addEventListener('click', showHint);

document.addEventListener('keydown', e => {
  if (gameOver) return; 
  const empty = pos.get(0);
  const [r, c] = xy(empty);
  let target = null;
  if (e.key === "ArrowUp" && r < size - 1) target = idx(r + 1, c);
  if (e.key === "ArrowDown" && r > 0) target = idx(r - 1, c);
  if (e.key === "ArrowLeft" && c < size - 1) target = idx(r, c + 1);
  if (e.key === "ArrowRight" && c > 0) target = idx(r, c - 1);
  if (target != null) tryMove(target);
});

newGame();