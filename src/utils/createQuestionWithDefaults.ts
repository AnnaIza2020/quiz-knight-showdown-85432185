
import { Question } from '@/types/interfaces';

export const createQuestionWithDefaults = (question: Partial<Question>): Question => {
  return {
    id: question.id || crypto.randomUUID(),
    text: question.text || question.question || '',
    category: question.category || 'Ogólna',
    categoryId: question.categoryId || '',
    difficulty: question.difficulty || 1,
    type: question.type || 'multiple_choice',
    options: question.options || [],
    correctAnswer: question.correctAnswer || question.answer || '',
    timeLimit: question.timeLimit || question.time || 30,
    points: question.points || 10,
    used: question.used || false,
    imageUrl: question.imageUrl || question.image_url,
    ...question
  };
};
