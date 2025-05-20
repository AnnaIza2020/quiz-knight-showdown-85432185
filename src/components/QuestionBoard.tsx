
import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from '@/types/game-types';
import { Hourglass, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';

export interface QuestionBoardProps {
  question?: Question | null;
  timeRemaining?: number;
  onCorrectAnswer?: () => void;
  onIncorrectAnswer?: () => void;
  onSkip?: () => void;
  className?: string;
}

// Używamy memo do optymalizacji renderowania komponentu
const QuestionBoard: React.FC<QuestionBoardProps> = React.memo(({
  question,
  timeRemaining,
  onCorrectAnswer,
  onIncorrectAnswer,
  onSkip,
  className
}) => {
  const { playSound, timerRunning } = useGameContext();
  
  // Memo-izowane obliczanie kategorii
  const categoryName = useMemo(() => {
    if (!question) return '';
    // Use category from the question if available, otherwise infer from categoryId
    return question.category || (question.categoryId ? 'Nieznana kategoria' : 'Nieznana kategoria');
  }, [question]);
  
  // Efekt dźwiękowy dla timera
  useEffect(() => {
    // Okienka czasowe dla efektu dźwiękowego
    const shouldPlayTickSound = 
      timeRemaining !== undefined && 
      timeRemaining <= 5 && 
      timeRemaining > 0 && 
      timerRunning;
      
    const shouldPlayTimeoutSound = 
      timeRemaining === 0 && 
      timerRunning;
    
    if (shouldPlayTickSound) {
      // Throttling efektu dźwiękowego (tylko co sekundę)
      playSound('wheel-tick', 0.3);
    } else if (shouldPlayTimeoutSound) {
      playSound('timeout');
      toast.error('Czas minął!');
    }
  }, [timeRemaining, timerRunning, playSound]);

  // Jeśli nie ma pytania, wyświetl placeholder
  if (!question) {
    return (
      <Card className={`w-full h-full flex items-center justify-center ${className || ''}`}>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Wybierz pytanie z listy</p>
        </CardContent>
      </Card>
    );
  }

  // Get the question text from either text or question field
  const questionText = question.text || question.question || '';

  return (
    <Card className={`w-full ${className || ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Pytanie</CardTitle>
            <CardDescription>{categoryName} - Poziom {question.difficulty}</CardDescription>
          </div>
          {timeRemaining !== undefined && (
            <div className="flex items-center gap-2 text-lg font-bold">
              <Hourglass className={`h-5 w-5 ${timeRemaining <= 5 && timeRemaining > 0 ? 'animate-pulse text-orange-400' : ''}`} />
              <span className={timeRemaining <= 5 && timeRemaining > 0 ? 'text-orange-400' : ''}>{timeRemaining}s</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
          <p className="text-lg">{questionText}</p>
        </div>
        
        {question.options && question.options.length > 0 && (
          <div className="space-y-2">
            <p className="font-semibold text-sm">Opcje:</p>
            <ul className="list-disc pl-6">
              {question.options.map((option, index) => (
                <li key={index} className="text-sm">{option}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div>
          <p className="font-semibold text-sm mb-1">Poprawna odpowiedź:</p>
          <p className="p-2 bg-green-500/20 rounded border border-green-500/40">
            {question.correctAnswer || question.answer || ''}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onSkip && (
          <Button variant="outline" onClick={onSkip}>
            Pomiń
          </Button>
        )}
        {onIncorrectAnswer && (
          <Button variant="destructive" onClick={onIncorrectAnswer}>
            <X className="mr-1 h-4 w-4" />
            Błędnie
          </Button>
        )}
        {onCorrectAnswer && (
          <Button variant="secondary" className="bg-green-600 hover:bg-green-700 text-white" onClick={onCorrectAnswer}>
            <Check className="mr-1 h-4 w-4" />
            Poprawnie
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

QuestionBoard.displayName = 'QuestionBoard';

export default QuestionBoard;
