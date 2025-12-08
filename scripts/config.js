'use strict';
export const PRESETS = {
  easy:  { rows: 8,  cols: 8,  mines: 10 },
  medium:{ rows: 12, cols: 12, mines: 25 },
  hard:  { rows: 16, cols: 16, mines: 40 }
};

export const ICONS = {
  flag: 'icons/red-flag.png',
  mine: 'icons/bomb.png',
  blast: 'icons/blast.png',
  face_happy: 'icons/happiness.png',
  face_surprised: 'icons/surprised.png',
  face_dead: 'icons/dead.png',
  id_card: 'icons/id-card.png',
  crane: 'icons/crane.png',
  clock: 'icons/clock.png',
  bomb: 'icons/blast.png',
  day: 'icons/day-mode.png',
  night: 'icons/moon.png'
};

export const SOUNDS = {
  open: 'sounds/open.mp3',
  close: 'sounds/close.mp3',
  reveal: 'sounds/flag.mp3',
  explode: 'sounds/boom.mp3',
  win: 'sounds/win-game.mp3',
  click_1: 'sounds/click_1.mp3',
  click_2: 'sounds/click_2.mp3'
};
