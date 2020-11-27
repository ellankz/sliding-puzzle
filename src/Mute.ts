import { createElement } from './createElement';

export class Mute {
  public mute: boolean;

  private button: HTMLElement | null;

  constructor() {
    this.mute = false;
    this.button = null;
  }

  createMute(main: HTMLElement): void {
    const muteWrap = createElement('div', ['mute-wrap'], main);
    this.button = createElement('button', ['mute', 'mute_disabled'], muteWrap, undefined, [], [{ name: 'type', value: 'button' }]);
    this.button.addEventListener('click', () => {
      this.mute = !this.mute;
      this.button?.classList.toggle('mute_disabled', !this.mute);
    });
  }
}
