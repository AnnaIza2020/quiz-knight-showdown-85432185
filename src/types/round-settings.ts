
import { GameRound } from './game-types';

export interface RoundSettings {
  // Global settings
  defaultTimerDuration: number;
  randomizeQuestions: boolean;
  
  // Round-specific settings
  [GameRound.ROUND_ONE]: {
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    timerDuration: number;
    livesCount: number;
    livesDeductedOnIncorrectAnswer: number;
    healthDeductionPercentage: number;
    luckyLoserEnabled: boolean;
    eliminationCount: number;
    maxQuestions: number;
  };
  
  [GameRound.ROUND_TWO]: {
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    timerDuration: number;
    livesCount: number;
    livesDeductedOnIncorrectAnswer: number;
    maxQuestions: number;
  };
  
  [GameRound.ROUND_THREE]: {
    pointsForCorrectAnswer: number;
    pointsForIncorrectAnswer: number;
    timerDuration: number;
    livesCount: number;
    livesDeductedOnIncorrectAnswer: number;
    wheelCategories: string[];
    maxSpins: number;
    finalRoundEnabled: boolean;
  };
}

export const DEFAULT_ROUND_SETTINGS: RoundSettings = {
  defaultTimerDuration: 30,
  randomizeQuestions: true,
  
  [GameRound.ROUND_ONE]: {
    pointsForCorrectAnswer: 100,
    pointsForIncorrectAnswer: -50,
    timerDuration: 30,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 0,
    healthDeductionPercentage: 33,
    luckyLoserEnabled: true,
    eliminationCount: 4,
    maxQuestions: 12
  },
  
  [GameRound.ROUND_TWO]: {
    pointsForCorrectAnswer: 200,
    pointsForIncorrectAnswer: -50,
    timerDuration: 5,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxQuestions: 10
  },
  
  [GameRound.ROUND_THREE]: {
    pointsForCorrectAnswer: 300,
    pointsForIncorrectAnswer: -100,
    timerDuration: 15,
    livesCount: 1,
    livesDeductedOnIncorrectAnswer: 1,
    wheelCategories: [
      "Język polskiego internetu",
      "Polska scena Twitcha",
      "Zagadki", 
      "Czy jesteś mądrzejszy od 8-klasisty",
      "Gry, które podbiły Polskę",
      "Technologie i internet w Polsce"
    ],
    maxSpins: 10,
    finalRoundEnabled: true
  }
};
