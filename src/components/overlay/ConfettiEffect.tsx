
import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiEffectProps {
  show: boolean;
  primaryColor: string;
  secondaryColor: string;
  duration?: number;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  show,
  primaryColor,
  secondaryColor,
  duration = 10000
}) => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      
      const timeout = setTimeout(() => {
        setShowConfetti(false);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [show, duration]);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (!showConfetti) return null;
  
  return (
    <ReactConfetti
      width={windowDimension.width}
      height={windowDimension.height}
      numberOfPieces={500}
      recycle={false}
      colors={[primaryColor, secondaryColor, '#ffffff', '#ffff00']}
    />
  );
};

export default ConfettiEffect;
