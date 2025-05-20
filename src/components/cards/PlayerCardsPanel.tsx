
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpecialCard, Player } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Wand2, Undo2 } from 'lucide-react';
import CardDisplay from './CardDisplay';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PlayerCardsPanelProps {
  players: Player[];
}

const PlayerCardsPanel: React.FC<PlayerCardsPanelProps> = ({ players }) => {
  const { 
    specialCards, 
    usePlayerCard, 
    giveCardToPlayer,
    playSound
  } = useGameContext();
  
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [useCardDialogOpen, setUseCardDialogOpen] = useState(false);
  const [lastUsedCard, setLastUsedCard] = useState<{playerId: string, cardId: string} | null>(null);
  
  // Filter players who have cards
  const playersWithCards = players.filter(player => 
    player.specialCards && player.specialCards.length > 0
  );
  
  // Get cards for a player
  const getPlayerCards = (playerId: string): SpecialCard[] => {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.specialCards?.length) return [];
    
    return player.specialCards
      .map(cardId => specialCards.find(card => card.id === cardId))
      .filter((card): card is SpecialCard => !!card);
  };
  
  // Open the use card dialog
  const handleOpenUseCardDialog = (player: Player, cardId: string) => {
    setSelectedPlayer(player);
    setSelectedCardId(cardId);
    setUseCardDialogOpen(true);
  };
  
  // Handle using a card
  const handleUseCard = () => {
    if (!selectedPlayer || !selectedCardId) return;
    
    // Find the card
    const card = specialCards.find(c => c.id === selectedCardId);
    if (!card) return;
    
    // Use the card
    usePlayerCard(selectedPlayer.id, selectedCardId);
    
    // Store for potential undo
    setLastUsedCard({
      playerId: selectedPlayer.id,
      cardId: selectedCardId
    });
    
    // Play sound effect
    playSound(card.soundEffect as any || 'card-reveal');
    
    // Show toast
    toast.success(`${selectedPlayer.name} używa karty: ${card.name}`, {
      description: card.description
    });
    
    // Close dialog
    setUseCardDialogOpen(false);
  };
  
  // Handle undoing the last used card
  const handleUndoLastCard = () => {
    if (!lastUsedCard) {
      toast.error('Brak karty do cofnięcia');
      return;
    }
    
    const { playerId, cardId } = lastUsedCard;
    
    // Find the card
    const card = specialCards.find(c => c.id === cardId);
    if (!card) return;
    
    // Find the player
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Add the card back to the player
    giveCardToPlayer(playerId, cardId);
    
    // Play sound
    playSound('success');
    
    // Show toast
    toast.success(`Cofnięto użycie karty ${card.name} dla gracza ${player.name}`);
    
    // Clear last used card
    setLastUsedCard(null);
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold text-white">
          Karty Specjalne
        </CardTitle>
        
        <Button
          variant="outline"
          disabled={!lastUsedCard}
          onClick={handleUndoLastCard}
          className="border-neon-green text-neon-green hover:bg-neon-green/10"
        >
          <Undo2 className="h-4 w-4 mr-1" />
          Cofnij kartę
        </Button>
      </CardHeader>
      
      <CardContent>
        {playersWithCards.length > 0 ? (
          <div>
            {playersWithCards.map(player => (
              <div key={player.id} className="mb-4 last:mb-0">
                <h3 className="font-medium mb-2 flex items-center">
                  {/* Player color indicator */}
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: player.color || '#ff00ff' }}
                  />
                  {player.name}
                  <span className="ml-2 text-sm text-white/50">
                    ({getPlayerCards(player.id).length}/3)
                  </span>
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {getPlayerCards(player.id).map(card => (
                    <div key={card.id} className="relative group">
                      <CardDisplay card={card} size="small" />
                      
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenUseCardDialog(player, card.id)}
                        className="absolute bottom-2 right-2 bg-neon-blue/80 hover:bg-neon-blue text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Wand2 className="h-3 w-3 mr-1" />
                        Użyj
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-white/50">
            Żaden z graczy nie posiada kart specjalnych
          </div>
        )}
      </CardContent>
      
      {/* Use Card Dialog */}
      <Dialog open={useCardDialogOpen} onOpenChange={setUseCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Użyj karty specjalnej</DialogTitle>
          </DialogHeader>
          
          {selectedPlayer && selectedCardId && (
            <div>
              <DialogDescription>
                Czy na pewno chcesz, aby gracz {selectedPlayer.name} użył tej karty?
              </DialogDescription>
              
              <div className="my-4 flex justify-center">
                {(() => {
                  const card = specialCards.find(c => c.id === selectedCardId);
                  if (card) {
                    return <CardDisplay card={card} size="medium" />;
                  }
                  return null;
                })()}
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setUseCardDialogOpen(false)}
                >
                  Anuluj
                </Button>
                
                <Button
                  onClick={handleUseCard}
                  className="bg-neon-blue hover:bg-neon-blue/80"
                >
                  <Wand2 className="h-4 w-4 mr-1" />
                  Użyj karty
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PlayerCardsPanel;
