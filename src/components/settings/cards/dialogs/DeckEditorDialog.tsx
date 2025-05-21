
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CardDeck } from '../CardDecksManager';
import { Trash2, Plus, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { SpecialCard } from '@/types/card-types';
import CardDisplay from '@/components/cards/CardDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DeckEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deck?: CardDeck;
  onSave: (deck: CardDeck) => void;
  availableCards: SpecialCard[];
}

const DeckEditorDialog = ({ 
  isOpen, 
  onClose, 
  deck, 
  onSave, 
  availableCards 
}: DeckEditorDialogProps) => {
  // Initialize state with deck data or defaults
  const [name, setName] = useState(deck?.name || '');
  const [description, setDescription] = useState(deck?.description || '');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [cards, setCards] = useState<{cardId: string, quantity: number}[]>(
    deck?.cards || []
  );

  // Reset form when deck changes
  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setDescription(deck.description || '');
      setCards(deck.cards);
    } else {
      setName('');
      setDescription('');
      setCards([]);
    }
    setSelectedCardId('');
    setSelectedQuantity(1);
  }, [deck]);

  // Add a card to the deck
  const handleAddCard = () => {
    if (!selectedCardId) return;
    
    // Check if card already exists in deck
    const existingCardIndex = cards.findIndex(card => card.cardId === selectedCardId);
    
    if (existingCardIndex >= 0) {
      // Update quantity if card exists
      const updatedCards = [...cards];
      updatedCards[existingCardIndex].quantity += selectedQuantity;
      setCards(updatedCards);
    } else {
      // Add new card with quantity
      setCards([...cards, { 
        cardId: selectedCardId,
        quantity: selectedQuantity
      }]);
    }
    
    // Reset selection
    setSelectedCardId('');
    setSelectedQuantity(1);
  };

  // Remove a card from the deck
  const handleRemoveCard = (cardId: string) => {
    setCards(cards.filter(card => card.cardId !== cardId));
  };

  // Handle save
  const handleSave = () => {
    if (!name.trim()) {
      return; // Name is required
    }
    
    onSave({
      id: deck?.id || uuidv4(),
      name,
      description,
      cards,
      isActive: deck?.isActive || false
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deck ? 'Edytuj talię' : 'Nowa talia'}</DialogTitle>
          <DialogDescription>
            {deck ? 'Zmodyfikuj talię kart specjalnych' : 'Stwórz nową talię kart specjalnych'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <Label className="col-span-1" htmlFor="name">Nazwa</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label className="col-span-1" htmlFor="description">Opis</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <Label className="block mb-2">Karty w talii</Label>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <Select
                  value={selectedCardId}
                  onValueChange={setSelectedCardId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz kartę" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCards.map(card => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedQuantity.toString()}
                  onValueChange={(val) => setSelectedQuantity(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ilość" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleAddCard}
                  disabled={!selectedCardId}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Dodaj
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {cards.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {cards.map(card => {
                    const cardDetails = availableCards.find(c => c.id === card.cardId);
                    return cardDetails ? (
                      <div key={card.cardId} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <CardDisplay card={cardDetails} size="sm" />
                          <div className="ml-2">
                            <div className="font-semibold">{cardDetails.name}</div>
                            <div className="text-sm text-muted-foreground">x{card.quantity}</div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveCard(card.cardId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Brak kart w talii
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">Anuluj</Button>
          <Button onClick={handleSave}>Zapisz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeckEditorDialog;
