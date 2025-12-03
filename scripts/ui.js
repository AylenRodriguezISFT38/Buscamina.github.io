'use strict';

var UI = (function () {
  var modalEl = Utils.qs('#modal');
  var minesRemainingEl = Utils.qs('#mines-remaining');
  var timerEl = Utils.qs('#timer');
  var faceEl = Utils.qs('#face');
  var gridEl = Utils.qs('#grid'); 

  function setMinesRemaining(n) {
    if (minesRemainingEl) { minesRemainingEl.textContent = String(n); }
  }

  function setTimer(sec) {
    if (timerEl) { timerEl.textContent = Utils.formatTime(sec); }
  }

  function setFace(emoji) {
    if (faceEl) { faceEl.textContent = emoji; }
  }

  function showModal(title, message, cbOk) {

    if (!modalEl) {
      modalEl = Utils.el('div', { id: 'modal', 'class': 'modal' });
      document.body.appendChild(modalEl);
    }
    modalEl.innerHTML = '';
    var content = Utils.el('div', { 'class': 'modal-content' });
    var h = Utils.el('h2'); h.textContent = title;
    var p = Utils.el('p'); p.textContent = message;
    var ok = Utils.el('button'); ok.textContent = 'Aceptar';
    ok.addEventListener('click', function () {
      modalEl.classList.add('hidden');
      if (typeof cbOk === 'function') { cbOk(); }
    });
    content.appendChild(h);
    content.appendChild(p);
    content.appendChild(ok);
    modalEl.appendChild(content);
    modalEl.classList.remove('hidden');
  }

  function hideModal() {
    if (modalEl) { modalEl.classList.add('hidden'); }
  }

  function playSound(name) {
    if (!CONFIG.soundsEnabled) { return; }
    try {
      var a = new Audio('sounds/' + name + '.mp3');
      a.play();
    } catch (e) {
        // nada aun
     }
  }

  function renderRanking(containerEl, list) {
    if (!containerEl) { return; }
    containerEl.innerHTML = '';
    var ol = Utils.el('ol');
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var li = Utils.el('li');
      li.textContent = (i + 1) + '. ' + (it.name || 'Anónimo') + ' - ' + it.score + ' pts - ' + (new Date(it.date)).toLocaleString() + ' - ' + Utils.formatTime(it.duration);
      ol.appendChild(li);
    }
    containerEl.appendChild(ol);
  }

  return {
    setMinesRemaining: setMinesRemaining,
    setTimer: setTimer,
    setFace: setFace,
    showModal: showModal,
    hideModal: hideModal,
    playSound: playSound,
    renderRanking: renderRanking,
    gridEl: gridEl
  };
}());
