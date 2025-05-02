import React from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface NeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NeonLogo: React.FC<NeonLogoProps> = ({
  size = 'md',
  className
}) => {
  const { gameLogo, primaryColor, secondaryColor } = useGameContext();
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  // If logo URL is provided, render image
  if (gameLogo) {
    return (
      <div className={cn(
        'flex items-center justify-center',
        className
      )}>
        <img 
          src={gameLogo} 
          alt="Game Show Logo" 
          className={cn(
            'max-h-24',
            size === 'sm' ? 'max-h-12' : size === 'lg' ? 'max-h-32' : 'max-h-24'
          )} 
        />
      </div>
    );
  }
  
  // Otherwise render the new logo
  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      <img 
        src="/lovable-uploads/61b1b24f-4a7b-43f7-836c-2dae94d40d5e.png"
        alt="Discord Game Show" 
        className={cn(
          'max-h-24',
          size === 'sm' ? 'max-h-12' : size === 'lg' ? 'max-h-32' : 'max-h-24'
        )}
      />
    </div>
  );
};

export default NeonLogo;
