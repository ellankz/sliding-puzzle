import { createElement } from './createElement';

export class ControlGameCreate {
  private min: number;

  private max: number;

  private default: number;

  private buttonOk: null | HTMLElement;

  private buttonCancel: null | HTMLElement;

  private sizeSelect: HTMLSelectElement | null;

  private imageOrNumberSelect: HTMLSelectElement | null;

  private parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.max = 8;
    this.min = 3;
    this.default = 4;
    this.buttonOk = null;
    this.buttonCancel = null;
    this.sizeSelect = null;
    this.imageOrNumberSelect = null;
    this.parent = parent;
  }

  createElements(): void {
    const newGameElement = createElement('div', ['game-create'], this.parent);
    const sizeElement = createElement('div', ['game-create__sizes'], newGameElement);
    this.sizeSelect = <HTMLSelectElement>createElement('select', ['game-create__sizes__select'], sizeElement);

    for (let i = this.min; i <= this.max; i += 1) {
      const attributes = [{ name: 'value', value: i.toString() }];
      if (i === this.default) {
        attributes.push({ name: 'selected', value: 'selected' });
      }
      createElement(
        'option',
        ['control-overlay__sizes__select_option'],
        this.sizeSelect,
        [`${i}x${i}`],
        undefined,
        attributes,
      );
    }
    const imageOrNumberElement = createElement('div', ['game-create__image-or-number'], newGameElement);
    this.imageOrNumberSelect = <HTMLSelectElement>createElement(
      'select',
      ['game-create__image-or-number__select'],
      imageOrNumberElement,
      [
        createElement(
          'option',
          ['game-create__image-or-number__select_option'],
          undefined,
          ['Numbers'],
          [{ name: 'value', value: 'numbers' }],
        ),
        createElement(
          'option',
          ['game-create__image-or-number__select_option'],
          undefined,
          ['Image'],
          [{ name: 'value', value: 'image' }],
        ),
      ],
    );
    this.buttonOk = createElement('button', ['game-create__button-ok'], newGameElement, ['Ok']);
    this.buttonCancel = createElement('button', ['game-create__button-cancel'], newGameElement, ['Cancel']);
  }

  handleEvents(): void {
    if (this.buttonOk) {
      this.buttonOk.addEventListener('click', () => {
        if (!this.sizeSelect || !this.imageOrNumberSelect) return;
        const event = new CustomEvent('startGame', { detail: [parseInt(this.sizeSelect.value, 10), this.imageOrNumberSelect.value] });

        document.dispatchEvent(event);
        document.body.classList.remove('overlay', 'new-game');
      });
    }

    if (this.buttonCancel) {
      this.buttonCancel.addEventListener('click', () => {
        document.body.classList.remove('overlay', 'new-game');
      });
    }
  }

  init(): void {
    this.createElements();
    this.handleEvents();
  }
}
