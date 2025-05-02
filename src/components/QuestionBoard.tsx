
import React from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';
import { Question, Category, GameRound } from '@/types/game-types';

interface QuestionBoardProps {
  className?: string;
}

const QuestionBoard: React.FC<QuestionBoardProps> = ({ className }) => {
  const { 
    round, 
    categories, 
    currentQuestion, 
    selectQuestion 
  } = useGameContext();

  if (!categories.length) {
    return (
      <div className={cn('neon-card flex flex-col items-center justify-center h-full', className)}>
        <p className="text-xl text-white/80">Brak dostępnych pytań</p>
        <p className="text-sm text-white/60 mt-2">Dodaj kategorie i pytania w panelu ustawień</p>
      </div>
    );
  }

  // Display currently selected question if one is active
  if (currentQuestion) {
    return (
      <div className={cn('neon-card flex flex-col h-full', className)}>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <span className="text-neon-blue font-semibold">{currentQuestion.category}</span>
            <span className="ml-2 text-white/70">({currentQuestion.difficulty} pkt)</span>
          </div>
          <button 
            onClick={() => selectQuestion(null)} 
            className="text-neon-red hover:text-neon-pink"
          >
            Zamknij
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center p-4">
          {currentQuestion.imageUrl && (
            <div className="mb-4 w-full max-h-48 overflow-hidden">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Question" 
                className="w-full h-auto object-contain" 
              />
            </div>
          )}
          
          <div className="text-xl text-center font-bold my-4 text-white">
            {currentQuestion.question}
          </div>
          
          {currentQuestion.options && (
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="bg-black/30 border border-neon-blue/30 rounded p-2 text-center">
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-2">
          <div className="text-neon-green text-center p-1">
            <span className="font-bold mr-2">Odpowiedź:</span>
            <span>{currentQuestion.answer}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show categories for round 1
  if (round === GameRound.ROUND_ONE) {
    return (
      <div className={cn('neon-card h-full', className)}>
        <h2 className="text-center text-lg font-bold mb-4 neon-text">Runda 1: Zróżnicowana wiedza z Internetu</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col">
              <div className="text-center text-neon-blue font-semibold mb-2 truncate">
                {category.name}
              </div>
              <div className="flex flex-col gap-2">
                {[5, 10, 15, 20].map((difficulty) => {
                  const questionsWithDifficulty = category.questions.filter(
                    (q) => q.difficulty === difficulty
                  );
                  
                  const isAvailable = questionsWithDifficulty.length > 0;
                  
                  return (
                    <button
                      key={`${category.id}-${difficulty}`}
                      className={cn(
                        'py-2 px-1 rounded-md font-bold text-center transition-all',
                        isAvailable
                          ? 'bg-black border border-neon-yellow/70 text-neon-yellow hover:bg-neon-yellow/20'
                          : 'bg-black/30 border border-white/20 text-white/30 cursor-not-allowed'
                      )}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) {
                          // Randomly select a question with this difficulty
                          const randomIndex = Math.floor(Math.random() * questionsWithDifficulty.length);
                          selectQuestion(questionsWithDifficulty[randomIndex]);
                        }
                      }}
                    >
                      {difficulty}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Show categories for round 3 (koło fortuny)
  if (round === GameRound.ROUND_THREE) {
    return (
      <div className={cn('neon-card h-full', className)}>
        <h2 className="text-center text-lg font-bold mb-4 neon-text">Runda 3: Koło Fortuny</h2>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className="bg-black border border-neon-purple/70 text-neon-purple hover:bg-neon-purple/20 py-2 px-3 rounded-md font-bold"
              onClick={() => {
                if (category.questions.length > 0) {
                  // Randomly select a question from this category
                  const randomIndex = Math.floor(Math.random() * category.questions.length);
                  selectQuestion(category.questions[randomIndex]);
                }
              }}
              disabled={category.questions.length === 0}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Show 5-second round interface for round 2
  if (round === GameRound.ROUND_TWO) {
    return (
      <div className={cn('neon-card h-full flex flex-col', className)}>
        <h2 className="text-center text-lg font-bold mb-4 neon-text">Runda 2: 5 Sekund</h2>
        
        <div className="flex-grow flex flex-col gap-4 items-center justify-center">
          <button
            className="neon-button text-xl py-3 px-6"
            onClick={() => {
              // Randomly select a category
              const randomCategoryIndex = Math.floor(Math.random() * categories.length);
              const randomCategory = categories[randomCategoryIndex];
              
              // Randomly select a question from that category
              if (randomCategory.questions.length > 0) {
                const randomQuestionIndex = Math.floor(Math.random() * randomCategory.questions.length);
                selectQuestion(randomCategory.questions[randomQuestionIndex]);
              }
            }}
          >
            Losowe Pytanie
          </button>
          
          <p className="text-white/70 text-center">
            Kliknij przycisk, aby wylosować pytanie dla aktywnego gracza
          </p>
        </div>
      </div>
    );
  }
  
  // Default board for other rounds
  return (
    <div className={cn('neon-card h-full flex items-center justify-center', className)}>
      <p className="text-xl text-white/80 text-center">
        Przygotuj się do gry...
      </p>
    </div>
  );
};

export default QuestionBoard;
