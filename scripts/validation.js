'use strict';
function isValidPlayerName(name) {
  if (!name) { return false; }
  var s = String(name).trim();
  var lettersOnly = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, '');
  return lettersOnly.length >= 3;
}
function isValidMines(mines, rows, cols) {
  var m = parseInt(mines, 10) || 0;
  return m > 0 && m < (rows * cols);
}
