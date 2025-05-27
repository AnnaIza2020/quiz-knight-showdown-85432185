
import { Question, Category } from '@/types/interfaces';

export const defaultCategories: Category[] = [
  { id: 'memes', name: 'Memy', round: 1, color: '#FF3E9D' },
  { id: 'virale', name: 'Virale/Easter Eggi', round: 1, color: '#00FFA3' },
  { id: 'youtube', name: 'YouTube', round: 1, color: '#00E0FF' },
  { id: 'gaming', name: 'Gry i Gaming', round: 1, color: '#8B5CF6' },
  { id: 'top-roku', name: 'Top Roku', round: 1, color: '#FFA500' },
  { id: 'wiedza-ogolna', name: 'Wiedza Ogólna', round: 1, color: '#FF6B6B' },
  { id: 'pytania-pulapki', name: 'Pytania Pułapki', round: 1, color: '#4ECDC4' },
];

export const defaultQuestions: Question[] = [
  // Memy - 5 punktów
  {
    id: 'meme-1',
    text: 'Jakie zwierzę jest bohaterem memu "Doge"?',
    category: 'Memy',
    categoryId: 'memes',
    difficulty: 5,
    type: 'open',
    correctAnswer: 'Shiba Inu',
    timeLimit: 30,
    points: 5
  },
  {
    id: 'meme-2',
    text: 'Dokończ popularny mem: "To jest..."',
    category: 'Memy',
    categoryId: 'memes',
    difficulty: 5,
    type: 'open',
    correctAnswer: 'Patrick',
    timeLimit: 30,
    points: 5
  },
  
  // YouTube - 10 punktów
  {
    id: 'youtube-1',
    text: 'Kto jest najsubskrybowanym polskim YouTuberem?',
    category: 'YouTube',
    categoryId: 'youtube',
    difficulty: 10,
    type: 'multiple_choice',
    options: ['ReZigiusz', 'Blowek', 'Eleven', 'MineCrafter'],
    correctAnswer: 'ReZigiusz',
    timeLimit: 30,
    points: 10
  },
  
  // Gaming - 15 punktów
  {
    id: 'gaming-1',
    text: 'W którym roku została wydana gra Wiedźmin 3?',
    category: 'Gry i Gaming',
    categoryId: 'gaming',
    difficulty: 15,
    type: 'multiple_choice',
    options: ['2014', '2015', '2016', '2017'],
    correctAnswer: '2015',
    timeLimit: 30,
    points: 15
  },
  
  // Wiedza Ogólna - 20 punktów
  {
    id: 'wiedza-1',
    text: 'Ile województw ma Polska?',
    category: 'Wiedza Ogólna',
    categoryId: 'wiedza-ogolna',
    difficulty: 20,
    type: 'multiple_choice',
    options: ['14', '15', '16', '17'],
    correctAnswer: '16',
    timeLimit: 30,
    points: 20
  }
];
