
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Player, GameState, Question, RoundSettings, AppSettings } from '@/types/interfaces';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { SoundEffect, GameBackup, LogEntry } from '@/types/game-types';

interface GameContextType {
  // Game State Management
  round: string;
  setRound: (round: string) => void;
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
  
  // Mock round settings
  const roundSettings: RoundSettings = {
    round1: {
      startingHealth: 100,
      pointValues: { easy: 5, medium: 10, hard: 15, expert: 20 },
      healthLoss: { easy: 10, medium: 10, hard: 20, expert: 20 },
      questionsPerCategory: 5
    },
    round2: {
      startingHealth: 100,
      pointValue: 10,
      healthLoss: 15,
      timeLimit: 5
    },
    round3: {
      startingHealth: 100,
      pointValue: 15,
      healthLoss: 20,
      timeLimit: 10,
      wheelCategories: []
    }
  };

  // Log management
  const addLog = (message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      message,
      level: 'info'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
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
    createBackup,
    restoreBackup,
    getBackups,
    deleteBackup,
    usePlayerCard,
    giveCardToPlayer,
    addSpecialCard,
    updateSpecialCard,
    removeSpecialCard,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
