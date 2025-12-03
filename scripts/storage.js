'use strict';

var Storage = (function () {
  var KEY = CONFIG.storageKey;

  function load() {
    var raw = localStorage.getItem(KEY);
    if (!raw) { return []; }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function pushResult(item) {
    var list = load();
    list.push(item);
    // ordenar por score (desc)
    list.sort(function (a, b) { return b.score - a.score; });
    save(list);
  }

  function clearAll() {
    localStorage.removeItem(KEY);
  }

  return {
    load: load,
    save: save,
    pushResult: pushResult,
    clearAll: clearAll
  };
}());
