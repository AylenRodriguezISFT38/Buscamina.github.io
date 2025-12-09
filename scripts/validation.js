'use strict';

export function isValidPlayerName(name) {
  if (!name) return false;
  let s = String(name).trim();

  let letters = s.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');

  return letters.replace(/\s/g, '').length >= 3;
}

export function isValidContactName(name) {
  if (!name) return false;
  const n = String(name).trim();

  const valid = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/.test(n);

  return valid && n.replace(/\s+/g, '').length >= 3;
}

export function isValidEmail(email) {
  if (!email) return false;
  const e = String(email).trim().toLowerCase();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(e);
}

export function isValidMessage(message) {
  if (!message) return false;
  return String(message).trim().length >= 6;
}
