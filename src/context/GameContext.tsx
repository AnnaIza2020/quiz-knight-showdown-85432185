
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { GameRound, Player, Category, Question, GameContextType } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useGameLogic, RoundSettings, DEFAULT_ROUND_SETTINGS } from '@/hooks/useGameLogic';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  // Game state from the state management hook
  const gameState = useGameStateManagement();
  const { 
    round, setRound, 
    players, setPlayers, 
    categories, setCategories, 
    currentQuestion, 
    activePlayerId, 
    timerRunning, setTimerRunning, 
    timerSeconds, setTimerSeconds,
    winnerIds, setWinnerIds,
    gameLogo, setGameLogo,
    primaryColor, setPrimaryColor,
    secondaryColor, setSecondaryColor,
    hostCameraUrl, setHostCameraUrl,
    specialCards, setSpecialCards,
    specialCardRules, setSpecialCardRules,
    addPlayer, updatePlayer, removePlayer,
    addCategory, removeCategory, 
    selectQuestion, setActivePlayer,
    loadGameData, saveGameData
  } = gameState;
  
  // Round settings
  const [roundSettings, setRoundSettings] = useState<RoundSettings>(DEFAULT_ROUND_SETTINGS);
  
  // Error reporting
  const reportError = (message: string, settings?: any) => {
    console.error(message);
    toast.error(message, settings);
  };

  // Game logic from the game logic hook
  const gameLogic = useGameLogic(players, setPlayers, setRound, setWinnerIds);
  const {
    awardPoints, deductHealth, deductLife, eliminatePlayer,
    advanceToRoundTwo, advanceToRoundThree, finishGame,
    checkRoundThreeEnd, resetGame, markQuestionAsUsed,
    resetUsedQuestions, isQuestionUsed, usedQuestionIds,
    undoLastAction, hasUndoHistory, addManualPoints, adjustHealthManually,
    updateRoundSettings: updateGameRoundSettings
  } = gameLogic;
  
  // Sound effects
  const { 
    playSound, 
    stopSound, 
    stopAllSounds, 
    soundsEnabled, 
    setSoundsEnabled, 
    playSoundWithOptions,
    setVolume,
    volume,
    soundStatus,
    availableSounds,
    addCustomSound
  } = useSoundEffects({
    enabled: true,
    useLocalStorage: true,
    defaultVolume: 0.7
  });

  // Timer functionality
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  // Countdown timer effect
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timerRunning && timerSeconds > 0) {
      timerId = setTimeout(() => {
        setTimerSeconds(prev => prev - 1);
        
        // Play timer sound for last 5 seconds
        if (timerSeconds <= 6 && timerSeconds > 1) {
          playSound('wheel-tick', 0.3);
        }
      }, 1000);
    } else if (timerRunning && timerSeconds === 0) {
      setTimerRunning(false);
      playSound('timeout');
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [timerRunning, timerSeconds, playSound]);

  // Special card methods
  const addSpecialCard = (card: any) => {
    setSpecialCards(prev => [...prev, { ...card, id: crypto.randomUUID() }]);
  };

  const updateSpecialCard = (cardId: string, updates: any) => {
    setSpecialCards(prev => 
      prev.map(card => card.id === cardId ? { ...card, ...updates } : card)
    );
  };

  const removeSpecialCard = (cardId: string) => {
    setSpecialCards(prev => prev.filter(card => card.id !== cardId));
  };

  const addSpecialCardRule = (rule: any) => {
    setSpecialCardRules(prev => [...prev, { ...rule, id: crypto.randomUUID() }]);
  };

  const updateSpecialCardRule = (ruleId: string, updates: any) => {
    setSpecialCardRules(prev => 
      prev.map(rule => rule.id === ruleId ? { ...rule, ...updates } : rule)
    );
  };

  const removeSpecialCardRule = (ruleId: string) => {
    setSpecialCardRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const giveCardToPlayer = (playerId: string, cardId: string) => {
    updatePlayer({
      id: playerId,
      specialCards: [...(players.find(p => p.id === playerId)?.specialCards || []), cardId]
    });
  };

  const usePlayerCard = (playerId: string, cardId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    updatePlayer({
      id: playerId,
      specialCards: player.specialCards.filter(id => id !== cardId)
    });
  };

  // Update round settings
  const handleUpdateRoundSettings = (newSettings: Partial<RoundSettings>) => {
    setRoundSettings(prev => {
      const updated = {
        ...prev,
        ...newSettings
      };
      updateGameRoundSettings(updated);
      return updated;
    });
  };
  
  // Question management
  const addQuestion = (categoryId: string, question: Question) => {
    // Find the category
    const category = categories.find(c => c.id === categoryId);
    if (!category) {
      reportError(`Kategoria o ID ${categoryId} nie istnieje`);
      return;
    }
    
    // Make sure question has all required fields
    if (!question.id) {
      question.id = crypto.randomUUID();
    }
    
    // Add question to category
    setCategories(prev => 
      prev.map(c => 
        c.id === categoryId 
          ? { ...c, questions: [...c.questions, question] } 
          : c
      )
    );
  };
  
  const removeQuestion = (categoryId: string, questionId: string) => {
    setCategories(prev => 
      prev.map(c => 
        c.id === categoryId 
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) } 
          : c
      )
    );
  };
  
  const updateQuestion = (categoryId: string, updatedQuestion: Question) => {
    setCategories(prev => 
      prev.map(c => 
        c.id === categoryId 
          ? { 
              ...c, 
              questions: c.questions.map(q => 
                q.id === updatedQuestion.id ? updatedQuestion : q
              ) 
            } 
          : c
      )
    );
  };

  // Context value
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
    roundSettings,
    
    // Sound settings
    playSound,
    stopSound,
    stopAllSounds,
    soundsEnabled,
    setSoundsEnabled,
    playSoundWithOptions,
    volume,
    setVolume,
    soundStatus,
    availableSounds,
    addCustomSound,
    
    // Error reporting
    reportError,
    
    // Methods
    setRound,
    setPlayers,
    setCategories,
    addPlayer,
    updatePlayer,
    removePlayer,
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
    
    // Special card methods
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
    
    // Data persistence
    loadGameData,
    saveGameData,
    
    // Question methods
    addQuestion,
    removeQuestion,
    updateQuestion,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    
    // Round settings
    updateRoundSettings: handleUpdateRoundSettings,
    
    // Undo functionality
    undoLastAction,
    hasUndoHistory,
    
    // Manual overrides
    addManualPoints,
    adjustHealthManually,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
