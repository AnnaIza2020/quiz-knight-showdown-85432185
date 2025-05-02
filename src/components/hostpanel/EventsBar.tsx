
import React from 'react';
import { cn } from "@/lib/utils";
import { Bell } from 'lucide-react';

interface EventsBarProps {
  lastEvents: string[];
  className?: string;
}

const EventsBar: React.FC<EventsBarProps> = ({ 
  lastEvents,
  className 
}) => {
  return (
    <div className={cn(
      "bg-black/50 backdrop-blur-md rounded-lg border border-white/10 p-4",
      className
    )}>
      <div className="flex items-center mb-2">
        <Bell className="w-4 h-4 mr-2 text-neon-yellow" />
        <h3 className="text-lg font-semibold text-white">Ostatnie wydarzenia</h3>
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
        {lastEvents.map((event, index) => (
          <div 
            key={index}
            className={cn(
              "px-3 py-2 rounded text-sm",
              index === 0
                ? "bg-neon-yellow/10 text-neon-yellow border-l-2 border-neon-yellow"
                : "bg-black/20 text-white/80"
            )}
          >
            {event}
          </div>
        ))}
        
        {lastEvents.length === 0 && (
          <div className="text-white/50 text-center py-2">
            Brak wydarzeń
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsBar;
