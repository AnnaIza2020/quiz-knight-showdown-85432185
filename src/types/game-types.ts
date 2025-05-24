import { RoundSettings } from './round-settings';
import { PlayerAvailabilitySlot } from './availability-types';
import { CardSize as CardSizeType, SpecialCard as CardType } from './card-types';

export enum GameRound {
  SETUP = 'setup',
  ROUND_ONE = 'round1',
  ROUND_TWO = 'round2',
  ROUND_THREE = 'round3',
  FINISHED = 'finished'
}

export interface Player {
  id: string;
  name: string;
  points: number;
  health: number;
  lives: number;
  isEliminated: boolean;
  specialCards: string[];
  color?: string;
  isActive?: boolean;
  status?: string;
  avatar_url?: string;
  camera_url?: string;
  uniqueLinkToken?: string;
  avatar?: string; // For backward compatibility
  cameraUrl?: string; // For backward compatibility
}

export interface Question {
  id: string;
  text: string;
  correctAnswer: string;
  categoryId: string;
  options: string[];
  difficulty: number;
  imageUrl?: string;
  points?: number;
  time?: number;
  used?: boolean;
  type?: 'text' | 'multiple_choice' | 'true_false';
  category?: string; // For backward compatibility
  question?: string; // For backward compatibility
  answer?: string; // For backward compatibility
  image_url?: string; // For backward compatibility
}

export interface Category {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  round?: GameRound | string;
  color?: string;
  icon?: string;
}

// Re-export SpecialCard from card-types
export type SpecialCard = CardType;

// Re-export CardSize from card-types
export type CardSize = CardSizeType;

export interface SpecialCardAwardRule {
  id: string;
  name: string;
  description: string;
  applies_to: string[];
  priority: number;
  active: boolean;
  effect: string;
  
  // Additional properties for card distribution
  isEnabled?: boolean;
  roundApplicable?: GameRound[];
  condition?: 'points' | 'health' | 'elimination' | 'round_completion';
  threshold?: number;
  cardId?: string;
  probability?: number;
}

export interface GameBackup {
  id: string;
  name: string;
  date: Date;
  timestamp?: number;
  data: any;
}

// Define GameSound type
export interface GameSound {
  name: string;
  file: string;
  volume?: number;
  category?: string;
}

// Define LogEntry type
export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  level?: 'info' | 'warning' | 'error' | 'success';
  type?: string;
  action?: string;
  player?: string;
  value?: any;
}

export type SoundEffect = string;

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
  specialCardRules: SpecialCardAwardRule[];
  usedQuestionIds: string[];
  gameTitle: string;
  
  // Logs - added for error tracking
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
  
  // Round settings
  roundSettings: RoundSettings;
  updateRoundSettings: (settings: Partial<RoundSettings>) => void;
  
  // Sound settings
  playSound: (sound: SoundEffect, volume?: number) => void;
  stopSound: (sound: string) => void;
  stopAllSounds: () => void;
  soundsEnabled: boolean;
  setSoundsEnabled: (enabled: boolean) => void;
  playSoundWithOptions: (sound: string, options: any) => void;
  volume: number;
  setVolume: (volume: number) => void;
  soundStatus: Record<string, boolean>;
  availableSounds: GameSound[];
  addCustomSound: (sound: GameSound) => void;
  
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
  deductLife: (playerId: string, lives?: number) => void;
  eliminatePlayer: (playerId: string) => void;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  finishGame: (winnerIds: string[]) => void;
  checkRoundThreeEnd: () => boolean;
  resetGame: () => void;
  setWinnerIds: (ids: string[]) => void;
  setGameTitle: (title: string) => void;
  
  // Undo and manual point/health adjustment
  undoLastAction: () => void;
  hasUndoHistory: () => boolean;
  addManualPoints: (playerId: string, points: number) => void;
  adjustHealthManually: (playerId: string, newHealth: number) => void;
  
  // Special card methods
  addSpecialCard: (card: SpecialCard) => void;
  updateSpecialCard: (cardId: string, updates: Partial<SpecialCard>) => void;
  removeSpecialCard: (cardId: string) => void;
  addSpecialCardRule: (rule: SpecialCardAwardRule) => void;
  updateSpecialCardRule: (ruleId: string, updates: Partial<SpecialCardAwardRule>) => void;
  removeSpecialCardRule: (ruleId: string) => void;
  giveCardToPlayer: (playerId: string, cardId: string) => void;
  usePlayerCard: (playerId: string, cardId: string) => void;
  
  // Settings methods
  setGameLogo: (url: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setHostCameraUrl: (url: string) => void;
  
  // Data persistence with Promise return types
  loadGameData: () => Promise<any>;
  saveGameData: () => Promise<any>;
  
  // Question methods with Promise return types
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, question: Question) => void;
  markQuestionAsUsed: (questionId: string) => Promise<any>;
  resetUsedQuestions: () => Promise<any>;
  isQuestionUsed: (questionId: string) => boolean;
  
  // Game backup methods
  createBackup: (name: string) => Promise<any>;
  restoreBackup: (backup: GameBackup) => Promise<boolean>;
  getBackups: () => Promise<{success: boolean, data: GameBackup[]}>;
  deleteBackup: (backupId: string) => Promise<{success: boolean}>;
  
  // Availability methods
  fetchAvailability: () => Promise<PlayerAvailabilitySlot[]>;
  updateAvailability: (data: PlayerAvailabilitySlot) => Promise<{success: boolean}>;
  saveAvailabilityBatch?: (data: PlayerAvailabilitySlot[]) => Promise<{success: boolean}>;
  getPlayerAvailability?: (playerId: string) => Promise<PlayerAvailabilitySlot[]>;
  deleteAvailability?: (id: string) => Promise<{success: boolean}>;
}
