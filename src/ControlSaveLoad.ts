import { createElement } from './createElement';

export class ControlSaveLoad {
  private buttonLoad: null | HTMLElement;

  private buttonSave: null | HTMLElement;

  private buttonCancel: null | HTMLElement;

  private parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.buttonLoad = null;
    this.buttonSave = null;
    this.buttonCancel = null;
    this.parent = parent;
  }

  createElements(): void {
    const newSaverLoader = createElement('div', ['save-load'], this.parent);
    this.buttonLoad = createElement('button', ['save-load__button-load'], newSaverLoader, ['Load Saved Game']);
    this.buttonSave = createElement('button', ['save-load__button-save'], newSaverLoader, ['Save Game']);
    this.buttonCancel = createElement('button', ['save-load__button-cancel'], newSaverLoader, ['Cancel']);
  }

  handleEvents(): void {
    if (this.buttonLoad) {
      this.buttonLoad.addEventListener('click', () => {
        const event = new CustomEvent('loadGame');
        document.dispatchEvent(event);
        document.body.classList.remove('overlay', 'show-save-load');
      });
    }

    if (this.buttonSave) {
      this.buttonSave.addEventListener('click', () => {
        const event = new CustomEvent('saveGame');
        document.dispatchEvent(event);
        document.body.classList.remove('overlay', 'show-save-load');
      });
    }

    if (this.buttonCancel) {
      this.buttonCancel.addEventListener('click', () => {
        document.body.classList.remove('overlay', 'show-save-load');
      });
    }
  }

  init(): void {
    this.createElements();
    this.handleEvents();
  }
}
