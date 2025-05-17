
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEventNotificationProps {
  message: string | null;
  duration?: number; // Duration in ms
  onClose?: () => void;
}

const GameEventNotification: React.FC<GameEventNotificationProps> = ({ 
  message,
  duration = 5000,  // Default 5 seconds
  onClose
}) => {
  // Auto dismiss notification after duration
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (message && duration > 0) {
      timeoutId = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [message, duration, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          className="mb-6 p-4 bg-black/50 border border-white/20 rounded-lg text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Container component to aggregate and manage multiple notifications
export const NotificationManager: React.FC = () => {
  const [notifications, setNotifications] = useState<{id: string, message: string}[]>([]);
  
  // Global notification function 
  const addNotification = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Expose this globally
  useEffect(() => {
    (window as any).showGameNotification = addNotification;
    
    return () => {
      delete (window as any).showGameNotification;
    };
  }, []);
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      <AnimatePresence>
        {notifications.map(({ id, message }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-3 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg text-white"
          >
            {message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GameEventNotification;
