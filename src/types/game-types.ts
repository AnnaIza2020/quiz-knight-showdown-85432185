
import { RoundSettings } from './round-settings';
import { PlayerAvailabilitySlot } from './availability-types';

export enum GameRound {
  SETUP = 'setup',
  ROUND_ONE = 'round_1',
  ROUND_TWO = 'round_2',
  ROUND_THREE = 'round_3',
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
  avatar_url?: string;
  camera_url?: string;
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

export interface SpecialCard {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  soundEffect?: string;
  iconName?: string;
  animationStyle?: string;
  type: string;
  effectType?: string;
  effectHook?: string;
  effectParams?: Record<string, any>;
}

export interface SpecialCardRule {
  id: string;
  name: string;
  description: string;
  applies_to: string[];
  priority: number;
  active: boolean;
  effect: string;
}

export interface GameBackup {
  id: string;
  name: string;
  date: Date;
  data: any;
}

export interface GameSound {
  id: string;
  name: string;
  file: string;
  volume?: number;
  loop?: boolean;
  autoplay?: boolean;
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
  specialCardRules: SpecialCardRule[];
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
  playSound: (sound: string, volume?: number) => void;
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
  selectQuestion: (categoryId: string, questionId: string) => void;
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
  addSpecialCardRule: (rule: SpecialCardRule) => void;
  updateSpecialCardRule: (ruleId: string, updates: Partial<SpecialCardRule>) => void;
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
}
