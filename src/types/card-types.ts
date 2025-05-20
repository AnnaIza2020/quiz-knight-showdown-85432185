
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
