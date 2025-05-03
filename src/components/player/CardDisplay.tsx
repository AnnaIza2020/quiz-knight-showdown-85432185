
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type?: string;
}

interface CardDisplayProps {
  cards: Card[];
  onUseCard?: (cardId: string) => void;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ cards, onUseCard }) => {
  if (!cards || cards.length === 0) return null;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Twoje karty specjalne</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map(card => (
          <div 
            key={card.id} 
            className="relative p-3 bg-black/30 border border-white/20 rounded-lg overflow-hidden"
          >
            <div className="flex items-start">
              {card.imageUrl && (
                <div className="w-16 h-16 mr-3 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium">{card.name}</h4>
                  {card.type && (
                    <Badge variant="outline" className="ml-2">
                      {card.type}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-white/70 mt-1">
                  {card.description}
                </p>
              </div>
            </div>
            {onUseCard && (
              <Button 
                onClick={() => onUseCard(card.id)}
                className="w-full mt-2" 
                variant="outline" 
                size="sm"
              >
                Użyj karty
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardDisplay;
