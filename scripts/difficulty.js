'use strict';
import { PRESETS } from './config.js';

export function getPreset(key) {
  return PRESETS[key] || PRESETS.easy;
}
