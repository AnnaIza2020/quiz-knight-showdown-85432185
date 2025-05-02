
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import Confetti from 'react-confetti';
import useWindowSize from '@/hooks/useWindowSize';

interface ConfettiEffectProps {
  show: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ 
  show, 
  primaryColor: propsPrimaryColor, 
  secondaryColor: propsSecondaryColor 
}) => {
  const { primaryColor: contextPrimaryColor, secondaryColor: contextSecondaryColor } = useGameContext();
  const { width, height } = useWindowSize();
  const [isActive, setIsActive] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(200);
  
  // Use props colors if provided, otherwise use context colors
  const primaryColor = propsPrimaryColor || contextPrimaryColor || '#ff00ff';
  const secondaryColor = propsSecondaryColor || contextSecondaryColor || '#00ffff';
  
  useEffect(() => {
    if (show) {
      setIsActive(true);
      // Gradually reduce the number of confetti pieces
      const timer = setTimeout(() => {
        setConfettiPieces(50); // reduce confetti after 5 seconds
        
        // Stop confetti after 10 seconds
        const stopTimer = setTimeout(() => {
          setConfettiPieces(0);
          setTimeout(() => setIsActive(false), 2000); // Allow remaining pieces to fall
        }, 5000);
        
        return () => clearTimeout(stopTimer);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setIsActive(false);
    }
  }, [show]);
  
  if (!isActive) return null;
  
  return (
    <Confetti
      width={width}
      height={height}
      numberOfPieces={confettiPieces}
      recycle={false}
      colors={[
        primaryColor,
        secondaryColor,
        '#ffffff',
        '#ffff00',
        '#00ffff',
      ]}
    />
  );
};

export default ConfettiEffect;
