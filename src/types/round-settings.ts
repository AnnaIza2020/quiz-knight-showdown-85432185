
import { GameRound } from './game-types';

export interface RoundOneSettings {
  playerLifeCount: number;
  timerDuration: number;
  eliminateCount: number;
  luckyLoserEnabled: boolean;
  // Additional properties needed by components
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  healthDeductionPercentage: number;
  maxQuestions: number;
}

export interface RoundTwoSettings {
  timerDuration: number;
  lifePenalty: number;
  pointsPerQuestion: number;
  // Additional properties needed by components
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxQuestions: number;
}

export interface RoundThreeSettings {
  wheelSpinDuration: number;
  timerDuration: number;
  pointsMultiplier: number;
  wheelCategories: string[];
  // Additional properties needed by components
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxSpins: number;
  finalRoundEnabled: boolean;
}

export interface RoundSettings {
  defaultTimerDuration: number;
  randomizeQuestions: boolean;
  timerDurations?: {
    [GameRound.ROUND_ONE]: number;
    [GameRound.ROUND_TWO]: number;
    [GameRound.ROUND_THREE]: number;
  };
  [GameRound.ROUND_ONE]: RoundOneSettings;
  [GameRound.ROUND_TWO]: RoundTwoSettings;
  [GameRound.ROUND_THREE]: RoundThreeSettings;
}

export const defaultRoundSettings: RoundSettings = {
  defaultTimerDuration: 30,
  randomizeQuestions: true,
  timerDurations: {
    [GameRound.ROUND_ONE]: 30,
    [GameRound.ROUND_TWO]: 5,
    [GameRound.ROUND_THREE]: 15
  },
  [GameRound.ROUND_ONE]: {
    playerLifeCount: 3,
    timerDuration: 30,
    eliminateCount: 4,
    luckyLoserEnabled: true,
    pointsForCorrectAnswer: 100,
    pointsForIncorrectAnswer: 0,
    livesCount: 3,
    healthDeductionPercentage: 33,
    maxQuestions: 15
  },
  [GameRound.ROUND_TWO]: {
    timerDuration: 5,
    lifePenalty: 1,
    pointsPerQuestion: 100,
    pointsForCorrectAnswer: 200,
    pointsForIncorrectAnswer: 0,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxQuestions: 10
  },
  [GameRound.ROUND_THREE]: {
    wheelSpinDuration: 5000,
    timerDuration: 15,
    pointsMultiplier: 2,
    wheelCategories: ['Historia', 'Geografia', 'Film i TV', 'Kultura', 'Technologia', 'Internet', 'Nauka'],
    pointsForCorrectAnswer: 300,
    pointsForIncorrectAnswer: 0,
    livesCount: 2,
    livesDeductedOnIncorrectAnswer: 1,
    maxSpins: 10,
    finalRoundEnabled: false
  }
};
