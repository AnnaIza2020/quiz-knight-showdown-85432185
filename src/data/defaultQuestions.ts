
import { Question, Category } from '@/types/interfaces';

export const defaultQuestions: Question[] = [
  {
    id: '1',
    text: 'Jaka jest stolica Polski?',
    category: 'Geografia',
    categoryId: 'geography',
    difficulty: 1,
    type: 'multiple_choice',
    options: ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław'],
    correctAnswer: 'Warszawa',
    timeLimit: 30,
    points: 10
  },
  {
    id: '2',
    text: 'Ile to 2 + 2?',
    category: 'Matematyka',
    categoryId: 'math',
    difficulty: 1,
    type: 'text',
    options: [],
    correctAnswer: '4',
    timeLimit: 30,
    points: 5
  },
  {
    id: '3',
    text: 'Czy Ziemia jest płaska?',
    category: 'Nauka',
    categoryId: 'science',
    difficulty: 1,
    type: 'true_false',
    options: ['Tak', 'Nie'],
    correctAnswer: 'Nie',
    timeLimit: 30,
    points: 5
  }
];

export const defaultCategories: Category[] = [
  {
    id: 'geography',
    name: 'Geografia',
    description: 'Pytania z geografii',
    round: 1,
    questions: [defaultQuestions[0]]
  },
  {
    id: 'math',
    name: 'Matematyka',
    description: 'Pytania z matematyki',
    round: 1,
    questions: [defaultQuestions[1]]
  },
  {
    id: 'science',
    name: 'Nauka',
    description: 'Pytania naukowe',
    round: 1,
    questions: [defaultQuestions[2]]
  }
];
