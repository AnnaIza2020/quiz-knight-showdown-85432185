
import React from 'react';
import { Question } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ToggleRight } from 'lucide-react';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

interface QuestionTableProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onToggleUsed?: (questionId: string) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ 
  questions, 
  onEdit, 
  onDelete,
  onToggleUsed
}) => {
  if (questions.length === 0) {
    return <p className="text-center text-muted-foreground">Brak pytań w tej kategorii</p>;
  }
  
  return (
    <div className="bg-black/20 rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4 text-left font-medium">Pytanie</th>
              <th className="py-2 px-4 text-left font-medium">Odpowiedź</th>
              <th className="py-2 px-4 text-left font-medium">Trudność</th>
              <th className="py-2 px-4 text-right font-medium">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-b border-gray-800">
                <td className="py-3 px-4">
                  <div className="line-clamp-2">
                    {question.text || question.question}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="line-clamp-1">
                    {question.correctAnswer || question.answer}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <QuestionDifficultyBadge difficulty={question.difficulty} />
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive"
                      onClick={() => onDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {onToggleUsed && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary"
                        onClick={() => onToggleUsed(question.id)}
                      >
                        <ToggleRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionTable;
