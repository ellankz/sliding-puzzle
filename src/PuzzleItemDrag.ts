import { saved, savedStyleType } from './models';

export class PuzzleItemDrag {
  private item: HTMLElement;

  private saved: saved;

  constructor(item: HTMLElement) {
    this.item = item;
    this.saved = {
      parent: null,
      position: { x: 0, y: 0 },
      cursor: { left: 0, top: 0 },
      style: {},
    };
  }

  manageMouseDown(event: MouseEvent): void {
    this.saved = this.saveBlockProperties(event.clientX, event.clientY);
    this.blockSizeToPx();

    this.item.style.zIndex = '1000';
    document.body.append(this.item);

    this.moveByCoords(
      event.pageX, event.pageY, this.saved.cursor.left,
      this.saved.cursor.top, event.clientX, event.clientY,
    );
  }

  manageMouseMove(eventDown: MouseEvent, eventMove: MouseEvent): void {
    this.moveByCoords(eventMove.pageX, eventMove.pageY, this.saved.cursor.left,
      this.saved.cursor.top, eventDown.clientX, eventDown.clientY);
  }

  manageMouseUp(eventDrop: MouseEvent): void {
    this.saved.parent?.appendChild(this.item);

    // if actually moved, consider drag n drop
    if (
      Math.abs(this.saved.position.x - eventDrop.clientX) > 5
      || Math.abs(this.saved.position.y - eventDrop.clientY) > 5
    ) {
      // hide block to get item below
      this.item.style.zIndex = '-1000';
      const elemBelow = document.elementFromPoint(eventDrop.clientX, eventDrop.clientY);
      this.item.style.zIndex = '0';

      // if above empty space
      if (elemBelow !== null && elemBelow.closest('.puzzle__item_empty')) {
        this.item.setAttribute('style', `top: ${eventDrop.clientX}; left: ${eventDrop.clientX}; width: ${this.saved.style.width}; height: ${this.saved.style.height}; z-index: ${this.saved.style.zIndex}; background-image: ${this.saved.style.backgroundImage}; background-size: ${this.saved.style.backgroundSize}; background-position-x: ${this.saved.style.backgroundPositionX}; background-position-y: ${this.saved.style.backgroundPositionY};`);
        const handmadeEventMove = new CustomEvent('handmadeMoveItem', {
          detail: this.saved.style,
        });
        this.item.dispatchEvent(handmadeEventMove);
      } else {
        PuzzleItemDrag.resetBlockStyle(this.saved.style, this.item);
      }
    } else {
      // if barely moved consider a click
      PuzzleItemDrag.resetBlockStyle(this.saved.style, this.item);
      this.item.click();
    }
  }

  saveBlockProperties(x: number, y: number): saved {
    const saveStyle = (style: CSSStyleDeclaration) => {
      const {
        left, top, width, height, backgroundImage,
        backgroundSize, backgroundPositionX, backgroundPositionY, zIndex,
      } = style;
      return {
        left,
        top,
        width,
        height,
        backgroundImage,
        backgroundSize,
        backgroundPositionX,
        backgroundPositionY,
        zIndex,
      };
    };

    const style = saveStyle(this.item.style);
    const parent = this.item.parentElement;
    const position = { x, y };
    const { left, top } = this.item.getBoundingClientRect();
    const cursor = { left, top };
    return {
      style, parent, position, cursor,
    };
  }

  static resetBlockStyle(style: savedStyleType, item: HTMLElement | null): void {
    if (!item) return;
    const element = item;
    const styleArr = Object.entries(style);
    styleArr.forEach((oneStyle) => {
      const [name, value] = oneStyle;
      element.style[name] = value;
    });
  }

  blockSizeToPx(): void {
    const { width, height } = this.item.getBoundingClientRect();
    this.item.style.width = `${width.toString()}px`;
    this.item.style.height = `${height.toString()}px`;
  }

  moveByCoords(
    pageX: number, pageY: number, cusorLeft: number,
    cursorTop: number, clientX: number, clientY: number,
  ): void {
    this.item.style.left = `${pageX - (clientX - cusorLeft)}px`;
    this.item.style.top = `${pageY - (clientY - cursorTop)}px`;
  }

  manageDrag(): void {
    // disable default behaviur
    this.item.ondragstart = () => false;

    this.item.addEventListener('mousedown', (event) => {
      if (this.item.classList.contains('item_animating')) return;
      // mousedown
      this.manageMouseDown(event);

      // mousemove
      const onMouseMove = (eventMove: MouseEvent) => {
        this.manageMouseMove(event, eventMove);
      };
      document.addEventListener('mousemove', onMouseMove);

      // mouseup
      const onMouseUp = (eventDrop: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        this.manageMouseUp(eventDrop);
      };
      document.addEventListener('mouseup', onMouseUp);
    });
  }
}
