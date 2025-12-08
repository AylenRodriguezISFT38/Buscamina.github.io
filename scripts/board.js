'use strict';
import { SOUNDS } from './config.js';
import { randInt } from './utils.js';

export default class Board {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    this.started = false;
  }

  initEmpty() {
    this.grid = [];
    this.revealed = [];
    this.flagged = [];
    for (var r = 0; r < this.rows; r++) {
      this.grid[r] = [];
      this.revealed[r] = [];
      this.flagged[r] = [];
      for (var c = 0; c < this.cols; c++) {
        this.grid[r][c] = 0;
        this.revealed[r][c] = false;
        this.flagged[r][c] = false;
      }
    }
  }

  placeMinesAvoiding(firstR, firstC) {
    var placed = 0;
    while (placed < this.mines) {
      var r = randInt(this.rows);
      var c = randInt(this.cols);
      if (this.grid[r][c] === 'M') continue;
      if (Math.abs(r-firstR)<=1 && Math.abs(c-firstC)<=1) continue;
      this.grid[r][c] = 'M';
      placed++;
    }
    this.calculateNumbers();
  }

  calculateNumbers() {
    var dr = [-1,-1,-1,0,0,1,1,1];
    var dc = [-1,0,1,-1,1,-1,0,1];
    for (var r=0;r<this.rows;r++){
      for (var c=0;c<this.cols;c++){
        if (this.grid[r][c] === 'M') continue;
        var cnt = 0;
        for (var i=0;i<8;i++){
          var nr = r + dr[i], nc = c + dc[i];
          if (nr>=0 && nr<this.rows && nc>=0 && nc<this.cols && this.grid[nr][nc] === 'M') cnt++;
        }
        this.grid[r][c] = cnt;
      }
    }
  }

  toggleFlag(r,c) {
    if (this.revealed[r][c]) return;
    this.flagged[r][c] = !this.flagged[r][c];
  }

  revealCell(r,c) {
    if (this.flagged[r][c] || this.revealed[r][c]) return [];
    this.revealed[r][c] = true;
    if (this.grid[r][c] === 'M') return [{r:r,c:c, mine:true}];

    SOUNDS.click_2 && new Audio(SOUNDS.click_2).play();

    var results = [{r:r,c:c, val:this.grid[r][c]}];
    if (this.grid[r][c] === 0) {
      var queue = [{r:r,c:c}];
      while (queue.length) {
        var node = queue.shift();
        for (var i=0;i<8;i++){
          var nr = node.r + (i<3?-1:(i<6?0:1)); 
        }
      }
      var offs = [-1,-1,-1,0,0,1,1,1];
      var offc = [-1,0,1,-1,1,-1,0,1];
      var q = [{r:r,c:c}];
      while (q.length) {
        var nd = q.shift();
        for (var i=0;i<8;i++){
          var nr = nd.r + offs[i], nc = nd.c + offc[i];
          if (nr>=0 && nr<this.rows && nc>=0 && nc<this.cols && !this.revealed[nr][nc] && !this.flagged[nr][nc]) {
            this.revealed[nr][nc] = true;
            results.push({r:nr,c:nc, val:this.grid[nr][nc]});
            if (this.grid[nr][nc] === 0) q.push({r:nr,c:nc});
          }
        }
      }
    }
    return results;
  }

  revealAllMines() {
    var arr = [];
    for (var r=0;r<this.rows;r++) for (var c=0;c<this.cols;c++) if (this.grid[r][c] === 'M') arr.push({r:r,c:c});
    return arr;
  }

  countFlags() {
    var cnt=0;
    for (var r=0;r<this.rows;r++) for (var c=0;c<this.cols;c++) if (this.flagged[r][c]) cnt++;
    return cnt;
  }
}
