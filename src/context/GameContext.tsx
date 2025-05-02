
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define player type
export interface Player {
  id: string;
  name: string;
  cameraUrl: string;
  points: number;
  health: number;
  lives: number;
  isActive: boolean;
  isEliminated: boolean;
  avatar?: string;
}

// Define question types
export interface Question {
  id: string;
  category: string;
  difficulty: number; // 5, 10, 15, 20
  question: string;
  answer: string;
  options?: string[];
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  questions: Question[];
}

// Define round types
export enum GameRound {
  SETUP = 'setup',
  ROUND_ONE = 'round_one',
  ROUND_TWO = 'round_two',
  ROUND_THREE = 'round_three',
  FINISHED = 'finished'
}

interface GameContextType {
  // Game state
  round: GameRound;
  players: Player[];
  categories: Category[];
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  timerSeconds: number;
  winnerIds: string[];
  
  // Game settings
  gameLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  hostCameraUrl: string;
  
  // Methods
  setRound: (round: GameRound) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPlayers: (players: Player[]) => void;
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  selectQuestion: (question: Question | null) => void;
  setActivePlayer: (playerId: string | null) => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  awardPoints: (playerId: string, points: number) => void;
  deductHealth: (playerId: string, amount: number) => void;
  deductLife: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  finishGame: (winnerIds: string[]) => void;
  resetGame: () => void;
  
  // Settings methods
  setGameLogo: (logoUrl: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
}

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

export const GameProvider = ({ children }: GameProviderProps) => {
  // Game state
  const [round, setRound] = useState<GameRound>(GameRound.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [winnerIds, setWinnerIds] = useState<string[]>([]);
  
  // Game settings
  const [gameLogo, setGameLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#ff00ff'); // Neon pink
  const [secondaryColor, setSecondaryColor] = useState('#00ffff'); // Neon blue
  const [hostCameraUrl, setHostCameraUrl] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      // Play timeout sound effect here
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  // Player methods
  const addPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player))
    );
  };

  const removePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  };

  // Category methods
  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
  };

  // Question methods
  const selectQuestion = (question: Question | null) => {
    setCurrentQuestion(question);
  };

  // Timer methods
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

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
    // Sort players by health and points
    const sortedPlayers = [...players].sort((a, b) => {
      if (a.health !== b.health) return b.health - a.health;
      return b.points - a.points;
    });
    
    // Top 5 players with health
    const topPlayers = sortedPlayers.filter(player => player.health > 0).slice(0, 5);
    
    // Lucky loser (player with 0 health but at least 15 points)
    const luckyLosers = sortedPlayers.filter(
      player => player.health === 0 && player.points >= 15 && !topPlayers.includes(player)
    ).sort((a, b) => b.points - a.points);
    
    const luckyLoser = luckyLosers.length > 0 ? [luckyLosers[0]] : [];
    
    // Set remaining players for round 2
    const round2Players = [...topPlayers, ...luckyLoser].map(player => ({
      ...player,
      lives: 3, // Reset to 3 lives for round 2
      isEliminated: false
    }));
    
    // Mark eliminated players
    const eliminatedIds = players
      .filter(player => !round2Players.some(p => p.id === player.id))
      .map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        eliminatedIds.includes(player.id)
          ? { ...player, isEliminated: true }
          : round2Players.find(p => p.id === player.id) || player
      )
    );
    
    setRound(GameRound.ROUND_TWO);
  };

  const advanceToRoundThree = () => {
    // Get players from round 2 who have lives left
    const remainingPlayers = players
      .filter(player => !player.isEliminated && player.lives > 0)
      .sort((a, b) => b.lives - a.lives || b.points - a.points)
      .slice(0, 3)
      .map(player => ({
        ...player,
        isEliminated: false
      }));
    
    // Mark eliminated players
    const eliminatedIds = players
      .filter(player => !remainingPlayers.some(p => p.id === player.id) || player.lives === 0)
      .map(player => player.id);
    
    setPlayers(prev => 
      prev.map(player => 
        eliminatedIds.includes(player.id)
          ? { ...player, isEliminated: true }
          : remainingPlayers.find(p => p.id === player.id) || player
      )
    );
    
    setRound(GameRound.ROUND_THREE);
  };

  const finishGame = (winnerIds: string[]) => {
    setWinnerIds(winnerIds);
    setRound(GameRound.FINISHED);
  };

  const resetGame = () => {
    setRound(GameRound.SETUP);
    setCurrentQuestion(null);
    setActivePlayerId(null);
    setTimerRunning(false);
    setTimerSeconds(5);
    setWinnerIds([]);
    
    // Reset all player statuses but keep their info
    setPlayers(prev => prev.map(player => ({
      ...player,
      points: 0,
      health: 100,
      lives: 3,
      isActive: false,
      isEliminated: false
    })));
  };

  // Define the setActivePlayer function that was missing
  const setActivePlayer = (playerId: string | null) => {
    setActivePlayerId(playerId);
  };

  const value = {
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
    resetGame,
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
