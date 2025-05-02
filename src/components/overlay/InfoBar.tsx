
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InfoBarProps {
  events: string[];
  height?: number;
  opacity?: number;
  fontSize?: number;
  displayTime?: number;
}

const InfoBar = ({
  events,
  height = 50, // Changed from 80 to 50px
  opacity = 80,
  fontSize = 16, // Slightly reduced font size to fit better in smaller bar
  displayTime = 10
}: InfoBarProps) => {
  const [visibleEvents, setVisibleEvents] = useState<string[]>([]);
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);

  // Aktualizuj widoczne wydarzenia przy zmianie listy wydarzeń
  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[0];
      setVisibleEvents(prev => [latestEvent, ...prev].slice(0, 5));
    }
  }, [events]);

  // Rotacja wydarzeń co displayTime sekund
  useEffect(() => {
    if (visibleEvents.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % visibleEvents.length);
    }, displayTime * 1000);
    
    return () => clearInterval(interval);
  }, [visibleEvents, displayTime]);

  if (visibleEvents.length === 0) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-black"
      style={{ 
        height: `${height}px`, 
        backgroundColor: `rgba(0,0,0,${opacity / 100})`,
        backdropFilter: 'blur(4px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        zIndex: 50
      }}
    >
      <div className="h-full flex items-center px-4 overflow-hidden">
        <div className="bg-neon-purple px-4 py-2 h-full flex items-center mr-3">
          <span className="text-white font-bold" style={{ fontSize: `${fontSize}px` }}>
            WYDARZENIA
          </span>
        </div>
        
        <div className="flex-grow relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEventIndex}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute"
              style={{ fontSize: `${fontSize}px` }}
            >
              {visibleEvents[currentEventIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex gap-2 ml-3">
          {visibleEvents.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full",
                idx === currentEventIndex ? "bg-neon-purple" : "bg-white/30"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoBar;
