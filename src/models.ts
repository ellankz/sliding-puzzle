/* eslint-disable no-unused-vars */
export type position = {
  x: number;
  y: number;
}

export type savedStyleType = {
  [dynamic: string]: string;
}

export type score = {date: string, moves: number, time: string};

export type historyItem = {
  imprint: string,
  direction: string
}

export interface gameProperties {
  structure: {game: number[][], base: number[][]},
  size: number,
  type: string,
  posZ: position,
  posZPrev: position,
  bgCode: number,
  history: historyItem[],
  seconds?: number,
  moves?: number
}

export interface saved {
  parent: HTMLElement | null;
  position: { x: number, y: number };
  cursor: {left: number, top: number};
  style: savedStyleType,
}

export interface IIndexable<T = any> { [key: string]: T }

export type moveFuncType = (
  number: null | number,
  direction?: string,
  savedStyle?: savedStyleType
) => void;
