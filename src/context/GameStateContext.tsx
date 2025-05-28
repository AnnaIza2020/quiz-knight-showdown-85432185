import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, GameState, Question, RoundSettings, AppSettings } from '@/types/interfaces';
import { defaultQuestions, defaultCategories } from '@/data/defaultQuestions';

interface GameStateContextType {
  // Game State
  gameState: GameState;
  players: Player[];
  currentQuestion: Question | null;
  roundSettings: RoundSettings;
  appSettings: AppSettings;
  
  // Actions
  setGameState: (state: Partial<GameState>) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  removePlayer: (playerId: string) => void;
  setCurrentQuestion: (question: Question | null) => void;
  updateRoundSettings: (settings: Partial<RoundSettings>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  
  // Game Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  nextRound: () => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  resetGame: () => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

const defaultRoundSettings: RoundSettings = {
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
    pointValue: 15,
    healthLoss: 20,
    timeLimit: 5,
    maxQuestions: 8,
    pointsForCorrectAnswer: 15,
    pointsForIncorrectAnswer: -10,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1
  },
  round3: {
    startingHealth: 100,
    pointValue: 25,
    healthLoss: 25,
    timeLimit: 30,
    wheelCategories: [
      'Język polskiego internetu',
      'Polska scena Twitcha',
      'Zagadki',
      'Czy jesteś mądrzejszy od 8-klasisty',
      'Gry, które podbiły Polskę',
      'Technologie i internet w Polsce'
    ],
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
  },
  pointValues: { easy: 5, medium: 10, hard: 15, expert: 20 },
  lifePenalties: { easy: 10, medium: 10, hard: 20, expert: 20 },
  luckyLoserThreshold: 50
};

const defaultAppSettings: AppSettings = {
  primaryColor: '#00FFA3',
  secondaryColor: '#00E0FF',
  accentColor: '#FF3E9D',
  backgroundColor: '#0C0C13',
  fontFamily: 'Montserrat',
  soundsEnabled: true,
  volume: 0.7
};

const defaultGameState: GameState = {
  currentRound: 'lobby',
  currentPhase: 'waiting',
  currentQuestion: null,
  activePlayerId: null,
  timerRunning: false,
  timerSeconds: 30,
  gameStarted: false,
  gamePaused: false
};

interface GameStateProviderProps {
  children: ReactNode;
}

export const GameStateProvider: React.FC<GameStateProviderProps> = ({ children }) => {
  const [gameState, setGameStateInternal] = useState<GameState>(defaultGameState);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [roundSettings, setRoundSettings] = useState<RoundSettings>(defaultRoundSettings);
  const [appSettings, setAppSettings] = useState<AppSettings>(defaultAppSettings);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.timerRunning && gameState.timerSeconds > 0) {
      interval = setInterval(() => {
        setGameStateInternal(prev => ({
          ...prev,
          timerSeconds: Math.max(0, prev.timerSeconds - 1)
        }));
      }, 1000);
    } else if (gameState.timerSeconds === 0) {
      setGameStateInternal(prev => ({
        ...prev,
        timerRunning: false
      }));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.timerRunning, gameState.timerSeconds]);

  const setGameState = (state: Partial<GameState>) => {
    setGameStateInternal(prev => ({ ...prev, ...state }));
  };

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  const updatePlayer = (playerId: string, updates: Partial<Player>) => {
    setPlayers(prev => 
      prev.map(player => 
        player.id === playerId ? { ...player, ...updates } : player
      )
    );
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(player => player.id !== playerId));
  };

  const updateRoundSettings = (settings: Partial<RoundSettings>) => {
    setRoundSettings(prev => ({ ...prev, ...settings }));
  };

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...settings }));
  };

  const startGame = () => {
    setGameStateInternal(prev => ({
      ...prev,
      gameStarted: true,
      currentRound: 'round1',
      currentPhase: 'waiting'
    }));
  };

  const pauseGame = () => {
    setGameStateInternal(prev => ({ ...prev, gamePaused: true, timerRunning: false }));
  };

  const resumeGame = () => {
    setGameStateInternal(prev => ({ ...prev, gamePaused: false }));
  };

  const nextRound = () => {
    const roundOrder: GameState['currentRound'][] = ['lobby', 'round1', 'round2', 'round3', 'finished'];
    const currentIndex = roundOrder.indexOf(gameState.currentRound);
    const nextRound = roundOrder[Math.min(currentIndex + 1, roundOrder.length - 1)];
    
    setGameStateInternal(prev => ({
      ...prev,
      currentRound: nextRound,
      currentPhase: 'waiting'
    }));
  };

  const startTimer = (seconds: number) => {
    setGameStateInternal(prev => ({
      ...prev,
      timerSeconds: seconds,
      timerRunning: true
    }));
  };

  const stopTimer = () => {
    setGameStateInternal(prev => ({ ...prev, timerRunning: false }));
  };

  const resetGame = () => {
    setGameStateInternal(defaultGameState);
    setPlayers([]);
    setCurrentQuestion(null);
  };

  const value: GameStateContextType = {
    gameState,
    players,
    currentQuestion,
    roundSettings,
    appSettings,
    setGameState: setGameStateInternal,
    setPlayers,
    addPlayer: (player: Player) => setPlayers(prev => [...prev, player]),
    updatePlayer: (playerId: string, updates: Partial<Player>) => {
      setPlayers(prev => 
        prev.map(player => 
          player.id === playerId ? { ...player, ...updates } : player
        )
      );
    },
    removePlayer: (playerId: string) => setPlayers(prev => prev.filter(player => player.id !== playerId)),
    setCurrentQuestion,
    updateRoundSettings: (settings: Partial<RoundSettings>) => {
      setRoundSettings(prev => ({ ...prev, ...settings }));
    },
    updateAppSettings: (settings: Partial<AppSettings>) => {
      setAppSettings(prev => ({ ...prev, ...settings }));
    },
    startGame: () => {
      setGameStateInternal(prev => ({
        ...prev,
        gameStarted: true,
        currentRound: 'round1',
        currentPhase: 'waiting'
      }));
    },
    pauseGame: () => setGameStateInternal(prev => ({ ...prev, gamePaused: true, timerRunning: false })),
    resumeGame: () => setGameStateInternal(prev => ({ ...prev, gamePaused: false })),
    nextRound: () => {
      const roundOrder: GameState['currentRound'][] = ['lobby', 'round1', 'round2', 'round3', 'finished'];
      const currentIndex = roundOrder.indexOf(gameState.currentRound);
      const nextRound = roundOrder[Math.min(currentIndex + 1, roundOrder.length - 1)];
      
      setGameStateInternal(prev => ({
        ...prev,
        currentRound: nextRound,
        currentPhase: 'waiting'
      }));
    },
    startTimer: (seconds: number) => {
      setGameStateInternal(prev => ({
        ...prev,
        timerSeconds: seconds,
        timerRunning: true
      }));
    },
    stopTimer: () => setGameStateInternal(prev => ({ ...prev, timerRunning: false })),
    resetGame: () => {
      setGameStateInternal(defaultGameState);
      setPlayers([]);
      setCurrentQuestion(null);
    }
  };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};
