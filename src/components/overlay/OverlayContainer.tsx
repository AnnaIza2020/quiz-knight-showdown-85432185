
import React, { useRef } from 'react';
import { useFullscreen } from '@/hooks/useFullscreen';

interface OverlayContainerProps {
  children: React.ReactNode;
}

const OverlayContainer: React.FC<OverlayContainerProps> = ({ children }) => {
  // Refs for fullscreen and container
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen(containerRef);
  
  // Double-click handler for fullscreen
  const handleDoubleClick = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-neon-background overflow-hidden relative"
      onDoubleClick={handleDoubleClick}
    >
      {children}
      
      {/* Fullscreen instructions */}
      <div className="absolute bottom-2 right-2 text-white/30 text-xs">
        Double-click to toggle fullscreen
      </div>
    </div>
  );
};

export default OverlayContainer;
