'use strict';
import { ICONS } from './config.js';
import * as Storage from './storage.js';

export function init() {
  var settings = Storage.loadSettings() || {};
  var theme = settings.theme || 'dark';
  var icon = document.getElementById('theme-icon');
  if (theme === 'light') {
    document.body.classList.add('light');
    if (icon) icon.src = ICONS.day;
  } else {
    document.body.classList.remove('light');
    if (icon) icon.src = ICONS.night;
  }
}
