import { nanoid } from 'nanoid';
import { Container, Graphics } from 'pixi.js';

import { Matrix, Point } from '@/shared/types';
import { getMatrix } from '@/shared/utils/get-matrix';

import { Block } from './block/Block';
import { DIRECTIONS, GRID_CONFIG, MATRIX_Z_INDEX } from './constants';
import { Cluster } from './types';

export class Grid extends Container {
  private data: Matrix<null | Block> = getMatrix<null>(
    GRID_CONFIG.HORIZONTAL_LINES,
    GRID_CONFIG.VERTICAL_LINES
  );

  constructor() {
    super({ label: 'grid' });

    this.setBlocks();
    this.drawMatrix();
  }

  private drawMatrix() {
    const matrix = new Graphics({ label: 'matrix', zIndex: MATRIX_Z_INDEX });

    const { VERTICAL_LINES, HORIZONTAL_LINES, CELL_SIZE, STROKE_WIDTH } = GRID_CONFIG;

    // vertical
    for (let y = 0; y <= HORIZONTAL_LINES; y++) {
      matrix.moveTo(y * CELL_SIZE, 0).lineTo(y * CELL_SIZE, CELL_SIZE * VERTICAL_LINES);
    }

    // horizontal
    for (let x = 0; x <= VERTICAL_LINES; x++) {
      matrix.moveTo(0, x * CELL_SIZE).lineTo(CELL_SIZE * HORIZONTAL_LINES, x * CELL_SIZE);
    }

    matrix.stroke({
      color: 'black',
      width: STROKE_WIDTH,
    });

    this.addChild(matrix);

    return matrix;
  }

  private createBlock(x: number, y: number) {
    const { CELL_SIZE, VERTICAL_LINES, HORIZONTAL_LINES } = GRID_CONFIG;

    if (x >= HORIZONTAL_LINES || y >= VERTICAL_LINES || y < 0 || x < 0) {
      throw Error(
        `Invalid block position: x = ${x}, y = ${y}, MAX_HORIZONTAL_LINES = ${HORIZONTAL_LINES}, MAX_VERTICAL_LINES = ${VERTICAL_LINES}`
      );
    }

    const ONE_CELL = CELL_SIZE;

    const resolvedX = ONE_CELL * x;
    const resolvedY = ONE_CELL * y;

    const block = new Block(resolvedX, resolvedY);
    block.label = `block-${x}-${y}`;

    return block;
  }

  private setBlocks() {
    for (let y = 0; y < GRID_CONFIG.VERTICAL_LINES; y++) {
      for (let x = 0; x < GRID_CONFIG.HORIZONTAL_LINES; x++) {
        const block = this.createBlock(x, y);

        this.data[y][x] = block;

        this.addChild(block);
      }
    }

    this.findClusters();
  }

  public start() {
    this.data = Array.from({ length: GRID_CONFIG.VERTICAL_LINES }, () =>
      Array(GRID_CONFIG.HORIZONTAL_LINES).fill(null)
    );

    this.children.forEach((child) => {
      if (child instanceof Block) {
        this.removeChild(child);
      }
    });

    this.setBlocks();
  }

  private findClusters(): Cluster[] {
    const { MIN_CLUSTER_SIZE, VERTICAL_LINES, HORIZONTAL_LINES } = GRID_CONFIG;

    const visited = getMatrix<boolean>(VERTICAL_LINES, HORIZONTAL_LINES, false);

    const clusters: Cluster[] = [];

    const tryPush = (nx: number, ny: number, color: number, stack: Point[]) => {
      if (nx < 0 || ny < 0 || nx >= VERTICAL_LINES || ny >= HORIZONTAL_LINES) return;
      if (visited[ny][nx]) return;

      const neighborBlock = this.data[ny][nx];
      if (!neighborBlock) return;

      if (neighborBlock.color !== color) return;

      visited[ny][nx] = true;
      stack.push({ x: nx, y: ny });
    };

    for (let y = 0; y < VERTICAL_LINES; y++) {
      for (let x = 0; x < VERTICAL_LINES; x++) {
        if (visited[y][x]) continue;

        const start = this.data[y][x];
        if (!start) continue;

        const color = start.color;
        if (color == null) continue;

        // DFS
        const stack: Point[] = [{ x, y }];
        const blocks: Point[] = [];
        visited[y][x] = true;

        while (stack.length) {
          const { x: cx, y: cy } = stack.pop()!;
          blocks.push({ x: cx, y: cy });

          tryPush(cx - 1, cy, color, stack);
          tryPush(cx + 1, cy, color, stack);
          tryPush(cx, cy - 1, color, stack);
          tryPush(cx, cy + 1, color, stack);
        }

        if (blocks.length >= MIN_CLUSTER_SIZE) {
          for (const { x: bx, y: by } of blocks) {
            this.data[by][bx]?.setClusterIcon();
          }

          clusters.push({
            id: nanoid(),
            positions: blocks,
          });
        }
      }
    }

    console.log('clusters', clusters);

    return clusters;
  }
}
