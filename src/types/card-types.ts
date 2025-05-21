
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

export interface CardEffect {
  type: string;
  value: number | string | boolean;
  duration?: number;
  target?: 'self' | 'opponent' | 'all';
}

export interface PlayerCard {
  id: string;
  cardId: string;
  playerId: string;
  used: boolean;
  usedAt?: Date;
}

// Card size type used throughout the application
export type CardSize = 'tiny' | 'small' | 'medium' | 'large' | 'xl';
