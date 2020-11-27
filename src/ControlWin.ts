import { Control } from './Control';
import { createElement } from './createElement';

export class ControlWin {
  private buttonNewGame: null | HTMLElement;

  private parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.buttonNewGame = null;
    this.parent = parent;
  }

  createElements(): void {
    const gameWin = createElement('div', ['game-win'], this.parent, [createElement(
      'div', ['game-win__text'],
    )]);
    this.buttonNewGame = createElement('button', ['game-win__new-game'], gameWin, ['New Game']);
  }

  handleEvents(): void {
    if (this.buttonNewGame) {
      this.buttonNewGame.addEventListener('click', () => {
        document.body.classList.remove('overlay', 'game-won');
        Control.showGameCreator();
      });
    }
  }

  static showCongrats(time: string, moves: number): void {
    const winMessage = document.querySelector('.game-win__text');
    if (winMessage) {
      winMessage.textContent = `Ура! Вы решили головоломку за ${time} и ${moves} ходов`;
    }
  }

  init() {
    this.createElements();
    this.handleEvents();
  }
}
