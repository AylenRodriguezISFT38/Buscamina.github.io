'use strict';
export function isValidPlayerName(name) {
  if (!name) return false;
  var s = String(name).trim();
  var letters = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
  return letters.replace(/\s/g,'').length >= 3;
}

export function isValidContactName(n){ return isValidPlayerName(n); }

export function isValidEmail(email) {
  if (!email) return false;
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function isValidMessage(m) {
  return String(m || '').trim().length > 5;
}
