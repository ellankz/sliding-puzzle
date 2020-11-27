import { ControlSaveLoad } from './ControlSaveLoad';
import { ControlGameCreate } from './ControlGameCreate';
import { ControlScores } from './ControlScores';
import { createElement } from './createElement';
import { ControlWin } from './ControlWin';
import { ControlLose } from './ControlLose';

export class Control {
  private overlay: HTMLElement | null;

  protected scoresElement: HTMLElement | null;

  private scores: ControlScores | null;

  constructor(
  ) {
    this.overlay = null;
    this.scoresElement = null;
    this.scores = null;
  }

  createControl(main: HTMLElement) : HTMLElement {
    const controlElement = createElement('div', ['control'], main);
    const startBtn = createElement('button', ['control__btn-new-game'], controlElement, ['New Game']);
    const solveBtn = createElement('button', ['control__btn-solve'], controlElement, ['Solve']);
    const saveBtn = createElement('button', ['control__btn-save'], controlElement, ['Save Load']);
    const scoresBtn = createElement('button', ['control__btn-view-scores'], controlElement, ['Scores']);

    this.overlay = createElement('div', ['control-overlay'], document.body);
    this.createGameCreator();
    this.createSaverLoader();
    this.createScoresElement();
    this.createGameWin();
    this.createGameLose();

    startBtn.addEventListener('click', Control.showGameCreator);
    solveBtn.addEventListener('click', Control.solveGame);
    saveBtn.addEventListener('click', Control.showSaverLoader);
    scoresBtn.addEventListener('click', this.showScores.bind(this));

    return controlElement;
  }

  createGameCreator() : void {
    if (this.overlay) {
      const createGame = new ControlGameCreate(this.overlay);
      createGame.init();
    }
  }

  static showGameCreator(): void {
    document.body.classList.add('overlay', 'new-game');
  }

  createSaverLoader(): void {
    if (!this.overlay) return;
    const saverLoader = new ControlSaveLoad(this.overlay);
    saverLoader.init();
  }

  static showSaverLoader(): void {
    document.body.classList.add('overlay', 'show-save-load');
  }

  createScoresElement(): void {
    if (!this.overlay) return;
    this.scores = new ControlScores(this.overlay);
    this.scores.init();
  }

  showScores(): void {
    if (this.scores) {
      this.scores.createScoresItems();
      document.body.classList.add('overlay', 'show-scores');
    }
  }

  createGameLose(): void {
    if (!this.overlay) return;
    const loseGame = new ControlLose(this.overlay);
    loseGame.init();
  }

  static showGameLose(time: string, moves: number): void {
    ControlLose.showResult(time, moves);
    document.body.classList.add('overlay', 'game-lost');
  }

  createGameWin(): void {
    if (!this.overlay) return;
    const winGame = new ControlWin(this.overlay);
    winGame.init();
  }

  static showGameWin(time: string, moves: number): void {
    ControlWin.showCongrats(time, moves);
    document.body.classList.add('overlay', 'game-won');
  }

  static solveGame(): void {
    const event = new CustomEvent('solveGame');
    document.dispatchEvent(event);
  }
}
