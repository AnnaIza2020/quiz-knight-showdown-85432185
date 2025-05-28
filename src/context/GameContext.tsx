
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameState, Question, RoundSettings, AppSettings } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { SoundEffect, GameBackup, LogEntry } from '@/types/game-types';

interface GameContextType {
  // Game State Management
  round: GameRound;
  setRound: (round: GameRound) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  setTimerRunning: (running: boolean) => void;
  timerSeconds: number;
  setTimerSeconds: (seconds: number) => void;
  winnerIds: string[];
  setWinnerIds: (ids: string[]) => void;
  specialCards: any[];
  setSpecialCards: (cards: any[]) => void;
  specialCardRules: any[];
  setSpecialCardRules: (rules: any[]) => void;
  usedQuestionIds: string[];
  gameTitle: string;
  setGameTitle: (title: string) => void;
  
  // Settings
  gameLogo: string | null;
  setGameLogo: (logo: string | null) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  hostCameraUrl: string;
  setHostCameraUrl: (url: string) => void;
  roundSettings: RoundSettings;
  updateRoundSettings: (settings: Partial<RoundSettings>) => void;
  
  // Sound Management
  playSound: (sound: SoundEffect, volume?: number) => void;
  stopSound: (sound: string) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  availableSounds: any[];
  addCustomSound: (sound: any) => void;
  
  // Logs and Debugging
  logs: LogEntry[];
  addLog: (log: string) => void;
  clearLogs: () => void;
  reportError: (message: string, details?: any) => void;
  
  // Backup Management
  createBackup: (name: string) => Promise<any>;
  restoreBackup: (backup: GameBackup) => Promise<boolean>;
  getBackups: () => Promise<{success: boolean, data: GameBackup[]}>;
  deleteBackup: (backupId: string) => Promise<{success: boolean}>;
  
  // Player Card Management
  usePlayerCard: (playerId: string, cardId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  
  // Game Logic Methods
  awardPoints: (playerId: string, points: number) => void;
  deductHealth: (playerId: string, percentage: number) => void;
  deductLife: (playerId: string, lives?: number) => void;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  finishGame: (winnerIds: string[]) => void;
  markQuestionAsUsed: (questionId: string) => Promise<any>;
  
  // Question Management
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, updatedQuestion: Question) => void;
  
  // Methods
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  addCategory: (category: any) => void;
  removeCategory: (categoryId: string) => void;
  selectQuestion: (question: Question | null) => void;
  setActivePlayer: (playerId: string | null) => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  loadGameData: () => void;
  saveGameData: () => void;
  
  // Special Cards Methods
  addSpecialCard: (card: any) => void;
  updateSpecialCard: (cardId: string, card: any) => void;
  removeSpecialCard: (cardId: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameContextProvider');
  }
  return context;
};

interface GameContextProviderProps {
  children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  const gameStateManagement = useGameStateManagement();
  const soundEffects = useSoundEffects();
  
