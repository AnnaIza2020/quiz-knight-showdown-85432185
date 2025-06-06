
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useGameContext } from '@/context/GameContext';
import { Player } from '@/types/game-types';
import { UserPlus, Trash2, Heart, Trophy, Zap, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const PlayersManagementPanel: React.FC = () => {
  const {
    players,
    addPlayer,
    removePlayer,
    updatePlayer,
    eliminatePlayer,
    awardPoints,
    deductHealth,
    setActivePlayer,
    activePlayerId
  } = useGameContext();

  const [newPlayerName, setNewPlayerName] = useState('');
  const [showEliminated, setShowEliminated] = useState(false);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error('Wprowadź nazwę gracza');
      return;
    }

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: newPlayerName.trim(),
      points: 0,
      health: 100,
      lives: 3,
      isEliminated: false,
      specialCards: []
    };

    addPlayer(newPlayer);
    setNewPlayerName('');
    toast.success(`Dodano gracza: ${newPlayer.name}`);
  };

  const handleRemovePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      removePlayer(playerId);
      toast.info(`Usunięto gracza: ${player.name}`);
    }
  };

  const handleEliminatePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      eliminatePlayer(playerId);
      toast.warning(`Wyeliminowano gracza: ${player.name}`);
    }
  };

  const handleSetActivePlayer = (playerId: string) => {
    setActivePlayer(playerId);
    const player = players.find(p => p.id === playerId);
    if (player) {
      toast.info(`Aktywny gracz: ${player.name}`);
    }
  };

  const handleAwardPoints = (playerId: string, points: number) => {
    awardPoints(playerId, points);
    const player = players.find(p => p.id === playerId);
    if (player) {
      toast.success(`+${points} pkt dla ${player.name}`);
    }
  };

  const handleDeductHealth = (playerId: string, percentage: number) => {
    deductHealth(playerId, percentage);
    const player = players.find(p => p.id === playerId);
    if (player) {
      toast.warning(`-${percentage}% życia dla ${player.name}`);
    }
  };

  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated);
  const displayPlayers = showEliminated ? players : activePlayers;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Zarządzanie Graczami
          <div className="flex gap-2">
            <Badge variant="outline">
              Aktywni: {activePlayers.length}
            </Badge>
            <Badge variant="destructive">
              Wyeliminowani: {eliminatedPlayers.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Player */}
        <div className="flex gap-2">
          <Input
            placeholder="Nazwa gracza"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <Button onClick={handleAddPlayer}>
            <UserPlus className="w-4 h-4 mr-2" />
            Dodaj
          </Button>
        </div>

        {/* Show/Hide Eliminated Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowEliminated(!showEliminated)}
          className="w-full"
        >
          {showEliminated ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Ukryj wyeliminowanych
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Pokaż wyeliminowanych
            </>
          )}
        </Button>

        {/* Players List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {displayPlayers.map((player) => (
            <div
              key={player.id}
              className={`p-3 rounded-lg border ${
                player.isEliminated 
                  ? 'bg-red-900/20 border-red-500/30' 
                  : activePlayerId === player.id
                    ? 'bg-green-900/20 border-green-500/50'
                    : 'bg-black/20 border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">
                    {player.name}
                  </span>
                  {activePlayerId === player.id && (
                    <Badge className="bg-green-600">AKTYWNY</Badge>
                  )}
                  {player.isEliminated && (
                    <Badge variant="destructive">WYELIMINOWANY</Badge>
                  )}
                </div>
                
                <div className="flex gap-1">
                  {!player.isEliminated && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSetActivePlayer(player.id)}
                    >
                      Aktywuj
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemovePlayer(player.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Player Stats */}
              <div className="flex items-center gap-4 mb-2 text-sm">
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{player.points} pkt</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{player.health}% życia</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>❤️ {player.lives} życia</span>
                </div>
                {player.specialCards.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>{player.specialCards.length} kart</span>
                  </div>
                )}
              </div>

              {/* Player Actions */}
              {!player.isEliminated && (
                <div className="flex gap-1 flex-wrap">
                  <Button
                    size="sm"
                    onClick={() => handleAwardPoints(player.id, 5)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    +5 pkt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAwardPoints(player.id, 10)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    +10 pkt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeductHealth(player.id, 10)}
                    variant="destructive"
                  >
                    -10% życia
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDeductHealth(player.id, 20)}
                    variant="destructive"
                  >
                    -20% życia
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEliminatePlayer(player.id)}
                    variant="destructive"
                  >
                    Eliminuj
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {displayPlayers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            {showEliminated ? 'Brak graczy' : 'Brak aktywnych graczy'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayersManagementPanel;
