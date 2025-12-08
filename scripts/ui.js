'use strict';
import { SOUNDS, ICONS } from './config.js';
import * as Storage from './storage.js';
import { formatTime } from './utils.js';

const audioOpen = SOUNDS.open ? new Audio(SOUNDS.open) : null;
const audioClose = SOUNDS.close ? new Audio(SOUNDS.close) : null;
const audioReveal = SOUNDS.reveal ? new Audio(SOUNDS.reveal) : null;
const audioExplode = SOUNDS.explode ? new Audio(SOUNDS.explode) : null;
const audioWin = SOUNDS.win ? new Audio(SOUNDS.win) : null;

function play(a) { try{ if (a) { a.currentTime = 0; a.play(); } } catch(e){} }

export function init() {
  var rankingBtn = document.getElementById('ranking-btn');
  if (rankingBtn) rankingBtn.addEventListener('click', openRanking);

  var closeRanking = document.getElementById('close-ranking');
  if (closeRanking) closeRanking.addEventListener('click', closeRankingModal);

  var sortScore = document.getElementById('sort-by-score');
  if (sortScore) sortScore.addEventListener('click', function(){ sortRanking('time'); });

  var sortDate = document.getElementById('sort-by-date');
  if (sortDate) sortDate.addEventListener('click', function(){ sortRanking('date'); });

  var clearBtn = document.getElementById('clear-ranking');
  if (clearBtn) clearBtn.addEventListener('click', function(){ Storage.clearResults(); openRanking(); });

  var themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  var ok = document.getElementById('result-ok');
  var restart = document.getElementById('result-restart');
  if (ok) ok.addEventListener('click', function(){ hideResultModal(); });
  if (restart) restart.addEventListener('click', function(){ hideResultModal(); window.location.reload(); });

  loadAndApplySettings();
}

export function showNameModal() {
  var m = document.getElementById('name-modal'); if (m) { m.classList.remove('hidden'); play(audioOpen); }
}

export function hideNameModal() {
  var m = document.getElementById('name-modal'); if (m) { m.classList.add('hidden'); play(audioClose); }
}

export function showResultModal(title, message, isWin) {
  var modal = document.getElementById('result-modal');
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
  var icon = document.getElementById('result-icon');
  if (icon) icon.src = isWin ? ICONS.face_happy : ICONS.crane;
  modal.classList.remove('hidden');
  play(isWin ? audioWin : audioExplode);
}

export function hideResultModal() {
  var modal = document.getElementById('result-modal'); if (modal) { modal.classList.add('hidden'); play(audioClose); }
}

export function setFace(key) {
  var el = document.getElementById('face-icon'); if (!el) return;
  if (key === 'happy'){ el.src = ICONS.face_happy; }
  if (key === 'surprised') el.src = ICONS.face_surprised;
  if (key === 'dead') el.src = ICONS.face_dead;
   
}

export function setMinesRemaining(n) { var el = document.getElementById('mines-remaining'); if (el) el.textContent = String(n); 
}
export function setTimerText(sec) { var el = document.getElementById('timer'); if (el) el.textContent = formatTime(sec); }

export function openRanking() {
  var modal = document.getElementById('ranking-modal');
  var list = document.getElementById('ranking-list');
  list.innerHTML = '';
  var arr = Storage.loadResults() || [];
  if (!arr.length) { list.innerHTML = '<p>No hay partidas guardadas</p>'; modal.classList.remove('hidden'); play(audioOpen); return; }
  for (var i = 0; i < arr.length; i++) {
    var it = arr[i];
    var row = document.createElement('div');
    row.className = 'row-item';
    row.innerHTML = '<div>' + it.name + ' ('+ it.difficulty +')</div><div>' + it.timeText + ' - ' + it.date + '</div>';
    list.appendChild(row);
  }
  modal.classList.remove('hidden');
  play(audioOpen);
}

export function closeRankingModal() { var modal = document.getElementById('ranking-modal'); if (modal) { modal.classList.add('hidden'); play(audioClose); } }

export function sortRanking(by) {
  var arr = Storage.loadResults();
  if (!arr || !arr.length) { openRanking(); return; }
  if (by === 'time') arr.sort(function(a,b){ return a.time - b.time; });
  if (by === 'date') arr.sort(function(a,b){ return (a.date < b.date) ? 1 : -1; });
  localStorage.setItem('ms_ranking_v1', JSON.stringify(arr));
  openRanking();
}

export function loadAndApplySettings() {
  var s = Storage.loadSettings() || {};
  if (s.theme === 'light') document.body.classList.add('light');
  var sel = document.getElementById('difficulty-select');
  if (sel && s.difficulty) sel.value = s.difficulty;
  
}

export function toggleTheme() {
  var isLight = document.body.classList.toggle('light');
  var icon = document.getElementById('theme-icon');
  if (icon) icon.src = isLight ? ICONS.day : ICONS.night;
  Storage.saveSettings({ theme: isLight ? 'light' : 'dark', difficulty: (Storage.loadSettings()||{}).difficulty || 'easy' });
   play(audioOpen);
}