  // Additional state for missing properties
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameTitle, setGameTitle] = useState('Discord Game Show');
  const [usedQuestionIds, setUsedQuestionIds] = useState<string[]>([]);
  
  // Extended round settings with all required properties
  const [roundSettings, setRoundSettings] = useState<RoundSettings>({
    round1: {
      startingHealth: 100,
      pointValues: { easy: 5, medium: 10, hard: 15, expert: 20 },
      healthLoss: { easy: 10, medium: 10, hard: 20, expert: 20 },
      questionsPerCategory: 5,
      maxQuestions: 10,
      pointsForCorrectAnswer: 10,
      pointsForIncorrectAnswer: -5,
      livesCount: 3,
      healthDeductionPercentage: 20,
      eliminateCount: 4,
      luckyLoserEnabled: true
    },
    round2: {
      startingHealth: 100,
      pointValue: 10,
      healthLoss: 15,
      timeLimit: 5,
      maxQuestions: 8,
      pointsForCorrectAnswer: 15,
      pointsForIncorrectAnswer: -10,
      livesCount: 3,
      livesDeductedOnIncorrectAnswer: 1
    },
    round3: {
      startingHealth: 100,
      pointValue: 15,
      healthLoss: 20,
      timeLimit: 10,
      wheelCategories: ['Kategoria 1', 'Kategoria 2', 'Kategoria 3'],
      maxSpins: 3,
      pointsForCorrectAnswer: 20,
      pointsForIncorrectAnswer: -15,
      livesCount: 3,
      livesDeductedOnIncorrectAnswer: 1,
      finalRoundEnabled: true
    },
    timerDurations: {
      round1: 30,
      round2: 15,
      round3: 45
    }
  });

  const updateRoundSettings = (settings: Partial<RoundSettings>) => {
    setRoundSettings(prev => {
      const updated = { ...prev };
      
      if (settings.round1) {
        updated.round1 = { ...prev.round1, ...settings.round1 };
      }
      if (settings.round2) {
        updated.round2 = { ...prev.round2, ...settings.round2 };
      }
      if (settings.round3) {
        updated.round3 = { ...prev.round3, ...settings.round3 };
      }
      if (settings.timerDurations) {
        updated.timerDurations = { ...prev.timerDurations, ...settings.timerDurations };
      }
      
      return updated;
    });
  };

  // Log management
  const addLog = (message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      level: 'info'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const reportError = (message: string, details?: any) => {
    const errorLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message: `ERROR: ${message}`,
      level: 'error'
    };
    setLogs(prev => [errorLog, ...prev.slice(0, 99)]);
    console.error(message, details);
  };

  // Mock backup management
  const createBackup = async (name: string): Promise<any> => {
    const backup = {
      id: Date.now().toString(),
      name,
      timestamp: Date.now(),
      data: {
        players: gameStateManagement.players,
        categories: gameStateManagement.categories,
        settings: {
          primaryColor: gameStateManagement.primaryColor,
          secondaryColor: gameStateManagement.secondaryColor
        }
      }
    };
    
    const existingBackups = JSON.parse(localStorage.getItem('gameBackups') || '[]');
    const updatedBackups = [backup, ...existingBackups];
    localStorage.setItem('gameBackups', JSON.stringify(updatedBackups));
    
    addLog(`Backup created: ${name}`);
    return { success: true, data: backup };
  };

  const restoreBackup = async (backup: GameBackup): Promise<boolean> => {
    try {
      if (backup.data.players) {
        gameStateManagement.setPlayers(backup.data.players);
      }
      if (backup.data.categories) {
        gameStateManagement.setCategories(backup.data.categories);
      }
      addLog(`Backup restored: ${backup.name}`);
      return true;
    } catch (error) {
      reportError('Failed to restore backup', error);
      return false;
    }
  };

  const getBackups = async (): Promise<{success: boolean, data: GameBackup[]}> => {
    try {
      const backups = JSON.parse(localStorage.getItem('gameBackups') || '[]');
      return { success: true, data: backups };
    } catch (error) {
      reportError('Failed to load backups', error);
      return { success: false, data: [] };
    }
  };

  const deleteBackup = async (backupId: string): Promise<{success: boolean}> => {
    try {
      const existingBackups = JSON.parse(localStorage.getItem('gameBackups') || '[]');
      const updatedBackups = existingBackups.filter((backup: any) => backup.id !== backupId);
      localStorage.setItem('gameBackups', JSON.stringify(updatedBackups));
      addLog(`Backup deleted: ${backupId}`);
      return { success: true };
    } catch (error) {
      reportError('Failed to delete backup', error);
      return { success: false };
    }
  };

  // Player card management
  const usePlayerCard = (playerId: string, cardId: string) => {
    gameStateManagement.setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, specialCards: player.specialCards.filter(c => c !== cardId) }
          : player
      )
    );
    addLog(`Player ${playerId} used card ${cardId}`);
  };

  const giveCardToPlayer = (playerId: string, cardId: string) => {
    gameStateManagement.setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, specialCards: [...player.specialCards, cardId] }
          : player
      )
    );
    addLog(`Card ${cardId} given to player ${playerId}`);
  };

  // Game logic methods
  const awardPoints = (playerId: string, points: number) => {
    gameStateManagement.setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, points: player.points + points }
          : player
      )
    );
    addLog(`Player ${playerId} awarded ${points} points`);
  };

  const deductHealth = (playerId: string, percentage: number) => {
    gameStateManagement.setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, health: Math.max(0, player.health - percentage) }
          : player
      )
    );
    addLog(`Player ${playerId} lost ${percentage}% health`);
  };

  const deductLife = (playerId: string, lives: number = 1) => {
    gameStateManagement.setPlayers(prev => 
      prev.map(player => 
        player.id === playerId 
          ? { ...player, lives: Math.max(0, player.lives - lives) }
          : player
      )
    );
    addLog(`Player ${playerId} lost ${lives} life(s)`);
  };

  const advanceToRoundTwo = () => {
    gameStateManagement.setRound(GameRound.ROUND_TWO);
    addLog('Advanced to Round 2');
  };

  const advanceToRoundThree = () => {
    gameStateManagement.setRound(GameRound.ROUND_THREE);
    addLog('Advanced to Round 3');
  };

  const finishGame = (winnerIds: string[]) => {
    gameStateManagement.setRound(GameRound.FINISHED);
    gameStateManagement.setWinnerIds(winnerIds);
    addLog('Game finished');
  };

  const markQuestionAsUsed = async (questionId: string): Promise<any> => {
    setUsedQuestionIds(prev => [...prev, questionId]);
    addLog(`Question ${questionId} marked as used`);
    return { success: true };
  };

  // Question Management
  const addQuestion = (categoryId: string, question: Question) => {
    gameStateManagement.setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, questions: [...(category.questions || []), question] }
          : category
      )
    );
    addLog(`Question added to category ${categoryId}`);
  };

  const removeQuestion = (categoryId: string, questionId: string) => {
    gameStateManagement.setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, questions: (category.questions || []).filter((q: any) => q.id !== questionId) }
          : category
      )
    );
    addLog(`Question ${questionId} removed from category ${categoryId}`);
  };

  const updateQuestion = (categoryId: string, updatedQuestion: Question) => {
    gameStateManagement.setCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { 
              ...category, 
              questions: (category.questions || []).map((q: any) => 
                q.id === updatedQuestion.id ? updatedQuestion : q
              )
            }
          : category
      )
    );
    addLog(`Question ${updatedQuestion.id} updated in category ${categoryId}`);
  };

  // Special Cards Methods
  const addSpecialCard = (card: any) => {
    gameStateManagement.setSpecialCards(prev => [...prev, card]);
    addLog(`Special card added: ${card.name}`);
  };

  const updateSpecialCard = (cardId: string, updatedCard: any) => {
    gameStateManagement.setSpecialCards(prev =>
      prev.map(card => card.id === cardId ? updatedCard : card)
    );
    addLog(`Special card updated: ${cardId}`);
  };

  const removeSpecialCard = (cardId: string) => {
    gameStateManagement.setSpecialCards(prev =>
      prev.filter(card => card.id !== cardId)
    );
    addLog(`Special card removed: ${cardId}`);
  };

  // Auto-save data when it changes
  useEffect(() => {
    gameStateManagement.saveGameData();
  }, [
    gameStateManagement.players,
    gameStateManagement.categories,
    gameStateManagement.specialCards,
    gameStateManagement.specialCardRules,
    gameStateManagement.primaryColor,
    gameStateManagement.secondaryColor,
    gameStateManagement.gameLogo,
    gameStateManagement.hostCameraUrl
  ]);

  // Load data on mount
  useEffect(() => {
    gameStateManagement.loadGameData();
  }, []);

  const value: GameContextType = {
    ...gameStateManagement,
    ...soundEffects,
    logs,
    addLog,
    clearLogs,
    reportError,
    gameTitle,
    setGameTitle,
    usedQuestionIds,
    roundSettings,
    updateRoundSettings,
    createBackup,
    restoreBackup,
    getBackups,
    deleteBackup,
    usePlayerCard,
    giveCardToPlayer,
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
    awardPoints,
    deductHealth,
    deductLife,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    markQuestionAsUsed,
    addQuestion,
    removeQuestion,
    updateQuestion,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
