
export interface RoundSettings {
  round1: {
    startingHealth: number;
    pointValues: { easy: number; medium: number; hard: number; expert: number };
    healthLoss: { easy: number; medium: number; hard: number; expert: number };
    questionsPerCategory: number;
  };
  round2: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
  };
  round3: {
    startingHealth: number;
    pointValue: number;
    healthLoss: number;
    timeLimit: number;
    wheelCategories: string[];
  };
}
