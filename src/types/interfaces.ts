
export interface Player {
  id: string;
  nickname: string; // Required now
  name: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  isActive: boolean; // Required now
  color: string;
  avatar?: string;
  cameraUrl?: string;
  specialCards: string[];
  status: 'online' | 'offline' | 'active';
  uniqueLinkToken?: string;
  avatar_url?: string; // For backward compatibility
  camera_url?: string; // For backward compatibility
  forcedEliminated?: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  categoryId: string;
  difficulty: number;
  type: 'text' | 'multiple_choice' | 'true_false'; // Align with game-types
  options: string[]; // Required now
  correctAnswer: string;
  timeLimit: number;
  points: number;
  used?: boolean;
  imageUrl?: string;
  question?: string; // For backward compatibility
  answer?: string; // For backward compatibility
  image_url?: string; // For backward compatibility
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
  iconName?: string;
  type: 'defense' | 'attack' | 'bonus' | 'manipulation';
  jsHook?: string;
  soundEffect?: string;
  animation?: string;
  animationStyle?: 'glow' | 'neon-blue' | 'neon-green' | 'neon-red' | 'neon-purple' | 'rainbow';
  defaultQuantity: number;
}

export interface GameState {
  currentRound: 'lobby' | 'setup' | 'round1' | 'round2' | 'round3' | 'finished';
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
    pointValues: { easy: number; medium: number; hard: number; expert: number };
    healthLoss: { easy: number; medium: number; hard: number; expert: number };
    questionsPerCategory: number;
    maxQuestions: number;
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    livesCount: number;
    healthDeductionPercentage: number;
    eliminateCount: number;
    luckyLoserEnabled: boolean;
  };
  round2: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
    maxQuestions: number;
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    livesCount: number;
    livesDeductedOnIncorrectAnswer: number;
  };
  round3: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
    wheelCategories: string[];
    maxSpins: number;
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    livesCount: number;
    livesDeductedOnIncorrectAnswer: number;
    finalRoundEnabled: boolean;
  };
  timerDurations: {
    round1: number;
    round2: number;
    round3: number;
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
