
import { SpecialCard } from '@/types/card-types';
import { CardDeck, CardInDeck } from '@/components/settings/cards';

/**
 * Calculate total cards count in a deck
 */
export const getTotalCards = (deck: CardDeck): number => {
  return deck.cards.reduce((total, cardInDeck) => total + cardInDeck.quantity, 0);
};

/**
 * Get card details by ID from available cards
 */
export const getCardById = (cardId: string, availableCards: SpecialCard[]): SpecialCard | undefined => {
  return availableCards.find(card => card.id === cardId);
};

/**
 * Generate a new unique deck ID
 */
export const generateDeckId = (): string => {
  return crypto.randomUUID();
};

/**
 * Create a new empty deck template
 */
export const createEmptyDeck = (): CardDeck => {
  return {
    id: generateDeckId(),
    name: '',
    description: '',
    cards: [],
    isActive: false
  };
};

/**
 * Add a card to a deck or increment its quantity if already exists
 */
export const addCardToDeck = (deck: CardDeck, cardId: string): CardDeck => {
  const existingCard = deck.cards.find(c => c.cardId === cardId);
  
  if (existingCard) {
    // Increment quantity if card already exists
    return {
      ...deck,
      cards: deck.cards.map(c => 
        c.cardId === cardId 
          ? { ...c, quantity: c.quantity + 1 } 
          : c
      )
    };
  } else {
    // Add new card with quantity 1
    return {
      ...deck,
      cards: [...deck.cards, { cardId, quantity: 1 }]
    };
  }
};

/**
 * Remove a card from deck or decrement its quantity
 */
export const removeCardFromDeck = (deck: CardDeck, cardId: string): CardDeck => {
  const existingCard = deck.cards.find(c => c.cardId === cardId);
  
  if (existingCard && existingCard.quantity > 1) {
    // Decrement quantity if more than 1
    return {
      ...deck,
      cards: deck.cards.map(c => 
        c.cardId === cardId 
          ? { ...c, quantity: c.quantity - 1 } 
          : c
      )
    };
  } else {
    // Remove card if quantity is 1 or card not found
    return {
      ...deck,
      cards: deck.cards.filter(c => c.cardId !== cardId)
    };
  }
};

/**
 * Validates if a deck satisfies all constraints
 */
export const validateDeck = (deck: CardDeck): { valid: boolean; message?: string } => {
  if (!deck.name.trim()) {
    return { valid: false, message: 'Nazwa talii jest wymagana' };
  }
  
  const totalCards = getTotalCards(deck);
  
  if (deck.maxCards && totalCards > deck.maxCards) {
    return { 
      valid: false, 
      message: `Maksymalna liczba kart w talii to ${deck.maxCards} (aktualna: ${totalCards})` 
    };
  }
  
  return { valid: true };
};
