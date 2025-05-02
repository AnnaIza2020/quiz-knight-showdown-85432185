
import React, { useState, useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import { useGameContext } from '@/context/GameContext';

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
  duration = 15000
}) => {
  const [windowDimension, setWindowDimension] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [intensity, setIntensity] = useState(1);
  const intensityTimer = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useGameContext();
  
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      setIntensity(1);
      
      // Play celebration sound
      playSound('victory');
      
      // Gradually reduce intensity over time
      intensityTimer.current = setInterval(() => {
        setIntensity(prev => {
          const newValue = prev - 0.05;
          return newValue > 0 ? newValue : 0;
        });
      }, 1000);
      
      const timeout = setTimeout(() => {
        if (intensityTimer.current) {
          clearInterval(intensityTimer.current);
        }
        setShowConfetti(false);
      }, duration);
      
      return () => {
        clearTimeout(timeout);
        if (intensityTimer.current) {
          clearInterval(intensityTimer.current);
        }
      };
    }
  }, [show, duration, playSound]);
  
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
  
  // Calculate number of particles based on screen size and intensity
  const baseParticles = Math.min(500, windowDimension.width * windowDimension.height / 2000);
  const numberOfPieces = Math.floor(baseParticles * intensity);
  
  return (
    <>
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        numberOfPieces={numberOfPieces}
        recycle={intensity > 0.3}
        tweenDuration={duration / 3}
        colors={[primaryColor, secondaryColor, '#ffffff', '#ffff00', '#ff00ff', '#00ffff']}
        gravity={0.1}
      />
      
      {/* Additional confetti blast from bottom for more dramatic effect */}
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height / 2}
        style={{ position: 'absolute', bottom: 0, left: 0 }}
        numberOfPieces={intensity > 0.5 ? Math.floor(numberOfPieces / 3) : 0}
        recycle={false}
        initialVelocityY={-10}
        tweenDuration={duration / 4}
        colors={['#ffff00', '#ff00ff', '#00ffff', primaryColor]}
        confettiSource={{
          x: windowDimension.width / 2,
          y: windowDimension.height,
          w: windowDimension.width / 2,
          h: 0
        }}
        gravity={0.15}
      />
    </>
  );
};

export default ConfettiEffect;
