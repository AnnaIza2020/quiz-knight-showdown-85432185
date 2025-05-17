
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { GameContextType, GameRound, SoundEffect, Question } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { QuestionsProvider } from './QuestionsContext';
import { SpecialCardsProvider } from './SpecialCardsContext';
import { toast } from 'sonner';

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
  const gameState = useGameStateManagement();
  
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
  } = gameState;

  const {
    awardPoints,
    deductHealth,
    deductLife,
    eliminatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    checkRoundThreeEnd,
    resetGame,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    usedQuestionIds
  } = useGameLogic(players, setPlayers, setRound, setWinnerIds);

  // Initialize sound effects with options properly
  const { 
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    enabled: soundsEnabled,
    setEnabled: setSoundsEnabled,
    volume,
    setVolume,
    soundsPreloaded,
    addCustomSound,
    availableSounds,
    soundStatus
  } = useSoundEffects({ 
    enabled: true,
    useLocalStorage: true
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const newValue = prev - 1;
          // When we reach 5 seconds, play a tick sound
          if (newValue <= 5 && newValue > 0) {
            playSound('wheel-tick', 0.3);
          }
          return newValue;
        });
      }, 1000);
    } else if (timerSeconds === 0 && timerRunning) {
      setTimerRunning(false);
      // Play timeout sound effect
      playSound('timeout');
      toast.info("Czas minął!");
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

  // Automatycznie ładujemy dane gry podczas uruchamiania
  useEffect(() => {
    try {
      loadGameData();
    } catch (error) {
      console.error("Error loading game data:", error);
      toast.error("Błąd podczas wczytywania danych gry");
    }
  }, [loadGameData]);

  // Automatically save game data when important state changes
  useEffect(() => {
    try {
      saveGameData();
    } catch (error) {
      console.error("Error saving game data:", error);
    }
  }, [
    players, 
    round, 
    activePlayerId, 
    winnerIds, 
    specialCards, 
    specialCardRules, 
    gameLogo,
    primaryColor,
    secondaryColor,
    saveGameData
  ]);

  // Create combined context value
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
    usedQuestionIds,
    
    // Sound-related properties
    volume,
    setVolume,
    availableSounds,
    addCustomSound,
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    soundsEnabled,
    setSoundsEnabled,
    soundStatus,
    
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
    
    // Settings methods
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
    
    // Data persistence methods
    loadGameData,
    saveGameData,
    
    // Questions methods - these will be overridden by QuestionsProvider
    addQuestion: () => {},
    removeQuestion: () => {},
    updateQuestion: () => {},
    markQuestionAsUsed, 
    resetUsedQuestions,
    isQuestionUsed,
    
    // Special cards methods - these will be overridden by SpecialCardsProvider
    addSpecialCard: () => {},
    updateSpecialCard: () => {},
    removeSpecialCard: () => {},
    addSpecialCardRule: () => {},
    updateSpecialCardRule: () => {},
    removeSpecialCardRule: () => {},
    giveCardToPlayer: () => {},
    usePlayerCard: () => {}
  };

  // Return nested providers to ensure all contexts have access to necessary data
  return (
    <GameContext.Provider value={value}>
      <QuestionsProvider
        gameState={gameState}
        usedQuestionIds={usedQuestionIds}
        markQuestionAsUsed={markQuestionAsUsed}
        resetUsedQuestions={resetUsedQuestions}
        isQuestionUsed={isQuestionUsed}
      >
        <SpecialCardsProvider
          players={players}
          setPlayers={setPlayers}
          specialCards={specialCards}
          setSpecialCards={setSpecialCards}
          specialCardRules={specialCardRules}
          setSpecialCardRules={setSpecialCardRules}
          playSound={playSound}
        >
          {children}
        </SpecialCardsProvider>
      </QuestionsProvider>
    </GameContext.Provider>
  );
};
