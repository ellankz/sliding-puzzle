import { CounterDomElements } from './CounterDomElements';

export class Counter {
  private time: string;

  private moves: number

  public timeInterval: number;

  private seconds: number;

  private counterDomElements: CounterDomElements;

  constructor() {
    this.time = '00:00';
    this.moves = 0;
    this.timeInterval = 0;
    this.seconds = 0;
    this.counterDomElements = new CounterDomElements();
  }

  init(parentElement: HTMLElement): void {
    parentElement.appendChild(this.counterDomElements.createElements());
  }

  getSeconds(): number {
    return this.seconds;
  }

  getMoves(): number {
    return this.moves;
  }

  countTime(): void {
    this.timeInterval = window.setInterval(() => {
      this.seconds += 1;
      this.displayTime();
    }, 1000);
  }

  countMove(): void {
    this.moves += 1;
    this.displayMoves();
  }

  startCounter(seconds = 0, moves = 0): void {
    this.moves = moves;
    this.displayMoves();
    this.seconds = seconds;
    this.displayTime();
    this.countTime();
  }

  stopCounter(): void {
    if (this.timeInterval) {
      window.clearInterval(this.timeInterval);
      this.timeInterval = 0;
      this.time = '--:--';
      this.seconds = 0;
      this.counterDomElements.timeDigitsElement!.innerText = this.time;
      this.moves = 0;
      this.counterDomElements.movesElement!.innerText = this.moves.toString();
    }
  }

  getTimeString(): string {
    let min: string | number = Math.trunc(this.seconds / 60);
    min = min < 10 ? `0${min.toString()}` : min.toString();
    let sec: string | number = this.seconds % 60;
    sec = sec < 10 ? `0${sec.toString()}` : sec.toString();
    return `${min}:${sec}`;
  }

  displayMoves(): void {
    this.counterDomElements.movesElement!.innerText = this.moves.toString();
  }

  displayTime(): void {
    if (!this.counterDomElements.timeDigitsElement) return;
    this.counterDomElements.timeDigitsElement.innerText = this.getTimeString();
  }
}
