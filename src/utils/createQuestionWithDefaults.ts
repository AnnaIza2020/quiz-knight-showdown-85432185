
import { Question } from '@/types/game-types';

/**
 * Utility function to create a question with default values
 * Ensures that all required properties are always set
 */
export function createQuestionWithDefaults(questionData: Partial<Question>): Question {
  return {
    id: questionData.id || crypto.randomUUID(),
    text: questionData.text || '',
    correctAnswer: questionData.correctAnswer || '',
    categoryId: questionData.categoryId || '',
    difficulty: questionData.difficulty || 100,
    options: questionData.options || [],
    category: questionData.category,
    question: questionData.question || questionData.text,
    answer: questionData.answer || questionData.correctAnswer,
    image_url: questionData.image_url
  };
}
