import { PuzzleItemDrag } from './PuzzleItemDrag';
import { createElement } from './createElement';

export class PuzzleItem {
  private coords: {x: number, y: number};

  private number: number;

  private itemSize: number;

  constructor(coords: {x: number, y: number}, number: number, itemSize: number) {
    this.coords = coords;
    this.number = number;
    this.itemSize = itemSize;
  }

  createElement(): HTMLElement {
    const classes = this.number === 0 ? ['puzzle__item', 'puzzle__item_empty'] : ['puzzle__item'];
    const styles = [
      { name: 'height', value: `${this.itemSize}%` },
      { name: 'width', value: `${this.itemSize}%` },
      { name: 'top', value: `${this.coords.y * (this.itemSize)}%` },
      { name: 'left', value: `${this.coords.x * (this.itemSize)}%` },
    ];
    const attributes = [{ name: 'data-number', value: this.number }];

    const itemElement = createElement(
      'div',
      classes,
      undefined,
      [createElement('div', ['puzzle__item_inner'], undefined, [this.number.toString()])],
      styles,
      attributes,
    );

    const itemAnimation = new PuzzleItemDrag(itemElement);
    itemAnimation.manageDrag();

    return itemElement;
  }
}
