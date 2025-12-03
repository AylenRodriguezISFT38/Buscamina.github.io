'use strict';

var Validation = (function () {
  function isValidPlayerName(name) {
    if (!name) { return false; }
    var s = String(name).trim();

    var lettersOnly = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '');
    return lettersOnly.length >= 3;
  }

  function isAlphaNum(s) {
    if (!s) { return false; }
    return /^[A-Za-z0-9 ]+$/.test(s);
  }

  function isValidEmail(e) {
    if (!e) { return false; }
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  function isValidMessage(msg) {
    if (!msg) { return false; }
    return String(msg).trim().length > 5;
  }

  function isValidMinesCount(mines, rows, cols) {
    var m = parseInt(mines, 10) || 0;
    return m > 0 && m < (rows * cols);
  }

  return {
    isValidPlayerName: isValidPlayerName,
    isAlphaNum: isAlphaNum,
    isValidEmail: isValidEmail,
    isValidMessage: isValidMessage,
    isValidMinesCount: isValidMinesCount
  };
}());
