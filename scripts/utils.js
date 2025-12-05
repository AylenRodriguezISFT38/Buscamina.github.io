'use strict';
function randInt(max) {
  return Math.floor(Math.random() * max);
}
function isInside(r, c, rows, cols) {
  return (r >= 0 && r < rows && c >= 0 && c < cols);
}
function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return (m < 10 ? '0' + m : String(m)) + ':' + (s < 10 ? '0' + s : String(s));
}
