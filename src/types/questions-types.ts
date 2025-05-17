
import { Question, GameRound } from '@/types/game-types';

// Filter options for questions
export interface QuestionFilterOptions {
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

// Interface for QuestionFilters component props
export interface QuestionFiltersProps {
  filters: QuestionFilterOptions;
  onFilterChange: (filters: QuestionFilterOptions) => void;
  categories: { id: string; name: string }[];
  totalQuestions?: number;
  filteredCount?: number;
}
