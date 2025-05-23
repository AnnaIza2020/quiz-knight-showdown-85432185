
export interface RoundOneSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  healthDeductionPercentage: number;
  eliminateCount: number;
  maxQuestions: number;
  timerDuration?: number;
  luckyLoserEnabled: boolean;
}

export interface RoundTwoSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxQuestions: number;
  timerDuration?: number;
}

export interface RoundThreeSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxSpins: number;
  finalRoundEnabled: boolean;
  timerDuration?: number;
}

export interface RoundSettings {
  round1: RoundOneSettings;
  round2: RoundTwoSettings;
  round3: RoundThreeSettings;
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
  luckyLoserThreshold: number;
}

export const defaultRoundSettings: RoundSettings = {
  round1: {
    pointsForCorrectAnswer: 10,
    pointsForIncorrectAnswer: -5,
    livesCount: 3,
    healthDeductionPercentage: 25,
    eliminateCount: 4,
    maxQuestions: 20,
    timerDuration: 30,
    luckyLoserEnabled: true
  },
  round2: {
    pointsForCorrectAnswer: 15,
    pointsForIncorrectAnswer: -10,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxQuestions: 15,
    timerDuration: 20
  },
  round3: {
    pointsForCorrectAnswer: 20,
    pointsForIncorrectAnswer: -15,
    livesCount: 2,
    livesDeductedOnIncorrectAnswer: 1,
    maxSpins: 10,
    finalRoundEnabled: true,
    timerDuration: 15
  },
  timerDurations: {
    round1: 30,
    round2: 20,
    round3: 15
  },
  pointValues: {
    round1: { easy: 5, medium: 10, hard: 15, expert: 20 },
    round2: 15,
    round3: 25
  },
  lifePenalties: {
    round1: 25,
    round2: 1,
    round3: 1
  },
  luckyLoserThreshold: 5
};
