
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question, Category } from '@/types/interfaces';

interface QuestionsContextType {
  usedQuestions: string[];
  usedQuestionIds: string[];
  categories: Category[];
  markQuestionAsUsed: (questionId: string) => void;
  resetUsedQuestions: () => void;
  isQuestionUsed: (questionId: string) => boolean;
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, question: Question) => void;
  findCategoryByQuestionId: (questionId: string) => Category | undefined;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestionsContext must be used within a QuestionsContextProvider');
  }
  return context;
};

interface QuestionsContextProviderProps {
  children: ReactNode;
}

export const QuestionsContextProvider: React.FC<QuestionsContextProviderProps> = ({ children }) => {
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const markQuestionAsUsed = (questionId: string) => {
    setUsedQuestions(prev => [...prev, questionId]);
  };

  const resetUsedQuestions = () => {
    setUsedQuestions([]);
  };

  const isQuestionUsed = (questionId: string) => {
    return usedQuestions.includes(questionId);
  };

  const addQuestion = (categoryId: string, question: Question) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          questions: [...(cat.questions || []), question]
        };
      }
      return cat;
    }));
  };

  const removeQuestion = (categoryId: string, questionId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          questions: (cat.questions || []).filter(q => q.id !== questionId)
        };
      }
      return cat;
    }));
  };

  const updateQuestion = (categoryId: string, question: Question) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        const existingQuestions = cat.questions || [];
        const questionExists = existingQuestions.some(q => q.id === question.id);
        
        if (questionExists) {
          return {
            ...cat,
            questions: existingQuestions.map(q => q.id === question.id ? question : q)
          };
        } else {
          return {
            ...cat,
            questions: [...existingQuestions, question]
          };
        }
      }
      return cat;
    }));
  };

  const findCategoryByQuestionId = (questionId: string): Category | undefined => {
    return categories.find(cat => 
      cat.questions?.some(q => q.id === questionId)
    );
  };

  const value: QuestionsContextType = {
    usedQuestions,
    usedQuestionIds: usedQuestions,
    categories,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    addQuestion,
    removeQuestion,
    updateQuestion,
    findCategoryByQuestionId
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
