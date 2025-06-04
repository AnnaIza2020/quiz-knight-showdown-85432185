
import { useCallback } from 'react';
import { Question } from '@/types/interfaces';
import { QuestionImportExport } from '@/types/questions-types';
import { toast } from 'sonner';

/**
 * Hook for managing questions import and export functionality
 */
export const useQuestionsImportExport = (
  questions: Question[],
  filteredQuestions: Question[],
  categories: any[],
  addQuestion: (categoryId: string, question: Question) => void,
  updateQuestion: (categoryId: string, question: Question) => void,
  saveGameData: () => Promise<any>
) => {
  // Import questions from JSON
  const importQuestions = useCallback((data: QuestionImportExport): boolean => {
    try {
      if (!data || !data.questions || !Array.isArray(data.questions)) {
        toast.error('Nieprawidłowy format danych');
        return false;
      }
      
      let created = 0;
      let updated = 0;
      let errors = 0;
      
      data.questions.forEach((question) => {
        try {
          const { categoryId } = question;
          if (!categoryId) {
            errors++;
            return;
          }
          
          const questionWithRequiredFields: Question = {
            ...question,
            category: question.category || 'Unknown',
            timeLimit: question.timeLimit || question.time || 30,
            type: question.type || 'multiple_choice',
            points: question.points || 10
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
      return {
        questions: [],
        categories: [],
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
    }
  }, [filteredQuestions, questions, categories]);

  return {
    importQuestions,
    exportQuestions
  };
};
