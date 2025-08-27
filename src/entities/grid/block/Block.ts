import { Container, Graphics } from 'pixi.js';

import { Random } from '@/shared/utils/Random';
import { COLORS, GRID_CONFIG } from '../constants';
import { Grid } from '../Grid';
import { IColor } from '../types';

export class Block extends Container {
  declare parent: Grid;

  public color: IColor;

  constructor(x: number, y: number) {
    super({ label: 'block' });

    const cell = new Graphics();

    this.color = this.getRandomColor();

    cell.rect(0, 0, GRID_CONFIG.BLOCK_SIZE, GRID_CONFIG.BLOCK_SIZE).fill(this.color);

    this.addChild(cell);

    this.position.set(x, y);
  }

  public setClusterIcon() {
    const icon = new Graphics();
    icon
      .circle(
        GRID_CONFIG.BLOCK_SIZE / 2,
        GRID_CONFIG.BLOCK_SIZE / 2,
        GRID_CONFIG.BLOCK_SIZE / 6
      )
      .fill('purple');

    this.addChild(icon);
  }

  private getRandomColor() {
    return Random.getElementFromArray(COLORS);
  }
}
