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

    this.findCluster();
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

  private findCluster() {
    const { VERTICAL_LINES, HORIZONTAL_LINES, MIN_CLUSTER_SIZE } = GRID_CONFIG;

    const visited = getMatrix<boolean>(HORIZONTAL_LINES, VERTICAL_LINES, false);

    const clusters: Cluster[] = [];

    for (let y = 0; y < VERTICAL_LINES; y++) {
      for (let x = 0; x < HORIZONTAL_LINES; x++) {
        if (visited[y][x]) continue;

        visited[y][x] = true;
        const block = this.data[y][x];

        const stack: Point[] = [{ x, y }];
        const blocks: Point[] = [{ x, y }];

        while (stack.length) {
          const { x: cx, y: cy } = stack.pop()!;
          for (const direction of DIRECTIONS) {
            const nx = cx + direction.x;
            const ny = cy + direction.y;

            const neighborBlock = this.data?.[ny]?.[nx];

            if (!neighborBlock) continue;
            if (visited[ny][nx]) continue;
            if (block && neighborBlock?.color !== block.color) continue;

            visited[ny][nx] = true;
            
            stack.push({ x: nx, y: ny });
            blocks.push({ x: nx, y: ny });
          }
        }

        if (blocks.length >= MIN_CLUSTER_SIZE) {
          blocks.forEach(({ x: bx, y: by }) => {
            const block = this.data[by][bx];

            block?.setClusterIcon();
          });

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
