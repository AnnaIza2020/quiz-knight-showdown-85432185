
import { SoundEffect } from './game-types';

// Define a type for card sizes
export type CardSize = "tiny" | "small" | "medium" | "large";

// Special Card interface
export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
  // New properties:
  effectHook?: string;
  effectType?: string;
  effectParams?: Record<string, any>;
}

// Special Card Award Rule interface
export interface SpecialCardAwardRule {
  id: string;
  cardId: string;
  condition: 'correct_answer' | 'incorrect_answer' | 'round_start' | 'round_end' | 'random' | string;
  probability?: number; // 0-100
  roundApplicable?: number[];
  roundType?: number;
  description?: string;
  isEnabled?: boolean;
  // New property:
  params?: Record<string, any>;
}

// Card effect types
export type CardEffectType = 
  | 'shield'    // Blocks one incorrect answer
  | 'reflect'   // Sends question to another player
  | 'counter'   // Returns negative effects back to sender
  | 'wildcard'  // Allows a choice of answer options
  | 'bonus'     // Gives extra points
  | 'life'      // Gives an extra life
  | 'skip'      // Skips a question
  | string;     // For custom effects

export interface CardEffect {
  type: CardEffectType;
  sourcePlayerId: string;
  targetPlayerId?: string;
  points?: number;
  animationDuration?: number;
  soundEffect?: string;
}
