
import React, { createContext, useContext, ReactNode } from 'react';
import { Question, Category } from '@/types/game-types';
import { useGameStateManagement } from '@/hooks/useGameStateManagement';

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
  markQuestionAsUsed: (questionId: string) => void;
  resetUsedQuestions: () => void;
  isQuestionUsed: (questionId: string) => boolean;
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
  gameState: ReturnType<typeof useGameStateManagement>;
  usedQuestionIds: string[];
  markQuestionAsUsed: (questionId: string) => void;
  resetUsedQuestions: () => void;
  isQuestionUsed: (questionId: string) => boolean;
}

export const QuestionsProvider: React.FC<QuestionsProviderProps> = ({ 
  children, 
  gameState,
  usedQuestionIds,
  markQuestionAsUsed,
  resetUsedQuestions,
  isQuestionUsed
}) => {
  const { categories, setCategories, currentQuestion, selectQuestion } = gameState;

  // Question management
  const addQuestion = (categoryId: string, question: Question) => {
    setCategories(prevCategories => {
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
  };

  const removeQuestion = (categoryId: string, questionId: string) => {
    setCategories(prevCategories => {
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
  };

  const updateQuestion = (categoryId: string, updatedQuestion: Question) => {
    setCategories(prevCategories => {
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
  };

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
    isQuestionUsed
  };

  return <QuestionsContext.Provider value={value}>{children}</QuestionsContext.Provider>;
};
