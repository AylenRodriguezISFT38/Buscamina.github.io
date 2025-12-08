'use strict';
import Board from './board.js';
import * as UI from './ui.js';
import * as Storage from './storage.js';
import { getPreset } from './difficulty.js';
import { formatTime, nowIso } from './utils.js';
import { isValidPlayerName } from './validation.js';
import { ICONS, SOUNDS } from './config.js';

let board = null;
let rows = 8, cols = 8, mines = 10;
let timerInterval = null;
let seconds = 0;
let started = false;
let ended = false;
let playerName = Storage.loadName() || '';
let currentDifficulty = (Storage.loadSettings()||{}).difficulty || 'easy';

const elBoard = () => document.getElementById('board-wrapper');
const elTimer = () => document.getElementById('timer');
const elMines = () => document.getElementById('mines-remaining');

export function init() {  bindControls();

  applyPreset(currentDifficulty);

  if (!playerName) UI.showNameModal();
  else startNewGame();
}

function bindControls() {
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', restart);

  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', function(){
    const nameInput = document.getElementById('player-name');
    const nameErr = document.getElementById('name-error');
    const v = (nameInput && nameInput.value)||'';
    if (!isValidPlayerName(v)) { if (nameErr) nameErr.textContent='Ingresá al menos 3 letras'; return; }
    playerName = v.trim();
    Storage.saveName(playerName);
    if (nameErr) nameErr.textContent='';
    UI.hideNameModal();
    startNewGame();
  });

  const difficultySelect = document.getElementById('difficulty-select');
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
      const active = document.activeElement;
      if (active && active.classList && active.classList.contains('cell')) {
        const rr = parseInt(active.getAttribute('data-r'),10);
        const cc = parseInt(active.getAttribute('data-c'),10);
        toggleFlag(rr,cc);
      }
    }
  });

  const sortScore = document.getElementById('sort-by-score');
  if (sortScore) sortScore.addEventListener('click', function(){ UI.sortRanking('time'); });
  const sortDate = document.getElementById('sort-by-date');
  if (sortDate) sortDate.addEventListener('click', function(){ UI.sortRanking('date'); });
  const clearRank = document.getElementById('clear-ranking');
  if (clearRank) clearRank.addEventListener('click', function(){ Storage.clearResults(); UI.openRanking(); });
}

function applyPreset(key) {
  const p = getPreset(key);
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
  const wrapper = elBoard();
  wrapper.innerHTML = '';
  wrapper.style.gridTemplateColumns = `repeat(${cols}, auto)`;
  for (let r = 0; r < rows; r++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.setAttribute('tabindex','0');
      cell.setAttribute('data-r', r);
      cell.setAttribute('data-c', c);

      cell.addEventListener('mousedown', function(e){ if (e.button === 0) UI.setFace('surprised'); });
      cell.addEventListener('mouseup', function(e){ setTimeout(function(){ if (!ended) UI.setFace('happy'); }, 120); if (e.button === 0) leftAction(r,c); });
      cell.addEventListener('contextmenu', function(e){ e.preventDefault(); toggleFlag(r,c); return false; });
      cell.addEventListener('keydown', function(e){ if (e.key === 'Enter') leftAction(r,c); if (e.key === 'f' || e.key === 'F') toggleFlag(r,c); });

      rowDiv.appendChild(cell);
    }
    wrapper.appendChild(rowDiv);
  }
}

function leftAction(r,c) {
  if (ended) return;
  if (board.flagged[r][c]) return;
  if (!started) { started = true; board.placeMinesAvoiding(r,c); startTimer(); }
  const results = board.revealCell(r,c);
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
  const cell = getCell(r,c);
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

function playExplodeAndEnd(r,c) {
  ended = true;
  stopTimer();
  const minesAll = board.revealAllMines();
  minesAll.forEach(function(m){
    var el = getCell(m.r, m.c);
    if (!el) return;
    el.classList.add('revealed');
    el.innerHTML = '<img src="'+ICONS.mine+'" alt="mine">';
  });
  UI.setFace('dead');
  Storage.saveResult({
    name: playerName,
    difficulty: currentDifficulty,
    time: seconds,
    timeText: formatTime(seconds),
    date: nowIso()
  });
  UI.showResultModal('Perdiste', playerName + ', pisaste una mina.', false);
}

function checkWin() {
  var safe = 0;
  for (var r=0;r<rows;r++) for (var c=0;c<cols;c++) if (board.grid[r][c] !== 'M' && board.revealed[r][c]) safe++;
  if (safe === (rows*cols - mines)) {
    ended = true; stopTimer();
    UI.setFace('happy');
    Storage.saveResult({
      name: playerName,
      difficulty: currentDifficulty,
      time: seconds,
      timeText: formatTime(seconds),
      date: nowIso()
    });
    UI.showResultModal('Ganaste', playerName + ', completaste el tablero en ' + formatTime(seconds) + '.', true);
  }
}

/* timer */
function startTimer() {
  seconds = 0; UI.setTimerText(seconds);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function(){ seconds++; UI.setTimerText(seconds); }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function getCell(r,c) { var wrapper = elBoard(); if (!wrapper) return null; return wrapper.children[r].children[c]; }

export default { init, restart, startNewGame };
