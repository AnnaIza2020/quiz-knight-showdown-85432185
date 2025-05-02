
import { SoundEffect } from '@/hooks/useSoundEffects';

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

export interface GameContextType {
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
  setWinnerIds: (winnerIds: string[]) => void;
  
  // Settings methods
  setGameLogo: (logoUrl: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
  
  // Sound effects
  playSound: (sound: SoundEffect, volume?: number) => void;
  
  // Data persistence methods
  loadGameData: () => void;
  saveGameData: () => void;
}
