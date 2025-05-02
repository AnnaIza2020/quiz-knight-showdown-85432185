
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QuestionDifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

const QuestionDifficultyBadge: React.FC<QuestionDifficultyBadgeProps> = ({ 
  difficulty,
  className
}) => {
  let color = '';
  
  switch (difficulty) {
    case 5:
      color = 'bg-green-700 hover:bg-green-600';
      break;
    case 10:
      color = 'bg-blue-700 hover:bg-blue-600';
      break;
    case 15:
      color = 'bg-yellow-700 hover:bg-yellow-600';
      break;
    case 20:
      color = 'bg-red-700 hover:bg-red-600';
      break;
    default:
      color = 'bg-gray-700 hover:bg-gray-600';
  }
  
  return (
    <Badge className={cn(color, 'text-white font-medium', className)}>
      {difficulty} pkt
    </Badge>
  );
};

export default QuestionDifficultyBadge;
