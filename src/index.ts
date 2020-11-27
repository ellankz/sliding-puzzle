/* eslint-disable import/extensions */
import './scss/base.scss';
import './images/favicon.png';
import { Puzzle } from './Puzzle';

const puzzle = new Puzzle(4);

window.addEventListener('DOMContentLoaded', () => {
  puzzle.init();
  if (puzzle.main) {
    document.body.appendChild(puzzle.main);
  }
});
