
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Question } from '@/types/interfaces';

interface QuestionsContextType {
  usedQuestions: string[];
  markQuestionAsUsed: (questionId: string) => void;
  resetUsedQuestions: () => void;
  isQuestionUsed: (questionId: string) => boolean;
  addQuestion: (categoryId: string, question: Question) => void;
  removeQuestion: (categoryId: string, questionId: string) => void;
  updateQuestion: (categoryId: string, question: Question) => void;
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
    console.log(`Adding question to category ${categoryId}:`, question);
  };

  const removeQuestion = (categoryId: string, questionId: string) => {
    console.log(`Removing question ${questionId} from category ${categoryId}`);
  };

  const updateQuestion = (categoryId: string, question: Question) => {
    console.log(`Updating question in category ${categoryId}:`, question);
  };

  const value: QuestionsContextType = {
    usedQuestions,
    markQuestionAsUsed,
    resetUsedQuestions,
    isQuestionUsed,
    addQuestion,
    removeQuestion,
    updateQuestion
  };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
};
