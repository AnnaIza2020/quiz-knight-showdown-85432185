import { useState, useCallback } from 'react';
import { Player, GameRound, Question } from '@/types/game-types';
import { toast } from 'sonner';

export interface RoundSettings {
  pointValues: {
    round1: { easy: number; medium: number; hard: number; expert: number };
    round2: number;
    round3: number;
  };
  lifePenalties: {
    round1: number;
    round2: number;
    round3: number;
  };
  timerDurations: {
    round1: number;
    round2: number;
    round3: number;
  };
  luckyLoserThreshold: number;
}

// Default settings
export const DEFAULT_ROUND_SETTINGS: RoundSettings = {
  pointValues: {
    round1: { easy: 5, medium: 10, hard: 15, expert: 20 },
    round2: 15,
    round3: 25,
  },
  lifePenalties: {
    round1: 20,
    round2: 20,
    round3: 25,
  },
  timerDurations: {
    round1: 30,
    round2: 5,
    round3: 30,
  },
  luckyLoserThreshold: 25,
};

export const useGameLogic = (
  players: Player[],
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  setRound: React.Dispatch<React.SetStateAction<GameRound>>,
  setWinnerIds: React.Dispatch<React.SetStateAction<string[]>>
) => {
  // Settings for round configuration
  const [roundSettings, setRoundSettings] = useState<RoundSettings>(DEFAULT_ROUND_SETTINGS);

  // Śledź wykorzystane pytania
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());

  // History for undo functionality
  const [actionHistory, setActionHistory] = useState<Array<{
    type: 'award' | 'deduct' | 'eliminate';
    playerId: string;
    previousState: Partial<Player>;
  }>>([]);
  
  // Funkcja do oznaczania pytania jako wykorzystanego
  const markQuestionAsUsed = useCallback((questionId: string) => {
    if (!questionId) return;
    
    setUsedQuestionIds(prev => {
      const newSet = new Set(prev);
      newSet.add(questionId);
      return newSet;
    });
  }, []);
  
  // Funkcja resetująca wykorzystane pytania (np. przy rozpoczęciu nowej gry)
  const resetUsedQuestions = useCallback(() => {
    setUsedQuestionIds(new Set());
  }, []);
  
  // Funkcja sprawdzająca czy pytanie było już wykorzystane
  const isQuestionUsed = useCallback((questionId: string) => {
    if (!questionId) return false;
    return usedQuestionIds.has(questionId);
  }, [usedQuestionIds]);

  // Update round settings
  const updateRoundSettings = useCallback((newSettings: Partial<RoundSettings>) => {
    setRoundSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  // Helper to save player state for undo
  const savePlayerStateToHistory = useCallback((type: 'award' | 'deduct' | 'eliminate', playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Save relevant parts of player state
    const previousState: Partial<Player> = {
      points: player.points,
      health: player.health,
      lives: player.lives,
      isEliminated: player.isEliminated,
    };
    
    setActionHistory(prev => [
      { type, playerId, previousState },
      ...prev.slice(0, 19) // Keep last 20 actions
    ]);
  }, [players]);

  // Game logic methods
  const awardPoints = useCallback((playerId: string, points: number) => {
    if (!playerId) return;
    
    // Save current state for undo
    savePlayerStateToHistory('award', playerId);
    
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, points: player.points + points }
          : player
      )
    );
    
    // Show toast feedback
    const player = players.find(p => p.id === playerId);
    if (player) {
      toast.success(`${player.name} zdobywa ${points} punktów!`);
    }
  }, [players, setPlayers, savePlayerStateToHistory]);

  const deductHealth = useCallback((playerId: string, amount: number) => {
    if (!playerId) return;

    // Save current state for undo
    savePlayerStateToHistory('deduct', playerId);
    
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
  }, [setPlayers, savePlayerStateToHistory]);

  const deductLife = useCallback((playerId: string) => {
    if (!playerId) return;
    
    // Save current state for undo
    savePlayerStateToHistory('deduct', playerId);
    
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
  }, [setPlayers, savePlayerStateToHistory]);

  const eliminatePlayer = useCallback((playerId: string) => {
    if (!playerId) return;
    
    // Save current state for undo
    savePlayerStateToHistory('eliminate', playerId);
    
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
  }, [setPlayers, savePlayerStateToHistory]);

  // Implements undo functionality
  const undoLastAction = useCallback(() => {
    const lastAction = actionHistory[0];
    if (!lastAction) {
      toast.info("Brak akcji do cofnięcia");
      return;
    }
    
    setPlayers((prev) => 
      prev.map((player) =>
        player.id === lastAction.playerId
          ? { ...player, ...lastAction.previousState }
          : player
      )
    );
    
    setActionHistory(prev => prev.slice(1));
    
    toast.success("Ostatnia akcja została cofnięta", {
      description: `Przywrócono poprzedni stan dla gracza ${players.find(p => p.id === lastAction.playerId)?.name || 'nieznanego'}`
    });
  }, [actionHistory, setPlayers, players]);

  // Manual point management
  const addManualPoints = useCallback((playerId: string, points: number) => {
    if (!playerId) return;
    
    savePlayerStateToHistory('award', playerId);
    
    setPlayers((prev) =>
      prev.map((player) =>
        player.id === playerId
          ? { ...player, points: Math.max(0, player.points + points) }
          : player
      )
    );
    
    const player = players.find(p => p.id === playerId);
    if (player) {
      if (points > 0) {
        toast.success(`Ręcznie dodano ${points} punktów dla ${player.name}`);
      } else {
        toast.info(`Ręcznie odjęto ${Math.abs(points)} punktów od ${player.name}`);
      }
    }
  }, [players, setPlayers, savePlayerStateToHistory]);

  // Manual health management
  const adjustHealthManually = useCallback((playerId: string, healthPercent: number) => {
    if (!playerId) return;
    
    savePlayerStateToHistory('deduct', playerId);
    
    setPlayers((prev) => {
      const player = prev.find(p => p.id === playerId);
      if (!player) return prev;
      
      const newHealth = Math.max(0, Math.min(100, player.health + healthPercent));
      
      return prev.map((p) =>
        p.id === playerId
          ? { ...p, health: newHealth }
          : p
      );
    });
    
    const player = players.find(p => p.id === playerId);
    if (player) {
      if (healthPercent > 0) {
        toast.success(`Ręcznie dodano ${healthPercent}% zdrowia dla ${player.name}`);
      } else {
        toast.info(`Ręcznie odjęto ${Math.abs(healthPercent)}% zdrowia od ${player.name}`);
      }
    }
  }, [players, setPlayers, savePlayerStateToHistory]);

  // Round advancement
  const advanceToRoundTwo = useCallback(() => {
    try {
      // Setup for Lucky Loser mechanics:
      // 1. Top 5 players with life advance directly
      // 2. 1 player with highest points among those who lost all health (above threshold) advances as lucky loser
      
      // Separate players with health and without
      const playersWithHealth = players.filter(player => player.health > 0 && !player.isEliminated);
      const playersWithoutHealth = players.filter(player => (player.health === 0 || player.isEliminated) && !player.forcedEliminated);
      
      // Get the threshold for Lucky Loser eligibility
      const minPointsForLuckyLoser = roundSettings.luckyLoserThreshold;
      
      // Sort players with health by points (highest first)
      const sortedPlayersWithHealth = [...playersWithHealth].sort((a, b) => b.points - a.points);
      
      // Take top 5 players with health
      const topPlayers = sortedPlayersWithHealth.slice(0, 5);
      
      // Find potential lucky losers (players with points above threshold)
      const potentialLuckyLosers = [...playersWithoutHealth]
        .sort((a, b) => b.points - a.points)
        .filter(p => p.points >= minPointsForLuckyLoser);
      
      let luckyLoser: Player[] = [];
      
      if (potentialLuckyLosers.length > 0) {
        luckyLoser = [potentialLuckyLosers[0]];
        toast.success(`Lucky Loser: ${potentialLuckyLosers[0].name}`, {
          description: "Gracz z najwyższym wynikiem mimo braku zdrowia przechodzi dalej!"
        });
      }
      
      // If we have fewer than 5 players with health, add more lucky losers
      if (topPlayers.length < 5 && potentialLuckyLosers.length > luckyLoser.length) {
        const additionalLuckyLosers = potentialLuckyLosers
          .slice(luckyLoser.length, 5 - topPlayers.length + luckyLoser.length);
        
        if (additionalLuckyLosers.length > 0) {
          toast.success(`Dodatkowi Lucky Loserzy: ${additionalLuckyLosers.map(p => p.name).join(', ')}`, {
            description: "Ze względu na małą liczbę graczy z życiem, dodajemy więcej graczy z rundy 1"
          });
          
          luckyLoser = [...luckyLoser, ...additionalLuckyLosers];
        }
      }
      
      // Combine top players and lucky losers for Round 2
      const round2Players = [...topPlayers, ...luckyLoser].map(player => ({
        ...player,
        lives: 3, // Reset lives for Round 2
        health: 100, // Reset health
        isEliminated: false,
        // Points are preserved
      }));
      
      // Mark advancing players
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
      
      // Reset used questions for the new round
      resetUsedQuestions();
      
      // Set round
      setRound(GameRound.ROUND_TWO);
    } catch (error) {
      console.error("Błąd podczas przejścia do rundy 2:", error);
      toast.error("Wystąpił błąd podczas zmiany rundy");
    }
  }, [players, resetUsedQuestions, setPlayers, setRound, roundSettings.luckyLoserThreshold]);

  const advanceToRoundThree = useCallback(() => {
    try {
      // Get players from Round 2 who still have lives
      const survivingPlayers = players
        .filter(player => !player.isEliminated && player.lives > 0);
      
      // Sort by lives (more is better), then by points if tied
      const sortedSurvivors = [...survivingPlayers]
        .sort((a, b) => b.lives - a.lives || b.points - a.points);
      
      // Take top 3 players or all if fewer than 3
      const finalistsCount = Math.min(sortedSurvivors.length, 3);
      const finalists = sortedSurvivors.slice(0, finalistsCount);
      
      // If we have fewer than 3 players, look for eliminated players to bring back
      if (finalists.length < 3) {
        const eliminatedByLives = players
          .filter(player => (player.lives === 0 || player.isEliminated) && !player.forcedEliminated)
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
      
      // Prepare players for Round 3
      const round3Players = finalists.map(player => ({
        ...player,
        lives: 3, // Reset to 3 lives for Round 3
        health: 100, // Reset health
        isEliminated: false,
        // Points are preserved
      }));
      
      // Mark advancing players
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
      
      // Reset used questions for the new round
      resetUsedQuestions();
      
      // Set round
      setRound(GameRound.ROUND_THREE);
    } catch (error) {
      console.error("Błąd podczas przejścia do rundy 3:", error);
      toast.error("Wystąpił błąd podczas zmiany rundy");
    }
  }, [players, resetUsedQuestions, setPlayers, setRound]);

  const finishGame = useCallback((winnerIds: string[]) => {
    try {
      if (!winnerIds || winnerIds.length === 0) {
        toast.error("Nie określono zwycięzcy!");
        return;
      }
      
      const winners = players.filter(player => winnerIds.includes(player.id));
      
      if (winners.length === 0) {
        toast.error("Nie znaleziono graczy o podanych ID zwycięzców!");
        return;
      }
      
      const winnerNames = winners.map(w => w.name).join(', ');
      
      toast.success(`Koniec gry! Zwycięzca: ${winnerNames}`, {
        description: "Gratulacje dla zwycięzcy!"
      });
      
      setWinnerIds(winnerIds);
      setRound(GameRound.FINISHED);
    } catch (error) {
      console.error("Błąd podczas kończenia gry:", error);
      toast.error("Wystąpił błąd podczas kończenia gry");
    }
  }, [players, setRound, setWinnerIds]);

  // Check if Round 3 has ended (all players lost lives)
  const checkRoundThreeEnd = useCallback(() => {
    try {
      // Check if any players still have lives in Round 3
      const activePlayers = players.filter(player => 
        !player.isEliminated && player.lives > 0
      );
      
      if (activePlayers.length === 0) {
        // If all players have lost lives, end the game
        // Find the player with the most points as winner
        const sortedByPoints = [...players]
          .filter(player => !player.forcedEliminated)
          .sort((a, b) => b.points - a.points);
        
        if (sortedByPoints.length > 0) {
          toast.success(`Wszyscy stracili życie! Zwycięża gracz z największą liczbą punktów: ${sortedByPoints[0].name}`);
          finishGame([sortedByPoints[0].id]);
        } else {
          toast.error("Brak zwycięzcy - wszyscy gracze zostali wyeliminowani!");
          finishGame([]); // No winner
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Błąd podczas sprawdzania końca rundy 3:", error);
      toast.error("Wystąpił błąd podczas sprawdzania statusu gry");
      return false;
    }
  }, [finishGame, players]);

  const resetGame = useCallback(() => {
    try {
      toast.info("Resetowanie gry", {
        description: "Wszystkie dane zostały zresetowane"
      });
      
      // Reset used questions
      resetUsedQuestions();
      
      setRound(GameRound.SETUP);
      setWinnerIds([]);
      setActionHistory([]);
      
      // Reset all player statuses but keep their basic information
      setPlayers(prev => prev.map(player => ({
        ...player,
        points: 0,
        health: 100,
        lives: 3,
        isActive: false,
        isEliminated: false
      })));
    } catch (error) {
      console.error("Błąd podczas resetowania gry:", error);
      toast.error("Wystąpił błąd podczas resetowania gry");
    }
  }, [resetUsedQuestions, setPlayers, setRound, setWinnerIds]);

  return {
    // Settings
    roundSettings,
    updateRoundSettings,
    
    // Round logic
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    resetGame,
    
    // Manual overrides
    addManualPoints,
    adjustHealthManually,
    
    // Undo functionality
    undoLastAction,
    hasUndoHistory: actionHistory.length > 0,
    
    // Question management
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    usedQuestionIds: Array.from(usedQuestionIds)
  };
};
