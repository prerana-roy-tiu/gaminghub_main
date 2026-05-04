const board = document.getElementById('board');
const statusText = document.getElementById('status');
let currentPlayer = 'X';
let gameActive = true;
let cells = Array(9).fill('');

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]             
];


function createBoard() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const div = document.createElement('div');
        div.classList.add('cell');
        div.dataset.index = index;
        div.addEventListener('click', handleClick);
        board.appendChild(div);
    });
}


function handleClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || cells[index] !== '') return;

    cells[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add('taken');

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins! 🎉`;
        gameActive = false;
        return;
    }

    if (!cells.includes('')) {
        statusText.textContent = "It's a Draw! 😐";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}


function checkWin() {
    return winCombos.some(combo => {
        return combo.every(i => cells[i] === currentPlayer);
    });
}


function restartGame() {
    currentPlayer = 'X';
    gameActive = true;
    cells = Array(9).fill('');
    statusText.textContent = "Player X's turn";
    createBoard();
}

createBoard();