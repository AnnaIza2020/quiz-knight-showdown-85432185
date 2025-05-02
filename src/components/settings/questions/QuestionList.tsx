
import React from 'react';
import { GameRound } from '@/types/game-types';
import QuestionCard from './QuestionCard';

// Mock data for questions
const mockQuestions = [
  {
    id: "q1",
    category: "Technologia",
    difficulty: 5,
    question: "Co to jest HTML?",
    answer: "Język znaczników",
    options: ["Język programowania", "Rodzaj bazy danych", "Protokół internetowy", "Język znaczników"],
    round: GameRound.ROUND_ONE
  },
  {
    id: "q2",
    category: "MEMY",
    difficulty: 10,
    question: "Kto stworzył pierwszego cyfrowego mema?",
    answer: "Scott Fahlman",
    options: ["Steve Jobs", "Bill Gates", "Mark Zuckerberg", "Scott Fahlman"],
    round: GameRound.ROUND_ONE
  },
  {
    id: "q3",
    category: "Streaming",
    difficulty: 5,
    question: "Z jakiego kraju pochodzi Twitch?",
    answer: "USA",
    options: ["USA", "Japonia", "Chiny", "Niemcy"],
    round: GameRound.ROUND_TWO
  }
];

const QuestionList = () => {
  return (
    <div className="space-y-4">
      {mockQuestions.map((question) => (
        <QuestionCard 
          key={question.id}
          id={question.id}
          category={question.category}
          difficulty={question.difficulty}
          question={question.question}
          answer={question.answer}
          options={question.options}
          round={question.round}
        />
      ))}
    </div>
  );
};

export default QuestionList;
