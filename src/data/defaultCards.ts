
import { SpecialCard } from '@/types/interfaces';

export const defaultSpecialCards: SpecialCard[] = [
  {
    id: 'dejavu',
    name: 'Déjà Vu',
    description: 'Powtórz ostatnie pytanie dla wszystkich graczy',
    type: 'manipulation',
    iconUrl: '/icons/cards/dejavu.svg',
    soundEffect: 'card-dejavu',
    animation: 'time-rewind',
    defaultQuantity: 1
  },
  {
    id: 'kontra',
    name: 'Kontra',
    description: 'Przekaż pytanie innemu graczowi',
    type: 'defense',
    iconUrl: '/icons/cards/kontra.svg',
    soundEffect: 'card-kontra',
    animation: 'redirect-arrow',
    defaultQuantity: 2
  },
  {
    id: 'reanimacja',
    name: 'Reanimacja',
    description: 'Przywróć 25% życia',
    type: 'defense',
    iconUrl: '/icons/cards/reanimacja.svg',
    soundEffect: 'card-heal',
    animation: 'health-restore',
    defaultQuantity: 1
  },
  {
    id: 'skip',
    name: 'Skip',
    description: 'Pomiń swoje pytanie bez kary',
    type: 'defense',
    iconUrl: '/icons/cards/skip.svg',
    soundEffect: 'card-skip',
    animation: 'fast-forward',
    defaultQuantity: 2
  },
  {
    id: 'turbo',
    name: 'Turbo',
    description: 'Podwój punkty za następną poprawną odpowiedź',
    type: 'bonus',
    iconUrl: '/icons/cards/turbo.svg',
    soundEffect: 'card-turbo',
    animation: 'speed-boost',
    defaultQuantity: 1
  }
];
