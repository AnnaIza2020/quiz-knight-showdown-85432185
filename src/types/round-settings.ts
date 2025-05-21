
export interface RoundOneSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  healthDeductionPercentage: number;
  eliminateCount: number;
  maxQuestions: number;
}

export interface RoundTwoSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxQuestions: number;
}

export interface RoundThreeSettings {
  pointsForCorrectAnswer: number;
  pointsForIncorrectAnswer: number;
  livesCount: number;
  livesDeductedOnIncorrectAnswer: number;
  maxSpins: number;
  finalRoundEnabled: boolean;
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
}

export const defaultRoundSettings: RoundSettings = {
  round1: {
    pointsForCorrectAnswer: 10,
    pointsForIncorrectAnswer: -5,
    livesCount: 3,
    healthDeductionPercentage: 25,
    eliminateCount: 4,
    maxQuestions: 20
  },
  round2: {
    pointsForCorrectAnswer: 15,
    pointsForIncorrectAnswer: -10,
    livesCount: 3,
    livesDeductedOnIncorrectAnswer: 1,
    maxQuestions: 15
  },
  round3: {
    pointsForCorrectAnswer: 20,
    pointsForIncorrectAnswer: -15,
    livesCount: 2,
    livesDeductedOnIncorrectAnswer: 1,
    maxSpins: 10,
    finalRoundEnabled: true
  },
  timerDurations: {
    round1: 30,
    round2: 20,
    round3: 15
  }
};
