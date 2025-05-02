
import { Player, GameRound } from '@/types/game-types';
import { toast } from 'sonner';

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
    setPlayers((prev) => {
      // Find the player
      const player = prev.find(p => p.id === playerId);
      if (!player) return prev;
      
      // Check if this deduction would eliminate the player
      const newHealth = Math.max(0, player.health - amount);
      const wouldEliminate = newHealth === 0;
      
      // Update all players
      const updatedPlayers = prev.map((player) =>
        player.id === playerId
          ? { ...player, health: newHealth }
          : player
      );
      
      // If player would be eliminated, mark them
      if (wouldEliminate) {
        toast.error(`Gracz ${player.name} stracił całe zdrowie!`, {
          description: "W rundzie 1 zostaje wyeliminowany"
        });
      }
      
      return updatedPlayers;
    });
  };

  const deductLife = (playerId: string) => {
    setPlayers((prev) => {
      // Find the player
      const player = prev.find(p => p.id === playerId);
      if (!player) return prev;
      
      // Check if this deduction would eliminate the player
      const newLives = Math.max(0, player.lives - 1);
      const wouldEliminate = newLives === 0;
      
      // Update all players
      const updatedPlayers = prev.map((player) =>
        player.id === playerId
          ? { ...player, lives: newLives }
          : player
      );
      
      // If player would be eliminated, mark them
      if (wouldEliminate) {
        toast.error(`Gracz ${player.name} stracił ostatnie życie!`, {
          description: "Zostaje wyeliminowany z gry"
        });
      }
      
      return updatedPlayers;
    });
  };

  const eliminatePlayer = (playerId: string) => {
    setPlayers((prev) => {
      // Find the player
      const playerToEliminate = prev.find(p => p.id === playerId);
      
      if (playerToEliminate) {
        toast.error(`Gracz ${playerToEliminate.name} został wyeliminowany!`);
      }
      
      return prev.map((player) =>
        player.id === playerId
          ? { ...player, isEliminated: true }
          : player
      );
    });
  };

  // Round advancement
  const advanceToRoundTwo = () => {
    // Aktualizacja mechanizmu lucky loser zgodnie z nowymi zasadami:
    // 1. Top 5 graczy z życiem przechodzi dalej
    // 2. 1 gracz z najwyższą punktacją spośród tych, którzy stracili życie, też przechodzi (lucky loser)
    
    // Najpierw rozdzielamy graczy na tych z życiem i bez
    const playersWithHealth = players.filter(player => player.health > 0 && !player.isEliminated);
    const playersWithoutHealth = players.filter(player => (player.health === 0 || player.isEliminated) && !player.isEliminated);
    
    // Sortujemy graczy z życiem według punktów (od najwyższych)
    const sortedPlayersWithHealth = [...playersWithHealth].sort((a, b) => b.points - a.points);
    
    // Bierzemy top 5 graczy z życiem
    const topPlayers = sortedPlayersWithHealth.slice(0, 5);
    
    // Sortujemy graczy bez życia według punktów i bierzemy najlepszego jako lucky loser
    const sortedPlayersWithoutHealth = [...playersWithoutHealth].sort((a, b) => b.points - a.points);
    let luckyLoser: Player[] = [];
    
    if (sortedPlayersWithoutHealth.length > 0) {
      luckyLoser = [sortedPlayersWithoutHealth[0]];
      toast.success(`Lucky Loser: ${sortedPlayersWithoutHealth[0].name}`, {
        description: "Gracz z najwyższym wynikiem mimo braku zdrowia przechodzi dalej!"
      });
    }
    
    // Jeśli mamy mniej niż 5 graczy z życiem, dodajemy więcej lucky loserów
    if (topPlayers.length < 5 && sortedPlayersWithoutHealth.length > luckyLoser.length) {
      const additionalLuckyLosers = sortedPlayersWithoutHealth
        .slice(luckyLoser.length, 5 - topPlayers.length + luckyLoser.length);
      
      if (additionalLuckyLosers.length > 0) {
        toast.success(`Dodatkowi Lucky Loserzy: ${additionalLuckyLosers.map(p => p.name).join(', ')}`, {
          description: "Ze względu na małą liczbę graczy z życiem, dodajemy więcej graczy z rundy 1"
        });
        
        luckyLoser = [...luckyLoser, ...additionalLuckyLosers];
      }
    }
    
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
    
    toast.success("Rozpoczynamy Rundę 2: 5 Sekund!", {
      description: `${round2Players.length} graczy przechodzi do następnej rundy`
    });
    
    setRound(GameRound.ROUND_TWO);
  };

  const advanceToRoundThree = () => {
    // Pobieramy graczy z rundy 2, którzy mają życia
    const survivingPlayers = players
      .filter(player => !player.isEliminated && player.lives > 0);
    
    // Sortujemy według życia (więcej = lepiej), a przy równej liczbie życia według punktów
    const sortedSurvivors = [...survivingPlayers]
      .sort((a, b) => b.lives - a.lives || b.points - a.points);
    
    // Bierzemy top 3 graczy lub wszystkich, jeśli jest ich mniej niż 3
    const finalistsCount = Math.min(sortedSurvivors.length, 3);
    const finalists = sortedSurvivors.slice(0, finalistsCount);
    
    // Jeśli mamy mniej niż 3 graczy, sprawdzamy czy możemy kogoś "ożywić"
    if (finalists.length < 3) {
      const eliminatedByLives = players
        .filter(player => (player.lives === 0 || player.isEliminated) && !player.isEliminated)
        .sort((a, b) => b.points - a.points);
      
      const neededPlayers = 3 - finalists.length;
      const luckyPlayers = eliminatedByLives.slice(0, neededPlayers);
      
      if (luckyPlayers.length > 0) {
        toast.success(`Lucky finaliści: ${luckyPlayers.map(p => p.name).join(', ')}`, {
          description: "Ze względu na małą liczbę graczy, niektórzy wracają do gry!"
        });
        
        finalists.push(...luckyPlayers);
      }
    }
    
    // Przygotowanie graczy do rundy 3
    const round3Players = finalists.map(player => ({
      ...player,
      lives: 3, // Reset do 3 żyć dla rundy 3
      isEliminated: false
    }));
    
    // Oznaczamy wyeliminowanych graczy
    const advancingPlayerIds = round3Players.map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        advancingPlayerIds.includes(player.id)
          ? round3Players.find(p => p.id === player.id) || player
          : { ...player, isEliminated: true }
      )
    );
    
    toast.success("Rozpoczynamy Rundę 3: Koło Fortuny!", {
      description: `${round3Players.length} finalistów walczy o zwycięstwo`
    });
    
    setRound(GameRound.ROUND_THREE);
  };

  const finishGame = (winnerIds: string[]) => {
    const winners = players.filter(player => winnerIds.includes(player.id));
    const winnerNames = winners.map(w => w.name).join(', ');
    
    toast.success(`Koniec gry! Zwycięzca: ${winnerNames}`, {
      description: "Gratulacje dla zwycięzcy!"
    });
    
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
        toast.success(`Wszyscy stracili życie! Zwycięża gracz z największą liczbą punktów: ${sortedByPoints[0].name}`);
        finishGame([sortedByPoints[0].id]);
      } else {
        toast.error("Brak zwycięzcy - wszyscy gracze zostali wyeliminowani!");
        finishGame([]); // Brak zwycięzcy
      }
      return true;
    }
    return false;
  };

  const resetGame = () => {
    toast.info("Resetowanie gry", {
      description: "Wszystkie dane zostały zresetowane"
    });
    
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
