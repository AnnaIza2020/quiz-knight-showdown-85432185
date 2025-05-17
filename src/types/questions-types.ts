
import { Question, GameRound } from '@/types/game-types';

// Filter options for questions
export interface QuestionFilters {
  round?: GameRound | null;
  category?: string | null;
  used?: boolean | null;
  difficulty?: number | null;
  searchTerm?: string;
}

// Structure for importing/exporting questions
export interface QuestionImportExport {
  questions: Question[];
  categories: {
    id: string;
    name: string;
    round: GameRound;
  }[];
  exportDate: string;
  version: string;
}
