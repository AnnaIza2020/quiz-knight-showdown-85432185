
import { SoundEffectOptions } from '@/hooks/useSoundEffects';

// Game rounds
export enum GameRound {
  SETUP = 0,
  ROUND_ONE = 1,
  ROUND_TWO = 2,
  ROUND_THREE = 3,
  FINISHED = 4
}

// Player interface
export interface Player {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  specialCards: string[];
  cameraUrl?: string;
  color?: string;
  isActive?: boolean;
  uniqueLinkToken?: string;
}

// Category interface
export interface Category {
  id: string;
  name: string;
  round: GameRound;
  questions: Question[];
}

// Question interface
export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string;
  categoryId: string;
  category?: string; // Dodane dla wstecznej kompatybilności
  difficulty: number;
  imageUrl?: string;
  used?: boolean;
  question?: string; // Dodane dla wstecznej kompatybilności
  answer?: string; // Dodane dla wstecznej kompatybilności
}

// Special Card interface
export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
}

// Special Card Award Rule interface
export interface SpecialCardAwardRule {
  id: string;
  cardId: string;
  condition: 'correct_answer' | 'incorrect_answer' | 'round_start' | 'round_end' | 'random' | string; // Rozszerzono, aby akceptować wartości typu string
  probability?: number; // 0-100
  roundApplicable?: GameRound[];
  roundType?: GameRound; // Dodana property
  description?: string; // Dodana property
  isEnabled?: boolean; // Dodana property
}

// Sound effects
export type SoundEffect = 'success' | 'fail' | 'timeout' | 'eliminate' | 'round-start' | 'victory' | 'card-reveal' | 'wheel-spin' | 'wheel-tick' | 'bonus' | 'narrator' | 'intro-music' | string;

// Game context type
export interface GameContextType {
  // State
  round: GameRound;
  players: Player[];
  categories: Category[];
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  timerSeconds: number;
  winnerIds: string[];
  gameLogo: string | null;
  primaryColor: string;
  secondaryColor: string;
  hostCameraUrl: string;
  specialCards: SpecialCard[];
  specialCardRules: SpecialCardAwardRule[];
  
  // Sound-related properties
  volume: number;
  setVolume: (volume: number) => void;
  availableSounds: Record<string, string>;
  addCustomSound: (name: string, url: string) => void;
  playSound: (sound: SoundEffect, volume?: number) => void;
  playSoundWithOptions: (sound: SoundEffect, options: SoundEffectOptions) => void;
  stopSound: (sound: SoundEffect) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  
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
  checkRoundThreeEnd: () => boolean | void; // Zmieniony typ zwracany
  resetGame: () => void;
  setWinnerIds: (ids: string[]) => void;
  
  // Special cards methods
  addSpecialCard: (card: SpecialCard) => void;
  updateSpecialCard: (card: SpecialCard) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: SpecialCardAwardRule) => void;
  updateSpecialCardRule: (rule: SpecialCardAwardRule) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
  
  // Settings methods
  setGameLogo: (url: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
  
  // Data persistence methods
  loadGameData: () => void;
  saveGameData: () => void;
  
  // Question methods (dodane)
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, question: Question) => void;
}
