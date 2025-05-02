
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface QuestionDifficultyBadgeProps {
  difficulty: number;
}

const QuestionDifficultyBadge = ({ difficulty }: QuestionDifficultyBadgeProps) => {
  const getColorClass = () => {
    switch (difficulty) {
      case 5:
        return "bg-green-600 hover:bg-green-700";
      case 10:
        return "bg-yellow-600 hover:bg-yellow-700";
      case 15:
        return "bg-orange-600 hover:bg-orange-700";
      case 20:
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getLabel = () => {
    switch (difficulty) {
      case 5:
        return "Łatwe (5 pkt)";
      case 10:
        return "Średnie (10 pkt)";
      case 15:
        return "Trudne (15 pkt)";
      case 20:
        return "Ekstremalne (20 pkt)";
      default:
        return "Nieznana";
    }
  };
  
  return (
    <Badge className={`${getColorClass()} text-white text-xs transition-colors`}>
      {getLabel()}
    </Badge>
  );
};

export default QuestionDifficultyBadge;
