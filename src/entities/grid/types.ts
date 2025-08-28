import { Point } from '@/shared/types';

export type Color = 'red' | 'blue' | 'orange' | 'green' | 'yellow';

export interface Cluster {
  id: string;
  positions: Point[];
}
