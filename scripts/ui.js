'use strict';
import { SOUNDS, ICONS } from './config.js';
import * as Storage from './storage.js';
import { formatTime, formatDate } from './utils.js';

const audioOpen = SOUNDS.open ? new Audio(SOUNDS.open) : null;
const audioClose = SOUNDS.close ? new Audio(SOUNDS.close) : null;
const audioReveal = SOUNDS.reveal ? new Audio(SOUNDS.reveal) : null;
const audioExplode = SOUNDS.explode ? new Audio(SOUNDS.explode) : null;
const audioWin = SOUNDS.win ? new Audio(SOUNDS.win) : null;

function play(a){ try{ if(a){ a.currentTime=0; a.play(); }}catch(e){} }

let rankingSortState = {
  score: 1,
  time: 1,
  date: 1
};

export function init(){
  const rankingBtn = document.getElementById('ranking-btn');
  if (rankingBtn) rankingBtn.addEventListener('click', openRanking);

  const closeRanking = document.getElementById('close-ranking');
  if (closeRanking) closeRanking.addEventListener('click', closeRankingModal);

  const sortScore = document.getElementById('sort-by-score'); 
  if (sortScore) sortScore.addEventListener('click', ()=> sortRanking('score'));

  const sortTime = document.getElementById('sort-by-time');
  if (sortTime) sortTime.addEventListener('click', ()=> sortRanking('time'));

  const sortDate = document.getElementById('sort-by-date');
  if (sortDate) sortDate.addEventListener('click', ()=> sortRanking('date'));

  const clearBtn = document.getElementById('clear-ranking');
  if (clearBtn) clearBtn.addEventListener('click', ()=>{
    Storage.clearResults();
    openRanking();
  });

  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const ok = document.getElementById('result-ok');
  const restart = document.getElementById('result-restart');
  if (ok) ok.addEventListener('click', hideResultModal);
  if (restart) restart.addEventListener('click', ()=>{ hideResultModal(); window.location.reload(); });

  loadAndApplySettings();
}

export function showNameModal(){
  const m = document.getElementById('name-modal');
  if (m){ m.classList.remove('hidden'); play(audioOpen); }
}
export function hideNameModal(){
  const m = document.getElementById('name-modal');
  if (m){ m.classList.add('hidden'); play(audioClose); }
}

export function showResultModal(title,message,isWin){
  const modal = document.getElementById('result-modal');
  if(!modal) return;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-message').textContent = message;
  const icon = document.getElementById('result-icon');
  if(icon) icon.src = isWin ? ICONS.face_happy : ICONS.crane;

  modal.classList.remove('hidden');
  play(isWin ? audioWin : audioExplode);
}
export function hideResultModal(){
  const modal = document.getElementById('result-modal');
  if(modal){ modal.classList.add('hidden'); play(audioClose); }
}

export function setFace(key){
  const el = document.getElementById('face-icon');
  if(!el) return;
  if(key==='happy') el.src = ICONS.face_happy;
  if(key==='surprised') el.src = ICONS.face_surprised;
  if(key==='dead') el.src = ICONS.face_dead;
}

export function setMinesRemaining(n){
  const el = document.getElementById('mines-remaining');
  if(el) el.textContent = String(n);
}
export function setTimerText(sec){
  const el = document.getElementById('timer');
  if(el) el.textContent = formatTime(sec);
}

export function openRanking(){
  const modal = document.getElementById('ranking-modal');
  const list = document.getElementById('ranking-list');
  list.innerHTML = '';

  let arr = Storage.loadResults() || [];
  if(!arr.length){
    list.innerHTML = '<p>No hay partidas guardadas</p>';
    modal.classList.remove('hidden');
    play(audioOpen);
    return;
  }

  arr = arr.map(it => ({
    name: it.name || '',
    difficulty: it.difficulty || '',
    score: Number(it.score || 0),
    time: Number(it.time || 0),
    timeText: it.timeText || formatTime(it.time || 0),
    date: it.date || ''
  }));

  renderRankingList(arr);
  modal.classList.remove('hidden');
  play(audioOpen);
}

function renderRankingList(arr){
  const list = document.getElementById('ranking-list');
  list.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'row-item header';
  header.style.display = 'grid';
  header.style.gridTemplateColumns = '2fr 1fr 1fr 1fr';
  header.style.gap = '8px';
  header.style.padding = '8px 6px';
  header.style.fontWeight = '700';
  header.innerHTML = `
    <div>Jugador (dif)</div>
    <div >Puntaje</div>
    <div >Tiempo</div>
    <div >Fecha</div>
  `;
  list.appendChild(header);

  arr.forEach(it=>{
    const row = document.createElement('div');
    row.className = 'row-item';
    row.style.display = 'grid';
    row.style.gridTemplateColumns = '2fr 1fr 1fr 1fr';
    row.style.gap = '8px';
    row.style.padding = '6px 6px';

    row.innerHTML = `
      <div>${it.name} (${it.difficulty})</div>
      <div >${it.score}</div>
      <div >${it.timeText}</div>
      <div >${formatDate(it.date)}</div>
    `;

    list.appendChild(row);
  });
}


function parseTimeToSeconds(t){
  if (t === null || t === undefined) return 0;

  if (typeof t === 'number' && !isNaN(t)) return t;

  if (typeof t === 'string' && t.indexOf(':') !== -1) {
    var parts = t.split(':').map(function(p){ return p.trim(); }).filter(Boolean);
    var nums = parts.map(function(p){ return parseFloat(p.replace(',', '.')) || 0; });

    if (nums.length === 3) {
      return nums[0] * 3600 + nums[1] * 60 + nums[2];
    }
    if (nums.length === 2) { 
      return nums[0] * 60 + nums[1];
    }
    var total = 0, weight = nums.length - 1;
    for (var i = 0; i < nums.length; i++) {
      total += nums[i] * Math.pow(60, weight - i);
    }
    return total;
  }

  if (typeof t === 'string') {
    var n = parseFloat(t.replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  return 0;
}

export function sortRanking(key){
  rankingSortState[key] *= -1;

  var arr = Storage.loadResults() || [];

  arr = arr.map(function(it){
    var timeRaw = (it && it.time) ? it.time : (it && it.timeText ? it.timeText : '');
    var secs = parseTimeToSeconds(timeRaw);
    return {
      name: it.name || '',
      difficulty: it.difficulty || '',
      score: Number(it.score || 0),
      time: secs, 
      timeText: (typeof it.timeText === 'string' && it.timeText.length) ? it.timeText : formatTime(secs),
      date: it.date || ''
    };
  });

  arr.sort(function(a,b){
    if (key === 'date') {
      var da = new Date(a.date).getTime() || 0;
      var db = new Date(b.date).getTime() || 0;
      return rankingSortState.date * (da - db);
    }

    if (key === 'time') {
      return rankingSortState.time * (a.time - b.time);
    }

    if (key === 'score') {
      return rankingSortState.score * (a.score - b.score);
    }

    return 0;
  });

  renderRankingList(arr);
}



function toggleTheme(){
  const settings = Storage.loadSettings() || {};
  const next = (settings.theme === 'light') ? 'dark' : 'light';
  settings.theme = next;
  Storage.saveSettings(settings);
  loadAndApplySettings();
}

function loadAndApplySettings(){
  const settings = Storage.loadSettings() || {};
  const th = settings.theme || 'dark';
  document.body.classList.toggle('light', th==='light');
}

function closeRankingModal(){
  const m = document.getElementById('ranking-modal');
  if (m){ m.classList.add('hidden'); play(audioClose); }
}
