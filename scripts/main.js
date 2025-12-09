'use strict';
import './config.js';
import * as Utils from './utils.js';
import * as Storage from './storage.js';
import * as Validation from './validation.js';
import * as UI from './ui.js';
import * as Difficulty from './difficulty.js';
import * as Theme from './theme.js';
import Board from './board.js';
import Game from './game.js';
import * as Contact from './contact.js';

Theme.init();
UI.init();       
Game.init();     
