import { Point } from '@/shared/types';

export type IColor = 'red' | 'blue' | 'orange' | 'green' | 'yellow';

export interface Cluster {
  id: string;
  positions: Point[];
}
