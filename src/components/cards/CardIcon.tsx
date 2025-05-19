
import React from 'react';
import { 
  Repeat, 
  ArrowRightLeft, 
  Heart, 
  SkipForward, 
  Zap, 
  Clock, 
  Eye, 
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

interface CardIconProps {
  name: string;  // This is the prop we're using
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
    case 'pomiń':
      return <SkipForward className={className} size={size} />;
    case 'turbo':
    case 'boost':
      return <Zap className={className} size={size} />;
    case 'refleks':
    case 'refleks 2':
    case 'refleks 3':
      return <Clock className={className} size={size} />;
    case 'lustro':
    case 'mirror':
      return <Eye className={className} size={size} />;
    case 'oświecenie':
    case 'enlightenment':
      return <Lightbulb className={className} size={size} />;
    case 'tarcza':
    case 'shield':
      return <ShieldCheck className={className} size={size} />;
    default:
      // Default icon for unknown cards
      return <Zap className={className} size={size} />;
  }
};

export default CardIcon;
