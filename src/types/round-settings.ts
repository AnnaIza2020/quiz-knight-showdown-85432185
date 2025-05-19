
/**
 * Settings for game rounds
 */
export interface RoundSettings {
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
  timerDurations: {
    round1: number;
    round2: number;
    round3: number;
  };
  luckyLoserThreshold: number;
}

export const DEFAULT_ROUND_SETTINGS: RoundSettings = {
  pointValues: {
    round1: { easy: 10, medium: 15, hard: 20, expert: 30 },
    round2: 15,
    round3: 30
  },
  lifePenalties: {
    round1: 25,
    round2: 20,
    round3: 30
  },
  timerDurations: {
    round1: 30,
    round2: 20,
    round3: 30
  },
  luckyLoserThreshold: 20
};
