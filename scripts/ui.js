'use strict';
var UI = (function () {

  function showNameModal() {
    var m = document.getElementById('name-modal');
    if (m) { m.classList.remove('hidden'); }
    var img = document.querySelector('#name-modal .big-icon');
    if (img && CONFIG && CONFIG.icons && CONFIG.icons.id_card) { img.src = CONFIG.icons.id_card; }
  }

  function hideNameModal() {
    var m = document.getElementById('name-modal');
    if (m) { m.classList.add('hidden'); }
  }

  function showResultModal(title, message, isWin) {
    var modal = document.getElementById('result-modal');
    var titleEl = document.getElementById('result-title');
    var msgEl = document.getElementById('result-message');
    var icon = document.getElementById('result-icon');

    if (titleEl) { titleEl.textContent = title; }
    if (msgEl) { msgEl.textContent = message; }
    if (icon && CONFIG && CONFIG.icons) {
      icon.src = isWin ? CONFIG.icons.face_happy : CONFIG.icons.crane;
    }
    if (modal) { modal.classList.remove('hidden'); }
  }

  function hideResultModal() {
    var modal = document.getElementById('result-modal');
    if (modal) { modal.classList.add('hidden'); }
  }

  function setMinesRemaining(n) {
    var el = document.getElementById('mines-remaining');
    if (el) { el.textContent = String(n); }
  }

  function setTimerText(sec) {
    var el = document.getElementById('timer');
    if (el) { el.textContent = formatTime(sec); }
  }

  function setFace(key) {
    var el = document.getElementById('face-icon');
    if (!el || !CONFIG || !CONFIG.icons) { return; }
    var map = {
      happy: CONFIG.icons.face_happy,
      surprised: CONFIG.icons.face_surprised,
      dead: CONFIG.icons.face_dead
    };
    var path = map[key];
    if (path) { el.src = path; }
  }

  return {
    showNameModal: showNameModal,
    hideNameModal: hideNameModal,
    showResultModal: showResultModal,
    hideResultModal: hideResultModal,
    setMinesRemaining: setMinesRemaining,
    setTimerText: setTimerText,
    setFace: setFace
  };
}());
 