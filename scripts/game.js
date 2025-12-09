'use strict';
import Board from './board.js';
import * as UI from './ui.js';
import * as Storage from './storage.js';
import { getPreset } from './difficulty.js';
import { formatTime, nowIso } from './utils.js';
import { isValidPlayerName } from './validation.js';
import { ICONS, SOUNDS } from './config.js';

var board = null;
var rows = 8, cols = 8, mines = 10;
var timerInterval = null;
var seconds = 0;
var started = false;
var ended = false;
var playerName = Storage.loadName() || '';
var currentDifficulty = (Storage.loadSettings()||{}).difficulty || 'easy';

var elBoard = () => document.getElementById('board-wrapper');
var elTimer = () => document.getElementById('timer');
var elMines = () => document.getElementById('mines-remaining');
document.addEventListener('touchstart', () => {}, {passive: false});

export function init() {
  bindControls();
  applyPreset(currentDifficulty);
  if (!playerName) UI.showNameModal();
  else startNewGame();
}

function bindControls() {
  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', restart);

  var startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', function(){
    var nameInput = document.getElementById('player-name');
    var nameErr = document.getElementById('name-error');
    var v = (nameInput && nameInput.value)||'';
    if (!isValidPlayerName(v)) { if (nameErr) nameErr.textContent='Ingresá al menos 3 letras'; return; }
    playerName = v.trim();
    Storage.saveName(playerName);
    if (nameErr) nameErr.textContent='';
    UI.hideNameModal();
    startNewGame();
  });

  var difficultySelect = document.getElementById('difficulty-select');
  if (difficultySelect) {
    difficultySelect.value = currentDifficulty;
    difficultySelect.addEventListener('change', function(){
      currentDifficulty = this.value;
      Storage.saveSettings({ difficulty: currentDifficulty, theme: (Storage.loadSettings()||{}).theme || 'dark' });
      applyPreset(currentDifficulty);
      restart();
    });
  }

  UI.init();

  document.addEventListener('keydown', function(e){
    if (e.code === 'Space') { e.preventDefault(); restart(); }
    if (e.key === 'f' || e.key === 'F') {
      var active = document.activeElement;
      if (active && active.classList && active.classList.contains('cell')) {
        var rr = parseInt(active.getAttribute('data-r'),10);
        var cc = parseInt(active.getAttribute('data-c'),10);
        toggleFlag(rr,cc);
      }
    }
  });

  var sortScore = document.getElementById('sort-by-score');
  if (sortScore) sortScore.addEventListener('click', function(){ UI.sortRanking('score'); });
  var sortDate = document.getElementById('sort-by-date');
  if (sortDate) sortDate.addEventListener('click', function(){ UI.sortRanking('date'); });
  var clearRank = document.getElementById('clear-ranking');
  if (clearRank) clearRank.addEventListener('click', function(){ Storage.clearResults(); UI.openRanking(); });
}

function applyPreset(key) {
  var p = getPreset(key);
  rows = p.rows; cols = p.cols; mines = p.mines;
}

function startNewGame() {
  stopTimer();
  seconds = 0; started = false; ended = false;
  board = new Board(rows, cols, mines);
  board.initEmpty();
  renderBoard();
  UI.setMinesRemaining(mines);
  UI.setTimerText(0);
  UI.setFace('happy');
}

function restart() { startNewGame(); }

function renderBoard() {
  var wrapper = elBoard();
  wrapper.innerHTML = '';
  wrapper.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  for (let r = 0; r < rows; r++) {
    var rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let c = 0; c < cols; c++) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('tabindex','0');
      cell.setAttribute('data-r', r);
      cell.setAttribute('data-c', c);

      cell.addEventListener('mousedown', function(e){ if (e.button === 0) UI.setFace('surprised'); });
      cell.addEventListener('mouseup', function(e){ setTimeout(function(){ if (!ended) UI.setFace('happy'); }, 120); if (e.button === 0) leftAction(r,c); });
      cell.addEventListener('contextmenu', function(e){ e.preventDefault(); toggleFlag(r,c); return false; });

      let touchTimer = null;
      let touchMoved = false;

      cell.addEventListener('touchstart', (ev) => {
        touchMoved = false;
        touchTimer = setTimeout(() => {
          toggleFlag(r, c);
          touchTimer = null;
        }, 300);
      });

      cell.addEventListener('touchmove', () => {
        touchMoved = true;
        if (touchTimer) { clearTimeout(touchTimer); touchTimer = null; }
      });

      cell.addEventListener('touchend', (ev) => {
        if (touchTimer) {
          clearTimeout(touchTimer);
          touchTimer = null;
          if (!touchMoved) leftAction(r, c);
        }
        ev.preventDefault();
      });

      cell.addEventListener('keydown', function(e){ if (e.key === 'Enter') leftAction(r,c); if (e.key === 'f' || e.key === 'F') toggleFlag(r,c); });

      rowDiv.appendChild(cell);
    }
    wrapper.appendChild(rowDiv);
  }
}

