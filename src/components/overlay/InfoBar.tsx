
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoBarProps {
  events: string[];
}

const InfoBar: React.FC<InfoBarProps> = ({ events }) => {
  const [visibleEvent, setVisibleEvent] = useState<string | null>(null);
  const [eventIndex, setEventIndex] = useState(0);
  
  // Automatycznie zmieniaj wyświetlane wydarzenia
  useEffect(() => {
    if (events.length === 0) return;
    
    // Pokaż pierwsze wydarzenie na starcie
    setVisibleEvent(events[0]);
    
    // Ustal interwał rotacji wydarzeń
    const interval = setInterval(() => {
      setEventIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % events.length;
        setVisibleEvent(events[newIndex]);
        return newIndex;
      });
    }, 5000); // Zmiana co 5 sekund
    
    return () => clearInterval(interval);
  }, [events]);
  
  if (!visibleEvent) return null;
  
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <AnimatePresence mode="wait">
        <motion.div 
          key={visibleEvent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-black/50 backdrop-blur-md border border-white/10 rounded-md p-2 px-4"
        >
          <p className="text-white text-lg">{visibleEvent}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InfoBar;
