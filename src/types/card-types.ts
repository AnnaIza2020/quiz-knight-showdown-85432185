
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

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
  type: string;
  effectType?: string;
  effectHook?: string;
  effectParams?: Record<string, any>;
  // Legacy field mappings
  image_url?: string;
  sound_effect?: string;
  icon_name?: string;
  animation_style?: string;
}

export type CardSize = 'tiny' | 'sm' | 'small' | 'md' | 'medium' | 'large' | 'xl';

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
