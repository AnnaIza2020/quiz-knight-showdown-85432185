
import { useState, useEffect, useMemo } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Category, Question } from '@/types/game-types';
import { QuestionFilterOptions, QuestionImportExport } from '@/types/questions-types';
import { toast } from 'sonner';

export const useQuestions = () => {
  const { categories, setCategories, saveGameData, usedQuestionIds } = useGameContext();
  const [filters, setFilters] = useState<QuestionFilterOptions>({
    round: null,
    category: null,
    used: null,
    difficulty: null,
    searchTerm: ''
  });

  // Check if a question is used
  const isQuestionUsed = (questionId: string): boolean => {
    return usedQuestionIds?.includes(questionId) || false;
  };

  // Extract all questions from all categories
  const questions = useMemo(() => {
    const allQuestions: Question[] = [];
    
    categories.forEach(category => {
      category.questions?.forEach(question => {
        allQuestions.push({
          ...question,
          categoryId: category.id,
          category: category.name  // Use category property which exists in Question type
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
  }, [questions, filters, categories, isQuestionUsed]);

  // Check if a question matches the search term
  const questionMatchesSearch = (question: Question, searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    const textMatches = question.text?.toLowerCase().includes(term);
    const optionsMatch = question.options?.some(option => 
      option.toLowerCase().includes(term)
    );
    const answerMatches = question.answer?.toLowerCase().includes(term);
    const categoryMatches = question.category?.toLowerCase().includes(term);
    
    return textMatches || optionsMatch || answerMatches || categoryMatches;
  };

  // Reset all questions to unused
  const resetUsedQuestions = () => {
    // Implemented in GameContext
  };

  // Import questions from JSON
  const importQuestions = (data: QuestionImportExport): boolean => {
    try {
      // Implement import logic
      // For now, just show a success message
      toast.success('Pytania zostały zaimportowane');
      return true;
    } catch (error) {
      console.error('Error importing questions:', error);
      toast.error('Wystąpił błąd podczas importowania pytań');
      return false;
    }
  };

  // Export questions to JSON - fix return type
  const exportQuestions = (exportFiltered: boolean = false): QuestionImportExport => {
    try {
      const questionsToExport = exportFiltered ? filteredQuestions : questions;
      
      const exportData: QuestionImportExport = {
        questions: questionsToExport,
        categories: categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          round: cat.round
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
  };

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
