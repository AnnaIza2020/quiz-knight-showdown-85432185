
import { GameRound } from './game-types';

export interface RoundOneSettings {
  playerLifeCount: number;
  timerDuration: number;
  eliminateCount: number;
  luckyLoserEnabled: boolean;
}

export interface RoundTwoSettings {
  timerDuration: number;
  lifePenalty: number;
  pointsPerQuestion: number;
}

export interface RoundThreeSettings {
  wheelSpinDuration: number;
  timerDuration: number;
  pointsMultiplier: number;
  wheelCategories: string[];
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
    luckyLoserEnabled: true
  },
  [GameRound.ROUND_TWO]: {
    timerDuration: 5,
    lifePenalty: 1,
    pointsPerQuestion: 100
  },
  [GameRound.ROUND_THREE]: {
    wheelSpinDuration: 5000,
    timerDuration: 15,
    pointsMultiplier: 2,
    wheelCategories: ['Historia', 'Geografia', 'Film i TV', 'Kultura', 'Technologia', 'Internet', 'Nauka']
  }
};
