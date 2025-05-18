
import React from 'react';
import { 
  Repeat, 
  ArrowRightLeft, 
  Heart, 
  SkipForward, 
  Zap, 
  Clock, 
  Eye, 
  Lightbulb 
} from 'lucide-react';

interface CardIconProps {
  name: string;
  className?: string;
  size?: number;
}

const CardIcon: React.FC<CardIconProps> = ({ name, className = '', size = 20 }) => {
  // Map card names to icon components
  switch (name.toLowerCase()) {
    case 'dejavu':
      return <Repeat className={className} size={size} />;
    case 'kontra':
      return <ArrowRightLeft className={className} size={size} />;
    case 'reanimacja':
      return <Heart className={className} size={size} />;
    case 'skip':
      return <SkipForward className={className} size={size} />;
    case 'turbo':
      return <Zap className={className} size={size} />;
    case 'refleks 2':
    case 'refleks 3':
    case 'refleks':
      return <Clock className={className} size={size} />;
    case 'lustro':
      return <Eye className={className} size={size} />;
    case 'oświecenie':
      return <Lightbulb className={className} size={size} />;
    default:
      // Default icon for unknown cards
      return <Zap className={className} size={size} />;
  }
};

export default CardIcon;
