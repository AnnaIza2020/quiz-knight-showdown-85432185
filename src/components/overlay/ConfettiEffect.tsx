
import React, { useState, useEffect, useRef } from 'react';
import ReactConfetti from 'react-confetti';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';

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
  const [showStars, setShowStars] = useState(false);
  const intensityTimer = useRef<NodeJS.Timeout | null>(null);
  const { playSound } = useGameContext();
  
  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      setIntensity(1);
      setShowStars(true);
      
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
        
        // Hide stars with slight delay
        setTimeout(() => {
          setShowStars(false);
        }, 2000);
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
  
  if (!showConfetti && !showStars) return null;
  
  // Calculate number of particles based on screen size and intensity
  const baseParticles = Math.min(500, windowDimension.width * windowDimension.height / 2000);
  const numberOfPieces = Math.floor(baseParticles * intensity);
  
  return (
    <>
      {/* Enhanced confetti effect with more colors and shapes */}
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        numberOfPieces={numberOfPieces}
        recycle={intensity > 0.3}
        tweenDuration={duration / 3}
        colors={[
          primaryColor, 
          secondaryColor, 
          '#ffffff', 
          '#ffff00', 
          '#ff00ff', 
          '#00ffff',
          '#ff8800',
          '#00ff88'
        ]}
        drawShape={ctx => {
          // Randomly choose between circle, square, and star shapes
          const shape = Math.floor(Math.random() * 3);
          
          if (shape === 0) {
            // Draw a circle
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, 2 * Math.PI);
            ctx.fill();
          } else if (shape === 1) {
            // Draw a square
            ctx.fillRect(-5, -5, 10, 10);
          } else {
            // Draw a star
            const spikes = 5;
            const outerRadius = 10;
            const innerRadius = 4;
            
            let rot = (Math.PI / 2) * 3;
            let x = 0;
            let y = 0;
            let step = Math.PI / spikes;

            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
              x = Math.cos(rot) * outerRadius;
              y = Math.sin(rot) * outerRadius;
              ctx.lineTo(x, y);
              rot += step;

              x = Math.cos(rot) * innerRadius;
              y = Math.sin(rot) * innerRadius;
              ctx.lineTo(x, y);
              rot += step;
            }
            ctx.closePath();
            ctx.fill();
          }
        }}
        gravity={0.1}
      />
      
      {/* Additional confetti blast from bottom for more dramatic effect */}
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height / 2}
        style={{ position: 'absolute', bottom: 0, left: 0 }}
        numberOfPieces={intensity > 0.5 ? Math.floor(numberOfPieces / 2) : 0}
        recycle={false}
        initialVelocityY={-15}
        tweenDuration={duration / 4}
        colors={['#ffff00', '#ff00ff', '#00ffff', primaryColor, '#ff8800', '#88ff00']}
        confettiSource={{
          x: windowDimension.width / 2,
          y: windowDimension.height,
          w: windowDimension.width / 1.5,
          h: 0
        }}
        gravity={0.15}
      />
      
      {/* Side confetti cannons for extra celebration */}
      <ReactConfetti
        width={windowDimension.width / 4}
        height={windowDimension.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
        numberOfPieces={intensity > 0.7 ? Math.floor(numberOfPieces / 4) : 0}
        recycle={false}
        initialVelocityX={10}
        initialVelocityY={0}
        tweenDuration={duration / 5}
        colors={[primaryColor, '#ffffff', '#ffff00']}
        confettiSource={{
          x: 0,
          y: windowDimension.height / 2,
          w: 0,
          h: windowDimension.height / 2
        }}
        gravity={0.2}
      />
      
      <ReactConfetti
        width={windowDimension.width / 4}
        height={windowDimension.height}
        style={{ position: 'absolute', top: 0, right: 0 }}
        numberOfPieces={intensity > 0.7 ? Math.floor(numberOfPieces / 4) : 0}
        recycle={false}
        initialVelocityX={-10}
        initialVelocityY={0}
        tweenDuration={duration / 5}
        colors={[secondaryColor, '#ffffff', '#00ffff']}
        confettiSource={{
          x: windowDimension.width,
          y: windowDimension.height / 2,
          w: 0,
          h: windowDimension.height / 2
        }}
        gravity={0.2}
      />
      
      {/* Animated stars in background */}
      {showStars && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {Array.from({ length: 30 }).map((_, i) => {
            const size = Math.random() * 40 + 10;
            const x = Math.random() * windowDimension.width;
            const y = Math.random() * windowDimension.height;
            const delay = Math.random() * 2;
            
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{ 
                  left: x, 
                  top: y, 
                  width: size,
                  height: size,
                  backgroundColor: i % 2 === 0 ? primaryColor : secondaryColor,
                  borderRadius: '50%',
                  filter: `blur(${size/4}px)`
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 3 + Math.random() * 2, 
                  repeat: Infinity,
                  delay: delay
                }}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default ConfettiEffect;
