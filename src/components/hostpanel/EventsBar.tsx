
import React from 'react';
import { cn } from '@/lib/utils';

interface EventsBarProps {
  lastEvents: string[];
}

const EventsBar = ({ lastEvents }: EventsBarProps) => {
  return (
    <div className="mt-4 bg-black/70 backdrop-blur-md p-2 rounded-lg border border-white/10 overflow-hidden">
      <div className="flex items-center">
        <span className="text-neon-green font-bold mr-2">Ostatnie wydarzenia:</span>
        <div className="overflow-x-auto whitespace-nowrap">
          {lastEvents.map((event, index) => (
            <span 
              key={index} 
              className={cn(
                "inline-block mx-2 px-3 py-1 rounded-full text-sm",
                index === 0 ? "bg-neon-blue/30 text-white" : "bg-black/50 text-white/70"
              )}
            >
              {event}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsBar;
