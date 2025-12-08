'use strict';
const LS_KEYS = {
  ranking: 'ms_ranking_v1',
  settings: 'ms_settings_v1',
  player: 'ms_player_v1'
};

export function saveResult(result) {
  try {
    var raw = localStorage.getItem(LS_KEYS.ranking);
    var arr = raw ? JSON.parse(raw) : [];
    arr.push(result);
    localStorage.setItem(LS_KEYS.ranking, JSON.stringify(arr));
  } catch (e) {}
}

export function loadResults() {
  try {
    var raw = localStorage.getItem(LS_KEYS.ranking);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

export function clearResults() {
  try { localStorage.removeItem(LS_KEYS.ranking); } catch (e) {}
}

export function saveSettings(obj) {
  try { localStorage.setItem(LS_KEYS.settings, JSON.stringify(obj || {})); } catch (e) {}
}

export function loadSettings() {
  try {
    var raw = localStorage.getItem(LS_KEYS.settings);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}

export function saveName(name) {
  try { localStorage.setItem(LS_KEYS.player, JSON.stringify({ name: name })); } catch (e) {}
}

export function loadName() {
  try {
    var raw = localStorage.getItem(LS_KEYS.player);
    var obj = raw ? JSON.parse(raw) : null;
    return obj && obj.name ? obj.name : '';
  } catch (e) { return ''; }
}
