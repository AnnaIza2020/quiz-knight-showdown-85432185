
import { Player, Question } from './game-types';

export type CardEffectType = 
  | 'shield'
  | 'reflect'
  | 'counter'
  | 'wildcard'
  | 'bonus'
  | 'life'
  | 'skip'
  | string;

export interface CardEffect {
  type: CardEffectType;
  sourcePlayerId: string;
  targetPlayerId?: string;
  soundEffect?: string;
  animationDuration?: number;
  points?: number;
  question?: Question;
}

// Full SpecialCard definition that includes all needed properties
export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  type: string;
  image_url?: string;
  sound_effect?: string;
  icon_name?: string;
  animation_style?: string;
  // Legacy properties for backward compatibility
  imageUrl?: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
  // Extended properties for card functionality
  effectType?: string;
  effectHook?: string;
  effectParams?: any;
}
