'use strict';

export function isValidPlayerName(name) {
  if (!name) return false;
  var s = String(name).trim();

  var letters = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');

  return letters.replace(/\s/g, '').length >= 3;
}

export function isValidContactName(name) {
  if (!name) return false;
  var n = String(name).trim();

  var valid = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/.test(n);

  return valid && n.replace(/\s+/g, '').length >= 3;
}

export function isValidEmail(email) {
  if (!email) return false;
  var e = String(email).trim().toLowerCase();
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e);
}

export function isValidMessage(message) {
  if (!message) return false;
  return String(message).trim().length >= 6;
}
