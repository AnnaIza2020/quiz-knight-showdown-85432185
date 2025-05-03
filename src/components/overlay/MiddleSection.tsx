
import React from 'react';
import { Question, GameRound } from '@/types/game-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FortuneWheel from '@/components/FortuneWheel';
import { Timer } from 'lucide-react';

interface MiddleSectionProps {
  round: GameRound;
  currentQuestion: Question | null;
  timerRunning: boolean;
  timerSeconds: number;
  categories?: string[];
  onCategorySelected?: (category: string) => void;
}

const MiddleSection: React.FC<MiddleSectionProps> = ({
  round,
  currentQuestion,
  timerRunning,
  timerSeconds,
  categories = [],
  onCategorySelected = () => {}
}) => {
  // If it's round 3 and we have categories, show the fortune wheel
  if (round === GameRound.ROUND_THREE && categories.length > 0) {
    return (
      <div className="flex-grow flex flex-col">
        <FortuneWheel
          categories={categories}
          onCategorySelected={onCategorySelected}
        />
      </div>
    );
  }
  
  // Show question display
  if (currentQuestion) {
    // Bezpiecznie pobieramy nazwę kategorii
    const categoryName = currentQuestion.categoryId ? (currentQuestion.category || 'Nieznana kategoria') : 'Nieznana kategoria';
    
    return (
      <Card className="flex-grow flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">
            {categoryName} (Poziom {currentQuestion.difficulty})
          </CardTitle>
          {timerRunning && (
            <div className="flex items-center space-x-1">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">{timerSeconds}s</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <div className="flex-grow flex items-center justify-center p-4 bg-black/30 rounded-lg border border-white/10">
            <p className="text-xl text-center">
              {currentQuestion.text || currentQuestion.question}
            </p>
          </div>
          
          {/* Display answer options if available */}
          {currentQuestion.options && currentQuestion.options.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="p-2 bg-black/20 border border-white/10 rounded-md text-center">
                  {option}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Default empty state
  return (
    <Card className="flex-grow flex flex-col items-center justify-center">
      <CardHeader>
        <CardTitle className="text-center">Discord Game Show</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <p className="text-gray-400">Oczekiwanie na pytanie...</p>
      </CardContent>
    </Card>
  );
};

export default MiddleSection;
