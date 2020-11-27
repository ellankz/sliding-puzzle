import { PuzzleRenderer } from './PuzzleRenderer';
import { Control } from './Control';
import { Mute } from './Mute';
import { Counter } from './Counter';
import { createElement } from './createElement';
import { PuzzleStorage } from './PuzzleStorage';
import { isCustomEvent } from './isCustomEvent';
import { PuzzleStructureManager } from './PuzzleStructureManager';
import { PuzzleItemsMover } from './PuzzleItemsMover';
import { PuzzleHistory } from './PuzzleHistory';
import { PuzzleSolver } from './PuzzleSolver';
import { savedStyleType } from './models';

require.context('./images/art', true, /\.(png|jpg)$/);

export class Puzzle {
  private size: number;

  private type: string;

  private puzzle: HTMLElement | null;

  public main: HTMLElement | null;

  private control: Control;

  private mute: Mute;

  private structure: PuzzleStructureManager;

  private counter: Counter;

  private gameOn: boolean;

  private gaveUp: boolean;

  private history: PuzzleHistory;

  private storage: PuzzleStorage;

  private mover: PuzzleItemsMover;

  private solver: PuzzleSolver;

  private renderer: PuzzleRenderer | null;

  constructor(size: number) {
    this.main = null;
    this.puzzle = null;
    this.control = new Control();
    this.mute = new Mute();
    this.counter = new Counter();
    this.size = size;
    this.type = 'Numbers';
    this.structure = new PuzzleStructureManager(this.size);
    this.gameOn = false;
    this.gaveUp = false;
    this.history = new PuzzleHistory();
    this.storage = new PuzzleStorage(this.counter);
    this.mover = new PuzzleItemsMover(this.structure, this.size, this.counter);
    this.solver = new PuzzleSolver();
    this.renderer = null;
  }

  init(): void {
    this.main = createElement('div', ['main'], document.body);
    this.counter.init(this.main);
    this.puzzle = createElement('div', ['puzzle'], this.main);
    this.control.createControl(this.main);
    this.mute.createMute(this.main);
    this.renderer = new PuzzleRenderer(this.puzzle, this.moveItem.bind(this));
    this.renderNewGame();
    this.counter.startCounter();
    document.addEventListener('startGame', this.startNewGame.bind(this));
    document.addEventListener('saveGame', this.saveGame.bind(this));
    document.addEventListener('loadGame', this.loadGame.bind(this));
    document.addEventListener('solveGame', this.solveGame.bind(this));
  }

  startNewGame(event: Event): void {
    if (isCustomEvent(event)) {
      this.counter.stopCounter();
      [this.size, this.type] = event.detail;
      this.structure = new PuzzleStructureManager(this.size);
      this.mover = new PuzzleItemsMover(this.structure, this.size, this.counter);
      this.renderNewGame();
    }
    this.counter.startCounter();
  }

  renderNewGame(saved = false, bgCode = 1): void {
    if (!this.renderer) return;
    this.gaveUp = false;
    this.history.clear();
    this.gameOn = false;
    this.renderer.renderNewGame(saved, this.size, this.structure, this.type, bgCode);
    this.gameOn = true;
  }

  moveItem(number: null | number, direction?: string, savedStyle?: savedStyleType): void {
    const chosenDirection = this.mover.move(number, this.mute.mute, direction, savedStyle);

    // solver not getting here add event
    if (chosenDirection) {
      // save movement in history
      this.history.saveTo(chosenDirection, this.structure.game);
      const solved = this.structure.isSolved();
      if (solved) {
        this.endGame();
      }
    }
  }

  saveGame(): void {
    this.storage.saveGame({
      structure: { game: this.structure.game, base: this.structure.base },
      size: this.size,
      type: this.type,
      posZ: this.mover.posZ,
      posZPrev: this.mover.posZPrev,
      bgCode: this.renderer!.bgCode,
      history: this.history.data,
    });
  }

  loadGame(): void {
    const game = PuzzleStorage.loadGame();
    if (game) {
      this.counter.stopCounter();
      this.structure.game = game.structure.game;
      this.structure.base = game.structure.base;
      this.size = game.size;
      this.mover.size = game.size;
      this.type = game.type;
      this.mover.posZ = game.posZ;
      this.mover.posZPrev = game.posZPrev;
      const savedGame = true;
      this.renderNewGame(savedGame, game.bgCode);
      this.history.set(game.history);
      this.counter.startCounter(game.seconds, game.moves);
    }
  }

  solveGame(): void {
    this.gaveUp = true;
    this.solver.solve(this.history.data, this.moveItem.bind(this));
  }

  endGame(): void {
    if (this.gameOn && this.gaveUp === false) {
      this.storage.saveScore();
      window.setTimeout(() => {
        Control.showGameWin(this.counter.getTimeString(), this.counter.getMoves());
      }, 500);
    } else if (this.gaveUp === true) {
      window.setTimeout(() => {
        Control.showGameLose(this.counter.getTimeString(), this.counter.getMoves());
      }, 500);
    }
  }
}
