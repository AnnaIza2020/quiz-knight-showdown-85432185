
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface InfoBarProps {
  events: string[];
  maxEvents?: number;
  className?: string;
}

const InfoBar: React.FC<InfoBarProps> = ({
  events,
  maxEvents = 5,
  className
}) => {
  const [visibleEvent, setVisibleEvent] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  
  // Rotate through events
  useEffect(() => {
    if (events.length === 0) return;
    
    // Show first event immediately
    setVisibleEvent(events[0]);
    
    const interval = setInterval(() => {
      setIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % Math.min(events.length, maxEvents);
        setVisibleEvent(events[newIndex]);
        return newIndex;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [events, maxEvents]);
  
  if (!visibleEvent) return null;
  
  return (
    <div 
      className={cn(
        'absolute bottom-4 left-1/2 transform -translate-x-1/2',
        'px-6 py-2 rounded-full',
        'bg-black/70 border border-white/20',
        'max-w-2xl w-full text-center',
        'backdrop-blur-sm',
        'animate-fade-in',
        className
      )}
    >
      <p className="text-white truncate">
        {visibleEvent}
      </p>
    </div>
  );
};

export default InfoBar;
