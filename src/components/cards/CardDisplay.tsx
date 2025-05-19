
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SpecialCard, CardSize } from '@/types/game-types';
import CardIcon from './CardIcon';

interface CardDisplayProps {
  card: SpecialCard;
  size?: CardSize;
  showDescription?: boolean;
  className?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({ 
  card, 
  size = "medium", 
  showDescription = false,
  className
}) => {
  // Get appropriate sizing based on the size prop
  const getSizing = () => {
    switch (size) {
      case "tiny":
        return {
          width: "w-8",
          height: "h-12",
          iconSize: 16,
          fontSize: "text-xs",
          nameVisible: false
        };
      case "small":
        return {
          width: "w-14",
          height: "h-20",
          iconSize: 24,
          fontSize: "text-sm",
          nameVisible: true
        };
      case "medium":
        return {
          width: "w-24",
          height: "h-32",
          iconSize: 36,
          fontSize: "text-base",
          nameVisible: true
        };
      case "large":
        return {
          width: "w-32",
          height: "h-44",
          iconSize: 48,
          fontSize: "text-lg",
          nameVisible: true
        };
      default:
        return {
          width: "w-24",
          height: "h-32",
          iconSize: 36,
          fontSize: "text-base",
          nameVisible: true
        };
    }
  };

  const { width, height, iconSize, fontSize, nameVisible } = getSizing();

  // Determine animation style class
  const getAnimationStyle = () => {
    switch (card.animationStyle) {
      case 'glow':
        return 'animate-pulse-subtle';
      case 'neon-blue':
        return 'animate-pulse-subtle border-neon-blue/50 bg-neon-blue/10';
      case 'neon-green':
        return 'animate-pulse-subtle border-neon-green/50 bg-neon-green/10';
      case 'neon-red':
        return 'animate-pulse-subtle border-neon-red/50 bg-neon-red/10';
      case 'neon-purple':
        return 'animate-pulse-subtle border-neon-purple/50 bg-neon-purple/10';
      case 'rainbow':
        return 'animate-rainbow-border';
      default:
        return '';
    }
  };
  
  return (
    <Card className={cn(
      "relative flex flex-col items-center justify-center border-2 bg-black/50 overflow-hidden",
      width,
      height,
      getAnimationStyle(),
      className
    )}>
      <div className="absolute inset-0 flex items-center justify-center">
        <CardIcon 
          name={card.iconName || 'default'} 
          size={iconSize} 
          className="opacity-80"
        />
      </div>
      
      {nameVisible && (
        <div className={cn(
          "absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center text-white",
          fontSize
        )}>
          {card.name}
        </div>
      )}
      
      {showDescription && card.description && (
        <div className="absolute inset-0 bg-black/90 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-2">
          <p className="text-xs text-center text-white">
            {card.description}
          </p>
        </div>
      )}
    </Card>
  );
};

export default CardDisplay;
