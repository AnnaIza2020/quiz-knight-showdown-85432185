
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { SpecialCard } from '@/types/game-types';
import { toast } from 'sonner';
import CardDisplay from '@/components/cards/CardDisplay';

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
  const [currentDeck, setCurrentDeck] = useState<CardDeck>({
    id: '',
    name: '',
    description: '',
    cards: [],
    isActive: false
  });
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isNewDeck, setIsNewDeck] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Create a new deck
  const handleCreateDeck = () => {
    setCurrentDeck({
      id: crypto.randomUUID(),
      name: '',
      description: '',
      cards: [],
      isActive: false
    });
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
  const handleSaveDeck = () => {
    if (!currentDeck.name.trim()) {
      toast.error('Nazwa talii jest wymagana');
      return;
    }

    const updatedDecks = isNewDeck 
      ? [...decks, currentDeck]
      : decks.map(d => d.id === currentDeck.id ? currentDeck : d);
    
    setDecks(updatedDecks);
    onSaveDeck(currentDeck);
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

  // Add a card to the current deck
  const handleAddCardToDeck = (cardId: string) => {
    const existingCard = currentDeck.cards.find(c => c.cardId === cardId);
    
    if (existingCard) {
      // Increment quantity if card already exists
      const updatedCards = currentDeck.cards.map(c => 
        c.cardId === cardId 
          ? { ...c, quantity: c.quantity + 1 } 
          : c
      );
      setCurrentDeck({...currentDeck, cards: updatedCards});
    } else {
      // Add new card with quantity 1
      setCurrentDeck({
        ...currentDeck, 
        cards: [...currentDeck.cards, { cardId, quantity: 1 }]
      });
    }
  };

  // Remove a card from the current deck
  const handleRemoveCardFromDeck = (cardId: string) => {
    const existingCard = currentDeck.cards.find(c => c.cardId === cardId);
    
    if (existingCard && existingCard.quantity > 1) {
      // Decrement quantity if more than 1
      const updatedCards = currentDeck.cards.map(c => 
        c.cardId === cardId 
          ? { ...c, quantity: c.quantity - 1 } 
          : c
      );
      setCurrentDeck({...currentDeck, cards: updatedCards});
    } else {
      // Remove card if quantity is 1
      setCurrentDeck({
        ...currentDeck, 
        cards: currentDeck.cards.filter(c => c.cardId !== cardId)
      });
    }
  };

  // Get card details by ID
  const getCardById = (cardId: string) => {
    return availableCards.find(card => card.id === cardId);
  };

  // Calculate total cards in a deck
  const getTotalCards = (deck: CardDeck) => {
    return deck.cards.reduce((total, cardInDeck) => total + cardInDeck.quantity, 0);
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
            <Card 
              key={deck.id} 
              className={`${deck.isActive ? 'border-neon-blue/50 bg-neon-blue/5' : ''}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center">
                      {deck.name} 
                      {deck.isActive && (
                        <span className="ml-2 text-xs bg-neon-blue text-white px-2 py-0.5 rounded">
                          Aktywna
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {getTotalCards(deck)} kart ({deck.cards.length} rodzajów)
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditDeck(deck)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => setConfirmDeleteId(deck.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {deck.description || 'Brak opisu'}
                </p>
                
                {deck.cards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {deck.cards.slice(0, 5).map(cardInDeck => {
                      const card = getCardById(cardInDeck.cardId);
                      return card ? (
                        <div key={cardInDeck.cardId} className="relative">
                          <CardDisplay card={card} size="tiny" />
                          <span className="absolute -top-2 -right-2 bg-black/80 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white/20">
                            {cardInDeck.quantity}
                          </span>
                        </div>
                      ) : null;
                    })}
                    {deck.cards.length > 5 && (
                      <div className="flex items-center justify-center bg-black/30 rounded w-10 h-10 text-xs">
                        +{deck.cards.length - 5}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Brak kart w talii</p>
                )}
              </CardContent>
              <CardFooter>
                {!deck.isActive ? (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleActivateDeck(deck.id)}
                  >
                    Aktywuj talię
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleActivateDeck('')}
                  >
                    Dezaktywuj
                  </Button>
                )}
              </CardFooter>
            </Card>
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
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isNewDeck ? 'Nowa talia kart' : 'Edytuj talię kart'}</DialogTitle>
            <DialogDescription>
              Dostosuj talię kart, które będą używane podczas gry
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nazwa talii</Label>
                <Input 
                  id="name" 
                  value={currentDeck.name} 
                  onChange={e => setCurrentDeck({...currentDeck, name: e.target.value})} 
                  placeholder="np. Podstawowa talia"
                />
              </div>
              <div>
                <Label htmlFor="maxCards">Maksymalna liczba kart (opcjonalnie)</Label>
                <Input 
                  id="maxCards" 
                  type="number" 
                  min="0"
                  value={currentDeck.maxCards || ''} 
                  onChange={e => setCurrentDeck({
                    ...currentDeck, 
                    maxCards: e.target.value ? parseInt(e.target.value) : undefined
                  })} 
                  placeholder="Bez limitu"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Opis talii</Label>
              <Textarea 
                id="description" 
                value={currentDeck.description} 
                onChange={e => setCurrentDeck({...currentDeck, description: e.target.value})} 
                placeholder="Opisz przeznaczenie talii..."
                rows={3}
              />
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Zawartość talii</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-r pr-4">
                  <h4 className="text-sm font-medium mb-2">Dostępne karty</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2">
                    {availableCards.map(card => (
                      <div 
                        key={card.id} 
                        className="flex flex-col items-center border rounded p-2 cursor-pointer hover:bg-black/20"
                        onClick={() => handleAddCardToDeck(card.id)}
                      >
                        <CardDisplay card={card} size="tiny" />
                        <span className="text-xs mt-1">{card.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Karty w talii</h4>
                  {currentDeck.cards.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Karta</TableHead>
                          <TableHead>Ilość</TableHead>
                          <TableHead className="w-[100px]">Akcje</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDeck.cards.map(cardInDeck => {
                          const card = getCardById(cardInDeck.cardId);
                          return card ? (
                            <TableRow key={cardInDeck.cardId}>
                              <TableCell className="flex items-center gap-2">
                                <CardDisplay card={card} size="tiny" />
                                <span>{card.name}</span>
                              </TableCell>
                              <TableCell>{cardInDeck.quantity}</TableCell>
                              <TableCell>
                                <div className="flex space-x-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAddCardToDeck(cardInDeck.cardId)}
                                  >
                                    <ChevronUp className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveCardFromDeck(cardInDeck.cardId)}
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : null;
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center justify-center h-40 border border-dashed rounded text-center p-4 text-muted-foreground">
                      <div>
                        <p>Kliknij karty po lewej stronie,</p>
                        <p>aby dodać je do talii</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-right text-sm text-muted-foreground">
                Łącznie kart: {getTotalCards(currentDeck)} | Typów kart: {currentDeck.cards.length}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveDeck}>
              {isNewDeck ? 'Utwórz talię' : 'Zapisz zmiany'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Potwierdź usunięcie</DialogTitle>
            <DialogDescription>
              Czy na pewno chcesz usunąć tę talię? Ta operacja jest nieodwracalna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardDecksManager;
