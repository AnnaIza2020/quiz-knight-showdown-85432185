
import { Question } from '@/types/game-types';
import { v4 as uuidv4 } from 'uuid';

export const createQuestionWithDefaults = (
  partialQuestion: Partial<Question>
): Question => {
  return {
    id: partialQuestion.id || uuidv4(),
    text: partialQuestion.text || partialQuestion.question || '',
    correctAnswer: partialQuestion.correctAnswer || partialQuestion.answer || '',
    categoryId: partialQuestion.categoryId || '',
    options: partialQuestion.options || [],
    difficulty: partialQuestion.difficulty || 1,
    imageUrl: partialQuestion.imageUrl || partialQuestion.image_url || '',
    points: partialQuestion.points || 10,
    time: partialQuestion.time || 30,
    used: partialQuestion.used || false,
    type: partialQuestion.type || 'multiple_choice',
    // Backward compatibility fields
    category: partialQuestion.category || '',
    question: partialQuestion.question || partialQuestion.text || '',
    answer: partialQuestion.answer || partialQuestion.correctAnswer || '',
    image_url: partialQuestion.imageUrl || partialQuestion.image_url || ''
  };
};

export const validateQuestion = (question: Partial<Question>): string[] => {
  const errors: string[] = [];
  
  if (!question.text && !question.question) {
    errors.push('Pytanie musi mieć treść');
  }
  
  if (!question.correctAnswer && !question.answer) {
    errors.push('Pytanie musi mieć poprawną odpowiedź');
  }
  
  if (!question.categoryId) {
    errors.push('Pytanie musi być przypisane do kategorii');
  }
  
  if (question.type === 'multiple_choice' && (!question.options || question.options.length < 2)) {
    errors.push('Pytanie wielokrotnego wyboru musi mieć przynajmniej dwie opcje');
  }
  
  return errors;
};
