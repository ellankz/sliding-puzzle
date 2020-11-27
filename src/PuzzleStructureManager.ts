import { position } from './models';

export class PuzzleStructureManager {
  public game: number[][];

  public base: number[][];

  private size: number;

  constructor(size: number) {
    this.size = size;
    this.base = this.generateStructure();
    this.game = this.generateStructure();
  }

  generateStructure(): number[][] {
    const resArray = [];
    for (let y = 0; y < this.size; y += 1) {
      const innerArray: number[] = [];
      for (let x = 0; x < this.size; x += 1) {
        let number = (y * this.size) + (x + 1);
        if (this.size === y + 1 && this.size === x + 1) number = 0;
        innerArray.push(number);
      }
      resArray.push(innerArray);
    }
    return resArray;
  }

  moveNumber(posZPrev: position, posZ: position): void {
    this.game[posZPrev.y][posZPrev.x] = this.game[posZ.y][posZ.x];
    this.game[posZ.y][posZ.x] = 0;
  }

  updateStructure(structure: number[][]): void {
    this.game = structure;
  }

  isSolved(): boolean {
    return this.game.join() === this.base.join();
  }
}
