import { Control } from './Control';
import { createElement } from './createElement';

export class ControlLose {
  private buttonNewGame: null | HTMLElement;

  private parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.buttonNewGame = null;
    this.parent = parent;
  }

  createElements(): void {
    const gameLose = createElement('div', ['game-lose'], this.parent, [createElement(
      'div', ['game-lose__text'],
    )]);
    this.buttonNewGame = createElement('button', ['game-lose__new-game'], gameLose, ['New Game']);
  }

  handleEvents(): void {
    if (this.buttonNewGame) {
      this.buttonNewGame.addEventListener('click', () => {
        document.body.classList.remove('overlay', 'game-lost');
        Control.showGameCreator();
      });
    }
  }

  static showResult(time: string, moves: number): void {
    const loseMessage = document.querySelector('.game-lose__text');
    if (loseMessage) {
      loseMessage.textContent = `Мы решили головоломку за ${time} и ${moves} ходов`;
    }
  }

  init(): void {
    this.createElements();
    this.handleEvents();
  }
}
