
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { cn } from '@/lib/utils';

interface NeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLogo?: boolean;
}

const NeonLogo: React.FC<NeonLogoProps> = ({ size = 'md', className, showLogo = true }) => {
  const { gameLogo, primaryColor, secondaryColor } = useGameContext();
  
  // Określ rozmiar logo
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20'
  };
  
  // Sprawdzamy, czy pokazujemy domyślne logo z przesłanego obrazu
  if (showLogo) {
    return (
      <div className={cn('relative', className)}>
        <img 
          src="/lovable-uploads/0272188b-bb47-43fe-aff3-66734661c616.png"
          alt="Discord Game Show Logo" 
          className={cn(sizeClasses[size], 'object-contain')}
        />
      </div>
    );
  }
  
  // Jeśli mamy logo ustawione w kontekście, pokazujemy je
  if (gameLogo) {
    return (
      <div className={cn('relative', className)}>
        <img 
          src={gameLogo} 
          alt="Game Logo" 
          className={cn(sizeClasses[size], 'object-contain')}
        />
      </div>
    );
  }
  
  // W przeciwnym razie pokazujemy domyślne neonowe logo tekstowe
  const defaultTitle = "Discord Game Show";
  
  // Styl neonowego tekstu - wykorzystuje kolory z kontekstu gry
  const neonTextStyle = {
    textShadow: `
      0 0 5px ${primaryColor || '#ff00ff'},
      0 0 10px ${primaryColor || '#ff00ff'},
      0 0 20px ${primaryColor || '#ff00ff'},
      0 0 40px ${secondaryColor || '#00ffff'},
      0 0 80px ${secondaryColor || '#00ffff'}
    `,
    color: 'white'
  };
  
  const fontSizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  return (
    <div className={cn('relative flex items-center', className)}>
      <h1 
        className={cn('font-bold', fontSizeClasses[size])}
        style={neonTextStyle}
      >
        {defaultTitle}
      </h1>
    </div>
  );
};

export default NeonLogo;
