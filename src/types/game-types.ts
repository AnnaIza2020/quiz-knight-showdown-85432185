
import { ReactNode } from 'react';
import { PlayerAvailabilitySlot } from './availability-types';
import { RoundSettings } from './round-settings';

export enum GameRound {
  SETUP = 0,
  ROUND_ONE = 1,
  ROUND_TWO = 2,
  ROUND_THREE = 3,
  FINISHED = 4
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  difficulty: number;
  category?: string;
  correctAnswer: string;
  options?: string[];
  image_url?: string;
  type?: 'multiple_choice' | 'true_false' | 'open';
  categoryName?: string;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  avatar_url?: string;
  camera_url?: string;
  color?: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  specialCards?: string[];
  status?: 'active' | 'inactive' | 'eliminated';
}

export type SoundEffect = 
  | 'success' 
  | 'fail' 
  | 'bonus' 
  | 'card-reveal' 
  | 'eliminate' 
  | 'intro-music' 
  | 'narrator' 
  | 'round-start' 
  | 'timeout' 
  | 'victory' 
  | 'wheel-tick';

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  type: string;
  icon?: string;
  image_url?: string;
  sound_effect?: string;
  animation_style?: string;
}

export interface SpecialCardAwardRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  cardId: string;
  threshold: number;
  round?: GameRound;
  limit?: number;
}

export interface SoundEffectsHook {
  playSound: (sound: SoundEffect, volume?: number) => void;
  stopSound: (sound: SoundEffect) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  playSoundWithOptions: (sound: SoundEffect, options: any) => void;
  volume: number;
  setVolume: (volume: number) => void;
  soundStatus: Record<string, any>;
  availableSounds: SoundEffect[];
  addCustomSound: (name: string, url: string) => void;
}

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
  usedQuestionIds: string[];
  roundSettings: RoundSettings;
  
  // Sound settings
  playSound: (sound: SoundEffect, volume?: number) => void;
  stopSound: (sound: SoundEffect) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  playSoundWithOptions: (sound: SoundEffect, options: any) => void;
  volume: number;
  setVolume: (volume: number) => void;
  soundStatus: Record<string, any>;
  availableSounds: SoundEffect[];
  addCustomSound: (name: string, url: string) => void;
  
  // Error reporting
  reportError: (message: string, settings?: any) => void;
  
  // Methods
  setRound: (round: GameRound) => void;
  setPlayers: (players: Player[]) => void;
  setCategories: (categories: Category[]) => void;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (categoryId: string) => void;
  selectQuestion: (question: Question | null) => void;
  setActivePlayer: (playerId: string | null) => void;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  awardPoints: (playerId: string, points: number) => void;
  deductHealth: (playerId: string, percentage: number) => void;
  deductLife: (playerId: string) => void;
  eliminatePlayer: (playerId: string) => void;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  finishGame: (winnerIds: string[]) => void;
  checkRoundThreeEnd: () => boolean;
  resetGame: () => void;
  setWinnerIds: (ids: string[]) => void;
  
  // Undo and manual adjustments
  undoLastAction: () => void;
  hasUndoHistory: boolean;
  addManualPoints: (playerId: string, points: number) => void;
  adjustHealthManually: (playerId: string, healthPercent: number) => void;
  
  // Card methods
  addSpecialCard: (card: any) => void;
  updateSpecialCard: (cardId: string, updates: any) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: any) => void;
  updateSpecialCardRule: (ruleId: string, updates: any) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
  
  // Settings methods
  setGameLogo: (logo: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
  updateRoundSettings: (settings: Partial<RoundSettings>) => void;
  
  // Data persistence
  loadGameData: () => void;
  saveGameData: () => void;
  
  // Question management
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, question: Question) => void;
  markQuestionAsUsed: (questionId: string) => void;
  resetUsedQuestions: () => void;
  isQuestionUsed: (questionId: string) => boolean;
  
  // Player availability calendar
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (playerId: string, slot: PlayerAvailabilitySlot) => Promise<boolean>;
}
