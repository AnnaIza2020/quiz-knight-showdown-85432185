
import React from 'react';

interface ConfettiEffectProps {
  primaryColor: string;
  secondaryColor: string;
  show: boolean;
}

const ConfettiEffect = ({ primaryColor, secondaryColor, show }: ConfettiEffectProps) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array(100).fill(0).map((_, i) => {
        const size = Math.random() * 12 + 5;
        const colors = [primaryColor, secondaryColor, '#9b00ff', '#ffff00', '#00ff66'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 3 + 2}s`;
        const animationDelay = `${Math.random() * 3}s`;
        
        return (
          <div 
            key={i}
            className="absolute top-0"
            style={{
              left,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              borderRadius: '2px',
              animation: 'confetti-drop',
              animationDuration,
              animationDelay,
              animationFillMode: 'both'
            }}
          />
        );
      })}
    </div>
  );
};

export default ConfettiEffect;
