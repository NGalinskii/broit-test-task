import { Container, Graphics } from 'pixi.js';

import { Random } from '@/shared/utils/Random';
import { GRID_CONFIG } from '../constants';
import { Grid } from '../Grid';

export class Block extends Container {
  declare parent: Grid;

  icon: Graphics;

  constructor(x: number, y: number) {
    super({ label: 'block' });

    this.icon = new Graphics();

    this.icon
      .rect(0, 0, GRID_CONFIG.CELL_SIZE, GRID_CONFIG.CELL_SIZE)
      .fill(this.getRandomColor());

    this.addChild(this.icon);

    this.position.set(x, y);
  }

  public setClusterIcon() {
    const clusterIcon = new Graphics();
    clusterIcon
      .circle(
        GRID_CONFIG.CELL_SIZE / 2,
        GRID_CONFIG.CELL_SIZE / 2,
        GRID_CONFIG.CELL_SIZE / 6
      )
      .fill('purple');

    this.addChild(clusterIcon);
  }

  private getRandomColor() {
    return Random.getElementFromArray(GRID_CONFIG.COLORS);
  }

  get color() {
    return this.icon.fillStyle.color;
  }
}
