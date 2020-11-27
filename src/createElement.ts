import { IIndexable } from './models';

export const createElement = (
  selector: string,
  classes?: string[],
  parent?: HTMLElement,
  children?: HTMLElement[] | string[],
  styles?: Array<{name: string, value: string}>,
  attributes?: Array<{name: string, value: string | number}>,
): HTMLElement => {
  const elem = document.createElement(selector);
  if (classes) {
    classes.forEach((oneClass) => {
      elem.classList.add(oneClass);
    });
  }
  if (parent) {
    parent.appendChild(elem);
  }

  if (children) {
    children.forEach((child: HTMLElement | string) => {
      if (typeof child === 'string') {
        elem.textContent += child;
      } else {
        elem.appendChild(child);
      }
    });
  }

  if (styles) {
    styles.forEach((style: {name: string, value: string}) => {
      (elem.style as IIndexable)[style.name] = style.value;
    });
  }

  if (attributes) {
    attributes.forEach((attr) => {
      elem.setAttribute(attr.name, String(attr.value));
    });
  }

  return elem;
};
