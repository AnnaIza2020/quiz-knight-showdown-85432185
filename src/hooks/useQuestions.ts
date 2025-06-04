
import { useMemo, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { Question } from '@/types/interfaces';
import { toast } from 'sonner';
import { useQuestionsCore } from './useQuestions/useQuestionsCore';
import { useQuestionsImportExport } from './useQuestions/useQuestionsImportExport';

/**
 * Main hook for managing questions - refactored into smaller modules
 */
export const useQuestions = () => {
  const { categories, saveGameData } = useGameContext();
  const { 
    isQuestionUsed, 
    resetUsedQuestions: contextResetUsedQuestions,
    addQuestion,
    updateQuestion
  } = useQuestionsContext();
  
  // Extract all questions from all categories
  const questions = useMemo(() => {
    const allQuestions: Question[] = [];
    
    categories.forEach(category => {
      category.questions?.forEach(question => {
        allQuestions.push({
          ...question,
          categoryId: question.categoryId || category.id,
          category: question.category || category.name,
          timeLimit: question.timeLimit || question.time || 30,
          type: question.type || 'multiple_choice',
          points: question.points || 10
        });
      });
    });
    
    return allQuestions;
  }, [categories]);

  // Use core filtering functionality
  const { filters, setFilters, questionMatchesSearch } = useQuestionsCore(questions);

  // Apply filters with category context
  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      // Filter by round
      if (filters.round !== null) {
        const category = categories.find(c => c.id === question.categoryId);
        if (!category || category.round !== filters.round) return false;
      }
      
      // Filter by category
      if (filters.category !== null && question.categoryId !== filters.category) return false;
      
      // Filter by used status
      if (filters.used === true && !isQuestionUsed(question.id)) return false;
      if (filters.used === false && isQuestionUsed(question.id)) return false;
      
      // Filter by difficulty
      if (filters.difficulty !== null && question.difficulty !== filters.difficulty) return false;
      
      // Filter by search term
      if (filters.searchTerm && !questionMatchesSearch(question, filters.searchTerm)) return false;
      
      return true;
    });
  }, [questions, filters, categories, isQuestionUsed, questionMatchesSearch]);

  // Import/Export functionality
  const { importQuestions, exportQuestions } = useQuestionsImportExport(
    questions,
    filteredQuestions,
    categories,
    addQuestion,
    updateQuestion,
    saveGameData
  );

  // Reset used questions
  const resetUsedQuestions = useCallback(() => {
    contextResetUsedQuestions();
    toast.success('Wszystkie pytania zostały oznaczone jako niewykorzystane');
  }, [contextResetUsedQuestions]);

  return {
    questions,
    filteredQuestions,
    filters,
    setFilters,
    importQuestions,
    exportQuestions,
    resetUsedQuestions,
    isQuestionUsed
  };
};
