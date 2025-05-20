
import { Player, Question, SpecialCard } from './game-types';

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

// Re-export SpecialCard for compatibility
export { SpecialCard } from './game-types';
