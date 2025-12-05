'use strict';

/* ===========================
   VARIABLES GLOBALES
=========================== */
var rows = CONFIG.rows;
var cols = CONFIG.cols;
var totalMines = CONFIG.mines;

var board = [];
var firstClick = false;
var gameOver = false;
var flagsPlaced = 0;
var timer = 0;
var interval = null;

/* ===========================
   INICIALIZAR
=========================== */
window.onload = function () {
  UI.showNameModal();

  document.getElementById("start-btn").onclick = startGame;
  document.getElementById("result-ok").onclick = UI.hideResultModal;
  document.getElementById("result-restart").onclick = restart;
  document.getElementById("reset-btn").onclick = restart;
};

/* ===========================
   EMPEZAR JUEGO
=========================== */
function startGame() {
  var name = document.getElementById("player-name").value;
  var error = document.getElementById("name-error");

  if (!isValidPlayerName(name)) {
    error.textContent = "Nombre inválido (mínimo 3 letras)";
    return;
  }

  savePlayerToStorage(name);
  error.textContent = "";
  UI.hideNameModal();

  restart();
}

function restart() {
  clearInterval(interval);
  timer = 0;
  UI.setTimerText(0);

  firstClick = false;
  gameOver = false;
  flagsPlaced = 0;
  UI.setMinesRemaining(totalMines);

  UI.setFace("happy");

  buildEmptyBoard();
  printBoard();
}

/* ===========================
   CREAR TABLERO VACÍO
=========================== */
function buildEmptyBoard() {
  board = [];

  for (var r = 0; r < rows; r++) {
    var row = [];
    for (var c = 0; c < cols; c++) {
      row.push({
        mine: false,
        revealed: false,
        flagged: false,
        adjacent: 0
      });
    }
    board.push(row);
  }
}

/* ===========================
   COLOCAR MINAS
=========================== */
function placeMines(firstR, firstC) {
  var placed = 0;

  while (placed < totalMines) {
    var r = randInt(rows);
    var c = randInt(cols);

    if ((r === firstR && c === firstC) || board[r][c].mine) continue;

    board[r][c].mine = true;
    placed++;
  }

  countAdjacentNumbers();
}

/* ===========================
   CONTAR NÚMEROS
=========================== */
function countAdjacentNumbers() {
  var dr = [-1, -1, -1, 0, 0, 1, 1, 1];
  var dc = [-1, 0, 1, -1, 1, -1, 0, 1];

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {

      if (board[r][c].mine) continue;

      var count = 0;

      for (var i = 0; i < 8; i++) {
        var rr = r + dr[i];
        var cc = c + dc[i];

        if (isInside(rr, cc, rows, cols) && board[rr][cc].mine) {
          count++;
        }
      }

      board[r][c].adjacent = count;
    }
  }
}

/* ===========================
   IMPRIMIR TABLERO
=========================== */
function printBoard() {
  var wrapper = document.getElementById("board-wrapper");
  wrapper.innerHTML = "";

  for (var r = 0; r < rows; r++) {
    var rowDiv = document.createElement("div");
    rowDiv.className = "row";

    for (var c = 0; c < cols; c++) {
      var cell = document.createElement("div");
      cell.className = "cell";
      cell.id = "cell-" + r + "-" + c;

      attachCellEvents(cell, r, c);
      rowDiv.appendChild(cell);
    }

    wrapper.appendChild(rowDiv);
  }
}

/* ===========================
   EVENTOS (CLICK IZQ / DER)
=========================== */
function attachCellEvents(cell, r, c) {

  // CLICK IZQUIERDO
  cell.addEventListener("click", function () {
    if (gameOver) return;

    // primer click
    if (!firstClick) {
      firstClick = true;
      placeMines(r, c);

      interval = setInterval(function () {
        timer++;
        UI.setTimerText(timer);
      }, 1000);
    }

    reveal(r, c);
  });

  // CLICK DERECHO = BANDERA
  cell.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    if (gameOver) return;

    toggleFlag(r, c);
    return false;
  });
}

/* ===========================
   BANDERAS
=========================== */
function toggleFlag(r, c) {
  var cell = board[r][c];
  var div = document.getElementById("cell-" + r + "-" + c);

  if (cell.revealed) return;

  if (cell.flagged) {
    cell.flagged = false;
    flagsPlaced--;
    div.innerHTML = "";
  } else {
    if (flagsPlaced >= totalMines) return;
    cell.flagged = true;
    flagsPlaced++;

    var img = document.createElement("img");
    img.src = CONFIG.icons.flag;
    div.innerHTML = "";
    div.appendChild(img);
  }

  UI.setMinesRemaining(totalMines - flagsPlaced);
}

/* ===========================
   REVELAR CELDA
=========================== */
function reveal(r, c) {
  var cell = board[r][c];
  var div = document.getElementById("cell-" + r + "-" + c);

  if (cell.revealed || cell.flagged) return;

  cell.revealed = true;
  div.classList.add("revealed");

  // MINE?
  if (cell.mine) {
    lose(r, c);
    return;
  }

  // NUMERO
  if (cell.adjacent > 0) {
    div.textContent = cell.adjacent;
    return;
  }

  // VACIO → EXPANDIR
  expand(r, c);
}

/* ===========================
   EXPANDIR VOID
=========================== */
function expand(r, c) {
  var dr = [-1, -1, -1, 0, 0, 1, 1, 1];
  var dc = [-1, 0, 1, -1, 1, -1, 0, 1];

  for (var i = 0; i < 8; i++) {
    var rr = r + dr[i];
    var cc = c + dc[i];

    if (isInside(rr, cc, rows, cols) && !board[rr][cc].revealed) {
      reveal(rr, cc);
    }
  }
}

/* ===========================
   PERDER
=========================== */
function lose(explodeR, explodeC) {
  gameOver = true;
  clearInterval(interval);

  UI.setFace("dead");

  // mostrar minas
  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {

      var cell = board[r][c];
      var div = document.getElementById("cell-" + r + "-" + c);

      if (cell.mine) {
        div.innerHTML = "";
        var img = document.createElement("img");
        img.src = CONFIG.icons.mine;
        div.appendChild(img);
      }
    }
  }

  // celda que explotó
  var blastDiv = document.getElementById("cell-" + explodeR + "-" + explodeC);
  blastDiv.innerHTML = "";
  blastDiv.classList.add("blast");

  var bimg = document.createElement("img");
  bimg.src = CONFIG.icons.blast;
  blastDiv.appendChild(bimg);

  UI.showResultModal("Perdiste :(", "Intentá de nuevo", false);
}

/* ===========================
   GANAR
=========================== */
function checkWin() {
  var revealed = 0;

  for (var r = 0; r < rows; r++) {
    for (var c = 0; c < cols; c++) {
      if (!board[r][c].mine && board[r][c].revealed) revealed++;
    }
  }

  if (revealed === rows * cols - totalMines) {
    win();
  }
}

function win() {
  gameOver = true;
  clearInterval(interval);

  UI.setFace("happy");
  UI.showResultModal("¡Ganaste!", "Buen trabajo", true);
}
