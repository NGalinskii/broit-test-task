import { Point } from '@/shared/types';
import { ScreenManager } from '@/shared/utils/ScreenManager';

import { IColor } from './types';

export const GRID_CONFIG = {
  VERTICAL_LINES: 10,
  HORIZONTAL_LINES: 10,
  CELL_SIZE: 100,
  STROKE_WIDTH: 4,
  MIN_CLUSTER_SIZE: 3,

  update() {
    const { height, width } = ScreenManager.getSize();

    this.CELL_SIZE = Math.floor(
      Math.min(height / this.VERTICAL_LINES, width / this.HORIZONTAL_LINES)
    );
  },
};

export const COLORS: IColor[] = ['red', 'blue', 'orange', 'green', 'yellow'];

export const DIRECTIONS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
] as const;

export const MATRIX_Z_INDEX = 10;
