
import { useState, useMemo, useCallback } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useQuestionsContext } from '@/context/QuestionsContext';
import { Question } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';
import { QuestionFilterOptions, QuestionImportExport } from '@/types/questions-types';
import { toast } from 'sonner';

/**
 * Custom hook for managing questions, including filtering, importing, and exporting
 */
export const useQuestions = () => {
  const { categories, saveGameData } = useGameContext();
  const { 
    usedQuestionIds, 
    isQuestionUsed, 
    resetUsedQuestions: contextResetUsedQuestions,
    addQuestion,
    updateQuestion,
    removeQuestion
  } = useQuestionsContext();
  
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

  // Extract all questions from all categories and ensure they have required fields
  const questions = useMemo(() => {
    const allQuestions: Question[] = [];
    
    categories.forEach(category => {
      category.questions?.forEach(question => {
        allQuestions.push({
          ...question,
          categoryId: question.categoryId || category.id,
          category: question.category || category.name,
          timeLimit: question.timeLimit || question.time || 30,
          type: question.type || 'multiple_choice'
        });
      });
    });
    
    return allQuestions;
  }, [categories]);

  // Apply filters to the questions
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

  // Reset all questions to unused - use the one from context
  const resetUsedQuestions = useCallback(() => {
    contextResetUsedQuestions();
    toast.success('Wszystkie pytania zostały oznaczone jako niewykorzystane');
  }, [contextResetUsedQuestions]);

  // Import questions from JSON - ensure required fields are added
  const importQuestions = useCallback((data: QuestionImportExport): boolean => {
    try {
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        toast.error('Nieprawidłowy format danych');
        return false;
      }
      
      // Track created and updated questions counts
      let created = 0;
      let updated = 0;
      let errors = 0;
      
      // Process each question
      data.questions.forEach((question) => {
        try {
          const { categoryId } = question;
          if (!categoryId) {
            errors++;
            return;
          }
          
          // Ensure question has required fields
          const questionWithRequiredFields: Question = {
            ...question,
            category: question.category || 'Unknown',
            timeLimit: question.timeLimit || question.time || 30,
            type: question.type || 'multiple_choice'
          };
          
          const existingQuestion = questions.find(q => q.id === question.id);
          if (existingQuestion) {
            updateQuestion(categoryId, questionWithRequiredFields);
            updated++;
          } else {
            addQuestion(categoryId, questionWithRequiredFields);
            created++;
          }
        } catch (e) {
          console.error("Error processing question:", e);
          errors++;
        }
      });
      
      // Save game data after import
      saveGameData();
      
      if (errors > 0) {
        toast.warning(`Import zakończony: ${created} dodanych, ${updated} zaktualizowanych, ${errors} błędów`);
      } else {
        toast.success(`Import zakończony: ${created} dodanych, ${updated} zaktualizowanych`);
      }
      return true;
    } catch (error) {
      console.error('Error importing questions:', error);
      toast.error('Wystąpił błąd podczas importowania pytań');
      return false;
    }
  }, [questions, addQuestion, updateQuestion, saveGameData]);

  // Export questions to JSON
  const exportQuestions = useCallback((exportFiltered: boolean = false): QuestionImportExport => {
    try {
      const questionsToExport = exportFiltered ? filteredQuestions : questions;
      
      const exportData: QuestionImportExport = {
        questions: questionsToExport,
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          round: cat.round as GameRound
        })),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "questions_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast.success('Pytania zostały wyeksportowane');
      return exportData;
    } catch (error) {
      console.error('Error exporting questions:', error);
      toast.error('Wystąpił błąd podczas eksportowania pytań');
      // Return empty export data structure on error
      return {
        questions: [],
        categories: [],
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
    }
  }, [filteredQuestions, questions, categories]);

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
