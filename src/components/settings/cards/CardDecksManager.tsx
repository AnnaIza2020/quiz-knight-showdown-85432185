
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { SpecialCard } from '@/types/card-types';
import DeckEditorDialog from './dialogs/DeckEditorDialog';
import DeleteConfirmationDialog from './dialogs/DeleteConfirmationDialog';
import DeckCard from './DeckCard';
import { createEmptyDeck, getCardById } from '@/utils/card-deck-utils';

export interface CardDeck {
  id: string;
  name: string;
  description: string;
  cards: CardInDeck[];
  maxCards?: number;
  maxRepeats?: number;
  isActive: boolean;
}

export interface CardInDeck {
  cardId: string;
  quantity: number;
}

interface CardDecksManagerProps {
  availableCards: SpecialCard[];
  onSaveDeck: (deck: CardDeck) => void;
  onDeleteDeck: (deckId: string) => void;
  onActivateDeck: (deckId: string) => void;
  initialDecks?: CardDeck[];
}

const CardDecksManager: React.FC<CardDecksManagerProps> = ({ 
  availableCards, 
  onSaveDeck, 
  onDeleteDeck, 
  onActivateDeck,
  initialDecks = []
}) => {
  const [decks, setDecks] = useState<CardDeck[]>(initialDecks);
  const [currentDeck, setCurrentDeck] = useState<CardDeck>(createEmptyDeck());
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewDeck, setIsNewDeck] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Create a new deck
  const handleCreateDeck = () => {
    setCurrentDeck(createEmptyDeck());
    setIsNewDeck(true);
    setIsEditorOpen(true);
  };

  // Edit an existing deck
  const handleEditDeck = (deck: CardDeck) => {
    setCurrentDeck({...deck});
    setIsNewDeck(false);
    setIsEditorOpen(true);
  };

  // Save the current deck
  const handleSaveDeck = (savedDeck: CardDeck) => {
    const updatedDecks = isNewDeck 
      ? [...decks, savedDeck]
      : decks.map(d => d.id === savedDeck.id ? savedDeck : d);
    
    setDecks(updatedDecks);
    onSaveDeck(savedDeck);
    setIsEditorOpen(false);
    
    toast.success(isNewDeck ? 'Talia została utworzona' : 'Talia została zaktualizowana');
  };

  // Delete a deck
  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      setDecks(decks.filter(d => d.id !== confirmDeleteId));
      onDeleteDeck(confirmDeleteId);
      setConfirmDeleteId(null);
      toast.success('Talia została usunięta');
    }
  };

  // Activate/deactivate a deck
  const handleActivateDeck = (deckId: string) => {
    const updatedDecks = decks.map(d => ({
      ...d,
      isActive: d.id === deckId
    }));
    
    setDecks(updatedDecks);
    onActivateDeck(deckId);
    toast.success('Talia została aktywowana');
  };

  // Get card by ID helper for child components
  const getCardByIdWrapper = (cardId: string) => {
    return getCardById(cardId, availableCards);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Talie Kart Specjalnych</h2>
        <Button onClick={handleCreateDeck}>
          <Plus className="mr-2 h-4 w-4" /> Nowa Talia
        </Button>
      </div>
      
      {decks.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {decks.map(deck => (
            <DeckCard
              key={deck.id}
              deck={deck}
              onEdit={handleEditDeck}
              onDelete={(deckId) => setConfirmDeleteId(deckId)}
              onActivate={handleActivateDeck}
              getCardById={getCardByIdWrapper}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg bg-black/20">
          <h3 className="text-xl font-medium mb-2">Brak zdefiniowanych talii</h3>
          <p className="text-muted-foreground mb-4">
            Stwórz swoją pierwszą talię kart specjalnych, aby ułatwić zarządzanie grą
          </p>
          <Button onClick={handleCreateDeck}>
            <Plus className="mr-2 h-4 w-4" /> Nowa Talia
          </Button>
        </div>
      )}
      
      {/* Deck Editor Dialog */}
      <DeckEditorDialog
        open={isEditorOpen}
        onOpenChange={setIsEditorOpen}
        currentDeck={currentDeck}
        onSave={handleSaveDeck}
        onCancel={() => setIsEditorOpen(false)}
        availableCards={availableCards}
        isNewDeck={isNewDeck}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!confirmDeleteId}
        onOpenChange={(open) => !open && setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
        title="Potwierdź usunięcie"
        description="Czy na pewno chcesz usunąć tę talię? Ta operacja jest nieodwracalna."
        confirmLabel="Usuń"
        cancelLabel="Anuluj"
      />
    </div>
  );
};

export default CardDecksManager;
