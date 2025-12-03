'use strict';

var Utils = (function () {
  function qs(selector) { return document.querySelector(selector); }
  function qsa(selector) { return Array.prototype.slice.call(document.querySelectorAll(selector)); }

  function el(tag, attrs) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) { e.setAttribute(k, attrs[k]); }
      }
    }
    return e;
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' + m : String(m)) + ':' + (s < 10 ? '0' + s : String(s));
  }

  function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  return {
    qs: qs,
    qsa: qsa,
    el: el,
    formatTime: formatTime,
    shuffleArray: shuffleArray
  };
}());
