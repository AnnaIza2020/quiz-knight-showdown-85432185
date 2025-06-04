
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { Player } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Trophy, Zap, UserCheck, UserX, Crown } from 'lucide-react';
import { toast } from 'sonner';

const PlayersManagementPanel: React.FC = () => {
  const {
    players,
    activePlayerId,
    setActivePlayer,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    updatePlayer,
    playSound
  } = useGameContext();

  const handleSelectPlayer = (playerId: string) => {
    setActivePlayer(playerId);
    toast.info(`Gracz ${players.find(p => p.id === playerId)?.name} został wybrany`);
  };

  const handleAwardPoints = (playerId: string, points: number) => {
    awardPoints(playerId, points);
    const playerName = players.find(p => p.id === playerId)?.name;
    toast.success(`+${points} punktów dla ${playerName}`);
    playSound('success');
  };

  const handleDeductHealth = (playerId: string, percentage: number) => {
    deductHealth(playerId, percentage);
    const playerName = players.find(p => p.id === playerId)?.name;
    toast.info(`-${percentage}% życia dla ${playerName}`);
    playSound('fail');
  };

  const handleDeductLife = (playerId: string) => {
    deductLife(playerId, 1);
    const playerName = players.find(p => p.id === playerId)?.name;
    toast.warning(`-1 życie dla ${playerName}`);
    playSound('fail');
  };

  const handleEliminatePlayer = (playerId: string) => {
    eliminatePlayer(playerId);
    const playerName = players.find(p => p.id === playerId)?.name;
    toast.error(`${playerName} został wyeliminowany`);
    playSound('eliminate');
  };

  const handleRevivePlayer = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (player) {
      const revivedPlayer: Player = {
        ...player,
        isEliminated: false,
        health: 100,
        lives: 3
      };
      updatePlayer(revivedPlayer);
      toast.success(`${player.name} został przywrócony`);
      playSound('bonus');
    }
  };

  const getPlayerStatusColor = (player: Player) => {
    if (player.isEliminated) return 'text-red-500';
    if (player.health < 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getPlayerStatusBadge = (player: Player) => {
    if (player.isEliminated) return <Badge variant="destructive">Eliminowany</Badge>;
    if (player.id === activePlayerId) return <Badge className="bg-neon-blue">Aktywny</Badge>;
    if (player.health < 30) return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Krytyczny</Badge>;
    return <Badge variant="outline" className="text-green-500 border-green-500">Aktywny</Badge>;
  };

  const sortedPlayers = [...players].sort((a, b) => {
    // Active player first
    if (a.id === activePlayerId) return -1;
    if (b.id === activePlayerId) return 1;
    // Then by elimination status
    if (a.isEliminated !== b.isEliminated) return a.isEliminated ? 1 : -1;
    // Then by points
    return b.points - a.points;
  });

  return (
    <div className="space-y-6">
      {/* Players Overview */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>Zarządzanie Graczami</span>
            <Badge variant="outline" className="text-neon-green border-neon-green">
              {players.filter(p => !p.isEliminated).length}/{players.length} aktywnych
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {sortedPlayers.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg border transition-all ${
                  player.id === activePlayerId
                    ? 'border-neon-blue bg-neon-blue/10'
                    : 'border-white/10 bg-black/20'
                } ${player.isEliminated ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center">
                      <span className="text-white font-bold">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-semibold">
                        {player.nickname || player.name}
                      </div>
                      <div className="text-gray-400 text-sm">ID: {player.id.slice(0, 8)}</div>
                    </div>
                  </div>
                  {getPlayerStatusBadge(player)}
                </div>

                {/* Player Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Trophy className="w-4 h-4 text-neon-gold" />
                      <span className="text-white font-bold">{player.points}</span>
                    </div>
                    <div className="text-xs text-gray-400">Punkty</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-white font-bold">{player.lives}</span>
                    </div>
                    <div className="text-xs text-gray-400">Życia</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Zap className="w-4 h-4 text-neon-purple" />
                      <span className="text-white font-bold">{player.specialCards?.length || 0}</span>
                    </div>
                    <div className="text-xs text-gray-400">Karty</div>
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Życie</span>
                    <span>{player.health}%</span>
                  </div>
                  <Progress value={player.health} className="h-2" />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleSelectPlayer(player.id)}
                      variant={player.id === activePlayerId ? "default" : "outline"}
                      className={`w-full ${
                        player.id === activePlayerId 
                          ? "bg-neon-blue hover:bg-neon-blue/80" 
                          : "border-gray-600 text-white"
                      }`}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      {player.id === activePlayerId ? 'Aktywny' : 'Wybierz'}
                    </Button>
                    
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => handleAwardPoints(player.id, 10)}
                        className="bg-green-600 hover:bg-green-700 text-xs px-2"
                        disabled={player.isEliminated}
                      >
                        +10
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAwardPoints(player.id, 25)}
                        className="bg-green-600 hover:bg-green-700 text-xs px-2"
                        disabled={player.isEliminated}
                      >
                        +25
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {player.isEliminated ? (
                      <Button
                        size="sm"
                        onClick={() => handleRevivePlayer(player.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        Przywróć
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleEliminatePlayer(player.id)}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        <UserX className="w-3 h-3 mr-1" />
                        Eliminuj
                      </Button>
                    )}
                    
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        onClick={() => handleDeductHealth(player.id, 10)}
                        className="bg-orange-600 hover:bg-orange-700 text-xs px-2"
                        disabled={player.isEliminated}
                      >
                        -10%
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDeductLife(player.id)}
                        className="bg-red-600 hover:bg-red-700 text-xs px-2"
                        disabled={player.isEliminated}
                      >
                        -1❤️
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayersManagementPanel;
