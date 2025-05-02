
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  onDismiss: () => void;
  onStartGame: () => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onDismiss, onStartGame }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss();
    }, 300); // Wait for exit animation
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-black/80 backdrop-blur-md border border-neon-green/30 rounded-lg p-6 mb-8 relative"
        >
          <button 
            onClick={handleDismiss}
            className="absolute top-2 right-2 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
          
          <h3 className="text-neon-green text-xl mb-2 font-bold">Witaj w Discord Game Show Arena!</h3>
          
          <p className="text-white/80 mb-4">
            Panel hosta umożliwia zarządzanie graczami, pytaniami i przebiegiem całej rozgrywki.
            Rozpocznij od dodania graczy w sekcji "Przygotowanie do Gry", a następnie rozpocznij turniej.
          </p>
          
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={handleDismiss}>
              Zamknij
            </Button>
            <Button onClick={onStartGame} className="bg-neon-green text-black hover:bg-neon-green/80">
              Rozpocznij grę
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeMessage;
