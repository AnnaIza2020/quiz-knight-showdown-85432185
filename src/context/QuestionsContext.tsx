
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { Question, Category, GameRound } from '@/types/game-types';
import { toast } from 'sonner';
import { useGameContext } from './GameContext';

// Define the Questions Context type
interface QuestionsContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  currentQuestion: Question | null;
  usedQuestionIds: string[];
  
  // Questions methods
  selectQuestion: (question: Question | null) => void;
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, updatedQuestion: Question) => void;
  markQuestionAsUsed: (questionId: string) => Promise<{ success: boolean }>;
  resetUsedQuestions: () => Promise<{ success: boolean }>;
  isQuestionUsed: (questionId: string) => boolean;
  
  // Helper methods
  findQuestionById: (questionId: string) => Question | null;
  findCategoryByQuestionId: (questionId: string) => Category | null;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestionsContext must be used within a QuestionsProvider');
  }
  return context;
};

interface QuestionsProviderProps {
  children: ReactNode;
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ children }) => {
  // Get game context data
  const gameCtx = useGameContext();
  
  // Access properties from gameCtx
  const categories = gameCtx.categories || [];
  const setCategories = gameCtx.setCategories || (() => {});
  const currentQuestion = gameCtx.currentQuestion || null;
  const selectQuestion = gameCtx.selectQuestion || (() => {});
  const usedQuestionIds = gameCtx.usedQuestionIds || [];
  const markQuestionAsUsed = gameCtx.markQuestionAsUsed || (() => Promise.resolve({ success: true }));
  const resetUsedQuestions = gameCtx.resetUsedQuestions || (() => Promise.resolve({ success: true }));
  const isQuestionUsed = gameCtx.isQuestionUsed || (() => false);

  // Helper to find a question by id across all categories
  const findQuestionById = useCallback((questionId: string): Question | null => {
    for (const category of categories) {
      const question = category.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return null;
  }, [categories]);

  // Helper to find category containing a specific question
  const findCategoryByQuestionId = useCallback((questionId: string): Category | null => {
    const category = categories.find(cat => 
      cat.questions.some(q => q.id === questionId)
    );
    return category || null;
  }, [categories]);

  // Question management
  const addQuestion = useCallback((categoryId: string, question: Question) => {
    const categoryExists = categories.some(cat => cat.id === categoryId);
    if (!categoryExists) {
      toast.error(`Kategoria o ID ${categoryId} nie istnieje`);
      return;
    }

    // Make sure the question has required fields
    if (!question.id) {
      question.id = crypto.randomUUID();
    }

    setCategories((prevCategories: Category[]) => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: [...category.questions, question]
          };
        }
        return category;
      });
    });

    toast.success(`Dodano pytanie do kategorii "${categories.find(c => c.id === categoryId)?.name}"`);
  }, [categories, setCategories]);

  const removeQuestion = useCallback((categoryId: string, questionId: string) => {
    setCategories((prevCategories: Category[]) => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: category.questions.filter(q => q.id !== questionId)
          };
        }
        return category;
      });
    });
  }, [setCategories]);

  const updateQuestion = useCallback((categoryId: string, updatedQuestion: Question) => {
    setCategories((prevCategories: Category[]) => {
      return prevCategories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            questions: category.questions.map(q => 
              q.id === updatedQuestion.id ? updatedQuestion : q
            )
          };
        }
        return category;
      });
    });
  }, [setCategories]);

  const value: QuestionsContextType = {
    categories,
    setCategories,
    currentQuestion,
    usedQuestionIds,
    selectQuestion,
    addQuestion,
    removeQuestion,
    updateQuestion,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    findQuestionById,
    findCategoryByQuestionId
  };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
};
