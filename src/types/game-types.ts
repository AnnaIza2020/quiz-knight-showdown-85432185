import { ReactNode } from 'react';
import { RoundSettings } from './round-settings';
import { AvailabilityContextType, PlayerAvailabilitySlot } from './availability-types';

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
  round: GameRound;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  categoryId: string;
  difficulty: number;
  options: string[];
  image_url?: string;
  category?: string;
  question?: string; // Alternative to text field used by some components
  answer?: string;  // Alternative to correctAnswer field used by some components
}

export interface Player {
  id: string;
  name?: string;
  nickname?: string;
  avatar_url?: string;
  avatar?: string;
  camera_url?: string;
  cameraUrl?: string;
  color?: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  isActive?: boolean;
  specialCards?: string[];
  status?: 'active' | 'inactive' | 'eliminated';
  forcedEliminated?: boolean;
  uniqueLinkToken?: string;
}

// Log entry type for the action history system
export interface LogEntry {
  id: string;
  timestamp: number;
  type: 'answer' | 'card' | 'score' | 'life' | 'round' | 'timer' | 'system' | 'player' | 'elimination';
  player?: string; // Player ID or nickname
  action: string;
  value?: any;
  metadata?: Record<string, any>;
}

// Sound effect types used across components
export type SoundEffect = 
  | 'success' 
  | 'fail' 
  | 'failure'  // Alternative to fail
  | 'bonus' 
  | 'card-reveal' 
  | 'eliminate' 
  | 'victory' 
  | 'round-start' 
  | 'timeout' 
  | 'narrator' 
  | 'intro-music'
  | 'wheel-tick'
  | 'wheel-spin'
  | 'click'
  | 'damage'
  | 'powerup'
  | string; // Allow custom sound effects

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  sound_effect?: string;
  icon_name?: string;
  animation_style?: string;
  type: string;
  // For backward compatibility
  imageUrl?: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
  // Extended properties for special card functionality
  effectType?: string;
  effectHook?: string;
  effectParams?: any;
}

export interface SpecialCardAwardRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  cardId: string;
  threshold: number;
  round?: GameRound;
  roundType?: string;
  limit?: number;
  roundApplicable?: number[]; // Used in components
  probability?: number; // Used in components
  isEnabled?: boolean; // Used in components
  params?: any; // Used in components
}

// Backup structure for the backup/restore system
export interface GameBackup {
  id: string;
  name: string;
  timestamp: number;
  data: any;
  gameState?: any;
}

// Card size type used in CardDisplay component
export type CardSize = "tiny" | "small" | "medium" | "large";

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
  gameLogo: string;
  primaryColor: string;
  secondaryColor: string;
  hostCameraUrl: string;
  specialCards: SpecialCard[];
  specialCardRules: any[];
  usedQuestionIds: string[];
  gameTitle: string; // Added property
  
  // Round settings
  roundSettings: RoundSettings;
  updateRoundSettings: (settings: RoundSettings) => void;
  
  // Action logs
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  
  // Sound settings
  playSound: (soundName: SoundEffect, volume?: number) => void;
  stopSound: (soundName: SoundEffect) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  playSoundWithOptions: (options: any) => void;
  volume: number;
  setVolume: (volume: number) => void;
  soundStatus: Record<string, any>;
  availableSounds: string[];
  addCustomSound: (name: string, url: string) => void;
  
  // Error reporting
  reportError: (message: string, settings?: any) => void;
  
  // Game state methods
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
  deductLife: (playerId: string, amount: number) => void;
  eliminatePlayer: (playerId: string) => void;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  finishGame: (winnerIds: string[]) => void;
  checkRoundThreeEnd: () => boolean;
  resetGame: () => void;
  setWinnerIds: (winnerIds: string[]) => void;
  setGameTitle: (title: string) => void; // Added property
  
  // Undo and manual point/health adjustment
  undoLastAction: () => void;
  hasUndoHistory: () => boolean;
  addManualPoints: (playerId: string, points: number) => void;
  adjustHealthManually: (playerId: string, health: number) => void;
  
  // Special card methods
  addSpecialCard: (card: Partial<SpecialCard>) => void;
  updateSpecialCard: (cardId: string, updates: Partial<SpecialCard>) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: any) => void;
  updateSpecialCardRule: (ruleId: string, updates: any) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
  
  // Settings methods
  setGameLogo: (url: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
  
  // Data persistence
  loadGameData: () => Promise<any>;
  saveGameData: () => Promise<any>;
  
  // Game Backup methods
  createBackup: (name: string) => Promise<any>;
  restoreBackup: (backup: GameBackup) => Promise<boolean>;
  getBackups: () => Promise<{success: boolean, data: GameBackup[], error?: any}>;
  deleteBackup: (backupId: string) => Promise<{success: boolean, error?: any}>;

  // Question methods
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, updatedQuestion: Question) => void;
  markQuestionAsUsed: (questionId: string) => Promise<any>;
  resetUsedQuestions: () => Promise<any>;
  isQuestionUsed: (questionId: string) => boolean;
  
  // Availability methods
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<boolean>;
}
