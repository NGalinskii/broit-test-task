import { Point } from '@/shared/types';
import { ScreenManager } from '@/shared/utils/ScreenManager';

import { Color } from './types';

export const GRID_CONFIG = {
  VERTICAL_LINES: 10,
  HORIZONTAL_LINES: 10,
  CELL_SIZE: 100,
  STROKE_WIDTH: 4,
  MIN_CLUSTER_SIZE: 3,
  COLORS: ['red', 'blue', 'orange', 'green', 'yellow'] as Color[],

  update() {
    const { height, width } = ScreenManager.getSize();

    this.CELL_SIZE = Math.floor(
      Math.min(height / this.VERTICAL_LINES, width / this.HORIZONTAL_LINES)
    );
  },
};

export const DIRECTIONS: Point[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
] as const;

export const MATRIX_Z_INDEX = 10;
