const game = document.getElementById('game');
const rows = 10;
const cols = 10;
const minesCount = 10;

let board = [];

function createBoard() {
  board = [];
  game.innerHTML = '';
  game.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', revealCell);
      game.appendChild(cell);
      board[r][c] = { mine: false, revealed: false, element: cell };
    }
  }

  placeMines();
}

function placeMines() {
  let placed = 0;
  while (placed < minesCount) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      placed++;
    }
  }
}

function revealCell(e) {
  const r = parseInt(e.target.dataset.row);
  const c = parseInt(e.target.dataset.col);
  const cell = board[r][c];

  if (cell.revealed) return;
  cell.revealed = true;
  cell.element.classList.add('revealed');

  if (cell.mine) {
    cell.element.classList.add('mine');
    cell.element.textContent = '💣';
    alert('¡Perdiste!');
    revealAllMines();
    return;
  }

  const minesAround = countMinesAround(r, c);
  if (minesAround > 0) {
    cell.element.textContent = minesAround;
  } else {
    revealAdjacent(r, c);
  }
}

function countMinesAround(r, c) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (board[nr][nc].mine) count++;
      }
    }
  }
  return count;
}

function revealAdjacent(r, c) {
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        const neighbor = board[nr][nc];
        if (!neighbor.revealed && !neighbor.mine) {
          neighbor.element.click();
        }
      }
    }
  }
}

function revealAllMines() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) {
        board[r][c].element.classList.add('mine');
        board[r][c].element.textContent = '💣';
      }
    }
  }
}

createBoard();
