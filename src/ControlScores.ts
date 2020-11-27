import { createElement } from './createElement';
import { score } from './models';

export class ControlScores {
  private scoresElement: null | HTMLElement;

  private buttonCancel: null | HTMLElement;

  private parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.scoresElement = null;
    this.buttonCancel = null;
    this.parent = parent;
  }

  createElements(): void {
    const scoresWrap = createElement('div', ['scores-wrap'], this.parent);
    this.scoresElement = createElement('div', ['scores'], scoresWrap);
    this.createScoresItems();
    this.buttonCancel = createElement('button', ['save-load__button-cancel'], scoresWrap, ['Close']);
  }

  createScoresItems(): void {
    if (!this.scoresElement) return;
    this.scoresElement.innerHTML = '';
    const storage = window.localStorage;
    const scoresList: score[] = JSON.parse(storage.getItem('scores')!);
    if (scoresList) {
      scoresList.forEach((singleScore: score) => {
        createElement('div', ['scores__item'], this.scoresElement!, [
          createElement('div', ['scores__date'], undefined, [singleScore.date]),
          createElement('div', ['scores__time'], undefined, [singleScore.time]),
          createElement('div', ['scores__date'], undefined, [`${singleScore.moves} moves`]),
        ]);
      });
    } else {
      createElement('div', ['scores__item'], this.scoresElement!, ['No scores yet']);
    }
  }

  handleEvents(): void {
    if (this.buttonCancel) {
      this.buttonCancel.addEventListener('click', () => {
        document.body.classList.remove('overlay', 'show-scores');
      });
    }
  }

  init(): void {
    this.createElements();
    this.handleEvents();
  }
}
