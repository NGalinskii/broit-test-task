export class Random {
  public static getInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static float(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static getElementFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  public static shuffleArray<T>(array: T[]): T[] {
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public static chance(probability: number): boolean {
    return Math.random() < probability;
  }
}
