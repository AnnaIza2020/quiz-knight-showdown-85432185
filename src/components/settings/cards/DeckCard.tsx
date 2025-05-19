
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { SpecialCard } from '@/types/card-types';
import CardDisplay from '@/components/cards/CardDisplay';
import { getTotalCards } from '@/utils/card-deck-utils';
import { CardDeck } from './CardDecksManager';

interface DeckCardProps {
  deck: CardDeck;
  onEdit: (deck: CardDeck) => void;
  onDelete: (deckId: string) => void;
  onActivate: (deckId: string) => void;
  getCardById: (cardId: string) => SpecialCard | undefined;
}

const DeckCard: React.FC<DeckCardProps> = ({ 
  deck, 
  onEdit, 
  onDelete, 
  onActivate, 
  getCardById 
}) => {
  return (
    <Card 
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
              onClick={() => onEdit(deck)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-destructive"
              onClick={() => onDelete(deck.id)}
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
            onClick={() => onActivate(deck.id)}
          >
            Aktywuj talię
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onActivate('')}
          >
            Dezaktywuj
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeckCard;
