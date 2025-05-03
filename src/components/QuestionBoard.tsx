
import React, { useEffect } from 'react';
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

const QuestionBoard: React.FC<QuestionBoardProps> = ({
  question,
  timeRemaining,
  onCorrectAnswer,
  onIncorrectAnswer,
  onSkip,
  className
}) => {
  const { playSound, timerRunning } = useGameContext();
  
  // Sound effect when time is running low
  useEffect(() => {
    if (timeRemaining && timeRemaining <= 5 && timeRemaining > 0 && timerRunning) {
      playSound('wheel-tick', 0.3);
    } else if (timeRemaining === 0 && timerRunning) {
      playSound('timeout');
      toast.error('Czas minął!');
    }
  }, [timeRemaining, timerRunning, playSound]);

  if (!question) {
    return (
      <Card className={`w-full h-full flex items-center justify-center ${className || ''}`}>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Wybierz pytanie z listy</p>
        </CardContent>
      </Card>
    );
  }

  // Get category name (safely)
  const categoryName = question.categoryId ? (question.category || 'Nieznana kategoria') : 'Nieznana kategoria';

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
              <Hourglass className="h-5 w-5" />
              {timeRemaining}s
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
          <p className="text-lg">{question.text || question.question}</p>
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
            {question.correctAnswer || question.answer}
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
};

export default QuestionBoard;
