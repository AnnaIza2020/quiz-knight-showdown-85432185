import { Player, GameRound } from '@/types/game-types';

export const useGameLogic = (
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setRound: React.Dispatch<React.SetStateAction<GameRound>>,
  setWinnerIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  // Game logic methods
  const awardPoints = (playerId: string, points: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, points: player.points + points }
          : player
      )
    );
  };

  const deductHealth = (playerId: string, amount: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, health: Math.max(0, player.health - amount) }
          : player
      )
    );
  };

  const deductLife = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, lives: Math.max(0, player.lives - 1) }
          : player
      )
    );
  };

  const eliminatePlayer = (playerId: string) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, isEliminated: true }
          : player
      )
    );
  };

  // Round advancement
  const advanceToRoundTwo = () => {
    // Sort players by health and points
    const sortedPlayers = [...players].sort((a, b) => {
      if (a.health !== b.health) return b.health - a.health;
      return b.points - a.points;
    });
    
    // Top 5 players with health
    const topPlayers = sortedPlayers.filter(player => player.health > 0).slice(0, 5);
    
    // Lucky loser (player with 0 health but at least 15 points)
    const luckyLosers = sortedPlayers.filter(
      player => player.health === 0 && player.points >= 15 && !topPlayers.includes(player)
    ).sort((a, b) => b.points - a.points);
    
    const luckyLoser = luckyLosers.length > 0 ? [luckyLosers[0]] : [];
    
    // Set remaining players for round 2
    const round2Players = [...topPlayers, ...luckyLoser].map(player => ({
      ...player,
      lives: 3, // Reset to 3 lives for round 2
      isEliminated: false
    }));
    
    // Mark eliminated players
    const eliminatedIds = players
      .filter(player => !round2Players.some(p => p.id === player.id))
      .map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        eliminatedIds.includes(player.id)
          ? { ...player, isEliminated: true }
          : round2Players.find(p => p.id === player.id) || player
      )
    );
    
    setRound(GameRound.ROUND_TWO);
  };

  const advanceToRoundThree = () => {
    // Get players from round 2 who have lives left
    const remainingPlayers = players
      .filter(player => !player.isEliminated && player.lives > 0)
      .sort((a, b) => b.lives - a.lives || b.points - a.points)
      .slice(0, 3)
      .map(player => ({
        ...player,
        isEliminated: false
      }));
    
    // Mark eliminated players
    const eliminatedIds = players
      .filter(player => !remainingPlayers.some(p => p.id === player.id) || player.lives === 0)
      .map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        eliminatedIds.includes(player.id)
          ? { ...player, isEliminated: true }
          : remainingPlayers.find(p => p.id === player.id) || player
      )
    );
    
    setRound(GameRound.ROUND_THREE);
  };

  const finishGame = (winnerIds: string[]) => {
    setWinnerIds(winnerIds);
    setRound(GameRound.FINISHED);
  };

  const resetGame = () => {
    setRound(GameRound.SETUP);
    setWinnerIds([]);
    
    // Reset all player statuses but keep their info
    setPlayers(prev => prev.map(player => ({
      ...player,
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false
    })));
  };

  return {
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    resetGame
  };
};
