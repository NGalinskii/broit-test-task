import { Matrix } from '../types';

export const getMatrix = <T>(
  x: number,
  y: number,
  placeholder: unknown | T = null
): Matrix<T> => {
  return Array.from({ length: y }, () => Array(x).fill(placeholder));
};
