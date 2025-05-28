
import { SpecialCard } from '@/types/interfaces';

export const defaultSpecialCards: SpecialCard[] = [
  {
    id: '1',
    name: 'Tarcza',
    description: 'Chroni przed jedną błędną odpowiedzią',
    type: 'defense',
    iconName: 'shield',
    soundEffect: 'card-reveal',
    animationStyle: 'neon-blue',
    defaultQuantity: 2
  },
  {
    id: '2',
    name: 'Odbicie',
    description: 'Przekierowuje pytanie do innego gracza',
    type: 'attack',
    iconName: 'zap',
    soundEffect: 'card-reveal',
    animationStyle: 'neon-red',
    defaultQuantity: 1
  },
  {
    id: '3',
    name: 'Bonus',
    description: 'Daje dodatkowe punkty za poprawną odpowiedź',
    type: 'bonus',
    iconName: 'star',
    soundEffect: 'bonus',
    animationStyle: 'neon-yellow',
    defaultQuantity: 3
  },
  {
    id: '4',
    name: 'Joker',
    description: 'Pozwala na wybór dowolnej odpowiedzi',
    type: 'manipulation',
    iconName: 'shuffle',
    soundEffect: 'card-reveal',
    animationStyle: 'rainbow',
    defaultQuantity: 1
  }
];
