
import { Question } from '@/types/interfaces';

export const createQuestionWithDefaults = (partialQuestion: Partial<Question>): Question => {
  return {
    id: partialQuestion.id || crypto.randomUUID(),
    text: partialQuestion.text || '',
    category: partialQuestion.category || '',
    categoryId: partialQuestion.categoryId || '',
    difficulty: partialQuestion.difficulty || 1,
    type: partialQuestion.type || 'multiple_choice',
    options: partialQuestion.options || [],
    correctAnswer: partialQuestion.correctAnswer || '',
    timeLimit: partialQuestion.timeLimit || 30,
    points: partialQuestion.points || 10,
    used: partialQuestion.used || false,
    imageUrl: partialQuestion.imageUrl,
    question: partialQuestion.question,
    answer: partialQuestion.answer,
    image_url: partialQuestion.image_url,
    time: partialQuestion.time
  };
};

export const convertGameTypeToInterface = (gameQuestion: any): Question => {
  return createQuestionWithDefaults({
    ...gameQuestion,
    timeLimit: gameQuestion.timeLimit || gameQuestion.time || 30
  });
};
