
import { GameRound } from "./game-types";

export interface RoundOneSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  timerDuration: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  healthDeductionPercentage: number;
  luckyLoserEnabled: boolean;
  eliminationCount: number;
  maxQuestions: number;
}

export interface RoundTwoSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  timerDuration: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxQuestions: number;
}

export interface RoundThreeSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  timerDuration: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxSpins: number;
  finalRoundEnabled: boolean;
  wheelCategories: string[];
}

export interface RoundSettings {
  defaultTimerDuration: number;
  randomizeQuestions: boolean;
  [GameRound.ROUND_ONE]: RoundOneSettings;
  [GameRound.ROUND_TWO]: RoundTwoSettings;
  [GameRound.ROUND_THREE]: RoundThreeSettings;
}

// Default settings
export const defaultRoundSettings: RoundSettings = {
  defaultTimerDuration: 30,
  randomizeQuestions: true,
  [GameRound.ROUND_ONE]: {
    pointsForCorrectAnswer: 10,
    pointsForIncorrectAnswer: 0,
    timerDuration: 30,
    livesCount: 1,
    livesDeductedOnIncorrectAnswer: 0,
    healthDeductionPercentage: 25,
    luckyLoserEnabled: true,
    eliminationCount: 4,
    maxQuestions: 15
  },
  [GameRound.ROUND_TWO]: {
    pointsForCorrectAnswer: 15,
    pointsForIncorrectAnswer: -5,
    timerDuration: 5,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxQuestions: 10
  },
  [GameRound.ROUND_THREE]: {
    pointsForCorrectAnswer: 25,
    pointsForIncorrectAnswer: -10,
    timerDuration: 20,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxSpins: 10,
    finalRoundEnabled: true,
    wheelCategories: [
      'Historia',
      'Geografia',
      'Sport',
      'Kultura',
      'Gry',
      'Nowe Media',
      'Polski Internet',
      'Wiedza Ogólna'
    ]
  }
};
