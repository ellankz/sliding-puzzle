import { Counter } from './Counter';
import { PuzzleItemDrag } from './PuzzleItemDrag';
import { position, savedStyleType } from './models';
import { PuzzleStructureManager } from './PuzzleStructureManager';

const audio = require('./audio/beep.wav').default;

const sound = new Audio(audio);

export class PuzzleItemsMover {
  protected direction: string | undefined;

  protected savedStyle: savedStyleType | false;

  private movingNumber: number | null;

  private structure: PuzzleStructureManager;

  private counter: Counter;

  public size: number;

  public posZ: position;

  public posZPrev: position;

  private zeroElement: HTMLElement | null;

  constructor(structure: PuzzleStructureManager, size: number, counter: Counter) {
    this.direction = '';
    this.savedStyle = false;
    this.movingNumber = null;
    this.structure = structure;
    this.counter = counter;
    this.size = size;
    this.posZ = { x: size - 1, y: size - 1 };
    this.posZPrev = { x: size - 1, y: size - 1 };
    this.zeroElement = null;
  }

  move(number: null | number, mute: boolean, direction?: string, savedStyle?: savedStyleType)
  : string | undefined {
    this.movingNumber = number;
    const chosenDirection = direction || this.findDirection();

    if (chosenDirection) {
      const moved = this.setNewZeroPosition(chosenDirection);
      if (!moved) return undefined;

      if (this.movingNumber === null) {
        this.movingNumber = this.structure.game[this.posZ.y][this.posZ.x];
      }
      const numberElement: HTMLElement | null = document.querySelector(`[data-number="${this.movingNumber}"]`);
      this.zeroElement = document.querySelector('.puzzle__item_empty');

      this.structure.moveNumber(this.posZPrev, this.posZ);

      if (numberElement) {
        this.positionZeroElement();
        this.positionNumberElement(numberElement);
      }

      // count the move and play sound
      if (this.counter.timeInterval) {
        this.counter.countMove();
        if (!mute) {
          sound.currentTime = 0;
          sound.play();
        }
      }
      return chosenDirection;
    }
    if (savedStyle) {
      // if no direction means block is not near empty space, restore styles
      const numberElement: HTMLElement | null = document.querySelector(`[data-number="${this.movingNumber}"]`);
      PuzzleItemDrag.resetBlockStyle(savedStyle, numberElement);
    }
    return undefined;
  }

  positionZeroElement(): void {
    if (this.zeroElement) {
      this.zeroElement.style.left = `${this.posZ.x * (100 / this.size)}%`;
      this.zeroElement.style.top = `${this.posZ.y * (100 / this.size)}%`;
    }
  }

  positionNumberElement(numberElement: HTMLElement): void {
    const el = numberElement;
    el.classList.add('item_animating');
    if (el) {
      el.animate([
        // keyframes
        { left: el.style.left, top: el.style.top },
        { left: `${this.posZPrev.x * (100 / this.size)}%`, top: `${this.posZPrev.y * (100 / this.size)}%` },
      ], {
        // timing options
        duration: 300,
        iterations: 1,
      });

      setTimeout(() => el.classList.remove('item_animating'), 300);
      el.style.left = `${this.posZPrev.x * (100 / this.size)}%`;
      el.style.top = `${this.posZPrev.y * (100 / this.size)}%`;
    }
  }

  findDirection(): 'v' | '^' | '>' | '<' | '' {
    let foundZero = false;
    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        if (foundZero) break;
        if (this.structure.game[y][x] === 0) {
          foundZero = true;
          if (y < this.size - 1 && this.structure.game[y + 1][x] === this.movingNumber) {
            return 'v';
          }
          if (y > 0 && this.structure.game[y - 1][x] === this.movingNumber) {
            return '^';
          }
          if (x < this.size - 1 && this.structure.game[y][x + 1] === this.movingNumber) {
            return '>';
          }
          if (x > 0 && this.structure.game[y][x - 1] === this.movingNumber) {
            return '<';
          }
        }
      }
    }
    return '';
  }

  setNewZeroPosition(chosenDirection: string | undefined): boolean {
    const coords = { x: this.posZ.x, y: this.posZ.y };
    switch (chosenDirection) {
      case '^': {
        if (coords.y === 0) return false;
        coords.y -= 1;
        break;
      }
      case 'v': {
        if (coords.y === this.size - 1) return false;
        coords.y += 1;
        break;
      }
      case '>': {
        if (coords.x === this.size - 1) return false;
        coords.x += 1;
        break;
      }
      case '<': {
        if (coords.x === 0) return false;
        coords.x -= 1;
        break;
      }
      default:
        break;
    }
    // save current zero position
    this.posZPrev = this.posZ;
    // save target zero position as current
    this.posZ = coords;
    return true;
  }
}
