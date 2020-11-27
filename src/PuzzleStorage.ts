import { Counter } from './Counter';
import { gameProperties, score } from './models';

export class PuzzleStorage {
  private counter: Counter;

  constructor(counter: Counter) {
    this.counter = counter;
  }

  saveGame({
    structure, size, type, posZ, posZPrev, bgCode, history,
  }: gameProperties): void {
    window.localStorage.setItem('game', JSON.stringify({
      moves: this.counter.getMoves(),
      seconds: this.counter.getSeconds(),
      structure,
      size,
      type,
      posZ,
      posZPrev,
      bgCode,
      history,
    }));
  }

  static loadGame(): gameProperties {
    return JSON.parse(window.localStorage.getItem('game')!);
  }

  saveScore(): void {
    const scoresList: score[] = JSON.parse(window.localStorage.getItem('scores')!) || [];
    const thisScore: score = {
      date: new Date().toDateString(),
      moves: this.counter.getMoves(),
      time: this.counter.getTimeString(),
    };
    scoresList.push(thisScore);
    const sortedScores = scoresList.sort((scoreA, scoreB) => scoreA.moves - scoreB.moves);
    window.localStorage.setItem('scores', JSON.stringify(sortedScores.slice(0, 10)));
  }
}