function handleChord(r, c) {
  if (!board || ended) return;
  if (!board.revealed[r][c]) return;
  var val = board.grid[r][c];
  if (typeof val !== 'number' || val <= 0) return;

  let flags = 0;
  var neigh = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      var nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      neigh.push({r: nr, c: nc});
      if (board.flagged[nr][nc]) flags++;
    }
  }

  if (flags !== val) return;

  for (let i = 0; i < neigh.length; i++) {
    var n = neigh[i];
    if (board.flagged[n.r][n.c] || board.revealed[n.r][n.c]) continue;
    var results = board.revealCell(n.r, n.c);
    updateDOMForResults(results);
    if (results && results.some(x => x.mine)) {
      playExplodeAndEnd(n.r, n.c);
      return;
    }
  }

  checkWin();
}

function leftAction(r,c) {
  if (ended) return;

  if (board.revealed[r] && board.revealed[r][c] && typeof board.grid[r][c] === 'number' && board.grid[r][c] > 0) {
    handleChord(r, c);
    return;
  }

  if (board.flagged[r][c]) return;
  if (!started) { started = true; board.placeMinesAvoiding(r,c); startTimer(); }
  var results = board.revealCell(r,c);
  updateDOMForResults(results);
  if (results && results.some(x => x.mine)) {
    playExplodeAndEnd(r,c);
    return;
  }
  checkWin();
}

function toggleFlag(r,c) {
  if (ended || board.revealed[r][c]) return;
  board.toggleFlag(r,c);
  var cell = getCell(r,c);
  if (!cell) return;
  if (board.flagged[r][c]) {
    cell.innerHTML = '<img src="'+ICONS.flag+'" alt="flag">';
    cell.classList.add('flagged');
  } else {
    cell.innerHTML = '';
    cell.classList.remove('flagged');
  }
  SOUNDS.reveal && new Audio(SOUNDS.reveal).play();
  UI.setMinesRemaining(mines - board.countFlags());
}

function updateDOMForResults(results) {
  if (!results) return;
  results.forEach(function(entry){
    var el = getCell(entry.r, entry.c);
    if (!el) return;
    el.classList.add('revealed');
    el.innerHTML = '';
    if (entry.mine) {
      el.classList.add('blast');
      el.innerHTML = '<img src="'+ICONS.blast+'" alt="blast">';
    } else if (entry.val > 0) {
      el.textContent = String(entry.val);
    }
  });
}

function calculateScoreOnWin() {
  let revealedCount = 0;
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) if (board.revealed[r][c]) revealedCount++;

  let correctFlags = 0, incorrectFlags = 0;
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (board.flagged[r][c]) {
        if (board.grid[r][c] === 'M') correctFlags++;
        else incorrectFlags++;
      }
    }
  }

  var t = Math.max(1, seconds);
  var base = revealedCount * 10;
  var flagsBonus = correctFlags * 50;
  var flagsPenalty = incorrectFlags * 20;
  var timeBonus = Math.floor((mines / t) * 500); // minas / tiempo * factor

  var raw = base + flagsBonus - flagsPenalty + timeBonus;
  return Math.max(0, Math.floor(raw));
}

function calculateScoreOnLoss() {
  // similar but penalizado por no completar
  let revealedCount = 0;
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) if (board.revealed[r][c]) revealedCount++;

  let correctFlags = 0, incorrectFlags = 0;
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (board.flagged[r][c]) {
        if (board.grid[r][c] === 'M') correctFlags++;
        else incorrectFlags++;
      }
    }
  }

  var t = Math.max(1, seconds);
  var base = Math.floor(revealedCount * 5); // less weight on loss
  var flagsBonus = Math.floor(correctFlags * 25);
  var flagsPenalty = Math.floor(incorrectFlags * 30);
  var timeBonus = Math.floor((mines / t) * 100);

  var raw = base + flagsBonus - flagsPenalty + timeBonus;
  return Math.max(0, Math.floor(raw));
}

function playExplodeAndEnd(r,c) {
  ended = true;
  stopTimer();
  var minesAll = board.revealAllMines();
  minesAll.forEach(function(m){
    var el = getCell(m.r, m.c);
    if (!el) return;
    el.classList.add('revealed');
    el.innerHTML = '<img src="'+ICONS.mine+'" alt="mine">';
  });
  UI.setFace('dead');

  var score = calculateScoreOnLoss();

  Storage.saveResult({
    name: playerName,
    difficulty: currentDifficulty,
    time: seconds,
    timeText: formatTime(seconds),
    date: nowIso(),
    score: score
  });

  UI.showResultModal('Perdiste', playerName + ', pisaste una mina. Score: ' + score, false);
}

function checkWin() {
  var safe = 0;
  for (var r=0;r<rows;r++) for (var c=0;c<cols;c++) if (board.grid[r][c] !== 'M' && board.revealed[r][c]) safe++;
  if (safe === (rows*cols - mines)) {
    ended = true; stopTimer();
    UI.setFace('happy');

    var score = calculateScoreOnWin();

    Storage.saveResult({
      name: playerName,
      difficulty: currentDifficulty,
      time: seconds,
      timeText: formatTime(seconds),
      date: nowIso(),
      score: score
    });

    UI.showResultModal('Ganaste', playerName + ', completaste el tablero en ' + formatTime(seconds) + '. Score: ' + score, true);
  }
}

function startTimer() {
  seconds = 0; UI.setTimerText(seconds);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function(){ seconds++; UI.setTimerText(seconds); }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function getCell(r,c) { var wrapper = elBoard(); if (!wrapper) return null; return wrapper.children[r].children[c]; }

export default { init, restart, startNewGame };
