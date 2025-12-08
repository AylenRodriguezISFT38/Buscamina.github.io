'use strict';
export function randInt(max) {
  return Math.floor(Math.random() * max);
}

export function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  var mm = (m < 10 ? '0' + m : '' + m);
  var ss = (s < 10 ? '0' + s : '' + s);
  return mm + ':' + ss;
}

export function nowIso() {
  return (new Date()).toISOString();
}
