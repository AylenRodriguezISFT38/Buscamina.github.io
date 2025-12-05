var board = [];
var revealed = [];
var flagged = [];
var minesPositions = [];
var timerInterval = null;
var time = 0;
var gameOver = false;

var boardWrapper = document.getElementById("board-wrapper");
var timerEl = document.getElementById("timer");
var minesRemainingEl = document.getElementById("mines-remaining");

function init() {
  gameOver = false;
  time = 0;
  updateTimer();
  clearInterval(timerInterval);

  setFaceHappy();

  createArrays();
  placeMines();
  renderBoard();
}

function createArrays() {
  board = [];
  revealed = [];
  flagged = [];
  minesPositions = [];

  var r, c;
  for (r = 0; r < ROWS; r++) {
    board[r] = [];
    revealed[r] = [];
    flagged[r] = [];
    for (c = 0; c < COLS; c++) {
      board[r][c] = 0;
      revealed[r][c] = false;
      flagged[r][c] = false;
    }
  }
}

function placeMines() {
  var placed = 0;
  while (placed < MINES) {
    var r = randomInt(ROWS);
    var c = randomInt(COLS);
    if (board[r][c] !== "M") {
      board[r][c] = "M";
      minesPositions.push([r, c]);
      placed++;
    }
  }
}

function renderBoard() {
  boardWrapper.innerHTML = "";
  var r, c;

  for (r = 0; r < ROWS; r++) {
    var rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (c = 0; c < COLS; c++) {
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = r;
      cell.dataset.c = c;

      cell.onmousedown = handleMouseDown;
      cell.oncontextmenu = function(e){ e.preventDefault(); };

      rowDiv.appendChild(cell);
    }

    boardWrapper.appendChild(rowDiv);
  }
}

function handleMouseDown(e) {
  if (gameOver) return;

  var r = parseInt(this.dataset.r);
  var c = parseInt(this.dataset.c);

  if (e.button === 0) {  
    setFaceSurprised();
    setTimeout(setFaceHappy, 120);
    reveal(r, c);
  }

  if (e.button === 2) {
    toggleFlag(r, c);
  }
}

function toggleFlag(r, c) {
  if (revealed[r][c]) return;

  flagged[r][c] = !flagged[r][c];

  var cell = getCell(r, c);
  if (flagged[r][c]) {
    cell.innerHTML = '<img src="icons/red-flag.png">';
  } else {
    cell.innerHTML = "";
  }

  updateFlagsCount();
}

function reveal(r, c) {
  if (flagged[r][c] || revealed[r][c]) return;

  if (!timerInterval) startTimer();

  revealed[r][c] = true;
  var cell = getCell(r, c);
  cell.classList.add("revealed");

  if (board[r][c] === "M") {
    explode(r, c);
    return;
  }

  var count = countAdjacent(r, c);
  if (count > 0) cell.textContent = count;

  if (count === 0) revealNeighbors(r, c);

  checkWin();
}

function explode(r, c) {
  gameOver = true;
  setFaceDead();

  var cell = getCell(r, c);
  cell.classList.add("blast");
  cell.innerHTML = '<img src="icons/blast.png">';

  clearInterval(timerInterval);

  showResultModal("Perdiste 😵", "La mina explotó.");
}

function countAdjacent(r, c) {
  var total = 0;
  var dr, dc, nr, nc;

  for (dr = -1; dr <= 1; dr++) {
    for (dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      nr = r + dr;
      nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (board[nr][nc] === "M") total++;
      }
    }
  }
  return total;
}

function revealNeighbors(r, c) {
  var dr, dc, nr, nc;

  for (dr = -1; dr <= 1; dr++) {
    for (dc = -1; dc <= 1; dc++) {
      nr = r + dr;
      nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        if (!revealed[nr][nc]) reveal(nr, nc);
      }
    }
  }
}

function checkWin() {
  var r, c;
  for (r = 0; r < ROWS; r++) {
    for (c = 0; c < COLS; c++) {
      if (!revealed[r][c] && board[r][c] !== "M") return;
    }
  }

  clearInterval(timerInterval);
  gameOver = true;

  showResultModal("¡Ganaste! 🎉", "Completaste el tablero.");
}

function getCell(r, c) {
  return boardWrapper.children[r].children[c];
}

function startTimer() {
  timerInterval = setInterval(function(){
    time++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  var min = Math.floor(time / 60);
  var sec = time % 60;
  timerEl.textContent =
    (min < 10 ? "0"+min : min) + ":" + (sec < 10 ? "0"+sec : sec);
}

function updateFlagsCount() {
  var count = 0;
  var r, c;
  for (r = 0; r < ROWS; r++) {
    for (c = 0; c < COLS; c++) {
      if (flagged[r][c]) count++;
    }
  }
  minesRemainingEl.textContent = MINES - count;
}

/*** EVENTOS ***/
document.getElementById("reset-btn").onclick = init;
document.getElementById("start-btn").onclick = function(){
  var name = document.getElementById("player-name").value;
  var err = document.getElementById("name-error");

  if (!isValidName(name)) {
    err.textContent = "Nombre inválido";
    return;
  }

  saveName(name);
  document.getElementById("name-modal").classList.add("hidden");
  init();
};

document.getElementById("result-ok").onclick = function(){
  document.getElementById("result-modal").classList.add("hidden");
};

document.getElementById("result-restart").onclick = function(){
  document.getElementById("result-modal").classList.add("hidden");
  init();
};
