
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuestionDifficultyBadgeProps {
  difficulty: number;
}

const QuestionDifficultyBadge = ({ difficulty }: QuestionDifficultyBadgeProps) => {
  let color = "bg-gray-600";
  let label = "Nieznana";
  
  if (difficulty === 5) {
    color = "bg-green-600";
    label = "Łatwe (5 pkt)";
  } else if (difficulty === 10) {
    color = "bg-yellow-600";
    label = "Średnie (10 pkt)";
  } else if (difficulty === 15) {
    color = "bg-orange-600";
    label = "Trudne (15 pkt)";
  } else if (difficulty === 20) {
    color = "bg-red-600";
    label = "Ekstremalne (20 pkt)";
  }
  
  return (
    <Badge className={`${color} text-white text-xs`}>
      {label}
    </Badge>
  );
};

export default QuestionDifficultyBadge;
