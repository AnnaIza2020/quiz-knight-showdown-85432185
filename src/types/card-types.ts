
export type CardSize = 'tiny' | 'small' | 'medium' | 'large';

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  iconName?: string;
  type: 'defense' | 'attack' | 'bonus' | 'manipulation';
  jsHook?: string;
  soundEffect?: string;
  animation?: string;
  animationStyle?: 'glow' | 'neon-blue' | 'neon-green' | 'neon-red' | 'neon-purple' | 'rainbow';
  defaultQuantity: number;
  size?: CardSize;
  effectHook?: string;
  effectType?: string;
  effectParams?: Record<string, any>;
}
