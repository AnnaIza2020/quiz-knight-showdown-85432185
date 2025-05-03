
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { GameContextType, GameRound, SpecialCard, SpecialCardAwardRule, SoundEffect } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useSpecialCards } from '@/hooks/useSpecialCards';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

// Re-export the types from the types file for convenience
export * from '@/types/game-types';

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const {
    // State
    round,
    setRound,
    players,
    setPlayers,
    categories,
    setCategories,
    currentQuestion,
    activePlayerId,
    timerRunning,
    setTimerRunning,
    timerSeconds,
    setTimerSeconds,
    winnerIds,
    setWinnerIds,
    gameLogo,
    setGameLogo,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    hostCameraUrl,
    setHostCameraUrl,
    specialCards,
    setSpecialCards,
    specialCardRules,
    setSpecialCardRules,
    
    // Methods
    addPlayer,
    updatePlayer,
    removePlayer,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
    loadGameData,
    saveGameData,
  } = useGameStateManagement();

  const {
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    resetGame
  } = useGameLogic(players, setPlayers, setRound, setWinnerIds);

  // Initialize sound effects with options properly
  const { 
    playSound,
    setEnabled: setSoundsEnabled,
    volume,
    setVolume,
    addCustomSound,
    availableSounds = {}
  } = useSoundEffects({ 
    enabled: true,
    useLocalStorage: true
  });
  
  // Special cards management
  const {
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard,
  } = useSpecialCards(players, setPlayers, specialCards, setSpecialCards, specialCardRules, setSpecialCardRules, playSound);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      // Play timeout sound effect
      playSound('timeout');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds, setTimerSeconds, setTimerRunning, playSound]);

  // Check end of round 3 when player is eliminated
  useEffect(() => {
    if (round === GameRound.ROUND_THREE) {
      checkRoundThreeEnd();
    }
  }, [players, round, checkRoundThreeEnd]);

  // Automatically save game data when important state changes
  useEffect(() => {
    saveGameData();
  }, [players, round, activePlayerId, winnerIds, specialCards, specialCardRules, saveGameData]);

  const value: GameContextType = {
    // State
    round,
    players,
    categories,
    currentQuestion,
    activePlayerId,
    timerRunning,
    timerSeconds,
    winnerIds,
    gameLogo,
    primaryColor,
    secondaryColor,
    hostCameraUrl,
    specialCards,
    specialCardRules,
    
    // Sound-related properties
    volume,
    setVolume,
    availableSounds,
    addCustomSound,
    playSound,
    setEnabled: setSoundsEnabled,
    
    // Methods
    setRound,
    addPlayer,
    updatePlayer,
    removePlayer,
    setPlayers,
    setCategories,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    resetGame,
    setWinnerIds,
    
    // Special cards methods
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    addSpecialCardRule,
    updateSpecialCardRule,
    removeSpecialCardRule,
    giveCardToPlayer,
    usePlayerCard,
    
    // Settings methods
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
    
    // Data persistence methods
    loadGameData,
    saveGameData
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
