import { historyItem } from './models';

export class PuzzleHistory {
  public data: historyItem[];

  constructor() {
    this.data = [];
  }

  saveTo(direction: string, structure: number[][]): void {
    this.data.push({ direction, imprint: structure.join() });
  }

  clear(): void {
    this.data = [];
  }

  set(data: historyItem[]): void {
    this.data = data;
  }
}
