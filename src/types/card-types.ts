
export type CardEffectType = 
  | 'shield'
  | 'reflect'
  | 'counter'
  | 'wildcard'
  | 'bonus'
  | 'life'
  | 'skip';

export interface CardEffect {
  type: CardEffectType;
  sourcePlayerId?: string;
  targetPlayerId?: string;
  soundEffect?: string;
  animationDuration?: number;
  points?: number;
}

export interface CardDeck {
  id: string;
  name: string;
  description?: string;
  cards: string[]; // Array of card IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CardDeckRule {
  id: string;
  deckId: string;
  condition: 'round_start' | 'player_elimination' | 'score_milestone';
  threshold?: number;
  probability: number;
  isEnabled: boolean;
}
