
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
}
