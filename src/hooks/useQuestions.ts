
import { useState, useMemo } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Question, Category, GameRound } from '@/types/game-types';
import { QuestionFilters } from '@/types/questions-types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export function useQuestions() {
  const { 
    categories,
    addCategory,
    removeCategory,
    addQuestion,
    updateQuestion,
    removeQuestion,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    saveGameData
  } = useGameContext();

  const [filters, setFilters] = useState<QuestionFilters>({
    round: null,
    category: null,
    used: null,
    difficulty: null,
    searchTerm: '',
  });

  // Get all questions from all categories
  const allQuestions = useMemo(() => {
    return categories.flatMap(category => 
      (category.questions || []).map(question => ({
        ...question,
        categoryName: category.name,
        round: category.round,
      }))
    );
  }, [categories]);

  // Apply filters to questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(question => {
      // Round filter
      if (filters.round !== null && filters.round !== undefined && question.round !== filters.round) {
        return false;
      }
      
      // Category filter
      if (filters.category && question.categoryId !== filters.category) {
        return false;
      }
      
      // Used filter
      if (filters.used !== null && filters.used !== undefined) {
        const isUsed = isQuestionUsed ? isQuestionUsed(question.id) : question.used;
        if (isUsed !== filters.used) {
          return false;
        }
      }
      
      // Difficulty filter
      if (filters.difficulty !== null && filters.difficulty !== undefined && question.difficulty !== filters.difficulty) {
        return false;
      }
      
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const textMatch = question.text.toLowerCase().includes(searchLower);
        const answerMatch = question.correctAnswer?.toLowerCase().includes(searchLower);
        const categoryMatch = question.category?.toLowerCase().includes(searchLower) || 
                              categories.find(c => c.id === question.categoryId)?.name.toLowerCase().includes(searchLower);
        
        if (!(textMatch || answerMatch || categoryMatch)) {
          return false;
        }
      }
      
      return true;
    });
  }, [allQuestions, filters, categories, isQuestionUsed]);

  // Function to handle import of questions
  const importQuestions = (data: any) => {
    try {
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        toast.error('Nieprawidłowy format pliku importu');
        return false;
      }

      // Import categories first if they exist
      if (data.categories && Array.isArray(data.categories)) {
        // Check if category already exists by name and round
        data.categories.forEach((importedCategory: any) => {
          const existingCategory = categories.find(
            cat => cat.name === importedCategory.name && cat.round === importedCategory.round
          );
          
          if (!existingCategory) {
            addCategory({
              id: importedCategory.id || uuidv4(),
              name: importedCategory.name,
              round: importedCategory.round,
              questions: []
            });
          }
        });
      }

      // Now import questions
      let importedCount = 0;
      data.questions.forEach((importedQuestion: any) => {
        // Find the category for this question
        const targetCategory = categories.find(cat => 
          cat.id === importedQuestion.categoryId || 
          (importedQuestion.category && cat.name === importedQuestion.category && cat.round === importedQuestion.round)
        );
        
        if (!targetCategory) {
          console.warn(`Nie znaleziono kategorii dla pytania: ${importedQuestion.text}`);
          return;
        }
        
        // Prepare the question object
        const questionToAdd: Question = {
          id: importedQuestion.id || uuidv4(),
          text: importedQuestion.text || '',
          correctAnswer: importedQuestion.correctAnswer || importedQuestion.answer || '',
          categoryId: targetCategory.id,
          difficulty: importedQuestion.difficulty || 1,
          options: importedQuestion.options || null,
          imageUrl: importedQuestion.imageUrl || null,
          used: importedQuestion.used || false,
        };
        
        addQuestion(targetCategory.id, questionToAdd);
        importedCount++;
      });

      // Save changes
      saveGameData();
      toast.success(`Zaimportowano ${importedCount} pytań`);
      return true;
    } catch (error) {
      console.error('Błąd podczas importu pytań:', error);
      toast.error('Wystąpił błąd podczas importu pytań');
      return false;
    }
  };

  // Function to handle export of questions
  const exportQuestions = (exportFiltered: boolean = false) => {
    try {
      const questionsToExport = exportFiltered ? filteredQuestions : allQuestions;
      
      // Get the categories from the questions
      const categoryIds = [...new Set(questionsToExport.map(q => q.categoryId))];
      const categoriesToExport = categories
        .filter(cat => categoryIds.includes(cat.id))
        .map(({ id, name, round }) => ({ id, name, round }));
      
      const exportData = {
        questions: questionsToExport.map(({ categoryName, round, ...rest }) => rest),
        categories: categoriesToExport,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return exportData;
    } catch (error) {
      console.error('Błąd podczas eksportu pytań:', error);
      toast.error('Wystąpił błąd podczas eksportu pytań');
      return null;
    }
  };

  return {
    questions: allQuestions,
    filteredQuestions,
    filters,
    setFilters,
    importQuestions,
    exportQuestions,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed
  };
}
