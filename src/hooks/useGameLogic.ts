
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
    // Aktualizacja mechanizmu lucky loser zgodnie z nowymi zasadami:
    // 1. Top 5 graczy z życiem przechodzi dalej
    // 2. 1 gracz z najwyższą punktacją spośród tych, którzy stracili życie, też przechodzi (lucky loser)
    
    // Najpierw rozdzielamy graczy na tych z życiem i bez
    const playersWithHealth = players.filter(player => player.health > 0 && !player.isEliminated);
    const playersWithoutHealth = players.filter(player => player.health === 0 && !player.isEliminated);
    
    // Sortujemy graczy z życiem według punktów (od najwyższych)
    const sortedPlayersWithHealth = [...playersWithHealth].sort((a, b) => b.points - a.points);
    
    // Bierzemy top 5 graczy z życiem
    const topPlayers = sortedPlayersWithHealth.slice(0, 5);
    
    // Sortujemy graczy bez życia według punktów i bierzemy najlepszego jako lucky loser
    const sortedPlayersWithoutHealth = [...playersWithoutHealth].sort((a, b) => b.points - a.points);
    const luckyLoser = sortedPlayersWithoutHealth.length > 0 ? [sortedPlayersWithoutHealth[0]] : [];
    
    // Łączymy top graczy i lucky losera dla rundy 2
    const round2Players = [...topPlayers, ...luckyLoser].map(player => ({
      ...player,
      lives: 3, // Reset do 3 żyć dla rundy 2
      health: 100, // Reset zdrowia
      isEliminated: false
    }));
    
    // Oznaczamy wyeliminowanych graczy
    const advancingPlayerIds = round2Players.map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        advancingPlayerIds.includes(player.id)
          ? round2Players.find(p => p.id === player.id) || player
          : { ...player, isEliminated: true }
      )
    );
    
    setRound(GameRound.ROUND_TWO);
  };

  const advanceToRoundThree = () => {
    // Pobieramy graczy z rundy 2, którzy mają życia
    const remainingPlayers = players
      .filter(player => !player.isEliminated && player.lives > 0)
      .sort((a, b) => b.lives - a.lives || b.points - a.points)
      .slice(0, 3)
      .map(player => ({
        ...player,
        isEliminated: false
      }));
    
    // Oznaczamy wyeliminowanych graczy
    const advancingPlayerIds = remainingPlayers.map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        advancingPlayerIds.includes(player.id)
          ? remainingPlayers.find(p => p.id === player.id) || player
          : { ...player, isEliminated: true }
      )
    );
    
    setRound(GameRound.ROUND_THREE);
  };

  const finishGame = (winnerIds: string[]) => {
    setWinnerIds(winnerIds);
    setRound(GameRound.FINISHED);
  };

  // W rundzie 3 kończenie gry gdy wszyscy stracą życie
  const checkRoundThreeEnd = () => {
    // Sprawdzamy czy w rundzie 3 są jeszcze gracze z życiem
    const activePlayers = players.filter(player => 
      !player.isEliminated && player.lives > 0
    );
    
    if (activePlayers.length === 0) {
      // Jeśli wszyscy stracili życie, zakończ grę
      // Znajdź gracza z największą liczbą punktów jako zwycięzcę
      const sortedByPoints = [...players]
        .filter(player => !player.isEliminated)
        .sort((a, b) => b.points - a.points);
      
      if (sortedByPoints.length > 0) {
        finishGame([sortedByPoints[0].id]);
      } else {
        finishGame([]); // Brak zwycięzcy
      }
      return true;
    }
    return false;
  };

  const resetGame = () => {
    setRound(GameRound.SETUP);
    setWinnerIds([]);
    
    // Resetuj wszystkie statusy graczy, ale zachowaj ich informacje
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
    checkRoundThreeEnd,
    resetGame
  };
};
