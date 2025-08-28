export class ScreenManager {
  static container = document.getElementById('pixi-container')!;

  static getSize = () => {
    const { width, height } = this.container.getBoundingClientRect();

    return {
      width: width,
      height: height,
    };
  };

  static originalSize = this.getSize();

  static getScale = () => {
    const { width, height } = this.getSize();

    const scaleX = width / this.originalSize.width;
    const scaleY = height / this.originalSize.height;

    return Math.min(scaleX, scaleY, 1);
  };
}
