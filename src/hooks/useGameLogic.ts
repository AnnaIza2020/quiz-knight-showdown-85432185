
import { useState } from 'react';
import { Player, RoundSettings } from '@/types/interfaces';

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
      easy: 10, 
      medium: 15, 
      hard: 20, 
      expert: 25 
    }
  };

  return {
    players,
    setPlayers,
    defaultRoundSettings
  };
};

export type { RoundSettings };
