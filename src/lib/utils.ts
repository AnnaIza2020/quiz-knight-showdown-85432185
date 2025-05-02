
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class values into a single string using clsx and tailwind-merge
 * Useful for conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random ID string
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Formats a date in Polish format
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Delay execution for specified milliseconds
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = <T>(json: string | null, fallback: T): T => {
  if (!json) return fallback;
  try {
    return JSON.parse(json) as T;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
};

/**
 * Play animation on element
 * @param element Element to animate
 * @param animationName Animation name (from @keyframes)
 * @param duration Animation duration in ms
 * @returns Promise that resolves when animation ends
 */
export const playAnimation = (
  element: HTMLElement, 
  animationName: string, 
  duration: number = 1000
): Promise<void> => {
  return new Promise((resolve) => {
    element.style.animation = `${animationName} ${duration}ms`;
    
    const handleAnimationEnd = () => {
      element.style.animation = '';
      element.removeEventListener('animationend', handleAnimationEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleAnimationEnd);
  });
};

/**
 * Generate random question from available questions
 * @param questions Array of all questions
 * @param usedQuestionIds Array of used question ids
 * @param filters Optional filters (category, difficulty)
 * @returns Random question or null if no questions available
 */
export const getRandomQuestion = <T extends { id: string; category?: string; difficulty?: number }>(
  questions: T[],
  usedQuestionIds: string[] = [],
  filters?: { category?: string; difficulty?: number }
) => {
  // Filter out used questions and apply optional filters
  const availableQuestions = questions.filter(q => {
    if (usedQuestionIds.includes(q.id)) return false;
    if (filters?.category && q.category !== filters.category) return false;
    if (filters?.difficulty && q.difficulty !== filters.difficulty) return false;
    return true;
  });
  
  // Return random question or null if none available
  if (availableQuestions.length === 0) return null;
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
};
