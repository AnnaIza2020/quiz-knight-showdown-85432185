
import { useState } from 'react';
import { Player } from '@/types/interfaces';

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
  pointValues: { 
    round1: { easy: number; medium: number; hard: number; expert: number };
    round2: number;
    round3: number;
  };
  lifePenalties: { 
    round1: number; 
    round2: number; 
    round3: number; 
  };
  luckyLoserThreshold?: number;
}

export const useGameLogic = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  
  const defaultRoundSettings: RoundSettings = {
    round1: {
      startingHealth: 100,
      pointValues: { easy: 5, medium: 10, hard: 15, expert: 20 },
      healthLoss: { easy: 10, medium: 10, hard: 20, expert: 20 },
      questionsPerCategory: 10,
      maxQuestions: 50,
      pointsForCorrectAnswer: 10,
      pointsForIncorrectAnswer: 0,
      livesCount: 3,
      healthDeductionPercentage: 10,
      eliminateCount: 4,
      luckyLoserEnabled: true
    },
    round2: {
      startingHealth: 100,
      pointValue: 15,
      healthLoss: 20,
      timeLimit: 5,
      maxQuestions: 30,
      pointsForCorrectAnswer: 15,
      pointsForIncorrectAnswer: 0,
      livesCount: 3,
      livesDeductedOnIncorrectAnswer: 1
    },
    round3: {
      startingHealth: 100,
      pointValue: 25,
      healthLoss: 25,
      timeLimit: 30,
      wheelCategories: [],
      maxSpins: 10,
      pointsForCorrectAnswer: 25,
      pointsForIncorrectAnswer: 0,
      livesCount: 3,
      livesDeductedOnIncorrectAnswer: 1,
      finalRoundEnabled: true
    },
    timerDurations: {
      round1: 30,
      round2: 5,
      round3: 30
    },
    pointValues: { 
      round1: { easy: 5, medium: 10, hard: 15, expert: 20 },
      round2: 15,
      round3: 25
    },
    lifePenalties: { 
      round1: 10, 
      round2: 20, 
      round3: 25 
    }
  };

  return {
    players,
    setPlayers,
    defaultRoundSettings
  };
};
