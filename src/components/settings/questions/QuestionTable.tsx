
import React from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Question } from '@/types/game-types';

interface QuestionTableProps {
  questions: any[];
  onEdit: (question: any) => void;
  onDelete: (question: any) => void;
  onToggleUsed: (question: any) => void;
}

const QuestionTable: React.FC<QuestionTableProps> = ({
  questions,
  onEdit,
  onDelete,
  onToggleUsed
}) => {
  if (questions.length === 0) {
    return (
      <div className="bg-black/20 p-8 rounded-lg border border-gray-800 text-center">
        <p className="text-white/60">Brak pytań spełniających kryteria wyszukiwania.</p>
      </div>
    );
  }

  const getDifficultyLabel = (difficulty: number) => {
    switch(difficulty) {
      case 1: return { label: 'Łatwy', color: 'bg-green-600' };
      case 2: return { label: 'Średni', color: 'bg-yellow-600' };
      case 3: return { label: 'Trudny', color: 'bg-red-600' };
      default: return { label: 'Nieznany', color: 'bg-gray-600' };
    }
  };

  const getRoundLabel = (round: number) => {
    switch(round) {
      case 1: return { label: 'Runda 1', color: 'bg-blue-600' };
      case 2: return { label: 'Runda 2', color: 'bg-purple-600' };
      case 3: return { label: 'Runda 3', color: 'bg-pink-600' };
      default: return { label: 'Nieznana', color: 'bg-gray-600' };
    }
  };

  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow>
              <TableHead className="text-white w-[50px]">ID</TableHead>
              <TableHead className="text-white">Treść</TableHead>
              <TableHead className="text-white">Odpowiedź</TableHead>
              <TableHead className="text-white">Kategoria</TableHead>
              <TableHead className="text-white w-[100px]">Trudność</TableHead>
              <TableHead className="text-white w-[100px]">Runda</TableHead>
              <TableHead className="text-white w-[80px]">Status</TableHead>
              <TableHead className="text-white w-[150px] text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => {
              const difficulty = getDifficultyLabel(question.difficulty);
              const round = getRoundLabel(question.round);
              const isUsed = question.used;

              return (
                <TableRow 
                  key={question.id} 
                  className="border-t border-gray-800 bg-black/20 hover:bg-black/30"
                >
                  <TableCell className="font-mono text-xs text-gray-400">
                    {question.id.substring(0, 6)}...
                  </TableCell>
                  <TableCell className="font-medium text-white max-w-[300px] truncate">
                    {question.text}
                  </TableCell>
                  <TableCell className="text-green-400 max-w-[200px] truncate">
                    {question.correctAnswer}
                  </TableCell>
                  <TableCell className="text-blue-300">
                    {question.categoryName || 
                     (question.category || 'Brak kategorii')}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${difficulty.color} text-white`}>
                      {difficulty.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${round.color} text-white`}>
                      {round.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`rounded-full ${isUsed ? 'bg-red-900/20 text-red-400' : 'bg-green-900/20 text-green-400'}`}
                      onClick={() => onToggleUsed(question)}
                    >
                      {isUsed ? <X size={16} /> : <Check size={16} />}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-blue-900/20 text-blue-400 hover:text-blue-100"
                        onClick={() => onEdit(question)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-red-900/20 text-red-400 hover:text-red-100"
                        onClick={() => onDelete(question)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QuestionTable;
