import { moveFuncType, savedStyleType } from './models';
import { PuzzleStructureManager } from './PuzzleStructureManager';
import { PuzzleItem } from './PuzzleItem';
import { isCustomEvent } from './isCustomEvent';

const getRandomInt = (max: number): number => Math.floor(Math.random() * Math.floor(max));

export class PuzzleRenderer {
  private puzzle: HTMLElement | null;

  private puzzleItems: {
    [dynamic: number]: HTMLElement
  };

   private moveItem: moveFuncType;

   protected zeroElement: HTMLElement | null;

   private directions: string[];

   public bgCode: number;

   constructor(
     puzzle: HTMLElement | null,
     moveItem: moveFuncType,
   ) {
     this.puzzle = puzzle;
     this.puzzleItems = {};
     this.moveItem = moveItem;
     this.zeroElement = null;
     this.directions = ['^', 'v', '>', '<'];
     this.bgCode = 1;
   }

   renderNewGame(
     saved: boolean,
     size: number,
     structure: PuzzleStructureManager,
     type: string,
     bgCode: number,
   ): void {
     this.bgCode = bgCode;
    this.puzzle!.innerHTML = '';
    if (this.puzzle) {
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const puzzleItem = new PuzzleItem(
            { x, y },
            structure.game[y][x],
            (100 / size),
          ).createElement();
          this.puzzle.appendChild(puzzleItem);
          const num = structure.game[y][x];
          this.puzzleItems[num] = puzzleItem;

          puzzleItem.addEventListener('click', () => {
            if (puzzleItem.classList.contains('item_animating')) return;
            this.moveItem(num);
          });

          puzzleItem.addEventListener('handmadeMoveItem', (event) => {
            if (isCustomEvent(event)) {
              this.moveItem(num, undefined, event.detail as savedStyleType);
            }
          });
        }
      }
    }
    this.zeroElement = this.puzzle!.querySelector('.puzzle__item_empty');
    if (saved) {
      this.positionItemsByStructure(size, structure);
    } else {
      this.shuffleItems(size);
    }
    if (type === 'Image') {
      document.body.classList.add('image-puzzle');
      if (!saved) {
        this.bgCode = getRandomInt(150) + 1;
      }
      const artUrlFull = `./src/images/art/${this.bgCode}.jpg`;
      const artUrl = `.${artUrlFull.split('./src')[1]}`;
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const item = this.puzzleItems[(y * size) + x + 1] || this.puzzleItems[0];
          item.style.backgroundImage = `url(${artUrl})`;
          item.style.backgroundSize = `${100 * size}%`;
          item.style.backgroundPositionY = `${y * (100 / (size - 1))}%`;
          item.style.backgroundPositionX = `${x * (100 / (size - 1))}%`;
        }
      }
    } else {
      document.body.classList.remove('image-puzzle');
      this.bgCode = 1;
    }
   }

   positionItemsByStructure(size: number, structure: PuzzleStructureManager): void {
     for (let y = 0; y < size; y += 1) {
       for (let x = 0; x < size; x += 1) {
         const num = structure.game[y][x];
         const sideLength = 100 / size;
         this.puzzleItems[num].style.height = `${sideLength}%`;
         this.puzzleItems[num].style.width = `${sideLength}%`;
         this.puzzleItems[num].style.top = `${y * sideLength}%`;
         this.puzzleItems[num].style.left = `${x * sideLength}%`;
       }
     }
   }

   shuffleItems(size: number): void {
     const numberOfMoves = 50 + (getRandomInt(200) * size);
     for (let i = 0; i < numberOfMoves; i += 1) {
       const moveDirection = this.directions[getRandomInt(4)];
       this.moveItem(null, moveDirection);
     }
   }
}
