
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Edit, Trash2 } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import QuestionDifficultyBadge from './QuestionDifficultyBadge';

const CATEGORY_COLORS: Record<string, string> = {
  "WIEDZA OGÓLNA": "bg-blue-600",
  "MEMY": "bg-purple-600",
  "TRENDY": "bg-pink-600",
  "TWITCH": "bg-violet-600",
  "INTERNET": "bg-indigo-600",
  "CIEKAWOSTKI": "bg-cyan-600",
  "GRY": "bg-emerald-600",
  "FILMY": "bg-yellow-600", 
  "MUZYKA": "bg-red-600",
  "SPORT": "bg-green-600",
  "Technologia": "bg-teal-600",
  "Streaming": "bg-orange-600",
};

interface QuestionCardProps {
  id: string;
  category: string;
  difficulty: number;
  question: string;
  answer: string;
  options?: string[];
  round: GameRound;
}

const QuestionCard = ({ 
  id,
  category, 
  difficulty, 
  question, 
  answer, 
  options = [],
  round
}: QuestionCardProps) => {
  return (
    <div className="bg-black/40 border border-gray-800 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex gap-2">
          <QuestionDifficultyBadge difficulty={difficulty} />
          <Badge className={`${CATEGORY_COLORS[category] || 'bg-gray-600'} text-white`}>
            {category}
          </Badge>
          <Badge className="bg-blue-600 text-white">
            {round === GameRound.ROUND_ONE ? 'Runda 1' : 
             round === GameRound.ROUND_TWO ? 'Runda 2' : 'Runda 3'}
          </Badge>
        </div>
        <Button size="icon" variant="ghost">
          <Star size={18} className="text-gray-400" />
        </Button>
      </div>
      
      <div className="px-4 py-3">
        <h4 className="text-white font-medium mb-2">{question}</h4>
        
        <div className="grid grid-cols-2 gap-2">
          {options?.map((option, index) => (
            <div 
              key={index}
              className={`p-2 rounded ${option === answer ? 'bg-green-900/30 border border-green-600/50' : 'bg-black/50 border border-gray-700'}`}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-2 p-2 bg-black/30">
        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/30">
          <Edit size={16} />
        </Button>
        <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/30">
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default QuestionCard;
