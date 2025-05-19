
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import CardDisplay from '@/components/cards/CardDisplay';
import { SpecialCard } from '@/types/card-types';
import { CardDeck, CardInDeck } from '../CardDecksManager';
import { addCardToDeck, getCardById, getTotalCards, removeCardFromDeck, validateDeck } from '@/utils/card-deck-utils';

interface DeckEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentDeck: CardDeck;
  onSave: (deck: CardDeck) => void;
  onCancel: () => void;
  availableCards: SpecialCard[];
  isNewDeck: boolean;
}

const DeckEditorDialog: React.FC<DeckEditorDialogProps> = ({
  open,
  onOpenChange,
  currentDeck,
  onSave,
  onCancel,
  availableCards,
  isNewDeck
}) => {
  const [deck, setDeck] = useState<CardDeck>(currentDeck);
  
  // Update local deck state when the passed deck changes
  useEffect(() => {
    setDeck(currentDeck);
  }, [currentDeck]);
  
  // Handle save action
  const handleSave = () => {
    const validation = validateDeck(deck);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    onSave(deck);
  };

  // Handle adding card to deck
  const handleAddCardToDeck = (cardId: string) => {
    setDeck(prevDeck => addCardToDeck(prevDeck, cardId));
  };

  // Handle removing card from deck
  const handleRemoveCardFromDeck = (cardId: string) => {
    setDeck(prevDeck => removeCardFromDeck(prevDeck, cardId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                value={deck.name} 
                onChange={e => setDeck({...deck, name: e.target.value})} 
                placeholder="np. Podstawowa talia"
              />
            </div>
            <div>
              <Label htmlFor="maxCards">Maksymalna liczba kart (opcjonalnie)</Label>
              <Input 
                id="maxCards" 
                type="number" 
                min="0"
                value={deck.maxCards || ''} 
                onChange={e => setDeck({
                  ...deck, 
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
              value={deck.description} 
              onChange={e => setDeck({...deck, description: e.target.value})} 
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
                {deck.cards.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Karta</TableHead>
                        <TableHead>Ilość</TableHead>
                        <TableHead className="w-[100px]">Akcje</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deck.cards.map(cardInDeck => {
                        const card = getCardById(cardInDeck.cardId, availableCards);
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
              Łącznie kart: {getTotalCards(deck)} | Typów kart: {deck.cards.length}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Anuluj
          </Button>
          <Button onClick={handleSave}>
            {isNewDeck ? 'Utwórz talię' : 'Zapisz zmiany'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeckEditorDialog;
