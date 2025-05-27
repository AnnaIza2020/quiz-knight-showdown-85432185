
export type CardSize = 'small' | 'medium' | 'large';

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  type: 'defense' | 'attack' | 'bonus' | 'manipulation';
  jsHook?: string;
  soundEffect?: string;
  animation?: string;
  defaultQuantity: number;
  size?: CardSize;
}
