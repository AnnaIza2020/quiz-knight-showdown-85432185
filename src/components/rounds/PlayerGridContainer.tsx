
import React, { useState, useEffect } from 'react';
import { Player, GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PlayerCard from '@/components/PlayerCard';
import { Pencil, Save, X, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface PlayerGridContainerProps {
  players: Player[];
  round: GameRound;
  activePlayerId: string | null;
}

const PlayerGridContainer: React.FC<PlayerGridContainerProps> = ({
  players,
  round,
  activePlayerId
}) => {
  const { setActivePlayer, addManualPoints, adjustHealthManually } = useGameContext();
  const [activePlayers, setActivePlayers] = useState<Player[]>([]);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPoints, setEditPoints] = useState(0);
  const [editHealth, setEditHealth] = useState(0);
  
  // Filter and sort players based on round
  useEffect(() => {
    // Show only non-eliminated players
    let filtered = players.filter(p => !p.isEliminated);
    
    // Sort by points (highest first)
    let sorted = [...filtered].sort((a, b) => b.points - a.points);
    
    // For round 2, we want to show at most 6 players at a time
    if (round === GameRound.ROUND_TWO) {
      sorted = sorted.slice(0, 6);
    }
    
    setActivePlayers(sorted);
  }, [players, round]);
  
  // Handle active player selection
  const handleSelectActivePlayer = (playerId: string) => {
    setActivePlayer(playerId);
    toast.info(`Wybrano aktywnego gracza: ${players.find(p => p.id === playerId)?.name}`);
  };
  
  // Start editing player stats
  const handleStartEditing = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditPoints(player.points);
    setEditHealth(player.health);
  };
  
  // Save edited player stats
  const handleSaveEditing = (playerId: string) => {
    // Get the player
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Calculate point change
    const pointDifference = editPoints - player.points;
    
    // Update points
    if (pointDifference !== 0) {
      addManualPoints(playerId, pointDifference);
      
      if (pointDifference > 0) {
        toast.success(`Dodano ${pointDifference} punktów dla ${player.name}`);
      } else {
        toast.info(`Odjęto ${Math.abs(pointDifference)} punktów od ${player.name}`);
      }
    }
    
    // Update health
    if (editHealth !== player.health) {
      adjustHealthManually(playerId, editHealth);
      toast.info(`Ustawiono życie gracza ${player.name} na ${editHealth}%`);
    }
    
    // Reset editing state
    setEditingPlayerId(null);
  };
  
  // Cancel editing
  const handleCancelEditing = () => {
    setEditingPlayerId(null);
  };
  
  // Determine grid layout based on round and number of players
  const getGridClasses = () => {
    if (round === GameRound.ROUND_TWO && activePlayers.length > 3) {
      // For Round 2 with 4-6 players, we do a 3x2 grid
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4";
    }
    
    // Default layout
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">
          Gracze ({activePlayers.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {activePlayers.length > 0 ? (
          <div className={getGridClasses()}>
            {activePlayers.map(player => (
              <div key={player.id} className="relative">
                {/* Active player indicator */}
                {activePlayerId === player.id && (
                  <div className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-neon-green flex items-center justify-center">
                    <UserCheck className="text-black h-4 w-4" />
                  </div>
                )}
                
                {editingPlayerId === player.id ? (
                  <Card className="bg-black/60 border border-white/20 overflow-hidden">
                    <CardHeader className="p-3">
                      <CardTitle className="text-lg">{player.name}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="p-3">
                      <div className="mb-2">
                        <label className="block text-sm text-white/70 mb-1">Punkty:</label>
                        <Input
                          type="number"
                          value={editPoints}
                          onChange={(e) => setEditPoints(parseInt(e.target.value) || 0)}
                          className="bg-black/50 border-white/20"
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-sm text-white/70 mb-1">Życie (%):</label>
                        <Input
                          type="number"
                          value={editHealth}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setEditHealth(Math.max(0, Math.min(100, value)));
                          }}
                          className="bg-black/50 border-white/20"
                          min="0"
                          max="100"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCancelEditing}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => handleSaveEditing(player.id)}
                          className="bg-neon-green hover:bg-neon-green/80 text-black"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="relative group">
                    <PlayerCard
                      player={player}
                      onClick={() => handleSelectActivePlayer(player.id)}
                      isSelected={activePlayerId === player.id}
                    />
                    
                    {/* Edit button */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditing(player);
                            }}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edytuj punkty i życie gracza</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-white/50">
            Brak aktywnych graczy
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerGridContainer;
