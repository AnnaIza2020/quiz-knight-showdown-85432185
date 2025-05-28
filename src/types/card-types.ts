
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

export type CardEffectType = 'shield' | 'reflect' | 'counter' | 'wildcard' | 'bonus' | 'life' | 'skip';

export interface CardEffect {
  type: CardEffectType;
  sourcePlayerId: string;
  targetPlayerId?: string;
  soundEffect?: string;
  animationDuration?: number;
  points?: number;
}
