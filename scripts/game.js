'use strict';

var CONFIG = (function () {
  return {
    difficulty: {
      easy:   { rows: 8,  cols: 8,  mines: 10 },
      medium: { rows: 12, cols: 12, mines: 25 },
      hard:   { rows: 16, cols: 16, mines: 40 }
    },
    defaultDifficulty: 'easy',
    cellSizePx: 40,
    soundsEnabled: true,
    storageKey: 'minesweeper_results_v1'
  };
}());

// variables del juego
var rows = 8;
var cols = 8;
var totalMines = 10;
var grid = [];
var revealedCount = 0;
var flagsPlaced = 0;
var gameStarted = false;
var timerInterval = null;
var secondsPassed = 0;

var gridElement = document.getElementById("gameGrid");
var mineCountElement = document.getElementById("mineCount");
var timerElement = document.getElementById("timer");
var restartBtn = document.getElementById("restartBtn");

// modal
var modal = document.getElementById("nameModal");
var startBtn = document.getElementById("startGameBtn");
var playerNameInput = document.getElementById("playerName");
var nameError = document.getElementById("nameError");

modal.style.display = "flex";

// validar nombre
startBtn.onclick = function () {
    var name = playerNameInput.value.trim();
    if (name.length < 3) {
        nameError.innerHTML = "Mínimo 3 letras";
        return;
    }
    modal.style.display = "none";
    initGame();
};

restartBtn.onclick = function () {
    resetGame();
};

function resetGame() {
    stopTimer();
    secondsPassed = 0;
    timerElement.innerHTML = "00:00";
    revealedCount = 0;
    flagsPlaced = 0;
    gameStarted = false;
    initGame();
}

function initGame() {
    grid = [];
    gridElement.innerHTML = "";
    mineCountElement.innerHTML = totalMines;

    // creacion matriz
    for (var r = 0; r < rows; r++) {
        grid[r] = [];
        for (var c = 0; c < cols; c++) {
            var cell = {
                row: r,
                col: c,
                mine: false,
                revealed: false,
                flag: false,
                element: null
            };
            grid[r][c] = cell;
        }
    }

    placeMines();
    drawGrid();
}

// minas random
function placeMines() {
    var placed = 0;
    while (placed < totalMines) {
        var r = Math.floor(Math.random() * rows);
        var c = Math.floor(Math.random() * cols);
        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            placed++;
        }
    }
}

// tablero
function drawGrid() {
    for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var div = document.createElement("div");
            div.className = "cell";
            div.dataset.row = r;
            div.dataset.col = c;

            // click izquierdo
            div.onclick = function () {
                var r = this.dataset.row;
                var c = this.dataset.col;
                revealCell(parseInt(r), parseInt(c));
            };

            // click derecho
            div.oncontextmenu = function (e) {
                e.preventDefault();
                var r = this.dataset.row;
                var c = this.dataset.col;
                toggleFlag(parseInt(r), parseInt(c));
            };

            grid[r][c].element = div;
            gridElement.appendChild(div);
        }
    }
}

function toggleFlag(r, c) {
    var cell = grid[r][c];

    if (cell.revealed) return;

    if (!cell.flag) {
        cell.flag = true;
        cell.element.classList.add("flag");
        cell.element.innerHTML = "🚩";
        flagsPlaced++;
    } else {
        cell.flag = false;
        cell.element.classList.remove("flag");
        cell.element.innerHTML = "";
        flagsPlaced--;
    }

    mineCountElement.innerHTML = totalMines - flagsPlaced;
}

function revealCell(r, c) {
    var cell = grid[r][c];

    if (cell.revealed || cell.flag) return;

    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    cell.revealed = true;
    cell.element.classList.add("revealed");

    if (cell.mine) {
        cell.element.innerHTML = "💣";
        lose();
        return;
    }

    var mines = countMines(r, c);
    if (mines > 0) {
        cell.element.innerHTML = mines;
    }

    revealedCount++;

    if (mines === 0) {
        revealEmptyNeighbors(r, c);
    }

    if (revealedCount === rows * cols - totalMines) {
        win();
    }
}

function countMines(r, c) {
    var total = 0;
    for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
            var nr = r + dr;
            var nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (grid[nr][nc].mine) total++;
            }
        }
    }
    return total;
}

function revealEmptyNeighbors(r, c) {
    for (var dr = -1; dr <= 1; dr++) {
        for (var dc = -1; dc <= 1; dc++) {
            var nr = r + dr;
            var nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                if (!grid[nr][nc].revealed && !grid[nr][nc].mine) {
                    revealCell(nr, nc);
                }
            }
        }
    }
}

function startTimer() {
    timerInterval = setInterval(function () {
        secondsPassed++;
        updateTimer();
    }, 1000);
}

function updateTimer() {
    var min = Math.floor(secondsPassed / 60);
    var sec = secondsPassed % 60;
    timerElement.innerHTML =
        (min < 10 ? "0" + min : min) + ":" +
        (sec < 10 ? "0" + sec : sec);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function win() {
    stopTimer();
    alert("¡Ganaste!");
}

function lose() {
    stopTimer();
    alert("Perdiste 😢");
}
