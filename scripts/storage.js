'use strict';
function savePlayerToStorage(name) {
  try { localStorage.setItem('ms-player', String(name)); } catch (e) { /* ignore */ }
}
function loadPlayerFromStorage() {
  try { return localStorage.getItem('ms-player') || ''; } catch (e) { return ''; }
}
