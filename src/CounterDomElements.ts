import { createElement } from './createElement';

export class CounterDomElements {
  public movesElement: HTMLElement | null;

  public timeDigitsElement: HTMLElement | null;

  constructor() {
    this.movesElement = null;
    this.timeDigitsElement = null;
  }

  createElements(): HTMLElement {
    this.timeDigitsElement = createElement('span', ['counter__time__digits'], undefined, ['00:00']);
    const timeElement = createElement('div', ['counter__time'], undefined, [
      createElement('span', [], undefined, ['Time: ']),
      this.timeDigitsElement,
    ]);
    this.movesElement = createElement('span', ['counter__moves__number'], undefined, ['0']);
    const movesNumberElement = createElement(
      'div', ['counter__moves'], undefined, [
        createElement('span', [], undefined, ['Moves: ']),
        this.movesElement,
      ],
    );
    const counterElement = createElement('div', ['counter'], undefined, [timeElement, movesNumberElement]);
    return counterElement;
  }
}
