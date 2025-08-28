import { initDevtools } from '@pixi/devtools';
import { Application } from 'pixi.js';

import { GRID_CONFIG } from '@/entities/grid/constants';
import { Grid } from '@/entities/grid/Grid';
import { getIsDev } from '@/shared/utils/get-is-dev';
import { ScreenManager } from '@/shared/utils/ScreenManager';

export default async function initApplication() {
  const app = new Application();

  const isDev = getIsDev();

  if (isDev) {
    initDevtools({ app });
  }

  await app.init({ backgroundAlpha: 0, resizeTo: document.getElementById('app')! });

  document.getElementById('pixi-container')!.appendChild(app.canvas);

  GRID_CONFIG.update();

  const grid = new Grid();

  app.stage.addChild(grid);

  window.addEventListener('resize', () => resize());

  const resize = () => {
    grid.scale.set(ScreenManager.getScale());

    grid.position.set(
      window.innerWidth / 2 - grid.width / 2,
      window.innerHeight / 2 - grid.height / 2
    );
  };

  resize();

  document.getElementById('button-start')?.addEventListener('click', () => {
    grid.start();
  });
}
