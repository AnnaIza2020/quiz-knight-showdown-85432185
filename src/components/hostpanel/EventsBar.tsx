
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EventsBarProps {
  lastEvents: string[];
  className?: string;
}

const EventsBar = ({ lastEvents, className }: EventsBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleEvents = isExpanded ? lastEvents : lastEvents.slice(0, 5);

  return (
    <div className={cn(
      "bg-black/70 backdrop-blur-md p-3 rounded-lg border border-white/10 overflow-hidden",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-neon-green font-bold">Ostatnie wydarzenia:</span>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} /> Zwiń
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Rozwiń wszystkie
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence>
          {visibleEvents.map((event, index) => (
            <motion.div 
              key={`${event}-${index}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={cn(
                  "px-3 py-2 rounded text-sm",
                  index === 0 ? "bg-neon-blue/30 text-white" : "bg-black/50 text-white/70"
                )}
              >
                {event}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {!isExpanded && lastEvents.length > 5 && (
          <div className="text-center text-xs text-white/50 mt-1">
            + {lastEvents.length - 5} więcej wydarzeń
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsBar;
