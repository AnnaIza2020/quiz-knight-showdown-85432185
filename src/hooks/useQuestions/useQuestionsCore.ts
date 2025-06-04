
import { useState, useMemo, useCallback } from 'react';
import { Question } from '@/types/interfaces';
import { QuestionFilterOptions } from '@/types/questions-types';

/**
 * Core hook for managing questions filtering and searching
 */
export const useQuestionsCore = (questions: Question[]) => {
  const [filters, setFilters] = useState<QuestionFilterOptions>({
    round: null,
    category: null,
    used: null,
    difficulty: null,
    searchTerm: ''
  });

  // Helper function to check if a question matches the search term
  const questionMatchesSearch = useCallback((question: Question, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    const textMatches = question.text?.toLowerCase().includes(term);
    const optionsMatch = question.options?.some(option => 
      option.toLowerCase().includes(term)
    );
    const answerMatches = question.correctAnswer?.toLowerCase().includes(term);
    const categoryMatches = question.category?.toLowerCase().includes(term);
    
    return textMatches || optionsMatch || answerMatches || categoryMatches;
  }, []);

  // Apply filters to the questions
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Filter by round
      if (filters.round !== null) {
        // Round filtering logic would need category context
        // This is handled in the parent hook
      }
      
      // Filter by category
      if (filters.category !== null && question.categoryId !== filters.category) return false;
      
      // Filter by difficulty
      if (filters.difficulty !== null && question.difficulty !== filters.difficulty) return false;
      
      // Filter by search term
      if (filters.searchTerm && !questionMatchesSearch(question, filters.searchTerm)) return false;
      
      return true;
    });
  }, [questions, filters, questionMatchesSearch]);

  return {
    filters,
    setFilters,
    filteredQuestions,
    questionMatchesSearch
  };
};
