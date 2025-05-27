
export interface Player {
  id: string;
  nickname: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  isActive: boolean;
  color: string;
  avatar?: string;
  cameraUrl?: string;
  specialCards: string[];
  status: 'online' | 'offline' | 'active';
  uniqueLinkToken?: string;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  categoryId: string;
  difficulty: number;
  type: 'open' | 'multiple_choice' | 'true_false';
  options?: string[];
  correctAnswer: string;
  timeLimit: number;
  points: number;
  used?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  round: number;
  color?: string;
  icon?: string;
}

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  type: 'defense' | 'attack' | 'bonus' | 'manipulation';
  jsHook?: string;
  soundEffect?: string;
  animation?: string;
  defaultQuantity: number;
}

export interface GameState {
  currentRound: 'lobby' | 'round1' | 'round2' | 'round3' | 'finished';
  currentPhase: 'waiting' | 'question' | 'answering' | 'results';
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  timerSeconds: number;
  gameStarted: boolean;
  gamePaused: boolean;
}

export interface RoundSettings {
  round1: {
    startingHealth: number;
    pointValues: { easy: 5; medium: 10; hard: 15; expert: 20 };
    healthLoss: { easy: 10; medium: 10; hard: 20; expert: 20 };
    questionsPerCategory: number;
  };
  round2: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
  };
  round3: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
    wheelCategories: string[];
  };
}

export interface AppSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  gameLogo?: string;
  overlayBackground?: string;
  hostCameraUrl?: string;
  soundsEnabled: boolean;
  volume: number;
}
