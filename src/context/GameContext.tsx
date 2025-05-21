import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useAvailabilityContext } from './AvailabilityContext';
import { GameContextType, Question, GameBackup, GameSound, SoundEffect } from '@/types/game-types';
import { RoundSettings, defaultRoundSettings } from '@/types/round-settings';
import { toast } from 'sonner';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { PlayerAvailabilitySlot } from '@/types/availability-types';
import { supabase } from '@/lib/supabase';

// Export the context so it can be imported by other modules
export const GameContext = createContext<GameContextType | undefined>(undefined);

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

  // Game title state
  const [gameTitle, setGameTitle] = useState<string>('Discord Game Show');
  
  // Round settings
  const [roundSettings, setRoundSettings] = useState<RoundSettings>(defaultRoundSettings);
  
  // Logs for system events
  const [logs, setLogs] = useState<string[]>([]);
  
  // Add a log entry
  const addLog = (log: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString()} - ${log}`]);
  };
  
  // Clear all logs
  const clearLogs = () => {
    setLogs([]);
  };
  
  // Error reporting
  const reportError = (message: string, settings?: any) => {
    console.error(message);
    toast.error(message, settings);
    addLog(`Error: ${message}`);
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
  } = useSoundEffects();

  // Game backup methods
  const createBackup = async (name: string): Promise<any> => {
    // Implementation would go here
    return { success: true, id: crypto.randomUUID() };
  };
  
  const restoreBackup = async (backup: GameBackup): Promise<boolean> => {
    // Implementation would go here
    return true;
  };
  
  const getBackups = async () => {
    // Implementation would go here
    return { success: true, data: [] as GameBackup[] };
  };
  
  const deleteBackup = async (backupId: string) => {
    // Implementation would go here
    return { success: true };
  };

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
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    updatePlayer({
      ...player,
      specialCards: [...(player.specialCards || []), cardId]
    });
  };

  const usePlayerCard = (playerId: string, cardId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    updatePlayer({
      ...player,
      specialCards: (player.specialCards || []).filter(id => id !== cardId)
    });
  };

  // Update round settings
  const handleUpdateRoundSettings = (newSettings: Partial<RoundSettings>) => {
    setRoundSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    updateGameRoundSettings(newSettings);
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

  // Get availability context
  const { fetchAvailability, updateAvailability } = useAvailabilityContext();

  // Fixed version of fetchAvailability to ensure it returns the expected type
  const fetchPlayerAvailability = async (): Promise<PlayerAvailabilitySlot[]> => {
    try {
      const playerAvailabilityData = await fetchAvailability();
      return playerAvailabilityData;
    } catch (error) {
      console.error("Error fetching availability:", error);
      return [];
    }
  };

  // Create Promise-returning versions of functions
  const markQuestionAsUsedPromise = async (questionId: string) => {
    markQuestionAsUsed(questionId);
    return { success: true };
  };
  
  const resetUsedQuestionsPromise = async () => {
    resetUsedQuestions();
    return { success: true };
  };
  
  const loadGameDataPromise = async () => {
    const result = await loadGameData();
    return result;
  };
  
  const saveGameDataPromise = async () => {
    const result = await saveGameData();
    return result;
  };

  // Fix playSoundWithOptions to match the expected signature
  const playSoundWithOptionsWrapper = (sound: string, options: any) => {
    playSoundWithOptions(sound, options);
  };

  // Fix hasUndoHistory to return boolean
  const hasUndoHistoryFn = () => {
    return Boolean(hasUndoHistory);
  };

  // Context value with corrected types
  const contextValue: GameContextType = {
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
    gameTitle,
    
    // Logs
    logs,
    addLog,
    clearLogs,
    
    // Round settings
    roundSettings,
    updateRoundSettings: handleUpdateRoundSettings,
    
    // Sound settings
    playSound,
    stopSound,
    stopAllSounds,
    soundsEnabled,
    setSoundsEnabled,
    playSoundWithOptions: playSoundWithOptionsWrapper,
    volume,
    setVolume,
    soundStatus,
    availableSounds: availableSounds as GameSound[],
    addCustomSound: addCustomSound as (sound: GameSound) => void,
    
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
    setGameTitle,
    
    // Undo and manual point/health adjustment
    undoLastAction,
    hasUndoHistory: hasUndoHistoryFn,
    addManualPoints,
    adjustHealthManually,
    
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
    
    // Data persistence with Promise return types
    loadGameData: loadGameDataPromise,
    saveGameData: saveGameDataPromise,
    
    // Question methods with Promise return types
    addQuestion,
    removeQuestion,
    updateQuestion,
    markQuestionAsUsed: markQuestionAsUsedPromise,
    resetUsedQuestions: resetUsedQuestionsPromise,
    isQuestionUsed,
    
    // Game backup methods
    createBackup,
    restoreBackup,
    getBackups,
    deleteBackup,
    
    // Availability methods
    fetchAvailability: fetchPlayerAvailability,
    updateAvailability
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};
